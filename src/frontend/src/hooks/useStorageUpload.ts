import { loadConfig } from "@caffeineai/core-infrastructure";
import { useState } from "react";
import { convertToWebP } from "../utils/webpConverter";

// ── Types ────────────────────────────────────────────────────────
export type UploadResult = {
  url: string;
  originalKB: number;
  webpKB: number;
  savedPercent: number;
  wasConverted: boolean;
};

// ── Constants ────────────────────────────────────────────────────
const SHA256_PREFIX = "sha256:";
const GATEWAY_VERSION = "v1";
const CHUNK_SIZE = 1024 * 1024; // 1 MB
const MAX_CONCURRENT_UPLOADS = 10;
const MAX_RETRIES = 3;

// ── SHA-256 / Merkle helpers (mirrors StorageClient.js exactly) ──
const DOMAIN_CHUNK = new TextEncoder().encode("icfs-chunk/");
const DOMAIN_META = new TextEncoder().encode("icfs-metadata/");
const DOMAIN_NODES = new TextEncoder().encode("ynode/");

async function sha256(data: Uint8Array): Promise<Uint8Array> {
  const buf = await crypto.subtle.digest("SHA-256", data.buffer as ArrayBuffer);
  return new Uint8Array(buf);
}

function concat(...arrays: Uint8Array[]): Uint8Array {
  const total = arrays.reduce((s, a) => s + a.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const a of arrays) {
    out.set(a, offset);
    offset += a.length;
  }
  return out;
}

async function hashChunk(data: Uint8Array): Promise<Uint8Array> {
  return sha256(concat(DOMAIN_CHUNK, data));
}

async function hashNodes(
  left: Uint8Array,
  right: Uint8Array | null,
): Promise<Uint8Array> {
  const rightBytes = right ?? new TextEncoder().encode("UNBALANCED");
  return sha256(concat(DOMAIN_NODES, left, rightBytes));
}

