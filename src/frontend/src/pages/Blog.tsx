import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Search,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useActor } from "../hooks/useActor";
import { usePageSEO } from "../hooks/usePageSEO";
import { useCanonical } from '../hooks/useCanonical';

const BLOG_PAGE_SIZE = 12;

const CATEGORIES = [
  "All",
  "Trends",
  "Manufacturing",
  "Export",
  "Wholesale",
  "Product Categories",
  "Country Guide",
  "B2B Guide",
  "Business Growth",
  "Industry Insights",
  "Packaging",
  "Quality",
  "Commercial",
  "Bridal",
  "Export Guides",
  "Market Trends",
  "Buyer Guides",
  "Country Strategy",
  "Product Guide",
  "Pricing",
  "Supplier Info",
  "Online Selling",
  "Business Guide",
  "Collections",
  "Export Tips",
  "Product Care",
  "Import Guide",
  "Buyer Guide",
  "Materials",
  "Custom Jewellery",
  "Private Label",
];

const categoryColors: Record<string, string> = {
  Trends: "bg-sky-500/20 text-sky-400 border-sky-500/30",
  "Business Guide": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "Industry Insights": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Collections: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  "Export Tips": "bg-violet-500/20 text-violet-400 border-violet-500/30",
  "Product Care": "bg-teal-500/20 text-teal-400 border-teal-500/30",
  "Export Guides": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "Market Trends": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "Buyer Guides": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "Country Strategy": "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  "Product Guide": "bg-pink-500/20 text-pink-400 border-pink-500/30",
  Pricing: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "Supplier Info": "bg-lime-500/20 text-lime-400 border-lime-500/30",
  Quality: "bg-green-500/20 text-green-400 border-green-500/30",
  Packaging: "bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30",
  "Online Selling": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Manufacturing: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Export: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  Wholesale: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Product Categories": "bg-pink-500/20 text-pink-400 border-pink-500/30",
  "Country Guide": "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  "B2B Guide": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "Business Growth": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Bridal: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  Commercial: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "Import Guide": "bg-sky-500/20 text-sky-400 border-sky-500/30",
  "Buyer Guide": "bg-teal-500/20 text-teal-400 border-teal-500/30",
  Materials: "bg-lime-500/20 text-lime-400 border-lime-500/30",
  "Custom Jewellery": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "Private Label": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
};

