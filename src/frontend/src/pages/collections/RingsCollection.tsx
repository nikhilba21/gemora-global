import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { BASE_URL, usePageSEO } from "../../hooks/usePageSEO";

const FAQ = [
  {
    q: "What types of fashion rings do you wholesale?",
    a: "We manufacture cocktail rings, stacking rings, adjustable rings, Kundan rings, oxidised silver rings, minimal bands, and nose rings.",
  },
  {
    q: "What is the MOQ for wholesale rings?",
    a: "MOQ starts at 50 pieces per design. Custom ring designs require 500 units minimum.",
  },
  {
    q: "Are your rings adjustable?",
    a: "Yes, many designs come in adjustable sizes to fit most fingers. We also offer fixed-size rings in standard Indian sizing (sizes 6–18).",
  },
  {
    q: "Which markets do you export rings to?",
    a: "We export to UAE, UK, USA, France, Canada, Australia, Singapore, Saudi Arabia, and 20+ countries.",
  },
];

export default function RingsCollection() {
  usePageSEO({
    title: "Wholesale Fashion Rings | Rings Manufacturer India | Gemora Global",
    description:
      "Wholesale fashion rings from India — cocktail rings, stacking rings, Kundan rings, oxidised rings, adjustable rings. MOQ 50 pcs. Anti-tarnish. Export UAE, UK, USA, France.",
    canonical: `${BASE_URL}/collections/rings`,
    breadcrumbs: [
      { name: "Home", url: BASE_URL },
      { name: "Collections", url: `${BASE_URL}/products` },
      { name: "Rings", url: `${BASE_URL}/collections/rings` },
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
              / Rings
            </nav>
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Fashion Rings — Cocktail, Stacking & Minimal
            </h1>
            <p className="text-muted-foreground max-w-2xl text-sm md:text-base">
              Wholesale fashion rings from Gemora Global — cocktail rings,
              stacking rings, Kundan rings, oxidised rings, and adjustable
              bands. MOQ 50 pcs. Anti-tarnish finish. Exported to 20+ countries.
            </p>
          </div>
        </div>

        <div className="container px-4 py-10 md:py-16">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h2 className="font-serif text-2xl font-bold mb-4">
                Wholesale Rings — Cocktail, Oxidised & Stacking Styles
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Gemora Global manufactures and exports a diverse range of{" "}
                <strong>wholesale fashion rings</strong> from Jaipur, India. Our
                ring collection ranges from bold cocktail rings and statement
                Kundan designs to minimal stacking rings and dainty daily-wear
                bands. We cater to boutiques, fashion retailers, and online
                sellers across UAE, UK, USA, France, and 20+ countries.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our <strong>cocktail rings wholesale</strong> category includes
                oversized gemstone-set rings, chunky statement rings, and
                multi-stone designs popular in fashion boutiques across Europe
                and the Middle East. These rings are crafted with American
                Diamond (CZ) stones, coloured glass gems, and pearl inlays — all
                at imitation jewellery prices with fine jewellery appeal.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>Oxidised rings wholesale India:</strong> Our oxidised
                silver-tone rings feature traditional Indian motifs and are top
                sellers in UK, USA, and Australian boutiques targeting boho and
                ethnic fashion buyers. Designs include floral oxidised rings,
                tribal bands, and multi-finger rings for festival and bohemian
                collections.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong>Stacking rings</strong> are our fastest-growing category
                — minimalist bands, dainty coin rings, and layering sets styled
                for Gen-Z and millennial buyers. We supply these in sets of 3,
                5, or 7 rings for boutique displays and Instagram-friendly
                packaging.
              </p>
            </div>
            <div className="space-y-4">
              <div className="bg-muted/30 rounded-xl p-5 border border-border">
                <h3 className="font-semibold mb-3">💍 Ring Styles Available</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  {[
                    "Cocktail Statement Rings",
                    "Kundan & CZ Rings",
                    "Oxidised Silver Rings",
                    "Stacking Ring Sets",
                    "Adjustable Midi Rings",
                    "Bridal Ring Sets",
                    "Nose Rings (Nath)",
                    "Daily Wear Minimal Bands",
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
                  <li>Sizes: Adjustable or fixed (Indian std)</li>
                  <li>Finish: Gold, Oxidised, Rhodium, Rose Gold</li>
                  <li>Lead Time: 10–15 business days</li>
                  <li>Packaging: Retail-ready ring box available</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="font-serif text-2xl font-bold mb-4">
              Fashion Rings for Global Markets
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Our{" "}
              <Link
                to="/imitation-jewellery-exporter-india"
                className="text-primary hover:underline"
              >
                imitation jewellery export
              </Link>{" "}
              experience means we understand what ring styles sell in each
              market. UAE buyers favour gold-toned statement rings with
              colourful stones. UK boutiques prefer oxidised boho styles and
              dainty minimalist stacking sets. USA buyers love cocktail rings
              and Korean-style layering designs. We can customise our offering
              per market.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              All rings undergo quality checks for finish consistency, stone
              setting security, and plating durability. We offer anti-tarnish
              bags with each piece and can provide branded packaging for private
              label clients.{" "}
              <Link to="/wholesale" className="text-primary hover:underline">
                Contact our wholesale team
              </Link>{" "}
              for pricing sheets and current season catalogue.
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
                  ["/collections/earrings", "Earrings"],
                  ["/collections/necklaces", "Necklaces"],
                  ["/collections/bracelets", "Bracelets"],
                  ["/collections/oxidised-jewelry", "Oxidised"],
                  ["/collections/minimalist-jewelry", "Minimalist"],
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
            data-ocid="rings.cta.section"
          >
            <h2 className="font-serif text-xl font-bold mb-2">
              Get Wholesale Ring Catalogue
            </h2>
            <p className="text-white/80 mb-5 text-sm">
              Request our rings catalogue with current pricing, MOQ, and
              available styles.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                asChild
                className="bg-accent text-primary font-bold hover:bg-accent/90"
                data-ocid="rings.cta.whatsapp"
              >
                <a
                  href="https://wa.me/917976341419?text=Hi%2C%20I%27m%20interested%20in%20wholesale%20rings%20from%20Gemora%20Global"
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
                data-ocid="rings.cta.products"
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
