import { useQuery } from "@tanstack/react-query";
import { BookOpen, FileText, Calendar, Search, Sparkles, PhoneCall, X, Loader2, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useCanonical } from "../hooks/useCanonical";
import { usePageSEO } from "../hooks/usePageSEO";
import api from "../lib/api";

interface CountrySetting {
  code: string;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  active: boolean;
  customPricing: boolean;
  priceMultiplier: string;
}

const DEFAULT_COUNTRIES: CountrySetting[] = [
  { code: "IN", name: "India", flag: "🇮🇳", currency: "INR", currencySymbol: "₹", active: true, customPricing: false, priceMultiplier: "1.0" },
  { code: "US", name: "USA", flag: "🇺🇸", currency: "USD", currencySymbol: "$", active: true, customPricing: true, priceMultiplier: "1.2" },
  { code: "GB", name: "UK", flag: "🇬🇧", currency: "GBP", currencySymbol: "£", active: true, customPricing: true, priceMultiplier: "1.1" },
  { code: "AE", name: "UAE", flag: "🇦🇪", currency: "AED", currencySymbol: "AED", active: true, customPricing: true, priceMultiplier: "1.15" },
  { code: "AU", name: "Australia", flag: "🇦🇺", currency: "AUD", currencySymbol: "A$", active: true, customPricing: false, priceMultiplier: "1.25" },
  { code: "CA", name: "Canada", flag: "🇨🇦", currency: "CAD", currencySymbol: "C$", active: true, customPricing: false, priceMultiplier: "1.2" },
  { code: "SG", name: "Singapore", flag: "🇸🇬", currency: "SGD", currencySymbol: "S$", active: true, customPricing: false, priceMultiplier: "1.15" },
  { code: "MY", name: "Malaysia", flag: "🇲🇾", currency: "MYR", currencySymbol: "RM", active: true, customPricing: false, priceMultiplier: "1.1" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦", currency: "SAR", currencySymbol: "SAR", active: true, customPricing: false, priceMultiplier: "1.2" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬", currency: "NGN", currencySymbol: "₦", active: true, customPricing: false, priceMultiplier: "1.3" },
  { code: "LK", name: "Sri Lanka", flag: "🇱🇰", currency: "LKR", currencySymbol: "Rs", active: true, customPricing: false, priceMultiplier: "1.1" },
  { code: "KW", name: "Kuwait", flag: "🇰🇼", currency: "KWD", currencySymbol: "KD", active: true, customPricing: false, priceMultiplier: "1.2" },
  { code: "FR", name: "France/Europe", flag: "🇫🇷", currency: "EUR", currencySymbol: "€", active: true, customPricing: true, priceMultiplier: "1.15" }
];

const EXCHANGE_RATES: Record<string, number> = {
  INR: 1.0,
  USD: 0.012,
  GBP: 0.0095,
  AED: 0.044,
  AUD: 0.018,
  CAD: 0.016,
  SGD: 0.016,
  MYR: 0.056,
  SAR: 0.045,
  NGN: 18.0,
  LKR: 3.6,
  KWD: 0.0037,
  EUR: 0.011
};

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

