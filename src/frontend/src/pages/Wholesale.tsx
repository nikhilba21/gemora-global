import api from '../lib/api';
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import BulkOrderCalculator from "../components/BulkOrderCalculator";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import CatalogueDownloadSection from "../components/CatalogueDownloadSection";
import { usePageContent } from "../hooks/usePageContent";
import { usePageSEO } from "../hooks/usePageSEO";
import type { Category, Product } from "../types";

const FAQ_ITEMS = [
  {
    q: "What is the minimum order quantity (MOQ) for wholesale imitation jewellery?",
    a: "Our standard MOQ is 50 units per design for most product categories including Earrings, Necklaces, Bangles, Bridal Sets, Pendant Sets, Maang Tikka, Finger Rings, and Anklets. For mixed assortments across multiple designs, the minimum is 50 units per design style. Custom OEM and private label orders have an MOQ of 500 units.",
  },
  {
    q: "What payment methods do you accept for wholesale orders?",
    a: "We accept bank transfer (TT/Wire Transfer) for all order sizes, PayPal for smaller orders, Letter of Credit (LC) for large export shipments above USD 5,000, and Western Union for orders from certain markets. Standard payment terms are 30% advance with order confirmation and 70% before shipment.",
  },
  {
    q: "How long does it take to ship a wholesale order internationally?",
    a: "For in-stock designs, standard processing time is 5–7 business days. Express shipping via DHL, FedEx, or UPS takes 3–5 business days to USA, UK, UAE, Canada, Australia, and Singapore. Sea freight for large bulk orders takes 15–25 days depending on destination. Custom design orders require 21–28 business days production time before shipping.",
  },
  {
    q: "Do you provide custom packaging and private label services?",
    a: "Yes. Custom packaging with your brand name, logo, and barcode stickers is available for orders of 500+ units. We also offer full OEM and private label jewellery manufacturing — you can send your own designs or select from our catalogue for customisation under your brand. Lead time for private label is 3–4 weeks from design approval.",
  },
  {
    q: "Can I request product samples before placing a bulk wholesale order?",
    a: "Yes, we welcome sample orders from first-time wholesale buyers. Samples are available for most product categories at standard retail pricing. Sampling allows you to verify quality, plating finish, stone setting, and size before committing to bulk production. Once you confirm with a bulk order, sample costs can be adjusted against the main order value.",
  },
  {
    q: "What jewellery categories are available for wholesale export?",
    a: "We offer a complete range: Earrings (Jhumka, Chandbali, Stud, Hoop), Necklaces (Choker, Pendant Set, Mala), Bangles and Bracelets, Maang Tikka, Bridal Sets, Finger Rings, Nose Rings, Payal and Anklets, Mangalsutra, Tikka, Hair Accessories, and more. All in multiple styles including Kundan, Meenakari, Temple, Oxidised, American Diamond (CZ), Bollywood, and Indo Western.",
  },
];

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Inquiry",
    desc: "Share your requirements via WhatsApp, email, or our contact form with product type, quantity, and target market.",
  },
  {
    step: "02",
    title: "Catalogue & Samples",
    desc: "Receive our latest digital catalogue. Request samples if needed to verify quality before bulk commitment.",
  },
  {
    step: "03",
    title: "Order Confirmation",
    desc: "Confirm designs, quantities, plating options, packaging requirements, and delivery timeline.",
  },
  {
    step: "04",
    title: "Production",
    desc: "Your order enters production with regular WhatsApp/email updates at key milestones.",
  },
  {
    step: "05",
    title: "Quality Check",
    desc: "Every piece inspected — metal finish, stone security, plating uniformity, anti-tarnish coating — before packing.",
  },
  {
    step: "06",
    title: "Dispatch & Tracking",
    desc: "Packed in export-grade packaging. Tracking details, commercial invoice, and packing list shared immediately.",
  },
];

