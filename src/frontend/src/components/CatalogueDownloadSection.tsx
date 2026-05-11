import { useQuery } from "@tanstack/react-query";
import { Download, FileText, Loader2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import api, { type Catalogue } from "../lib/api";

export default function CatalogueDownloadSection({ limit }: { limit?: number }) {
  const { data: catalogues, isLoading } = useQuery<Catalogue[]>({
    queryKey: ["catalogues"],
    queryFn: () => api.getCatalogues(),
  });

  const items = Array.isArray(catalogues) ? catalogues : [];
  const displayItems = limit ? items.slice(0, limit) : items;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
        <p className="text-muted-foreground text-sm">Loading catalogues...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-primary/5 border border-primary/10 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-primary/40" />
        </div>
        <h3 className="font-serif text-xl font-bold mb-2">Latest Catalogues Coming Soon</h3>
        <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
          We are currently updating our collection with 500+ new designs. Please contact our export team directly for a personalized PDF catalogue.
        </p>
        <a
          href="https://wa.me/917976341419?text=Hi%20Gemora%20Global%2C%20I%20need%20the%20latest%20wholesale%20catalogue"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold px-6 py-3 rounded-full transition-colors"
        >
          Request via WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayItems.map((cat) => (
          <div
            key={cat.id}
            className="group relative bg-card border border-border rounded-2xl p-5 hover:border-primary/40 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-base text-foreground mb-1 truncate">
                  {cat.title}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {cat.fileName || "Catalogue PDF"}
                </p>
              </div>
            </div>
            
            {cat.description && (
              <p className="text-xs text-muted-foreground mb-5 line-clamp-2 leading-relaxed">
                {cat.description}
              </p>
            )}

            <div className="flex items-center justify-between gap-3 mt-auto">
              <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                {cat.uploadedAt || "Latest"}
              </div>
              <a
                href={cat.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </a>
            </div>
          </div>
        ))}
      </div>

      {limit && items.length > limit && (
        <div className="text-center pt-4">
          <Link
            to="/catalogues"
            className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
          >
            View All Catalogues
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
