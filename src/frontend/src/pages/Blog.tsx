import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Search,
  User,
  Loader2,
} from "lucide-react";
import api from '../lib/api';
import { toast } from 'sonner';
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useActor } from "../hooks/useActor";
import { usePageSEO } from "../hooks/usePageSEO";
import { useCanonical } from '../hooks/useCanonical';
import { blogService, getSafeBlogImage, handleImageError } from "../utils/blogService";
import { type BlogPost } from "../utils/blogStore";

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

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const fullRequirement = `Email: ${form.email} | Phone: ${form.phone}\n\nMessage:\n${form.message}`;
      await api.submitInquiry({
        name: form.name,
        country: form.country,
        whatsapp: form.phone,
        requirement: fullRequirement,
      });
      toast.success("Thank you! Your sourcing inquiry has been sent to our export desk.");
      setForm({
        name: "",
        email: "",
        phone: "",
        country: "",
        message: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit inquiry. Please scan the QR code to chat directly on WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [backendPosts, setBackendPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE = (import.meta as { env: Record<string,string> }).env?.VITE_API_URL
    || 'https://gemora-global-2.onrender.com';

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // 1. Load batch 62
        await blogService.loadBatchFromJson(62);

        // 2. Fetch backend posts (fetch first 500 to enable dynamic client-side filtering/pagination)
        const response = await fetch(`${API_BASE}/api/blog?page=0&pageSize=500`);
        const data = await response.json();
        const backendItems = (Array.isArray(data) ? data : (data.items || [])) as BlogPost[];
        
        // 3. Combine with static batches
        const servicePosts = blogService.getAllPosts();
        const allPosts = [...servicePosts, ...backendItems];
        
        // Filter unique by slug
        const uniquePosts = Array.from(new Map(allPosts.map(p => [p.slug, p])).values());
        setBackendPosts(uniquePosts);
      } catch (error) {
        console.error("Failed to load blog data:", error);
        setBackendPosts(blogService.getAllPosts());
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [API_BASE]);

  // Client-side category + search filter (across all combined posts)
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

  // Calculate client-side pagination parameters dynamically based on current filter list
  const totalCount = filtered.length;
  const totalPages = Math.ceil(totalCount / BLOG_PAGE_SIZE) || 1;
  const activePage = Math.min(currentPage, Math.max(0, totalPages - 1));

  // Determine if page 1 displays a premium full-width "Spotlight Featured Card"
  const showSpotlight = activePage === 0 && filtered.length > 0 && searchQuery === "";
  const spotlightPost = showSpotlight ? filtered[0] : null;

  // Slice the filtered articles. If showing a spotlight, exclude it from the grid items
  const gridPosts = showSpotlight
    ? filtered.slice(1, BLOG_PAGE_SIZE)
    : filtered.slice(activePage * BLOG_PAGE_SIZE, (activePage + 1) * BLOG_PAGE_SIZE);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      {/* Static crawlable fallback for Google bot */}
      <noscript>
        <div style={{ padding: "24px", fontFamily: "sans-serif" }}>
          <h1>Jewellery Export Insights — Gemora Global Blog</h1>
          <p>
            Expert guides on imitation jewellery sourcing, export strategies,
            MOQ advice, and wholesale tips for global buyers from Jaipur, India.
          </p>
          <h2>Latest Articles</h2>
          <ul>
            {filtered.slice(0, 30).map(post => (
              <li key={post.slug}>
                <a href={`/blog/${post.slug}`}>{post.title}</a>
              </li>
            ))}
          </ul>
        </div>
      </noscript>

      <main className="pt-16 pb-20">
        {/* Header Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden px-4">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.08),rgba(255,255,255,0))]" />
          <div className="container relative z-10 text-center max-w-4xl">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-primary text-xs md:text-sm font-semibold tracking-widest uppercase mb-4"
            >
              Gemora Global B2B Journal
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6 leading-tight"
            >
              Jewellery Export Insights &amp; Sourcing Advice
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg mb-8 leading-relaxed"
            >
              Expert trend reports, factory sourcing guides, MOQ optimization, and customs strategies for international jewelry boutique owners.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative w-full max-w-lg mx-auto"
            >
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="search"
                placeholder="Search premium articles..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(0);
                }}
                data-ocid="blog.search_input"
                className="w-full pl-12 pr-5 py-4 rounded-2xl bg-card/65 border border-border/80 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-lg min-h-[48px]"
              />
            </motion.div>
          </div>
        </section>

        {/* Category Filters */}
        <section className="container px-4 pb-12 border-b border-border/40">
          <div
            className="flex gap-2.5 overflow-x-auto pb-3"
            style={{
              WebkitOverflowScrolling: "touch",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
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
                className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/40 whitespace-nowrap flex-shrink-0 min-h-[38px] ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-[1.03]"
                    : "bg-card/40 text-muted-foreground border-border/80 hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Main Content Area */}
        <section className="container px-4 py-12" data-ocid="blog.section">
          {isLoading ? (
            <div className="space-y-12 animate-pulse">
              <div className="h-96 bg-muted rounded-3xl" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-72 bg-muted rounded-2xl" />
                ))}
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 bg-card/20 border border-border/50 rounded-3xl" data-ocid="blog.empty_state">
              <p className="text-5xl mb-4">💎</p>
              <p className="text-muted-foreground text-lg mb-3 font-semibold">No articles found</p>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
                Try searching for a different jewellery term or clear active filters.
              </p>
              <button
                onClick={() => {
                  setActiveCategory("All");
                  setSearchQuery("");
                  setCurrentPage(0);
                }}
                type="button"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow hover:bg-primary/95 transition-all"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="space-y-16">
              
              {/* spotlight featured card (BR Softech Style Hero Banner) */}
              {showSpotlight && spotlightPost && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="group relative overflow-hidden rounded-3xl border border-border/85 bg-card/45 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <Link to={`/blog/${spotlightPost.slug}`} className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                    <div className="lg:col-span-7 aspect-[16/10] lg:aspect-auto lg:h-[480px] overflow-hidden relative">
                      <img
                        src={getSafeBlogImage(spotlightPost)}
                        alt={spotlightPost.title}
                        onError={handleImageError}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                        loading="eager"
                        fetchPriority="high"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-background/90 via-transparent to-transparent" />
                      <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full shadow">
                        Spotlight Article
                      </div>
                    </div>
                    <div className="lg:col-span-5 p-6 sm:p-8 md:p-10 flex flex-col justify-center space-y-4">
                      <span className={`inline-block self-start text-xs font-semibold px-3 py-1 rounded-full border ${categoryColors[spotlightPost.category] || "bg-primary/20 text-primary border-primary/30"}`}>
                        {spotlightPost.category}
                      </span>
                      <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300 leading-snug">
                        {spotlightPost.title}
                      </h2>
                      <p className="text-muted-foreground text-sm sm:text-base line-clamp-4 leading-relaxed">
                        {spotlightPost.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-4 border-t border-border/50">
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5" />
                          {spotlightPost.author}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {spotlightPost.date}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* Grid Section */}
              <div className="space-y-8">
                <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">
                  {activeCategory === "All" ? "Latest Sourcing Guides" : `${activeCategory} Articles`}
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {gridPosts.map((post, i) => (
                    <motion.article
                      key={post.slug}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: Math.min(i * 0.05, 0.3),
                      }}
                      data-ocid={`blog.item.${currentPage * BLOG_PAGE_SIZE + i + 1}`}
                      className="group bg-card/45 backdrop-blur-md border border-border/60 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 rounded-3xl overflow-hidden flex flex-col justify-between h-full"
                    >
                      <Link to={`/blog/${post.slug}`} className="flex flex-col h-full justify-between">
                        <div>
                          {getSafeBlogImage(post) && (
                            <div className="aspect-[16/10] overflow-hidden relative">
                              <img
                                src={getSafeBlogImage(post)}
                                alt={`${post.title} — Gemora Global B2B jewellery`}
                                onError={handleImageError}
                                className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                                loading="lazy"
                                width={600}
                                height={375}
                              />
                            </div>
                          )}
                          <div className="p-5 md:p-6 space-y-3">
                            {post.category && (
                              <span
                                className={`inline-block text-[10px] font-semibold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                                  categoryColors[post.category] ??
                                  "bg-primary/20 text-primary border-primary/30"
                                }`}
                              >
                                {post.category}
                              </span>
                            )}
                            <h3 className="font-bold text-base md:text-lg text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                              {post.title}
                            </h3>
                            {post.excerpt && (
                              <p className="text-muted-foreground text-xs md:text-sm line-clamp-3 leading-relaxed">
                                {post.excerpt}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="p-5 md:p-6 pt-0 mt-auto border-t border-border/30 flex items-center justify-between text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {post.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readTime}
                          </span>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>
              </div>

              {/* B2B Premium Newsletter Banner */}
              {currentPage === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-card/50 p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.05),transparent)]" />
                  <div className="relative z-10 max-w-xl space-y-2">
                    <h3 className="font-display text-lg md:text-2xl font-bold text-foreground">
                      B2B Jewellery Sourcing Insights &amp; MOQ Reports
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                      Join 12,000+ international boutique buyers. Get weekly pricing updates, customs guidelines, and Jaipur wholesale catalogs directly in your inbox.
                    </p>
                  </div>
                  <div className="relative z-10 w-full md:w-auto flex flex-col sm:flex-row gap-3 min-w-[280px] sm:min-w-[400px]">
                    <input
                      type="email"
                      placeholder="Enter corporate email address"
                      className="flex-grow px-5 py-3 rounded-xl bg-card border border-border text-xs md:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary min-h-[44px]"
                    />
                    <button
                      type="button"
                      className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-semibold text-xs md:text-sm shadow-md transition-all whitespace-nowrap min-h-[44px]"
                    >
                      Subscribe Insights
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div
                  className="flex flex-col items-center gap-4 pt-10"
                  data-ocid="blog.pagination"
                >
                  <div className="flex items-center gap-2 flex-wrap justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentPage((p) => Math.max(0, p - 1));
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      disabled={activePage === 0}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border/80 text-xs md:text-sm font-medium hover:border-primary hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed min-h-[40px]"
                      data-ocid="blog.pagination_prev"
                    >
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i)
                      .filter(
                        (i) =>
                          i === 0 ||
                          i === totalPages - 1 ||
                          Math.abs(i - activePage) <= 2,
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
                            className="px-2.5 text-muted-foreground text-sm"
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
                            className={`w-10 h-10 rounded-xl border text-xs md:text-sm font-semibold transition-all ${
                              activePage === item.value
                                ? "bg-primary text-primary-foreground border-primary shadow"
                                : "border-border hover:border-primary hover:text-primary bg-card/25"
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
                      disabled={activePage >= totalPages - 1}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border/80 text-xs md:text-sm font-medium hover:border-primary hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed min-h-[40px]"
                      data-ocid="blog.pagination_next"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Showing articles {(activePage * BLOG_PAGE_SIZE) + 1}–{Math.min((activePage + 1) * BLOG_PAGE_SIZE, totalCount)} of {totalCount}
                  </p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* B2B Sourcing Contact & QR Section */}
        <section className="container px-4 py-16 border-t border-border/40">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Form Column */}
            <div className="lg:col-span-7 bg-card/35 backdrop-blur-md border border-border/60 p-8 sm:p-10 rounded-3xl space-y-6">
              <div className="space-y-2">
                <span className="text-primary text-xs font-bold uppercase tracking-wider">Direct Wholesale Desk</span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">Get In Touch</h2>
                <p className="text-sm text-muted-foreground">
                  Have specific imitation jewellery requirements, custom designs, or bulk export queries? Submit your sourcing inquiry below.
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-xs font-semibold text-muted-foreground">Your Name *</label>
                    <input
                      type="text"
                      id="name"
                      required
                      placeholder="e.g. John Doe"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all min-h-[44px]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs font-semibold text-muted-foreground">Corporate Email *</label>
                    <input
                      type="email"
                      id="email"
                      required
                      placeholder="e.g. buyer@boutique.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all min-h-[44px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="phone" className="text-xs font-semibold text-muted-foreground">Phone / WhatsApp Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      placeholder="e.g. +1 555-0199"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all min-h-[44px]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="country" className="text-xs font-semibold text-muted-foreground">Country *</label>
                    <input
                      type="text"
                      id="country"
                      required
                      placeholder="e.g. United States"
                      value={form.country}
                      onChange={(e) => setForm({ ...form, country: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all min-h-[44px]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-xs font-semibold text-muted-foreground">Sourcing Requirements / Message *</label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    placeholder="Specify jewellery types, required quantities (MOQs), target delivery date, or custom manufacturing details..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-semibold shadow-lg shadow-primary/10 transition-all min-h-[46px] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting Sourcing Inquiry...
                    </>
                  ) : (
                    "Submit Sourcing Inquiry"
                  )}
                </button>
              </form>
            </div>

            {/* QR Column */}
            <div className="lg:col-span-5 bg-card/35 backdrop-blur-md border border-border/60 p-8 sm:p-10 rounded-3xl flex flex-col items-center justify-center text-center space-y-6 lg:min-h-[480px]">
              <div className="space-y-2">
                <span className="text-primary text-xs font-bold uppercase tracking-wider">Instant WhatsApp Chat</span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground">Scan QR Code</h3>
                <p className="text-xs font-semibold text-primary tracking-widest uppercase mb-1">For Immediate Contact</p>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  Direct connection to our B2B export desk in Jaipur, India. Get instant digital catalogs, live product customisation assistance, and rapid custom quoting.
                </p>
              </div>

              {/* Glowing QR Frame */}
              <div className="relative group p-4 bg-white rounded-3xl shadow-xl border-2 border-primary/20 hover:border-primary/50 transition-all duration-500 max-w-[220px]">
                <div className="absolute inset-0 -m-1 rounded-3xl bg-gradient-to-tr from-primary/10 to-primary/30 opacity-0 group-hover:opacity-100 blur-md transition-opacity -z-10" />
                <img
                  src="/assets/images/contact-qr.png"
                  alt="Scan Gemora Global QR Code for Immediate Contact on WhatsApp"
                  className="w-full h-auto rounded-2xl"
                  width={200}
                  height={200}
                />
              </div>

              <div className="space-y-3 w-full">
                <a
                  href="https://wa.me/917976341419"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold shadow-lg shadow-green-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all min-h-[46px]"
                >
                  Chat on WhatsApp (+91 7976341419)
                </a>
                <p className="text-[10px] text-muted-foreground">
                  Available 24/7. Response within 10 minutes.
                </p>
              </div>
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
