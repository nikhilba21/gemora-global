// Cache OCR results to prevent re-scanning the same image URL multiple times
const ocrCache = new Map<string, string>();

/**
 * Dynamically loads Tesseract.js from CDN to avoid Rollup bundler resolution issues on Vercel
 */
async function getTesseract(): Promise<any> {
  if (typeof window === "undefined") return null;
  if ((window as any).Tesseract) {
    return (window as any).Tesseract;
  }
  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[src*="tesseract.min.js"]');
    if (existing) {
      existing.addEventListener("load", () => resolve((window as any).Tesseract));
      existing.addEventListener("error", reject);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";
    script.async = true;
    script.onload = () => resolve((window as any).Tesseract);
    script.onerror = () => reject(new Error("Failed to load Tesseract CDN script"));
    document.head.appendChild(script);
  });
}

/**
 * Scans the top-right corner of an image URL using Tesseract OCR
 * to extract the watermarked item code (e.g. Rj-37 -> 37 or RJ-37).
 */
export async function scanImageCode(imageUrl: string): Promise<string | null> {
  if (!imageUrl || typeof window === "undefined") return null;

  if (ocrCache.has(imageUrl)) {
    return ocrCache.get(imageUrl) || null;
  }

  try {
    const Tesseract = await getTesseract();
    if (!Tesseract) return null;

    // 1. Create an offscreen image and canvas
    const img = new Image();
    img.crossOrigin = "anonymous";

    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => reject(new Error("Failed to load image for OCR"));
      img.src = imageUrl;
    });

    // 2. Crop top-right corner where watermarks (e.g. Rj-37) are located
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const cropWidth = Math.floor(img.width * 0.4); // top right 40% width
    const cropHeight = Math.floor(img.height * 0.25); // top 25% height
    const startX = img.width - cropWidth;
    const startY = 0;

    canvas.width = cropWidth;
    canvas.height = cropHeight;

    ctx.drawImage(img, startX, startY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

    const croppedDataUrl = canvas.toDataURL("image/png");

    // 3. Run Tesseract worker
    const worker = await Tesseract.createWorker("eng");
    const ret = await worker.recognize(croppedDataUrl);
    await worker.terminate();

    const recognizedText = ret.data.text || "";

    // 4. Extract code using regex match e.g. Rj-37, RJ37, 37
    const match = recognizedText.match(/(?:RJ|Rj|N)?[- ]?([0-9]{1,4})/i);
    if (match && match[1]) {
      const codeNum = match[1];
      const resultCode = `RJ-${codeNum}`;
      ocrCache.set(imageUrl, resultCode);
      return resultCode;
    }
  } catch (err) {
    console.warn("OCR scan skipped or failed:", err);
  }

  return null;
}
