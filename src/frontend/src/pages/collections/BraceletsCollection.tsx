import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { BASE_URL, usePageSEO } from "../../hooks/usePageSEO";

const FAQ = [
  {
    q: "What bracelet and bangle styles do you wholesale?",
    a: "Gold-plated bangles, oxidised bangles, Kundan bangles, bangle sets (2–24 pcs), chain bracelets, charm bracelets, Kada, Baju Band, Hath Pan, and bridal bangle sets.",
  },
  {
    q: "What is the MOQ for wholesale bangles?",
    a: "MOQ starts at 50 pieces per design. Bangle sets are counted per set.",
  },
  {
    q: "Are bangles sold in sets?",
    a: "Yes. Bangles are available as individual pieces or in sets of 2, 4, 6, 12, or 24. We can customise set size per buyer requirements.",
  },
  {
    q: "Do you export bangles to UAE and Malaysia?",
    a: "Yes. UAE and Malaysia are among our top bangle markets. We also export to UK, USA, Singapore, Saudi Arabia, Nigeria, and Sri Lanka.",
  },
];

export default function BraceletsCollection() {
  usePageSEO({
    title:
      "Wholesale Bracelets & Bangles | Fashion Bracelet Supplier India | Gemora Global",
    description:
      "Wholesale bracelets and bangles from India — gold-plated bangles, oxidised bangles, Kundan bangle sets, chain bracelets. MOQ 50 pcs. Anti-tarnish. Export to UAE, UK, USA.",
    canonical: `${BASE_URL}/collections/bracelets`,
    breadcrumbs: [
      { name: "Home", url: BASE_URL },
      { name: "Collections", url: `${BASE_URL}/products` },
      { name: "Bracelets", url: `${BASE_URL}/collections/bracelets` },
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
              / Bracelets
            </nav>
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Fashion Bracelets & Bangles — Wholesale from India
            </h1>
            <p className="text-muted-foreground max-w-2xl text-sm md:text-base">
              Wholesale bracelets and bangles from Gemora Global — gold-plated
              bangle sets, oxidised bangles, Kundan designs, chain bracelets,
              and Kada. MOQ 50 pieces. Exported to 20+ countries.
            </p>
          </div>
        </div>

        <div className="container px-4 py-10 md:py-16">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h2 className="font-serif text-2xl font-bold mb-4">
                Wholesale Bangles & Bracelets — Gold Plated, Oxidised, Kundan
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Gemora Global is one of India's leading manufacturers and
                exporters of wholesale bangles and bracelets. Our collection
                includes traditional gold-plated bangle sets, oxidised
                silver-tone bangles, Kundan-studded bridal bangles, modern chain
                bracelets, charm bracelets, and ethnic Kada and Hath Pan sets —
                all manufactured at our Jaipur facility.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>Gold plated bracelets wholesale India</strong> is one of
                our highest-demand categories, especially for UAE, Singapore,
                and Malaysia markets where gold-tone jewellery is culturally
                significant. Our gold plating uses a multi-layer process with
                anti-tarnish coating, ensuring your customers enjoy lasting
                shine even in humid tropical markets.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our <strong>oxidised bangles wholesale</strong> collection is a
                bestseller in UK, USA, and Australian boho and ethnic fashion
                boutiques. Featuring traditional Indian motifs, tribal patterns,
                and antique silver finishes, these bangles appeal to South Asian
                diaspora buyers and Western fashion consumers who love the
                vintage aesthetic.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Bangle sets are available in sizes 2.4 to 2.8 (standard Indian
                sizes) and in sets of 2, 4, 6, 12, or 24. We can supply matching
                bangle and necklace sets for complete jewellery collection
                sourcing. Bridal bangle sets with Kundan or meenakari work
                available for boutiques serving the South Asian wedding market.
              </p>
            </div>
            <div className="space-y-4">
              <div className="bg-muted/30 rounded-xl p-5 border border-border">
                <h3 className="font-semibold mb-3">
                  ⭕ Bangle & Bracelet Styles
                </h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  {[
                    "Gold-Plated Bangle Sets",
                    "Oxidised Silver Bangles",
                    "Kundan Studded Bangles",
                    "Chain & Charm Bracelets",
                    "Kada (Traditional Cuffs)",
                    "Baju Band (Upper Arm)",
                    "Hath Pan (Hand Harness)",
                    "Bridal Bangle Sets",
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
                  <li>Sizes: 2.4, 2.6, 2.8 (standard Indian)</li>
                  <li>Sets: 2, 4, 6, 12, 24 pcs per set</li>
                  <li>Finish: Gold, Oxidised, Rhodium, Rose Gold</li>
                  <li>Lead Time: 10–15 business days</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="font-serif text-2xl font-bold mb-4">
              Why Our Wholesale Bangles Are Top Sellers Globally
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Bangles and bracelets hold significant cultural importance across
              South Asian, Middle Eastern, and African markets. Gemora Global's
              wholesale bangle collection bridges traditional craftsmanship and
              modern aesthetics, making our designs sell across diverse
              demographics. From Indian brides ordering bridal bangle sets to
              Gen-Z consumers stacking minimalist bracelets, our range covers it
              all.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Our{" "}
              <Link
                to="/imitation-jewellery-supplier-uae"
                className="text-primary hover:underline"
              >
                UAE bangle buyers
              </Link>{" "}
              favour gold-plated sets with intricate filigree work. Our{" "}
              <Link
                to="/jewellery-supplier-uk"
                className="text-primary hover:underline"
              >
                UK buyers
              </Link>{" "}
              prefer oxidised sets and modern chain bracelets. Our Southeast
              Asian buyers (Singapore, Malaysia) love Kundan and meenakari work
              bangles for festive seasons. We can curate market-specific
              collections per buyer request.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              All bracelets and bangles are shipped with anti-tarnish treatment
              and individual polybag packaging. Bulk-order discounts start at
              200 units.{" "}
              <Link to="/wholesale" className="text-primary hover:underline">
                WhatsApp our team
              </Link>{" "}
              to receive current pricing tiers.
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
                  ["/collections/rings", "Rings"],
                  ["/collections/oxidised-jewelry", "Oxidised"],
                  ["/collections/party-wear-jewelry", "Party Wear"],
                  ["/collections/daily-wear-jewelry", "Daily Wear"],
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
            data-ocid="bracelets.cta.section"
          >
            <h2 className="font-serif text-xl font-bold mb-2">
              Get Wholesale Bangle & Bracelet Pricing
            </h2>
            <p className="text-white/80 mb-5 text-sm">
              WhatsApp us for our full catalogue with current prices and MOQ
              options.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                asChild
                className="bg-accent text-primary font-bold hover:bg-accent/90"
                data-ocid="bracelets.cta.whatsapp"
              >
                <a
                  href="https://wa.me/917976341419?text=Hi%2C%20I%27m%20interested%20in%20wholesale%20bangles%20and%20bracelets%20from%20Gemora%20Global"
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
                data-ocid="bracelets.cta.products"
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
