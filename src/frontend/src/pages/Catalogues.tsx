import { useQuery } from "@tanstack/react-query";
import { BookOpen, Download, FileText, Calendar, ExternalLink, Search, Sparkles, PhoneCall } from "lucide-react";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useCanonical } from "../hooks/useCanonical";
import { usePageSEO } from "../hooks/usePageSEO";
import api from "../lib/api";
import type { Catalogue } from "../lib/api";

// Curated list of user's Google Photos albums
interface GoogleAlbum {
  title: string;
  description: string;
  link: string;
  tag: string;
  category: "American Diamond (AD)" | "Traditional & Kundan" | "Western & Daily Wear";
  imageGradient: string;
}

const GOOGLE_ALBUMS: GoogleAlbum[] = [
  {
    title: "Anti-Tarnish Jewellery",
    description: "Premium sweat-proof, daily wear hypoallergenic jewelry with long-term anti-tarnish protection.",
    link: "https://photos.app.goo.gl/Cz2ytRVKiouKsFmc8",
    tag: "Sweat-Proof",
    category: "Western & Daily Wear",
    imageGradient: "linear-gradient(135deg, #1A237E 0%, #3949AB 100%)"
  },
  {
    title: "Western Chain Pendants",
    description: "Minimalist fashion pendants and delicate necklines, perfect for everyday contemporary styling.",
    link: "https://photos.app.goo.gl/FtFV6vNkAkocU5Zv5",
    tag: "Minimalist",
    category: "Western & Daily Wear",
    imageGradient: "linear-gradient(135deg, #004D40 0%, #00897B 100%)"
  },
  {
    title: "Mix Catalog Bestsellers",
    description: "A fast-moving fusion selection of trending rings, earrings, and necklaces.",
    link: "https://photos.app.goo.gl/X75FaHaVQHXrtqEJ8",
    tag: "Trending",
    category: "Traditional & Kundan",
    imageGradient: "linear-gradient(135deg, #E65100 0%, #FB8C00 100%)"
  },
  {
    title: "Western Earrings",
    description: "Modern daily wear studs, geometric hoops, and drops crafted for formal and casual wear.",
    link: "https://photos.app.goo.gl/8aFtqebYHgQKoVAi6",
    tag: "Bestseller",
    category: "Western & Daily Wear",
    imageGradient: "linear-gradient(135deg, #311B92 0%, #5E35B1 100%)"
  },
  {
    title: "Fancy AD Sets",
    description: "Exquisite heavy choker sets and royal design American Diamond sets with high refractive index.",
    link: "https://photos.app.goo.gl/iv1THmavUGXVMg2i6",
    tag: "Premium CZ",
    category: "American Diamond (AD)",
    imageGradient: "linear-gradient(135deg, #01579B 0%, #039BE5 100%)"
  },
  {
    title: "AD Mangalsutra",
    description: "Contemporary CZ studded designs that beautifully bridge traditional heritage and western styling.",
    link: "https://photos.app.goo.gl/1XdMr2LVnRH5eVMd7",
    tag: "Modern Ethnic",
    category: "American Diamond (AD)",
    imageGradient: "linear-gradient(135deg, #006064 0%, #00ACC1 100%)"
  },
  {
    title: "Gold Finish Oxidised Jewellery",
    description: "Premium dual-tone gold finish designer oxidised jewelry handcrafted in brass base.",
    link: "https://photos.app.goo.gl/PHAFyneiniaZgcGTA",
    tag: "Dual-Tone Gold",
    category: "Traditional & Kundan",
    imageGradient: "linear-gradient(135deg, #BF360C 0%, #F4511E 100%)"
  },
  {
    title: "Kashmiri & Kundan Earrings",
    description: "Authentic royal heritage drop earrings featuring pristine Kundan settings and premium beadwork.",
    link: "https://photos.app.goo.gl/8ssX1T798ZHgzoTq5",
    tag: "Heritage Craft",
    category: "Traditional & Kundan",
    imageGradient: "linear-gradient(135deg, #1B5E20 0%, #43A047 100%)"
  },
  {
    title: "AD Pendant Set",
    description: "Elegant matching CZ pendant and earring sets, exceptionally light and highly versatile.",
    link: "https://photos.app.goo.gl/hdXTqef433MszszW9",
    tag: "Lightweight",
    category: "American Diamond (AD)",
    imageGradient: "linear-gradient(135deg, #0D47A1 0%, #1E88E5 100%)"
  },
  {
    title: "Bracelet Cuff & AD",
    description: "Designer openable cuff bangles, tennis bracelets, and flexible modern bangles.",
    link: "https://photos.app.goo.gl/C13MGEHnBYEkKQef8",
    tag: "CZ Bracelets",
    category: "American Diamond (AD)",
    imageGradient: "linear-gradient(135deg, #4A148C 0%, #8E24AA 100%)"
  },
  {
    title: "AD Rings Collection",
    description: "Stunning range of premium adjustable American Diamond and statement cocktail rings.",
    link: "https://photos.app.goo.gl/LZEPJEcVJ7x3AYDs6",
    tag: "Adjustable",
    category: "American Diamond (AD)",
    imageGradient: "linear-gradient(135deg, #004D40 0%, #00796B 100%)"
  },
  {
    title: "Gold Finish Mangalsutra",
    description: "Classic gold plated daily wear and traditional bridal mangalsutra collections.",
    link: "https://photos.app.goo.gl/GPzKd6t7bMAhd4jQ7",
    tag: "Traditional Gold",
    category: "Traditional & Kundan",
    imageGradient: "linear-gradient(135deg, #827717 0%, #AFB42B 100%)"
  },
  {
    title: "Men's Jewellery",
    description: "Bold box link chains, thick metal bracelets, and minimal modern rings for men.",
    link: "https://photos.app.goo.gl/m2zj5Z4MfGDZkSgu9",
    tag: "Bold Masculine",
    category: "Western & Daily Wear",
    imageGradient: "linear-gradient(135deg, #212121 0%, #757575 100%)"
  },
  {
    title: "Chains Unisex",
    description: "High-grade brass chains in yellow gold, white gold, and rose gold plating patterns.",
    link: "https://photos.app.goo.gl/Sew49rvGb8cNWgGZ6",
    tag: "Unisex Links",
    category: "Western & Daily Wear",
    imageGradient: "linear-gradient(135deg, #1A237E 0%, #283593 100%)"
  },
  {
    title: "Colour Stone Pendants",
    description: "Sleek neckpieces featuring premium emerald green, ruby red, and blue sapphire CZ stones.",
    link: "https://photos.app.goo.gl/ahLtBbcugaEXmDnW7",
    tag: "Vibrant CZ",
    category: "Western & Daily Wear",
    imageGradient: "linear-gradient(135deg, #004D40 0%, #00695C 100%)"
  },
  {
    title: "Gold Finish Jewellery Set",
    description: "Breathtaking yellow gold plated wedding necklace sets with antique polish overlays.",
    link: "https://photos.app.goo.gl/z9tBaSUX7cMKyU5r8",
    tag: "Bridal Polish",
    category: "Traditional & Kundan",
    imageGradient: "linear-gradient(135deg, #FF6F00 0%, #FFB300 100%)"
  },
  {
    title: "Rajwadi Style Jewellery",
    description: "Grand royal heritage necklaces featuring matte gold highlights and Rajasthani royal artwork.",
    link: "https://photos.app.goo.gl/RBLZNVKH7xWY2WUu7",
    tag: "Rajwadi Antique",
    category: "Traditional & Kundan",
    imageGradient: "linear-gradient(135deg, #5D4037 0%, #8D6E63 100%)"
  },
  {
    title: "Kundan Jewellery Set",
    description: "Bespoke traditional Jaipuri Kundan necklace sets finished with dynamic meenakari colors.",
    link: "https://photos.app.goo.gl/wHAnzTFUy1kMEhxd9",
    tag: "Kundan Bridal",
    category: "Traditional & Kundan",
    imageGradient: "linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)"
  },
  {
    title: "Pearl Jewellery Set",
    description: "Pristine freshwater and high-gloss shell pearls layered to create absolute elegance.",
    link: "https://photos.app.goo.gl/3g8NnbsAodMHy8Ny8",
    tag: "Pearl Elegance",
    category: "Traditional & Kundan",
    imageGradient: "linear-gradient(135deg, #37474F 0%, #78909C 100%)"
  },
  {
    title: "AD Jewellery Set",
    description: "Luxurious American Diamond/Cubic Zirconia wedding and gala necklace collections.",
    link: "https://photos.app.goo.gl/yFW4LGzFz4XxfPUY9",
    tag: "Dazzling CZ",
    category: "American Diamond (AD)",
    imageGradient: "linear-gradient(135deg, #01579B 0%, #0288D1 100%)"
  },
  {
    title: "GS Oxidized Earrings",
    description: "Classic German Silver rustic oxidised earrings with vintage bohemian charm.",
    link: "https://photos.app.goo.gl/9pCy9tq7RXbAWoQd9",
    tag: "German Silver",
    category: "Traditional & Kundan",
    imageGradient: "linear-gradient(135deg, #263238 0%, #546E7A 100%)"
  }
];

