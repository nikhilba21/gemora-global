import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  FileJson,
  FileSpreadsheet,
  ImageOff,
  Loader2,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import AdminLayout from "../../components/AdminLayout";
import { useActor } from "../../hooks/useActor";
import { useStorageUpload } from "../../hooks/useStorageUpload";
import type { Category, Product } from "../../types";

type WebPBadgeInfo = {
  originalKB: number;
  webpKB: number;
  savedPercent: number;
};

type ProductForm = {
  categoryId: string;
  name: string;
  sku: string;
  subcategory: string;
  color: string;
  keyFeatures: string;
  description: string;
  moq: string;
  imageUrls: string[];
  imageWebPInfo: Record<string, WebPBadgeInfo>;
  featured: boolean;
  isNewArrival: boolean;
};

const EMPTY: ProductForm = {
  categoryId: "",
  name: "",
  sku: "",
  subcategory: "",
  color: "",
  keyFeatures: "",
  description: "",
  moq: "",
  imageUrls: [],
  imageWebPInfo: {},
  featured: false,
  isNewArrival: false,
};

const CSV_TEMPLATE =
  "Sku,Product_name,Category,Subcategory,Color,Key_features,Description,Image\nGG-NK-001,Kundan Bridal Necklace Set,Bridal Jewellery,Necklace Sets,Gold,Anti-tarnish gold plated|Kundan stones,Stunning kundan bridal necklace with matching earrings,";

function WebPBadge({ info }: { info?: WebPBadgeInfo }) {
  if (!info) return null;
  return (
    <span
      className="absolute bottom-0 left-0 right-0 text-center text-[9px] font-bold rounded-b"
      style={{
        background: "rgba(46,125,50,0.85)",
        color: "#fff",
        padding: "2px 0",
      }}
      title={`WebP: ${info.webpKB.toFixed(0)}KB (${info.savedPercent.toFixed(0)}% smaller)`}
    >
      WebP ✓
    </span>
  );
}

