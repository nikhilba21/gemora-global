import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, FolderOpen, Images, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useActor } from "../hooks/useActor";
import { usePageSEO } from "../hooks/usePageSEO";
import type { GalleryItem } from "../types";
import { useCanonical } from '../hooks/useCanonical';

const GALLERY_PAGE_SIZE = 12;

const FILTER_TYPES = [
  { label: "All", value: "" },
  { label: "Products", value: "product" },
  { label: "Bulk Orders", value: "bulk" },
  { label: "Packaging", value: "packaging" },
];

const GALLERY_ALT_TEXTS = [
  "Gold-plated fashion jewellery wholesale Jaipur",
  "Imitation necklace set wholesale manufacturer India",
  "Kundan earrings bulk supplier Jaipur",
  "Antique oxidised jewellery wholesale exporter",
  "Bridal imitation jewellery set manufacturer India",
  "American diamond CZ jewellery wholesale",
  "Fashion bangles bulk supplier Jaipur India",
  "Statement earrings wholesale imitation jewellery",
  "Meenakari jewellery wholesale exporter India",
  "Traditional ethnic jewellery bulk manufacturer",
  "Designer artificial jewellery wholesale supplier",
  "Oxidised silver jewellery bulk exporter Jaipur",
];

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  product:
    "Browse our wholesale product range featuring 500+ unique designs across earrings, necklace sets, bangles, rings, bridal sets, and oxidised jewellery. Each piece is crafted in Jaipur with anti-tarnish finishing. MOQ starts at 50 units per design, with competitive tiered pricing for higher volumes.",
  bulk: "Our bulk order programme is designed for distributors, fashion retailers, and export houses. Orders of 200+ units per design attract mid-tier pricing, while 500+ unit orders unlock our best wholesale rate. We support mix-and-match across categories, custom packaging, and export documentation for all international shipments.",
  packaging:
    "All Gemora Global jewellery ships in export-grade packaging — individual polybags, velvet pouches, or branded boxes depending on the order type. Custom branded packaging is available for private label buyers with orders of 500+ units. Our packaging is designed to meet international retail presentation standards.",
};