async function hashHeaders(
  headers: Record<string, string>,
): Promise<Uint8Array> {
  const lines = Object.entries(headers)
    .map(([k, v]) => `${k.trim()}: ${v.trim()}\n`)
    .sort();
  const encoded = new TextEncoder().encode(lines.join(""));
  return sha256(concat(DOMAIN_META, encoded));
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function toShaString(bytes: Uint8Array): string {
  return `${SHA256_PREFIX}${toHex(bytes)}`;
}

type TreeNode = {
  hash: Uint8Array;
  left: TreeNode | null;
  right: TreeNode | null;
};

function nodeToJSON(node: TreeNode | null): unknown {
  if (!node) return null;
  return {
    hash: toShaString(node.hash),
    left: nodeToJSON(node.left),
    right: nodeToJSON(node.right),
  };
}

async function buildBlobTree(
  chunkHashes: Uint8Array[],
  fileHeaders: Record<string, string>,
): Promise<{ rootHash: Uint8Array; treeJSON: unknown }> {
  let level: TreeNode[] = chunkHashes.map((h) => ({
    hash: h,
    left: null,
    right: null,
  }));

  // Empty file sentinel — matches StorageClient.js exactly
  if (level.length === 0) {
    const hex =
      "8b8e620f084e48da0be2287fd12c5aaa4dbe14b468fd2e360f48d741fe7628a0";
    const sentinelBytes = new TextEncoder().encode(hex);
    level = [{ hash: sentinelBytes, left: null, right: null }];
  }

  // Build Merkle tree bottom-up
  while (level.length > 1) {
    const next: TreeNode[] = [];
    for (let i = 0; i < level.length; i += 2) {
      const l = level[i];
      const r = level[i + 1] ?? null;
      const ph = await hashNodes(l.hash, r ? r.hash : null);
      next.push({ hash: ph, left: l, right: r });
    }
    level = next;
  }

  const chunksRoot = level[0];

  // Combine chunks root with metadata hash (matching StorageClient.js behavior)
  if (fileHeaders && Object.keys(fileHeaders).length > 0) {
    const metaHash = await hashHeaders(fileHeaders);
    const metaRoot: TreeNode = { hash: metaHash, left: null, right: null };
    const combinedHash = await hashNodes(chunksRoot.hash, metaHash);
    const combinedRoot: TreeNode = {
      hash: combinedHash,
      left: chunksRoot,
      right: metaRoot,
    };

    const headerLines = Object.entries(fileHeaders)
      .map(([k, v]) => `${k.trim()}: ${v.trim()}`)
      .sort();

    return {
      rootHash: combinedRoot.hash,
      treeJSON: {
        tree_type: "DSBMTWH",
        chunk_hashes: chunkHashes.map(toShaString),
        tree: nodeToJSON(combinedRoot),
        headers: headerLines,
      },
    };
  }

  return {
    rootHash: chunksRoot.hash,
    treeJSON: {
      tree_type: "DSBMTWH",
      chunk_hashes: chunkHashes.map(toShaString),
      tree: nodeToJSON(chunksRoot),
      headers: [],
    },
  };
}

// ── Certificate from backend canister ────────────────────────────
// Mirrors StorageClient.getCertificate() — calls _immutableObjectStorageCreateCertificate
// and extracts certificate bytes from the ICP v3 sync response body.
async function getCertificate(
  backendCanisterId: string,
  backendHost: string | undefined,
  blobHashStr: string,
): Promise<Uint8Array> {
  const { HttpAgent } = await import("@icp-sdk/core/agent");
  const { IDL } = await import("@icp-sdk/core/candid");

  const agent = new HttpAgent({ host: backendHost });
  if (backendHost?.includes("localhost")) {
    await agent.fetchRootKey().catch(() => null);
  }

  const certArgs = IDL.encode([IDL.Text], [blobHashStr]);
  const certResult = await agent.call(backendCanisterId, {
    methodName: "_immutableObjectStorageCreateCertificate",
    arg: certArgs,
  });

  // The ICP v3 sync response body contains a `certificate` field as Uint8Array.
  // This mirrors the isV3ResponseBody check in StorageClient.js.
  const body = certResult.response?.body;
  if (body && typeof body === "object" && "certificate" in body) {
    const cert = (body as { certificate: unknown }).certificate;
    if (cert instanceof Uint8Array) return cert;
    if (Array.isArray(cert)) return new Uint8Array(cert as number[]);
  }

  throw new Error(
    "Certificate not found in canister response — object-storage not configured on this canister",
  );
}

// ── Retry helper ─────────────────────────────────────────────────
async function withRetry<T>(
  operation: () => Promise<T>,
  label: string,
): Promise<T> {
  let lastErr: Error = new Error("Unknown error");
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await operation();
    } catch (err) {
      lastErr = err instanceof Error ? err : new Error(String(err));
      // Don't retry 4xx client errors (except 408/429)
      const status = (err as { response?: { status?: number } }).response
        ?.status;
      if (
        status &&
        status >= 400 &&
        status < 500 &&
        status !== 408 &&
        status !== 429
      ) {
        throw lastErr;
      }
      if (attempt < MAX_RETRIES) {
        const delay = Math.min(
          1000 * 2 ** attempt + Math.random() * 500,
          15000,
        );
        console.warn(
          `[${label}] attempt ${attempt + 1} failed: ${lastErr.message}. Retrying in ${Math.round(delay)}ms…`,
        );
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }
  throw lastErr;
}

// ── Core upload function ──────────────────────────────────────────
async function uploadBlobToStorage(
  fileBytes: Uint8Array,
  onProgress?: (pct: number) => void,
): Promise<string> {
  const config = await loadConfig();
  const { storage_gateway_url, bucket_name, project_id, backend_canister_id } =
    config;

  if (
    !storage_gateway_url ||
    storage_gateway_url === "nogateway" ||
    !project_id ||
    project_id === "0000000-0000-0000-0000-00000000000"
  ) {
    throw new Error(
      "Object storage not configured. Please deploy the app to production first.",
    );
  }

  // ── Step 1: Chunk file ─────────────────────────────────────────
  const chunks: Uint8Array[] = [];
  for (let i = 0; i < fileBytes.length; i += CHUNK_SIZE) {
    chunks.push(fileBytes.slice(i, i + CHUNK_SIZE));
  }
  if (chunks.length === 0) chunks.push(new Uint8Array(0));

  // ── Step 2: Hash chunks ────────────────────────────────────────
  const chunkHashes = await Promise.all(chunks.map(hashChunk));

  // ── Step 3: Build blob tree ────────────────────────────────────
  const fileHeaders: Record<string, string> = {
    "Content-Type": "application/octet-stream",
    "Content-Length": fileBytes.length.toString(),
  };
  const { rootHash, treeJSON } = await buildBlobTree(chunkHashes, fileHeaders);
  const rootHashStr = toShaString(rootHash);

  // ── Step 4: Get upload certificate from backend (REQUIRED) ─────
  // Without this certificate, the gateway returns 405. Never skip.
  const certificateBytes = await getCertificate(
    backend_canister_id,
    config.backend_host,
    rootHashStr,
  );

  // ── Step 5: PUT blob-tree to storage gateway ───────────────────
  const blobTreeUrl = `${storage_gateway_url}/${GATEWAY_VERSION}/blob-tree/`;
  await withRetry(async () => {
    const resp = await fetch(blobTreeUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Caffeine-Project-ID": project_id,
      },
      body: JSON.stringify({
        blob_tree: treeJSON,
        bucket_name,
        num_blob_bytes: fileBytes.length,
        owner: backend_canister_id,
        project_id,
        headers: (treeJSON as { headers: string[] }).headers,
        auth: {
          OwnerEgressSignature: Array.from(certificateBytes),
        },
      }),
    });
    if (!resp.ok) {
      const text = await resp.text().catch(() => resp.statusText);
      const err = new Error(
        `blob-tree upload failed (${resp.status}): ${text}`,
      );
      (err as { response?: { status: number } }).response = {
        status: resp.status,
      };
      throw err;
    }
  }, "blob-tree");

  // ── Step 6: PUT chunks in parallel (capped at MAX_CONCURRENT_UPLOADS) ─
  let completed = 0;

  const uploadChunk = async (index: number) => {
    const chunkHashStr = toShaString(chunkHashes[index]);
    const params = new URLSearchParams({
      owner_id: backend_canister_id,
      blob_hash: rootHashStr,
      chunk_hash: chunkHashStr,
      chunk_index: index.toString(),
      bucket_name,
      project_id,
    });
    const chunkUrl = `${storage_gateway_url}/${GATEWAY_VERSION}/chunk/?${params.toString()}`;

    await withRetry(async () => {
      const resp = await fetch(chunkUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/octet-stream",
          "X-Caffeine-Project-ID": project_id,
        },
        body: chunks[index].buffer as ArrayBuffer,
      });
      if (!resp.ok) {
        const text = await resp.text().catch(() => resp.statusText);
        const err = new Error(
          `chunk ${index} upload failed (${resp.status}): ${text}`,
        );
        (err as { response?: { status: number } }).response = {
          status: resp.status,
        };
        throw err;
      }
    }, `chunk-${index}`);

    completed++;
    onProgress?.(Math.round((completed / chunks.length) * 100));
  };

  // Worker pool: MAX_CONCURRENT_UPLOADS workers, each takes the next available chunk
  await Promise.all(
    Array.from(
      { length: Math.min(MAX_CONCURRENT_UPLOADS, chunks.length) },
      async (_, workerId) => {
        for (let i = workerId; i < chunks.length; i += MAX_CONCURRENT_UPLOADS) {
          await uploadChunk(i);
        }
      },
    ),
  );

  // ── Step 7: Return direct URL ──────────────────────────────────
  return (
    `${storage_gateway_url}/${GATEWAY_VERSION}/blob/` +
    `?blob_hash=${encodeURIComponent(rootHashStr)}` +
    `&owner_id=${encodeURIComponent(backend_canister_id)}` +
    `&project_id=${encodeURIComponent(project_id)}`
  );
}

