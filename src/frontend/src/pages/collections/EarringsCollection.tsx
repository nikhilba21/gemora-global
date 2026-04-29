import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { BASE_URL, usePageSEO } from "../../hooks/usePageSEO";

const FAQ = [
  {
    q: "What earring styles do you manufacture?",
    a: "We manufacture jhumkas, chandbalis, hoops, studs, drop earrings, ear chains, ear cuffs, dangler earrings, Maang Tikka sets, and Korean-style minimalist designs.",
  },
  {
    q: "What is MOQ for wholesale earrings?",
    a: "MOQ starts at 50 pairs per design. Custom designs require 500 units minimum.",
  },
  {
    q: "What finishes are available for earrings?",
    a: "Gold plating, matte gold, rhodium, rose gold, oxidised silver, black plating, and 2-tone combinations — all with anti-tarnish coating.",
  },
  {
    q: "Do you export earrings internationally?",
    a: "Yes. We supply wholesale earrings to UAE, UK, USA, France, Canada, Australia, Singapore, Malaysia, Saudi Arabia, Nigeria, Sri Lanka, and 20+ countries.",
  },
];

export default function EarringsCollection() {
  usePageSEO({
    title:
      "Wholesale Earrings | Fashion Earrings Manufacturer India | Gemora Global",
    description:
      "Wholesale fashion earrings from India — jhumkas, chandbalis, hoops, studs, statement earrings, ear chains. MOQ 50 pairs. Anti-tarnish. Export to UAE, UK, USA, Europe.",
    canonical: `${BASE_URL}/collections/earrings`,
    breadcrumbs: [
      { name: "Home", url: BASE_URL },
      { name: "Collections", url: `${BASE_URL}/products` },
      { name: "Earrings", url: `${BASE_URL}/collections/earrings` },
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
              / Earrings
            </nav>
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Fashion Earrings — Statement & Everyday Styles
            </h1>
            <p className="text-muted-foreground max-w-2xl text-sm md:text-base">
              Discover 200+ wholesale earring designs — from traditional jhumkas
              and oxidised chandbalis to Korean minimalist hoops and daily-wear
              studs. Anti-tarnish finish, MOQ 50 pairs. Exported to 20+
              countries.
            </p>
          </div>
        </div>

        <div className="container px-4 py-10 md:py-16">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h2 className="font-serif text-2xl font-bold mb-4">
                200+ Earring Designs — Wholesale Fashion Earrings from India
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Gemora Global manufactures and exports premium wholesale fashion
                earrings from Jaipur, India. Our earring collection covers every
                style, from traditional{" "}
                <Link
                  to="/kundan-jewellery-wholesale"
                  className="text-primary hover:underline"
                >
                  Kundan chandbalis
                </Link>{" "}
                and festive jhumkas to{" "}
                <Link
                  to="/collections/korean-jewelry"
                  className="text-primary hover:underline"
                >
                  Korean-inspired minimalist hoops
                </Link>{" "}
                and statement ear chains. Whether your buyers want everyday
                wear, party pieces, or bridal earrings, our 200+ designs have
                them covered.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our wholesale earrings are crafted with anti-tarnish coating,
                ensuring lasting retail quality. We offer gold plating, rhodium,
                rose gold, oxidised silver, black plating, and matte finishes.
                Earrings come in sets with matching{" "}
                <Link
                  to="/collections/necklaces"
                  className="text-primary hover:underline"
                >
                  necklaces
                </Link>{" "}
                and Maang Tikkas for boutique-ready collections.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We supply <strong>statement earrings wholesale</strong> to
                boutiques, fashion retailers, online sellers, and distributors
                across UAE, UK, USA, France, Australia, Canada, Singapore,
                Malaysia, Saudi Arabia, Nigeria, Sri Lanka, and Kuwait. Our
                flexible MOQ of 50 pairs per design makes it easy to test new
                styles without risk.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Popular earring styles: Jhumkas, Chandbalis, Hoops, Ear Chains,
                Ear Cuffs, Drop Earrings, Studs, Dangler Earrings, Crystal
                Drops, Pearl Drops, Geometric Earrings, Oxidised Jhumkas, and
                South Indian Temple Earrings. New designs added every season
                based on current trends.
              </p>
            </div>
            <div className="space-y-4">
              <div className="bg-muted/30 rounded-xl p-5 border border-border">
                <h3 className="font-semibold mb-3">
                  💎 Earring Style Categories
                </h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  {[
                    "Traditional Jhumkas & Chandbalis",
                    "Gold-plated Hoops & Loops",
                    "Korean Minimalist Studs",
                    "Statement Ear Chains",
                    "Crystal & Gemstone Drops",
                    "Oxidised Silver Earrings",
                    "Bridal Tikka Sets",
                    "South Indian Temple Earrings",
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
                  <li>MOQ: 50 pairs per design</li>
                  <li>Finish: Gold, Oxidised, Rhodium, Rose Gold</li>
                  <li>Lead Time: 10–15 business days</li>
                  <li>Custom designs: 500 pairs min.</li>
                  <li>Packaging: Retail-ready with anti-tarnish bag</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Earring types detail */}
          <div className="mb-12">
            <h2 className="font-serif text-2xl font-bold mb-6">
              Our Wholesale Earring Collection — By Style
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  title: "Traditional & Ethnic Earrings",
                  desc: "Kundan jhumkas, chandbalis, Maang Tikka earring sets, South Indian temple earrings, and festive designs for weddings and cultural events. Ideal for South Asian boutiques in UK, USA, and Canada.",
                  icon: "🪙",
                },
                {
                  title: "Statement Earrings",
                  desc: "Bold oversized hoops, geometric danglers, crystal chandeliers, and cocktail-style drops. Perfect for party wear collections in UAE and European fashion boutiques.",
                  icon: "💎",
                },
                {
                  title: "Daily Wear & Minimalist Earrings",
                  desc: "Lightweight studs, tiny hoops, ear pins, pearl drops, and Korean-style minimalist chains. Top sellers for everyday fashion retailers and online shops targeting Gen-Z buyers.",
                  icon: "✨",
                },
              ].map((cat) => (
                <div
                  key={cat.title}
                  className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-colors"
                >
                  <div className="text-2xl mb-3">{cat.icon}</div>
                  <h3 className="font-semibold mb-2">{cat.title}</h3>
                  <p className="text-sm text-muted-foreground">{cat.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Keyword-rich copy */}
          <div className="mb-12">
            <h2 className="font-serif text-2xl font-bold mb-4">
              Imitation Earrings Exporter — Jaipur, India
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              As one of India's leading{" "}
              <Link
                to="/imitation-jewellery-exporter-india"
                className="text-primary hover:underline"
              >
                imitation jewellery exporters
              </Link>
              , Gemora Global specialises in wholesale earrings sourced directly
              from our Jaipur manufacturing facility. Our earrings use
              high-quality alloy base metals with layered plating techniques
              that replicate the look of fine gold and silver jewellery at a
              fraction of the cost.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>Wholesale earrings for UK boutiques:</strong> We supply
              jhumkas, chandbalis, and statement earrings to South Asian fashion
              boutiques across London, Birmingham, Leicester, and Manchester.
              Our designs are specifically crafted for the South Asian diaspora
              market, featuring traditional Indian aesthetics with modern
              finishing.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Fashion earrings for UAE distributors:</strong> Our
              gold-plated and crystal earrings are top sellers in Dubai, Abu
              Dhabi, and Sharjah markets. We offer DDP (Delivered Duty Paid)
              shipping for UAE buyers and can customise packaging with Arabic
              product labels on request.
            </p>
          </div>

          {/* FAQ */}
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

          {/* Related */}
          <div className="mb-10">
            <h3 className="font-semibold text-sm mb-3 text-muted-foreground uppercase tracking-wider">
              Related Collections
            </h3>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["/collections/necklaces", "Necklaces"],
                  ["/collections/bracelets", "Bracelets"],
                  ["/collections/rings", "Rings"],
                  ["/collections/party-wear-jewelry", "Party Wear"],
                  ["/collections/daily-wear-jewelry", "Daily Wear"],
                  ["/collections/oxidised-jewelry", "Oxidised"],
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

          {/* CTA */}
          <div
            className="bg-primary text-primary-foreground rounded-xl p-8 text-center"
            data-ocid="earrings.cta.section"
          >
            <h2 className="font-serif text-xl font-bold mb-2">
              Get Wholesale Earring Pricing
            </h2>
            <p className="text-white/80 mb-5 text-sm">
              WhatsApp us to receive our full earrings catalogue with current
              prices and MOQ options.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                asChild
                className="bg-accent text-primary font-bold hover:bg-accent/90"
                data-ocid="earrings.cta.whatsapp"
              >
                <a
                  href="https://wa.me/917976341419?text=Hi%2C%20I%27m%20interested%20in%20wholesale%20earrings%20from%20Gemora%20Global"
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
                data-ocid="earrings.cta.products"
              >
                <Link to="/products">Browse All Earrings</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
