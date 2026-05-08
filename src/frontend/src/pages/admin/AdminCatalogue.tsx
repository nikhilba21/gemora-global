import api from '../../lib/api';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FileText, Loader2, Trash2, X, UploadCloud, CheckCircle2, AlertCircle } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import AdminLayout from "../../components/AdminLayout";

const fieldStyle = {
  width: "100%",
  background: "#f5f7ff",
  border: "1px solid #c5cae9",
  borderRadius: 8,
  padding: "10px 12px",
  color: "#1A237E",
  fontSize: 14,
  outline: "none",
} as React.CSSProperties;

const labelStyle = {
  color: "#555",
  fontSize: 12,
  display: "block",
  marginBottom: 6,
} as React.CSSProperties;

interface UploadFileItem {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileName: string;
  status: 'pending' | 'uploading' | 'done' | 'error';
  progress: number;
}

export default function AdminCatalogue() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [uploadList, setUploadList] = useState<UploadFileItem[]>([]);
  const [savingBatch, setSavingBatch] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const CLOUDINARY_CLOUD = (import.meta as any).env?.VITE_CLOUDINARY_CLOUD || 'dnusbgxgm';
  const UPLOAD_PRESET = (import.meta as any).env?.VITE_CLOUDINARY_PRESET || 'gemora_unsigned';

  const { data: catalogues = [] } = useQuery({
    queryKey: ["catalogues"],
    queryFn: () => api.getCatalogues(),
    enabled: true,
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["catalogues"] });

  const deleteMutation = useMutation({
    mutationFn: (id: bigint) => api.deleteCatalogue(Number(id)),
    onSuccess: () => {
      toast.success("Catalogue deleted");
      invalidate();
    },
    onError: () => toast.error("Failed to delete catalogue"),
  });

  const resetForm = () => {
    setUploadList([]);
    setShowForm(false);
  };

  async function uploadSingleFile(file: File, itemId: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', 'gemora');

    // Use /image/upload as standard in original codebase, works for PDFs too
    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`;

    return new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const pct = Math.round((e.loaded / e.total) * 100);
          setUploadList(prev => prev.map(item => item.id === itemId ? { ...item, progress: pct } : item));
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const res = JSON.parse(xhr.responseText);
          resolve(res.secure_url);
        } else {
          reject(new Error(`Failed: ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error('Network error'));
      xhr.send(formData);
    });
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files.length) return;

    const newItems: UploadFileItem[] = [];
    const filesArray = Array.from(files);

    for (const file of filesArray) {
      const id = Math.random().toString(36).substring(2, 9);
      const dotIdx = file.name.lastIndexOf('.');
      const title = dotIdx !== -1 ? file.name.substring(0, dotIdx) : file.name;
      
      newItems.push({
        id,
        title: title,
        description: "",
        fileUrl: "",
        fileName: file.name,
        status: 'pending',
        progress: 0,
      });
    }

    setUploadList(prev => [...prev, ...newItems]);

    // Upload them concurrently
    for (const item of newItems) {
      const file = filesArray.find(f => f.name === item.fileName);
      if (!file) continue;

      setUploadList(prev => prev.map(u => u.id === item.id ? { ...u, status: 'uploading' } : u));
      try {
        const url = await uploadSingleFile(file, item.id);
        setUploadList(prev => prev.map(u => u.id === item.id ? { ...u, status: 'done', fileUrl: url, progress: 100 } : u));
      } catch {
        setUploadList(prev => prev.map(u => u.id === item.id ? { ...u, status: 'error', progress: 0 } : u));
      }
    }

    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSave = async () => {
    const activeItems = uploadList.filter(item => item.status === 'done' && item.fileUrl);
    if (activeItems.length === 0) {
      toast.error("Please upload at least one PDF file successfully");
      return;
    }

    const emptyTitle = activeItems.some(item => !item.title.trim());
    if (emptyTitle) {
      toast.error("Please provide a title for all catalogues");
      return;
    }

    setSavingBatch(true);
    const uploadedAt = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    let successCount = 0;
    try {
      for (const item of activeItems) {
        await api.createCatalogue({
          title: item.title.trim(),
          description: item.description.trim(),
          fileUrl: item.fileUrl,
          fileName: item.fileName,
          uploadedAt,
        });
        successCount++;
      }
      toast.success(`${successCount} catalogues saved successfully`);
      resetForm();
      invalidate();
    } catch (e) {
      toast.error("Some catalogues failed to save");
    } finally {
      setSavingBatch(false);
    }
  };

  const isSaving = savingBatch;

  return (
    <AdminLayout>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h2
              style={{
                color: "#1A237E",
                fontSize: 22,
                fontWeight: 600,
                margin: 0,
              }}
            >
              Catalogue Manager
            </h2>
            <p style={{ color: "#666", fontSize: 13, marginTop: 4 }}>
              Upload and manage catalogues. Buyers can download them directly.
            </p>
          </div>
          {!showForm && (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="w-full sm:w-auto"
              style={{
                background: "#1A237E",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "10px 20px",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              + Add Catalogues
            </button>
          )}
        </div>

        {showForm && (
          <div
            style={{
              background: "#fff",
              border: "1px solid #c5cae9",
              borderRadius: 12,
              padding: 24,
              marginBottom: 28,
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 style={{ color: "#1A237E", fontSize: 16, fontWeight: 600, margin: 0 }}>
                Upload New Catalogues
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            {/* Drag & drop / upload zone */}
            <div
              style={{
                border: "2px dashed #c5cae9",
                borderRadius: 8,
                padding: "30px 20px",
                textAlign: "center",
                cursor: "pointer",
                background: "#f5f7ff",
                transition: "all 0.2s",
                marginBottom: 24,
              }}
              onClick={() => fileRef.current?.click()}
            >
              <input
                ref={fileRef}
                type="file"
                accept="application/pdf,.pdf"
                multiple
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <UploadCloud size={32} className="mx-auto text-indigo-400 mb-2" />
              <p className="text-sm font-semibold text-indigo-900">
                Click to choose PDF files or drag them here
              </p>
              <p className="text-xs text-gray-500 mt-1">
                You can select multiple PDFs at once
              </p>
            </div>

            {/* List of uploaded files to edit title/description */}
            {uploadList.length > 0 && (
              <div className="space-y-4 mb-6">
                <h4 style={{ color: "#1A237E", fontSize: 14, fontWeight: 600, borderBottom: "1px solid #eef2f6", paddingBottom: 8 }}>
                  Catalogues List ({uploadList.length} files)
                </h4>
                {uploadList.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      border: "1px solid #eef2f6",
                      borderRadius: 8,
                      padding: 16,
                      background: "#fafbfe"
                    }}
                    className="relative"
                  >
                    {/* Delete item button */}
                    <button
                      type="button"
                      onClick={() => setUploadList(prev => prev.filter(u => u.id !== item.id))}
                      style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        color: "crimson",
                        background: "none",
                        border: "none",
                        cursor: "pointer"
                      }}
                    >
                      <Trash2 size={16} />
                    </button>

                    <div className="flex items-start gap-3 mb-4">
                      <div className="p-2 bg-indigo-50 text-indigo-600 rounded">
                        {item.status === 'uploading' ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : item.status === 'done' ? (
                          <CheckCircle2 size={18} className="text-green-600" />
                        ) : item.status === 'error' ? (
                          <AlertCircle size={18} className="text-red-500" />
                        ) : (
                          <FileText size={18} />
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0, paddingRight: 24 }}>
                        <p className="font-semibold text-sm truncate text-indigo-950 mb-0.5">
                          {item.fileName}
                        </p>
                        {item.status === 'uploading' && (
                          <p className="text-xs text-indigo-500 font-medium">
                            Uploading... {item.progress}%
                          </p>
                        )}
                        {item.status === 'done' && (
                          <p className="text-xs text-green-600 font-medium">
                            Uploaded successfully
                          </p>
                        )}
                        {item.status === 'error' && (
                          <p className="text-xs text-red-500 font-medium">
                            Upload failed
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Form fields for this specific catalogue */}
                    {item.status === 'done' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label style={labelStyle}>Catalogue Title *</label>
                          <input
                            style={fieldStyle}
                            value={item.title}
                            placeholder="Enter title..."
                            onChange={(e) => setUploadList(prev => prev.map(u => u.id === item.id ? { ...u, title: e.target.value } : u))}
                          />
                        </div>
                        <div>
                          <label style={labelStyle}>Description (optional)</label>
                          <input
                            style={fieldStyle}
                            value={item.description}
                            placeholder="Enter short description..."
                            onChange={(e) => setUploadList(prev => prev.map(u => u.id === item.id ? { ...u, description: e.target.value } : u))}
                          />
                        </div>
                      </div>
                    )}

                    {/* Progress bar */}
                    {item.status === 'uploading' && (
                      <div className="w-full bg-gray-200 h-1 rounded overflow-hidden mt-2">
                        <div
                          className="bg-indigo-600 h-1 transition-all duration-150"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving || uploadList.filter(u => u.status === 'done').length === 0}
                className="w-full sm:w-auto"
                style={{
                  background: isSaving || uploadList.filter(u => u.status === 'done').length === 0 ? "#c5cae9" : "#1A237E",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 24px",
                  fontWeight: 600,
                  cursor: isSaving || uploadList.filter(u => u.status === 'done').length === 0 ? "not-allowed" : "pointer",
                  fontSize: 14,
                }}
              >
                {isSaving ? "Saving Catalogues..." : `Save ${uploadList.filter(u => u.status === 'done').length} Catalogues`}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="w-full sm:w-auto"
                style={{
                  background: "transparent",
                  color: "#666",
                  border: "1px solid #c5cae9",
                  borderRadius: 8,
                  padding: "10px 20px",
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {catalogues.length === 0 ? (
          <div
            style={{
              background: "#fff",
              border: "1px solid #e0e0e0",
              borderRadius: 12,
              padding: "48px 24px",
              textAlign: "center",
              color: "#aaa",
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>📁</div>
            <p>No catalogues uploaded yet.</p>
            <p style={{ fontSize: 13, marginTop: 4 }}>
              Click "Add Catalogues" to upload your first PDF.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {catalogues.map((cat) => (
              <div
                key={String(cat.id)}
                style={{
                  background: "#fff",
                  border: "1px solid #e0e0e0",
                  borderRadius: 12,
                  padding: "16px 20px",
                }}
                className="flex flex-col sm:flex-row sm:items-center gap-3"
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    background: "rgba(66,165,245,0.1)",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    flexShrink: 0,
                  }}
                >
                  📄
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{ fontWeight: 600, color: "#1A237E", fontSize: 15 }}
                  >
                    {cat.title}
                  </div>
                  {cat.description && (
                    <div style={{ color: "#666", fontSize: 13, marginTop: 2 }}>
                      {cat.description}
                    </div>
                  )}
                  <div style={{ color: "#aaa", fontSize: 12, marginTop: 4 }}>
                    Uploaded {cat.uploadedAt} · {cat.fileName}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <a
                    href={cat.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: "rgba(66,165,245,0.15)",
                      color: "#1A237E",
                      border: "1px solid rgba(66,165,245,0.3)",
                      borderRadius: 6,
                      padding: "6px 12px",
                      fontSize: 13,
                      textDecoration: "none",
                      cursor: "pointer",
                    }}
                  >
                    Preview
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Delete this catalogue?"))
                        deleteMutation.mutate(cat.id);
                    }}
                    style={{
                      background: "rgba(220,38,38,0.15)",
                      color: "#c62828",
                      border: "1px solid rgba(220,38,38,0.3)",
                      borderRadius: 6,
                      padding: "6px 12px",
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
