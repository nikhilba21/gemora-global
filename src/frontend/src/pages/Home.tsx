import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { Eye, ShieldCheck, Star, TrendingUp, Users, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import WhatsAppInquiryPopup from "../components/WhatsAppInquiryPopup";
import { useActor } from "../hooks/useActor";
import { usePageContent } from "../hooks/usePageContent";
import { usePageSEO } from "../hooks/usePageSEO";
import type { Category, Product, Testimonial } from "../types";
import { useCanonical } from '../hooks/useCanonical';

/** Remove Kanhai Jewels boilerplate text from product descriptions */
function cleanText(text: string): string {
  return text
    .replace(
      /Kanhai Jewels is Mumbai based company established in 2001[^.]*\./gi,
      "",
    )
    .replace(/We are manufacturer and[^.]*\./gi, "")
    .replace(/Read More/gi, "")
    .replace(/kanhai/gi, "Gemora")
    .trim();
}

// ── Scroll-reveal hook ─────────────────────────────────────────
function useScrollReveal() {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

// ── Static data ────────────────────────────────────────────────
const CATEGORY_IMAGES: Record<string, string> = {
  Necklaces: "/assets/generated/jewellery-necklace-hd.dim_800x800.jpg",
  Earrings: "/assets/generated/jewellery-earrings-hd.dim_800x800.jpg",
  Bracelets: "/assets/generated/jewellery-bracelets-hd.dim_800x800.jpg",
  Rings: "/assets/generated/jewellery-rings-hd.dim_800x800.jpg",
  "Bridal Jewellery": "/assets/generated/jewellery-bridal-hd.dim_800x800.jpg",
  "Minimal Fashion": "/assets/generated/jewellery-minimal-hd.dim_800x800.jpg",
  "Minimal Fashion Jewellery":
    "/assets/generated/jewellery-minimal-hd.dim_800x800.jpg",
};

const FALLBACK_IMAGE =
  "/assets/generated/jewellery-necklace-hd.dim_800x800.jpg";

const SAMPLE_TESTIMONIALS: Testimonial[] = [
  {
    id: 1n,
    name: "Fatima Al-Hassan",
    company: "Al-Noor Boutique",
    country: "UAE",
    text: "Outstanding quality and prompt delivery. Our customers love Gemora's designs!",
    rating: 5n,
    active: true,
  },
  {
    id: 2n,
    name: "Sarah Thompson",
    company: "Jewel Box UK",
    country: "UK",
    text: "Best imitation jewellery supplier we've worked with. MOQ is very reasonable.",
    rating: 5n,
    active: true,
  },
  {
    id: 3n,
    name: "Maria Rodriguez",
    company: "Elegance Store",
    country: "USA",
    text: "Premium packaging and excellent craftsmanship. Highly recommend for bulk orders.",
    rating: 5n,
    active: true,
  },
];

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "ISO Certified Quality" },
  { icon: Users, label: "500+ Global Buyers" },
  { icon: Star, label: "15+ Years Expertise" },
  { icon: TrendingUp, label: "Jaipur Manufacturer" },
  { icon: ShieldCheck, label: "Bulk Orders Welcome" },
];

const WHY_CHOOSE = [
  {
    icon: "💰",
    title: "Competitive Pricing",
    desc: "Factory-direct bulk pricing. Best margins for wholesalers and distributors.",
  },
  {
    icon: "✨",
    title: "Premium Finishing",
    desc: "Anti-tarnish, gold-plated, rhodium-finished jewellery with lasting quality.",
  },
  {
    icon: "🤝",
    title: "Reliable Export Partner",
    desc: "10+ years of global export experience. On-time delivery guaranteed.",
  },
  {
    icon: "🌟",
    title: "Trendy Fashion Designs",
    desc: "500+ fresh designs updated seasonally to keep your store ahead of trends.",
  },
];

const STATS = [
  { value: "500+", label: "Designs" },
  { value: "10+", label: "Years Export Experience" },
  { value: "20+", label: "Countries Served" },
  { value: "50 Units", label: "MOQ from" },
];

