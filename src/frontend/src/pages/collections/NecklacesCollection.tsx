import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { BASE_URL, usePageSEO } from "../../hooks/usePageSEO";

const FAQ = [
  {
    q: "What necklace styles do you wholesale?",
    a: "Choker necklaces, layered chain necklaces, Kundan pendant sets, minimalist chains, statement Polki necklaces, coin necklaces, and complete bridal necklace sets.",
  },
  {
    q: "What is the MOQ for wholesale necklaces?",
    a: "Minimum order quantity starts at 50 pieces per design. Complete bridal necklace sets have a MOQ of 10 sets.",
  },
  {
    q: "Can I order necklaces with matching earrings?",
    a: "Yes. We supply matching earring and necklace sets, as well as complete jewellery sets with bangles and Maang Tikka.",
  },
  {
    q: "Do you ship necklaces to USA and UK?",
    a: "Yes, we export to USA, UK, UAE, France, Canada, Australia, Singapore, and 20+ countries via DHL, FedEx, and EMS.",
  },
];

export default function NecklacesCollection() {
  usePageSEO({
    title:
      "Wholesale Necklaces | Fashion Necklace Supplier India | Gemora Global",
    description:
      "Wholesale fashion necklaces from India — layered necklaces, chokers, Kundan pendant sets, minimalist chains, bridal necklaces. MOQ 50 pcs. Anti-tarnish. Export UAE, UK, USA.",
    canonical: `${BASE_URL}/collections/necklaces`,
    breadcrumbs: [
      { name: "Home", url: BASE_URL },
      { name: "Collections", url: `${BASE_URL}/products` },
      { name: "Necklaces", url: `${BASE_URL}/collections/necklaces` },
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
              / Necklaces
            </nav>
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Fashion Necklaces — Layered, Statement & Minimal Styles
            </h1>
            <p className="text-muted-foreground max-w-2xl text-sm md:text-base">
              Wholesale fashion necklaces from Gemora Global — layered
              necklaces, chokers, Kundan pendant sets, minimalist chains, and
              complete bridal necklace sets. MOQ 50 pieces. Exported to 20+
              countries.
            </p>
          </div>
        </div>

        <div className="container px-4 py-10 md:py-16">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h2 className="font-serif text-2xl font-bold mb-4">
                Wholesale Necklaces Direct from Jaipur, India
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Gemora Global supplies premium wholesale necklaces to boutiques,
                fashion retailers, and distributors worldwide. Our necklace
                collection covers the full spectrum — from{" "}
                <strong>layered minimalist chains</strong> and trendy chokers to
                traditional{" "}
                <Link
                  to="/kundan-jewellery-wholesale"
                  className="text-primary hover:underline"
                >
                  Kundan pendant sets
                </Link>{" "}
                and complete{" "}
                <Link
                  to="/bridal-jewellery-wholesale"
                  className="text-primary hover:underline"
                >
                  bridal necklace sets
                </Link>
                . Each piece is manufactured in our Jaipur facility with
                anti-tarnish coating for lasting shine.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our <strong>statement necklaces wholesale India</strong> range
                includes bold Polki chokers, multi-strand beaded necklaces,
                coin-pendant chains, and cocktail necklaces favoured by UAE and
                European fashion boutiques. For everyday wear, we offer dainty{" "}
                <Link
                  to="/collections/minimalist-jewelry"
                  className="text-primary hover:underline"
                >
                  minimalist chains
                </Link>
                , delicate pendant sets, and Korean-style layering necklaces
                that are top sellers on Instagram and Etsy shops.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We export necklaces to UAE, UK, USA, France, Australia, Canada,
                Singapore, Malaysia, Saudi Arabia, Nigeria, Sri Lanka, and
                Kuwait. Our export-ready packaging includes anti-tarnish pouches
                and retail tags, making your products shelf-ready on arrival.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Custom necklace design, OEM, and private label services are
                available from 500 units with a 3–4 week lead time. We can
                incorporate your brand name into packaging and tags.
                GST-compliant export invoices issued for all orders.
              </p>
            </div>
            <div className="space-y-4">
              <div className="bg-muted/30 rounded-xl p-5 border border-border">
                <h3 className="font-semibold mb-3">
                  📿 Necklace Styles Available
                </h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  {[
                    "Choker Necklaces",
                    "Layered Chain Necklaces",
                    "Kundan Pendant Sets",
                    "Minimalist Dainty Chains",
                    "Statement Polki Necklaces",
                    "Bridal Necklace Sets",
                    "Coin & Charm Necklaces",
                    "Long Mala Necklaces",
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
                  <li>Bridal sets: 10 sets min.</li>
                  <li>Finish: Gold, Rhodium, Oxidised, Rose Gold</li>
                  <li>Lead Time: 10–15 business days</li>
                  <li>Shipping: DHL, FedEx, EMS worldwide</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="font-serif text-2xl font-bold mb-6">
              Necklace Collections — By Style
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  title: "Layered & Minimalist Necklaces",
                  desc: "Dainty chains, pendant layering sets, and Korean-style coin necklaces perfect for daily wear and online fashion shops. Lightweight, comfortable, and universally trendy.",
                  icon: "🔗",
                },
                {
                  title: "Statement & Ethnic Necklaces",
                  desc: "Bold Kundan chokers, multi-strand beaded necklaces, and festive designs for South Asian boutiques. Top sellers in UAE, UK, and USA South Asian markets.",
                  icon: "💛",
                },
                {
                  title: "Bridal Necklace Sets",
                  desc: "Complete bridal jewellery sets featuring Kundan, Polki, or CZ necklaces with matching earrings, Maang Tikka, and bangles. Available in full gold or multicolour finishes.",
                  icon: "👰",
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

          <div className="mb-12">
            <h2 className="font-serif text-2xl font-bold mb-4">
              Why Buyers Choose Our Wholesale Necklaces
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Our <strong>wholesale necklaces from India</strong> are trusted by
              hundreds of boutiques and distributors for three key reasons:
              consistent quality, competitive factory-direct pricing, and
              trend-forward designs. Unlike middlemen sourcing from multiple
              suppliers, Gemora Global manufactures everything in-house at our
              Jaipur facility — giving you full quality control and shorter lead
              times.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We update our necklace designs every season based on market
              research and buyer feedback. Our design team tracks trends from
              London Fashion Week, Dubai Gold Souk, and Instagram fashion
              influencers to ensure your inventory stays fresh.{" "}
              <Link to="/wholesale" className="text-primary hover:underline">
                Request our latest necklace catalogue
              </Link>{" "}
              to see what's new this season.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Payment options include T/T bank transfer, PayPal, Western Union,
              and LC. We accept 50% advance for new buyers. Wholesale pricing
              tiers available — the more you order, the better the price per
              piece.
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
                  ["/collections/bracelets", "Bracelets"],
                  ["/collections/rings", "Rings"],
                  ["/collections/party-wear-jewelry", "Party Wear"],
                  ["/collections/minimalist-jewelry", "Minimalist"],
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

          <div
            className="bg-primary text-primary-foreground rounded-xl p-8 text-center"
            data-ocid="necklaces.cta.section"
          >
            <h2 className="font-serif text-xl font-bold mb-2">
              Get Wholesale Necklace Catalogue
            </h2>
            <p className="text-white/80 mb-5 text-sm">
              WhatsApp us for our full necklace collection with wholesale
              pricing and MOQ details.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                asChild
                className="bg-accent text-primary font-bold hover:bg-accent/90"
                data-ocid="necklaces.cta.whatsapp"
              >
                <a
                  href="https://wa.me/917976341419?text=Hi%2C%20I%27m%20interested%20in%20wholesale%20necklaces%20from%20Gemora%20Global"
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
                data-ocid="necklaces.cta.products"
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
