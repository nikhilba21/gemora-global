import api from '../lib/api';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, FolderOpen, Images, ArrowLeft, Image as ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { usePageSEO } from "../hooks/usePageSEO";
import { useCanonical } from '../hooks/useCanonical';

export default function Gallery() {
  useCanonical();

  usePageSEO({
    title: "Imitation Jewellery Photo Gallery — Wholesale Catalogue | Gemora Global",
    description:
      "View wholesale imitation jewellery gallery. Request catalogue for pricing and MOQ.",
    canonical: "https://www.gemoraglobal.co/gallery",
  });

  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  // 1. Fetch Folders
  const { data: folders, isLoading: foldersLoading } = useQuery({
    queryKey: ["gallery-folders"],
    queryFn: () => api.getGalleryFolders(),
  });

  // 2. Fetch Images for Selected Folder
  const { data: folderData, isLoading: imagesLoading } = useQuery({
    queryKey: ["gallery-folder-images", selectedFolderId],
    queryFn: () => api.getGalleryFolderImages(selectedFolderId!),
    enabled: selectedFolderId !== null,
  });

  useEffect(() => {
    if (lightboxIdx !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [lightboxIdx]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-10 px-4">
        <h1 className="text-3xl font-bold mb-2 mt-16 md:mt-20">
          {selectedFolderId && folderData?.folder ? folderData.folder.name : "Jewellery Gallery"}
        </h1>
        <p className="text-muted-foreground mb-8">
          {selectedFolderId && folderData?.folder 
            ? folderData.folder.description || "Browse the images in this collection."
            : "Explore our wholesale collections organized by categories."}
        </p>

        {selectedFolderId === null ? (
          /* ── FOLDER VIEW ── */
          foldersLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-64 w-full rounded-xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {folders?.map((folder) => (
                <div
                  key={folder.id}
                  className="group relative border rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 bg-card"
                  onClick={() => setSelectedFolderId(Number(folder.id))}
                >
                  <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                    {folder.thumbnailUrl ? (
                      <img
                        src={folder.thumbnailUrl}
                        alt={folder.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-secondary/20">
                        <FolderOpen className="w-12 h-12 mb-2 opacity-50" />
                        <span className="text-sm">Empty Folder</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
                      {folder.name}
                    </h3>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <ImageIcon className="w-3.5 h-3.5 mr-1.5" />
                      {folder.imageCount} {folder.imageCount === 1 ? 'item' : 'items'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* ── IMAGES VIEW ── */
          <div>
            <Button
              variant="ghost"
              className="mb-6 -ml-4 hover:bg-transparent hover:text-primary"
              onClick={() => { setSelectedFolderId(null); setLightboxIdx(null); }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Collections
            </Button>

            {imagesLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <Skeleton key={i} className="h-48 w-full rounded-lg" />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {folderData?.images && folderData.images.length > 0 ? (
                  folderData.images.map((item, idx) => (
                    <div
                      key={item.id}
                      className="border rounded-lg overflow-hidden cursor-pointer group relative bg-muted"
                      onClick={() => setLightboxIdx(idx)}
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.caption || `${folderData.folder.name} Jewellery Collection — Gemora Global`}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {item.caption && (
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 text-white text-xs truncate opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.caption}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed rounded-lg">
                    <Images className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No images in this collection yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* LIGHTBOX */}
      {lightboxIdx !== null && folderData?.images && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-sm"
          onClick={() => setLightboxIdx(null)}
        >
          <div className="relative max-w-7xl mx-auto px-4 flex items-center justify-center w-full h-full">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 text-white hover:bg-white/20 z-50 rounded-full bg-black/40"
              onClick={() => setLightboxIdx(null)}
            >
              &times;
            </Button>
            
            <div className="relative flex items-center justify-center w-full h-full" onClick={(e) => e.stopPropagation()}>
              {/* Prev Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 md:left-8 text-white hover:bg-white/20 z-50 rounded-full bg-black/40 h-12 w-12"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIdx(prev => prev! > 0 ? prev! - 1 : folderData.images.length - 1);
                }}
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>

              <img
                src={folderData.images[lightboxIdx]?.imageUrl}
                className="max-h-[85vh] max-w-full object-contain rounded-md shadow-2xl"
                alt={folderData.images[lightboxIdx]?.caption || "Gallery preview"}
              />

              {/* Next Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 md:right-8 text-white hover:bg-white/20 z-50 rounded-full bg-black/40 h-12 w-12"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIdx(prev => prev! < folderData.images.length - 1 ? prev! + 1 : 0);
                }}
              >
                <ChevronRight className="w-8 h-8" />
              </Button>
            </div>
            
            {folderData.images[lightboxIdx]?.caption && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/80 px-6 py-2.5 rounded-full text-white/90 text-sm max-w-[90%] text-center backdrop-blur-md border border-white/10">
                {folderData.images[lightboxIdx].caption}
              </div>
            )}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="text-center py-16 bg-muted/30 border-t mt-12">
        <h2 className="text-2xl font-bold mb-4">Want to see our full range?</h2>
        <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
          Contact our export team to get access to our complete B2B wholesale catalogue with pricing.
        </p>
        <Link to="/contact">
          <Button size="lg" className="rounded-full px-8">Request Full Catalogue</Button>
        </Link>
      </div>

      {/* ── Contextual SEO Interlinking ──────────────────────── */}
      <section className="container py-10 border-t border-border">
        <h2 className="font-serif text-xl font-bold text-foreground mb-4">
          Wholesale Jewellery Collections
        </h2>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed max-w-2xl">
          Browse our extensive collection of factory-direct jewellery from Jaipur. 
          Gemora Global is a premier{" "}
          <Link to="/wholesale-imitation-jewellery-manufacturer-exporter-india" className="text-primary hover:underline">
            wholesale imitation jewellery exporter
          </Link>{" "}
          serving boutiques and distributors globally. Explore our specialized categories:
        </p>
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { label: "Kundan Wholesale", to: "/kundan-jewellery-wholesale" },
            { label: "Bridal Sets", to: "/bridal-jewellery-wholesale" },
            { label: "Oxidised Collection", to: "/oxidised-jewellery-wholesale" },
            { label: "Meenakari Designs", to: "/meenakari-jewellery-wholesale" },
            { label: "Temple Jewellery", to: "/temple-jewellery-manufacturer" },
            { label: "American Diamond", to: "/american-diamond-jewellery-wholesale" },
            { label: "Fashion Jewellery", to: "/fashion-jewellery-exporter-india" },
            { label: "Jaipur Manufacturer", to: "/imitation-jewellery-manufacturer-jaipur" },
          ].map((cat) => (
            <Link
              key={cat.to}
              to={cat.to}
              className="inline-block text-xs font-medium px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 transition-colors"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