// ── Quick-View Modal ───────────────────────────────────────────
function QuickViewModal({
  product,
  open,
  onClose,
  onWhatsAppInquiry,
}: {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onWhatsAppInquiry: (p: Product) => void;
}) {
  if (!product) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-2xl p-0 overflow-hidden w-[calc(100vw-2rem)] mx-auto"
        data-ocid="quickview.modal"
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative aspect-square bg-muted">
            <img
              src={product.imageUrls[0] || FALLBACK_IMAGE}
              alt={product.name}
              className="w-full h-full object-cover"
              width={500}
              height={500}
            />
            <span className="badge-moq">Min. {product.moq}</span>
          </div>
          <div className="p-5 md:p-6 flex flex-col justify-between">
            <div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close quick view"
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/70 transition-colors"
                data-ocid="quickview.close"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="font-serif text-lg md:text-xl font-bold mb-3">
                {product.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {cleanText(product.description)}
              </p>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-border pb-2">
                  <dt className="text-muted-foreground">Min. Order</dt>
                  <dd className="font-semibold text-destructive">
                    {product.moq}
                  </dd>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <dt className="text-muted-foreground">Stock</dt>
                  <dd className="font-semibold text-green-600">Available</dd>
                </div>
                <div className="flex justify-between pb-2">
                  <dt className="text-muted-foreground">Finish</dt>
                  <dd className="font-semibold">Anti-tarnish Gold</dd>
                </div>
              </dl>
            </div>
            <div className="flex flex-col gap-3 mt-6">
              <Button
                className="bg-green-600 hover:bg-green-700 text-white w-full"
                onClick={() => {
                  onClose();
                  onWhatsAppInquiry(product);
                }}
                data-ocid="quickview.whatsapp_inquiry"
              >
                WhatsApp Inquiry
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10 w-full"
                data-ocid="quickview.details"
              >
                <Link to={`/products/${product.id}`}>View Full Details</Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Product Card ───────────────────────────────────────────────
function ProductCard({
  product,
  onQuickView,
  showNewBadge,
}: {
  product: Product;
  onQuickView: (p: Product) => void;
  showNewBadge?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="product-card group relative cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-ocid="product.card"
    >
      <div className="aspect-square overflow-hidden relative">
        <img
          src={product.imageUrls[0] || FALLBACK_IMAGE}
          alt={`${product.name} — imitation jewellery by Gemora Global`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          width={400}
          height={400}
        />
        {/* NEW badge for new arrivals */}
        {showNewBadge && (
          <span className="absolute top-2 left-2 bg-[#42A5F5] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide z-10">
            NEW
          </span>
        )}
        {/* MOQ Badge */}
        <span
          className="badge-moq text-[10px] md:text-xs px-1.5 py-1 md:px-2.5 md:py-1.5"
          aria-label={`Minimum order: ${product.moq}`}
        >
          Min. {product.moq}
        </span>
        {/* Quick-view overlay */}
        {hovered && (
          <button
            type="button"
            onClick={() => onQuickView(product)}
            aria-label={`Quick view ${product.name}`}
            className="absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity duration-200"
            data-ocid="product.quickview_trigger"
          >
            <span className="flex items-center gap-1.5 bg-background text-foreground px-3 py-1.5 rounded-full text-xs font-semibold shadow-elevated">
              <Eye className="w-3 h-3 md:w-3.5 md:h-3.5" /> Quick View
            </span>
          </button>
        )}
      </div>
      <Link
        to={`/products/${product.id}`}
        className="block p-2.5 md:p-3"
        data-ocid="product.link"
      >
        <h3 className="font-medium text-xs md:text-sm truncate group-hover:text-primary transition-colors leading-snug">
          {product.name}
        </h3>
        <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5">
          Wholesale from India
        </p>
      </Link>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────
export default function Home() {
  useCanonical();
  const { actor } = useActor();
  const API_BASE = (import.meta as { env: Record<string,string> }).env?.VITE_API_URL || 'https://gemora-global-2.onrender.com';
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null,
  );
  const [waPopupOpen, setWaPopupOpen] = useState(false);
  const [waProductName, setWaProductName] = useState("");

  const openWaInquiry = (p: Product) => {
    setWaProductName(p.name);
    setWaPopupOpen(true);
  };

  usePageSEO({
    title:
      "Jaipur Imitation Jewellery Exporter | MOQ 50 Units | Wholesale Manufacturer – Gemora Global",
    description:
      "Gemora Global — Jaipur-based imitation jewellery manufacturer & exporter since 2011. 500+ wholesale designs, MOQ 50 units, anti-tarnish finish. Shipping to 30+ countries worldwide.",
    canonical: "https://www.gemoraglobal.co/",
    ogTitle:
      "Jaipur Imitation Jewellery Exporter | MOQ 50 Units | Wholesale Manufacturer – Gemora Global",
    ogDescription:
      "Gemora Global — Jaipur-based imitation jewellery manufacturer & exporter since 2011. 500+ wholesale designs, MOQ 50 units. Shipping to 30+ countries worldwide.",
    ogImage: "https://www.gemoraglobal.co/images/og-banner.jpg",
    isHomepage: true,
    speakable: true,
    breadcrumbs: [
      { name: "Home", url: "https://www.gemoraglobal.co/" },
    ],
    faqItems: [
      {
        q: "What is the minimum order quantity (MOQ)?",
        a: "Our minimum order quantity is 50 units per design. Custom orders have a minimum of 500 units.",
      },
      {
        q: "Do you ship internationally?",
        a: "Yes, we ship worldwide including UAE, France, USA, UK, Europe, Canada, Australia, Singapore, Malaysia, Saudi Arabia, Nigeria, Sri Lanka, and Kuwait.",
      },
      {
        q: "What finishing do you use on your jewellery?",
        a: "All our jewellery uses anti-tarnish coating (Gold Plating, Matte Gold Plating, Rhodium Plating, Rose Gold Plating, Oxidised Plating, Black Plating, Mehndi Plating, 2 Tone and 3 Tone Plating) to ensure long-lasting shine.",
      },
      {
        q: "Can I request custom or private label designs?",
        a: "Yes. We offer private label and OEM services with a minimum of 500 units and a 3-4 week lead time.",
      },
      {
        q: "What types of jewellery do you manufacture?",
        a: "We manufacture Imitation Jewellery, Artificial Jewellery, Kundan Jewellery, Antique Jewellery, Temple Jewellery, Bridal Jewellery, Oxidised Jewellery, Meenakari Jewellery, American Diamond Jewellery, Indo Western and Western Jewellery.",
      },
      {
        q: "How do I place a wholesale order?",
        a: "Browse our catalogue, select designs, WhatsApp us at +91 7976341419 with quantity requirements. We accept T/T, LC, Western Union and PayPal.",
      },
    ],
    schema: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "Gemora Global",
      image: "https://www.gemoraglobal.co/images/og-banner.jpg",
      "@id": "https://www.gemoraglobal.co",
      url: "https://www.gemoraglobal.co",
      telephone: "+91-7976341419",
      email: "globalgemora@gmail.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "B 66 MAA Hinglaj Nagar",
        addressLocality: "Jaipur",
        addressRegion: "Rajasthan",
        postalCode: "302021",
        addressCountry: "IN",
      },
      geo: { "@type": "GeoCoordinates", latitude: 26.9124, longitude: 75.7873 },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
          opens: "09:00",
          closes: "19:00",
        },
      ],
      priceRange: "₹₹",
      description:
        "Gemora Global is a Jaipur-based imitation jewellery exporter and manufacturer, established 2011. We supply wholesale fashion jewellery, bridal jewellery sets, Kundan jewellery, and 500+ designs to buyers in UAE, USA, UK, and 30+ countries.",
      sameAs: [
        "https://www.indiamart.com/gemora-global",
        "https://www.tradeindia.com/gemora-global",
        "https://www.exportersindia.com/gemora-global",
        "https://www.instagram.com/gemoraglobal",
        "https://www.linkedin.com/company/gemoraglobal",
      ],
    },
  });

  // ── Page CMS content from backend ────────────────────────────
  const { content: pageContent } = usePageContent("homepage");

  // ── Backend data — direct fetch ──────────────────────────────
  const HOME_API = (import.meta as { env: Record<string,string> }).env?.VITE_API_URL
    || 'https://gemora-global-2.onrender.com';

  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivalProducts, setNewArrivalProducts] = useState<Product[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [heroImage1Raw, setHeroImage1Raw] = useState<string | null>(null);
  const [heroImage2Raw, setHeroImage2Raw] = useState<string | null>(null);
  const [heroImage3Raw, setHeroImage3Raw] = useState<string | null>(null);

  useEffect(() => {
    const parseProducts = (data: unknown) => {
      const items = Array.isArray(data) ? data : ((data as Record<string,unknown>)?.items || []);
      return (items as Record<string,unknown>[]).map(p => ({
        ...p,
        imageUrls: typeof p.imageUrls === 'string' ? JSON.parse(p.imageUrls as string) : (p.imageUrls || []),
        featured: p.featured === 1 || p.featured === true,
      } as Product));
    };
    fetch(`${HOME_API}/api/categories`).then(r=>r.json()).then(setCategories).catch(()=>{});
    fetch(`${HOME_API}/api/products/featured`).then(r=>r.json()).then(parseProducts).then(setFeaturedProducts).catch(()=>{});
    fetch(`${HOME_API}/api/products/new-arrivals`).then(r=>r.json()).then(parseProducts).then(setNewArrivalProducts).catch(()=>{});
    fetch(`${HOME_API}/api/testimonials`).then(r=>r.json()).then(setTestimonials).catch(()=>{});
    fetch(`${HOME_API}/api/content/hero_image_1`).then(r=>r.json()).then(d=>setHeroImage1Raw(d.value)).catch(()=>{});
    fetch(`${HOME_API}/api/content/hero_image_2`).then(r=>r.json()).then(d=>setHeroImage2Raw(d.value)).catch(()=>{});
    fetch(`${HOME_API}/api/content/hero_image_3`).then(r=>r.json()).then(d=>setHeroImage3Raw(d.value)).catch(()=>{});
  }, [HOME_API]);

  // getContent returns string | null (backend.d.ts) or [] | [string] (Motoko opt) — handle both
  const toStr = (v: unknown): string | null => {
    if (typeof v === "string" && v.length > 0) return v;
    if (Array.isArray(v) && v.length > 0) return v[0] as string;
    return null;
  };
  const heroImageFallback =
    "/assets/generated/hero-jewellery-banner.dim_1600x700.jpg";
  const heroImage1 = toStr(heroImage1Raw) ?? heroImageFallback;
  const heroImage2 = toStr(heroImage2Raw);
  const heroImage3 = toStr(heroImage3Raw);
  const heroImages: string[] = [];
  for (const url of [heroImage1, heroImage2, heroImage3]) {
    if (url?.startsWith("http") && !heroImages.includes(url)) {
      heroImages.push(url);
    }
  }
  // Always show at least the fallback hero
  if (heroImages.length === 0) heroImages.push(heroImageFallback);
  const heroSlideCount = heroImages.length;

  // Slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    if (heroSlideCount <= 1) return;
    const timer = setInterval(
      () => setCurrentSlide((p) => (p + 1) % heroSlideCount),
      5000,
    );
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heroSlideCount]);

  // Derived data — always use backend, no hardcoded category fallbacks
  const displayCategories = categories ?? [];
  const displayTestimonials =
    testimonials && testimonials.filter((t) => t.active).length > 0
      ? testimonials.filter((t) => t.active)
      : SAMPLE_TESTIMONIALS;

  // Always use backend products — show empty if none yet
  const newArrivals = (newArrivalProducts ?? []).slice(0, 8);
  const trendingProducts = (featuredProducts ?? []).slice(0, 8);

  const getCategoryImage = (cat: Category) => {
    if (cat.imageUrl && !cat.imageUrl.includes("placehold.co"))
      return cat.imageUrl;
    return CATEGORY_IMAGES[cat.name] || FALLBACK_IMAGE;
  };

  // Scroll reveal refs
  const statsReveal = useScrollReveal();
  const categoriesReveal = useScrollReveal();
  const newArrivalsReveal = useScrollReveal();
  const trendingReveal = useScrollReveal();
  const trustReveal = useScrollReveal();
  const whyReveal = useScrollReveal();
  const testimonialsReveal = useScrollReveal();

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* ── Hero Slider — CLEAN, no text overlay ──────────────── */}
      <section
        className="relative overflow-hidden w-full bg-[#0d1130]"
        style={{
          height: "clamp(280px, 55vw, 680px)",
          minHeight: "280px",
          maxHeight: "680px",
        }}
        aria-label="Hero image slider"
      >
        {heroImages.map((src, idx) => (
          <img
            key={src}
            src={src}
            alt={`Gemora Global — Jaipur Imitation Jewellery Manufacturer & Exporter, slide ${idx + 1}`}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ${idx === currentSlide ? "opacity-100" : "opacity-0"}`}
            loading={idx === 0 ? "eager" : "lazy"}
            fetchPriority={idx === 0 ? "high" : undefined}
            width={1600}
            height={900}
            style={{ display: "block" }}
          />
        ))}
        {/* Very subtle darkening overlay — doesn't obscure banner */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{ background: "rgba(0,0,0,0.08)" }}
          aria-hidden="true"
        />
        {heroSlideCount > 1 && (
          <>
            <button
              type="button"
              onClick={() =>
                setCurrentSlide(
                  (p) => (p - 1 + heroSlideCount) % heroSlideCount,
                )
              }
              aria-label="Previous slide"
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors border border-white/20 touch-manipulation"
              data-ocid="hero.pagination_prev"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 md:w-5 md:h-5"
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
              onClick={() => setCurrentSlide((p) => (p + 1) % heroSlideCount)}
              aria-label="Next slide"
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors border border-white/20 touch-manipulation"
              data-ocid="hero.pagination_next"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 md:w-5 md:h-5"
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
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5">
              {heroImages.map((src, idx) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`rounded-full transition-all duration-300 touch-manipulation ${idx === currentSlide ? "w-3.5 h-3.5 bg-white opacity-100" : "w-3 h-3 bg-white opacity-50 hover:opacity-75"}`}
                  data-ocid="hero.toggle"
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* ── Business Positioning — below hero ────── */}
      <section
        className="bg-primary border-t-4 border-accent py-8 md:py-12 text-white"
        style={{ marginTop: 0, position: "relative", zIndex: 1 }}
      >
        <div className="container px-4 md:px-6 text-center">
          <h1 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 leading-tight">
            {pageContent.hero_title ||
              "Imitation Jewellery Exporter India | Wholesale Manufacturer"}
          </h1>
          <p className="text-white/80 text-sm md:text-base lg:text-lg max-w-2xl mx-auto mb-6 md:mb-8 px-2">
            {pageContent.hero_subtitle ||
              "Factory-direct Kundan, Antique, Bridal &amp; Fashion Jewellery from Jaipur — for wholesalers, boutiques &amp; global distributors."}
          </p>
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-6 md:mb-8">
            <span className="bg-white/10 border border-white/20 rounded-full px-3 py-1.5 md:px-5 md:py-2 text-xs md:text-sm font-semibold">
              🌍 20+ Countries Exported
            </span>
            <span className="bg-white/10 border border-white/20 rounded-full px-3 py-1.5 md:px-5 md:py-2 text-xs md:text-sm font-semibold">
              💎 500+ Designs
            </span>
            <span className="bg-white/10 border border-white/20 rounded-full px-3 py-1.5 md:px-5 md:py-2 text-xs md:text-sm font-semibold">
              ⭐ MOQ from 50 Units
            </span>
            <span className="bg-white/10 border border-white/20 rounded-full px-3 py-1.5 md:px-5 md:py-2 text-xs md:text-sm font-semibold">
              🏆 10+ Years Export Experience
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="bg-accent text-primary font-bold hover:bg-accent/90 px-6 md:px-8 w-full sm:w-auto min-w-[200px] transition-transform duration-200 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-lg"
              data-ocid="hero.cta_products"
            >
              <Link to="/products">View Products</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary px-6 md:px-8 w-full sm:w-auto min-w-[200px] transition-all duration-200 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-lg font-bold"
              data-ocid="hero.cta_catalog"
            >
              <Link to="/wholesale">Get Catalog</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ─────────────────────────────────────────── */}
      <section
        ref={statsReveal.ref as React.RefObject<HTMLElement>}
        className="bg-primary/10 border-y border-primary/20 py-6 md:py-8"
      >
        <div className="container px-4 md:px-6 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`${statsReveal.visible ? `animate-fade-in-up animate-delay-${(i + 1) * 100}` : "opacity-0"}`}
            >
              <div className="font-serif text-2xl md:text-3xl font-bold text-primary">
                {s.value}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Trust Badges ──────────────────────────────────────── */}
      <section
        ref={trustReveal.ref as React.RefObject<HTMLElement>}
        className="bg-card border-b border-border py-4 md:py-6"
        data-ocid="trust.section"
      >
        <div className="container px-4 md:px-6">
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
            {TRUST_BADGES.map((badge, i) => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.label}
                  className={`trust-badge text-xs md:text-sm ${trustReveal.visible ? `animate-fade-in-up animate-delay-${Math.min((i + 1) * 100, 400)}` : "opacity-0"}`}
                >
                  <Icon
                    className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary"
                    aria-hidden="true"
                  />
                  <span>{badge.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SEO Body Copy ─────────────────────────────────────── */}
      <section className="container py-10 md:py-14 px-4 md:px-6">
        <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 text-center">
          Handcrafted Jewellery, Global Reach
        </h2>
        <div className="max-w-3xl mx-auto space-y-4 text-muted-foreground leading-relaxed text-center text-sm md:text-base">
          <p>
            Gemora Global is a Jaipur-based{" "}
            <Link to="/about" className="text-primary hover:underline">
              imitation jewellery manufacturer and exporter
            </Link>
            , established in 2011 with 10+ years of global export experience. We
            supply premium handcrafted designs to wholesalers, boutiques, and
            distributors across more than 30 countries. Based in{" "}
            <strong>Jaipur, Rajasthan</strong> — India's jewellery manufacturing
            capital — we combine traditional Indian craftsmanship with modern
            anti-tarnish finishing techniques.
          </p>
          <p>
            Our{" "}
            <Link to="/products" className="text-primary hover:underline">
              collections
            </Link>{" "}
            span necklaces, earrings, bangles, bracelets, rings, maang tikkas,
            and complete bridal jewellery sets. With over 10 years of export
            experience and a catalogue of 500+ seasonal designs, Gemora Global
            makes it easy for overseas buyers to source at competitive{" "}
            <Link to="/wholesale" className="text-primary hover:underline">
              wholesale prices
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ── Product Categories SEO Section ───────────────────── */}
      <section className="bg-muted/20 border-y border-border py-10 md:py-16 px-4 md:px-6">
        <div className="container">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
              Our Jewellery Categories
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
              Factory-direct wholesale imitation jewellery across 6 core
              categories — all with anti-tarnish coating and MOQ from 50 units.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {[
              {
                title: "Necklace Sets",
                slug: "necklaces",
                icon: "📿",
                desc: "Wholesale imitation necklace sets including Kundan, Polki, Zircon and layered chain styles. Choker Necklace, Chain Pendant and Pendant Set collections designed for boutique buyers. MOQ 50 units. Available in Gold Plating, Rhodium and Oxidised finishes. Ideal for UAE, UK and USA boutiques.",
              },
              {
                title: "Earrings & Tikka",
                slug: "earrings",
                icon: "💎",
                desc: "Wholesale fashion earrings ranging from traditional jhumkas to minimal studs. Maang Tikka, Earring Tikka and Jhuda collections for South Asian bridal and festive wear. Chandelier, hoop, drop and ear-cuff styles. Anti-tarnish coating ensures long-lasting retail quality.",
              },
              {
                title: "Bridal Jewellery Sets",
                slug: "bridal",
                icon: "👰",
                desc: "Full Kundan and Polki bridal sets for boutiques serving the South Asian wedding market. Bridal Set, Mangalsutra and Tikka collections. Complete necklace, earrings, maang tikka and bangles sets. Premium finishing for bridal boutiques in UK, USA and UAE. MOQ 10 sets per design.",
              },
              {
                title: "Bangles & Bracelets",
                slug: "bangles",
                icon: "⭕",
                desc: "Wholesale gold-plated and oxidised bangle sets for global boutique buyers. Kada, Baju Band and Hath Pan collections in sets of 2–24. Anti-tarnish coating suitable for humid markets in UAE, Singapore and Australia. Perfect for festive and wedding retail.",
              },
              {
                title: "Rings & Nose Rings",
                slug: "rings",
                icon: "💍",
                desc: "Statement cocktail rings and minimal stacking rings for boutique buyers. Finger Ring and Nose Ring catalogue covers adjustable, fixed and stackable designs in Kundan, stone-set and plain finishes. Ideal for fashion retailers in France, UK and USA. MOQ 50 units.",
              },
              {
                title: "Traditional & Ethnic",
                slug: "ethnic",
                icon: "✨",
                desc: "Complete traditional jewellery range: Mala, Payal, Anklet, Jhuda, Pasa, Bore, Damini, Sindoor Box, Brooch, Belt, Hair Clip, Hair Band and Hair Brooch. Serving South Asian cultural markets in Malaysia, Saudi Arabia, Nigeria and Sri Lanka.",
              },
            ].map((cat) => (
              <div
                key={cat.slug}
                className="bg-card border border-border rounded-xl p-5 md:p-6 hover:border-primary/50 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl" aria-hidden="true">
                    {cat.icon}
                  </span>
                  <h3 className="font-serif font-bold text-base md:text-lg">
                    {cat.title}
                  </h3>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed mb-4">
                  {cat.desc}
                </p>
                <Link
                  to={`/products?category=${cat.slug}`}
                  className="text-primary text-xs md:text-sm font-medium hover:underline"
                  data-ocid="category.view_link"
                >
                  View {cat.title} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Gemora Global — Extended Copy ─────────── */}
      <section className="container py-10 md:py-14 px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-bold mb-5">
            Why Choose Gemora Global?
          </h2>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            Gemora Global is Jaipur's trusted factory-direct{" "}
            <Link
              to="/wholesale"
              className="text-primary hover:underline font-medium"
            >
              imitation jewellery exporter
            </Link>
            , established in 2011 with over a decade of global export
            experience. We manufacture{" "}
            <Link
              to="/kundan-jewellery-wholesale"
              className="text-primary hover:underline"
            >
              Kundan Jewellery
            </Link>
            ,{" "}
            <Link
              to="/bridal-imitation-jewellery-wholesale"
              className="text-primary hover:underline"
            >
              Bridal Jewellery Sets
            </Link>
            ,{" "}
            <Link
              to="/oxidised-jewellery-wholesale"
              className="text-primary hover:underline"
            >
              Oxidised Jewellery
            </Link>
            , Meenakari, Antique, American Diamond, Indo Western and Fashion
            Jewellery — all with anti-tarnish coating for lasting retail
            quality. We offer wholesale pricing direct from our Jaipur
            manufacturing unit — no middlemen. Custom OEM and{" "}
            <Link
              to="/private-label-jewellery-india"
              className="text-primary hover:underline"
            >
              private label orders
            </Link>{" "}
            available from 500 units with 3–4 week lead time. GST-compliant
            export invoices issued for all orders. Our flexible MOQ starts at
            just 50 units per design — ideal for boutiques, wholesalers, and
            online retailers. Whether you are a{" "}
            <Link
              to="/imitation-jewellery-supplier-usa"
              className="text-primary hover:underline"
            >
              USA buyer
            </Link>
            ,{" "}
            <Link
              to="/wholesale-jewellery-uk"
              className="text-primary hover:underline"
            >
              UK wholesaler
            </Link>
            ,{" "}
            <Link
              to="/imitation-jewellery-supplier-uae"
              className="text-primary hover:underline"
            >
              UAE boutique
            </Link>
            , or sourcing for markets in Malaysia, Nigeria, Saudi Arabia or Sri
            Lanka, Gemora Global delivers reliable quality on every order.
          </p>
        </div>
      </section>

      {/* ── Quick Facts ───────────────────────────────────────── */}
      <section className="bg-card border-y border-border py-8 md:py-10">
        <div className="container px-4 md:px-6">
          <h2 className="font-serif text-xl md:text-2xl font-bold text-center mb-6 md:mb-8">
            At a Glance
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 max-w-4xl mx-auto">
            {[
              { icon: "📦", label: "Minimum Order", value: "50 pieces" },
              { icon: "⏱️", label: "Lead Time", value: "10–15 days" },
              { icon: "🌍", label: "Export Countries", value: "30+" },
              { icon: "💎", label: "Designs Available", value: "500+" },
              { icon: "🏆", label: "Experience", value: "10+ years" },
            ].map((fact) => (
              <div
                key={fact.label}
                className="flex flex-col items-center text-center p-3 md:p-4 rounded-xl border border-border bg-background hover:border-primary/40 transition-colors"
              >
                <span
                  className="text-xl md:text-2xl mb-1.5 md:mb-2"
                  aria-hidden="true"
                >
                  {fact.icon}
                </span>
                <span className="font-bold text-primary text-base md:text-xl">
                  {fact.value}
                </span>
                <span className="text-[10px] md:text-xs text-muted-foreground mt-1 leading-tight">
                  {fact.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ────────────────────────────────────────── */}
      <section
        ref={categoriesReveal.ref as React.RefObject<HTMLElement>}
        className="container py-8 md:py-12 px-4 md:px-6"
      >
        <div className="text-center mb-6 md:mb-10">
          <h2
            className={`font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-3 ${categoriesReveal.visible ? "animate-fade-in-up" : "opacity-0"}`}
          >
            Our Collections
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Explore our curated{" "}
            <Link to="/products" className="text-primary hover:underline">
              jewellery categories
            </Link>
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {displayCategories.slice(0, 6).map((cat, i) => (
            <Link
              key={String(cat.id)}
              to={`/products?category=${cat.id}`}
              className={`group relative overflow-hidden rounded-lg aspect-square cursor-pointer transition-transform duration-200 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-lg ${categoriesReveal.visible ? `animate-fade-in-up animate-delay-${Math.min((i + 1) * 100, 400)}` : "opacity-0"}`}
              data-ocid="category.card"
            >
              <img
                src={getCategoryImage(cat)}
                alt={`${cat.name} - wholesale imitation jewellery Jaipur`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                width={400}
                height={400}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3">
                <h3 className="font-serif text-white font-semibold text-xs md:text-sm leading-tight">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-6 md:mt-8">
          <Button
            asChild
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10 w-full sm:w-auto min-w-[200px]"
          >
            <Link to="/products">View All Collections</Link>
          </Button>
        </div>
      </section>

      {/* ── New Arrivals ──────────────────────────────────────── */}
      <section
        ref={newArrivalsReveal.ref as React.RefObject<HTMLElement>}
        className="bg-muted/30 py-8 md:py-16"
        data-ocid="new-arrivals.section"
      >
        <div className="container px-4 md:px-6">
          <div className="text-center mb-6 md:mb-10">
            <Badge className="mb-3 bg-[#42A5F5]/20 text-[#1A237E] border-[#42A5F5]/30 text-xs tracking-widest">
              JUST IN
            </Badge>
            <h2
              className={`font-serif text-xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3 ${newArrivalsReveal.visible ? "animate-fade-in-up" : "opacity-0"}`}
            >
              New Arrivals
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Fresh wholesale designs — be the first to source them
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {newArrivals.map((product, i) => (
              <div
                key={String(product.id)}
                className={`${newArrivalsReveal.visible ? `animate-fade-in-up animate-delay-${Math.min((i + 1) * 100, 400)}` : "opacity-0"}`}
              >
                <ProductCard
                  product={product}
                  onQuickView={setQuickViewProduct}
                  showNewBadge
                />
              </div>
            ))}
          </div>
          <div className="text-center mt-6 md:mt-8">
            <Button
              asChild
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto min-w-[200px]"
              data-ocid="new-arrivals.view_all"
            >
              <Link to="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Trending Now ──────────────────────────────────────── */}
      <section
        ref={trendingReveal.ref as React.RefObject<HTMLElement>}
        className="container py-8 md:py-16 px-4 md:px-6"
        data-ocid="trending.section"
      >
        <div className="text-center mb-6 md:mb-10">
          <Badge className="mb-3 bg-accent/20 text-accent-foreground border-accent/30 text-xs tracking-widest">
            BESTSELLERS
          </Badge>
          <h2
            className={`font-serif text-xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3 ${trendingReveal.visible ? "animate-fade-in-up" : "opacity-0"}`}
          >
            Trending Now
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Most-loved designs by{" "}
            <Link to="/global-markets" className="text-primary hover:underline">
              buyers worldwide
            </Link>
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {trendingProducts.map((product, i) => (
            <div
              key={String(product.id)}
              className={`${trendingReveal.visible ? `animate-fade-in-up animate-delay-${Math.min((i + 1) * 100, 400)}` : "opacity-0"}`}
            >
              <ProductCard
                product={product}
                onQuickView={setQuickViewProduct}
              />
            </div>
          ))}
        </div>
        <div className="text-center mt-6 md:mt-8">
          <Button
            asChild
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10 w-full sm:w-auto min-w-[200px]"
            data-ocid="trending.view_all"
          >
            <Link to="/products">Browse All Trending</Link>
          </Button>
        </div>
      </section>

      {/* ── Global Markets / Countries We Serve ───────────────── */}
      <section className="bg-card border-y border-border py-8 md:py-14">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="font-serif text-xl md:text-3xl font-bold mb-2 md:mb-3">
              Countries We Serve
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Supplying premium{" "}
              <Link to="/wholesale" className="text-primary hover:underline">
                wholesale jewellery
              </Link>{" "}
              to buyers across the globe
            </p>
          </div>
          <div
            className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3 md:gap-4 max-w-4xl mx-auto"
            style={{ display: "grid" }}
          >
            {[
              {
                flag: "🇺🇸",
                country: "USA",
                to: "/export-markets/usa",
              },
              { flag: "🇬🇧", country: "UK", to: "/export-markets/uk" },
              {
                flag: "🇦🇪",
                country: "UAE",
                to: "/export-markets/uae",
              },
              {
                flag: "🇦🇺",
                country: "Australia",
                to: "/export-markets/australia",
              },
              {
                flag: "🇩🇪",
                country: "Germany",
                to: "/export-imitation-jewellery-germany-eu",
              },
              {
                flag: "🇨🇦",
                country: "Canada",
                to: "/export-markets/canada",
              },
              {
                flag: "🇸🇬",
                country: "Singapore",
                to: "/export-markets/singapore",
              },
              {
                flag: "🇫🇷",
                country: "France",
                to: "/export-markets/france",
              },
            ].map((m) => (
              <Link
                key={m.country}
                to={m.to}
                className="flex flex-col items-center gap-1.5 bg-background border border-border rounded-xl p-3 md:p-4 hover:border-primary/60 hover:bg-primary/5 transition-all duration-200 hover:scale-[1.06] hover:-translate-y-1 hover:shadow-md cursor-pointer touch-manipulation min-w-0"
                data-ocid="country.flag_link"
              >
                <span
                  className="text-3xl md:text-4xl leading-none select-none"
                  role="img"
                  aria-label={m.country}
                >
                  {m.flag}
                </span>
                <span className="text-[10px] md:text-xs font-semibold text-foreground text-center leading-tight truncate w-full text-center">
                  {m.country}
                </span>
              </Link>
            ))}
          </div>
          <div className="text-center mt-5 md:mt-6">
            <Button
              asChild
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10 w-full sm:w-auto min-w-[200px]"
            >
              <Link to="/global-markets">View All Markets</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ─────────────────────────────────────── */}
      <section
        ref={whyReveal.ref as React.RefObject<HTMLElement>}
        className="container py-8 md:py-16 px-4 md:px-6"
      >
        <div className="text-center mb-6 md:mb-10">
          <h2
            className={`font-serif text-xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3 ${whyReveal.visible ? "animate-fade-in-up" : "opacity-0"}`}
          >
            Why Choose Gemora Global
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            The preferred{" "}
            <Link to="/why-choose-us" className="text-primary hover:underline">
              wholesale jewellery supplier
            </Link>{" "}
            for international buyers
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {WHY_CHOOSE.map((item, i) => (
            <div
              key={item.title}
              className={`text-center p-5 md:p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-all duration-200 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-lg ${whyReveal.visible ? `animate-fade-in-up animate-delay-${(i + 1) * 100}` : "opacity-0"}`}
            >
              <div
                className="text-3xl md:text-4xl mb-3 md:mb-4"
                aria-hidden="true"
              >
                {item.icon}
              </div>
              <h3 className="font-serif font-semibold text-sm md:text-base mb-2">
                {item.title}
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────── */}
      <section
        ref={testimonialsReveal.ref as React.RefObject<HTMLElement>}
        className="bg-muted/30 py-8 md:py-16"
      >
        <div className="container px-4 md:px-6">
          <div className="text-center mb-6 md:mb-10">
            <h2
              className={`font-serif text-xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3 ${testimonialsReveal.visible ? "animate-fade-in-up" : "opacity-0"}`}
            >
              What Buyers Say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {displayTestimonials.slice(0, 3).map((t, i) => (
              <Card
                key={String(t.id)}
                className={`bg-card border-border hover:border-primary/40 transition-all duration-200 hover:scale-[1.02] hover:shadow-md ${testimonialsReveal.visible ? `animate-fade-in-up animate-delay-${(i + 1) * 100}` : "opacity-0"}`}
              >
                <CardContent className="p-4 md:p-6">
                  <div
                    className="flex gap-1 mb-3"
                    aria-label={`${Number(t.rating)} out of 5 stars`}
                  >
                    {Array.from({ length: Number(t.rating) }, (_, n) => n).map(
                      (n) => (
                        <span
                          key={`${String(t.id)}-star-${n}`}
                          className="text-primary text-sm md:text-base"
                          aria-hidden="true"
                        >
                          ★
                        </span>
                      ),
                    )}
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground italic mb-4 leading-relaxed">
                    "{t.text}"
                  </p>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.company}, {t.country}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Instagram Grid ────────────────────────────────────── */}
      <section className="container py-8 md:py-14 px-4 md:px-6">
        <div className="text-center mb-5 md:mb-8">
          <h2 className="font-serif text-xl md:text-3xl font-bold mb-2">
            Follow Our Designs
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            @gemoraglobal on Instagram
          </p>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-1.5 md:gap-2">
          {[
            {
              src: "/assets/generated/jewellery-necklace-hd.dim_800x800.jpg",
              label: "Gold necklace set by Gemora Global",
            },
            {
              src: "/assets/generated/jewellery-earrings-hd.dim_800x800.jpg",
              label: "Handcrafted earrings collection",
            },
            {
              src: "/assets/generated/jewellery-bracelets-hd.dim_800x800.jpg",
              label: "Imitation bracelets for export",
            },
            {
              src: "/assets/generated/jewellery-rings-hd.dim_800x800.jpg",
              label: "Fashion rings wholesale",
            },
            {
              src: "/assets/generated/jewellery-bridal-hd.dim_800x800.jpg",
              label: "Bridal jewellery set",
            },
            {
              src: "/assets/generated/jewellery-minimal-hd.dim_800x800.jpg",
              label: "Minimal fashion jewellery",
            },
          ].map((item) => (
            <a
              key={item.src}
              href="https://instagram.com/gemoraglobal"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${item.label} - view on Instagram`}
              className="aspect-square overflow-hidden rounded-lg border border-border hover:border-primary/50 transition-all duration-200 hover:scale-[1.05] hover:shadow-md group block"
            >
              <img
                src={item.src}
                alt={item.label}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                width={300}
                height={300}
              />
            </a>
          ))}
        </div>
      </section>

      {/* ── Blog Teaser ───────────────────────────────────────── */}
      <section className="bg-card border-t border-border py-8 md:py-14">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-5 md:mb-6">
            <h2 className="font-serif text-xl md:text-3xl font-bold mb-2 md:mb-3">
              Jewellery Export Insights
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
              Sourcing guides, trend reports, and MOQ advice for wholesale
              buyers.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                title: "How to Source Imitation Jewellery from India",
                excerpt:
                  "A complete guide for overseas buyers on MOQ, pricing, and supplier selection when sourcing wholesale jewellery from Jaipur.",
                category: "Business Guide",
                slug: "how-to-source-imitation-jewellery-from-india",
              },
              {
                title:
                  "Top Imitation Jewellery Trends for Export Markets in 2026",
                excerpt:
                  "What boutiques in UAE, France, and UK are buying this season — from Kundan sets to minimal Indo Western jewellery.",
                category: "Trends",
                slug: "top-imitation-jewellery-trends-export-2026",
              },
              {
                title:
                  "Anti-Tarnish Jewellery: Why It Matters for International Retail",
                excerpt:
                  "How anti-tarnish coating (Gold Plating, Rhodium, Oxidised finishes) reduces returns and builds buyer trust.",
                category: "Industry Insights",
                slug: "anti-tarnish-jewellery-international-retail",
              },
            ].map((post) => (
              <Link
                key={post.title}
                to={`/blog/${post.slug}`}
                className="bg-background border border-border rounded-xl p-4 md:p-5 hover:border-primary/50 transition-all duration-200 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-md block"
                data-ocid="blog.teaser_link"
              >
                <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                  {post.category}
                </span>
                <h3 className="font-serif font-semibold mt-3 mb-2 text-sm leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  {post.excerpt}
                </p>
                <span className="text-primary text-xs font-medium hover:underline">
                  Read More →
                </span>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6 md:mt-8">
            <Link
              to="/blog"
              className="text-primary hover:underline text-sm font-medium"
            >
              Read all export insights →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ────────────────────────────────────────── */}
      <section
        className="bg-card border-y border-border py-10 md:py-16 px-4 md:px-6"
        aria-label="Frequently asked questions"
      >
        <div className="container max-w-3xl mx-auto">
          <div className="text-center mb-7 md:mb-10">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Common questions from wholesale buyers and{" "}
              <Link to="/contact" className="text-primary hover:underline">
                importers worldwide
              </Link>
              .
            </p>
          </div>
          <div
            className="space-y-4"
            itemScope
            itemType="https://schema.org/FAQPage"
          >
            {[
              {
                q: "What is the minimum order quantity (MOQ)?",
                a: "Our minimum order quantity is 50 units per design. Custom orders have a minimum of 500 units.",
              },
              {
                q: "Do you ship internationally?",
                a: "Yes, we ship worldwide including UAE, France, USA, UK, Europe, Canada, Australia, Singapore, Malaysia, Saudi Arabia, Nigeria, Sri Lanka, and Kuwait.",
              },
              {
                q: "What finishing do you use on your jewellery?",
                a: "All our jewellery uses anti-tarnish coating (Gold Plating, Matte Gold Plating, Rhodium Plating, Rose Gold Plating, Oxidised Plating, Black Plating, Mehndi Plating, 2 Tone and 3 Tone Plating) to ensure long-lasting shine.",
              },
              {
                q: "Can I request custom or private label designs?",
                a: "Yes. We offer private label and OEM services with a minimum of 500 units and a 3-4 week lead time.",
              },
              {
                q: "What types of jewellery do you manufacture?",
                a: "We manufacture Imitation Jewellery, Artificial Jewellery, Kundan Jewellery, Antique Jewellery, Temple Jewellery, Bridal Jewellery, Oxidised Jewellery, Meenakari Jewellery, American Diamond Jewellery, Indo Western and Western Jewellery.",
              },
              {
                q: "How do I place a wholesale order?",
                a: "Browse our catalogue, select designs, WhatsApp us at +91 7976341419 with quantity requirements. We accept T/T, LC, Western Union and PayPal.",
              },
            ].map((faq) => (
              <div
                key={faq.q}
                className="bg-background border border-border rounded-xl p-4 md:p-5"
                itemScope
                itemType="https://schema.org/Question"
                itemProp="mainEntity"
              >
                <h3
                  className="font-semibold text-sm md:text-base mb-2 flex items-start gap-2"
                  itemProp="name"
                >
                  <span className="text-primary font-bold flex-shrink-0">
                    Q.
                  </span>
                  {faq.q}
                </h3>
                <div
                  itemScope
                  itemType="https://schema.org/Answer"
                  itemProp="acceptedAnswer"
                >
                  <p
                    className="text-xs md:text-sm text-muted-foreground leading-relaxed pl-5"
                    itemProp="text"
                  >
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link
              to="/contact"
              className="text-primary hover:underline text-sm font-medium"
              data-ocid="faq.contact_link"
            >
              Have more questions? Contact our export team →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="bg-primary/10 border-y border-primary/20 py-8 md:py-16">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 text-primary">
            Ready to Start Wholesale?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6 md:mb-8 text-sm md:text-base">
            Download our{" "}
            <Link to="/gallery" className="text-primary hover:underline">
              product catalogue
            </Link>{" "}
            or{" "}
            <Link to="/contact" className="text-primary hover:underline">
              contact us
            </Link>{" "}
            for pricing, MOQ details, and latest designs.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 md:px-10 w-full sm:w-auto min-w-[200px]"
              data-ocid="cta.inquiry"
            >
              <Link to="/contact">Send Inquiry Now</Link>
            </Button>
            <a
              href="/catalogue.pdf"
              download
              className="inline-flex items-center justify-center gap-2 border-2 border-[#1A237E] text-[#1A237E] hover:bg-[#1A237E] hover:text-white px-6 md:px-8 py-3 rounded-lg text-sm font-medium transition-all duration-200 w-full sm:w-auto min-w-[200px]"
              data-ocid="cta.download"
            >
              📄 Download Catalogue
            </a>
          </div>
        </div>
      </section>

      {/* ── Services Internal Link Hub ────────────────────────── */}
      <section className="py-8 md:py-16 px-4 md:px-6 bg-muted/20 border-t border-border">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-xl md:text-2xl font-serif font-bold text-primary mb-2 md:mb-3 text-center">
            Explore Our Specialised Services
          </h2>
          <p className="text-center text-muted-foreground text-xs md:text-sm mb-6 md:mb-10">
            Gemora Global offers end-to-end wholesale, manufacturing, and export
            services for imitation jewellery worldwide.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
            {[
              {
                to: "/kundan-jewellery-wholesale",
                label: "Kundan Jewellery Wholesale from India",
              },
              {
                to: "/temple-jewellery-manufacturer",
                label: "Temple Jewellery Manufacturer Jaipur",
              },
              {
                to: "/artificial-jewellery-exporter",
                label: "Artificial Jewellery Exporter India",
              },
              {
                to: "/bridal-imitation-jewellery-wholesale",
                label: "Bridal Imitation Jewellery Wholesale",
              },
              {
                to: "/oxidised-jewellery-wholesale",
                label: "Oxidised Jewellery Wholesale Supplier",
              },
              {
                to: "/private-label-jewellery-india",
                label: "Private Label Jewellery India",
              },
              {
                to: "/bulk-jewellery-supplier",
                label: "Bulk Jewellery Supplier from Jaipur",
              },
              {
                to: "/meenakari-jewellery-wholesale",
                label: "Meenakari Jewellery Wholesale Export",
              },
              {
                to: "/imitation-jewellery-manufacturer-jaipur",
                label: "Imitation Jewellery Manufacturer Jaipur",
              },
              {
                to: "/wholesale-jewellery-rajasthan",
                label: "Wholesale Jewellery Rajasthan",
              },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-2 px-4 py-3 rounded-lg border border-border bg-background hover:border-primary/40 hover:bg-primary/5 transition-all text-sm text-foreground hover:text-primary"
              >
                <span className="text-primary text-base" aria-hidden="true">
                  →
                </span>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* ── Modals ─────────────────────────────────────────────── */}
      <QuickViewModal
        product={quickViewProduct}
        open={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onWhatsAppInquiry={openWaInquiry}
      />
      <WhatsAppInquiryPopup
        isOpen={waPopupOpen}
        onClose={() => setWaPopupOpen(false)}
        productName={waProductName}
      />
    </div>
  );
}
