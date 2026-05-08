import { useQuery } from "@tanstack/react-query";
import { BookOpen, Download, FileText, Calendar } from "lucide-react";
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
    title: "Wholesale Jewellery Catalogues — Download PDF | Gemora Global",
    description:
      "Download latest wholesale imitation jewellery catalogues from Gemora Global. Browse Kundan, Bridal, Oxidised, Fashion Jewellery designs with pricing. Free PDF download for international buyers.",
    canonical: "https://www.gemoraglobal.co/catalogues",
    ogTitle: "Wholesale Jewellery Catalogues — Gemora Global",
    ogDescription:
      "Download our latest wholesale jewellery catalogues. 500+ designs across Kundan, Bridal, Oxidised & Fashion Jewellery categories.",
    breadcrumbs: [
      { name: "Home", url: "https://www.gemoraglobal.co/" },
      { name: "Catalogues", url: "https://www.gemoraglobal.co/catalogues" },
    ],
  });

  const { data: catalogues, isLoading } = useQuery<Catalogue[]>({
    queryKey: ["catalogues"],
    queryFn: () => api.getCatalogues(),
  });

  const items = Array.isArray(catalogues) ? catalogues : [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="pt-20 pb-10 md:pt-24 md:pb-14 bg-primary text-white">
        <div className="container px-4 md:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold mb-5">
            <BookOpen className="w-3.5 h-3.5" />
            Product Catalogues
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            Wholesale Jewellery Catalogues
          </h1>
          <p className="text-white/75 text-sm md:text-base max-w-2xl mx-auto mb-6">
            Download our latest product catalogues featuring 500+ designs across{" "}
            <Link to="/kundan-jewellery-wholesale" className="text-accent hover:underline">Kundan</Link>,{" "}
            <Link to="/bridal-jewellery-wholesale" className="text-accent hover:underline">Bridal</Link>,{" "}
            <Link to="/oxidised-jewellery-wholesale" className="text-accent hover:underline">Oxidised</Link>, and{" "}
            <Link to="/fashion-jewellery-exporter" className="text-accent hover:underline">Fashion Jewellery</Link>{" "}
            categories. Free PDF downloads for wholesale buyers worldwide.
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            <span className="bg-white/10 border border-white/20 rounded-full px-3 py-1.5">📥 Free Download</span>
            <span className="bg-white/10 border border-white/20 rounded-full px-3 py-1.5">📄 PDF Format</span>
            <span className="bg-white/10 border border-white/20 rounded-full px-3 py-1.5">💎 500+ Designs</span>
            <span className="bg-white/10 border border-white/20 rounded-full px-3 py-1.5">🌍 Global Shipping</span>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="container px-4 py-3 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="mx-1.5">›</span>
        <span className="text-foreground font-medium">Catalogues</span>
      </div>

      {/* Catalogues Grid */}
      <section className="container px-4 md:px-6 py-8 md:py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-6 animate-pulse">
                <div className="w-14 h-14 bg-muted rounded-xl mb-4" />
                <div className="h-5 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-full mb-4" />
                <div className="h-10 bg-muted rounded-lg" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="text-xl font-bold mb-2">No Catalogues Available Yet</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Our team is preparing the latest collections. Please check back soon or contact us directly.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-full hover:bg-primary/90 transition-colors"
            >
              Request Catalogue via WhatsApp
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl md:text-2xl font-bold">
                All Catalogues ({items.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {items.map((cat) => (
                <div
                  key={cat.id}
                  className="group rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    {/* Icon */}
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                      style={{ background: "#e8eaf6" }}
                    >
                      <FileText className="w-7 h-7" style={{ color: "#1A237E" }} />
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-base md:text-lg text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                      {cat.title}
                    </h3>

                    {/* Description */}
                    {cat.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {cat.description}
                      </p>
                    )}

                    {/* Meta */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                      {cat.fileName && (
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {cat.fileName}
                        </span>
                      )}
                      {cat.uploadedAt && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(cat.uploadedAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      )}
                    </div>

                    {/* Download Button */}
                    {cat.fileUrl && (
                      <a
                        href={cat.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 active:scale-[0.98]"
                        style={{ background: "#1A237E" }}
                      >
                        <Download className="w-4 h-4" />
                        Download PDF
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 border-y border-primary/10 py-10 md:py-14 px-4">
        <div className="container text-center">
          <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground mb-3">
            Need a Custom Catalogue?
          </h2>
          <p className="text-muted-foreground text-sm md:text-base mb-6 max-w-xl mx-auto">
            We can prepare a personalized wholesale catalogue based on your requirements — including{" "}
            <Link to="/private-label-jewellery-india" className="text-primary hover:underline">
              private label jewellery
            </Link>{" "}
            and{" "}
            <Link to="/custom-jewellery-manufacturer" className="text-primary hover:underline">
              custom designs
            </Link>.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/917976341419?text=Hi%20Gemora%20Global%2C%20I%20need%20a%20custom%20wholesale%20catalogue"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold px-6 py-3 rounded-full transition-colors min-h-[44px]"
            >
              WhatsApp for Custom Catalogue
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-full hover:bg-primary/90 transition-colors min-h-[44px]"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Contextual SEO links */}
      <section className="container px-4 py-10 md:py-12">
        <h3 className="font-serif text-lg font-bold text-foreground mb-3">
          Browse Our Wholesale Collections
        </h3>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed max-w-2xl">
          Gemora Global is a Jaipur-based{" "}
          <Link to="/imitation-jewellery-manufacturer-jaipur" className="text-primary hover:underline">
            imitation jewellery manufacturer
          </Link>{" "}
          supplying{" "}
          <Link to="/wholesale-imitation-jewellery-manufacturer-exporter-india" className="text-primary hover:underline">
            wholesale fashion jewellery
          </Link>{" "}
          to 30+ countries worldwide.
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Kundan Jewellery", to: "/kundan-jewellery-wholesale" },
            { label: "Bridal Jewellery", to: "/bridal-jewellery-wholesale" },
            { label: "Oxidised Jewellery", to: "/oxidised-jewellery-wholesale" },
            { label: "Fashion Jewellery", to: "/fashion-jewellery-exporter" },
            { label: "All Products", to: "/products" },
            { label: "Wholesale Guide", to: "/wholesale" },
          ].map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className="inline-block text-xs font-medium px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 transition-colors"
            >
              {c.label}
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
