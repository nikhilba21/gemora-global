import api from '../lib/api';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { usePageSEO } from "../hooks/usePageSEO";
import type { BreadcrumbItem, FAQItem, HowToStep } from "../hooks/usePageSEO";
import type { Testimonial } from "../types";
import Footer from "./Footer";
import Navbar from "./Navbar";

export type { BreadcrumbItem, FAQItem, HowToStep };

export interface HreflangEntry {
  lang: string;
  url: string;
}

export interface SeoLandingPageProps {
  title: string;
  metaDescription: string;
  canonical: string;
  h1: string;
  targetKeyword: string;
  heroSubtitle: string;
  bodyContent: React.ReactNode;
  faqs?: FAQItem[];
  schema?: object;
  hreflangs?: HreflangEntry[];
  breadcrumbs?: BreadcrumbItem[];
  howToSteps?: { name: string; description: string; steps: HowToStep[] };
  speakable?: boolean;
}

const CATEGORIES = [
  {
    name: "Necklace Sets",
    desc: "Chokers, haars, layered chains wholesale",
    icon: "💎",
  },
  {
    name: "Earrings",
    desc: "Jhumkas, chandbalis, studs, hoops bulk",
    icon: "✨",
  },
  {
    name: "Bridal Sets",
    desc: "Complete bridal jewellery sets export",
    icon: "👑",
  },
  {
    name: "Bangles & Bracelets",
    desc: "Traditional & modern bangles wholesale",
    icon: "🌟",
  },
  { name: "Rings", desc: "Statement & minimal rings bulk supply", icon: "💍" },
  {
    name: "Minimal Fashion",
    desc: "Contemporary everyday jewellery export",
    icon: "⚡",
  },
];

const TRUST_POINTS = [
  {
    title: "10+ Years Export Experience",
    desc: "Thousands of export shipments to 30+ countries since 2013. We handle all customs, documentation, and freight on your behalf.",
  },
  {
    title: "Anti-Tarnish Finish Guarantee",
    desc: "Multi-layer anti-tarnish coating on every piece — dramatically extends wearable life and reduces customer returns for your boutique.",
  },
  {
    title: "Factory-Direct Pricing",
    desc: "No middlemen, no agents. You buy directly from our manufacturing facility in Jaipur, India — 15–30% cost advantage over agent-sourced alternatives.",
  },
  {
    title: "Low MOQ — Start from 50 Units",
    desc: "MOQ-friendly wholesale model designed for boutiques and small distributors as well as large wholesalers. Scale at your own pace.",
  },
];

const EXPORT_COUNTRIES = [
  { flag: "🇦🇪", name: "UAE", to: "/jewellery-exporter-uae" },
  { flag: "🇺🇸", name: "USA", to: "/imitation-jewellery-supplier-usa" },
  { flag: "🇬🇧", name: "UK", to: "/wholesale-jewellery-uk" },
  { flag: "🇫🇷", name: "France", to: "/export-markets" },
  { flag: "🇩🇪", name: "Germany", to: "/jewellery-exporter-europe" },
  { flag: "🇨🇦", name: "Canada", to: "/jewellery-exporter-canada" },
  { flag: "🇦🇺", name: "Australia", to: "/jewellery-exporter-australia" },
  { flag: "🇸🇬", name: "Singapore", to: "/jewellery-exporter-singapore" },
];

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: 1n,
    name: "Fatima Al-Hassan",
    company: "Al Noor Boutique",
    country: "UAE",
    rating: 5n,
    text: "Gemora Global delivers excellent quality imitation jewellery consistently. MOQ flexibility and on-time delivery to UAE make them our preferred Jaipur supplier.",
    active: true,
  },
  {
    id: 2n,
    name: "Sarah Thompson",
    company: "Jewel & Co.",
    country: "UK",
    rating: 5n,
    text: "We have been sourcing from Gemora for 3 years. Anti-tarnish finishing is superb, and their catalogue has 500+ designs to choose from.",
    active: true,
  },
  {
    id: 3n,
    name: "Arun Mehta",
    company: "Mehta Wholesale",
    country: "India",
    rating: 5n,
    text: "Best wholesale imitation jewellery supplier in Jaipur. Competitive pricing, bulk discounts from 50 units, and fast delivery across India.",
    active: true,
  },
];

