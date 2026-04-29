import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { BASE_URL, usePageSEO } from "../../hooks/usePageSEO";

const FAQ = [
  {
    q: "What is party wear jewelry?",
    a: "Party wear jewelry includes bold, glamorous pieces designed for weddings, parties, festivals, and special occasions — typically featuring stones, crystals, elaborate designs, and statement finishes.",
  },
  {
    q: "What styles are popular for party jewelry wholesale?",
    a: "Chandbali earrings, Kundan sets, crystal statement necklaces, cocktail rings, layered bridal sets, and heavy gold-plated bangles are top sellers for party and occasion wear.",
  },
  {
    q: "What is the MOQ for party wear jewelry?",
    a: "MOQ starts at 50 pieces per design. Complete sets (necklace + earrings) have a MOQ of 25 sets.",
  },
  {
    q: "Do you export party jewelry to UAE and UK?",
    a: "Yes. UAE, UK, USA, Canada, and Malaysia are our top markets for party and occasion jewelry. We offer DDP shipping for UAE buyers.",
  },
];

export default function PartyWearJewelry() {
  usePageSEO({
    title:
      "Party Wear Jewelry Online | Wholesale Party Jewelry India | Gemora Global",
    description:
      "Wholesale party wear jewelry from India — Kundan sets, crystal earrings, cocktail necklaces, statement pieces for parties and weddings. MOQ 50 pcs. Export UAE, UK, USA.",
    canonical: `${BASE_URL}/collections/party-wear-jewelry`,
    breadcrumbs: [
      { name: "Home", url: BASE_URL },
      { name: "Collections", url: `${BASE_URL}/products` },
      {
        name: "Party Wear Jewelry",
        url: `${BASE_URL}/collections/party-wear-jewelry`,
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
              / Party Wear Jewelry
            </nav>
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Party Wear Jewelry — Bold & Glamorous Styles
            </h1>
            <p className="text-muted-foreground max-w-2xl text-sm md:text-base">
              Wholesale party wear jewelry from Gemora Global. Glamorous Kundan
              sets, crystal earrings, statement necklaces, cocktail rings, and
              complete party jewelry collections. MOQ 50 pieces. Exported to
              UAE, UK, USA, and 20+ countries.
            </p>
          </div>
        </div>

        <div className="container px-4 py-10 md:py-16">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h2 className="font-serif text-2xl font-bold mb-4">
                Wholesale Party Jewelry — Statement Pieces for Every Occasion
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Gemora Global's party wear jewelry collection is designed for
                boutiques, fashion retailers, and distributors who serve
                customers attending weddings, parties, festivals, and glamorous
                events. Our <strong>party wear jewelry online</strong> range
                features bold, high-impact designs that command attention —
                Kundan chandbali sets, crystal chandelier earrings, oversized
                cocktail necklaces, and statement cocktail rings.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>Wedding guest jewelry</strong> is one of our
                fastest-growing categories. Boutiques catering to South Asian
                diaspora communities in UK, USA, Canada, and UAE frequently
                order our wedding-season collections featuring gold-plated
                Kundan sets, pearl-drop earrings, and coordinated bangle and
                necklace sets for cocktail parties and mehndi functions.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our party jewelry uses premium alloy with multi-layer gold
                plating and American Diamond (CZ) stones that replicate the
                glamour of fine jewellery. Anti-tarnish coating ensures your
                customers' pieces retain their sparkle throughout an evening. We
                also offer rhodium and rose gold plating for contemporary party
                collections.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                MOQ starts at 50 pieces per design for individual pieces, and 25
                sets for complete necklace + earring sets. Bulk-order discounts
                apply for quantities over 200 pieces. Lead time is 10–15
                business days from order confirmation.
              </p>
            </div>
            <div className="space-y-4">
              <div className="bg-muted/30 rounded-xl p-5 border border-border">
                <h3 className="font-semibold mb-3">🎉 Party Jewelry Styles</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  {[
                    "Kundan & Polki Party Sets",
                    "Crystal Chandelier Earrings",
                    "Statement Cocktail Necklaces",
                    "Bridal & Wedding Jewellery",
                    "Heavy Gold-plated Bangles",
                    "Cocktail Rings & Cuffs",
                    "Layered Festival Sets",
                    "Tikka & Maang Tikka Sets",
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
                  <li>Sets MOQ: 25 sets min.</li>
                  <li>Finish: Gold, Rose Gold, Rhodium</li>
                  <li>Lead Time: 10–15 business days</li>
                  <li>Packaging: Gift box available</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="font-serif text-2xl font-bold mb-4">
              Party Jewelry for Global Markets — UAE, UK, USA
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>UAE party jewelry:</strong> Our gold-tone Kundan and
              crystal sets are perfect for Dubai's glamorous event culture. We
              supply party jewellery to boutiques in Dubai Mall, Abu Dhabi, and
              Sharjah. DDP shipping available.{" "}
              <Link
                to="/export-markets/uae"
                className="text-primary hover:underline"
              >
                Learn about UAE export services →
              </Link>
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>UK party jewelry:</strong> South Asian boutiques in
              London, Birmingham, and Leicester are our top UK party jewelry
              buyers, sourcing Kundan and bridal sets for the wedding season. We
              also supply contemporary crystal party sets for mainstream UK
              fashion boutiques.{" "}
              <Link
                to="/export-markets/uk"
                className="text-primary hover:underline"
              >
                Learn about UK export services →
              </Link>
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>USA party jewelry:</strong> Indian-American boutiques and
              South Asian event vendors in New York, Chicago, New Jersey, and
              California regularly source our party jewelry collections. We
              offer DHL express shipping with 5–7 day delivery to USA.{" "}
              <Link
                to="/export-markets/usa"
                className="text-primary hover:underline"
              >
                Learn about USA export services →
              </Link>
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
                  ["/collections/daily-wear-jewelry", "Daily Wear"],
                  ["/collections/trendy-jewelry", "Trendy"],
                  ["/collections/korean-jewelry", "Korean Style"],
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
            data-ocid="partywear.cta.section"
          >
            <h2 className="font-serif text-xl font-bold mb-2">
              Order Party Wear Jewelry Wholesale
            </h2>
            <p className="text-white/80 mb-5 text-sm">
              WhatsApp for our party jewelry catalogue with current pricing and
              MOQ details.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                asChild
                className="bg-accent text-primary font-bold hover:bg-accent/90"
                data-ocid="partywear.cta.whatsapp"
              >
                <a
                  href="https://wa.me/917976341419?text=Hi%2C%20I%27m%20interested%20in%20party%20wear%20jewelry%20wholesale%20from%20Gemora%20Global"
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
                data-ocid="partywear.cta.products"
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
