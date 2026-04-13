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
import { usePageSEO } from "../hooks/usePageSEO";
import type { Category, Product, Testimonial } from "../types";

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

const SAMPLE_CATEGORIES: Category[] = [
  {
    id: 1n,
    name: "Necklaces",
    description: "Exquisite handcrafted necklaces",
    imageUrl: "/assets/generated/jewellery-necklace-hd.dim_800x800.jpg",
    sortOrder: 1n,
  },
  {
    id: 2n,
    name: "Earrings",
    description: "Stunning earring collections",
    imageUrl: "/assets/generated/jewellery-earrings-hd.dim_800x800.jpg",
    sortOrder: 2n,
  },
  {
    id: 3n,
    name: "Bracelets",
    description: "Elegant bracelet designs",
    imageUrl: "/assets/generated/jewellery-bracelets-hd.dim_800x800.jpg",
    sortOrder: 3n,
  },
  {
    id: 4n,
    name: "Rings",
    description: "Statement rings for every occasion",
    imageUrl: "/assets/generated/jewellery-rings-hd.dim_800x800.jpg",
    sortOrder: 4n,
  },
  {
    id: 5n,
    name: "Bridal Jewellery",
    description: "Complete bridal jewellery sets",
    imageUrl: "/assets/generated/jewellery-bridal-hd.dim_800x800.jpg",
    sortOrder: 5n,
  },
  {
    id: 6n,
    name: "Minimal Fashion",
    description: "Modern minimal fashion jewellery",
    imageUrl: "/assets/generated/jewellery-minimal-hd.dim_800x800.jpg",
    sortOrder: 6n,
  },
];

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 1n,
    categoryId: 1n,
    name: "Kundan Necklace Set",
    description: "Traditional Kundan work with polki stones",
    moq: "50 pcs",
    imageUrls: ["/assets/generated/jewellery-necklace-hd.dim_800x800.jpg"],
    featured: true,
    isNewArrival: true,
    createdAt: 1700000006n,
  },
  {
    id: 2n,
    categoryId: 2n,
    name: "Jhumka Earrings Gold",
    description: "Classic gold-plated jhumka for festive wear",
    moq: "50 pcs",
    imageUrls: ["/assets/generated/jewellery-earrings-hd.dim_800x800.jpg"],
    featured: true,
    isNewArrival: true,
    createdAt: 1700000005n,
  },
  {
    id: 3n,
    categoryId: 5n,
    name: "Bridal Choker Set",
    description: "Complete bridal set with necklace, earrings, maang tikka",
    moq: "25 pcs",
    imageUrls: ["/assets/generated/jewellery-bridal-hd.dim_800x800.jpg"],
    featured: true,
    isNewArrival: true,
    createdAt: 1700000004n,
  },
  {
    id: 4n,
    categoryId: 3n,
    name: "Oxidised Bangles Set",
    description: "Antique oxidised finish bangles",
    moq: "100 pcs",
    imageUrls: ["/assets/generated/jewellery-bracelets-hd.dim_800x800.jpg"],
    featured: false,
    isNewArrival: true,
    createdAt: 1700000003n,
  },
  {
    id: 5n,
    categoryId: 6n,
    name: "Minimal Gold Hoops",
    description: "Lightweight modern hoop earrings",
    moq: "50 pcs",
    imageUrls: ["/assets/generated/jewellery-minimal-hd.dim_800x800.jpg"],
    featured: true,
    isNewArrival: false,
    createdAt: 1700000002n,
  },
  {
    id: 6n,
    categoryId: 4n,
    name: "Statement Cocktail Ring",
    description: "Bold cocktail ring with CZ stones",
    moq: "50 pcs",
    imageUrls: ["/assets/generated/jewellery-rings-hd.dim_800x800.jpg"],
    featured: false,
    isNewArrival: false,
    createdAt: 1700000001n,
  },
  {
    id: 7n,
    categoryId: 1n,
    name: "Temple Necklace Long",
    description: "South Indian temple style long necklace",
    moq: "25 pcs",
    imageUrls: ["/assets/generated/jewellery-necklace-hd.dim_800x800.jpg"],
    featured: true,
    isNewArrival: false,
    createdAt: 1700000000n,
  },
  {
    id: 8n,
    categoryId: 2n,
    name: "Chandbali Drop Earrings",
    description: "Traditional chandbali with meenakari work",
    moq: "50 pcs",
    imageUrls: ["/assets/generated/jewellery-earrings-hd.dim_800x800.jpg"],
    featured: true,
    isNewArrival: false,
    createdAt: 1699999999n,
  },
];

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
  { value: "50+", label: "Countries" },
  { value: "10+", label: "Years Experience" },
  { value: "10,000+", label: "Happy Clients" },
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
                {product.description}
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
  const { actor } = useActor();
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
      "Imitation Jewellery Exporter & Manufacturer in India | Gemora Global",
    description:
      "India's leading imitation jewellery manufacturer & exporter in Jaipur. Wholesale fashion jewellery, bridal sets & 500+ designs. Shipping to UAE, USA, UK & worldwide.",
    canonical: "https://gemoraglobal-tje.caffeine.xyz/",
    ogTitle:
      "Imitation Jewellery Exporter & Manufacturer in India | Gemora Global",
    ogDescription:
      "India's leading imitation jewellery manufacturer and exporter from Jaipur. Premium wholesale pricing for global buyers in UAE, France, USA, UK and Europe.",
    ogImage:
      "https://gemoraglobal-tje.caffeine.xyz/assets/uploads/logo-removebg-preview-1.png",
    isHomepage: true,
    speakable: true,
    breadcrumbs: [
      { name: "Home", url: "https://gemoraglobal-tje.caffeine.xyz/" },
    ],
    faqItems: [
      {
        q: "What is the minimum order quantity for wholesale imitation jewellery?",
        a: "GEMORA GLOBAL's minimum order is 50 pieces per design, or a minimum order value of $300.",
      },
      {
        q: "Do you export to the USA and UK?",
        a: "Yes, we export to 30+ countries including USA, UK, UAE, Australia, Germany, and more.",
      },
      {
        q: "Can I get custom designs or private label jewellery?",
        a: "Yes, we offer custom design and private label services with your brand packaging.",
      },
      {
        q: "What payment methods do you accept for international orders?",
        a: "We accept T/T (bank transfer), PayPal, and Letter of Credit for large orders.",
      },
      {
        q: "How long does delivery take for international orders?",
        a: "Air freight 3–7 days, sea freight 20–35 days depending on destination.",
      },
      {
        q: "Are your products nickel-free and lead-free?",
        a: "Yes, all export products meet international safety standards including US CPSC and EU REACH requirements.",
      },
    ],
    schema: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "Gemora Global",
      image:
        "https://gemoraglobal-tje.caffeine.xyz/assets/uploads/logo-removebg-preview-1.png",
      "@id": "https://gemoraglobal-tje.caffeine.xyz",
      url: "https://gemoraglobal-tje.caffeine.xyz",
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
        "Gemora Global is a leading imitation jewellery manufacturer, wholesaler and exporter based in Jaipur, Rajasthan. We supply wholesale fashion jewellery, bridal jewellery sets, Kundan jewellery, and 500+ designs to buyers in UAE, USA, UK, and 30+ countries.",
      sameAs: [
        "https://www.indiamart.com/gemora-global",
        "https://www.tradeindia.com/gemora-global",
        "https://www.exportersindia.com/gemora-global",
        "https://www.instagram.com/gemoraglobal",
      ],
    },
  });

  // ── Backend data ─────────────────────────────────────────────
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => actor!.getCategories(),
    enabled: !!actor,
  });

  const { data: featuredProducts } = useQuery<Product[]>({
    queryKey: ["featured-products"],
    queryFn: () => actor!.getFeaturedProducts(),
    enabled: !!actor,
  });

  // Use getNewArrivalProducts for New Arrivals section
  const { data: newArrivalProducts } = useQuery<Product[]>({
    queryKey: ["new-arrival-products"],
    queryFn: () => actor!.getNewArrivalProducts(),
    enabled: !!actor,
  });

  const { data: testimonials } = useQuery<Testimonial[]>({
    queryKey: ["testimonials"],
    queryFn: () => actor!.getTestimonials(),
    enabled: !!actor,
  });

  useQuery({
    queryKey: ["content", "hero_title"],
    queryFn: () => actor!.getContent("hero_title"),
    enabled: !!actor,
  });
  useQuery({
    queryKey: ["content", "hero_subtitle"],
    queryFn: () => actor!.getContent("hero_subtitle"),
    enabled: !!actor,
  });
  const { data: heroImageRaw } = useQuery({
    queryKey: ["content", "hero_image"],
    queryFn: () => actor!.getContent("hero_image"),
    enabled: !!actor,
  });
  const { data: heroImage1Raw } = useQuery({
    queryKey: ["content", "hero_image_1"],
    queryFn: () => actor!.getContent("hero_image_1"),
    enabled: !!actor,
  });
  const { data: heroImage2Raw } = useQuery({
    queryKey: ["content", "hero_image_2"],
    queryFn: () => actor!.getContent("hero_image_2"),
    enabled: !!actor,
  });
  const { data: heroImage3Raw } = useQuery({
    queryKey: ["content", "hero_image_3"],
    queryFn: () => actor!.getContent("hero_image_3"),
    enabled: !!actor,
  });

  const heroImageFallback =
    (heroImageRaw && heroImageRaw.length > 0 ? heroImageRaw[0] : null) ??
    "/assets/generated/hero-jewellery-banner.dim_1600x700.jpg";
  const heroImage1 =
    (heroImage1Raw && heroImage1Raw.length > 0 ? heroImage1Raw[0] : null) ??
    heroImageFallback;
  const heroImage2 =
    heroImage2Raw && heroImage2Raw.length > 0 ? heroImage2Raw[0] : null;
  const heroImage3 =
    heroImage3Raw && heroImage3Raw.length > 0 ? heroImage3Raw[0] : null;
  const heroImages = [heroImage1, heroImage2, heroImage3].filter(
    Boolean,
  ) as string[];

  // Slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    if (heroImages.length <= 1) return;
    const timer = setInterval(
      () => setCurrentSlide((p) => (p + 1) % heroImages.length),
      5000,
    );
    return () => clearInterval(timer);
  }, [heroImages.length]);

  // Derived data
  const displayCategories =
    categories && categories.length > 0 ? categories : SAMPLE_CATEGORIES;
  const displayTestimonials =
    testimonials && testimonials.filter((t) => t.active).length > 0
      ? testimonials.filter((t) => t.active)
      : SAMPLE_TESTIMONIALS;

  // Use backend getNewArrivalProducts; fallback to sample new arrivals
  const newArrivals = (
    newArrivalProducts && newArrivalProducts.length > 0
      ? newArrivalProducts
      : SAMPLE_PRODUCTS.filter((p) => p.isNewArrival)
  ).slice(0, 8);

  const trendingProducts = (
    featuredProducts && featuredProducts.length > 0
      ? featuredProducts
      : SAMPLE_PRODUCTS.filter((p) => p.featured)
  ).slice(0, 8);

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
        className="relative overflow-hidden w-full"
        style={{ height: "clamp(300px, 50vh, 700px)" }}
        aria-label="Hero image slider"
      >
        {heroImages.map((src, idx) => (
          <img
            key={src}
            src={src}
            alt={`Gemora Global — India's Premier Imitation Jewellery slide ${idx + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${idx === currentSlide ? "opacity-100" : "opacity-0"}`}
            loading={idx === 0 ? "eager" : "lazy"}
            fetchPriority={idx === 0 ? "high" : undefined}
            width={1600}
            height={900}
          />
        ))}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "rgba(0,0,0,0.15)" }}
          aria-hidden="true"
        />
        {heroImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={() =>
                setCurrentSlide(
                  (p) => (p - 1 + heroImages.length) % heroImages.length,
                )
              }
              aria-label="Previous slide"
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors border border-white/20 touch-manipulation"
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
              onClick={() =>
                setCurrentSlide((p) => (p + 1) % heroImages.length)
              }
              aria-label="Next slide"
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors border border-white/20 touch-manipulation"
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
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
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
      <section className="bg-primary py-8 md:py-12 text-white">
        <div className="container px-4 md:px-6 text-center">
          <h1 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 leading-tight">
            India's Premier Imitation Jewellery Manufacturer &amp; Global
            Exporter
          </h1>
          <p className="text-white/80 text-sm md:text-base lg:text-lg max-w-2xl mx-auto mb-6 md:mb-8 px-2">
            Premium handcrafted designs for wholesalers, boutiques &amp;
            distributors worldwide.
          </p>
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-6 md:mb-8">
            <span className="bg-white/10 border border-white/20 rounded-full px-3 py-1.5 md:px-5 md:py-2 text-xs md:text-sm font-semibold">
              🌍 30+ Countries Exported
            </span>
            <span className="bg-white/10 border border-white/20 rounded-full px-3 py-1.5 md:px-5 md:py-2 text-xs md:text-sm font-semibold">
              💎 500+ Designs
            </span>
            <span className="bg-white/10 border border-white/20 rounded-full px-3 py-1.5 md:px-5 md:py-2 text-xs md:text-sm font-semibold">
              ⭐ 10+ Years Experience
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="bg-accent text-primary font-bold hover:bg-accent/90 px-6 md:px-8 w-full sm:w-auto min-w-[200px] transition-transform duration-200 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-lg"
              data-ocid="hero.cta_catalog"
            >
              <Link to="/products">View Collection</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 px-6 md:px-8 w-full sm:w-auto min-w-[200px] transition-transform duration-200 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-lg"
              data-ocid="hero.cta_wholesale"
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
            Gemora Global is one of India's most trusted{" "}
            <Link to="/about" className="text-primary hover:underline">
              imitation jewellery manufacturers and exporters
            </Link>
            , supplying premium handcrafted designs to wholesalers, boutiques,
            and distributors across more than 50 countries. Based in{" "}
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
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 md:gap-3 max-w-3xl mx-auto">
            {[
              { flag: "🇫🇷", country: "France", to: "/export-markets" },
              { flag: "🇦🇪", country: "UAE", to: "/jewellery-exporter-uae" },
              {
                flag: "🇺🇸",
                country: "USA",
                to: "/imitation-jewellery-supplier-usa",
              },
              { flag: "🇬🇧", country: "UK", to: "/wholesale-jewellery-uk" },
              {
                flag: "🇪🇺",
                country: "Europe",
                to: "/jewellery-exporter-europe",
              },
              {
                flag: "🇨🇦",
                country: "Canada",
                to: "/jewellery-exporter-canada",
              },
              {
                flag: "🇦🇺",
                country: "Australia",
                to: "/jewellery-exporter-australia",
              },
              {
                flag: "🇸🇬",
                country: "Singapore",
                to: "/jewellery-exporter-singapore",
              },
            ].map((m) => (
              <Link
                key={m.country}
                to={m.to}
                className="flex flex-col items-center gap-1 md:gap-2 bg-background border border-border rounded-lg p-2 md:p-3 hover:border-primary/50 transition-all duration-200 hover:scale-[1.05] hover:-translate-y-1 hover:shadow-md cursor-pointer touch-manipulation"
                data-ocid="country.flag_link"
              >
                <span className="text-2xl md:text-3xl" aria-hidden="true">
                  {m.flag}
                </span>
                <span className="text-[10px] md:text-xs font-medium text-muted-foreground text-center leading-tight">
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
                  "A complete guide for overseas buyers on MOQ, pricing, and supplier selection.",
                category: "Business Guide",
              },
              {
                title:
                  "Top Imitation Jewellery Trends for Export Markets in 2026",
                excerpt:
                  "What boutiques in UAE, France, and UK are buying this season.",
                category: "Trends",
              },
              {
                title:
                  "Anti-Tarnish Jewellery: Why It Matters for International Retail",
                excerpt:
                  "How anti-tarnish coating reduces returns and builds buyer trust.",
                category: "Industry Insights",
              },
            ].map((post) => (
              <div
                key={post.title}
                className="bg-background border border-border rounded-xl p-4 md:p-5 hover:border-primary/50 transition-all duration-200 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-md"
              >
                <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                  {post.category}
                </span>
                <h3 className="font-serif font-semibold mt-3 mb-2 text-sm leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
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
