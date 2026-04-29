import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { BASE_URL, usePageSEO } from "../../hooks/usePageSEO";

const FAQ = [
  {
    q: "What is oxidised jewelry?",
    a: "Oxidised jewelry features a darkened silver-tone finish created by a chemical oxidation process — giving pieces an antique, vintage, or heritage appearance. Popular for ethnic and boho fashion styles.",
  },
  {
    q: "Is oxidised jewelry durable?",
    a: "Yes. Our oxidised jewelry uses a stabilised plating process with a protective coat that prevents further oxidation and maintains the antique appearance during regular wear.",
  },
  {
    q: "What styles does your oxidised collection include?",
    a: "Oxidised jhumka earrings, chandbali sets, tribal rings, bangles, necklaces, temple jewelry pieces, and complete oxidised jewellery sets for festive and ethnic wear.",
  },
  {
    q: "Which markets import oxidised jewelry the most?",
    a: "UK, USA, Australia, Germany, and Canada are our top oxidised jewelry markets — especially boutiques serving boho, ethnic, and South Asian fashion segments.",
  },
];

export default function OxidisedJewelry() {
  usePageSEO({
    title:
      "Oxidised Jewelry Wholesale | Antique Oxidised Silver Jewelry India | Gemora Global",
    description:
      "Wholesale oxidised jewelry from India — antique silver oxidised earrings, jhumkas, bangles, necklaces, tribal rings. Heritage & boho styles. MOQ 50 pcs. Export UK, USA, UAE.",
    canonical: `${BASE_URL}/collections/oxidised-jewelry`,
    breadcrumbs: [
      { name: "Home", url: BASE_URL },
      { name: "Collections", url: `${BASE_URL}/products` },
      {
        name: "Oxidised Jewelry",
        url: `${BASE_URL}/collections/oxidised-jewelry`,
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
              / Oxidised Jewelry
            </nav>
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Oxidised Jewelry — Antique & Heritage Styles
            </h1>
            <p className="text-muted-foreground max-w-2xl text-sm md:text-base">
              Wholesale oxidised jewelry from Gemora Global — antique silver
              oxidised earrings, jhumkas, bangles, necklaces, tribal rings.
              Heritage and boho aesthetics. MOQ 50 units. Exported to UK, USA,
              UAE, and 20+ countries.
            </p>
          </div>
        </div>

        <div className="container px-4 py-10 md:py-16">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h2 className="font-serif text-2xl font-bold mb-4">
                Oxidised Jewelry Wholesale — Antique Silver from India
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Gemora Global manufactures premium{" "}
                <strong>oxidised jewelry wholesale</strong> from Jaipur, India —
                one of the world's top centres for traditional Indian jewellery
                craft. Our oxidised silver-tone collection draws on centuries of
                Indian jewellery heritage, featuring traditional motifs, tribal
                patterns, and heritage designs that are beloved by boho, ethnic,
                and global fashion buyers.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our <strong>antique silver jewelry</strong> range includes
                oxidised jhumka earrings, chandbali sets, traditional necklaces
                with kundan inlay, tribal bangles, multi-layer earrings, and
                complete oxidised jewellery sets. The darkened silver-tone
                finish is achieved through a controlled oxidation process with a
                protective topcoat to maintain the antique look during wear.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>Oxidised rings wholesale</strong> — including statement
                cocktail rings, stacking oxidised bands, and traditional Indian
                finger rings — are among our top-selling pieces for UK boho
                boutiques and USA ethnic fashion retailers.{" "}
                <strong>Oxidised earrings</strong> including traditional jhumkas
                and large statement chandbalis are perennial bestsellers in
                South Asian markets worldwide.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our oxidised collection pairs beautifully with our{" "}
                <Link
                  to="/collections/party-wear-jewelry"
                  className="text-primary hover:underline"
                >
                  party wear
                </Link>{" "}
                and ethnic collections for complete cultural wardrobe sourcing.
                We can supply complete oxidised jewellery sets — earrings,
                necklace, bangles, and tikka — for boutiques targeting South
                Asian festive and wedding guest markets.
              </p>
            </div>
            <div className="space-y-4">
              <div className="bg-muted/30 rounded-xl p-5 border border-border">
                <h3 className="font-semibold mb-3">
                  🖤 Oxidised Jewelry Styles
                </h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  {[
                    "Oxidised Jhumka Earrings",
                    "Antique Chandbali Sets",
                    "Tribal Statement Necklaces",
                    "Oxidised Bangle Sets",
                    "Antique Silver Rings",
                    "Vintage-Look Chokers",
                    "Traditional Tikka Sets",
                    "Complete Oxidised Sets",
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
                  <li>Finish: Oxidised silver (black plating)</li>
                  <li>Base: Alloy with protective coat</li>
                  <li>Style: Ethnic / Boho / Heritage</li>
                  <li>Lead Time: 10–15 business days</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="font-serif text-2xl font-bold mb-4">
              Oxidised Jewelry for Global Boho & Ethnic Markets
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Oxidised jewelry sits at the intersection of traditional Indian
              craft and global boho fashion — making it an incredibly versatile
              category for international buyers. In the UK, oxidised jewellery
              is beloved by both South Asian boutiques and mainstream bohemian
              fashion stores. In the USA, oxidised tribal designs sell strongly
              in festival fashion and artisan boutique markets.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <Link
                to="/oxidised-jewellery-wholesale"
                className="text-primary hover:underline"
              >
                Our dedicated oxidised jewellery export page
              </Link>{" "}
              has more details on our global supply capabilities. We also offer{" "}
              <Link
                to="/custom-jewellery-manufacturer"
                className="text-primary hover:underline"
              >
                custom oxidised designs
              </Link>{" "}
              from 500 units — perfect for boutiques that want exclusive
              designs.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              All oxidised pieces are individually inspected for finish quality
              and plating consistency. We wrap each item in anti-tarnish tissue
              and seal in polybags for export. Branded packaging available for
              private label clients.
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
                  ["/collections/rings", "Rings"],
                  ["/collections/party-wear-jewelry", "Party Wear"],
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
            data-ocid="oxidised.cta.section"
          >
            <h2 className="font-serif text-xl font-bold mb-2">
              Get Oxidised Jewelry Wholesale Catalogue
            </h2>
            <p className="text-white/80 mb-5 text-sm">
              Request our antique oxidised jewelry catalogue with wholesale
              pricing and available designs.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                asChild
                className="bg-accent text-primary font-bold hover:bg-accent/90"
                data-ocid="oxidised.cta.whatsapp"
              >
                <a
                  href="https://wa.me/917976341419?text=Hi%2C%20I%27m%20interested%20in%20oxidised%20jewelry%20wholesale%20from%20Gemora%20Global"
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
                data-ocid="oxidised.cta.products"
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