const PRODUCT_WHOLESALE = [
  {
    name: "Kundan Jewellery",
    styles: "Necklace Sets, Earrings, Maang Tikka, Bridal Sets",
    markets: "UAE, USA, UK, France",
  },
  {
    name: "Temple Jewellery",
    styles: "Necklace, Earrings, Bangles, Anklets",
    markets: "Singapore, Malaysia, Sri Lanka, UK",
  },
  {
    name: "Oxidised Jewellery",
    styles: "Jhumka, Bangles, Necklace, Rings",
    markets: "USA, UK, Australia, Canada",
  },
  {
    name: "American Diamond (CZ)",
    styles: "Pendant Sets, Earrings, Rings, Bangles",
    markets: "USA, UK, UAE, Australia",
  },
  {
    name: "Meenakari Jewellery",
    styles: "Necklace, Earrings, Bangles, Tikka",
    markets: "UAE, UK, France, Saudi Arabia",
  },
  {
    name: "Bridal Sets",
    styles: "Full Bridal Sets, Necklace + Earring Sets, Hath Pan",
    markets: "USA, UK, UAE, Canada, Malaysia",
  },
  {
    name: "Bollywood / Fashion",
    styles: "Layered Chains, Choker, Tassel Earrings",
    markets: "USA, UK, France, Nigeria",
  },
  {
    name: "Indo Western",
    styles: "Minimal Necklace, Delicate Earrings, Stackable Rings",
    markets: "Australia, Canada, Singapore, Germany",
  },
];

