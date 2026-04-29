import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { BASE_URL, usePageSEO } from "../../hooks/usePageSEO";

const RELATED = [
  { label: "Statement Earrings", to: "/collections/earrings" },
  { label: "Layered Necklaces", to: "/collections/necklaces" },
  { label: "Party Wear", to: "/collections/party-wear-jewelry" },
  { label: "Korean Jewelry", to: "/collections/korean-jewelry" },
  { label: "Minimalist", to: "/collections/minimalist-jewelry" },
  { label: "Oxidised", to: "/collections/oxidised-jewelry" },
];

const FAQ = [
  {
    q: "What is trendy fashion jewelry?",
    a: "Trendy fashion jewelry refers to imitation or artificial jewelry inspired by current runway, social media, and street-style trends — featuring bold statement pieces, layered necklaces, geometric designs, and aesthetic minimalist styles.",
  },
  {
    q: "What is the MOQ for trendy jewelry wholesale?",
    a: "Our minimum order quantity starts at 50 units per design, making it easy for boutiques and online sellers to test new trends without large commitments.",
  },
  {
    q: "Do you ship trendy jewelry internationally?",
    a: "Yes. We export to UAE, USA, UK, France, Canada, Australia, Singapore, Malaysia, Saudi Arabia, Nigeria, Sri Lanka, and 20+ more countries.",
  },
  {
    q: "What finishes are available?",
    a: "Gold plating, matte gold, rose gold, rhodium, oxidised, black plating, mehndi plating, 2-tone and 3-tone finishes — all with anti-tarnish coating.",
  },
];