// ── Hook ──────────────────────────────────────────────────────────
export function useStorageUpload() {
  const [uploading, setUploading] = useState(false);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadFile = async (file: File): Promise<string> => {
    setUploading(true);
    setConverting(false);
    setProgress(0);
    setUploadError(null);

    try {
      let fileToUpload = file;
      if (file.type.startsWith("image/") && file.type !== "image/webp") {
        setConverting(true);
        fileToUpload = await convertToWebP(file);
        setConverting(false);
      }
      const bytes = new Uint8Array(await fileToUpload.arrayBuffer());
      const url = await uploadBlobToStorage(bytes, setProgress);
      setProgress(100);
      return url;
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Upload failed — check your connection";
      setUploadError(msg);
      console.error("[useStorageUpload] Upload failed:", err);
      throw new Error(msg);
    } finally {
      setUploading(false);
      setConverting(false);
    }
  };

  const uploadFileDetailed = async (file: File): Promise<UploadResult> => {
    setUploading(true);
    setConverting(false);
    setProgress(0);
    setUploadError(null);

    try {
      const originalKB = file.size / 1024;
      let fileToUpload = file;
      let wasConverted = false;

      if (file.type.startsWith("image/") && file.type !== "image/webp") {
        setConverting(true);
        fileToUpload = await convertToWebP(file);
        setConverting(false);
        wasConverted = fileToUpload !== file;
      }

      const webpKB = fileToUpload.size / 1024;
      const savedPercent =
        originalKB > 0
          ? Math.max(0, ((originalKB - webpKB) / originalKB) * 100)
          : 0;

      const bytes = new Uint8Array(await fileToUpload.arrayBuffer());
      const url = await uploadBlobToStorage(bytes, (pct) => {
        setProgress(pct);
      });
      setProgress(100);

      if (wasConverted) {
        console.log(
          `[webpConverter] ${file.name}: ${originalKB.toFixed(1)}KB → ${webpKB.toFixed(1)}KB (${(((originalKB - webpKB) / originalKB) * 100).toFixed(1)}% saved)`,
        );
      }

      return { url, originalKB, webpKB, savedPercent, wasConverted };
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Upload failed — check your connection";
      setUploadError(msg);
      console.error("[useStorageUpload] Upload failed:", err);
      throw new Error(msg);
    } finally {
      setUploading(false);
      setConverting(false);
    }
  };

  return {
    uploadFile,
    uploadFileDetailed,
    uploading,
    converting,
    progress,
    uploadError,
  };
}