export default function Gallery() {
  useCanonical();
  usePageSEO({
    title:
      "Imitation Jewellery Photo Gallery — Wholesale Catalogue | Gemora Global",
    description:
      "View Gemora Global's wholesale imitation jewellery gallery — necklace sets, earrings, bridal jewellery, bangles and more. Request the full digital catalogue for pricing and MOQ details.",
    canonical: "https://www.gemoraglobal.co/gallery",
    ogTitle:
      "Imitation Jewellery Photo Gallery — Wholesale Catalogue | Gemora Global",
    ogImage: "https://www.gemoraglobal.co/images/og-gallery.jpg",
    schema: {
      "@context": "https://schema.org",
      "@type": "ImageGallery",
      name: "Gemora Global Jewellery Wholesale Gallery",
      description: "Wholesale imitation jewellery designs from Gemora Global",
      url: "https://www.gemoraglobal.co/gallery",
    },
  });

  const { actor, isFetching: actorFetching } = useActor();
  const [filter, setFilter] = useState("");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  // Reset page when filter changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional reset
  useEffect(() => {
    setCurrentPage(0);
  }, [filter]);

  // Lock scroll when lightbox open
  useEffect(() => {
    document.body.style.overflow = lightboxIdx !== null ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxIdx]);

  const actorReady = true; // REST API actor is always ready

  // ── Folder state ─────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<"images" | "folders">("folders");
  const [openFolderId, setOpenFolderId] = useState<number | null>(null);
  const [folderLightboxIdx, setFolderLightboxIdx] = useState<number | null>(null);

  // Fetch all folders
  const { data: folders = [], isLoading: foldersLoading } = useQuery({
    queryKey: ["gallery-folders"],
    queryFn: () => actor!.getGalleryFolders(),
    enabled: true,
  });

  // Fetch images inside open folder
  const { data: folderData, isLoading: folderImgsLoading } = useQuery({
    queryKey: ["gallery-folder-images", openFolderId],
    queryFn: () => actor!.getGalleryFolderImages(openFolderId!),
    enabled: !!openFolderId,
  });
  const folderImages = (folderData?.images ?? []) as Array<{ id: number; imageUrl: string; caption: string }>;

  const { data: catalogues = [] } = useQuery({
    queryKey: ["catalogues"],
    queryFn: () => actor!.getCatalogues(),
    enabled: actorReady,
  });

  const { data: pagedResult, isLoading } = useQuery({
    queryKey: ["gallery-paginated", filter, currentPage],
    queryFn: () =>
      actor!.getGalleryPaginated(
        filter || null,
        BigInt(currentPage),
        BigInt(GALLERY_PAGE_SIZE),
      ),
    enabled: actorReady,
  });

  const displayItems: GalleryItem[] = pagedResult?.items ?? [];
  const totalPages = pagedResult ? Number(pagedResult.pages) : 0;
  const totalCount = pagedResult ? Number(pagedResult.total) : 0;

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIdx === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")
        setLightboxIdx((prev) =>
          prev === null
            ? null
            : (prev - 1 + displayItems.length) % displayItems.length,
        );
      else if (e.key === "ArrowRight")
        setLightboxIdx((prev) =>
          prev === null ? null : (prev + 1) % displayItems.length,
        );
      else if (e.key === "Escape") setLightboxIdx(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxIdx, displayItems.length]);

  const goLightboxPrev = () =>
    setLightboxIdx((prev) =>
      prev === null
        ? null
        : (prev - 1 + displayItems.length) % displayItems.length,
    );
  const goLightboxNext = () =>
    setLightboxIdx((prev) =>
      prev === null ? null : (prev + 1) % displayItems.length,
    );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="bg-card border-b border-border py-8 md:py-12 px-4">
          <div className="container px-0">
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold mb-3 leading-tight">
              Jewellery Gallery — Browse Our Wholesale Collection
            </h1>
            <p className="text-muted-foreground max-w-2xl mb-4 text-sm md:text-base">
              Welcome to the Gemora Global jewellery gallery — a curated
              selection from our 500+{" "}
              <Link to="/products" className="text-primary hover:underline">
                design catalogue
              </Link>
              . New designs are added every season.{" "}
              <Link to="/contact" className="text-primary hover:underline">
                Contact our team
              </Link>{" "}
              to request the complete digital catalogue with{" "}
              <Link to="/wholesale" className="text-primary hover:underline">
                wholesale pricing
              </Link>{" "}
              and MOQ details.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg text-sm font-medium transition-colors min-h-[44px] w-full sm:w-auto"
              data-ocid="gallery.open_modal_button"
            >
              Request Full Catalogue &amp; Pricing
            </Link>
          </div>
        </div>

        {/* Browse by Category */}
        <div className="container py-6 md:py-8 px-4">
          {/* ── Tab switcher: Folders / All Images ── */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={activeTab === "folders" ? "default" : "outline"}
              size="sm"
              onClick={() => { setActiveTab("folders"); setOpenFolderId(null); }}
              className="flex items-center gap-2"
            >
              <FolderOpen className="w-4 h-4" /> Collections
            </Button>
            <Button
              variant={activeTab === "images" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("images")}
              className="flex items-center gap-2"
            >
              <Images className="w-4 h-4" /> All Images
            </Button>
          </div>

          {/* ── Image filter tabs (only in images tab) ── */}
          {activeTab === "images" && (
            <div
              className="flex gap-2 mb-4 overflow-x-auto pb-1"
              style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
            >
              {FILTER_TYPES.map((ft) => (
                <Button
                  key={ft.value}
                  variant={filter === ft.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(ft.value)}
                  className={`flex-shrink-0 min-h-[40px] ${filter === ft.value ? "bg-primary text-primary-foreground" : ""}`}
                >
                  {ft.label}
                </Button>
              ))}
            </div>
          )}
          {/* Category description — SEO text for active filter */}
          {activeTab === "images" && filter && CATEGORY_DESCRIPTIONS[filter] && (
            <p className="text-muted-foreground text-sm mb-6 max-w-2xl leading-relaxed">
              {CATEGORY_DESCRIPTIONS[filter]}
            </p>
          )}

          {/* ════════════════════════════════════════════════════════
               FOLDERS TAB
          ════════════════════════════════════════════════════════ */}
          {activeTab === "folders" && !openFolderId && (
            <>
              {foldersLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                  {[1,2,3,4,5,6,7,8].map(i => (
                    <div key={i} className="aspect-square rounded-xl bg-muted animate-pulse" />
                  ))}
                </div>
              ) : folders.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                  <FolderOpen className="w-14 h-14 mx-auto mb-4 opacity-20" />
                  <p className="font-medium">No collections yet</p>
                  <p className="text-sm mt-1">Check back soon for our photo collections</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                  {(folders as Array<{id:number;name:string;description:string;thumbnailUrl:string;imageCount:number}>).map(folder => (
                    <button
                      key={folder.id}
                      type="button"
                      onClick={() => setOpenFolderId(folder.id)}
                      className="rounded-xl overflow-hidden border border-border hover:border-primary/50 hover:shadow-md transition-all group text-left w-full"
                    >
                      <div className="aspect-square overflow-hidden bg-muted relative">
                        {folder.thumbnailUrl ? (
                          <img
                            src={folder.thumbnailUrl}
                            alt={`${folder.name} jewellery collection`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FolderOpen className="w-12 h-12 text-muted-foreground/30" />
                          </div>
                        )}
                        {/* Image count badge */}
                        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                          {folder.imageCount} photos
                        </div>
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="p-3 bg-card">
                        <p className="font-semibold text-sm truncate">{folder.name}</p>
                        {folder.description && (
                          <p className="text-xs text-muted-foreground truncate mt-0.5">{folder.description}</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── Open Folder — show images inside ── */}
          {activeTab === "folders" && openFolderId && (
            <>
              {/* Back button + folder title */}
              <div className="flex items-center gap-3 mb-4">
                <Button variant="ghost" size="sm" onClick={() => { setOpenFolderId(null); setFolderLightboxIdx(null); }}>
                  <ArrowLeft className="w-4 h-4 mr-1" /> All Collections
                </Button>
                <span className="text-muted-foreground text-sm">
                  {folderData?.folder ? (folderData.folder as {name:string}).name : ""}
                </span>
              </div>
              {folderImgsLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="aspect-square rounded-xl bg-muted animate-pulse" />)}
                </div>
              ) : folderImages.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                  <p>No images in this collection yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                  {folderImages.map((img, idx) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setFolderLightboxIdx(idx)}
                      className="rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-colors group cursor-pointer w-full"
                    >
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={img.imageUrl}
                          alt={img.caption || "jewellery wholesale India"}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading={idx < 8 ? "eager" : "lazy"}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Folder lightbox */}
              {folderLightboxIdx !== null && folderImages[folderLightboxIdx] && (
                <div
                  className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                  onClick={() => setFolderLightboxIdx(null)}
                >
                  <button className="absolute top-4 right-4 text-white p-2" onClick={() => setFolderLightboxIdx(null)}>✕</button>
                  <button className="absolute left-4 text-white p-3 text-2xl" onClick={e => { e.stopPropagation(); setFolderLightboxIdx(i => i === null ? null : (i - 1 + folderImages.length) % folderImages.length); }}>‹</button>
                  <img
                    src={folderImages[folderLightboxIdx].imageUrl}
                    alt={folderImages[folderLightboxIdx].caption || "jewellery"}
                    className="max-h-[85vh] max-w-full object-contain rounded-lg"
                    onClick={e => e.stopPropagation()}
                  />
                  <button className="absolute right-4 text-white p-3 text-2xl" onClick={e => { e.stopPropagation(); setFolderLightboxIdx(i => i === null ? null : (i + 1) % folderImages.length); }}>›</button>
                  <div className="absolute bottom-4 text-white/60 text-sm">{folderLightboxIdx + 1} / {folderImages.length}</div>
                </div>
              )}
            </>
          )}

          {/* ════════════════════════════════════════════════════════
               IMAGES TAB (original grid)
          ════════════════════════════════════════════════════════ */}
          {activeTab === "images" && isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
              {["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"].map((sk) => (
                <Skeleton key={sk} className="aspect-square rounded-lg" />
              ))}
            </div>
          ) : activeTab === "images" && displayItems.length === 0 ? (
            <div
              className="text-center py-16 md:py-20"
              data-ocid="gallery.empty_state"
            >
              <p className="text-4xl mb-4">🖼️</p>
              <p className="text-muted-foreground font-medium mb-2">
                No gallery images yet.
              </p>
              <p className="text-muted-foreground text-sm mb-6">
                Gallery images can be added from the admin panel.
              </p>
              <Button asChild className="bg-primary text-primary-foreground">
                <Link to="/contact">Request Catalogue Instead</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                {displayItems.map((item, idx) => (
                  <button
                    key={String(item.id)}
                    type="button"
                    className="rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-colors group cursor-pointer w-full text-left"
                    onClick={() => setLightboxIdx(idx)}
                    aria-label={`View ${item.caption || "image"} fullscreen`}
                    data-ocid={`gallery.item.${currentPage * GALLERY_PAGE_SIZE + idx + 1}`}
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={
                          item.caption
                            ? item.itemType
                              ? `${item.caption} — ${item.itemType} wholesale jewellery India`
                              : item.caption
                            : GALLERY_ALT_TEXTS[
                                (currentPage * GALLERY_PAGE_SIZE + idx) %
                                  GALLERY_ALT_TEXTS.length
                              ]
                        }
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading={idx < 4 ? "eager" : "lazy"}
                        width={400}
                        height={400}
                      />
                    </div>
                    {item.caption && (
                      <div className="p-2 md:p-3 bg-card">
                        <p className="text-xs md:text-sm font-medium text-foreground line-clamp-2">
                          {item.caption}
                        </p>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div
                  className="flex items-center justify-center gap-3 mt-8"
                  data-ocid="gallery.pagination"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                    className="min-h-[36px]"
                    data-ocid="gallery.pagination_prev"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage + 1} of {totalPages} &nbsp;·&nbsp;{" "}
                    {totalCount} images
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
                    }
                    disabled={currentPage >= totalPages - 1}
                    className="min-h-[36px]"
                    data-ocid="gallery.pagination_next"
                  >
                    Next <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <dialog
          open
          className="fixed inset-0 z-50 flex items-center justify-center m-0 p-0 w-full h-full max-w-none max-h-none border-0"
          aria-label="Image lightbox"
          data-ocid="gallery.modal"
          style={{ background: "rgba(0,0,0,0.95)" }}
          onClick={() => setLightboxIdx(null)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setLightboxIdx(null);
          }}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIdx(null);
            }}
            aria-label="Close lightbox"
            className="absolute top-3 right-3 md:top-4 md:right-4 w-11 h-11 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/30 transition-colors z-10"
            data-ocid="gallery.close_button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <img
            src={displayItems[lightboxIdx]?.imageUrl}
            alt={
              displayItems[lightboxIdx]?.caption || "Gemora Global jewellery"
            }
            className="max-h-[85vh] max-w-[85vw] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          />

          {displayItems[lightboxIdx]?.caption && (
            <div className="absolute bottom-14 md:bottom-6 left-1/2 -translate-x-1/2 bg-black/70 text-white text-sm px-4 py-2 rounded-full pointer-events-none max-w-[80vw] text-center">
              {displayItems[lightboxIdx].caption}
            </div>
          )}

          {displayItems.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goLightboxPrev();
                }}
                aria-label="Previous image"
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/30 transition-colors"
                data-ocid="gallery.lightbox_prev"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goLightboxNext();
                }}
                aria-label="Next image"
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/30 transition-colors"
                data-ocid="gallery.lightbox_next"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full pointer-events-none">
            {lightboxIdx + 1} / {displayItems.length}
          </div>
        </dialog>
      )}

      {/* Request Catalogue CTA */}
      <div className="bg-primary/10 border-y border-primary/20 py-10 md:py-12 px-4">
        <div className="container text-center">
          <h2 className="font-serif text-xl md:text-2xl font-bold mb-3">
            Request Our Full Catalogue
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6 text-sm md:text-base">
            This gallery represents a selection from our 500+ design catalogue.
            New designs are added every season. Contact our team to receive the
            complete digital catalogue with wholesale pricing, MOQ details, and
            new arrivals.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-lg font-medium transition-colors min-h-[44px] w-full sm:w-auto"
            data-ocid="gallery.primary_button"
          >
            Request Full Catalogue &amp; Pricing
          </Link>
        </div>
      </div>

      {/* Catalogues Download Section */}
      <div className="bg-card border-t border-border py-10 md:py-12 px-4">
        <div className="container">
          <h2 className="font-serif text-xl md:text-2xl font-bold mb-2">
            Download Catalogues
          </h2>
          <p className="text-muted-foreground mb-6 md:mb-8 text-sm md:text-base">
            Download our latest product catalogues to explore our full range.
          </p>
          {catalogues.length === 0 ? (
            <a
              href="/catalogue.pdf"
              download
              className="inline-flex items-center gap-3 bg-primary/10 border border-primary/30 hover:bg-primary/20 px-6 py-4 rounded-xl text-sm font-medium transition-colors min-h-[56px]"
            >
              <svg
                className="w-5 h-5 text-primary flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <div>
                <div className="font-semibold">Gemora Global Catalogue</div>
                <div className="text-muted-foreground text-xs mt-0.5">
                  PDF Download
                </div>
              </div>
            </a>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {catalogues.map((cat) => (
                <a
                  key={String(cat.id)}
                  href={cat.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={cat.fileName}
                  className="flex items-center gap-4 bg-background border border-border hover:border-primary/50 hover:bg-primary/5 px-5 py-4 rounded-xl transition-all group min-h-[72px]"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 text-2xl group-hover:bg-primary/20 transition-colors">
                    📄
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-sm truncate">
                      {cat.title}
                    </div>
                    {cat.description && (
                      <div className="text-muted-foreground text-xs mt-0.5 line-clamp-2">
                        {cat.description}
                      </div>
                    )}
                    <div className="text-primary text-xs mt-1 font-medium">
                      Click to Download →
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