export default function Wholesale() {
  const { content: pageContent } = usePageContent("wholesale");

  const { data: productsData } = useQuery({
    queryKey: ["products-wholesale"],
    queryFn: () => api.getProducts({page:'0',pageSize:'2000'}),
    enabled: true,
  });
  const products = productsData?.items ?? [];

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => api.getCategories(),
    enabled: true,
  });

  usePageSEO({
    title:
      "Wholesale Imitation Jewellery India — Factory Direct B2B Supplier | Gemora Global",
    description:
      "Wholesale imitation jewellery from Jaipur, India. MOQ 50 units, factory-direct prices, anti-tarnish quality. Kundan, Bridal, Oxidised & 500+ designs. Export to 20+ countries.",
    canonical: "https://www.gemoraglobal.co/wholesale",
    ogTitle:
      "Wholesale Imitation Jewellery India — MOQ & Pricing | Gemora Global",
    ogDescription:
      "Factory-direct wholesale imitation jewellery supplier from India. MOQ 50 units. Anti-tarnish finish. Shipping to 20+ countries.",
    ogImage: "https://www.gemoraglobal.co/images/og-banner.jpg",
    faqItems: FAQ_ITEMS,
    breadcrumbs: [
      { name: "Home", url: "https://www.gemoraglobal.co/" },
      {
        name: "Wholesale",
        url: "https://www.gemoraglobal.co/wholesale",
      },
    ],
    schema: {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Wholesale Imitation Jewellery Export — Factory Direct B2B Supply",
      provider: {
        "@type": "Organization",
        name: "Gemora Global",
        url: "https://www.gemoraglobal.co",
      },
      description:
        "Factory-direct wholesale imitation jewellery supplier from Jaipur, India. MOQ 50 units per design. Kundan, Bridal, Oxidised, Temple, Meenakari & Fashion jewellery. Export to USA, UK, UAE, France, Canada, Australia, Singapore, Malaysia, Saudi Arabia.",
      areaServed: [
        "UAE",
        "France",
        "USA",
        "UK",
        "Germany",
        "Canada",
        "Australia",
        "Singapore",
        "Malaysia",
        "Saudi Arabia",
        "Nigeria",
        "Sri Lanka",
        "Kuwait",
      ],
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "USD",
        lowPrice: "1.50",
        highPrice: "25.00",
        offerCount: "500",
      },
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Hero */}
        <div
          className="py-12 md:py-20 text-center relative px-4"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.10 0.015 285) 0%, oklch(0.18 0.02 285) 50%, oklch(0.12 0.01 285) 100%)",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 50%, oklch(0.78 0.12 75 / 0.07) 0%, transparent 60%)",
            }}
          />
          <div className="container relative z-10">
            <p
              className="text-xs uppercase tracking-widest mb-3 font-semibold"
              style={{ color: "#D4AF37" }}
            >
              Factory Direct · MOQ 50 Units · 20+ Countries
            </p>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-5xl font-bold mb-4 leading-tight">
              {pageContent.page_title ||
                "Wholesale Imitation Jewellery India —"}{" "}
              <br className="hidden md:block" />{" "}
              {pageContent.page_title ? "" : "Factory Direct B2B Supplier"}
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mb-8">
              {pageContent.intro_text ||
                "Partner with Jaipur\u2019s most trusted wholesale imitation jewellery manufacturer and exporter. 500+ designs in Kundan, Bridal, Oxidised, Temple, Meenakari, American Diamond, Bollywood, and Indo Western styles."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 w-full sm:w-auto min-h-[48px]"
                data-ocid="wholesale.inquiry_button"
              >
                <Link to="/contact">Start Wholesale Inquiry</Link>
              </Button>
              <a
                href="https://wa.me/917976341419?text=Hi%20Gemora%20Global%2C%20I%20want%20wholesale%20imitation%20jewellery%20from%20India"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-base font-medium transition-colors w-full sm:w-auto min-h-[48px]"
                data-ocid="wholesale.whatsapp_button"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 fill-white flex-shrink-0"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp Inquiry
              </a>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-white/40 text-white hover:bg-white/10 px-8 w-full sm:w-auto min-h-[48px]"
                data-ocid="wholesale.catalogue_button"
              >
                <Link to="/gallery">View Catalogue</Link>
              </Button>
            </div>
            {/* Trust stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto text-center">
              {[
                { value: "50 Units", label: "Minimum MOQ" },
                { value: "500+", label: "Designs Available" },
                { value: "20+", label: "Export Countries" },
                { value: "2011", label: "Established" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-white/5 border border-white/10 rounded-lg p-3"
                >
                  <div
                    className="font-serif text-lg font-bold"
                    style={{ color: "#D4AF37" }}
                  >
                    {s.value}
                  </div>
                  <div className="text-xs text-white/60 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing Structure */}
        <section className="container py-10 md:py-16 px-4">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="font-serif text-2xl md:text-4xl font-bold mb-3">
              Wholesale Pricing Structure
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
              Gemora Global operates a fully transparent tiered wholesale
              pricing model. The more you order, the better your unit price —
              directly from our Jaipur factory with no middlemen markup. All
              prices are factory-direct and inclusive of anti-tarnish coating
              and export-grade packaging.
            </p>
          </div>
          <div className="max-w-3xl mx-auto overflow-x-auto">
            <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
              <thead>
                <tr style={{ background: "#1A237E" }}>
                  <th className="px-4 py-3 text-left font-semibold text-white">
                    Order Quantity
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-white">
                    Price Tier
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-white">
                    Discount
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-white">
                    Includes
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    qty: "50 – 100 units",
                    tier: "Base Wholesale Price",
                    discount: "—",
                    includes: "Anti-tarnish coating, poly bag packing",
                    highlight: false,
                  },
                  {
                    qty: "101 – 500 units",
                    tier: "Bulk Tier 1",
                    discount: "10% off",
                    includes: "Anti-tarnish packing + mixed assortment option",
                    highlight: false,
                  },
                  {
                    qty: "501 – 1,000 units",
                    tier: "Bulk Tier 2",
                    discount: "20% off",
                    includes: "Custom size option + priority production slot",
                    highlight: true,
                  },
                  {
                    qty: "1,000+ units",
                    tier: "Premium / OEM",
                    discount: "Negotiable",
                    includes:
                      "Custom packaging, private label, dedicated export manager",
                    highlight: false,
                  },
                ].map((row) => (
                  <tr
                    key={row.qty}
                    className="border-t border-border"
                    style={
                      row.highlight
                        ? { background: "rgba(212,175,55,0.06)" }
                        : undefined
                    }
                  >
                    <td className="px-4 py-3 font-medium">{row.qty}</td>
                    <td className="px-4 py-3 text-center text-muted-foreground">
                      {row.tier}
                    </td>
                    <td
                      className="px-4 py-3 text-center font-semibold"
                      style={{ color: "#D4AF37" }}
                    >
                      {row.discount}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {row.includes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-4">
            * Prices vary by product category. Contact our team for
            category-specific wholesale price list.{" "}
            <a
              href="https://wa.me/917976341419"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Request price list via WhatsApp →
            </a>
          </p>
        </section>
        
        {/* Digital Catalogues Section */}
        <section className="container py-10 md:py-16 px-4 border-t border-border">
          <div className="text-center mb-10">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-3">
              Download Digital Catalogues
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
              Get instant access to our latest collections in PDF format. Browse through 500+ designs with high-resolution photography, specifications, and wholesale pricing guidance.
            </p>
          </div>
          <div className="max-w-5xl mx-auto">
            <CatalogueDownloadSection limit={3} />
          </div>
        </section>


        {/* Bulk Order Calculator */}
        <section className="bg-muted/30 border-y border-border py-10 md:py-16 px-4">
          <div className="container">
            <div className="text-center mb-8">
              <h2 className="font-serif text-2xl md:text-3xl font-bold mb-3">
                Calculate Your Order
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
                Enter your quantity to see bulk pricing tiers, savings, and
                estimated total — then send a quote directly via WhatsApp to our
                wholesale team.
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              <BulkOrderCalculator
                products={products ?? []}
                categories={categories}
              />
            </div>
          </div>
        </section>

        {/* Product Range */}
        <section className="container py-10 md:py-16 px-4">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="font-serif text-2xl md:text-4xl font-bold mb-3">
              Our Wholesale Product Range
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
              We manufacture over 500 wholesale jewellery designs across all
              major categories. Every product is available in multiple plating
              options (Gold, Matte Gold, Rhodium, Rose Gold, Oxidised, Black,
              Mehndi, 2-Tone, 3-Tone) and can be ordered with custom packaging
              for your brand. Browse our{" "}
              <Link to="/products" className="text-primary hover:underline">
                full product catalogue
              </Link>{" "}
              or view the{" "}
              <Link to="/gallery" className="text-primary hover:underline">
                image gallery
              </Link>{" "}
              for product photography.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRODUCT_WHOLESALE.map((p) => (
              <div
                key={p.name}
                className="bg-card border border-border rounded-xl p-4 md:p-5"
              >
                <h3
                  className="font-semibold text-sm md:text-base mb-2"
                  style={{ color: "#D4AF37" }}
                >
                  {p.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
                  {p.styles}
                </p>
                <p
                  className="text-xs font-medium"
                  style={{ color: "rgba(212,175,55,0.7)" }}
                >
                  Popular in: {p.markets}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* MOQ + Payment */}
        <section className="bg-card border-y border-border py-10 md:py-16 px-4">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
              <div>
                <h2 className="font-serif text-xl md:text-3xl font-bold mb-4 text-primary">
                  Minimum Order Quantity (MOQ) Details
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4 text-sm md:text-base">
                  Our MOQ structure is designed to be accessible for boutiques,
                  online sellers, and small distributors as well as large
                  wholesale importers. Standard MOQ is{" "}
                  <strong>50 units per design</strong> for all product
                  categories including Earrings, Necklaces, Bangles, Bridal
                  Sets,{" "}
                  <Link
                    to="/kundan-jewellery-wholesale"
                    className="text-primary hover:underline"
                  >
                    Kundan Jewellery
                  </Link>
                  ,{" "}
                  <Link
                    to="/temple-jewellery-manufacturer"
                    className="text-primary hover:underline"
                  >
                    Temple Jewellery
                  </Link>
                  , and{" "}
                  <Link
                    to="/oxidised-jewellery-wholesale"
                    className="text-primary hover:underline"
                  >
                    Oxidised Jewellery
                  </Link>
                  . Mixed assortments can be combined to meet MOQ across
                  different designs within the same product category. For{" "}
                  <Link
                    to="/custom-jewellery-manufacturer"
                    className="text-primary hover:underline"
                  >
                    custom and OEM jewellery manufacturing
                  </Link>
                  , MOQ is 500 units with a 3–4 week production lead time.
                </p>
                <div className="grid grid-cols-2 gap-3 mt-4 md:mt-6">
                  {[
                    { label: "Standard MOQ", value: "50 units/design" },
                    { label: "OEM/Custom MOQ", value: "500 units" },
                    { label: "Custom Lead Time", value: "3–4 weeks" },
                    { label: "Export Countries", value: "20+ served" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-background border border-border rounded-lg p-3 md:p-4 text-center"
                    >
                      <div className="font-bold text-primary text-base md:text-lg">
                        {stat.value}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="font-serif text-xl md:text-3xl font-bold mb-4 text-primary">
                  Payment Terms &amp; Methods
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4 text-sm md:text-base">
                  We offer multiple payment options to accommodate wholesale
                  buyers from every market. All payments are processed securely.
                  For first-time buyers, we recommend bank transfer (TT) for
                  full transaction security. Standard terms are 30% advance with
                  order confirmation and 70% balance before shipment dispatch.
                </p>
                <ul className="space-y-3 mb-6">
                  {[
                    {
                      method: "Bank Transfer (TT / Wire)",
                      detail:
                        "Available for all order sizes. Most common method for international wholesale buyers.",
                    },
                    {
                      method: "Letter of Credit (LC)",
                      detail:
                        "Available for large export shipments above USD 5,000. Provides full buyer protection.",
                    },
                    {
                      method: "PayPal",
                      detail:
                        "Available for smaller trial and sample orders. Subject to PayPal fees.",
                    },
                    {
                      method: "Western Union / MoneyGram",
                      detail:
                        "Available for certain markets including Africa and Middle East.",
                    },
                  ].map((p) => (
                    <li
                      key={p.method}
                      className="flex items-start gap-2 text-sm"
                    >
                      <span className="text-primary flex-shrink-0 mt-0.5 font-bold">
                        ✓
                      </span>
                      <div>
                        <span className="font-semibold">{p.method}</span>
                        <p className="text-muted-foreground text-xs mt-0.5">
                          {p.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-xs text-muted-foreground">
                  <strong className="text-foreground">Standard Terms:</strong>{" "}
                  30% advance with order confirmation. 70% balance before
                  shipment. For trusted repeat buyers, deferred payment terms
                  may be available upon discussion.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Shipping & Packaging */}
        <section className="container py-10 md:py-16 px-4">
          <div className="text-center mb-8">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-3">
              Shipping &amp; Packaging for Wholesale
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
              We understand that proper packaging and reliable shipping are
              critical for wholesale importers. Every Gemora Global shipment is
              packed to international export standards and shipped via trusted
              carriers with full tracking and documentation.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="bg-card border border-border rounded-xl p-6 md:p-8">
              <h3 className="font-serif text-xl font-bold mb-4 text-primary">
                Packaging Options
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {[
                  "Standard: Anti-tarnish poly bag per piece, bubble wrap inner, master carton",
                  "Custom branding: Your logo, brand name, barcode stickers (500+ units)",
                  "Premium box packing: Velvet or jewellery boxes available for retail-ready orders",
                  "Bulk packing: Mixed designs in master cartons with item labels for large shipments",
                ].map((p) => (
                  <li key={p} className="flex items-start gap-2">
                    <span className="text-primary font-bold flex-shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 md:p-8">
              <h3 className="font-serif text-xl font-bold mb-4 text-primary">
                Shipping &amp; Lead Times
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {[
                  "Express: DHL, FedEx, UPS — 3–5 business days to USA, UK, UAE, Canada, Australia",
                  "Standard: 7–10 business days for most international destinations",
                  "Sea freight: Available for bulk orders — 15–25 days depending on destination port",
                  "Production time: 5–7 business days (in-stock); 21–28 business days (custom designs)",
                  "All shipments include commercial invoice, packing list, and GST-compliant documents",
                ].map((p) => (
                  <li key={p} className="flex items-start gap-2">
                    <span className="text-primary font-bold flex-shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="bg-muted/20 border-y border-border py-10 md:py-16 px-4">
          <div className="container">
            <div className="text-center mb-8 md:mb-10">
              <h2 className="font-serif text-2xl md:text-4xl font-bold mb-3">
                How to Place a Wholesale Order
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
                Ordering from Gemora Global is straightforward. We operate on a
                fully factory-direct wholesale model — no middlemen, no trading
                company markups. Our process is designed to give B2B buyers
                complete visibility at every stage.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-0 sm:gap-4">
              {PROCESS_STEPS.map((s, idx) => (
                <div
                  key={s.step}
                  className="flex sm:flex-col items-start sm:items-center gap-4 sm:gap-0 sm:text-center py-4 sm:py-0 border-b sm:border-b-0 border-border last:border-b-0"
                >
                  <div className="flex flex-col items-center sm:block">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center flex-shrink-0 sm:mx-auto sm:mb-3">
                      <span className="text-primary font-bold text-sm">
                        {s.step}
                      </span>
                    </div>
                    {idx < PROCESS_STEPS.length - 1 && (
                      <div
                        className="w-0.5 h-6 bg-border sm:hidden mt-1"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">{s.title}</h4>
                    <p className="text-xs text-muted-foreground">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Custom & OEM */}
        <section className="container py-10 md:py-16 px-4">
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center">
              <div>
                <h2 className="font-serif text-xl md:text-2xl font-bold mb-4">
                  Custom &amp; OEM Jewellery Manufacturing
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  Gemora Global is a full-service{" "}
                  <Link
                    to="/custom-jewellery-manufacturer"
                    className="text-primary hover:underline"
                  >
                    custom jewellery manufacturer in India
                  </Link>
                  . Whether you have your own designs ready for production or
                  need our design team to develop exclusive pieces for your
                  brand, we deliver. Our OEM and{" "}
                  <Link
                    to="/private-label-jewellery-india"
                    className="text-primary hover:underline"
                  >
                    private label jewellery manufacturing
                  </Link>{" "}
                  service includes full branding — custom packaging, logo
                  stamps, branded poly bags, barcode stickers, and garment tags
                  — making it easy to launch or expand your own jewellery brand
                  using Indian manufacturing expertise.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {[
                    "Custom design development from sketches, reference images, or product briefs",
                    "Private label packaging — your brand name, logo, and colours",
                    "OEM manufacturing for established jewellery brands and department stores",
                    "Design exclusivity agreements available for qualifying wholesale buyers",
                    "MOQ 500 units for custom designs · 3–4 week production lead time",
                  ].map((p) => (
                    <li key={p} className="flex items-start gap-2">
                      <span className="text-primary flex-shrink-0 font-bold mt-0.5">
                        ✓
                      </span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                {[
                  {
                    icon: "🎨",
                    title: "Design Development",
                    desc: "Our in-house design team can develop exclusive jewellery collections based on your mood board, trend direction, or specific market requirements.",
                  },
                  {
                    icon: "🏷️",
                    title: "Private Label Services",
                    desc: "Full private label setup including branded poly bags, velvet pouches, jewellery boxes with your logo, barcode stickers, and custom tags.",
                  },
                  {
                    icon: "🌍",
                    title: "Global Export Compliance",
                    desc: "We handle all export documentation including certificate of origin, commercial invoice, and compliance certificates required for USA, UK, EU, and UAE import regulations.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 bg-card border border-border rounded-lg p-4"
                  >
                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Global Reach */}
        <section className="container py-6 md:py-8 px-4">
          <div className="text-center mb-8">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-3">
              We Ship Wholesale Jewellery Worldwide
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Trusted by wholesale buyers in 20+ countries across 5 continents
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 md:gap-5">
            {[
              {
                flag: "🇫🇷",
                country: "France",
                to: "/export-imitation-jewellery-france",
              },
              {
                flag: "🇦🇪",
                country: "UAE",
                to: "/imitation-jewellery-supplier-uae",
              },
              {
                flag: "🇺🇸",
                country: "USA",
                to: "/imitation-jewellery-supplier-usa",
              },
              { flag: "🇬🇧", country: "UK", to: "/wholesale-jewellery-uk" },
              {
                flag: "🇩🇪",
                country: "Germany",
                to: "/export-imitation-jewellery-germany-eu",
              },
              {
                flag: "🇨🇦",
                country: "Canada",
                to: "/export-imitation-jewellery-canada",
              },
              {
                flag: "🇦🇺",
                country: "Australia",
                to: "/export-indian-fashion-jewellery-australia",
              },
              {
                flag: "🇸🇬",
                country: "Singapore",
                to: "/export-imitation-jewellery-singapore",
              },
              { flag: "🇲🇾", country: "Malaysia", to: "/global-markets" },
              { flag: "🇸🇦", country: "Saudi Arabia", to: "/global-markets" },
              { flag: "🇳🇬", country: "Nigeria", to: "/global-markets" },
              { flag: "🌍", country: "More", to: "/global-markets" },
            ].map((m) => (
              <Link
                key={m.country}
                to={m.to}
                className="flex flex-col items-center gap-1 md:gap-2 bg-card border border-border rounded-lg p-3 md:p-4 min-w-[64px] md:min-w-[80px] hover:border-primary/40 transition-colors"
              >
                <span className="text-2xl md:text-3xl">{m.flag}</span>
                <span className="text-xs font-medium text-muted-foreground">
                  {m.country}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-muted/20 border-y border-border py-10 md:py-16 px-4 faq-section">
          <div className="container">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-8 text-center text-primary">
              Wholesale FAQ — Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {FAQ_ITEMS.map((faq) => (
                <div
                  key={faq.q}
                  className="bg-card border border-border rounded-lg p-5 md:p-6"
                >
                  <h3 className="font-semibold text-sm md:text-base mb-2">
                    {faq.q}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary/10 border-y border-primary/20 py-12 md:py-16 px-4">
          <div className="container text-center">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">
              Ready to Place a Wholesale Order?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8 text-sm md:text-base">
              Contact our export team today. We respond to all wholesale
              inquiries within 24 hours. WhatsApp for fastest response — our
              team is available Monday–Saturday, 9am–6pm IST.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 w-full sm:w-auto min-h-[48px]"
                data-ocid="wholesale.cta_primary_button"
              >
                <Link to="/contact">Send Wholesale Inquiry</Link>
              </Button>
              <a
                href="https://wa.me/917976341419?text=Hi%2C%20I%20want%20wholesale%20imitation%20jewellery%20from%20Gemora%20Global"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto min-h-[48px]"
                data-ocid="wholesale.cta_whatsapp_button"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 fill-white flex-shrink-0"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp Us
              </a>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
