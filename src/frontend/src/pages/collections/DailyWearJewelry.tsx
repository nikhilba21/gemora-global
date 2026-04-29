import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { BASE_URL, usePageSEO } from "../../hooks/usePageSEO";

const FAQ = [
  {
    q: "What qualifies as daily wear jewelry?",
    a: "Daily wear jewelry refers to lightweight, comfortable, durable pieces suitable for everyday use — including office wear, casual outings, and university. Typically minimalist or subtle in design.",
  },
  {
    q: "What makes your daily wear jewelry different?",
    a: "Our daily wear pieces use anti-tarnish coating ensuring they can be worn daily without losing shine. We focus on lightweight designs that don't cause discomfort during long wear.",
  },
  {
    q: "What is MOQ for daily wear jewelry?",
    a: "MOQ starts at 50 units per design. Mixed orders (different styles of daily wear) can be combined to meet the MOQ.",
  },
  {
    q: "Is daily wear jewelry suitable for humid climates like UAE or Singapore?",
    a: "Yes. Our anti-tarnish coating is specifically tested for performance in humid and tropical climates, making our daily wear jewelry ideal for UAE, Singapore, and Malaysia markets.",
  },
];

export default function DailyWearJewelry() {
  usePageSEO({
    title: "Daily Wear Jewelry | Lightweight Everyday Jewelry | Gemora Global",
    description:
      "Wholesale daily wear jewelry from India — lightweight earrings, minimalist necklaces, simple rings, office wear jewelry. MOQ 50 pcs. Anti-tarnish. Export UAE, UK, USA, Singapore.",
    canonical: `${BASE_URL}/collections/daily-wear-jewelry`,
    breadcrumbs: [
      { name: "Home", url: BASE_URL },
      { name: "Collections", url: `${BASE_URL}/products` },
      {
        name: "Daily Wear Jewelry",
        url: `${BASE_URL}/collections/daily-wear-jewelry`,
      },
    ],
    faqItems: FAQ,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <div className="bg-card border-b border-border py-8 md:py-12 px-4">
          <div className="container">
            <nav
              className="text-xs text-muted-foreground mb-3"
              aria-label="Breadcrumb"
            >
              <Link to="/" className="hover:text-primary">
                Home
              </Link>{" "}
              /{" "}
              <Link to="/products" className="hover:text-primary">
                Collections
              </Link>{" "}
              / Daily Wear Jewelry
            </nav>
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Daily Wear Jewelry — Lightweight & Comfortable
            </h1>
            <p className="text-muted-foreground max-w-2xl text-sm md:text-base">
              Wholesale daily wear jewelry from Gemora Global — lightweight
              earrings, minimalist necklaces, simple rings, and comfortable
              everyday pieces. Anti-tarnish. MOQ 50 units. Exported to UAE, UK,
              USA, Singapore, and 20+ countries.
            </p>
          </div>
        </div>

        <div className="container px-4 py-10 md:py-16">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h2 className="font-serif text-2xl font-bold mb-4">
                Everyday Jewelry for Women — Wholesale from India
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Gemora Global's daily wear jewelry collection is designed for
                women who want to look put-together every day without spending a
                fortune. Our <strong>everyday jewelry women</strong> range
                includes lightweight stud earrings, simple chain necklaces,
                dainty pendant sets, thin bangle sets, and minimal rings — all
                crafted for all-day comfort and durability.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>Office wear jewelry</strong> is a key part of our daily
                collection — understated, professional pieces that complement
                work attire. Think thin gold chains with a delicate pendant,
                small hoop earrings, simple pearl studs, and thin bangle sets.
                These are top sellers in UK, Australia, and Singapore markets
                where working women want fashion-forward but
                workplace-appropriate jewelry.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                All our daily wear pieces feature anti-tarnish coating
                specifically optimised for frequent wear. Unlike decorative or
                party jewelry, daily wear pieces are designed to withstand
                sweat, humidity, and regular handling without discoloration or
                stone loss. We test our daily wear collection rigorously before
                dispatch.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our daily wear collection is ideal for online retailers,
                Instagram boutiques, and subscription jewelry boxes that sell to
                everyday fashion-conscious women. The accessible price point and
                high quality make these pieces perfect for gifting markets too.
              </p>
            </div>
            <div className="space-y-4">
              <div className="bg-muted/30 rounded-xl p-5 border border-border">
                <h3 className="font-semibold mb-3">☀️ Daily Wear Styles</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  {[
                    "Lightweight Stud Earrings",
                    "Simple Chain Necklaces",
                    "Dainty Pendant Sets",
                    "Thin Bangle Sets",
                    "Minimal Stacking Rings",
                    "Small Hoop Earrings",
                    "Pearl & Stone Drops",
                    "Office-Wear Sets",
                  ].map((s) => (
                    <li key={s} className="flex items-center gap-2">
                      <span className="text-primary">✓</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-primary/5 rounded-xl p-5 border border-primary/20">
                <h3 className="font-semibold mb-3">📦 Wholesale Details</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>MOQ: 50 pcs per design</li>
                  <li>Weight: Lightweight (under 15g per piece)</li>
                  <li>Finish: Gold, Rhodium, Rose Gold</li>
                  <li>Anti-tarnish: Yes, tested for daily use</li>
                  <li>Lead Time: 10–15 business days</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="font-serif text-2xl font-bold mb-4">
              Why Daily Wear Jewelry Is Your Best-Selling Category
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              In the fashion jewellery market, daily wear pieces have the
              highest repeat-purchase rate. Customers who love a pair of simple
              gold studs will return for more styles, building brand loyalty for
              boutiques. Unlike statement pieces bought for occasions, daily
              wear jewelry is purchased year-round — making it your most
              reliable inventory category.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <Link
                to="/collections/minimalist-jewelry"
                className="text-primary hover:underline"
              >
                Minimalist jewelry
              </Link>{" "}
              and daily wear overlap significantly — both are characterised by
              simplicity, comfort, and versatility. Our collection bridges both
              categories, offering pieces that work from morning coffee to
              evening walks. Combine daily wear and minimalist collections for a
              complete everyday lifestyle section in your store.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We recommend stocking a mix of studs, simple chains, and minimal
              rings as your core daily wear inventory. WhatsApp us your target
              customer profile and we'll suggest the most suitable designs from
              our current collection.
            </p>
          </div>

          <div className="mb-12 faq-section">
            <h2 className="font-serif text-2xl font-bold mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {FAQ.map((faq) => (
                <div
                  key={faq.q}
                  className="bg-card border border-border rounded-xl p-5"
                >
                  <h3 className="font-semibold text-sm mb-2">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-10">
            <h3 className="font-semibold text-sm mb-3 text-muted-foreground uppercase tracking-wider">
              Related Collections
            </h3>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["/collections/minimalist-jewelry", "Minimalist"],
                  ["/collections/earrings", "Earrings"],
                  ["/collections/necklaces", "Necklaces"],
                  ["/collections/rings", "Rings"],
                  ["/collections/korean-jewelry", "Korean Style"],
                  ["/collections/trendy-jewelry", "Trendy"],
                ] as [string, string][]
              ).map(([to, label]) => (
                <Link
                  key={to}
                  to={to}
                  className="bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 text-xs font-medium hover:bg-primary/20 transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div
            className="bg-primary text-primary-foreground rounded-xl p-8 text-center"
            data-ocid="dailywear.cta.section"
          >
            <h2 className="font-serif text-xl font-bold mb-2">
              Get Daily Wear Jewelry Catalogue
            </h2>
            <p className="text-white/80 mb-5 text-sm">
              Request our everyday jewelry catalogue with wholesale pricing and
              MOQ details.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                asChild
                className="bg-accent text-primary font-bold hover:bg-accent/90"
                data-ocid="dailywear.cta.whatsapp"
              >
                <a
                  href="https://wa.me/917976341419?text=Hi%2C%20I%27m%20interested%20in%20daily%20wear%20jewelry%20wholesale%20from%20Gemora%20Global"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp Inquiry
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                data-ocid="dailywear.cta.products"
              >
                <Link to="/products">Browse All Products</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