export default function Catalogues() {
  useCanonical();

  usePageSEO({
    title: "Wholesale Jewellery Catalogues — Browse & Download | Gemora Global",
    description:
      "Browse our 21 Google Photos live collections and download wholesale imitation jewellery catalogues. Free B2B catalogues for Kundan, AD, Western and anti-tarnish jewelry.",
    canonical: "https://www.gemoraglobal.co/catalogues",
    ogTitle: "Wholesale Jewellery Catalogues — Gemora Global",
    ogDescription:
      "Explore 21 highly curated digital collections and download catalogues directly from Jaipur's leading wholesale imitation jewelry manufacturer.",
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
  const [activeTab, setActiveTab] = useState<"All" | "AD" | "Traditional" | "Western" | "PDF">("All");

  const pdfCatalogues = Array.isArray(catalogues) ? catalogues : [];

  // Filter Google Albums and PDF Catalogues
  const filteredAlbums = useMemo(() => {
    return GOOGLE_ALBUMS.filter(album => {
      // Tab matching
      if (activeTab === "AD" && album.category !== "American Diamond (AD)") return false;
      if (activeTab === "Traditional" && album.category !== "Traditional & Kundan") return false;
      if (activeTab === "Western" && album.category !== "Western & Daily Wear") return false;
      if (activeTab === "PDF") return false;

      // Search matching
      const query = search.toLowerCase();
      return (
        album.title.toLowerCase().includes(query) ||
        album.description.toLowerCase().includes(query) ||
        album.tag.toLowerCase().includes(query)
      );
    });
  }, [search, activeTab]);

  const filteredPdfs = useMemo(() => {
    if (activeTab !== "All" && activeTab !== "PDF") return [];
    return pdfCatalogues.filter(cat => {
      const query = search.toLowerCase();
      return (
        cat.title.toLowerCase().includes(query) ||
        (cat.description && cat.description.toLowerCase().includes(query))
      );
    });
  }, [pdfCatalogues, search, activeTab]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="pt-20 pb-10 md:pt-24 md:pb-14 bg-primary text-white relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-700/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="container px-4 md:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold mb-5 backdrop-blur-sm">
            <BookOpen className="w-3.5 h-3.5 text-accent animate-pulse" />
            Live B2B Catalogs &amp; Digital Portfolios
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            Explore Wholesale Jewellery Collections
          </h1>
          <p className="text-white/80 text-sm sm:text-base max-w-2xl mx-auto mb-6 leading-relaxed">
            Browse our 21 live digital Google Photos albums featuring 5,000+ ready stock designs, or download direct PDF specifications. Start your dream online jewelry business today with <strong>0 investment</strong>!
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            <span className="bg-white/15 border border-white/10 rounded-full px-3 py-1.5 backdrop-blur-sm">🚀 0 Investment Start</span>
            <span className="bg-white/15 border border-white/10 rounded-full px-3 py-1.5 backdrop-blur-sm">📸 21 Live Albums</span>
            <span className="bg-white/15 border border-white/10 rounded-full px-3 py-1.5 backdrop-blur-sm">💎 5,000+ Active Designs</span>
            <span className="bg-white/15 border border-white/10 rounded-full px-3 py-1.5 backdrop-blur-sm">🌍 Global Export Desk</span>
          </div>
        </div>
      </section>

      {/* Control Panel: Search & Filter Tabs */}
      <section className="container px-4 md:px-6 py-6 border-b border-border bg-card/30 backdrop-blur-sm sticky top-[64px] z-30">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Tabs */}
          <div className="flex flex-wrap gap-1.5 self-start w-full lg:w-auto">
            {[
              { id: "All", label: "All Collections" },
              { id: "AD", label: "American Diamond" },
              { id: "Traditional", label: "Traditional & Kundan" },
              { id: "Western", label: "Western & Minimalist" },
              { id: "PDF", label: `PDF Downloads (${pdfCatalogues.length})` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`text-xs font-semibold px-4 py-2.5 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]"
                    : "bg-muted/60 hover:bg-muted text-muted-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full lg:w-[320px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search collections (e.g. Kundan, AD)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs py-2.5 pl-10 pr-4 rounded-xl bg-card border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all"
            />
          </div>

        </div>
      </section>

      {/* Grid Content */}
      <section className="container px-4 md:px-6 py-8 md:py-12">
        
        {/* If no search results found */}
        {filteredAlbums.length === 0 && filteredPdfs.length === 0 ? (
          <div className="text-center py-20 bg-card/20 rounded-3xl border border-dashed border-border max-w-xl mx-auto">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground/45 mb-4 animate-bounce" />
            <h3 className="text-lg font-bold mb-1">No collections match your query</h3>
            <p className="text-sm text-muted-foreground mb-6 px-4">
              Try searching with different terms or check out our other premium wholesale categories.
            </p>
            <button
              onClick={() => { setSearch(""); setActiveTab("All"); }}
              className="bg-primary text-white font-semibold text-xs px-5 py-2.5 rounded-full hover:opacity-90"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-12">

            {/* Google Photos Showcase Grid */}
            {filteredAlbums.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-4 h-4 text-accent animate-pulse" />
                  <h2 className="font-serif text-lg sm:text-xl md:text-2xl font-bold text-indigo-950">
                    Live Digital Showcases ({filteredAlbums.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAlbums.map((album, idx) => (
                    <div
                      key={idx}
                      className="group rounded-2xl border border-border/80 bg-card hover:border-primary/45 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
                    >
                      <div>
                        {/* Header Image Accent */}
                        <div
                          className="h-[100px] w-full flex items-center justify-between p-4 text-white relative group-hover:opacity-95 transition-opacity"
                          style={{ background: album.imageGradient }}
                        >
                          <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full blur-xl pointer-events-none" />
                          <span className="text-[10px] font-bold tracking-wider uppercase bg-white/20 border border-white/25 px-2 py-0.5 rounded-full backdrop-blur-sm">
                            {album.category}
                          </span>
                          <span className="text-[10px] font-extrabold uppercase bg-accent text-indigo-950 px-2.5 py-1 rounded-full shadow-sm">
                            {album.tag}
                          </span>
                        </div>

                        {/* Details */}
                        <div className="p-5">
                          <h3 className="font-serif font-bold text-base sm:text-lg text-indigo-950 mb-1.5 group-hover:text-primary transition-colors">
                            {album.title}
                          </h3>
                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                            {album.description}
                          </p>
                        </div>
                      </div>

                      {/* Dual Action Buttons */}
                      <div className="p-5 pt-0 border-t border-border/20 mt-4 flex flex-col sm:flex-row gap-2">
                        <a
                          href={album.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-xs bg-indigo-950 text-white hover:bg-indigo-900 shadow-sm active:scale-[0.98] transition-all"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Browse Album
                        </a>
                        <a
                          href={`https://wa.me/919910646932?text=Hi%20Gemora%20Global%2C%20I%20am%20interested%20in%20sourcing%20from%20your%20collection%3A%20${encodeURIComponent(album.title)}%20(${album.link})`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1 py-2.5 px-3.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm active:scale-[0.98] transition-all"
                          title="Inquire about bulk pricing & MOQ for this collection"
                        >
                          Inquire
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dynamic PDF Catalogues Grid */}
            {filteredPdfs.length > 0 && (
              <div className="pt-6 border-t border-border/40">
                <div className="flex items-center gap-2 mb-6">
                  <FileText className="w-4 h-4 text-primary" />
                  <h2 className="font-serif text-lg sm:text-xl md:text-2xl font-bold text-indigo-950">
                    PDF Specifications &amp; Catalogs ({filteredPdfs.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPdfs.map((cat) => (
                    <div
                      key={cat.id}
                      className="group rounded-2xl border border-border bg-card hover:border-primary/45 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between"
                    >
                      <div className="p-6">
                        {/* Icon */}
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                          style={{ background: "#e8eaf6" }}
                        >
                          <FileText className="w-6 h-6 text-primary" />
                        </div>

                        {/* Title */}
                        <h3 className="font-semibold text-sm sm:text-base text-indigo-950 mb-1 line-clamp-2">
                          {cat.title}
                        </h3>

                        {/* Description */}
                        {cat.description && (
                          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                            {cat.description}
                          </p>
                        )}

                        {/* Meta */}
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

                      {/* Download */}
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
              </div>
            )}

          </div>
        )}
      </section>

      {/* Dream Business / MOQ 0 Investment CTA Section */}
      <section className="bg-primary/5 border-y border-primary/10 py-12 md:py-16 px-4">
        <div className="container max-w-4xl text-center">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
            🤝
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-indigo-950 mb-3">
            Start Your Dream Jewelry Business with 0 Investment!
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base mb-6 max-w-2xl mx-auto leading-relaxed">
            We provide full reselling support, high-resolution media, and wholesale dropshipping capabilities directly from our factory. Online sellers, Shopify storefronts, and boutique owners are welcome!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <a
              href="https://wa.me/919910646932?text=Hi%20Gemora%20Global%2C%20I%20want%20to%20join%20your%200%20investment%20reseller%20program%20and%20Dream%20Business%20program%20for%20online%20sellers."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-emerald-600/10 min-h-[44px] text-sm w-full sm:w-auto"
            >
              Start Selling (Join WhatsApp)
            </a>
            <a
              href="tel:+919910646932"
              className="inline-flex items-center justify-center gap-2 bg-indigo-950 text-white hover:bg-indigo-900 font-bold px-6 py-3 rounded-xl transition-all shadow-md min-h-[44px] text-sm w-full sm:w-auto"
            >
              <PhoneCall className="w-4 h-4 text-accent" />
              Call +91 9910646932
            </a>
          </div>
        </div>
      </section>

      {/* Contextual SEO links */}
      <section className="container px-4 py-10 md:py-12">
        <h3 className="font-serif text-lg font-bold text-indigo-950 mb-3">
          Browse Our Wholesale Collections
        </h3>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed max-w-2xl">
          Gemora Global is a Jaipur-based{" "}
          <Link to="/imitation-jewellery-manufacturer-jaipur" className="text-primary hover:underline font-semibold">
            imitation jewellery manufacturer
          </Link>{" "}
          supplying{" "}
          <Link to="/wholesale-imitation-jewellery-manufacturer-exporter" className="text-primary hover:underline font-semibold">
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
              className="inline-block text-xs font-medium px-3.5 py-1.5 rounded-xl border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-colors"
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
