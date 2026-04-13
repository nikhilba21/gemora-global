import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, Search, User } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useActor } from "../hooks/useActor";
import { usePageSEO } from "../hooks/usePageSEO";
import { DEFAULT_POSTS } from "../utils/blogStore";

const CATEGORIES = [
  "All",
  "Export Guides",
  "Market Trends",
  "Buyer Guides",
  "Country Strategy",
  "Product Guide",
  "Pricing",
  "Supplier Info",
  "Quality",
  "Packaging",
  "Online Selling",
  "Trends",
  "Business Guide",
  "Industry Insights",
  "Collections",
  "Export Tips",
  "Product Care",
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
};

export default function Blog() {
  usePageSEO({
    title: "Jewellery Export Insights & Fashion Trends — Gemora Global Blog",
    description:
      "Read Gemora Global's blog for imitation jewellery sourcing guides, export tips, trend reports, and MOQ advice for wholesale buyers in UAE, France, USA, UK and Europe.",
    canonical: "https://gemoraglobal-tje.caffeine.xyz/blog",
    ogTitle: "Jewellery Export Insights & Fashion Trends — Gemora Global Blog",
    ogImage: "https://gemoraglobal-tje.caffeine.xyz/images/og-blog.jpg",
    schema: {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "Gemora Global Jewellery Blog",
      url: "https://gemoraglobal-tje.caffeine.xyz/blog",
      inLanguage: "en",
      publisher: { "@type": "Organization", name: "Gemora Global" },
    },
  });

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const { actor } = useActor();
  const { data: backendPosts = [], isLoading } = useQuery({
    queryKey: ["blogPosts"],
    queryFn: () => actor!.getBlogPosts(["Published"]),
    enabled: !!actor,
  });

  const mergedPosts = (() => {
    const backendSlugs = new Set(backendPosts.map((p) => p.slug));
    const defaultOnly = DEFAULT_POSTS.filter((p) => !backendSlugs.has(p.slug));
    const all = [...backendPosts, ...defaultOnly];
    return all.filter(
      (p) => p.status === "Published" || p.status === "published",
    );
  })();

  const filtered = mergedPosts.filter((post) => {
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

            {/* Search — full width on mobile */}
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
                onChange={(e) => setSearchQuery(e.target.value)}
                data-ocid="blog.search"
                className="w-full pl-11 pr-4 py-3 rounded-full bg-card border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary min-h-[44px]"
              />
            </motion.div>
          </div>
        </section>

        {/* Category Filter — horizontally scrollable on mobile, no wrap */}
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
                onClick={() => setActiveCategory(cat)}
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
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="font-serif text-xl md:text-2xl font-bold">
              {activeCategory === "All" ? "All Articles" : activeCategory}
              {!isLoading && (
                <span className="ml-2 text-base font-normal text-muted-foreground">
                  ({filtered.length})
                </span>
              )}
            </h2>
          </div>

          {isLoading && backendPosts.length === 0 ? (
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
            <div className="text-center py-16 md:py-20">
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
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
              {filtered.map((post, i) => (
                <motion.article
                  key={post.slug}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.4) }}
                  data-ocid={`blog.item.${i + 1}`}
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
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
