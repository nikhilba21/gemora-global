import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { BASE_URL, usePageSEO } from "../../hooks/usePageSEO";

const FAQ = [
  {
    q: "What is minimalist jewelry?",
    a: "Minimalist jewelry features clean lines, simple designs, and understated elegance — dainty chains, geometric shapes, thin bands, and subtle pendants designed for layering and everyday wear.",
  },
  {
    q: "What are your top minimalist jewelry styles?",
    a: "Thin chain necklaces, bar pendants, geometric stud earrings, delicate rings, coin charms, and layering sets are our top-selling minimalist pieces.",
  },
  {
    q: "What is MOQ for minimalist jewelry wholesale?",
    a: "MOQ starts at 50 units per design. Mixed minimalist orders can be combined to reach MOQ.",
  },
  {
    q: "Is minimalist jewelry popular in Western markets?",
    a: "Yes. Minimalist jewelry is one of the biggest trends in USA, UK, Australia, and European fashion markets — especially in the Gen-Z and millennial segment.",
  },
];

export default function MinimalistJewelry() {
  usePageSEO({
    title:
      "Minimalist Jewelry Online | Minimal Fashion Jewelry | Gemora Global",
    description:
      "Wholesale minimalist jewelry from India — dainty chains, geometric earrings, thin rings, bar pendants, layering sets. Clean & modern aesthetic. MOQ 50 pcs. Export USA, UK, UAE.",
    canonical: `${BASE_URL}/collections/minimalist-jewelry`,
    breadcrumbs: [
      { name: "Home", url: BASE_URL },
      { name: "Collections", url: `${BASE_URL}/products` },
      {
        name: "Minimalist Jewelry",
        url: `${BASE_URL}/collections/minimalist-jewelry`,
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
              / Minimalist Jewelry
            </nav>
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Minimalist Jewelry — Clean & Modern Aesthetic
            </h1>
            <p className="text-muted-foreground max-w-2xl text-sm md:text-base">
              Wholesale minimalist jewelry from Gemora Global — dainty chains,
              geometric earrings, thin stacking rings, bar pendants, and
              layering sets. Clean, modern aesthetic. MOQ 50 units. Exported to
              USA, UK, UAE, and 20+ countries.
            </p>
          </div>
        </div>

        <div className="container px-4 py-10 md:py-16">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h2 className="font-serif text-2xl font-bold mb-4">
                Dainty & Aesthetic Jewelry — Wholesale Minimalist Collection
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Minimalist jewelry is the defining aesthetic of modern fashion —
                and Gemora Global's <strong>minimal gold jewelry</strong>{" "}
                collection is crafted for boutiques and online retailers who
                cater to style-conscious, trend-aware buyers. Our collection
                includes delicate chain necklaces, geometric stud earrings, thin
                band rings, bar pendants, and layering sets in clean gold and
                silver tones.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>Dainty jewelry wholesale India</strong> is one of our
                fastest-growing export categories — driven by demand from USA,
                UK, Australian, and European online retailers and boutiques
                targeting Gen-Z and millennial buyers. The "less is more"
                aesthetic has become mainstream, and our minimalist pieces tick
                every box: simple design, comfortable wear, Instagram-worthy
                style, and affordable wholesale pricing.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our <strong>aesthetic jewelry</strong> range is particularly
                popular on Etsy, Instagram, and TikTok shop platforms. Thin
                layered chains, delicate coin pendants, tiny geometric hoops,
                and subtle stacking rings photograph beautifully and generate
                strong social media engagement — helping your customers build
                their own brand followings.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                All minimalist pieces are crafted with high-quality rhodium and
                gold plating for a premium look. Anti-tarnish treatment ensures
                longevity. Lightweight construction (under 10g per piece) makes
                them comfortable for all-day wear — a key selling point for your
                customers.
              </p>
            </div>
            <div className="space-y-4">
              <div className="bg-muted/30 rounded-xl p-5 border border-border">
                <h3 className="font-semibold mb-3">
                  ✨ Minimalist Styles Available
                </h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  {[
                    "Thin Chain Necklaces",
                    "Bar & Satellite Pendants",
                    "Geometric Stud Earrings",
                    "Dainty Hoop Earrings",
                    "Thin Band Stacking Rings",
                    "Coin Charm Necklaces",
                    "Layering Jewelry Sets",
                    "Minimalist Bracelets",
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
                  <li>Weight: Ultra-light (under 10g)</li>
                  <li>Finish: Gold, Rhodium, Rose Gold</li>
                  <li>Style: Korean-inspired minimal</li>
                  <li>Lead Time: 10–15 business days</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="font-serif text-2xl font-bold mb-4">
              Why Minimalist Jewelry Is a Safe Wholesale Bet
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Unlike statement jewelry that goes in and out of fashion,
              minimalist jewelry has proven to be a perennial bestseller. The
              clean aesthetic transcends seasons and trends — a thin gold chain
              is always in style. For boutique owners and online retailers,
              stocking a core range of minimalist pieces provides steady
              year-round revenue.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Our minimalist collection pairs naturally with our{" "}
              <Link
                to="/collections/daily-wear-jewelry"
                className="text-primary hover:underline"
              >
                daily wear jewelry
              </Link>{" "}
              and{" "}
              <Link
                to="/collections/korean-jewelry"
                className="text-primary hover:underline"
              >
                Korean jewelry
              </Link>{" "}
              ranges. Many buyers order across all three categories to build a
              cohesive "everyday aesthetic" section in their shops.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We recommend ordering our minimalist collection in assorted styles
              — earrings, necklaces, and rings — to create complete gifting sets
              and display ready collections. WhatsApp us for current pricing
              tiers and assorted style options.
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
                  ["/collections/korean-jewelry", "Korean Style"],
                  ["/collections/daily-wear-jewelry", "Daily Wear"],
                  ["/collections/earrings", "Earrings"],
                  ["/collections/necklaces", "Necklaces"],
                  ["/collections/rings", "Rings"],
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
            data-ocid="minimalist.cta.section"
          >
            <h2 className="font-serif text-xl font-bold mb-2">
              Get Minimalist Jewelry Wholesale Pricing
            </h2>
            <p className="text-white/80 mb-5 text-sm">
              WhatsApp for our minimalist catalog with wholesale pricing and
              layering set options.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                asChild
                className="bg-accent text-primary font-bold hover:bg-accent/90"
                data-ocid="minimalist.cta.whatsapp"
              >
                <a
                  href="https://wa.me/917976341419?text=Hi%2C%20I%27m%20interested%20in%20minimalist%20jewelry%20wholesale%20from%20Gemora%20Global"
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
                data-ocid="minimalist.cta.products"
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
