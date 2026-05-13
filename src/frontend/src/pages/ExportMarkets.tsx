import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { usePageSEO } from "../hooks/usePageSEO";
import { EXPORT_HREFLANG_CLUSTER } from "../lib/seo-constants";

const markets = [
  {
    flag: "🇦🇪",
    region: "UAE & Middle East",
    country: "UAE",
    description:
      "The UAE and broader Middle East market is one of our strongest. Buyers in Dubai, Abu Dhabi, and Saudi Arabia consistently favour statement pieces with heavy goldwork, kundan detailing, and bridal jewellery sets — particularly for the South Asian wedding retail segment.",
    packaging:
      "Velvet-lined gift boxes with foam inserts for luxury retail presentation.",
    shipping:
      "Air freight with standard delivery times of 5–7 business days from dispatch.",
    bulk: "MOQ starts at 100 pieces per design. Mixed category orders accepted.",
  },
  {
    flag: "🇫🇷",
    region: "France & Western Europe",
    country: "France",
    description:
      "French and wider Western European buyers tend to favour more minimal, contemporary designs — geometric earrings, delicate layered necklaces, and oxidised silver-finish pieces that suit the French boutique aesthetic. We have experience with CE marking requirements and can advise on EU import compliance for fashion jewellery.",
    packaging:
      "Elegant gift boxes with satin ribbon. EU-compliant material labels available.",
    shipping:
      "Direct flights from India to Paris CDG. Delivery in 6-8 business days.",
    bulk: "MOQ starts at 100 pieces. Mixed collections welcome.",
  },
  {
    flag: "🇬🇧",
    region: "United Kingdom",
    country: "UK",
    description:
      "The UK market has a large and affluent South Asian diaspora, creating strong demand for traditional Indian bridal jewellery sets alongside contemporary Indo-Western fusion pieces. We ship to UK buyers via DHL Express with delivery in 4–6 business days. We provide all HMRC-compliant export documentation.",
    packaging:
      "Premium branded packaging with certificate of authenticity option.",
    shipping:
      "Direct flights from India to London Heathrow. 4–6 business days via DHL.",
    bulk: "MOQ starts at 150 pieces. Mix and match from any category.",
  },
  {
    flag: "🇺🇸",
    region: "USA & Canada",
    country: "USA",
    description:
      "Our North American buyers — primarily fashion boutiques, online retailers, and diaspora market stores — source across our full range from minimal everyday jewellery to statement traditional sets. We ship to USA and Canada via FedEx International Priority, with standard delivery of 5–8 business days. We provide HS code classification support for US customs clearance.",
    packaging:
      "Eco-friendly kraft boxes with ribbon ties. Custom branding available.",
    shipping:
      "FedEx International Priority. 5–8 business days to USA and Canada.",
    bulk: "Minimum 200 pieces per order. Seasonal collections available.",
  },
  {
    flag: "🇦🇺",
    region: "Australia & Singapore",
    country: "Australia",
    description:
      "We supply to boutiques and wholesalers across Australia and Singapore, serving both the general fashion market and the South Asian diaspora segment. Reliable shipping routes and competitive pricing make us the preferred Indian jewellery supplier in the Asia-Pacific region.",
    packaging:
      "Export-grade packaging compliant with Australian customs requirements.",
    shipping: "Air freight via major hubs. Delivery in 7–10 business days.",
    bulk: "Minimum order of $500 AUD equivalent. Flexible mix of categories.",
  },
];