export default function SeoLandingPage({
  title,
  metaDescription,
  canonical,
  h1,
  targetKeyword,
  heroSubtitle,
  bodyContent,
  faqs = [],
  schema,
  hreflangs,
  breadcrumbs = [
    { name: "Home", url: "https://www.gemoraglobal.co/" },
    { name: h1, url: canonical },
  ],
  howToSteps,
  speakable = true,
}: SeoLandingPageProps) {
  const defaultBreadcrumbs: BreadcrumbItem[] = [
    { name: "Home", url: "https://www.gemoraglobal.co/" },
    { name: h1, url: canonical },
  ];

  // Filter out any FAQPage or BreadcrumbList from the passed schema to prevent duplication
  // since they are handled specifically by faqItems and breadcrumbs props.
  const filteredSchema = Array.isArray(schema) 
    ? schema.filter((item: any) => item['@type'] !== 'FAQPage' && item['@type'] !== 'BreadcrumbList')
    : (schema as any)?.['@type'] === 'FAQPage' || (schema as any)?.['@type'] === 'BreadcrumbList' 
      ? undefined 
      : schema;

  usePageSEO({
    title,
    description: metaDescription,
    canonical,
    ogTitle: title,
    ogDescription: metaDescription,
    ogImage:
      "https://www.gemoraglobal.co/assets/uploads/logo-removebg-preview-1.png",
    hreflangs,
    schema: filteredSchema ?? {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description: metaDescription,
      url: canonical,
      publisher: {
        "@type": "Organization",
        name: "Gemora Global",
        url: "https://www.gemoraglobal.co",
      },
    },
    faqItems: faqs,
    breadcrumbs: breadcrumbs ?? defaultBreadcrumbs,
    howToSteps,
    speakable,
  });


  const { data: testimonialsData } = useQuery<Testimonial[]>({
    queryKey: ["testimonials"],
    queryFn: () => api.getTestimonials(),
    enabled: true,
  });

  const displayTestimonials =
    testimonialsData && testimonialsData.filter((t) => t.active).length > 0
      ? testimonialsData.filter((t) => t.active).slice(0, 3)
      : FALLBACK_TESTIMONIALS;

  const [form, setForm] = useState({
    name: "",
    email: "",
    country: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      form.country ? `Country: ${form.country}` : null,
      `Message: ${form.message}`,
    ]
      .filter(Boolean)
      .join("\n");
    window.open(
      `https://wa.me/917976341419?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <main id="main-content">

      {/* Hero */}
      <section className="pt-24 sm:pt-28 pb-10 sm:pb-16 px-4 bg-gradient-to-b from-blue-50 to-background border-b border-blue-700/20">
        <div className="container max-w-4xl mx-auto text-center">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-4 flex flex-wrap items-center justify-center gap-1 text-xs text-muted-foreground"
          >
            <Link
              to="/"
              className="hover:text-primary transition-colors whitespace-nowrap"
            >
              Home
            </Link>
            <span aria-hidden="true" className="mx-1">
              /
            </span>
            <span className="text-foreground font-medium break-all max-w-[240px] sm:max-w-xs text-center">
              {h1}
            </span>
          </nav>
          <p className="text-xs uppercase tracking-widest text-sky-500 mb-3 sm:mb-4 font-semibold">
            Gemora Global — India&apos;s Trusted Jewellery Exporter
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-serif font-bold text-primary leading-tight mb-4 sm:mb-6 px-2">
            {h1}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8 px-2">
            <strong>{heroSubtitle.split(".")[0]}.</strong>{" "}
            {heroSubtitle.split(".").slice(1).join(".").trim()}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center px-4 sm:px-0">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto bg-blue-800 hover:bg-blue-700 text-white font-bold"
              data-ocid="seo.primary_button"
            >
              <a
                href={`https://wa.me/917976341419?text=Hi, I am interested in ${encodeURIComponent(targetKeyword)}. Please share your catalogue and pricing.`}
                target="_blank"
                rel="noopener noreferrer"
              >
                💬 Get Catalogue on WhatsApp
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-blue-700/50 hover:border-blue-500"
              data-ocid="seo.secondary_button"
            >
              <Link to="/contact">Send Inquiry</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Facts bar */}
      <section className="bg-primary/5 border-b border-primary/15 py-4 sm:py-5 px-4">
        <div className="container max-w-5xl mx-auto">
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3 text-center">
            {[
              { icon: "📦", label: "Min. Order", value: "50 pcs" },
              { icon: "⏱️", label: "Lead Time", value: "10–15 days" },
              { icon: "🌍", label: "Countries", value: "30+" },
              { icon: "💎", label: "Designs", value: "500+" },
              { icon: "🏆", label: "Experience", value: "10+ yrs" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-1 col-span-1 last:col-span-3 sm:last:col-span-1"
              >
                <span className="text-lg sm:text-xl" aria-hidden="true">
                  {stat.icon}
                </span>
                <span className="font-bold text-primary text-xs sm:text-sm">
                  {stat.value}
                </span>
                <span className="text-xs text-muted-foreground leading-tight">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Body Content */}
      <section className="py-10 sm:py-14 px-4">
        <div className="container max-w-4xl mx-auto article-body">
          <div className="text-muted-foreground leading-relaxed space-y-4 text-sm sm:text-base">
            {bodyContent}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-10 sm:py-14 px-4 bg-card border-y border-border">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-primary text-center mb-8 sm:mb-10">
            Benefits of Choosing Gemora Global
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {TRUST_POINTS.map((p) => (
              <div
                key={p.title}
                className="p-4 sm:p-6 rounded-xl border border-blue-700/20 bg-background/50"
              >
                <h3 className="font-semibold text-primary mb-2 text-sm sm:text-base">
                  {p.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-10 sm:py-14 px-4">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-primary text-center mb-3 sm:mb-4">
            Our Product Categories
          </h2>
          <p className="text-center text-muted-foreground mb-8 sm:mb-10 text-sm px-2">
            500+ designs across all categories — refreshed every season.{" "}
            <Link to="/products" className="text-sky-500 hover:underline">
              View all products →
            </Link>
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to="/products"
                title={`Buy ${cat.name} Wholesale from India`}
                className="p-4 sm:p-5 rounded-xl border border-blue-700/20 bg-card hover:border-blue-500/50 transition-colors group min-h-[80px] sm:min-h-[auto] flex flex-col"
                data-ocid="seo.link"
              >
                <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">
                  {cat.icon}
                </div>
                <h3 className="font-semibold text-foreground group-hover:text-primary text-xs sm:text-sm mb-1 leading-tight">
                  {cat.name}
                </h3>
                <p className="text-xs text-muted-foreground leading-tight hidden sm:block">
                  {cat.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us stats */}
      <section className="py-10 sm:py-14 px-4 bg-card border-y border-border">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-primary text-center mb-8 sm:mb-10">
            Why Choose Gemora Global as Your Jewellery Supplier
          </h2>
          <div className="grid grid-cols-3 gap-4 sm:gap-6 text-center">
            {[
              { value: "500+", label: "Active Designs" },
              { value: "30+", label: "Export Countries" },
              { value: "10+", label: "Years Experience" },
            ].map((s) => (
              <div key={s.label} className="space-y-1 sm:space-y-2">
                <div className="text-2xl sm:text-4xl font-bold text-sky-500">
                  {s.value}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground leading-tight">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 sm:mt-10 text-center">
            <p className="text-muted-foreground max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed">
              Gemora Global is a factory-direct imitation jewellery manufacturer
              and exporter based in Jaipur, India. We supply wholesale jewellery
              to boutiques, distributors, and resellers across UAE, USA, UK,
              France, Canada, Australia, and Singapore. With 10+ years of export
              experience, anti-tarnish finishing, and 500+ seasonal designs, we
              are the preferred supplier for international wholesale buyers.{" "}
              <Link
                to="/why-choose-us"
                className="text-sky-500 hover:underline"
              >
                Learn more →
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Export Countries */}
      <section className="py-10 sm:py-14 px-4">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-primary text-center mb-3 sm:mb-4 capitalize">
            {targetKeyword.replace(/-/g, " ")} Export Hub
          </h2>
          <p className="text-center text-muted-foreground mb-8 sm:mb-10 text-xs sm:text-sm">
            Reliable global shipping with full export documentation.{" "}
            <Link to="/global-markets" className="text-sky-500 hover:underline">
              View all markets →
            </Link>
          </p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            {EXPORT_COUNTRIES.map((c) => (
              <Link
                key={c.name}
                to={c.to}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-blue-700/30 bg-card text-xs sm:text-sm font-medium hover:border-blue-500 hover:bg-blue-50/50 transition-colors"
                data-ocid="seo.country_link"
              >
                <span className="text-base sm:text-xl">{c.flag}</span>
                <span>{c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Get Catalog CTA */}
      <section className="py-10 sm:py-14 px-4 bg-gradient-to-r from-blue-900/20 to-blue-700/10 border-y border-blue-700/20">
        <div className="container max-w-3xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-primary mb-3 sm:mb-4 capitalize">
            {targetKeyword.replace(/-/g, " ")} Wholesale Collections
          </h2>
          <p className="text-muted-foreground mb-6 sm:mb-8 text-sm px-2">
            Request our latest 500+ design catalogue with wholesale pricing, MOQ
            details, and seasonal lookbook — delivered via WhatsApp within a few
            hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center px-4 sm:px-0">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto bg-blue-800 hover:bg-blue-700 text-white font-bold"
              data-ocid="seo.open_modal_button"
            >
              <a
                href="https://wa.me/917976341419?text=Please%20share%20your%20wholesale%20jewellery%20catalogue%20and%20pricing."
                target="_blank"
                rel="noopener noreferrer"
              >
                📚 Get Catalog via WhatsApp
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-blue-700/50"
              data-ocid="seo.secondary_button"
            >
              <Link to="/gallery">View Gallery</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-10 sm:py-14 px-4 bg-muted/30 border-y border-border">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-primary text-center mb-3 sm:mb-4 capitalize">
            {targetKeyword.replace(/-/g, " ")} Client Success Stories
          </h2>
          <p className="text-center text-muted-foreground mb-8 sm:mb-10 text-xs sm:text-sm">
            Trusted by boutiques, distributors, and wholesale buyers worldwide.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {displayTestimonials.map((t) => (
              <Card
                key={String(t.id)}
                className="bg-card border-border hover:border-primary/40 transition-all duration-200 hover:shadow-md"
                data-ocid={`seo.testimonial.${String(t.id)}`}
              >
                <CardContent className="p-5 sm:p-6">
                  <div
                    className="flex gap-1 mb-3"
                    role="img"
                    aria-label={`${Number(t.rating)} out of 5 stars`}
                  >
                    {Array.from({ length: Number(t.rating) }, (_, n) => n).map(
                      (n) => (
                        <span
                          key={`${String(t.id)}-star-${n}`}
                          className="text-primary text-sm"
                          aria-hidden="true"
                        >
                          ★
                        </span>
                      ),
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground italic mb-4 leading-relaxed">
                    "{t.text}"
                  </p>
                  <div>
                    <p className="font-semibold text-sm text-foreground">
                      {t.name}
                    </p>
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

      {/* Inquiry Form */}
      <section className="py-10 sm:py-14 px-4">
        <div className="container max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-primary text-center mb-3 sm:mb-4">
            Start Your Wholesale Partnership
          </h2>
          <p className="text-center text-muted-foreground mb-8 sm:mb-10 text-xs sm:text-sm">
            We respond to all wholesale enquiries within one business day.
          </p>
          {submitted ? (
            <div
              className="text-center py-10 sm:py-12 border border-blue-700/30 rounded-xl bg-card"
              data-ocid="seo.success_state"
            >
              <div className="text-4xl sm:text-5xl mb-4">✅</div>
              <h3 className="text-lg sm:text-xl font-semibold text-primary mb-2">
                Inquiry Received!
              </h3>
              <p className="text-muted-foreground text-sm">
                We&apos;ll get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-4 sm:space-y-5 border border-blue-700/20 rounded-xl p-4 sm:p-8 bg-card"
              data-ocid="seo.dialog"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="seo-name" className="text-sm">
                    Your Name *
                  </Label>
                  <Input
                    id="seo-name"
                    required
                    placeholder="Jane Smith"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    data-ocid="seo.input"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seo-email" className="text-sm">
                    Email Address *
                  </Label>
                  <Input
                    id="seo-email"
                    type="email"
                    required
                    placeholder="jane@boutique.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    data-ocid="seo.input"
                    className="w-full"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="seo-country" className="text-sm">
                  Country / Market
                </Label>
                <Input
                  id="seo-country"
                  placeholder="e.g. United Kingdom, UAE, USA"
                  value={form.country}
                  onChange={(e) =>
                    setForm({ ...form, country: e.target.value })
                  }
                  data-ocid="seo.input"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seo-message" className="text-sm">
                  Your Message *
                </Label>
                <Textarea
                  id="seo-message"
                  required
                  rows={4}
                  placeholder="Tell us about your requirements — product categories, quantities, destination..."
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  data-ocid="seo.textarea"
                  className="w-full"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-800 hover:bg-blue-700 text-white font-bold min-h-[48px]"
                data-ocid="seo.submit_button"
              >
                Send Inquiry
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* FAQ — with Schema.org markup */}
      {faqs.length > 0 && (
      <section
        className="py-10 sm:py-14 px-4 bg-card border-t border-border faq-section"
      >
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-primary text-center mb-8 sm:mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group border border-blue-700/20 rounded-xl bg-background overflow-hidden"
              >
                <summary className="flex items-start justify-between px-4 sm:px-6 py-4 cursor-pointer font-semibold text-foreground hover:text-primary transition-colors min-h-[48px] gap-3">
                  <span className="text-sm sm:text-base leading-snug">
                    {faq.q}
                  </span>
                  <span className="text-sky-500 ml-2 shrink-0 mt-0.5 group-open:rotate-45 transition-transform text-lg leading-none">
                    +
                  </span>
                </summary>
                <div>
                  <p className="px-4 sm:px-6 pb-4 sm:pb-5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Internal Links */}
      <section className="py-8 sm:py-10 px-4 border-t border-border">
        <div className="container max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-x-2 gap-y-2 text-xs sm:text-sm text-muted-foreground text-center">
            <span>Explore:</span>
            {[
              { to: "/products", label: "Imitation Jewellery Products" },
              { to: "/wholesale", label: "Wholesale Bulk Export Pricing" },
              { to: "/why-choose-us", label: "Why Choose Gemora Global" },
              { to: "/global-markets", label: "Global Export Markets" },
              {
                to: "/kundan-jewellery-wholesale",
                label: "Kundan Jewellery Wholesale",
              },
              {
                to: "/bridal-imitation-jewellery",
                label: "Bridal Jewellery Wholesale",
              },
              { to: "/contact", label: "Send Wholesale Inquiry" },
            ].map((link, i, arr) => (
              <span key={link.to} className="inline-flex items-center gap-1">
                <Link
                  to={link.to}
                  className="text-sky-500 hover:underline whitespace-nowrap"
                >
                  {link.label}
                </Link>
                {i < arr.length - 1 && (
                  <span className="text-muted-foreground/50">·</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
}
