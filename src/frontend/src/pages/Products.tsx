import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Grid3X3,
  List,
  MessageCircle,
  Plus,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import BulkOrderCalculator from "../components/BulkOrderCalculator";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import RequestSampleModal from "../components/RequestSampleModal";
import WhatsAppInquiryPopup from "../components/WhatsAppInquiryPopup";
import { useActor } from "../hooks/useActor";
import { usePageSEO } from "../hooks/usePageSEO";
import { useQuoteCart } from "../hooks/useQuoteCart";
import type { Category, Product } from "../types";
import { useCanonical } from '../hooks/useCanonical';

// ─── Static maps ──────────────────────────────────────────────────────────────

const CATEGORY_IMAGES: Record<string, string> = {
  Necklaces: "/assets/generated/product-necklace.dim_600x600.jpg",
  Earrings: "/assets/generated/product-earrings.dim_600x600.jpg",
  Bracelets: "/assets/generated/product-bracelets.dim_600x600.jpg",
  Bangles: "/assets/generated/product-bangles.dim_600x600.jpg",
  Rings: "/assets/generated/product-rings.dim_600x600.jpg",
  "Bridal Jewellery": "/assets/generated/product-bridal.dim_600x600.jpg",
  "Minimal Fashion Jewellery":
    "/assets/generated/product-minimal.dim_600x600.jpg",
  "Bangles & Bracelets":
    "/assets/generated/jewellery-bracelets-hd.dim_800x800.jpg",
  "Maang Tikka & Headpieces":
    "/assets/generated/jewellery-necklace-hd.dim_800x800.jpg",
  "Anklets & Waist Chains":
    "/assets/generated/jewellery-bracelets-hd.dim_800x800.jpg",
  "Sets & Collections": "/assets/generated/jewellery-bridal-hd.dim_800x800.jpg",
  "Minimal Fashion": "/assets/generated/jewellery-minimal-hd.dim_800x800.jpg",
};

const PAGE_SIZE = 24;

const METALS = [
  "Gold-plated",
  "Silver-plated",
  "Rose Gold",
  "Oxidised",
  "Rhodium",
];
const OCCASIONS = ["Bridal", "Festive", "Party", "Casual", "Office"];
const STYLES = [
  "Traditional",
  "Modern",
  "Indo-Western",
  "Minimal",
  "Statement",
  "Boho",
];
const PRICE_RANGES = ["Budget", "Mid-range", "Premium"];
const SORT_OPTIONS = [
  { value: "featured", label: "Featured First" },
  { value: "name_asc", label: "Name: A–Z" },
  { value: "name_desc", label: "Name: Z–A" },
];

// ─── Types ───────────────────────────────────────────────────────────────────

type NormalizedProduct = {
  id: bigint;
  name: string;
  description: string;
  categoryId: bigint;
  imageUrls: string[];
  moq: string;
  featured: boolean;
  tags: string[];
  metal: string;
  occasion: string;
  style: string;
  priceRange: string;
};

interface FilterState {
  metals: string[];
  occasions: string[];
  styles: string[];
  priceRanges: string[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

function normalizeProduct(p: Product): NormalizedProduct {
  return {
    id: p.id,
    name: cleanProductText(p.name),
    description: cleanProductText(p.description),
    categoryId: p.categoryId,
    imageUrls: p.imageUrls,
    moq: p.moq,
    featured: p.featured,
    tags: [],
    metal: "Gold-plated",
    occasion: "Casual",
    style: "Modern",
    priceRange: "Mid-range",
  };
}

// ─── Pagination controls ──────────────────────────────────────────────────────

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      pages.push(0);
      if (currentPage > 2) pages.push("...");
      for (
        let i = Math.max(1, currentPage - 1);
        i <= Math.min(totalPages - 2, currentPage + 1);
        i++
      )
        pages.push(i);
      if (currentPage < totalPages - 3) pages.push("...");
      pages.push(totalPages - 1);
    }
    return pages;
  };

  return (
    <div
      className="flex items-center justify-center gap-1.5 mt-8"
      data-ocid="products.pagination"
    >
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="min-h-[36px] px-2"
        data-ocid="products.pagination_prev"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {getPages().map((page) =>
        page === "..." ? (
          <span
            key={`ellipsis-${page}`}
            className="px-2 text-muted-foreground text-sm"
          >
            …
          </span>
        ) : (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page as number)}
            className="min-h-[36px] min-w-[36px] px-0"
            data-ocid={`products.page.${(page as number) + 1}`}
          >
            {(page as number) + 1}
          </Button>
        ),
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
        className="min-h-[36px] px-2"
        data-ocid="products.pagination_next"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}

