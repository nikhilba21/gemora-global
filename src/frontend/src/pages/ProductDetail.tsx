import api from '../lib/api';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Phone,
  Plus,
  Share2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import RequestSampleModal from "../components/RequestSampleModal";
import WhatsAppInquiryPopup from "../components/WhatsAppInquiryPopup";
import { usePageSEO } from "../hooks/usePageSEO";
import { useQuoteCart } from "../hooks/useQuoteCart";
import type { Category, Product } from "../types";
import { useCanonical } from '../hooks/useCanonical';

// ─── Fallback sample product data ─────────────────────────────────────────────

/** Remove Kanhai Jewels boilerplate text injected from seeded product data */
function cleanProductText(text: string): string {
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

type NormalizedProduct = {
  id: bigint;
  name: string;
  description: string;
  categoryId: bigint;
  imageUrls: string[];
  moq: string;
  featured: boolean;
  metal: string;
  occasion: string;
  style: string;
  priceRange: string;
  material: string;
  finish: string;
  packaging: string;
  shipping: string;
};

const SAMPLE_PRODUCTS: NormalizedProduct[] = [
  {
    id: 101n,
    name: "Kundan Choker Necklace Set",
    description:
      "Heavy kundan choker with matching earrings, gold-plated brass, anti-tarnish coated. Perfect for bridal boutiques in UK & UAE. Each piece is handcrafted by artisans in Jaipur using traditional techniques passed down for generations.",
    categoryId: 1n,
    imageUrls: [
      "/assets/generated/product-necklace.dim_600x600.jpg",
      "/assets/generated/jewellery-necklace-hd.dim_800x800.jpg",
    ],
    moq: "50 pcs",
    featured: true,
    metal: "Gold-plated",
    occasion: "Bridal",
    style: "Traditional",
    priceRange: "Premium",
    material: "Brass with gold plating",
    finish: "Anti-tarnish polish",
    packaging: "Individual velvet pouch",
    shipping: "Worldwide — 7–14 days",
  },
  {
    id: 102n,
    name: "Layered Chain Necklace",
    description:
      "Delicate 3-layer gold chain necklace. Trending in European boutique markets. Light weight, anti-tarnish finish. Ideal for everyday wear.",
    categoryId: 1n,
    imageUrls: ["/assets/generated/jewellery-necklace-hd.dim_800x800.jpg"],
    moq: "100 pcs",
    featured: false,
    metal: "Gold-plated",
    occasion: "Casual",
    style: "Modern",
    priceRange: "Budget",
    material: "Alloy with gold plating",
    finish: "Anti-tarnish",
    packaging: "OPP bag",
    shipping: "Worldwide — 7–14 days",
  },
  {
    id: 201n,
    name: "Gold Jhumka Earrings",
    description:
      "Classic gold-plated jhumka with meenakari work. One of our top sellers for South Asian diaspora markets. Handcrafted in Jaipur.",
    categoryId: 2n,
    imageUrls: [
      "/assets/generated/product-earrings.dim_600x600.jpg",
      "/assets/generated/jewellery-earrings-hd.dim_800x800.jpg",
    ],
    moq: "100 pairs",
    featured: true,
    metal: "Gold-plated",
    occasion: "Festive",
    style: "Traditional",
    priceRange: "Budget",
    material: "Brass with gold plating",
    finish: "Meenakari enamel",
    packaging: "Pair in foam box",
    shipping: "Worldwide — 7–14 days",
  },
  {
    id: 202n,
    name: "Chandbali Earrings",
    description:
      "Crescent moon chandbali with kundan and pearl drops. Popular bridal piece for UK & UAE boutiques.",
    categoryId: 2n,
    imageUrls: ["/assets/generated/jewellery-earrings-hd.dim_800x800.jpg"],
    moq: "50 pairs",
    featured: true,
    metal: "Gold-plated",
    occasion: "Bridal",
    style: "Traditional",
    priceRange: "Premium",
    material: "Brass with kundan stones",
    finish: "Anti-tarnish gold polish",
    packaging: "Individual box",
    shipping: "Worldwide — 7–14 days",
  },
  {
    id: 601n,
    name: "Full Bridal Jewellery Set",
    description:
      "Complete 7-piece bridal set: necklace, earrings, maang tikka, nath, 2 bangles, matha patti. Gold kundan finish. Ready for export to South Asian diaspora markets.",
    categoryId: 6n,
    imageUrls: [
      "/assets/generated/product-bridal.dim_600x600.jpg",
      "/assets/generated/jewellery-bridal-hd.dim_800x800.jpg",
    ],
    moq: "10 sets",
    featured: true,
    metal: "Gold-plated",
    occasion: "Bridal",
    style: "Traditional",
    priceRange: "Premium",
    material: "Brass with kundan stones",
    finish: "Anti-tarnish gold polish",
    packaging: "Premium gift box",
    shipping: "Worldwide — 7–14 days",
  },
];

const CATEGORY_NAMES: Record<string, string> = {
  "1": "Necklaces",
  "2": "Earrings",
  "3": "Bracelets",
  "4": "Bangles",
  "5": "Rings",
  "6": "Bridal Jewellery",
  "7": "Minimal Fashion Jewellery",
};

// ─── Related Product Card ─────────────────────────────────────────────────────

function RelatedProductCard({
  product,
  categoryName,
}: { product: NormalizedProduct; categoryName: string }) {
  const img =
    product.imageUrls[0] ||
    "/assets/generated/product-necklace.dim_600x600.jpg";
  return (
    <Link
      to={`/products/${product.id}`}
      className="group block product-card hover:shadow-elevated"
      data-ocid={`related-product.${product.id}`}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={img}
          alt={`${product.name} wholesale jewellery`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          width={300}
          height={300}
        />
        <span className="badge-moq">Min. Qty: {product.moq}</span>
      </div>
      <div className="p-2 sm:p-3">
        <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5">
          {categoryName}
        </p>
        <h3 className="font-semibold text-xs sm:text-sm line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <Badge
          variant="outline"
          className="mt-1.5 text-[9px] sm:text-[10px] px-1.5 py-0"
        >
          {product.occasion}
        </Badge>
      </div>
    </Link>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProductDetail() {
  useCanonical();
  const { id } = useParams() as { id: string };
  const { addToCart, setOpen: setCartOpen } = useQuoteCart();
  const [activeImg, setActiveImg] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const [waPopupOpen, setWaPopupOpen] = useState(false);
  const [sampleOpen, setSampleOpen] = useState(false);

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const PAPI = (import.meta as { env: Record<string,string> }).env?.VITE_API_URL || 'https://gemora-global-2.onrender.com';
  useEffect(() => {
    if (!id) return;
    fetch(`${PAPI}/api/products/${id}`)
      .then(r => r.json())
      .then(d => setProduct({...d, imageUrls: typeof d.imageUrls==='string'?JSON.parse(d.imageUrls):(d.imageUrls||[])}))
      .catch(() => setProduct(null))
      .finally(() => setIsLoading(false));
  }, [id, PAPI]);

  const { data: backendCategories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => api.getCategories(),
    enabled: !!actor,
  });

  // Normalize: prefer backend product, fall back to sample
  const product: NormalizedProduct | null = (() => {
    if (backendProduct) {
      return {
        id: backendProduct.id,
        name: cleanProductText(backendProduct.name),
        description: cleanProductText(backendProduct.description),
        categoryId: backendProduct.categoryId,
        imageUrls: backendProduct.imageUrls,
        moq: backendProduct.moq,
        featured: backendProduct.featured,
        metal: "Gold-plated",
        occasion: "Festive",
        style: "Traditional",
        priceRange: "Mid-range",
        material: "Brass with gold plating",
        finish: "Anti-tarnish polish",
        packaging: "Individual velvet pouch",
        shipping: "Worldwide — 7–14 days",
      };
    }
    return SAMPLE_PRODUCTS.find((p) => String(p.id) === id) ?? null;
  })();

  const categoryName = (() => {
    if (product) {
      if (backendCategories) {
        return (
          backendCategories.find((c) => c.id === product.categoryId)?.name ??
          CATEGORY_NAMES[String(product.categoryId)] ??
          "Jewellery"
        );
      }
      return CATEGORY_NAMES[String(product.categoryId)] ?? "Jewellery";
    }
    return "Jewellery";
  })();

  const relatedProducts = SAMPLE_PRODUCTS.filter(
    (p) => p.categoryId === product?.categoryId && p.id !== product?.id,
  ).slice(0, 4);

  usePageSEO({
    title: product
      ? `${product.name} Wholesale Supplier Jaipur India | Gemora Global`
      : "Imitation Jewellery Products | Gemora Global",
    description: product
      ? `${product.description.slice(0, 150)}... Wholesale from Jaipur, India. MOQ: ${product.moq}.`
      : "Browse wholesale imitation jewellery products from Gemora Global, Jaipur India.",
    canonical: `https://www.gemoraglobal.co/products/${id}`,
    schema: product
      ? [
          {
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.description,
            image: product.imageUrls[0] || "",
            category: categoryName,
            brand: { "@type": "Brand", name: "GEMORA GLOBAL" },
            manufacturer: {
              "@type": "Organization",
              name: "GEMORA GLOBAL",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Jaipur",
                addressRegion: "Rajasthan",
                addressCountry: "IN",
              },
            },
            offers: {
              "@type": "Offer",
              availability: "https://schema.org/InStock",
              seller: { "@type": "Organization", name: "GEMORA GLOBAL" },
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://www.gemoraglobal.co/",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Products",
                item: "https://www.gemoraglobal.co/products",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: product.name,
                item: `https://www.gemoraglobal.co/products/${id}`,
              },
            ],
          },
        ]
      : undefined,
  });

  useEffect(() => {
    setActiveImg(0);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 container px-4 sm:px-6 py-8 sm:py-10">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-10">
            <Skeleton className="aspect-square rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 sm:h-10 w-3/4 rounded" />
              <Skeleton className="h-20 sm:h-24 w-full rounded" />
              <Skeleton className="h-14 sm:h-16 w-full rounded" />
              <Skeleton className="h-10 sm:h-12 w-full rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 container px-4 text-center py-16 sm:py-20">
          <p className="text-5xl sm:text-6xl mb-4">💎</p>
          <h1 className="font-serif text-xl sm:text-2xl font-bold mb-2">
            Product Not Found
          </h1>
          <p className="text-muted-foreground mb-6 text-sm">
            This product may have been removed or the link is incorrect.
          </p>
          <Button asChild className="bg-primary text-primary-foreground">
            <Link to="/products">Browse All Products</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const images =
    product.imageUrls.length > 0
      ? product.imageUrls
      : ["/assets/generated/product-necklace.dim_600x600.jpg"];

  const specs = [
    { label: "Metal / Finish", value: product.metal },
    { label: "Material", value: product.material },
    { label: "Surface Finish", value: product.finish },
    { label: "Occasion", value: product.occasion },
    { label: "Style", value: product.style },
    { label: "Price Range", value: product.priceRange },
    { label: "Packaging", value: product.packaging },
    { label: "Shipping", value: product.shipping },
    { label: "Origin", value: "Jaipur, Rajasthan, India" },
  ];

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 50) {
      if (deltaX < 0) setActiveImg((i) => (i + 1) % images.length);
      else setActiveImg((i) => (i - 1 + images.length) % images.length);
    }
    touchStartX.current = null;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Breadcrumb */}
        <div className="bg-card border-b border-border">
          <div className="container px-4 sm:px-6 py-3">
            <nav
              className="text-xs text-muted-foreground flex items-center gap-1 flex-wrap min-w-0"
              aria-label="Breadcrumb"
            >
              <Link
                to="/"
                className="hover:text-primary transition-colors shrink-0"
              >
                Home
              </Link>
              <span className="shrink-0">/</span>
              <Link
                to="/products"
                className="hover:text-primary transition-colors shrink-0"
              >
                Products
              </Link>
              <span className="shrink-0">/</span>
              <Link
                to={`/products?category=${product.categoryId}`}
                className="hover:text-primary transition-colors shrink-0"
              >
                {categoryName}
              </Link>
              <span className="shrink-0">/</span>
              <span className="text-foreground font-medium truncate min-w-0 max-w-[140px] sm:max-w-[200px]">
                {product.name}
              </span>
            </nav>
          </div>
        </div>

        <div className="container px-4 sm:px-6 py-5 sm:py-8">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 mb-10 sm:mb-14">
            {/* ── Image gallery ── */}
            <div>
              <div
                className="relative rounded-xl overflow-hidden aspect-square mb-3 border border-border bg-muted group select-none"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <img
                  src={images[activeImg]}
                  alt={`${product.name} — wholesale imitation jewellery Jaipur India`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  width={600}
                  height={600}
                  fetchPriority="high"
                />
                {product.featured && (
                  <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                    Featured
                  </span>
                )}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveImg(
                          (i) => (i - 1 + images.length) % images.length,
                        )
                      }
                      aria-label="Previous image"
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-8 sm:h-8 bg-card/90 rounded-full flex items-center justify-center shadow hover:bg-card transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-4 sm:h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveImg((i) => (i + 1) % images.length)
                      }
                      aria-label="Next image"
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-8 sm:h-8 bg-card/90 rounded-full flex items-center justify-center shadow hover:bg-card transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 sm:w-4 sm:h-4" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 sm:hidden">
                      {images.map((imgSrc, idx) => (
                        <button
                          key={imgSrc}
                          type="button"
                          onClick={() => setActiveImg(idx)}
                          aria-label={`Go to image ${idx + 1}`}
                          className={`w-2 h-2 rounded-full transition-all ${idx === activeImg ? "bg-white scale-125" : "bg-white/50"}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide sm:flex-wrap">
                  {images.map((img, idx) => (
                    <button
                      key={img}
                      type="button"
                      onClick={() => setActiveImg(idx)}
                      aria-label={`View image ${idx + 1}`}
                      className={`shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all hover:shadow-md ${idx === activeImg ? "border-primary shadow-md" : "border-border"}`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} view ${idx + 1}`}
                        className="w-full h-full object-cover"
                        width={64}
                        height={64}
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 mt-4">
                {[
                  "🏭 Manufacturer Direct",
                  "🌍 Export to 50+ Countries",
                  "✅ Anti-Tarnish Finish",
                  "📦 Bulk Orders Welcome",
                ].map((badge) => (
                  <span
                    key={badge}
                    className="trust-badge text-[10px] sm:text-xs"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Product details ── */}
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground mb-1">
                    <Link
                      to={`/products?category=${product.categoryId}`}
                      className="hover:text-primary transition-colors"
                    >
                      {categoryName}
                    </Link>
                  </p>
                  <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold leading-snug">
                    {product.name}
                  </h1>
                </div>
                <button
                  type="button"
                  aria-label="Share this product"
                  onClick={() =>
                    navigator.clipboard.writeText(window.location.href)
                  }
                  className="shrink-0 w-9 h-9 border border-border rounded-lg flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {product.featured && (
                <Badge className="mb-3 bg-primary/10 text-primary border-primary/30 hover:bg-primary/10">
                  Featured Product
                </Badge>
              )}

              {/* MOQ */}
              <div
                className="bg-destructive/10 border border-destructive/25 rounded-xl p-3 sm:p-4 mb-4 sm:mb-5 flex items-center gap-3 sm:gap-4"
                data-ocid="product.moq_badge"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-destructive/20 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-base sm:text-lg">📦</span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">
                    Minimum Order Quantity (MOQ)
                  </p>
                  <p className="font-bold text-lg sm:text-xl text-destructive leading-tight">
                    {product.moq}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Contact us for pricing on larger quantities
                  </p>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed text-sm mb-5 sm:mb-6">
                {product.description}
              </p>

              <div className="border border-border rounded-xl overflow-hidden mb-5 sm:mb-6">
                <table className="w-full text-sm">
                  <tbody>
                    {specs
                      .filter((s) => s.value)
                      .map((spec, i) => (
                        <tr
                          key={spec.label}
                          className={i % 2 === 0 ? "bg-muted/30" : "bg-card"}
                        >
                          <td className="py-2 px-3 sm:px-4 font-medium text-muted-foreground w-32 sm:w-40 text-xs sm:text-sm">
                            {spec.label}
                          </td>
                          <td className="py-2 px-3 sm:px-4 text-foreground text-xs sm:text-sm">
                            {spec.value}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* CTA buttons */}
              <div
                className="flex flex-col gap-3"
                data-ocid="product.cta_group"
              >
                <Button
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold w-full min-h-[52px] text-sm"
                  onClick={() => setWaPopupOpen(true)}
                  data-ocid="product.whatsapp_inquiry"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp Inquiry
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 min-h-[48px] text-sm flex items-center gap-2"
                    onClick={() => {
                      if (product) {
                        addToCart({
                          productId: String(product.id),
                          productName: product.name,
                          category: categoryName,
                          imageUrl: images[0] ?? "",
                          moq: product.moq,
                        });
                        setCartOpen(true);
                      }
                    }}
                    data-ocid="product.add_to_quote"
                  >
                    <Plus className="w-4 h-4" />
                    Add to Quote
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-primary text-primary hover:bg-primary/5 min-h-[48px] text-sm"
                    onClick={() => setSampleOpen(true)}
                    data-ocid="product.request_sample"
                  >
                    Request Sample
                  </Button>
                </div>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full min-h-[48px] text-sm border-2 border-[#1A237E] text-[#1A237E] hover:bg-[#1A237E] hover:text-white"
                >
                  <Link to={`/contact?product=${product.id}`}>
                    Send Inquiry →
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full min-h-[48px] text-sm border-2 border-[#1A237E] text-[#1A237E] hover:bg-[#1A237E] hover:text-white"
                >
                  <a href="/catalogue">📄 Get Catalogue</a>
                </Button>
              </div>

              <a
                href="tel:+917976341419"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm mt-4 w-fit"
              >
                <Phone className="w-4 h-4" />
                +91 79763 41419 — Call for bulk pricing
              </a>
            </div>
          </div>

          {/* ── Specs section ── */}
          <div className="bg-muted/30 border border-border rounded-xl p-4 sm:p-6 mb-8 sm:mb-10">
            <h2 className="font-serif text-lg sm:text-xl font-bold mb-3 sm:mb-4">
              Product Specifications
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 sm:gap-x-8 gap-y-2 sm:gap-y-3 text-sm">
              {specs
                .filter((s) => s.value)
                .map((spec) => (
                  <div key={spec.label} className="flex gap-1.5">
                    <span className="text-muted-foreground font-medium text-xs sm:text-sm shrink-0">
                      {spec.label}:{" "}
                    </span>
                    <span className="text-foreground text-xs sm:text-sm">
                      {spec.value}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* ── Why choose us ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-10">
            {[
              {
                icon: "🏭",
                title: "Direct Manufacturer",
                desc: "No middlemen — buy direct from Jaipur factory. Best wholesale prices.",
              },
              {
                icon: "🌍",
                title: "Global Export Ready",
                desc: "Export packaging, documentation and shipping to 50+ countries.",
              },
              {
                icon: "✅",
                title: "Quality Assured",
                desc: "Anti-tarnish finish, quality-checked before dispatch. Bulk samples available.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-card border border-border rounded-xl p-4 text-sm"
              >
                <p className="text-2xl mb-2">{item.icon}</p>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* ── Related products ── */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold mb-4 sm:mb-5">
                Related Products in {categoryName}
              </h2>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:pb-0">
                {relatedProducts.map((p) => (
                  <div
                    key={String(p.id)}
                    className="w-40 sm:w-44 shrink-0 md:w-auto md:shrink"
                  >
                    <RelatedProductCard
                      product={p}
                      categoryName={categoryName}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Navigation ── */}
          <div className="flex items-center justify-between mt-8 sm:mt-10 pt-5 sm:pt-6 border-t border-border gap-3">
            <Button
              asChild
              variant="outline"
              className="gap-1.5 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4 min-h-[44px] border-2 border-[#1A237E] text-[#1A237E] hover:bg-[#1A237E] hover:text-white"
            >
              <Link to={`/products?category=${product.categoryId}`}>
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to {categoryName}</span>
                <span className="sm:hidden">Back</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="gap-2 text-xs sm:text-sm px-3 sm:px-4 min-h-[44px] border-2 border-[#1A237E] text-[#1A237E] hover:bg-[#1A237E] hover:text-white"
            >
              <Link to="/products">All Products</Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />

      {/* WhatsApp Inquiry Popup */}
      <WhatsAppInquiryPopup
        isOpen={waPopupOpen}
        onClose={() => setWaPopupOpen(false)}
        productName={product.name}
      />
      {/* Request Sample Modal */}
      <RequestSampleModal
        isOpen={sampleOpen}
        onClose={() => setSampleOpen(false)}
        productName={product.name}
      />
    </div>
  );
}