export default function Gallery() {
  useCanonical();

  // Country & Pricing Calculator States
  const [countriesList] = useState<CountrySetting[]>(() => {
    try {
      const s = localStorage.getItem("gemora_country_settings");
      return s ? JSON.parse(s) : DEFAULT_COUNTRIES;
    } catch {
      return DEFAULT_COUNTRIES;
    }
  });

  const [selectedCountry, setSelectedCountry] = useState<CountrySetting>(() => {
    try {
      const storedCode = localStorage.getItem("gemora_user_country");
      const activeCountries = countriesList.filter(c => c.active);
      const found = activeCountries.find(c => c.code === storedCode);
      if (found) return found;
      return activeCountries.find(c => c.code === "US") || activeCountries[0];
    } catch {
      return countriesList[0];
    }
  });

  const [calcInput, setCalcInput] = useState("");

  const calculatePrice = (codeStr: string, country: CountrySetting) => {
    if (!codeStr) return null;
    const match = codeStr.match(/([A-Z]{0,3})[-]?([0-9]+)/i);
    if (!match) return null;
    
    const prefix = match[1].toUpperCase();
    const num = parseInt(match[2], 10);
    if (isNaN(num)) return null;

    const basePriceINR = num * 10;
    const rate = EXCHANGE_RATES[country.currency] || 0.012;
    const multiplier = parseFloat(country.priceMultiplier) || 1.0;
    
    const finalPrice = basePriceINR * rate * multiplier;
    
    return {
      basePriceINR,
      finalPrice,
      currencySymbol: country.currencySymbol,
      currency: country.currency,
      prefix,
      num
    };
  };

  usePageSEO({
    title: "Imitation Jewellery Photo Gallery — Live Stock Catalogues | Gemora Global",
    description:
      "Explore our 21 live digital jewelry gallery collections. Synced directly from our workshop. Browse real-time new arrivals for Kundan, Bridal, AD, and Anti-tarnish jewelry.",
    canonical: "https://www.gemoraglobal.co/gallery",
  });

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"All" | "AD" | "Traditional" | "Western">("All");

  // Real-time album viewer states
  const [selectedAlbum, setSelectedAlbum] = useState<GoogleAlbum | null>(null);
  const [albumImages, setAlbumImages] = useState<string[]>([]);
  const [loadingAlbum, setLoadingAlbum] = useState(false);
  const [albumError, setAlbumError] = useState("");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  // Filter Google Albums
  const filteredAlbums = useMemo(() => {
    return GOOGLE_ALBUMS.filter(album => {
      if (activeTab === "AD" && album.category !== "American Diamond (AD)") return false;
      if (activeTab === "Traditional" && album.category !== "Traditional & Kundan") return false;
      if (activeTab === "Western" && album.category !== "Western & Daily Wear") return false;

      const query = search.toLowerCase();
      return (
        album.title.toLowerCase().includes(query) ||
        album.description.toLowerCase().includes(query) ||
        album.tag.toLowerCase().includes(query)
      );
    });
  }, [search, activeTab]);

  // Load Album Images dynamically
  const handleOpenAlbum = async (album: GoogleAlbum) => {
    setSelectedAlbum(album);
    setLoadingAlbum(true);
    setAlbumError("");
    setAlbumImages([]);
    try {
      const data = await api.getGooglePhotos(album.link);
      if (data && Array.isArray(data.images) && data.images.length > 0) {
        const formatted = data.images.map(url => `${url}=w600-h600-c`);
        setAlbumImages(formatted);
      } else {
        setAlbumError("No images found in this live collection yet.");
      }
    } catch (e) {
      setAlbumError("Failed to fetch live collection. Please try again later.");
    } finally {
      setLoadingAlbum(false);
    }
  };

  // Lock scroll when modal is active
  useEffect(() => {
    if (selectedAlbum || lightboxIdx !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [selectedAlbum, lightboxIdx]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="pt-20 pb-10 md:pt-24 md:pb-14 bg-primary text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-700/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="container px-4 md:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold mb-5 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
            Live Stock Jewellery Gallery
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            Jewellery Design Gallery
          </h1>
          <p className="text-white/80 text-sm sm:text-base max-w-2xl mx-auto mb-6 leading-relaxed">
            Explore our 21 live digital gallery collections synced straight from our factory. Start your dream online reselling business with <strong>0 investment</strong>! Any new stocks added are automatically tagged and updated.
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            <span className="bg-white/15 border border-white/10 rounded-full px-3 py-1.5 backdrop-blur-sm">🚀 0 Investment Start</span>
            <span className="bg-white/15 border border-white/10 rounded-full px-3 py-1.5 backdrop-blur-sm">📸 Live Auto-Sync</span>
            <span className="bg-white/15 border border-white/10 rounded-full px-3 py-1.5 backdrop-blur-sm">💎 5,000+ Active Designs</span>
            <span className="bg-white/15 border border-white/10 rounded-full px-3 py-1.5 backdrop-blur-sm">🌍 Global Export Desk</span>
          </div>
        </div>
      </section>

      {/* ── B2B PRICING CALCULATOR SECTION ── */}
      <section className="container px-4 md:px-6 py-6 mt-4">
        <div className="bg-gradient-to-r from-indigo-950 to-slate-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl border border-indigo-900/50">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-12 gap-6 items-center">
            <div className="md:col-span-6 col-span-12 space-y-3">
              <span className="text-[10px] font-extrabold uppercase bg-accent/20 border border-accent/30 text-accent px-3 py-1 rounded-full tracking-wider inline-block">
                B2B Global Trade Utility
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight">
                Live Wholesale Pricing Calculator
              </h2>
              <p className="text-xs text-white/70 leading-relaxed max-w-md">
                Every gallery design has a unique code (e.g. <strong>RJ250</strong>, <strong>N180</strong>) watermarked physically on the image. Select your target export market below and type the code to calculate the direct workshop wholesale price.
              </p>
            </div>

            <div className="md:col-span-6 col-span-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 md:p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {/* Country Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/60 uppercase">Target Country</label>
                  <select
                    value={selectedCountry.code}
                    onChange={(e) => {
                      const found = countriesList.find(c => c.code === e.target.value);
                      if (found) {
                        setSelectedCountry(found);
                        localStorage.setItem("gemora_user_country", found.code);
                      }
                    }}
                    className="w-full text-xs bg-slate-900/80 border border-white/15 rounded-xl px-3 py-2.5 text-white outline-none focus:border-accent/50 cursor-pointer"
                  >
                    {countriesList.filter(c => c.active).map(c => (
                      <option key={c.code} value={c.code} className="bg-slate-950 text-white">
                        {c.flag} {c.name} ({c.currency})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Code Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/60 uppercase">Image Code</label>
                  <input
                    type="text"
                    placeholder="e.g. RJ250"
                    value={calcInput}
                    onChange={(e) => setCalcInput(e.target.value)}
                    className="w-full text-xs bg-slate-900/80 border border-white/15 rounded-xl px-3 py-2.5 text-white placeholder-white/35 outline-none focus:border-accent/50"
                  />
                </div>
              </div>

              {/* Real-time Pricing Result Box */}
              {calcInput.trim() ? (
                (() => {
                  const result = calculatePrice(calcInput, selectedCountry);
                  if (result) {
                    return (
                      <div className="bg-emerald-600/10 border border-emerald-500/20 rounded-xl p-4 flex items-center justify-between animate-fadeIn">
                        <div>
                          <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Wholesale B2B Price</p>
                          <p className="font-sans font-bold text-xl sm:text-2xl text-white mt-1">
                            {result.currencySymbol}
                            {result.finalPrice.toLocaleString(undefined, {
                              minimumFractionDigits: result.currency === "INR" ? 0 : 2,
                              maximumFractionDigits: result.currency === "INR" ? 0 : 2
                            })}{" "}
                            <span className="text-xs font-semibold text-white/60">{result.currency}</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="inline-block text-[9px] font-bold bg-white/10 px-2 py-0.5 rounded-full text-white/80">
                            Base: ₹{result.basePriceINR.toLocaleString()} INR
                          </span>
                          <p className="text-[9px] text-white/50 mt-1">Multiplier: {selectedCountry.priceMultiplier}x</p>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-center text-xs text-amber-300">
                      Could not detect code. Please enter letters followed by digits (e.g. RJ120).
                    </div>
                  );
                })()
              ) : (
                <div className="bg-slate-900/40 border border-white/5 rounded-xl p-4 text-center text-xs text-white/40 italic">
                  Enter a code above to view live localized wholesale pricing.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Control Panel: Search & Filter Tabs */}
      <section className="container px-4 md:px-6 py-6 border-b border-border bg-card/30 backdrop-blur-sm sticky top-[64px] z-30">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          
          <div className="flex flex-wrap gap-1.5 self-start w-full lg:w-auto">
            {[
              { id: "All", label: "All Collections" },
              { id: "AD", label: "American Diamond" },
              { id: "Traditional", label: "Traditional & Kundan" },
              { id: "Western", label: "Western & Minimalist" },
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
        
        {filteredAlbums.length === 0 ? (
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
                    Live Collections ({filteredAlbums.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAlbums.map((album, idx) => (
                    <div
                      key={idx}
                      className="group rounded-2xl border border-border/80 bg-card hover:border-primary/45 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
                    >
                      <div>
                        <div
                          className="h-[100px] w-full flex items-center justify-between p-4 text-white relative group-hover:opacity-95 transition-opacity"
                          style={{ background: album.imageGradient }}
                        >
                          <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full blur-xl pointer-events-none" />
                          <span className="text-[10px] font-bold tracking-wider uppercase bg-white/20 border border-white/25 px-2 py-0.5 rounded-full backdrop-blur-sm">
                            {album.category}
                          </span>
                          <span className="text-[10px] font-extrabold uppercase bg-accent text-indigo-950 px-2.5 py-1 rounded-full shadow-sm animate-pulse">
                            Live Sync
                          </span>
                        </div>

                        <div className="p-5">
                          <h3 className="font-serif font-bold text-base sm:text-lg text-indigo-950 mb-1.5 group-hover:text-primary transition-colors">
                            {album.title}
                          </h3>
                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                            {album.description}
                          </p>
                        </div>
                      </div>

                      {/* Browse Button ONLY - No Redirect link */}
                      <div className="p-5 pt-0 border-t border-border/20 mt-4 flex">
                        <button
                          onClick={() => handleOpenAlbum(album)}
                          className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-xs bg-indigo-950 text-white hover:bg-indigo-900 shadow-sm active:scale-[0.98] transition-all"
                        >
                          <Eye className="w-4 h-4 text-accent" />
                          Browse
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </section>

      {/* ── REAL-TIME ALBUM PHOTOS MODAL ── */}
      {selectedAlbum && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-6xl h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-border">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-muted/20">
              <div>
                <h3 className="font-serif font-bold text-lg sm:text-xl text-indigo-950 flex items-center gap-2">
                  {selectedAlbum.title}
                  <span className="text-[10px] font-bold uppercase bg-primary/10 border border-primary/20 text-primary px-2.5 py-0.5 rounded-full">
                    Live Stock
                  </span>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 max-w-xl">
                  {selectedAlbum.description}
                </p>
              </div>

              {/* Modal quick calculator */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto bg-card border border-border rounded-2xl p-2.5 shadow-sm">
                <span className="text-[10px] font-bold text-indigo-950 uppercase pl-1.5 hidden sm:inline">Pricing Calc:</span>
                <input
                  type="text"
                  placeholder="Type code (e.g. RJ150)"
                  value={calcInput}
                  onChange={(e) => setCalcInput(e.target.value)}
                  className="text-xs bg-muted/50 border border-border rounded-xl px-3 py-1.5 w-32 focus:border-primary/50 outline-none text-indigo-950 font-medium"
                />
                
                {calcInput.trim() && (() => {
                  const result = calculatePrice(calcInput, selectedCountry);
                  return result ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs font-bold rounded-xl px-3 py-1.5 animate-fadeIn">
                      {result.currencySymbol}
                      {result.finalPrice.toLocaleString(undefined, {
                        minimumFractionDigits: result.currency === "INR" ? 0 : 2,
                        maximumFractionDigits: result.currency === "INR" ? 0 : 2
                      })}
                    </div>
                  ) : null;
                })()}
                
                <select
                  value={selectedCountry.code}
                  onChange={(e) => {
                    const found = countriesList.find(c => c.code === e.target.value);
                    if (found) {
                      setSelectedCountry(found);
                      localStorage.setItem("gemora_user_country", found.code);
                    }
                  }}
                  className="text-xs bg-muted/50 border border-border rounded-xl px-2 py-1.5 outline-none cursor-pointer text-indigo-950 font-semibold"
                >
                  {countriesList.filter(c => c.active).map(c => (
                    <option key={c.code} value={c.code}>{c.flag} {c.currency}</option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={() => setSelectedAlbum(null)}
                className="p-2 hover:bg-muted rounded-full transition-colors self-end md:self-center"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-background">
              {loadingAlbum ? (
                <div className="h-full flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  <p className="text-sm font-semibold text-muted-foreground">Syncing images from Google Photos in real-time...</p>
                </div>
              ) : albumError ? (
                <div className="h-full flex flex-col items-center justify-center gap-4 text-center max-w-md mx-auto">
                  <span className="text-4xl">⚠️</span>
                  <p className="text-sm font-semibold text-red-500">{albumError}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Dynamic Alert Banner */}
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs rounded-2xl p-4 flex items-center gap-3">
                    <span className="text-lg">📢</span>
                    <p className="leading-relaxed">
                      This collection is linked directly to our design workshop. Any new pieces added to the workshop are synced here automatically. <strong>First 8 designs are tagged with "NEW"!</strong> Click any image to open full preview.
                    </p>
                  </div>

                  {/* Photo Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {albumImages.map((imageUrl, idx) => (
                      <div
                        key={idx}
                        className="relative group border border-border/80 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 bg-card aspect-square"
                        onClick={() => setLightboxIdx(idx)}
                      >
                        <img
                          src={imageUrl}
                          alt={`${selectedAlbum.title} design ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        
                        {/* Automated 'NEW' Arrival Badge on first 8 images */}
                        {idx < 8 && (
                          <div className="absolute top-2.5 left-2.5 bg-green-600 text-white font-extrabold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md animate-pulse">
                            NEW
                          </div>
                        )}

                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <span className="bg-white/90 text-indigo-950 font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-md flex items-center gap-1 scale-95 group-hover:scale-100 transition-transform">
                            <Eye className="w-3.5 h-3.5" /> View
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-border/80 bg-muted/20 flex flex-col sm:flex-row justify-between items-center gap-3">
              <span className="text-xs text-muted-foreground font-medium">
                Showing {albumImages.length} live stock designs
              </span>
              <a
                href={`https://wa.me/917976341419?text=Hi%20Gemora%20Global%2C%20I%20am%20interested%20in%20sourcing%20designs%20from%20your%20live%20collection%3A%20${encodeURIComponent(selectedAlbum.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold px-6 py-3 rounded-xl transition-all shadow-md"
              >
                Inquire wholesale price for this entire collection
              </a>
            </div>

          </div>
        </div>
      )}

      {/* ── DYNAMIC LIGHTBOX FOR MODAL GRID ── */}
      {lightboxIdx !== null && selectedAlbum && albumImages.length > 0 && (
        <div
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center backdrop-blur-md"
          onClick={() => setLightboxIdx(null)}
        >
          <button
            onClick={() => setLightboxIdx(null)}
            className="absolute right-6 top-6 text-white hover:bg-white/20 p-2.5 rounded-full bg-black/40 z-50 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative max-w-6xl mx-auto px-4 w-full flex items-center justify-center py-8 md:py-0 overflow-y-auto max-h-[90vh] md:max-h-none md:overflow-visible" onClick={(e) => e.stopPropagation()}>
            
            <button
              className="absolute left-2 md:left-4 text-white hover:bg-white/20 z-50 rounded-full bg-black/40 h-10 w-10 md:h-12 md:w-12 flex items-center justify-center transition-colors"
              onClick={() => setLightboxIdx(prev => prev! > 0 ? prev! - 1 : albumImages.length - 1)}
            >
              <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            {/* Grid Container for Image and CTA Panel */}
            <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-center justify-center max-w-5xl">
              
              {/* Left Column: Image */}
              <div className="col-span-1 md:col-span-7 flex justify-center items-center h-full max-h-[40vh] md:max-h-[80vh]">
                <img
                  src={albumImages[lightboxIdx]?.replace('=w600-h600-c', '=w1200-h1200')}
                  className="max-h-[40vh] md:max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10 animate-fadeIn"
                  alt={`${selectedAlbum.title} design`}
                />
              </div>

              {/* Right Column: B2B Pricing Panel */}
              <div className="col-span-1 md:col-span-5 flex justify-center w-full animate-fadeIn">
                <div className="bg-slate-900/95 backdrop-blur-md border border-white/10 rounded-3xl p-5 flex flex-col gap-4 w-full shadow-2xl">
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <div>
                      <p className="text-white text-xs font-bold">{selectedAlbum.title}</p>
                      <p className="text-[10px] text-white/50">Design #{lightboxIdx + 1} — MOQ: 12 Pcs</p>
                    </div>
                    <span className="text-[10px] font-extrabold uppercase bg-accent/20 border border-accent/30 text-accent px-2.5 py-0.5 rounded-full">
                      Wholesale B2B
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-white/60 uppercase">Select Country</label>
                      <select
                        value={selectedCountry.code}
                        onChange={(e) => {
                          const found = countriesList.find(c => c.code === e.target.value);
                          if (found) {
                            setSelectedCountry(found);
                            localStorage.setItem("gemora_user_country", found.code);
                          }
                        }}
                        className="w-full text-xs bg-slate-950 border border-white/15 rounded-xl px-2 py-2 text-white outline-none cursor-pointer"
                      >
                        {countriesList.filter(c => c.active).map(c => (
                          <option key={c.code} value={c.code} className="bg-slate-950">{c.flag} {c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-white/60 uppercase">Type Code From Photo</label>
                      <input
                        type="text"
                        placeholder="e.g. RJ150"
                        value={calcInput}
                        onChange={(e) => setCalcInput(e.target.value)}
                        className="w-full text-xs bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-white placeholder-white/35 outline-none"
                      />
                    </div>
                  </div>

                  {/* Calculation Result */}
                  {calcInput.trim() ? (() => {
                    const result = calculatePrice(calcInput, selectedCountry);
                    return result ? (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-center justify-between text-white animate-fadeIn">
                        <div>
                          <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">Calculated Price</span>
                          <p className="font-sans font-bold text-base sm:text-lg text-white">
                            {result.currencySymbol}
                            {result.finalPrice.toLocaleString(undefined, {
                              minimumFractionDigits: result.currency === "INR" ? 0 : 2,
                              maximumFractionDigits: result.currency === "INR" ? 0 : 2
                            })}{" "}
                            <span className="text-[10px] text-white/60">{result.currency}</span>
                          </p>
                        </div>
                        <span className="text-[9px] bg-white/10 px-2 py-0.5 rounded-full text-white/80">
                          Base: ₹{result.basePriceINR.toLocaleString()} INR
                        </span>
                      </div>
                    ) : (
                      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2 text-center text-[10px] text-amber-300">
                        Could not detect code format.
                      </div>
                    );
                  })() : (
                    <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-center text-[10px] text-white/40 italic">
                      Type code from photo to see live wholesale price.
                    </div>
                  )}

                  <div className="flex gap-2 pt-2 border-t border-white/5">
                    <a
                      href={`https://wa.me/917976341419?text=Hi%20Gemora%20Global%2C%20I%20want%20to%20inquire%20about%20design%20%23${lightboxIdx + 1}%20with%20code%20${calcInput || "N/A"}%20from%20your%20${encodeURIComponent(selectedAlbum.title)}%20collection.%20Image%20URL%3A%20${encodeURIComponent(albumImages[lightboxIdx]?.replace('=w600-h600-c', ''))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-center text-[10px] uppercase tracking-wider py-3 rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
                    >
                      💬 Order on WhatsApp
                    </a>
                  </div>
                </div>
              </div>

            </div>

            <button
              className="absolute right-2 md:right-4 text-white hover:bg-white/20 z-50 rounded-full bg-black/40 h-10 w-10 md:h-12 md:w-12 flex items-center justify-center transition-colors"
              onClick={() => setLightboxIdx(prev => prev! < albumImages.length - 1 ? prev! + 1 : 0)}
            >
              <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
            </button>

          </div>
        </div>
      )}

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
              href="https://wa.me/917976341419?text=Hi%20Gemora%20Global%2C%20I%20want%20to%20join%20your%200%20investment%20reseller%20program%20and%20Dream%20Business%20program%20for%20online%20sellers."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-emerald-600/10 min-h-[44px] text-sm w-full sm:w-auto"
            >
              Start Selling (Join WhatsApp)
            </a>
            <a
              href="tel:+917976341419"
              className="inline-flex items-center justify-center gap-2 bg-indigo-950 text-white hover:bg-indigo-900 font-bold px-6 py-3 rounded-xl transition-all shadow-md min-h-[44px] text-sm w-full sm:w-auto"
            >
              <PhoneCall className="w-4 h-4 text-accent" />
              Call +91 7976341419
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
