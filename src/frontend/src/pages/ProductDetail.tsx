import api from "../lib/api";
import type { Product } from "../lib/api";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BulkOrderCalculator from "../components/BulkOrderCalculator";
import { usePageSEO } from "../hooks/usePageSEO";
import { useState } from "react";
import {
  Share2,
  Package,
  Phone,
  ChevronRight,
  Plus,
  Send,
  BookOpen,
  Factory,
  Globe,
  ShieldCheck,
} from "lucide-react";

const WA_NUMBER = "917976341419";

function parseKeyFeatures(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(/[|,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseDescription(raw: string): { intro: string; specs: { key: string; value: string }[] } {
  if (!raw) return { intro: "", specs: [] };
  const lines = raw.split(/[|\n]/).map((s) => s.trim()).filter(Boolean);
  const specRegex = /^(.+?)[=:]\s*(.+)$/;
  const specs: { key: string; value: string }[] = [];
  const introLines: string[] = [];
  for (const line of lines) {
    const m = specRegex.exec(line);
    if (m) specs.push({ key: m[1].trim(), value: m[2].trim() });
    else introLines.push(line);
  }
  return { intro: introLines.join(" "), specs };
}

function buildSpecs(product: Product): { key: string; value: string }[] {
  const specs: { key: string; value: string }[] = [];
  if (product.color) specs.push({ key: "Metal / Finish", value: product.color });
  const { specs: descSpecs } = parseDescription(product.description || "");
  for (const s of descSpecs) {
    if (!specs.find((x) => x.key.toLowerCase() === s.key.toLowerCase())) specs.push(s);
  }
  if (product.subcategory) specs.push({ key: "Style", value: product.subcategory });
  specs.push({ key: "Shipping", value: "Worldwide — 7–14 days" });
  specs.push({ key: "Origin", value: "Jaipur, Rajasthan, India" });
  return specs;
}

function WAIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function ProductSeoContent({ product }: { product: any }) {
  if (!product) return null;

  const sub = product.subcategory || "Fashion Jewellery";
  const name = product.name;

  return (
    <section className="mt-12 md:mt-16 border-t border-border pt-10 space-y-8">
      <div>
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground mb-4">
          Premium Wholesaler Insights & Material Quality
        </h2>
        <div className="grid md:grid-cols-2 gap-6 lg:gap-10 text-sm leading-relaxed text-muted-foreground">
          <div className="space-y-4">
            <p>
              Sourcing the exquisite <strong>{name}</strong> directly from our state-of-the-art Jaipur manufacturing workshop guarantees your retail store or online boutique accesses the absolute highest tier of craftsmanship. Every piece in our <strong>{sub}</strong> catalog is built using a premium brass or copper alloy base core, hand-crafted by veteran Karigars (artisans) who specialize in heritage glass-setting, Kundan inlay work, and micro-claw diamond placements.
            </p>
            <p>
              To ensure global export compliance and maximum customer satisfaction, our workshop applies a proprietary, three-stage anti-tarnish micro-coating. This shields the precious plating—whether it be 18k yellow gold, protective rhodium, or rustic oxidized silver—from immediate environmental wear, preserving the initial luster and sparkle for years to come.
            </p>
          </div>
          <div className="space-y-4">
            <p>
              <strong>Professional Styling Recommendations:</strong> The elegant design profile of the {name} offers unparalleled versatility. For high-end bridal or festive retail selections, we suggest pairing these {sub} creations with deep-cut necklines, silk sarees, or embroidered designer lehengas. For modern everyday collections, its clean silhouette complements minimalist contemporary apparel, corporate suits, and evening cocktail wear seamlessly.
            </p>
            <p>
              <strong>Direct Wholesaler Benefits:</strong> By purchasing directly from Gemora Global, you cut out all secondary middlemen markups, saving between 40% and 60% on B2B import margins. We offer complete custom brand labeling, customized plating thicknesses (up to 2.0 microns), and strict quality inspections before DHL or FedEx Express shipment dispatch.
            </p>
          </div>
        </div>
      </div>

      {/* Accordion FAQ Section */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground">
            Frequently Asked B2B Questions
          </h3>
        </div>
        <div className="space-y-3">
          <details className="group border border-border rounded-xl p-4 bg-card/50 backdrop-blur-sm cursor-pointer transition-all duration-200 open:bg-card">
            <summary className="flex justify-between items-center font-semibold text-sm sm:text-base text-foreground list-none">
              <span>What is the minimum order quantity (MOQ) for {name}?</span>
              <span className="text-primary transition-transform duration-200 group-open:rotate-180">
                <ChevronRight className="w-5 h-5 flex-shrink-0" />
              </span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed cursor-default">
              Our standard MOQ for the {name} is {product.moq || "50 units per design"}. This lower entry threshold is engineered to allow boutique owners, boutique start-ups, and online sellers to diversify their product collections without tying up capital in excessive inventory.
            </p>
          </details>

          <details className="group border border-border rounded-xl p-4 bg-card/50 backdrop-blur-sm cursor-pointer transition-all duration-200 open:bg-card">
            <summary className="flex justify-between items-center font-semibold text-sm sm:text-base text-foreground list-none">
              <span>Does this jewelry have an anti-tarnish micro-plating finish?</span>
              <span className="text-primary transition-transform duration-200 group-open:rotate-180">
                <ChevronRight className="w-5 h-5 flex-shrink-0" />
              </span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed cursor-default">
              Yes, absolutely. Gemora Global products undergo a rigorous 3-step quality assurance process, concluding with a proprietary anti-tarnish vacuum micro-coating. This coating protects the underlying precious metal plating. To ensure long-lasting durability, we recommend avoiding exposure to strong chemicals, liquid perfumes, and direct water contact.
            </p>
          </details>

          <details className="group border border-border rounded-xl p-4 bg-card/50 backdrop-blur-sm cursor-pointer transition-all duration-200 open:bg-card">
            <summary className="flex justify-between items-center font-semibold text-sm sm:text-base text-foreground list-none">
              <span>How do you handle B2B shipping and import customs documentation?</span>
              <span className="text-primary transition-transform duration-200 group-open:rotate-180">
                <ChevronRight className="w-5 h-5 flex-shrink-0" />
              </span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed cursor-default">
              We ship door-to-door globally via premium express couriers like DHL Express and FedEx, delivering to destinations in the USA, UK, Europe, Australia, and UAE within 5 to 7 business days. We prepare and supply all critical trade documents, including the Commercial Invoice, detailed Packing List, and Certificate of Origin (COO), guaranteeing a frictionless customs clearance process.
            </p>
          </details>
        </div>
      </div>
    </section>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const [activeImg, setActiveImg] = useState(0);
  const [copied, setCopied] = useState(false);

  const { data: product, isLoading, isSuccess } = useQuery<Product>({
    queryKey: ["product", id],
    queryFn: () => api.getProduct(id as string),
    enabled: !!id,
  });

  const { data: allProductsData } = useQuery({
    queryKey: ["products", null],
    queryFn: () => api.getProducts({ page: "0", pageSize: "2000" }),
    enabled: true,
  });
  const allProducts: Product[] =
    (allProductsData as { items?: Product[] } | undefined)?.items ?? [];

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  const faqItems = product ? [
    {
      q: `What is the minimum order quantity (MOQ) for ${product.name}?`,
      a: `Our standard MOQ for ${product.name} is ${product.moq || "50 units per design"}. This lower entry threshold is engineered to allow boutique owners, start-ups, and online sellers to diversify their B2B collections safely.`
    },
    {
      q: `Does the ${product.name} have an anti-tarnish micro-plating finish?`,
      a: "Yes! All premium Gemora Global jewellery creations undergo a proprietary 3-step quality check, concluding with an advanced vacuum anti-tarnish micro-coating. This protects the 18k gold, rhodium, or oxidized silver finish from premature tarnishing."
    },
    {
      q: "How do you handle B2B shipping and customs documentation for international imports?",
      a: "We ship globally door-to-door via DHL Express and FedEx Express with delivery in 5 to 7 business days. We prepare and supply all critical trade documentation—including the detailed Commercial Invoice, Packing List, and Certificate of Origin (COO)—guaranteeing frictionless customs clearance."
    }
  ] : [];

  usePageSEO({
    title: product ? `${product.name} | Wholesale Imitation Jewellery | Gemora Global` : "Product Not Found | Gemora Global",
    description: product ? (`${product.name} wholesale from Jaipur, India. ${product.moq} MOQ. Anti-tarnish gold plating. Ideal for boutiques and distributors. Shipping worldwide.`).substring(0, 155) : "The product you are looking for does not exist on Gemora Global.",
    canonical: product ? `https://www.gemoraglobal.co/products/item/${product.id}` : undefined,
    robots: isLoading ? "index, follow" : (isSuccess && !product ? "noindex, follow" : "index, follow"),
    googlebot: isLoading ? undefined : (isSuccess && !product ? "noindex, follow" : undefined),
    ogImage: product?.imageUrls?.[0],
    product: product as any,
    faqItems,
    breadcrumbs: [
      { name: "Home", url: "https://www.gemoraglobal.co/" },
      { name: "Products", url: "https://www.gemoraglobal.co/products" },
      ...(product ? [{ name: product.name, url: `https://www.gemoraglobal.co/products/item/${product.id}` }] : []),
    ],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-10 grid md:grid-cols-2 gap-10">
          <div className="h-[500px] bg-muted rounded-2xl animate-pulse" />
          <div className="space-y-4 pt-4">
            <div className="h-4 w-48 bg-muted rounded animate-pulse" />
            <div className="h-8 w-full bg-muted rounded animate-pulse" />
            <div className="h-20 w-full bg-muted rounded animate-pulse" />
            <div className="h-16 w-full bg-muted rounded animate-pulse" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
        <Navbar />
        <main className="pt-24 pb-16 flex-grow flex items-center justify-center">
          <div className="container max-w-xl px-6 py-12 text-center space-y-6 bg-card/30 backdrop-blur-md rounded-2xl border border-border/50 shadow-xl">
            <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-4">
              <span className="text-2xl font-bold">404</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Product Not Found
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-sm mx-auto leading-relaxed">
              The wholesale jewellery piece you are looking for doesn't exist or is currently unavailable.
            </p>
            <div className="pt-4">
              <Link
                to="/products"
                className="inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold tracking-wide shadow-lg hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 min-h-[44px]"
              >
                Browse All Products
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const images = product.imageUrls?.length > 0 ? product.imageUrls : ["/placeholder.jpg"];
  const features = parseKeyFeatures(product.keyFeatures);
  const { intro } = parseDescription(product.description || "");
  const specs = buildSpecs(product);

  const waInquiry = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hi, I'm interested in ${product.name}${product.sku ? ` (SKU: ${product.sku})` : ""}. Please share more details.`)}`;
  const waSend = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hi GEMORA GLOBAL! I'd like to inquire about: ${product.name}${product.sku ? ` (SKU: ${product.sku})` : ""}. MOQ: ${product.moq || "Please advise"}.`)}`;

  const badges = [
    { icon: "🏭", label: "Manufacturer Direct" },
    { icon: "🌐", label: "Export to 50+ Countries" },
    { icon: "✅", label: "Anti-Tarnish Finish" },
    { icon: "📦", label: "Bulk Orders Welcome" },
  ];

  const trustCards = [
    { icon: <Factory className="w-6 h-6" style={{ color: "#1A237E" }} />, title: "Direct Manufacturer", desc: "No middlemen — buy direct from Jaipur factory. Best wholesale prices." },
    { icon: <Globe className="w-6 h-6" style={{ color: "#1A237E" }} />, title: "Global Export Ready", desc: "Export packaging, documentation and shipping to 50+ countries." },
    { icon: <ShieldCheck className="w-6 h-6" style={{ color: "#1A237E" }} />, title: "Quality Assured", desc: "Anti-tarnish finish, quality-checked before dispatch. Bulk samples available." },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="container py-6 md:py-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6 flex-wrap">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/products" className="hover:text-foreground transition-colors">Products</Link>
          {product.subcategory && (
            <>
              <ChevronRight className="w-3 h-3" />
              <span>{product.subcategory}</span>
            </>
          )}
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium truncate max-w-[180px]">{product.name}</span>
        </nav>

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">

          {/* LEFT: Images */}
          <div>
            <div className="relative rounded-2xl overflow-hidden bg-muted aspect-square md:aspect-[4/5] mb-3">
              <img src={images[activeImg]} alt={product.name} className="w-full h-full object-cover" loading="eager" />
              <button
                type="button"
                onClick={handleShare}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 border border-border flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                aria-label="Share product"
              >
                {copied ? <span className="text-green-600 text-xs font-bold">✓</span> : <Share2 className="w-4 h-4 text-foreground" />}
              </button>
              {product.isNewArrival && (
                <span className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ background: "#1A237E" }}>
                  New Arrival
                </span>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {images.map((img, i) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setActiveImg(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${i === activeImg ? "border-primary shadow-md" : "border-border hover:border-primary/50"}`}
                    aria-label={`View image ${i + 1}`}
                  >
                    <img src={img} alt={`Thumbnail ${i + 1} for ${product.name}`} className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}

            {/* Badges */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              {badges.map((b) => (
                <div key={b.label} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card text-xs font-medium">
                  <span>{b.icon}</span><span>{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Details */}
          <div className="flex flex-col gap-5">
            {product.subcategory && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full w-fit" style={{ background: "#e8eaf6", color: "#1A237E" }}>
                {product.subcategory}
              </span>
            )}

            <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground leading-tight">
              {product.name}
            </h1>

            {/* MOQ card */}
            <div className="flex items-center gap-4 rounded-xl p-4 border" style={{ background: "#f5f7ff", borderColor: "#c5cae9" }}>
              <Package className="w-8 h-8 shrink-0" style={{ color: "#1A237E" }} />
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Minimum Order Quantity (MOQ)</p>
                <p className="font-bold text-xl" style={{ color: "#1A237E" }}>{product.moq || "Contact for pricing"}</p>
                <p className="text-xs text-muted-foreground">Contact us for pricing on larger quantities</p>
              </div>
            </div>

            {/* Description */}
            {intro && (
              <p className="text-sm text-muted-foreground leading-relaxed">{intro}</p>
            )}

            {/* Specs table */}
            {specs.length > 0 && (
              <div className="rounded-xl overflow-hidden border border-border">
                <table className="w-full text-sm">
                  <tbody>
                    {specs.map((s, i) => (
                      <tr key={s.key} className={i % 2 === 0 ? "bg-muted/30" : "bg-background"}>
                        <td className="px-4 py-2.5 font-medium text-muted-foreground w-2/5" style={{ color: "#888" }}>{s.key}</td>
                        <td className="px-4 py-2.5 font-semibold text-foreground">
                          {s.key === "Origin" && s.value.includes("Jaipur") ? (
                            <Link to="/imitation-jewellery-manufacturer-jaipur" className="text-primary hover:underline">
                              {s.value}
                            </Link>
                          ) : s.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Key Features */}
            {features.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Key Features</p>
                <div className="flex flex-wrap gap-2">
                  {features.map((f) => (
                    <span key={f} className="text-xs px-2.5 py-1 rounded-full border font-medium" style={{ background: "#e8f5e9", borderColor: "#c8e6c9", color: "#1B5E20" }}>
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col gap-2.5">
              <a href={waInquiry} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ background: "#25D366" }} data-ocid="product.whatsapp_inquiry">
                <WAIcon className="w-5 h-5" /> WhatsApp Inquiry
              </a>

              <div className="grid grid-cols-2 gap-2">
                <button type="button"
                  className="flex items-center justify-center gap-1.5 py-3 rounded-xl font-semibold text-sm border-2 transition-all hover:bg-primary/5"
                  style={{ borderColor: "#1A237E", color: "#1A237E" }}
                  onClick={() => window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hi, I'd like to add ${product.name} to my quote.`)}`, "_blank")}
                  data-ocid="product.add_to_quote">
                  <Plus className="w-4 h-4" /> Add to Quote
                </button>
                <button type="button"
                  className="flex items-center justify-center gap-1.5 py-3 rounded-xl font-semibold text-sm border border-border transition-all hover:bg-muted/50"
                  onClick={() => window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hi, I'd like to request a sample of ${product.name}.`)}`, "_blank")}
                  data-ocid="product.request_sample">
                  <Package className="w-4 h-4" /> Request Sample
                </button>
              </div>

              <a href={waSend} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90"
                style={{ background: "#1A237E" }} data-ocid="product.send_inquiry">
                <Send className="w-4 h-4" /> Send Inquiry →
              </a>

              <Link to="/wholesale"
                className="flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm border border-border transition-all hover:bg-muted/50"
                data-ocid="product.get_catalogue">
                <BookOpen className="w-4 h-4" /> Get Catalogue
              </Link>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="w-4 h-4" />
              <a href="tel:+917976341419" className="hover:text-foreground transition-colors">+91 79763 41419</a>
              <span>— Call for bulk pricing</span>
            </div>
          </div>
        </div>

        {/* Product Specifications Section */}
        {specs.length > 0 && (
          <section className="mt-12 md:mt-16">
            <h2 className="font-serif text-xl font-bold text-foreground mb-6">Product Specifications</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-3">
              {specs.slice(0, 8).map((s) => (
                <div key={s.key}>
                  <span className="text-xs text-muted-foreground">{s.key}: </span>
                  <span className="text-sm font-semibold" style={{ color: "#E65100" }}>{s.value}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Trust Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 md:mt-14">
          {trustCards.map((c) => (
            <div key={c.title} className="rounded-2xl border border-border p-5 bg-card flex flex-col gap-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#e8eaf6" }}>
                {c.icon}
              </div>
              <p className="font-semibold text-sm text-foreground">{c.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>

        {/* Premium B2B Content & FAQ Accordions */}
        <ProductSeoContent product={product} />

        {/* Bulk Order Calculator */}
        <section className="mt-12 md:mt-16">
          <h2 className="font-serif text-xl font-bold text-foreground mb-6">Bulk Order Calculator</h2>
          <BulkOrderCalculator
            products={allProducts}
            initialProductId={product.id as unknown as bigint}
            compact={false}
          />
        </section>
        {/* ── Contextual SEO Interlinking ──────────────────────── */}
        <section className="mt-12 md:mt-16 border-t border-border pt-10">
          <h2 className="font-serif text-xl font-bold text-foreground mb-4">
            Explore More Wholesale Jewellery
          </h2>
          <p className="text-sm text-muted-foreground mb-5 leading-relaxed max-w-2xl">
            Gemora Global is a trusted{" "}
            <Link to="/imitation-jewellery-manufacturer-jaipur" className="text-primary hover:underline">
              imitation jewellery manufacturer in Jaipur
            </Link>{" "}
            supplying premium{" "}
            <Link to="/wholesale-imitation-jewellery-manufacturer-exporter-india" className="text-primary hover:underline">
              wholesale fashion jewellery
            </Link>{" "}
            to boutiques and distributors worldwide. Browse our popular categories:
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { label: "Kundan Jewellery Wholesale", to: "/kundan-jewellery-wholesale" },
              { label: "Bridal Jewellery Sets", to: "/bridal-jewellery-wholesale" },
              { label: "Oxidised Jewellery", to: "/oxidised-jewellery-wholesale" },
              { label: "Fashion Jewellery Exporter", to: "/fashion-jewellery-exporter" },
              { label: "Temple Jewellery", to: "/temple-jewellery-manufacturer" },
              { label: "American Diamond Jewellery", to: "/american-diamond-jewellery-wholesale" },
              { label: "Bulk Jewellery Supplier", to: "/bulk-jewellery-supplier" },
            ].map((cat) => (
              <Link
                key={cat.to}
                to={cat.to}
                className="inline-block text-xs font-medium px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 transition-colors"
              >
                {cat.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "🇺🇸 Supplier USA", to: "/imitation-jewellery-supplier-usa" },
              { label: "🇬🇧 Supplier UK", to: "/jewellery-supplier-uk" },
              { label: "🇦🇪 Exporter UAE", to: "/jewellery-exporter-uae" },
              { label: "🇦🇺 Exporter Australia", to: "/jewellery-exporter-australia" },
              { label: "🇨🇦 Exporter Canada", to: "/jewellery-exporter-canada" },
            ].map((c) => (
              <Link
                key={c.to}
                to={c.to}
                className="inline-block text-xs font-medium px-3 py-1.5 rounded-full border border-border bg-muted/50 text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