export default function Blog() {
  useCanonical();
  usePageSEO({
    title: "Jewellery Export Trends 2025 — Guides & Tips | Gemora Global Blog",
    description:
      "Jewellery export trends 2025: sourcing guides, MOQ advice, country strategies & market reports for wholesale buyers in UAE, France, USA, UK and Europe.",
    canonical: "https://www.gemoraglobal.co/blog",
    ogTitle: "Jewellery Export Trends & Guides — Gemora Global Blog",
    ogDescription:
      "Expert guides on imitation jewellery export, sourcing trends, MOQ tips & wholesale strategies for global buyers.",
    ogImage: "https://www.gemoraglobal.co/images/og-banner.jpg",
    schema: {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "Gemora Global Jewellery Blog",
      url: "https://www.gemoraglobal.co/blog",
      inLanguage: "en",
      publisher: { "@type": "Organization", name: "Gemora Global" },
    },
  });

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const [backendPosts, setBackendPosts] = useState<BlogPost[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE = (import.meta as { env: Record<string,string> }).env?.VITE_API_URL
    || 'https://gemora-global-2.onrender.com';

  useEffect(() => {
    setIsLoading(true);
    fetch(`${API_BASE}/api/blog?page=${currentPage}&pageSize=${BLOG_PAGE_SIZE}`)
      .then(r => r.json())
      .then(data => {
        const items = Array.isArray(data) ? data : (data.items || []);
        const total = data.total || items.length;
        const pages = data.pages || Math.ceil(total / BLOG_PAGE_SIZE) || 1;
        setBackendPosts(items.map((b: Record<string,unknown>) => ({
          ...b,
          id: b.id,
          readTime: (b.readTime || b.readtime || '5 min read') as string,
          createdAt: b.createdAt || b.createdat || 0,
        } as BlogPost)));
        setTotalPages(Number(pages));
        setTotalCount(Number(total));
      })
      .catch(() => { setBackendPosts([]); })
      .finally(() => setIsLoading(false));
  }, [currentPage, API_BASE]);

  // Client-side category + search filter (on current page)
  const filtered = backendPosts.filter((post) => {
    const matchCat =
      activeCategory === "All" || post.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.category.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      {/* Static crawlable fallback — visible to search engines before JS runs */}
      <noscript>
        <div style={{ padding: "24px", fontFamily: "sans-serif" }}>
          <h1>Jewellery Export Insights — Gemora Global Blog</h1>
          <p>
            Expert guides on imitation jewellery sourcing, export strategies,
            MOQ advice, and wholesale tips for global buyers from Jaipur, India.
          </p>
          <h2>Blog Categories</h2>
          <ul>
            <li>Jewellery Export Guides</li>
            <li>
              Country Sourcing Strategies (UAE, USA, UK, Australia, Canada,
              Singapore)
            </li>
            <li>Wholesale Buying Tips &amp; MOQ Advice</li>
            <li>Fashion Jewellery Trends 2026</li>
            <li>Manufacturing &amp; Quality</li>
            <li>B2B Buyer Guides</li>
            <li>Packaging &amp; Logistics</li>
            <li>Business Growth for Exporters</li>
          </ul>
          <h2>Latest Articles</h2>
          <ul>
            <li>
              <a href="/blog/how-to-import-imitation-jewellery-from-india">
                How to Import Imitation Jewellery from India
              </a>
            </li>
            <li>
              <a href="/blog/best-imitation-jewellery-manufacturer-india">
                Best Imitation Jewellery Manufacturer in India
              </a>
            </li>
            <li>
              <a href="/blog/wholesale-imitation-jewellery-suppliers-jaipur">
                Wholesale Imitation Jewellery Suppliers in Jaipur
              </a>
            </li>
            <li>
              <a href="/blog/top-fashion-jewellery-trends-2026">
                Top Fashion Jewellery Trends 2026
              </a>
            </li>
            <li>
              <a href="/blog/why-buy-fashion-jewellery-indian-manufacturers">
                Why Buy Fashion Jewellery from Indian Manufacturers
              </a>
            </li>
            <li>
              <a href="/blog/wholesale-jewellery-exporter-to-uae">
                Wholesale Jewellery Exporter to UAE
              </a>
            </li>
            <li>
              <a href="/blog/fashion-jewellery-suppliers-uk-retailers">
                Fashion Jewellery Suppliers for UK Retailers
              </a>
            </li>
            <li>
              <a href="/blog/minimum-order-quantity-jewellery-export">
                Minimum Order Quantity for Jewellery Export
              </a>
            </li>
          </ul>
        </div>
      </noscript>
      <main className="pt-16">
        {/* Hero */}
        <section className="relative py-12 md:py-20 overflow-hidden px-4">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
          <div className="container relative z-10 text-center">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-primary text-sm font-semibold tracking-widest uppercase mb-3"
            >
              Gemora Global Blog
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-2xl sm:text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight"
            >
              Jewellery Insights — Export Guides, Trend Reports &amp; Sourcing
              Advice
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg mb-6"
            >
              The Gemora Global blog covers imitation jewellery sourcing guides,
              export tips, trend reports, and MOQ advice for wholesale buyers in
              UAE, France, USA, UK and Europe. Browse our{" "}
              <Link to="/products" className="text-primary hover:underline">
                product catalogue
              </Link>{" "}
              or read our{" "}
              <Link to="/wholesale" className="text-primary hover:underline">
                wholesale guide
              </Link>{" "}
              to get started.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative w-full max-w-md mx-auto"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="search"
                placeholder="Search articles…"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(0);
                }}
                data-ocid="blog.search_input"
                className="w-full pl-11 pr-4 py-3 rounded-full bg-card border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary min-h-[44px]"
              />
            </motion.div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="pb-6 px-4">
          <div
            className="flex gap-2 overflow-x-auto pb-2"
            style={{
              WebkitOverflowScrolling: "touch",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
            role="tablist"
            aria-label="Blog categories"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={activeCategory === cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setCurrentPage(0);
                }}
                type="button"
                data-ocid={`blog.filter.${cat.toLowerCase().replace(/\s+/g, "-")}`}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 whitespace-nowrap flex-shrink-0 min-h-[36px] ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Posts Grid */}
        <section
          className="container pb-16 md:pb-24 px-4"
          data-ocid="blog.section"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 md:mb-8">
            <h2 className="font-serif text-xl md:text-2xl font-bold">
              {activeCategory === "All" ? "All Articles" : activeCategory}
            </h2>
            {!isLoading && totalCount > 0 && (
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {currentPage * BLOG_PAGE_SIZE + 1}–
                  {Math.min((currentPage + 1) * BLOG_PAGE_SIZE, totalCount)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-foreground">
                  {totalCount}
                </span>{" "}
                articles
              </p>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse"
                >
                  <div className="aspect-[16/9] bg-muted" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-muted rounded w-1/4" />
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="text-center py-16 md:py-20"
              data-ocid="blog.empty_state"
            >
              <p className="text-4xl mb-4">📝</p>
              {backendPosts.length === 0 ? (
                <>
                  <p className="text-muted-foreground text-base md:text-lg mb-4 font-medium">
                    No blog posts yet.
                  </p>
                  <p className="text-muted-foreground text-sm mb-6">
                    Blog posts can be added from the admin panel.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-muted-foreground text-base md:text-lg mb-4">
                    No articles found
                    {activeCategory !== "All" ? ` in "${activeCategory}"` : ""}
                    {searchQuery ? ` for "${searchQuery}"` : ""}.
                  </p>
                  <button
                    onClick={() => {
                      setActiveCategory("All");
                      setSearchQuery("");
                    }}
                    type="button"
                    className="text-primary hover:underline text-sm min-h-[44px] px-4"
                  >
                    Clear filters
                  </button>
                </>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
                {filtered.map((post, i) => (
                  <motion.article
                    key={post.slug}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: Math.min(i * 0.05, 0.4),
                    }}
                    data-ocid={`blog.item.${currentPage * BLOG_PAGE_SIZE + i + 1}`}
                    className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-colors duration-300"
                  >
                    <Link to={`/blog/${post.slug}`}>
                      {post.image && (
                        <div className="aspect-[16/9] overflow-hidden">
                          <img
                            src={post.image}
                            alt={`${post.title} — Gemora Global jewellery export blog`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                            width={600}
                            height={338}
                          />
                        </div>
                      )}
                      <div className="p-4 md:p-5">
                        {post.category && (
                          <span
                            className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border mb-3 ${
                              categoryColors[post.category] ??
                              "bg-primary/20 text-primary border-primary/30"
                            }`}
                          >
                            {post.category}
                          </span>
                        )}
                        <h3 className="font-bold text-base md:text-lg text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                            {post.excerpt}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          {post.author && (
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {post.author}
                            </span>
                          )}
                          {post.date && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {post.date}
                            </span>
                          )}
                          {post.readTime && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {post.readTime}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div
                  className="flex flex-col items-center gap-3 mt-10"
                  data-ocid="blog.pagination"
                >
                  <div className="flex items-center gap-2 flex-wrap justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentPage((p) => Math.max(0, p - 1));
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      disabled={currentPage === 0}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:border-primary hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[40px]"
                      data-ocid="blog.pagination_prev"
                    >
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </button>

                    {/* Page number buttons — show up to 7 around current */}
                    {Array.from({ length: totalPages }, (_, i) => i)
                      .filter(
                        (i) =>
                          i === 0 ||
                          i === totalPages - 1 ||
                          Math.abs(i - currentPage) <= 2,
                      )
                      .reduce<{ type: "page" | "ellipsis"; value: number }[]>(
                        (acc, page, idx, arr) => {
                          if (idx > 0 && page - arr[idx - 1] > 1) {
                            acc.push({ type: "ellipsis", value: arr[idx - 1] });
                          }
                          acc.push({ type: "page", value: page });
                          return acc;
                        },
                        [],
                      )
                      .map((item) =>
                        item.type === "ellipsis" ? (
                          <span
                            key={`ellipsis-after-${item.value}`}
                            className="px-2 text-muted-foreground text-sm"
                          >
                            …
                          </span>
                        ) : (
                          <button
                            key={`page-${item.value}`}
                            type="button"
                            onClick={() => {
                              setCurrentPage(item.value);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className={`w-10 h-10 rounded-lg border text-sm font-medium transition-colors ${
                              currentPage === item.value
                                ? "bg-primary text-primary-foreground border-primary"
                                : "border-border hover:border-primary hover:text-primary"
                            }`}
                            data-ocid={`blog.pagination.page.${item.value + 1}`}
                          >
                            {item.value + 1}
                          </button>
                        ),
                      )}

                    <button
                      type="button"
                      onClick={() => {
                        setCurrentPage((p) => Math.min(totalPages - 1, p + 1));
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      disabled={currentPage >= totalPages - 1}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:border-primary hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[40px]"
                      data-ocid="blog.pagination_next"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Page {currentPage + 1} of {totalPages}
                  </p>
                </div>
              )}
            </>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