export default function TrendyJewelry() {
  usePageSEO({
    title: "Trendy Jewelry Online | Latest Fashion Jewelry | Gemora Global",
    description:
      "Shop trendy fashion jewelry wholesale at Gemora Global. Latest styles — statement earrings, layered necklaces, modern rings. Affordable imitation jewelry MOQ 50 units. Export to UAE, USA, UK.",
    canonical: `${BASE_URL}/collections/trendy-jewelry`,
    breadcrumbs: [
      { name: "Home", url: BASE_URL },
      { name: "Collections", url: `${BASE_URL}/products` },
      { name: "Trendy Jewelry", url: `${BASE_URL}/collections/trendy-jewelry` },
    ],
    faqItems: FAQ,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Hero / Breadcrumb */}
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
              / Trendy Jewelry
            </nav>
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Trendy Fashion Jewelry — Shop the Latest Styles Online
            </h1>
            <p className="text-muted-foreground max-w-2xl text-sm md:text-base">
              Stay ahead of the fashion curve with Gemora Global's trendy
              jewelry collection. Explore statement earrings, layered necklaces,
              and modern rings — designed for everyday style and special
              occasions. Affordable wholesale imitation jewelry. MOQ from 50
              units.
            </p>
          </div>
        </div>

        <div className="container px-4 py-10 md:py-16">
          {/* Main content grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h2 className="font-serif text-2xl font-bold mb-4">
                What's Trending in Fashion Jewelry 2026
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Fashion jewelry trends move fast — and{" "}
                <Link to="/about" className="text-primary hover:underline">
                  Gemora Global
                </Link>{" "}
                stays ahead of the curve. Our trendy jewelry collection for 2026
                features the hottest styles: Korean-inspired minimalist pieces,
                bold statement necklaces, oxidised heritage designs, and dainty
                aesthetic layering sets. We manufacture and export affordable{" "}
                <Link to="/products" className="text-primary hover:underline">
                  imitation jewelry
                </Link>{" "}
                that helps boutiques, online stores, and fashion retailers keep
                their inventory fresh and exciting throughout the year.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our trend-driven collection includes gold-plated layered
                necklaces, oxidised statement earrings, pearl-drop hoops,
                geometric rings, aesthetic bangles, and Korean-style minimalist
                chains. Each piece is designed by our in-house team based on
                current social media trends, runway looks, and direct buyer
                feedback from markets in UAE, USA, UK, Europe, and Southeast
                Asia.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Whether you're sourcing for a boutique, an Instagram shop, or a
                fashion chain, Gemora Global delivers trendy imitation jewelry
                at{" "}
                <Link to="/wholesale" className="text-primary hover:underline">
                  wholesale prices
                </Link>{" "}
                direct from our Jaipur manufacturing unit. MOQ starts at just 50
                pieces per design — ideal for testing new trends without
                overstocking. Custom designs and private label options are
                available from 500 units.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Every piece in our trendy collection features premium
                anti-tarnish coating, ensuring lasting shine for your end
                customers. We offer Gold Plating, Matte Gold, Rose Gold,
                Rhodium, Oxidised, Black, and Mehndi finishes. Retail-ready
                packaging available for boutique and e-commerce sellers.
              </p>
            </div>
            <div className="space-y-4">
              <div className="bg-muted/30 rounded-xl p-5 border border-border">
                <h3 className="font-semibold mb-3">
                  🔥 Top Trending Styles 2026
                </h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  {[
                    "Korean-inspired minimalist jewelry",
                    "Gold-plated layered necklaces",
                    "Statement oxidised earrings",
                    "Pearl and gemstone drops",
                    "Aesthetic chokers and chains",
                    "Gen-Z geometric designs",
                    "Boho cuffs and stacker rings",
                    "Dainty daily wear sets",
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
                  <li>MOQ: 50 units per design</li>
                  <li>Finish: Gold, Oxidised, Rose Gold, Rhodium, Black</li>
                  <li>Lead Time: 10–15 business days</li>
                  <li>Packaging: Retail-ready with tags</li>
                  <li>Shipping: DHL, FedEx, EMS worldwide</li>
                  <li>Payment: T/T, PayPal, Western Union</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Why Trendy > Luxury Strategy */}
          <div className="bg-muted/20 rounded-xl p-6 md:p-8 border border-border mb-12">
            <h2 className="font-serif text-2xl font-bold mb-4">
              Why Fashion Jewelry Outperforms Luxury in Wholesale
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-sm text-muted-foreground">
              {[
                {
                  icon: "📈",
                  title: "Faster Turnover",
                  desc: "Trendy pieces sell in weeks, not months. Fast-moving inventory = better cash flow for retailers and boutiques.",
                },
                {
                  icon: "💰",
                  title: "Better Margins",
                  desc: "Affordable imitation jewelry bought at wholesale prices allows retailers to mark up 3–5x. Trend items command premium retail pricing.",
                },
                {
                  icon: "🌍",
                  title: "Global Demand",
                  desc: "Fashion jewelry is universally in demand across UAE, USA, UK, Europe and South Asia — driven by social media and influencer culture.",
                },
              ].map((item) => (
                <div key={item.title}>
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {item.title}
                  </h3>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Collections grid */}
          <div className="mb-12">
            <h2 className="font-serif text-2xl font-bold mb-6">
              Explore Our Trend Collections
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                {
                  label: "Statement Earrings",
                  desc: "Bold jhumkas, chandbalis, hoops",
                  to: "/collections/earrings",
                },
                {
                  label: "Layered Necklaces",
                  desc: "Stacked chains, pendants, chokers",
                  to: "/collections/necklaces",
                },
                {
                  label: "Party Wear",
                  desc: "Glamorous sets for special occasions",
                  to: "/collections/party-wear-jewelry",
                },
                {
                  label: "Korean Jewelry",
                  desc: "K-beauty minimalist aesthetic",
                  to: "/collections/korean-jewelry",
                },
                {
                  label: "Minimalist",
                  desc: "Clean lines, dainty everyday wear",
                  to: "/collections/minimalist-jewelry",
                },
                {
                  label: "Oxidised",
                  desc: "Antique silver heritage designs",
                  to: "/collections/oxidised-jewelry",
                },
              ].map((col) => (
                <Link
                  key={col.to}
                  to={col.to}
                  className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 hover:shadow-md transition-all duration-200"
                  data-ocid="trendy.collection.link"
                >
                  <h3 className="font-semibold text-sm mb-1">{col.label}</h3>
                  <p className="text-xs text-muted-foreground">{col.desc}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Keyword coverage section */}
          <div className="mb-12">
            <h2 className="font-serif text-2xl font-bold mb-4">
              Buy Fashion Jewelry Online — Wholesale Prices Direct from India
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Looking to <strong>buy fashion jewelry online</strong> at
              wholesale prices? Gemora Global ships factory-direct imitation
              jewelry to boutiques, online retailers, and distributors
              worldwide. Our{" "}
              <Link to="/wholesale" className="text-primary hover:underline">
                wholesale jewelry
              </Link>{" "}
              catalogue includes 500+ designs updated seasonally — covering all
              the trends that matter:{" "}
              <Link
                to="/collections/korean-jewelry"
                className="text-primary hover:underline"
              >
                Korean jewelry trends
              </Link>
              , Gen-Z aesthetic jewelry, Pinterest-worthy layered looks, and
              occasion-specific pieces for party, office, and bridal wear.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Our <strong>trendy jewelry online</strong> offering is backed by a
              decade of export experience. We understand what sells in different
              markets: USA buyers prefer minimalist and layered styles; UAE
              buyers love glamorous party pieces; UK boutiques favour oxidised
              and boho-chic designs. We tailor our collection accordingly and
              provide market-specific guidance to new buyers.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              All our <strong>artificial jewelry online</strong> listings come
              with complete specs: material, plating, dimensions, MOQ, lead
              time, and packaging options. WhatsApp us your requirements and
              receive a customised quote within 24 hours.
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

          {/* CTA */}
          <div
            className="bg-primary text-primary-foreground rounded-xl p-8 text-center"
            data-ocid="trendy.cta.section"
          >
            <h2 className="font-serif text-2xl font-bold mb-3">
              Ready to Stock Trending Jewelry?
            </h2>
            <p className="text-white/80 mb-6 max-w-xl mx-auto text-sm">
              Contact our wholesale team today. We'll share our latest trendy
              jewelry catalogue, pricing tiers, and MOQ options — tailored to
              your market.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                asChild
                className="bg-accent text-primary font-bold hover:bg-accent/90"
                data-ocid="trendy.cta.whatsapp"
              >
                <a
                  href="https://wa.me/917976341419?text=Hi%2C%20I%27m%20interested%20in%20trendy%20jewelry%20wholesale%20from%20Gemora%20Global"
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
                data-ocid="trendy.cta.products"
              >
                <Link to="/products">Browse All Products</Link>
              </Button>
            </div>
          </div>

          {/* Related collections */}
          <div className="mt-12">
            <h3 className="font-semibold text-sm mb-3 text-muted-foreground uppercase tracking-wider">
              Related Collections
            </h3>
            <div className="flex flex-wrap gap-2">
              {RELATED.map((r) => (
                <Link
                  key={r.to}
                  to={r.to}
                  className="bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 text-xs font-medium hover:bg-primary/20 transition-colors"
                >
                  {r.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
