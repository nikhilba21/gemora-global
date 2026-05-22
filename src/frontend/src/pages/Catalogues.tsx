import { useQuery } from "@tanstack/react-query";
import { BookOpen, Download, FileText, Calendar, Search } from "lucide-react";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useCanonical } from "../hooks/useCanonical";
import { usePageSEO } from "../hooks/usePageSEO";
import api from "../lib/api";
import type { Catalogue } from "../lib/api";

export default function Catalogues() {
  useCanonical();

  usePageSEO({
    title: "Wholesale Jewellery PDF Catalogues — Download | Gemora Global",
    description:
      "Download wholesale imitation jewellery PDF catalogues and spec sheets. Access lightweight digital guides for B2B sourcing from Gemora Global.",
    canonical: "https://www.gemoraglobal.co/catalogues",
    breadcrumbs: [
      { name: "Home", url: "https://www.gemoraglobal.co/" },
      { name: "Catalogues", url: "https://www.gemoraglobal.co/catalogues" },
    ],
  });

  const { data: catalogues, isLoading } = useQuery<Catalogue[]>({
    queryKey: ["catalogues"],
    queryFn: () => api.getCatalogues(),
  });

  const [search, setSearch] = useState("");

  const pdfCatalogues = Array.isArray(catalogues) ? catalogues : [];

  const filteredPdfs = useMemo(() => {
    return pdfCatalogues.filter(cat => {
      const query = search.toLowerCase();
      return (
        cat.title.toLowerCase().includes(query) ||
        (cat.description && cat.description.toLowerCase().includes(query))
      );
    });
  }, [pdfCatalogues, search]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="pt-20 pb-10 md:pt-24 md:pb-14 bg-primary text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-700/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="container px-4 md:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold mb-5 backdrop-blur-sm">
            <BookOpen className="w-3.5 h-3.5 text-accent" />
            B2B PDF Catalogues
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            Wholesale Catalogues &amp; Spec Sheets
          </h1>
          <p className="text-white/80 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Download comprehensive catalogue guides, brand spec sheets, and price books in PDF format for offline B2B sourcing.
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="container px-4 md:px-6 py-6 border-b border-border bg-card/30 backdrop-blur-sm sticky top-[64px] z-30">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-sm font-bold text-indigo-950 uppercase tracking-wider">
            Available PDF Catalogs ({filteredPdfs.length})
          </h2>
          <div className="relative w-full sm:w-[320px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search PDF catalog name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs py-2.5 pl-10 pr-4 rounded-xl bg-card border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
        </div>
      </section>

      {/* Grid Content */}
      <section className="container px-4 md:px-6 py-8 md:py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : filteredPdfs.length === 0 ? (
          <div className="text-center py-20 bg-card/20 rounded-3xl border border-dashed border-border max-w-xl mx-auto">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground/45 mb-4" />
            <h3 className="text-lg font-bold mb-1">No PDF catalogs found</h3>
            <p className="text-sm text-muted-foreground mb-6 px-4">
              Try searching with different keywords or check out our live interactive design gallery.
            </p>
            <Link
              to="/gallery"
              className="bg-primary text-white font-semibold text-xs px-5 py-2.5 rounded-xl hover:opacity-90 inline-block shadow-md"
            >
              Browse Design Gallery
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPdfs.map((cat) => (
              <div
                key={cat.id}
                className="group rounded-2xl border border-border bg-card hover:border-primary/45 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div className="p-6">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                    style={{ background: "#e8eaf6" }}
                  >
                    <FileText className="w-6 h-6 text-primary" />
                  </div>

                  <h3 className="font-semibold text-sm sm:text-base text-indigo-950 mb-1 line-clamp-2">
                    {cat.title}
                  </h3>

                  {cat.description && (
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {cat.description}
                    </p>
                  )}

                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground mb-4">
                    {cat.fileName && (
                      <span className="flex items-center gap-1 truncate max-w-[120px]">
                        <FileText className="w-3 h-3" />
                        {cat.fileName}
                      </span>
                    )}
                    {cat.uploadedAt && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {cat.uploadedAt}
                      </span>
                    )}
                  </div>
                </div>

                {cat.fileUrl && (
                  <div className="p-6 pt-0">
                    <a
                      href={cat.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-semibold text-xs text-white bg-primary hover:opacity-90 transition-all active:scale-[0.98]"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download PDF
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
