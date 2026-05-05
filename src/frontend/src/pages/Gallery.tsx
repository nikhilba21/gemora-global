import api from '../lib/api';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, FolderOpen, Images, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { usePageSEO } from "../hooks/usePageSEO";
import type { GalleryItem } from "../types";
import { useCanonical } from '../hooks/useCanonical';

const GALLERY_PAGE_SIZE = 12;

export default function Gallery() {
  useCanonical();

  usePageSEO({
    title: "Imitation Jewellery Photo Gallery — Wholesale Catalogue | Gemora Global",
    description:
      "View wholesale imitation jewellery gallery. Request catalogue for pricing and MOQ.",
    canonical: "https://www.gemoraglobal.co/gallery",
  });

  const [filter, setFilter] = useState("");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const { data: catalogues = [] } = useQuery({
    queryKey: ["catalogues"],
    queryFn: () => api.getCatalogues(),
  });

  // ✅ FIXED QUERY (NO SYNTAX ERROR)
  const { data: pagedResult, isLoading } = useQuery({
    queryKey: ["gallery-paginated", filter, currentPage],
    queryFn: () =>
      api.getGalleryPaginated({
        page: String(currentPage),
        pageSize: String(GALLERY_PAGE_SIZE),
      }),
  });

  const displayItems: GalleryItem[] = pagedResult?.items || [];
  const totalPages = pagedResult ? Number(pagedResult.pages) : 0;

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
        <h1 className="text-3xl font-bold mb-6">
          Jewellery Gallery
        </h1>

        {/* GRID */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1,2,3,4,5,6].map(i => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {displayItems.map((item, idx) => (
              <div
                key={idx}
                className="border rounded-lg overflow-hidden cursor-pointer"
                onClick={() => setLightboxIdx(idx)}
              >
                <img
                  src={item.imageUrl}
                  alt={item.caption || "gallery"}
                  className="w-full h-48 object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* PAGINATION */}
        <div className="flex justify-center gap-4 mt-8">
          <Button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 0))}
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Prev
          </Button>

          <Button
            onClick={() => setCurrentPage(p => p + 1)}
          >
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* LIGHTBOX */}
      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxIdx(null)}
        >
          <img
            src={displayItems[lightboxIdx]?.imageUrl}
            className="max-h-[80vh] max-w-[90vw]"
          />
        </div>
      )}

      {/* CTA */}
      <div className="text-center py-10">
        <Link to="/contact">
          <Button>Request Full Catalogue</Button>
        </Link>
      </div>

      <Footer />
    </div>
  );
}