export default function AdminProducts() {
  const { actor } = useActor();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [csvOpen, setCsvOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(EMPTY);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);
  const { uploadFileDetailed, uploading, converting, progress, uploadError } =
    useStorageUpload();

  const [csvImporting, setCsvImporting] = useState(false);
  const [csvProgress, setCsvProgress] = useState({ current: 0, total: 0 });
  const [jsonOpen, setJsonOpen] = useState(false);
  const [jsonImporting, setJsonImporting] = useState(false);
  const [jsonProgress, setJsonProgress] = useState({ current: 0, total: 0 });
  const jsonInputRef = useRef<HTMLInputElement>(null);

  // ── Bulk selection state ───────────────────────────────────────
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
  const [bulkActioning, setBulkActioning] = useState(false);

  const { data: products } = useQuery<Product[]>({
    queryKey: ["products", null],
    queryFn: () => actor!.getProducts(null),
    enabled: true,
  });
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => actor!.getCategories(),
    enabled: true,
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["products"] });

  // ── Bulk selection helpers ─────────────────────────────────────
  const productList = products ?? [];
  const allIds = productList.map((p) => String(p.id));
  const allSelected =
    allIds.length > 0 && allIds.every((id) => selectedIds.has(id));
  const someSelected = selectedIds.size > 0;

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(allIds));
    }
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkActivate = async () => {
    if (!actor || selectedIds.size === 0) return;
    setBulkActioning(true);
    const selected = productList.filter((p) => selectedIds.has(String(p.id)));
    let ok = 0;
    for (const p of selected) {
      try {
        await actor.updateProduct(
          p.id,
          p.categoryId,
          p.name,
          p.description,
          p.moq,
          p.imageUrls,
          true,
          p.isNewArrival,
          p.sku ?? null,
          p.subcategory ?? null,
          p.color ?? null,
          p.keyFeatures ?? null,
        );
        ok++;
      } catch {
        // continue on error
      }
    }
    setBulkActioning(false);
    setSelectedIds(new Set());
    invalidate();
    toast.success(`${ok} product${ok !== 1 ? "s" : ""} activated`);
  };

  const handleBulkDeactivate = async () => {
    if (!actor || selectedIds.size === 0) return;
    setBulkActioning(true);
    const selected = productList.filter((p) => selectedIds.has(String(p.id)));
    let ok = 0;
    for (const p of selected) {
      try {
        await actor.updateProduct(
          p.id,
          p.categoryId,
          p.name,
          p.description,
          p.moq,
          p.imageUrls,
          false,
          p.isNewArrival,
          p.sku ?? null,
          p.subcategory ?? null,
          p.color ?? null,
          p.keyFeatures ?? null,
        );
        ok++;
      } catch {
        // continue on error
      }
    }
    setBulkActioning(false);
    setSelectedIds(new Set());
    invalidate();
    toast.success(`${ok} product${ok !== 1 ? "s" : ""} deactivated`);
  };

  const handleBulkDelete = async () => {
    if (!actor || selectedIds.size === 0) return;
    setBulkActioning(true);
    const idsToDelete = [...selectedIds];
    let ok = 0;
    for (const id of idsToDelete) {
      try {
        await actor.deleteProduct(BigInt(id));
        ok++;
      } catch {
        // continue on error
      }
    }
    setBulkActioning(false);
    setSelectedIds(new Set());
    setBulkDeleteConfirm(false);
    invalidate();
    toast.success(`${ok} product${ok !== 1 ? "s" : ""} deleted`);
  };

  const createMutation = useMutation({
    mutationFn: () =>
      actor!.createProduct(
        BigInt(form.categoryId || "0"),
        form.name,
        form.description,
        form.moq,
        form.imageUrls,
        form.featured,
        form.isNewArrival,
        form.sku || null,
        form.subcategory || null,
        form.color || null,
        form.keyFeatures || null,
      ),
    onSuccess: () => {
      toast.success("Product created");
      setOpen(false);
      invalidate();
    },
    onError: () => toast.error("Failed to create product"),
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      actor!.updateProduct(
        editing!.id,
        BigInt(form.categoryId || "0"),
        form.name,
        form.description,
        form.moq,
        form.imageUrls,
        form.featured,
        form.isNewArrival,
        form.sku || null,
        form.subcategory || null,
        form.color || null,
        form.keyFeatures || null,
      ),
    onSuccess: () => {
      toast.success("Product updated");
      setOpen(false);
      invalidate();
    },
    onError: () => toast.error("Failed to update product"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: bigint) => actor!.deleteProduct(id),
    onSuccess: () => {
      toast.success("Product deleted");
      invalidate();
    },
    onError: () => toast.error("Failed to delete product"),
  });

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    setOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      categoryId: String(p.categoryId),
      name: p.name,
      sku: p.sku ?? "",
      subcategory: p.subcategory ?? "",
      color: p.color ?? "",
      keyFeatures: p.keyFeatures ?? "",
      description: p.description,
      moq: p.moq,
      imageUrls: p.imageUrls,
      imageWebPInfo: {},
      featured: p.featured,
      isNewArrival: p.isNewArrival,
    });
    setOpen(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    for (const file of files) {
      try {
        const result = await uploadFileDetailed(file);
        setForm((f) => ({
          ...f,
          imageUrls: [...f.imageUrls, result.url],
          imageWebPInfo: {
            ...f.imageWebPInfo,
            [result.url]: {
              originalKB: result.originalKB,
              webpKB: result.webpKB,
              savedPercent: result.savedPercent,
            },
          },
        }));
      } catch {
        toast.error(
          "Upload failed — please check your internet connection and try again",
        );
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDropUpload = async (droppedFiles: File[]) => {
    for (const file of droppedFiles) {
      try {
        const result = await uploadFileDetailed(file);
        setForm((f) => ({
          ...f,
          imageUrls: [...f.imageUrls, result.url],
          imageWebPInfo: {
            ...f.imageWebPInfo,
            [result.url]: {
              originalKB: result.originalKB,
              webpKB: result.webpKB,
              savedPercent: result.savedPercent,
            },
          },
        }));
      } catch {
        toast.error(
          "Upload failed — please check your internet connection and try again",
        );
      }
    }
  };

  const removeUploadedUrl = (idx: number) => {
    setForm((f) => ({
      ...f,
      imageUrls: f.imageUrls.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editing ? updateMutation.mutate() : createMutation.mutate();
  };

  const downloadCsvTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gemora_products_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // CSV parser that handles quoted fields with commas
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let inQuotes = false;
    let current = "";
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
    result.push(current.trim());
    return result;
  };

  // Helper: get or create category by name, returns its ID
  const getOrCreateCategoryId = async (
    catName: string,
    catLookup: Record<string, bigint>,
  ): Promise<bigint> => {
    if (!catName) return BigInt(0);
    const key = catName.toLowerCase().trim();
    if (catLookup[key] !== undefined) return catLookup[key];
    // Create it
    try {
      const newId = await actor!.createCategory(
        catName.trim(),
        "",
        "",
        BigInt(Object.keys(catLookup).length + 1),
      );
      catLookup[key] = newId;
      // Invalidate categories cache so the new ones show up
      qc.invalidateQueries({ queryKey: ["categories"] });
      return newId;
    } catch {
      return BigInt(0);
    }
  };

  const handleCsvImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!actor) return;
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const lines = text.split("\n").filter((l) => l.trim());
    if (lines.length < 2) {
      toast.error("CSV has no data rows");
      return;
    }

    // Parse header to find column indices
    const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase());
    const colIdx = {
      sku: headers.findIndex((h) => h === "sku"),
      name: headers.findIndex((h) => h === "product_name" || h === "name"),
      category: headers.findIndex((h) => h === "category"),
      subcategory: headers.findIndex((h) => h === "subcategory"),
      color: headers.findIndex((h) => h === "color"),
      keyFeatures: headers.findIndex(
        (h) => h === "key_features" || h === "keyfeatures",
      ),
      description: headers.findIndex((h) => h === "description"),
      image: headers.findIndex((h) => h === "image" || h === "imageurl"),
      moq: headers.findIndex((h) => h === "moq"),
      featured: headers.findIndex((h) => h === "featured"),
    };

    // Validate required columns
    if (colIdx.name < 0) {
      toast.error("CSV must have a 'Product_name' column");
      return;
    }

    const dataLines = lines.slice(1);
    setCsvImporting(true);
    setCsvProgress({ current: 0, total: dataLines.length });
    let successCount = 0;
    let failCount = 0;

    // Build category name→id lookup
    const catLookup: Record<string, bigint> = {};
    if (categories) {
      for (const cat of categories) {
        catLookup[cat.name.toLowerCase().trim()] = cat.id;
      }
    }

    for (let i = 0; i < dataLines.length; i++) {
      setCsvProgress({ current: i + 1, total: dataLines.length });
      const cols = parseCSVLine(dataLines[i]);

      const name = colIdx.name >= 0 ? (cols[colIdx.name] ?? "") : "";
      if (!name) {
        failCount++;
        continue;
      }

      const categoryName =
        colIdx.category >= 0 ? (cols[colIdx.category] ?? "") : "";
      const description =
        colIdx.description >= 0 ? (cols[colIdx.description] ?? "") : "";
      const moq = colIdx.moq >= 0 ? (cols[colIdx.moq] ?? "") : "";
      const imageUrl = colIdx.image >= 0 ? (cols[colIdx.image] ?? "") : "";
      const featuredStr =
        colIdx.featured >= 0 ? (cols[colIdx.featured] ?? "") : "";

      // Find or auto-create category if not in lookup
      const categoryId = await getOrCreateCategoryId(categoryName, catLookup);

      const sku = colIdx.sku >= 0 ? (cols[colIdx.sku] ?? "") : "";
      const subcategory =
        colIdx.subcategory >= 0 ? (cols[colIdx.subcategory] ?? "") : "";
      const color = colIdx.color >= 0 ? (cols[colIdx.color] ?? "") : "";
      const keyFeatures =
        colIdx.keyFeatures >= 0 ? (cols[colIdx.keyFeatures] ?? "") : "";

      try {
        await actor.createProduct(
          categoryId,
          name,
          description,
          moq,
          imageUrl ? [imageUrl] : [],
          featuredStr.toLowerCase() === "true",
          false,
          sku || null,
          subcategory || null,
          color || null,
          keyFeatures || null,
        );
        successCount++;
      } catch {
        failCount++;
      }
    }

    setCsvImporting(false);
    setCsvProgress({ current: 0, total: 0 });
    if (csvInputRef.current) csvInputRef.current.value = "";
    invalidate();
    if (failCount === 0) {
      toast.success(
        `${successCount} product${successCount !== 1 ? "s" : ""} imported`,
      );
    } else {
      toast.success(`${successCount} imported, ${failCount} failed/skipped`);
    }
    setCsvOpen(false);
  };

  // JSON import handler — supports the Kanhai-style product JSON format
  type KanhaiProduct = {
    sku?: string;
    product_name?: string;
    name?: string;
    category?: string;
    subcategory?: string;
    color?: string;
    key_features?: string[] | string;
    description?: string;
    images?: string[];
    price?: string;
    min_order?: string;
    moq?: string;
  };

  const handleJsonImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!actor) return;
    const file = e.target.files?.[0];
    if (!file) return;
    let products: KanhaiProduct[] = [];
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      products = Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      toast.error("Invalid JSON file — please check the format");
      return;
    }
    if (!products.length) {
      toast.error("No products found in JSON file");
      return;
    }

    // Build category name→id lookup
    const catLookup: Record<string, bigint> = {};
    if (categories) {
      for (const cat of categories) {
        catLookup[cat.name.toLowerCase().trim()] = cat.id;
      }
    }

    setJsonImporting(true);
    setJsonProgress({ current: 0, total: products.length });
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < products.length; i++) {
      setJsonProgress({ current: i + 1, total: products.length });
      const p = products[i];
      const name = p.product_name ?? p.name ?? "";
      if (!name) {
        failCount++;
        continue;
      }

      const catName = p.category ?? "";
      // Find or auto-create category if not in lookup
      const categoryId = await getOrCreateCategoryId(catName, catLookup);

      const keyFeatures = Array.isArray(p.key_features)
        ? p.key_features.join(" | ")
        : (p.key_features ?? "");

      const description = [p.description ?? "", keyFeatures]
        .filter(Boolean)
        .join("\n\n");

      // Use 3rd image (index 2) which is typically the product image, not logo
      const imageUrls: string[] = [];
      if (p.images && p.images.length > 2) {
        const productImg = p.images[2];
        if (
          productImg &&
          !productImg.includes("Logo") &&
          !productImg.includes("userIcon")
        ) {
          imageUrls.push(productImg);
        }
      } else if (p.images?.[0]) {
        imageUrls.push(p.images[0]);
      }

      const moq = p.min_order ?? p.moq ?? p.price ?? "";

      try {
        await actor.createProduct(
          categoryId,
          name,
          description,
          moq,
          imageUrls,
          false,
          false,
          p.sku || null,
          p.subcategory || null,
          p.color || null,
          keyFeatures || null,
        );
        successCount++;
      } catch {
        failCount++;
      }
    }

    setJsonImporting(false);
    setJsonProgress({ current: 0, total: 0 });
    if (jsonInputRef.current) jsonInputRef.current.value = "";
    invalidate();
    if (failCount === 0) {
      toast.success(
        `${successCount} product${successCount !== 1 ? "s" : ""} imported from JSON`,
      );
    } else {
      toast.success(`${successCount} imported, ${failCount} failed/skipped`);
    }
    setJsonOpen(false);
  };

  const uploadActive = converting || uploading;
  const uploadLabel = converting
    ? "Converting to WebP..."
    : uploading
      ? `Uploading... ${progress}%`
      : null;

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h1 className="font-serif text-2xl font-bold text-primary">Products</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          {/* JSON Import */}
          <Dialog open={jsonOpen} onOpenChange={setJsonOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                style={{ borderColor: "#43A047", color: "#43A047" }}
                className="w-full sm:w-auto"
                data-ocid="admin.products.json_import_button"
              >
                <FileJson size={16} className="mr-2" /> Import JSON
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md mx-4">
              <DialogHeader>
                <DialogTitle>Import Products from JSON</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div
                  className="rounded-lg p-3 text-sm"
                  style={{ background: "#e8f5e9", border: "1px solid #c8e6c9" }}
                >
                  <p
                    style={{ color: "#1B5E20", fontWeight: 600 }}
                    className="mb-1"
                  >
                    Supported JSON Format:
                  </p>
                  <code className="text-xs block" style={{ color: "#444" }}>
                    {"[{ sku, product_name, category, subcategory,"}
                    <br />
                    {"  color, key_features, description, images, min_order }]"}
                  </code>
                </div>
                <div>
                  <Label>Select JSON file</Label>
                  <div
                    className="mt-2 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer"
                    style={{ borderColor: "#c8e6c9", background: "#f1f8e9" }}
                    onClick={() =>
                      !jsonImporting && jsonInputRef.current?.click()
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        jsonInputRef.current?.click();
                    }}
                    data-ocid="admin.products.json_dropzone"
                  >
                    <input
                      ref={jsonInputRef}
                      type="file"
                      accept=".json,application/json"
                      className="hidden"
                      onChange={handleJsonImport}
                    />
                    <FileJson
                      className="mx-auto mb-2"
                      size={28}
                      style={{ color: "#43A047" }}
                    />
                    <p className="text-sm" style={{ color: "#1B5E20" }}>
                      Click to select your .json file
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      All products will be imported automatically
                    </p>
                  </div>
                </div>
                {jsonImporting && (
                  <div data-ocid="admin.products.json_loading_state">
                    <div
                      className="flex justify-between text-xs mb-1"
                      style={{ color: "#1B5E20" }}
                    >
                      <span>
                        Importing {jsonProgress.current} of {jsonProgress.total}
                        ...
                      </span>
                      <span>
                        {jsonProgress.total > 0
                          ? Math.round(
                              (jsonProgress.current / jsonProgress.total) * 100,
                            )
                          : 0}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        jsonProgress.total > 0
                          ? Math.round(
                              (jsonProgress.current / jsonProgress.total) * 100,
                            )
                          : 0
                      }
                      className="h-2"
                    />
                  </div>
                )}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setJsonOpen(false)}
                  disabled={jsonImporting}
                  data-ocid="admin.products.json_cancel_button"
                >
                  Cancel
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* CSV Import */}
          <Dialog open={csvOpen} onOpenChange={setCsvOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                style={{ borderColor: "#42A5F5", color: "#42A5F5" }}
                className="w-full sm:w-auto"
                data-ocid="admin.products.import_button"
              >
                <FileSpreadsheet size={16} className="mr-2" /> Import CSV
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg mx-4">
              <DialogHeader>
                <DialogTitle>Bulk Import Products via CSV</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div
                  className="rounded-lg p-3 text-sm"
                  style={{ background: "#e8f4fe", border: "1px solid #c5cae9" }}
                >
                  <p
                    style={{ color: "#1A237E", fontWeight: 600 }}
                    className="mb-1"
                  >
                    Required CSV Columns:
                  </p>
                  <code
                    className="text-xs block"
                    style={{ color: "#444", lineHeight: 1.8 }}
                  >
                    Sku, Product_name, Category, Subcategory,
                    <br />
                    Color, Key_features, Description, Image
                  </code>
                  <p className="text-xs mt-2" style={{ color: "#666" }}>
                    • <strong>Category</strong>: must match an existing category
                    name exactly
                    <br />• <strong>Image</strong>: direct image URL (optional)
                  </p>
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={downloadCsvTemplate}
                      className="text-sm underline font-medium"
                      style={{ color: "#42A5F5" }}
                    >
                      ↓ Download CSV template
                    </button>
                  </div>
                </div>
                <div>
                  <Label>Select CSV file</Label>
                  <div
                    className="mt-2 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer"
                    style={{ borderColor: "#c5cae9", background: "#f5f7ff" }}
                    onClick={() =>
                      !csvImporting && csvInputRef.current?.click()
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        csvInputRef.current?.click();
                    }}
                    data-ocid="admin.products.csv_dropzone"
                  >
                    <input
                      ref={csvInputRef}
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={handleCsvImport}
                    />
                    <FileSpreadsheet
                      className="mx-auto mb-2"
                      size={28}
                      style={{ color: "#42A5F5" }}
                    />
                    <p className="text-sm" style={{ color: "#1A237E" }}>
                      Click to select your .csv file
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Import will start immediately after selection
                    </p>
                  </div>
                </div>
                {csvImporting && (
                  <div data-ocid="admin.products.csv_loading_state">
                    <div
                      className="flex justify-between text-xs mb-1"
                      style={{ color: "#1A237E" }}
                    >
                      <span>
                        Importing {csvProgress.current} of {csvProgress.total}
                        ...
                      </span>
                      <span>
                        {Math.round(
                          (csvProgress.current / csvProgress.total) * 100,
                        )}
                        %
                      </span>
                    </div>
                    <Progress
                      value={Math.round(
                        (csvProgress.current / csvProgress.total) * 100,
                      )}
                      className="h-2"
                    />
                  </div>
                )}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setCsvOpen(false)}
                  disabled={csvImporting}
                  data-ocid="admin.products.csv_cancel_button"
                >
                  Cancel
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Add/Edit Product Dialog */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-primary text-primary-foreground w-full sm:w-auto"
                onClick={openCreate}
                data-ocid="admin.add_button"
              >
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto mx-4">
              <DialogHeader>
                <DialogTitle>
                  {editing ? "Edit Product" : "Add Product"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                {/* Category */}
                <div>
                  <Label>Category</Label>
                  <Select
                    value={form.categoryId}
                    onValueChange={(v) =>
                      setForm((f) => ({ ...f, categoryId: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((c) => (
                        <SelectItem key={String(c.id)} value={String(c.id)}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 2-col: Name + SKU */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Product Name *</Label>
                    <Input
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      required
                      data-ocid="admin.products.input"
                    />
                  </div>
                  <div>
                    <Label>SKU</Label>
                    <Input
                      value={form.sku}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, sku: e.target.value }))
                      }
                      placeholder="e.g. GG-NK-001"
                    />
                  </div>
                </div>

                {/* 2-col: Subcategory + Color */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Subcategory</Label>
                    <Input
                      value={form.subcategory}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, subcategory: e.target.value }))
                      }
                      placeholder="e.g. Necklace Sets"
                    />
                  </div>
                  <div>
                    <Label>Color / Finish</Label>
                    <Input
                      value={form.color}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, color: e.target.value }))
                      }
                      placeholder="e.g. Gold Plated"
                    />
                  </div>
                </div>

                {/* Key Features */}
                <div>
                  <Label>Key Features</Label>
                  <Input
                    value={form.keyFeatures}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, keyFeatures: e.target.value }))
                    }
                    placeholder="e.g. Anti-tarnish | Kundan stones | Gift-ready packaging"
                  />
                </div>

                {/* Description */}
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, description: e.target.value }))
                    }
                    rows={3}
                  />
                </div>

                {/* MOQ */}
                <div>
                  <Label>Wholesale Price / MOQ</Label>
                  <Input
                    value={form.moq}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, moq: e.target.value }))
                    }
                    placeholder="e.g. $5 / 50 pieces min"
                  />
                </div>

                {/* Image upload */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label>Upload Product Images</Label>
                    <span className="text-xs text-muted-foreground">
                      Auto-converted to WebP
                    </span>
                  </div>
                  <div
                    className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors"
                    style={{
                      borderColor: uploadActive ? "#42A5F5" : "#c5cae9",
                      background: uploadActive ? "#e8f4fe" : "#f5f7ff",
                    }}
                    onClick={() =>
                      !uploadActive && fileInputRef.current?.click()
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        fileInputRef.current?.click();
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={async (e) => {
                      e.preventDefault();
                      const files = Array.from(e.dataTransfer.files).filter(
                        (f) => f.type.startsWith("image/"),
                      );
                      if (files.length) await handleDropUpload(files);
                    }}
                    data-ocid="admin.products.dropzone"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    {uploadActive ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2
                          size={22}
                          className="animate-spin"
                          style={{ color: "#42A5F5" }}
                        />
                        <p
                          className="text-sm font-medium"
                          style={{ color: "#42A5F5" }}
                        >
                          {uploadLabel}
                        </p>
                      </div>
                    ) : (
                      <>
                        <Upload
                          className="mx-auto mb-2 text-muted-foreground"
                          size={24}
                        />
                        <p className="text-sm text-muted-foreground">
                          Drag & drop images or{" "}
                          <span style={{ color: "#42A5F5" }}>
                            click to browse
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PNG, JPG → auto-converted to WebP
                        </p>
                      </>
                    )}
                  </div>
                  {uploading && (
                    <div
                      className="mt-2"
                      data-ocid="admin.products.loading_state"
                    >
                      <Progress value={progress} className="h-2" />
                    </div>
                  )}
                  {uploadError && (
                    <p
                      className="mt-1 text-xs text-destructive"
                      data-ocid="admin.products.upload_error"
                    >
                      {uploadError}
                    </p>
                  )}
                  {form.imageUrls.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {form.imageUrls.map((url, i) => (
                        <div key={url} className="relative group">
                          <img
                            src={url}
                            alt="Preview"
                            className="w-16 h-16 object-cover rounded"
                          />
                          <WebPBadge info={form.imageWebPInfo[url]} />
                          <button
                            type="button"
                            onClick={() => removeUploadedUrl(i)}
                            className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ background: "crimson" }}
                            aria-label="Remove image"
                          >
                            <X size={10} color="#fff" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Featured toggle */}
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Switch
                    id="featured-toggle"
                    checked={form.featured}
                    onCheckedChange={(v) =>
                      setForm((f) => ({ ...f, featured: v }))
                    }
                    data-ocid="admin.products.featured_toggle"
                  />
                  <div>
                    <Label htmlFor="featured-toggle" className="cursor-pointer">
                      Featured Product
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Show in Trending Now section on homepage
                    </p>
                  </div>
                </div>

                {/* New Arrival toggle */}
                <div className="flex items-center gap-3 p-3 bg-[#42A5F5]/10 rounded-lg border border-[#42A5F5]/20">
                  <Switch
                    id="new-arrival-toggle"
                    checked={form.isNewArrival}
                    onCheckedChange={(v) =>
                      setForm((f) => ({ ...f, isNewArrival: v }))
                    }
                    data-ocid="admin.products.new_arrival_toggle"
                  />
                  <div>
                    <Label
                      htmlFor="new-arrival-toggle"
                      className="cursor-pointer flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#42A5F5]" />
                      New Arrival
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Mark to feature in homepage New Arrivals section
                    </p>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground"
                  disabled={
                    createMutation.isPending ||
                    updateMutation.isPending ||
                    uploadActive
                  }
                  data-ocid="admin.products.submit_button"
                >
                  {editing ? "Update" : "Create"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {someSelected && (
        <div
          className="flex flex-wrap items-center gap-3 mb-4 p-3 rounded-lg border"
          style={{ background: "#e8f4fe", borderColor: "#42A5F5" }}
          data-ocid="admin.products.bulk_action_bar"
        >
          <span className="text-sm font-semibold" style={{ color: "#1A237E" }}>
            {selectedIds.size} selected
          </span>
          <Button
            size="sm"
            variant="outline"
            style={{ borderColor: "#43A047", color: "#43A047" }}
            onClick={handleBulkActivate}
            disabled={bulkActioning}
            data-ocid="admin.products.bulk_activate_button"
          >
            {bulkActioning ? (
              <Loader2 size={14} className="animate-spin mr-1" />
            ) : null}
            Activate
          </Button>
          <Button
            size="sm"
            variant="outline"
            style={{ borderColor: "#FB8C00", color: "#FB8C00" }}
            onClick={handleBulkDeactivate}
            disabled={bulkActioning}
            data-ocid="admin.products.bulk_deactivate_button"
          >
            Deactivate
          </Button>
          {!bulkDeleteConfirm ? (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => setBulkDeleteConfirm(true)}
              disabled={bulkActioning}
              data-ocid="admin.products.bulk_delete_button"
            >
              Delete Selected
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-destructive font-medium">
                Delete {selectedIds.size} products?
              </span>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleBulkDelete}
                disabled={bulkActioning}
                data-ocid="admin.products.bulk_delete_confirm_button"
              >
                {bulkActioning ? (
                  <Loader2 size={14} className="animate-spin mr-1" />
                ) : null}
                Yes, Delete
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setBulkDeleteConfirm(false)}
                disabled={bulkActioning}
                data-ocid="admin.products.bulk_delete_cancel_button"
              >
                Cancel
              </Button>
            </div>
          )}
          <button
            type="button"
            className="ml-auto text-xs text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => {
              setSelectedIds(new Set());
              setBulkDeleteConfirm(false);
            }}
          >
            Clear selection
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table data-ocid="admin.products.table" className="min-w-[640px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={toggleAll}
                  aria-label="Select all products"
                  data-ocid="admin.products.select_all_checkbox"
                />
              </TableHead>
              <TableHead className="w-12">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>MOQ / Price</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>New Arrival</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productList.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center text-muted-foreground py-8"
                  data-ocid="admin.products.empty_state"
                >
                  No products yet. Add your first product or import via CSV.
                </TableCell>
              </TableRow>
            )}
            {productList.map((p, i) => (
              <TableRow
                key={String(p.id)}
                data-ocid={`admin.products.item.${i + 1}`}
                className={selectedIds.has(String(p.id)) ? "bg-primary/5" : ""}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedIds.has(String(p.id))}
                    onCheckedChange={() => toggleOne(String(p.id))}
                    aria-label={`Select ${p.name}`}
                    data-ocid={`admin.products.checkbox.${i + 1}`}
                  />
                </TableCell>
                <TableCell>
                  {p.imageUrls.length > 0 ? (
                    <img
                      src={p.imageUrls[0]}
                      alt={p.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 object-cover rounded-md border border-border"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-md flex items-center justify-center"
                      style={{
                        background: "#f5f7ff",
                        border: "1px solid #c5cae9",
                      }}
                    >
                      <ImageOff size={16} style={{ color: "#c5cae9" }} />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {p.sku || "—"}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {p.moq}
                </TableCell>
                <TableCell>
                  {p.featured ? (
                    <Badge className="bg-primary/20 text-primary border-primary/30">
                      Yes
                    </Badge>
                  ) : null}
                </TableCell>
                <TableCell>
                  {p.isNewArrival ? (
                    <Badge className="bg-[#42A5F5]/20 text-[#1A237E] border-[#42A5F5]/30 gap-1">
                      <Sparkles className="w-3 h-3" />
                      New
                    </Badge>
                  ) : null}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEdit(p)}
                      data-ocid={`admin.products.edit_button.${i + 1}`}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (
                          confirm(
                            "Are you sure you want to delete this product?",
                          )
                        )
                          deleteMutation.mutate(p.id);
                      }}
                      data-ocid={`admin.products.delete_button.${i + 1}`}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
