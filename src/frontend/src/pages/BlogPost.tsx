import api from '../lib/api';
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { usePageSEO } from "../hooks/usePageSEO";
import { ALL_BLOG_POSTS, type BlogPost } from "../utils/blogStore";
import { useCanonical } from '../hooks/useCanonical';

/** Renders HTML blog content safely using a DOM ref (avoids dangerouslySetInnerHTML lint rule). */
function HtmlContent({
  html,
  className,
}: { html: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.innerHTML = html;
  }, [html]);
  return <div ref={ref} className={className} />;
}

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

export default function BlogPostPage() {
  useCanonical();
  const { slug } = useParams() as { slug: string };

  const defaultPost = ALL_BLOG_POSTS.find((p) => p.slug === slug) ?? null;

  const { data: backendPost, isLoading: backendLoading } = useQuery({
    queryKey: ["blogPost", slug],
    queryFn: async () => {
      try {
        const result = await api.getBlogPost(slug);
        return result;
      } catch {
        // 404 or any error — treat as "not found"
        return null;
      }
    },
    enabled: !!slug && !defaultPost,
    select: (data) => {
      if (data === null || data === undefined) return null;
      if (Array.isArray(data)) return data[0] ?? null;
      return data;
    },
  });

  const { data: allBackendPostsRes } = useQuery({
    queryKey: ["blogPosts"],
    queryFn: () => api.getBlogPosts({page:'0',pageSize:'500'}),
    enabled: true,
  });
  const allBackendPosts = allBackendPostsRes?.items || [];

  const post: BlogPost | null = (backendPost as BlogPost | null) ?? defaultPost;
  const isLoading = backendLoading && !defaultPost;

  const related = (() => {
    const backendSlugs = new Set(allBackendPosts.map((p) => p.slug));
    const staticOnly = ALL_BLOG_POSTS.filter((p) => !backendSlugs.has(p.slug));
    const all = [...allBackendPosts, ...staticOnly] as BlogPost[];
    return all
      .filter((p) => p.slug !== slug)
      .filter((p) => p.category === post?.category)
      .slice(0, 3);
  })();

  usePageSEO({
    title: post ? `${post.title} | Gemora Global` : "Blog | Gemora Global",
    description: post
      ? (post.excerpt || '').slice(0, 155)
      : "Read the latest insights on imitation jewellery trends, wholesale sourcing, and export tips from Gemora Global.",
    canonical: post
      ? `https://www.gemoraglobal.co/blog/${post.slug}`
      : "https://www.gemoraglobal.co/blog",
    ogTitle: post ? post.title : "Blog | Gemora Global",
    ogDescription: post ? (post.excerpt || '').slice(0, 155) : undefined,
    ogImage:
      post?.image ||
      "https://www.gemoraglobal.co/images/og-banner.jpg",
    breadcrumbs: post
      ? [
          { name: "Home", url: "https://www.gemoraglobal.co/" },
          { name: "Blog", url: "https://www.gemoraglobal.co/blog" },
          {
            name: post.title,
            url: `https://www.gemoraglobal.co/blog/${post.slug}`,
          },
        ]
      : undefined,
    schema: post
      ? {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          name: post.title,
          description: (post.excerpt || '').slice(0, 155),
          datePublished: post.date || new Date().toISOString().split("T")[0],
          dateModified: post.date || new Date().toISOString().split("T")[0],
          author: {
            "@type": "Person",
            name: post.author || "Gemora Global",
          },
          publisher: {
            "@type": "Organization",
            name: "Gemora Global",
            logo: {
              "@type": "ImageObject",
              url: "https://www.gemoraglobal.co/assets/uploads/logo-removebg-preview-1.png",
            },
          },
          image:
            post.image ||
            "https://www.gemoraglobal.co/images/og-banner.jpg",
          url: `https://www.gemoraglobal.co/blog/${post.slug}`,
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://www.gemoraglobal.co/blog/${post.slug}`,
          },
          keywords: `imitation jewellery, wholesale jewellery India, fashion jewellery exporter, ${post.category || "jewellery export"}`,
          inLanguage: "en",
        }
      : undefined,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="pt-16">
          <div className="relative h-56 sm:h-72 md:h-96 bg-muted animate-pulse" />
          <div className="container max-w-3xl px-4 py-8 md:py-12 space-y-4">
            <div className="h-8 bg-muted rounded w-2/3 animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded w-5/6 animate-pulse" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) return <Navigate to="/blog" replace />;

  const isHtmlContent = post.content?.includes("<") ?? false;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-16">
        {/* Hero Image — full width, aspect-[16/9] on mobile */}
        <div className="relative w-full aspect-[16/9] md:h-96 overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
            width={1200}
            height={500}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>

        {/* Article — max-w-3xl, single column, padded on mobile */}
        <article className="container max-w-3xl py-8 md:py-12 px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to="/blog"
              data-ocid="blogpost.link"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary text-sm mb-5 transition-colors min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>

            <span
              className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border mb-4 ${categoryColors[post.category] ?? "bg-primary/20 text-primary border-primary/30"}`}
            >
              {post.category}
            </span>

            {/* Title: text-xl on mobile, text-3xl on lg+ */}
            <h1 className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4 leading-tight">
              {post.title}
            </h1>

            {/* Author/date/readTime — flex-wrap on mobile */}
            <div className="flex flex-wrap items-center gap-3 md:gap-5 text-sm text-muted-foreground border-b border-border pb-5 mb-6 md:mb-8">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 flex-shrink-0" />
                {post.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                {post.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 flex-shrink-0" />
                {post.readTime}
              </span>
            </div>

            {/* Body text — text-base (16px) on mobile */}
            {isHtmlContent ? (
              <HtmlContent
                html={post.content}
                className="prose prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-a:text-primary prose-strong:text-foreground max-w-none leading-relaxed text-base"
              />
            ) : (
              <div className="prose prose-invert max-w-none space-y-5">
                {post.content
                  .split("\n\n")
                  .filter(Boolean)
                  .map((para, paraIndex) => (
                    <motion.p
                      key={para.slice(0, 40)}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.1 + paraIndex * 0.07,
                      }}
                      className="text-muted-foreground leading-relaxed text-base"
                    >
                      {para}
                    </motion.p>
                  ))}
              </div>
            )}
          </motion.div>
        </article>

        {/* CTA */}
        <section className="bg-primary/10 border-y border-primary/20 py-10 md:py-12 px-4">
          <div className="container text-center">
            <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-2">
              Interested in wholesale jewellery sourcing?
            </h3>
            <p className="text-muted-foreground mb-6 text-sm md:text-base">
              Our export team is ready to assist with custom designs, bulk
              pricing, and fast shipping. Browse our{" "}
              <Link to="/products" className="text-primary hover:underline">
                product catalogue
              </Link>{" "}
              or view our{" "}
              <Link to="/wholesale" className="text-primary hover:underline">
                wholesale guide
              </Link>
              .
            </p>
            <Link
              to="/contact"
              data-ocid="blogpost.primary_button"
              className="inline-flex items-center justify-center bg-primary text-primary-foreground font-semibold px-7 py-3 rounded-full hover:bg-primary/90 transition-colors min-h-[44px] w-full sm:w-auto"
            >
              Contact Us for Wholesale
            </Link>
          </div>
        </section>

        {/* Related Posts — grid-cols-1 mobile, grid-cols-2 md */}
        {related.length > 0 && (
          <section className="container px-4 py-12 md:py-16">
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-6 md:mb-8">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
              {related.map((rp, i) => (
                <motion.article
                  key={rp.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  data-ocid={`blogpost.related.item.${i + 1}`}
                  className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-colors"
                >
                  <Link to={`/blog/${rp.slug}`}>
                    <div className="relative overflow-hidden aspect-[16/9]">
                      <img
                        src={rp.image}
                        alt={rp.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        width={600}
                        height={338}
                      />
                      <span
                        className={`absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full border ${categoryColors[rp.category] ?? "bg-primary/20 text-primary border-primary/30"}`}
                      >
                        {rp.category}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-display text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {rp.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {rp.date}
                      </p>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
