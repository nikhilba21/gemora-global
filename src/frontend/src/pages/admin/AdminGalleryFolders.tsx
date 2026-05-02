import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FolderOpen, FolderPlus, ImagePlus, Loader2, Trash2, X, ChevronLeft, Eye } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import AdminLayout from "../../components/AdminLayout";
import { useActor } from "../../hooks/useActor";
import { useStorageUpload } from "../../hooks/useStorageUpload";

type FolderItem = {
  id: number;
  name: string;
  description: string;
  thumbnailUrl: string;
  sortOrder: number;
  imageCount: number;
};

type FolderImage = {
  id: number;
  folderId: number;
  imageUrl: string;
  caption: string;
  sortOrder: number;
};

type UploadFile = {
  file: File;
  name: string;
  status: "pending" | "uploading" | "done" | "error";
  url?: string;
  progress?: number;
};

export default function AdminGalleryFolders() {
  const { actor } = useActor();
  const qc = useQueryClient();
  const { uploadFileDetailed } = useStorageUpload();

  const [view, setView] = useState<"list" | "folder">("list");
  const [selectedFolder, setSelectedFolder] = useState<FolderItem | null>(null);
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderDesc, setNewFolderDesc] = useState("");
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const addMoreRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // ── Folders list ─────────────────────────────────────────────────────────────
  const { data: folders = [], isLoading } = useQuery<FolderItem[]>({
    queryKey: ["gallery-folders"],
    queryFn: () => actor!.getGalleryFolders() as Promise<FolderItem[]>,
    enabled: true,
  });

  // ── Folder images ─────────────────────────────────────────────────────────────
  const { data: folderData, isLoading: imgsLoading } = useQuery({
    queryKey: ["gallery-folder-images", selectedFolder?.id],
    queryFn: () => actor!.getGalleryFolderImages(selectedFolder!.id),
    enabled: !!selectedFolder,
  });
  const folderImages: FolderImage[] = (folderData?.images as FolderImage[]) || [];

  // ── Delete folder ─────────────────────────────────────────────────────────────
  const deleteFolderMut = useMutation({
    mutationFn: (id: number) => actor!.deleteGalleryFolder(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["gallery-folders"] }); toast.success("Folder deleted"); },
  });

  // ── Delete image ──────────────────────────────────────────────────────────────
  const deleteImgMut = useMutation({
    mutationFn: ({ folderId, imgId }: { folderId: number; imgId: number }) =>
      actor!.deleteFolderImage(folderId, imgId),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["gallery-folder-images"] }); qc.invalidateQueries({ queryKey: ["gallery-folders"] }); toast.success("Image removed"); },
  });

  // ── File selection handler ────────────────────────────────────────────────────
  function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    const imgs = Array.from(fileList).filter(f => f.type.startsWith("image/"));
    if (!imgs.length) { toast.error("No image files selected"); return; }
    const items: UploadFile[] = imgs.map(f => ({ file: f, name: f.name, status: "pending" }));
    setUploadFiles(prev => [...prev, ...items]);
  }

  // ── Create folder + upload images ─────────────────────────────────────────────
  async function handleCreateAndUpload() {
    if (!newFolderName.trim()) { toast.error("Folder name required"); return; }
    if (!uploadFiles.length) { toast.error("Select at least one image"); return; }
    setUploading(true);
    setOverallProgress(0);
    try {
      // 1. Create folder
      const folderId = await actor!.createGalleryFolder(newFolderName.trim(), newFolderDesc.trim(), 0);

      // 2. Upload images one by one
      const uploaded: { imageUrl: string; caption: string; sortOrder: number }[] = [];
      for (let i = 0; i < uploadFiles.length; i++) {
        setUploadFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: "uploading" } : f));
        try {
          const result = await uploadFileDetailed(uploadFiles[i].file);
          uploaded.push({ imageUrl: result.url, caption: uploadFiles[i].name.replace(/\.[^/.]+$/, ""), sortOrder: i });
          setUploadFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: "done", url: result.url } : f));
        } catch {
          setUploadFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: "error" } : f));
        }
        setOverallProgress(Math.round(((i + 1) / uploadFiles.length) * 100));
      }

      // 3. Save all images to folder
      if (uploaded.length) {
        await actor!.addImagesToFolder(folderId as number, uploaded);
      }

      toast.success(`✅ Folder "${newFolderName}" created with ${uploaded.length} images!`);
      qc.invalidateQueries({ queryKey: ["gallery-folders"] });
      setCreatingFolder(false);
      setNewFolderName("");
      setNewFolderDesc("");
      setUploadFiles([]);
      setOverallProgress(0);
    } catch (e: unknown) {
      toast.error("Upload failed: " + (e instanceof Error ? e.message : "Unknown error"));
    } finally {
      setUploading(false);
    }
  }

  // ── Add more images to existing folder ───────────────────────────────────────
  async function handleAddMoreImages(files: FileList | null) {
    if (!files || !selectedFolder) return;
    const imgs = Array.from(files).filter(f => f.type.startsWith("image/"));
    if (!imgs.length) return;
    setUploading(true);
    const uploaded: { imageUrl: string; caption: string; sortOrder: number }[] = [];
    for (const file of imgs) {
      try {
        const result = await uploadFileDetailed(file);
        uploaded.push({ imageUrl: result.url, caption: file.name.replace(/\.[^/.]+$/, ""), sortOrder: 999 });
      } catch { toast.error(`Failed: ${file.name}`); }
    }
    if (uploaded.length) {
      await actor!.addImagesToFolder(selectedFolder.id, uploaded);
      qc.invalidateQueries({ queryKey: ["gallery-folder-images", selectedFolder.id] });
      qc.invalidateQueries({ queryKey: ["gallery-folders"] });
      toast.success(`${uploaded.length} images added!`);
    }
    setUploading(false);
  }

  // ── Open folder view ──────────────────────────────────────────────────────────
  function openFolder(folder: FolderItem) {
    setSelectedFolder(folder);
    setView("folder");
  }

  // ── Drag & drop ───────────────────────────────────────────────────────────────
  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────

  // Folder detail view
  if (view === "folder" && selectedFolder) {
    return (
      <AdminLayout>
        <div className="p-6 max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="sm" onClick={() => setView("list")}>
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{selectedFolder.name}</h1>
              <p className="text-sm text-muted-foreground">{folderImages.length} images</p>
            </div>
            <div className="ml-auto flex gap-2">
              <input ref={addMoreRef} type="file" multiple accept="image/*" className="hidden" onChange={e => handleAddMoreImages(e.target.files)} />
              <Button onClick={() => addMoreRef.current?.click()} disabled={uploading} size="sm">
                {uploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ImagePlus className="w-4 h-4 mr-2" />}
                Add Images
              </Button>
            </div>
          </div>

          {/* Images grid */}
          {imgsLoading ? (
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="aspect-square bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : folderImages.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No images in this folder yet</p>
              <Button className="mt-4" onClick={() => addMoreRef.current?.click()}>
                <ImagePlus className="w-4 h-4 mr-2" /> Add Images
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {folderImages.map(img => (
                <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden bg-muted border">
                  <img src={img.imageUrl} alt={img.caption} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => window.open(img.imageUrl, '_blank')}
                      className="p-1.5 bg-white/20 rounded-full hover:bg-white/40"
                    >
                      <Eye className="w-3.5 h-3.5 text-white" />
                    </button>
                    <button
                      onClick={() => { if (confirm("Delete this image?")) deleteImgMut.mutate({ folderId: selectedFolder.id, imgId: img.id }); }}
                      className="p-1.5 bg-red-500/70 rounded-full hover:bg-red-500"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                  {img.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-2 py-1 truncate">
                      {img.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </AdminLayout>
    );
  }

  // Folder list view
  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Gallery Folders</h1>
            <p className="text-sm text-muted-foreground">Upload a folder of images — they appear as a collection on the gallery page</p>
          </div>
          <Button onClick={() => setCreatingFolder(true)}>
            <FolderPlus className="w-4 h-4 mr-2" /> New Folder
          </Button>
        </div>

        {/* Create Folder Panel */}
        {creatingFolder && (
          <div className="border rounded-xl p-6 mb-6 bg-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Create New Folder</h2>
              <button onClick={() => { setCreatingFolder(false); setUploadFiles([]); setNewFolderName(""); setNewFolderDesc(""); }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label>Folder Name *</Label>
                <Input
                  placeholder="e.g. Bridal Collection 2026, Earrings Batch 3..."
                  value={newFolderName}
                  onChange={e => setNewFolderName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Description (optional)</Label>
                <Input
                  placeholder="Short description of this collection"
                  value={newFolderDesc}
                  onChange={e => setNewFolderDesc(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Drop zone */}
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/30 hover:border-primary/50"}`}
              onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={onDrop}
              onClick={() => folderInputRef.current?.click()}
            >
              <input
                ref={folderInputRef}
                type="file"
                multiple
                accept="image/*"
                // @ts-ignore — webkitdirectory for folder selection
                webkitdirectory=""
                className="hidden"
                onChange={e => handleFiles(e.target.files)}
              />
              <FolderOpen className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
              <p className="font-medium">Click to select a folder or drag & drop images</p>
              <p className="text-sm text-muted-foreground mt-1">Selects all images from a folder at once • JPG, PNG, WEBP supported</p>
              {uploadFiles.length > 0 && (
                <p className="text-sm font-medium text-primary mt-2">{uploadFiles.length} images selected</p>
              )}
            </div>

            {/* File list preview */}
            {uploadFiles.length > 0 && (
              <div className="mt-4 max-h-48 overflow-y-auto border rounded-lg divide-y text-sm">
                {uploadFiles.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-2">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${f.status === "done" ? "bg-green-500" : f.status === "error" ? "bg-red-500" : f.status === "uploading" ? "bg-yellow-500 animate-pulse" : "bg-muted-foreground/30"}`} />
                    <span className="truncate flex-1 text-muted-foreground">{f.name}</span>
                    {f.status === "done" && <span className="text-green-600 text-xs">✓</span>}
                    {f.status === "error" && <span className="text-red-500 text-xs">✗</span>}
                    {f.status === "pending" && (
                      <button onClick={() => setUploadFiles(prev => prev.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Overall progress */}
            {uploading && (
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Uploading to Cloudinary...</span>
                  <span>{overallProgress}%</span>
                </div>
                <Progress value={overallProgress} className="h-2" />
              </div>
            )}

            <div className="flex gap-3 mt-4">
              <Button
                onClick={handleCreateAndUpload}
                disabled={uploading || !newFolderName.trim() || !uploadFiles.length}
                className="flex-1"
              >
                {uploading ? (
                  <><Loader2 className="w-4 h-4 animate-spin mr-2" />Uploading {overallProgress}%...</>
                ) : (
                  <><FolderPlus className="w-4 h-4 mr-2" />Create Folder & Upload {uploadFiles.length} Images</>
                )}
              </Button>
              <Button variant="outline" onClick={() => setUploadFiles([])} disabled={uploading}>
                Clear
              </Button>
            </div>
          </div>
        )}

        {/* Folders Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : folders.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <FolderOpen className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">No folders yet</p>
            <p className="text-sm mt-1">Create your first gallery folder to get started</p>
            <Button className="mt-4" onClick={() => setCreatingFolder(true)}>
              <FolderPlus className="w-4 h-4 mr-2" /> Create First Folder
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {folders.map(folder => (
              <div
                key={folder.id}
                className="group relative rounded-xl overflow-hidden border bg-card cursor-pointer hover:shadow-lg transition-all"
                onClick={() => openFolder(folder)}
              >
                {/* Thumbnail */}
                <div className="aspect-square bg-muted relative overflow-hidden">
                  {folder.thumbnailUrl ? (
                    <img src={folder.thumbnailUrl} alt={folder.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FolderOpen className="w-12 h-12 text-muted-foreground/30" />
                    </div>
                  )}
                  {/* Image count badge */}
                  <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                    {folder.imageCount} photos
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      className="p-2 bg-white/20 rounded-full hover:bg-white/40 text-white"
                      onClick={e => { e.stopPropagation(); openFolder(folder); }}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 bg-red-500/70 rounded-full hover:bg-red-500 text-white"
                      onClick={e => {
                        e.stopPropagation();
                        if (confirm(`Delete folder "${folder.name}" and all ${folder.imageCount} images?`)) {
                          deleteFolderMut.mutate(folder.id);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {/* Folder name */}
                <div className="p-3">
                  <p className="font-medium text-sm truncate">{folder.name}</p>
                  {folder.description && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{folder.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
