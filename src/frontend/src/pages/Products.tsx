import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { ChevronDown, ChevronRight, Filter, Grid2X2, Grid3X3, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { usePageSEO } from "../hooks/usePageSEO";

const PAGE_SIZE = 24;

// Category slug → background accent color
const CAT_COLORS: Record<string, string> = {
  "imitation-jewellery": "#8B5CF6",
  "antique-jewellery": "#B45309",
  "kundan-jewellery": "#D97706",
  "american-diamond-jewellery": "#6366F1",
  "indo-western-jewellery": "#EC4899",
  "oxidised-jewellery": "#64748B",
  "western-jewellery": "#0EA5E9",
};

interface Category { id: number; name: string; slug: string; description: string; imageUrl: string; sortOrder: number; }
interface Product { id: number | bigint; name: string; categoryId: number | bigint; imageUrls: string[]; moq: string; subcategory?: string; sku?: string; featured: boolean; }

export default function Products() {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const subcategoryParam = searchParams.get("sub") || "";
  const pageParam = parseInt(searchParams.get("page") || "0");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set([categorySlug || ""]));
  const [gridCols, setGridCols] = useState<3 | 4>(4);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const API_BASE = (import.meta as { env: Record<string,string> }).env?.VITE_API_URL
    || 'https://gemora-global-2.onrender.com';

  const [categories, setCategories] = useState<Category[]>([]);
  const [allSubcats, setAllSubcats] = useState<Record<string, { subcategory: string; count: number }[]>>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Active category object
  const activeCategory = useMemo(() =>
    categories.find(c => c.slug === categorySlug) || null,
    [categories, categorySlug]
  );

  usePageSEO({
    title: subcategoryParam
      ? `${subcategoryParam} — ${activeCategory?.name || "All"} Wholesale`
      : activeCategory
        ? `${activeCategory.name} Wholesale Jaipur | Gemora Global`
        : "Wholesale Imitation Jewellery Collections | Gemora Global",
    description: activeCategory
      ? activeCategory.description || `Browse our latest collection of wholesale ${activeCategory.name} from Jaipur. MOQ 50 units, anti-tarnish finish, global export.`
      : "Browse over 500+ wholesale imitation jewellery designs in Kundan, Bridal, Antique, and Fashion styles from Gemora Global Jaipur.",
    canonical: activeCategory 
      ? `https://www.gemoraglobal.co/products/${activeCategory.slug}`
      : "https://www.gemoraglobal.co/products",
    category: activeCategory ? (activeCategory as any) : undefined,
    breadcrumbs: [
      { name: "Home", url: "https://www.gemoraglobal.co/" },
      { name: "Products", url: "https://www.gemoraglobal.co/products" },
      ...(activeCategory ? [{ name: activeCategory.name, url: `https://www.gemoraglobal.co/products/${activeCategory.slug}` }] : []),
      ...(subcategoryParam ? [{ name: subcategoryParam, url: window.location.href }] : []),
    ],
  });

  // Fetch categories once
  useEffect(() => {
    fetch(`${API_BASE}/api/categories`)
      .then(r => r.json())
      .then(data => setCategories(data))
      .catch(() => {});
  }, [API_BASE]);

  // Fetch subcategories for all categories
  useEffect(() => {
    if (!categories.length) return;
    const fetchAll = async () => {
      const result: Record<string, { subcategory: string; count: number }[]> = {};
      for (const cat of categories) {
        try {
          const r = await fetch(`${API_BASE}/api/categories/${cat.slug}/subcategories`);
          result[cat.slug] = await r.json();
        } catch { result[cat.slug] = []; }
      }
      setAllSubcats(result);
    };
    fetchAll();
  }, [categories, API_BASE]);

  // Fetch products on filter change
  useEffect(() => {
    setIsLoading(true);
    const params = new URLSearchParams({
      page: String(pageParam),
      pageSize: String(PAGE_SIZE),
    });
    if (activeCategory) params.set('categoryId', String(activeCategory.id));
    if (subcategoryParam) params.set('subcategory', subcategoryParam);

    fetch(`${API_BASE}/api/products?${params}`)
      .then(r => r.json())
      .then(data => {
        const items = Array.isArray(data) ? data : (data.items || []);
        const total = data.total || items.length;
        const pages = data.pages || Math.ceil(total / PAGE_SIZE) || 1;
        setProducts(items.map((p: Record<string,unknown>) => ({
          ...p,
          imageUrls: typeof p.imageUrls === 'string' ? JSON.parse(p.imageUrls as string) : (p.imageUrls || []),
          featured: p.featured === 1 || p.featured === true,
          isNewArrival: p.isNewArrival === 1 || p.isNewArrival === true,
        } as Product)));
        setTotalPages(Number(pages));
        setTotalCount(Number(total));
      })
      .catch(() => setProducts([]))
      .finally(() => setIsLoading(false));
  }, [activeCategory, pageParam, subcategoryParam, API_BASE]);

  // Filter and Sort products
  const displayProducts = useMemo(() => {
    let filtered = products;
    
    // Search filter
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = products.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) || 
        (p.sku && p.sku.toLowerCase().includes(lowerQuery))
      );
    }
    
    // Sort logic
    return [...filtered].sort((a, b) => {
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);
      if (sortBy === "newest") return Number(b.id) - Number(a.id);
      return 0;
    });
  }, [products, searchQuery, sortBy]);

  function toggleCat(slug: string) {
    setExpandedCats(prev => {
      const n = new Set(prev);
      if (n.has(slug)) n.delete(slug); else n.add(slug);
      return n;
    });
  }

  function setPage(p: number) {
    setSearchParams(prev => { prev.set("page", String(p)); return prev; });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function setSubcat(sub: string) {
    setSearchParams(prev => {
      if (sub) prev.set("sub", sub); else prev.delete("sub");
      prev.set("page", "0");
      return prev;
    });
  }

  // Sidebar — categories + subcategories
  const Sidebar = () => (
    <aside className="w-full md:w-64 flex-shrink-0">
      <div className="sticky top-20">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-3 h-3 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* All Products link */}
        <Link
          to="/products"
          className="block px-3 py-2 rounded-lg text-sm font-medium mb-1 transition-colors hover:bg-muted"
        >
          <span className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Back to Categories
          </span>
        </Link>

        {/* Category list with subcategories */}
        {categories.map(cat => {
          const isActive = cat.slug === categorySlug;
          const isExpanded = expandedCats.has(cat.slug);
          const subs = allSubcats[cat.slug] || [];
          const accentColor = CAT_COLORS[cat.slug] || "#6366F1";

          return (
            <div key={cat.id} className="mb-1">
              {/* Category row */}
              <div className="flex items-center">
                <Link
                  to={`/products/${cat.slug}`}
                  onClick={() => { setExpandedCats(prev => new Set([...prev, cat.slug])); setSubcat(""); }}
                  className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? "text-primary-foreground" : "hover:bg-muted"}`}
                  style={isActive ? { backgroundColor: accentColor } : {}}
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: isActive ? "white" : accentColor }}
                  />
                  {cat.name}
                </Link>
                {subs.length > 0 && (
                  <button
                    onClick={() => toggleCat(cat.slug)}
                    className="p-2 hover:bg-muted rounded-lg"
                  >
                    {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>

              {/* Subcategories */}
              {isExpanded && subs.length > 0 && (
                <div className="ml-5 mt-0.5 space-y-0.5 border-l border-border pl-3">
                  <Link
                    to={`/products/${cat.slug}`}
                    onClick={() => setSubcat("")}
                    className={`block px-2 py-1.5 text-xs rounded transition-colors ${isActive && !subcategoryParam ? "font-semibold text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
                  >
                    All {cat.name}
                  </Link>
                  {subs.map(sub => (
                    <button
                      key={sub.subcategory}
                      onClick={() => { setSubcat(sub.subcategory); }}
                      className={`w-full text-left flex items-center justify-between px-2 py-1.5 text-xs rounded transition-colors ${isActive && subcategoryParam === sub.subcategory ? "font-semibold text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
                    >
                      <span>{sub.subcategory}</span>
                      <span className="text-xs opacity-50">{sub.count}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );

  // Category Grid (Shown when no category is selected)
  const CategoryGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-6 md:py-10">
      {categories.map(cat => {
        const accentColor = CAT_COLORS[cat.slug] || "#6366F1";
        return (
          <Link
            key={cat.id}
            to={`/products/${cat.slug}`}
            className="group relative h-64 sm:h-72 lg:h-80 rounded-2xl overflow-hidden shadow-lg transition-all hover:shadow-2xl hover:-translate-y-1 active:scale-95 bg-muted"
          >
            <img
              src={cat.imageUrl || "/placeholder.jpg"}
              alt={cat.name}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              loading="lazy"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
            
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div 
                className="w-10 h-1 rounded-full mb-4 transition-all group-hover:w-16"
                style={{ backgroundColor: accentColor }}
              />
              <h3 className="text-white text-2xl font-bold font-serif mb-2 tracking-tight group-hover:translate-x-1 transition-transform">{cat.name}</h3>
              <p className="text-white/70 text-xs line-clamp-2 mb-6 group-hover:text-white/90 transition-colors">
                {cat.description || `Explore our premium collection of ${cat.name} — Jaipur quality.`}
              </p>
              <div className="flex items-center gap-2 text-white text-sm font-semibold group-hover:gap-3 transition-all">
                <span>View Products</span>
                <ChevronRight className="w-4 h-4 bg-white/20 rounded-full p-0.5" />
              </div>
            </div>
            
            {/* Badge indicating category */}
            <div className="absolute top-4 left-4">
              <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                Collection
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="bg-card border-b py-6 px-4">
          <div className="container px-0">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
              <Link to="/" className="hover:text-foreground">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link to="/products" className="hover:text-foreground">Products</Link>
              {activeCategory && (
                <>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-foreground">{activeCategory.name}</span>
                </>
              )}
              {subcategoryParam && (
                <>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-foreground">{subcategoryParam}</span>
                </>
              )}
            </nav>

            <h1 className="font-serif text-2xl md:text-3xl font-bold">
              {!categorySlug 
                ? "Our Jewellery Collections" 
                : (subcategoryParam ? `${subcategoryParam} — ${activeCategory?.name || "All"}` : activeCategory?.name)
              }
            </h1>
            {!categorySlug ? (
              <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
                Browse our curated collections of wholesale imitation jewellery, handcrafted in Jaipur.
              </p>
            ) : activeCategory?.description && !subcategoryParam && (
              <p className="text-muted-foreground text-sm mt-1 max-w-2xl">{activeCategory.description}</p>
            )}
          </div>
        </div>

        <div className="container px-4">
          {!categorySlug ? (
            <CategoryGrid />
          ) : (
            <div className="flex gap-6 py-6">
              {/* Desktop sidebar */}
              <div className="hidden md:block">
                <Sidebar />
              </div>

              {/* Main content */}
              <div className="flex-1 min-w-0">
                {/* Toolbar */}
                <div className="flex items-center justify-between mb-4 gap-3">
                  <div className="flex items-center gap-2">
                    {/* Mobile filter toggle */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="md:hidden"
                      onClick={() => setSidebarOpen(true)}
                    >
                      <Filter className="w-4 h-4 mr-2" /> Filter
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {isLoading ? "Loading..." : `${totalCount.toLocaleString()} products`}
                    </span>
                    {subcategoryParam && (
                      <button
                        onClick={() => setSubcat("")}
                        className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                      >
                        {subcategoryParam} <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <select
                      className="text-xs md:text-sm border rounded-lg bg-background px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="newest">Newest First</option>
                      <option value="name-asc">Name A-Z</option>
                      <option value="name-desc">Name Z-A</option>
                    </select>

                    {/* Grid toggle */}
                    <div className="flex items-center gap-1 border rounded-lg p-1">
                      <button
                        onClick={() => setGridCols(3)}
                        className={`p-1 rounded ${gridCols === 3 ? "bg-muted" : ""}`}
                      >
                        <Grid3X3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setGridCols(4)}
                        className={`p-1 rounded ${gridCols === 4 ? "bg-muted" : ""}`}
                      >
                        <Grid2X2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Subcategory Tabs */}
                {activeCategory && allSubcats[activeCategory.slug]?.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    <button
                      onClick={() => setSubcat("")}
                      className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-all border ${!subcategoryParam ? "bg-primary text-primary-foreground border-primary shadow-sm" : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-primary"}`}
                    >
                      All {activeCategory.name}
                    </button>
                    {allSubcats[activeCategory.slug].map(sub => (
                      <button
                        key={sub.subcategory}
                        onClick={() => setSubcat(sub.subcategory)}
                        className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-all border ${subcategoryParam === sub.subcategory ? "bg-primary text-primary-foreground border-primary shadow-sm" : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-primary"}`}
                      >
                        {sub.subcategory}
                        <span className={`ml-2 text-[10px] ${subcategoryParam === sub.subcategory ? "text-white/70" : "text-muted-foreground/60"}`}>
                          {sub.count}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Product Grid */}
                {isLoading ? (
                  <div className={`grid grid-cols-2 sm:grid-cols-${gridCols === 3 ? 3 : 2} lg:grid-cols-${gridCols} gap-3`}>
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="rounded-xl overflow-hidden border">
                        <Skeleton className="aspect-square" />
                        <div className="p-3 space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-3 w-2/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : displayProducts.length === 0 ? (
                  <div className="text-center py-20 text-muted-foreground">
                    <p className="text-4xl mb-4">💍</p>
                    <p className="font-medium">No products found</p>
                    <p className="text-sm mt-1">Try a different category or filter</p>
                    <Button asChild className="mt-4">
                      <Link to="/products">View All Categories</Link>
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-${gridCols} gap-3`}>
                      {displayProducts.map((product) => (
                        <ProductCard key={String(product.id)} product={product} />
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 mt-8">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={pageParam === 0}
                          onClick={() => setPage(pageParam - 1)}
                        >
                          Previous
                        </Button>
                        {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
                          const p = i;
                          return (
                            <Button
                              key={p}
                              variant={pageParam === p ? "default" : "outline"}
                              size="sm"
                              onClick={() => setPage(p)}
                              className="w-9"
                            >
                              {p + 1}
                            </Button>
                          );
                        })}
                        {totalPages > 7 && <span className="text-muted-foreground">...</span>}
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={pageParam >= totalPages - 1}
                          onClick={() => setPage(pageParam + 1)}
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-background overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold">Filter by Category</h2>
              <button onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <Sidebar />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

// Product Card Component
function ProductCard({ product }: { product: Product }) {
  const img = product.imageUrls?.[0];
  const name = product.name || "";

  return (
    <Link
      to={`/products/item/${String(product.id)}`}
      className="group rounded-xl overflow-hidden border border-border hover:border-primary/50 hover:shadow-md transition-all bg-card"
    >
      <div className="aspect-square overflow-hidden bg-muted relative">
        {img ? (
          <img
            src={img}
            alt={`${name} — wholesale imitation jewellery India`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            width={300}
            height={300}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 text-4xl">💍</div>
        )}
        {product.featured && (
          <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">Featured</span>
        )}
      </div>
      <div className="p-3">
        <p className="text-sm font-medium leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {name}
        </p>
        <div className="flex items-center justify-between mt-1">
          <p className="text-[10px] text-muted-foreground truncate mr-2">
            {product.subcategory || "Jewellery"}
          </p>
          {product.sku && (
            <p className="text-[10px] text-primary/70 font-mono font-medium">
              {product.sku}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted-foreground">MOQ: {product.moq || "50 units"}</span>
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Wholesale</span>
        </div>
      </div>
    </Link>
  );
}