// ─── Quick View Modal ─────────────────────────────────────────────────────────

function QuickViewModal({
  product,
  open,
  onClose,
}: {
  product: NormalizedProduct | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!product) return null;
  const img =
    product.imageUrls[0] ||
    "/assets/generated/product-necklace.dim_600x600.jpg";
  const waMsg = encodeURIComponent(
    `Hi GEMORA GLOBAL, I'm interested in ${product.name} (MOQ: ${product.moq}). Please share wholesale pricing.`,
  );
  const waLink = `https://wa.me/917976341419?text=${waMsg}`;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent className="max-w-3xl p-0 overflow-hidden w-[95vw] sm:w-auto">
        <div className="grid sm:grid-cols-2">
          <div className="relative bg-muted aspect-square">
            <img
              src={img}
              alt={`${product.name} — wholesale imitation jewellery Jaipur India`}
              className="w-full h-full object-cover"
              width={480}
              height={480}
              loading="lazy"
            />
            {product.featured && (
              <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                Featured
              </span>
            )}
            <span className="badge-moq">Min. Qty: {product.moq}</span>
          </div>
          <div className="p-5 flex flex-col">
            <DialogHeader className="mb-3">
              <DialogTitle className="font-serif text-lg sm:text-xl leading-snug">
                {product.name}
              </DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {product.description}
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4 text-sm">
              <span className="text-muted-foreground font-medium">Stock</span>
              <span className="text-green-600 font-semibold text-xs">
                In Stock
              </span>
            </div>
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mb-4 flex items-center gap-3">
              <span className="text-destructive font-bold text-lg">📦</span>
              <div>
                <p className="text-xs text-muted-foreground leading-none mb-0.5">
                  Minimum Order Quantity
                </p>
                <p className="font-bold text-destructive">{product.moq}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-auto">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors text-sm min-h-[48px]"
                data-ocid="quickview.whatsapp_cta"
              >
                <MessageCircle className="w-4 h-4" />
                Send Inquiry via WhatsApp
              </a>
              <Button
                asChild
                variant="outline"
                className="border-primary text-primary hover:bg-primary/5 text-sm min-h-[44px]"
              >
                <Link
                  to={`/products/${product.id}`}
                  onClick={onClose}
                  data-ocid="quickview.view_details"
                >
                  View Full Details →
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Filter Group ─────────────────────────────────────────────────────────────

function FilterGroup({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className="mb-5">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
        {title}
      </h3>
      <div className="space-y-2">
        {options.map((opt) => (
          <label
            key={opt}
            className="flex items-center gap-2.5 cursor-pointer group min-h-[36px] sm:min-h-0"
          >
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={() => onToggle(opt)}
              className="accent-primary w-4 h-4 shrink-0"
            />
            <span className="text-sm text-foreground group-hover:text-primary transition-colors">
              {opt}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

function FilterSidebar({
  filters,
  setFilters,
  totalCount,
  filteredCount,
  onClose,
  isMobile,
}: {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  totalCount: number;
  filteredCount: number;
  onClose?: () => void;
  isMobile?: boolean;
}) {
  const toggle = (key: keyof FilterState, value: string) =>
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  const clearAll = () =>
    setFilters({ metals: [], occasions: [], styles: [], priceRanges: [] });
  const hasFilters =
    filters.metals.length +
      filters.occasions.length +
      filters.styles.length +
      filters.priceRanges.length >
    0;

  return (
    <aside className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-sm uppercase tracking-wider">
          Filters
        </h2>
        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs text-primary hover:underline"
          >
            Clear all
          </button>
        )}
      </div>
      <FilterGroup
        title="Metal / Finish"
        options={METALS}
        selected={filters.metals}
        onToggle={(v) => toggle("metals", v)}
      />
      <FilterGroup
        title="Occasion"
        options={OCCASIONS}
        selected={filters.occasions}
        onToggle={(v) => toggle("occasions", v)}
      />
      <FilterGroup
        title="Style"
        options={STYLES}
        selected={filters.styles}
        onToggle={(v) => toggle("styles", v)}
      />
      <FilterGroup
        title="Price Range"
        options={PRICE_RANGES}
        selected={filters.priceRanges}
        onToggle={(v) => toggle("priceRanges", v)}
      />
      <div className="text-xs text-muted-foreground border-t border-border pt-3 mb-4">
        Showing {filteredCount} of {totalCount} products
      </div>
      {isMobile && (
        <div className="flex gap-3">
          <Button
            className="flex-1 bg-primary text-primary-foreground min-h-[48px]"
            onClick={onClose}
            data-ocid="filters.apply_mobile"
          >
            Apply Filters
          </Button>
          {hasFilters && (
            <Button
              variant="outline"
              className="min-h-[48px]"
              onClick={() => {
                clearAll();
                onClose?.();
              }}
            >
              Clear
            </Button>
          )}
        </div>
      )}
    </aside>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({
  product,
  onQuickView,
  onInquiry,
  onAddToQuote,
  onRequestSample,
  getImage,
}: {
  product: NormalizedProduct;
  onQuickView: (p: NormalizedProduct) => void;
  onInquiry: (p: NormalizedProduct) => void;
  onAddToQuote: (p: NormalizedProduct) => void;
  onRequestSample: (p: NormalizedProduct) => void;
  getImage: (p: NormalizedProduct) => string;
}) {
  return (
    <div
      className="product-card group relative flex flex-col"
      data-ocid={`product-card.${product.id}`}
    >
      <div className="relative aspect-square overflow-hidden">
        <Link to={`/products/${product.id}`} tabIndex={-1}>
          <img
            src={getImage(product)}
            alt={`${product.name} — wholesale imitation jewellery Jaipur India`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            width={400}
            height={400}
          />
        </Link>
        {product.featured && (
          <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide z-10">
            Featured
          </span>
        )}
        <span className="badge-moq z-10">Min. Qty: {product.moq}</span>
        <button
          type="button"
          onClick={() => onQuickView(product)}
          aria-label={`Quick view ${product.name}`}
          className="hidden sm:flex absolute inset-0 items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all duration-300 opacity-0 group-hover:opacity-100 z-20"
          data-ocid={`product-card.quickview.${product.id}`}
        >
          <span className="flex items-center gap-1.5 bg-card text-foreground text-xs font-semibold px-3 py-1.5 rounded-full shadow-elevated translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <Eye className="w-3.5 h-3.5" /> Quick View
          </span>
        </button>
      </div>
      <div className="p-2.5 sm:p-3 flex-1 flex flex-col">
        <Link to={`/products/${product.id}`} className="block mb-1">
          <h3 className="font-semibold text-xs sm:text-sm leading-snug line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-[11px] sm:text-xs text-muted-foreground line-clamp-2 mb-2 flex-1 hidden sm:block">
          {product.description}
        </p>
        <Button
          size="sm"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-[11px] sm:text-xs h-8 min-h-[36px] sm:min-h-0"
          onClick={() => onInquiry(product)}
          data-ocid={`product-card.inquiry.${product.id}`}
        >
          Get Wholesale Quote
        </Button>
        <div className="flex gap-1.5 mt-1.5">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 text-[10px] h-7 min-h-[32px] border-primary/50 text-primary hover:bg-primary/5 px-1"
            onClick={() => onAddToQuote(product)}
            data-ocid={`product-card.add_quote.${product.id}`}
          >
            <Plus className="w-3 h-3 mr-0.5" /> Add to Quote
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 text-[10px] h-7 min-h-[32px] px-1 border-border text-muted-foreground hover:text-foreground"
            onClick={() => onRequestSample(product)}
            data-ocid={`product-card.sample.${product.id}`}
          >
            Sample
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Products Page ───────────────────────────────────────────────────────

export default function Products() {
  useCanonical();
  usePageSEO({
    title:
      "Imitation Jewellery Wholesale Catalogue — 500+ Designs | Gemora Global",
    description:
      "Browse Gemora Global's imitation jewellery wholesale catalogue — necklaces, earrings, bangles, rings, bridal sets. MOQ 50 pcs. Anti-tarnish. Export from Jaipur, India.",
    canonical: "https://www.gemoraglobal.co/products",
    ogTitle: "Imitation Jewellery Wholesale Catalogue | Gemora Global",
    ogDescription:
      "500+ wholesale imitation jewellery designs. MOQ 50 units. Factory-direct from Jaipur, India. Shipping to UAE, USA, UK & Europe.",
    ogImage: "https://www.gemoraglobal.co/images/og-banner.jpg",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        url: "https://www.gemoraglobal.co/products",
        name: "Wholesale Imitation Jewellery Products | Gemora Global",
        description:
          "500+ wholesale imitation jewellery designs — necklaces, earrings, bangles, rings, bridal sets. Manufacturer from Jaipur, India.",
        breadcrumb: {
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
          ],
        },
      },
    ],
  });

  const { actor, isFetching: actorFetching } = useActor();
  const { addToCart, setOpen: setCartOpen } = useQuoteCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCatId = searchParams.get("category");

  const [quickViewProduct, setQuickViewProduct] =
    useState<NormalizedProduct | null>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [waPopupOpen, setWaPopupOpen] = useState(false);
  const [waProductName, setWaProductName] = useState("");
  const [sampleOpen, setSampleOpen] = useState(false);
  const [sampleProductName, setSampleProductName] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    metals: [],
    occasions: [],
    styles: [],
    priceRanges: [],
  });
  const [currentPage, setCurrentPage] = useState(0);

  // Reset to page 0 whenever filters/category changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional reset on filter change
  useEffect(() => {
    setCurrentPage(0);
  }, [activeCatId, search, filters]);

  const actorReady = true; // REST API actor is always ready

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => actor!.getCategories(),
    enabled: actorReady,
  });

  // Use paginated endpoint — 24 products per page
  // backend.d.ts: getProductsPaginated(categoryId: bigint | null, ...) — null = all categories
  const { data: pagedResult, isLoading: prodsLoading } = useQuery({
    queryKey: ["products-paginated", activeCatId, currentPage],
    queryFn: () => {
      const catIdParam = activeCatId ? BigInt(activeCatId) : null;
      return actor!.getProductsPaginated(
        catIdParam,
        BigInt(currentPage),
        BigInt(PAGE_SIZE),
      );
    },
    enabled: actorReady,
  });

  const pageProducts: NormalizedProduct[] = useMemo(
    () => (pagedResult?.items ?? []).map(normalizeProduct),
    [pagedResult],
  );

  const totalPages = pagedResult ? Number(pagedResult.pages) : 0;
  const totalCount = pagedResult ? Number(pagedResult.total) : 0;

  // Client-side filtering (metal/occasion/style/price/search/sort) applied on current page
  const filteredProducts = useMemo(() => {
    let result = pageProducts;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }
    if (filters.metals.length > 0)
      result = result.filter((p) => filters.metals.includes(p.metal));
    if (filters.occasions.length > 0)
      result = result.filter((p) => filters.occasions.includes(p.occasion));
    if (filters.styles.length > 0)
      result = result.filter((p) => filters.styles.includes(p.style));
    if (filters.priceRanges.length > 0)
      result = result.filter((p) => filters.priceRanges.includes(p.priceRange));
    if (sort === "featured")
      result = [...result].sort(
        (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0),
      );
    else if (sort === "name_asc")
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "name_desc")
      result = [...result].sort((a, b) => b.name.localeCompare(a.name));
    return result;
  }, [pageProducts, search, filters, sort]);

  const activeFilterCount =
    filters.metals.length +
    filters.occasions.length +
    filters.styles.length +
    filters.priceRanges.length;

  const getProductImage = (p: NormalizedProduct) => {
    if (p.imageUrls.length > 0 && !p.imageUrls[0].includes("placehold.co"))
      return p.imageUrls[0];
    const catName =
      (categories ?? []).find((c) => c.id === p.categoryId)?.name ?? "";
    return (
      CATEGORY_IMAGES[catName] ||
      "/assets/generated/product-necklace.dim_600x600.jpg"
    );
  };

  const getCategoryImage = (cat: Category) => {
    if (cat.imageUrl && !cat.imageUrl.includes("placehold.co"))
      return cat.imageUrl;
    return (
      CATEGORY_IMAGES[cat.name] ||
      "/assets/generated/jewellery-necklace-hd.dim_800x800.jpg"
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Page hero */}
        <div className="bg-card border-b border-border py-5 sm:py-8">
          <div className="container px-4 sm:px-6">
            <nav
              className="text-xs text-muted-foreground mb-2 sm:mb-3 flex items-center gap-1 flex-wrap"
              aria-label="Breadcrumb"
            >
              <Link to="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-foreground font-medium">Products</span>
            </nav>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
              Wholesale Imitation Jewellery — 500+ Designs
            </h1>
            <p className="text-muted-foreground max-w-2xl text-xs sm:text-sm">
              Bulk artificial jewellery manufacturer from Jaipur, India —
              premium imitation jewellery for boutiques, distributors &amp;
              wholesale buyers worldwide. MOQ starts at 50 pcs.
            </p>
          </div>
        </div>

        {/* Sticky category tabs */}
        <div className="bg-card border-b border-border sticky top-16 z-20 shadow-sm">
          <div className="container px-4 sm:px-6">
            <div
              className="flex gap-1.5 overflow-x-auto py-2.5 scrollbar-hide"
              data-ocid="category.tabs"
            >
              <button
                type="button"
                onClick={() => {
                  setSearchParams(new URLSearchParams());
                  setCurrentPage(0);
                }}
                className={`shrink-0 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all border ${!activeCatId ? "bg-primary text-primary-foreground border-primary" : "border-border text-foreground hover:border-primary hover:text-primary"}`}
              >
                All
              </button>
              {(categories ?? []).map((cat) => (
                <button
                  key={String(cat.id)}
                  type="button"
                  onClick={() => {
                    setSearchParams(
                      new URLSearchParams({ category: String(cat.id) }),
                    );
                    setCurrentPage(0);
                  }}
                  className={`shrink-0 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all border ${activeCatId === String(cat.id) ? "bg-primary text-primary-foreground border-primary" : "border-border text-foreground hover:border-primary hover:text-primary"}`}
                  data-ocid={`category.tab.${cat.id}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Shop by Category — full-width section, shown only when no filters active */}
        {!activeCatId &&
          !search &&
          activeFilterCount === 0 &&
          (categories ?? []).length > 0 && (
            <div
              className="bg-card border-b border-border py-6 sm:py-8"
              data-ocid="products.category_section"
            >
              <div className="container px-4 sm:px-6">
                <h2 className="font-serif text-lg sm:text-xl font-bold mb-1 text-foreground">
                  Browse by Category
                </h2>
                <p className="text-xs text-muted-foreground mb-4 sm:mb-5">
                  Select a category to filter the product catalogue below
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
                  {(categories ?? []).map((cat) => (
                    <button
                      key={String(cat.id)}
                      type="button"
                      onClick={() => {
                        setSearchParams(
                          new URLSearchParams({ category: String(cat.id) }),
                        );
                        setCurrentPage(0);
                      }}
                      className="group relative overflow-hidden rounded-xl aspect-square cursor-pointer border border-border hover:border-primary hover:shadow-md transition-all"
                      data-ocid={`products.category_card.${cat.id}`}
                    >
                      <img
                        src={getCategoryImage(cat)}
                        alt={`${cat.name} wholesale jewellery`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        width={300}
                        height={300}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 text-left">
                        <p className="font-semibold text-white text-xs sm:text-sm drop-shadow">
                          {cat.name}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        {/* Product grid section — always below categories */}
        <div className="border-t-2 border-primary/20 bg-background">
          <div className="container px-4 sm:px-6 pt-6 pb-2">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-1 mb-1">
              <div>
                <h2 className="font-serif text-lg sm:text-2xl font-bold text-foreground leading-tight">
                  Wholesale Imitation Jewellery — 500+ Designs
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Bulk artificial jewellery manufacturer from Jaipur, India —
                  premium imitation jewellery for boutiques, distributors &amp;
                  wholesale buyers worldwide. MOQ starts at 50 pcs.
                </p>
              </div>
            </div>
          </div>
          <div className="container px-4 sm:px-6 py-4 sm:py-6">
            {/* Controls bar */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 items-stretch sm:items-center mb-4">
              <div className="flex gap-2 flex-1">
                <div className="relative flex-1">
                  <svg
                    aria-hidden="true"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search jewellery..."
                    className="pl-9 h-10 text-sm w-full"
                    data-ocid="products.search"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-2 border border-border rounded-lg text-sm hover:border-primary transition-colors shrink-0 min-h-[40px] min-w-[80px] justify-center"
                  data-ocid="products.filter_toggle"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span className="text-xs font-medium">Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="bg-primary text-primary-foreground text-[10px] rounded-full w-4 h-4 flex items-center justify-center shrink-0">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>
              <div className="flex gap-2 items-center">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="flex-1 sm:flex-none border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:border-primary h-10"
                  data-ocid="products.sort"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <div className="flex border border-border rounded-lg overflow-hidden shrink-0">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    aria-label="Grid view"
                    className={`p-2.5 transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                  >
                    <Grid3X3 className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    aria-label="List view"
                    className={`p-2.5 transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                  >
                    <List className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
                <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                  {totalCount} products
                </span>
              </div>
            </div>

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {(
                  Object.entries(filters) as [keyof FilterState, string[]][]
                ).map(([key, vals]) =>
                  vals.map((v) => (
                    <span
                      key={`${key}-${v}`}
                      className="inline-flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-0.5 text-xs"
                    >
                      {v}
                      <button
                        type="button"
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            [key]: prev[key].filter((x) => x !== v),
                          }))
                        }
                        className="hover:text-destructive transition-colors ml-0.5 min-w-[20px] min-h-[20px] flex items-center justify-center"
                        aria-label={`Remove ${v} filter`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )),
                )}
                <button
                  type="button"
                  onClick={() =>
                    setFilters({
                      metals: [],
                      occasions: [],
                      styles: [],
                      priceRanges: [],
                    })
                  }
                  className="text-xs text-muted-foreground hover:text-foreground underline"
                >
                  Clear all
                </button>
              </div>
            )}

            <div className="flex gap-5 lg:gap-6">
              {/* Desktop sidebar */}
              <div className="hidden lg:block w-52 shrink-0">
                <div className="sticky top-36 bg-card border border-border rounded-xl p-4">
                  <FilterSidebar
                    filters={filters}
                    setFilters={setFilters}
                    totalCount={totalCount}
                    filteredCount={filteredProducts.length}
                  />
                </div>
              </div>

              {/* Mobile filter drawer */}
              {mobileFiltersOpen && (
                <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
                  <div
                    className="absolute inset-0 bg-black/50"
                    onClick={() => setMobileFiltersOpen(false)}
                    role="button"
                    tabIndex={-1}
                    aria-label="Close filters"
                    onKeyDown={(e) =>
                      e.key === "Escape" && setMobileFiltersOpen(false)
                    }
                  />
                  <div className="relative bg-background rounded-t-2xl max-h-[85vh] flex flex-col shadow-2xl">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
                      <span className="font-semibold text-base">
                        Filter Products
                      </span>
                      <button
                        type="button"
                        onClick={() => setMobileFiltersOpen(false)}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
                        aria-label="Close filters"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="overflow-y-auto flex-1 px-5 py-4">
                      <FilterSidebar
                        filters={filters}
                        setFilters={setFilters}
                        totalCount={totalCount}
                        filteredCount={filteredProducts.length}
                        onClose={() => setMobileFiltersOpen(false)}
                        isMobile
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Main content */}
              <div className="flex-1 min-w-0">
                {prodsLoading ? (
                  <div
                    className={`grid gap-3 sm:gap-4 ${viewMode === "grid" ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}
                  >
                    {Array.from({ length: 8 }, (_, i) => `sk-${i}`).map((k) => (
                      <Skeleton key={k} className="aspect-square rounded-lg" />
                    ))}
                  </div>
                ) : filteredProducts.length > 0 ? (
                  <>
                    {activeCatId && (
                      <h2 className="font-serif text-base sm:text-lg font-bold mb-3 sm:mb-4">
                        {
                          (categories ?? []).find(
                            (c) => String(c.id) === activeCatId,
                          )?.name
                        }{" "}
                        Collection
                      </h2>
                    )}

                    {viewMode === "grid" ? (
                      <div
                        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
                        data-ocid="products.grid"
                      >
                        {filteredProducts.map((product) => (
                          <ProductCard
                            key={String(product.id)}
                            product={product}
                            onQuickView={(p) => {
                              setQuickViewProduct(p);
                              setQuickViewOpen(true);
                            }}
                            onInquiry={(p) => {
                              setWaProductName(p.name);
                              setWaPopupOpen(true);
                            }}
                            onAddToQuote={(p) => {
                              addToCart({
                                productId: String(p.id),
                                productName: p.name,
                                category:
                                  (categories ?? []).find(
                                    (c) => c.id === p.categoryId,
                                  )?.name ?? "Jewellery",
                                imageUrl: getProductImage(p),
                                moq: p.moq,
                              });
                              setCartOpen(true);
                            }}
                            onRequestSample={(p) => {
                              setSampleProductName(p.name);
                              setSampleOpen(true);
                            }}
                            getImage={getProductImage}
                          />
                        ))}
                      </div>
                    ) : (
                      <div
                        className="flex flex-col gap-3"
                        data-ocid="products.list"
                      >
                        {filteredProducts.map((product) => (
                          <div
                            key={String(product.id)}
                            className="flex gap-3 sm:gap-4 rounded-xl overflow-hidden border border-border hover:border-primary/50 hover:shadow-md transition-all bg-card p-2.5 sm:p-3"
                            data-ocid={`product-list-row.${product.id}`}
                          >
                            <Link
                              to={`/products/${product.id}`}
                              className="shrink-0"
                            >
                              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden">
                                <img
                                  src={getProductImage(product)}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                  width={96}
                                  height={96}
                                />
                              </div>
                            </Link>
                            <div className="flex-1 min-w-0">
                              <Link to={`/products/${product.id}`}>
                                <h3 className="font-semibold text-xs sm:text-sm mb-1 hover:text-primary transition-colors line-clamp-2">
                                  {product.name}
                                </h3>
                              </Link>
                              <p className="text-xs text-muted-foreground line-clamp-2 mb-2 hidden sm:block">
                                {product.description}
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {product.metal && (
                                  <Badge
                                    variant="outline"
                                    className="text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0"
                                  >
                                    {product.metal}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="shrink-0 self-center flex flex-col gap-2">
                              <Button
                                size="sm"
                                className="bg-primary text-primary-foreground text-[10px] sm:text-xs h-8 whitespace-nowrap px-2 sm:px-3 min-h-[36px]"
                                onClick={() => {
                                  setWaProductName(product.name);
                                  setWaPopupOpen(true);
                                }}
                              >
                                Get Quote
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-[10px] sm:text-xs h-8 hidden sm:flex min-h-[36px] border-primary/50 text-primary"
                                onClick={() => {
                                  addToCart({
                                    productId: String(product.id),
                                    productName: product.name,
                                    category:
                                      (categories ?? []).find(
                                        (c) => c.id === product.categoryId,
                                      )?.name ?? "Jewellery",
                                    imageUrl: getProductImage(product),
                                    moq: product.moq,
                                  });
                                  setCartOpen(true);
                                }}
                              >
                                <Plus className="w-3 h-3 mr-1" /> Add Quote
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Pagination */}
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={(p) => {
                        setCurrentPage(p);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    />
                  </>
                ) : (
                  <div
                    className="text-center py-16 sm:py-20"
                    data-ocid="products.empty_state"
                  >
                    <p className="text-4xl sm:text-5xl mb-4">💎</p>
                    <p className="text-muted-foreground mb-2 font-medium">
                      {prodsLoading
                        ? "Loading products..."
                        : "No products found."}
                    </p>
                    <p className="text-muted-foreground text-sm mb-6">
                      {activeFilterCount > 0
                        ? "Try adjusting or clearing your filters."
                        : "Browse a category or check back soon."}
                    </p>
                    <div className="flex gap-3 justify-center flex-wrap">
                      {activeFilterCount > 0 && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setFilters({
                              metals: [],
                              occasions: [],
                              styles: [],
                              priceRanges: [],
                            });
                            setSearch("");
                            setSearchParams(new URLSearchParams());
                          }}
                        >
                          Clear All Filters
                        </Button>
                      )}
                      <Button
                        asChild
                        className="bg-primary text-primary-foreground"
                      >
                        <Link to="/contact">Request Custom Catalogue</Link>
                      </Button>
                    </div>
                  </div>
                )}

                {/* SEO block */}
                <div className="bg-muted/40 border border-border rounded-xl p-4 sm:p-6 mt-8 sm:mt-10">
                  <h2 className="font-serif text-base sm:text-lg font-bold mb-3">
                    Export Quality Wholesale Imitation Jewellery from Jaipur,
                    India
                  </h2>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-3">
                    Gemora Global is a leading{" "}
                    <Link
                      to="/wholesale"
                      className="text-primary hover:underline"
                    >
                      bulk artificial jewellery manufacturer
                    </Link>{" "}
                    from Jaipur, India's jewellery capital. We supply premium
                    imitation jewellery to wholesale buyers in USA, UK, France,
                    UAE, and 50+ countries.
                  </p>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                    MOQ starts at just 50 pieces per design.{" "}
                    <Link
                      to="/contact"
                      className="text-primary hover:underline"
                    >
                      Contact us
                    </Link>{" "}
                    for the latest catalogue and wholesale pricing.
                  </p>
                </div>

                {/* Bulk Order Calculator */}
                <div className="mt-10">
                  <BulkOrderCalculator
                    products={pageProducts.map((p) => ({
                      id: p.id,
                      categoryId: p.categoryId,
                      name: p.name,
                      description: p.description,
                      moq: p.moq,
                      imageUrls: p.imageUrls,
                      featured: p.featured,
                      isNewArrival: false,
                      createdAt: 0n,
                    }))}
                    compact
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* end product grid section wrapper */}
      </div>

      <Footer />

      <QuickViewModal
        product={quickViewProduct}
        open={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
      <WhatsAppInquiryPopup
        isOpen={waPopupOpen}
        onClose={() => setWaPopupOpen(false)}
        productName={waProductName}
      />
      <RequestSampleModal
        isOpen={sampleOpen}
        onClose={() => setSampleOpen(false)}
        productName={sampleProductName}
      />
    </div>
  );
}