export default function ExportMarkets() {
  usePageSEO({
    title:
      "Imitation Jewellery Export to UAE, France, USA & Europe | Gemora Global",
    description:
      "Gemora Global exports imitation jewellery to UAE, France, USA, UK, Germany, Canada, Australia & Singapore. Market-specific wholesale designs, export docs & reliable shipping.",
    canonical: "https://www.gemoraglobal.co/global-markets",
    hreflangs: EXPORT_HREFLANG_CLUSTER,
    ogTitle:
      "Imitation Jewellery Export UAE France USA UK | Gemora Global India",
    ogDescription:
      "Wholesale imitation jewellery export from Jaipur, India to UAE, France, USA, UK & Europe. Market-specific designs. MOQ 50 units.",
    ogImage: "https://www.gemoraglobal.co/images/og-banner.jpg",
    schema: {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Jewellery Export to Global Markets",
      provider: { "@type": "Organization", name: "Gemora Global" },
      areaServed: [
        { "@type": "Country", name: "United Arab Emirates" },
        { "@type": "Country", name: "France" },
        { "@type": "Country", name: "United Kingdom" },
        { "@type": "Country", name: "United States" },
        { "@type": "Country", name: "Canada" },
        { "@type": "Country", name: "Australia" },
        { "@type": "Country", name: "Singapore" },
      ],
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="bg-card border-b border-border py-8 md:py-12 px-4">
          <div className="container px-0">
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold mb-2 leading-tight">
              Global Jewellery Export — Market-Specific Supply for 15+ Countries
            </h1>
            <p className="text-muted-foreground max-w-2xl text-sm md:text-base">
              Gemora Global has built a deep understanding of the specific
              buying preferences, retail price points, and design tastes across
              our key international markets. We don't just ship boxes — we help
              our buyers select the right{" "}
              <Link to="/products" className="text-primary hover:underline">
                products
              </Link>{" "}
              for their specific market, based on years of export experience.
              See our{" "}
              <Link to="/wholesale" className="text-primary hover:underline">
                wholesale pricing
              </Link>{" "}
              for MOQ details.
            </p>
          </div>
        </div>

        {/* Stats row — grid-cols-2 on mobile */}
        <div className="container px-4 py-6 md:py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[
              { value: "50+", label: "Countries Served" },
              { value: "10+", label: "Years Exporting" },
              { value: "500+", label: "Designs Available" },
              { value: "24h", label: "Response Time" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-card border border-border rounded-xl p-4 text-center"
              >
                <div className="font-bold text-primary text-xl md:text-2xl mb-1">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market cards — grid-cols-1 on mobile */}
        <div className="container px-4 pb-10 md:pb-12 space-y-4 md:space-y-8">
          {markets.map((m) => (
            <div
              key={m.country}
              className="bg-card rounded-xl border border-border overflow-hidden"
            >
              {/* Header — flag + description */}
              <div className="p-4 md:p-6 border-b border-border flex items-start gap-3 md:gap-4">
                <span className="text-4xl md:text-5xl flex-shrink-0">
                  {m.flag}
                </span>
                <div className="min-w-0">
                  <h2 className="font-serif text-xl md:text-2xl font-bold mb-1">
                    {m.region}
                  </h2>
                  <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                    {m.description}
                  </p>
                </div>
              </div>
              {/* Details — stacked on mobile, 3 cols on md */}
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
                <div className="p-4 md:p-5">
                  <p className="font-semibold text-sm text-primary mb-2">
                    📦 Packaging
                  </p>
                  <p className="text-sm text-muted-foreground">{m.packaging}</p>
                </div>
                <div className="p-4 md:p-5">
                  <p className="font-semibold text-sm text-primary mb-2">
                    ✈️ Shipping
                  </p>
                  <p className="text-sm text-muted-foreground">{m.shipping}</p>
                </div>
                <div className="p-4 md:p-5">
                  <p className="font-semibold text-sm text-primary mb-2">
                    📊 Bulk Process
                  </p>
                  <p className="text-sm text-muted-foreground">{m.bulk}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-primary/10 border-y border-primary/20 py-10 md:py-12 px-4">
          <div className="container text-center">
            <h2 className="font-serif text-xl md:text-2xl font-bold mb-3">
              Don't see your country?
            </h2>
            <p className="text-muted-foreground mb-6 text-sm md:text-base">
              We ship to 50+ countries. Contact us for custom shipping
              arrangements or browse our{" "}
              <Link to="/products" className="text-primary hover:underline">
                full product range
              </Link>
              .
            </p>
            <Button
              asChild
              className="bg-primary text-primary-foreground w-full sm:w-auto min-h-[44px] px-8"
            >
              <Link to="/contact">Get Shipping Quote</Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
