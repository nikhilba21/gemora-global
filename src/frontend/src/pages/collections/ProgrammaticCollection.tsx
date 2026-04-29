import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { BASE_URL, usePageSEO } from "../../hooks/usePageSEO";

interface CollectionConfig {
  title: string;
  h1: string;
  desc: string;
  intro: string;
  body: string[];
  keywords: string[];
  whatsappMsg: string;
  icon: string;
}

const COLLECTION_MAP: Record<string, CollectionConfig> = {
  "minimalist-earrings": {
    title:
      "Minimalist Earrings Wholesale | Dainty Earring Supplier India | Gemora Global",
    h1: "Minimalist Earrings — Dainty & Clean Designs",
    desc: "Wholesale minimalist earrings from India — tiny studs, small hoops, geometric drops, and dainty ear pins. MOQ 50 pairs. Anti-tarnish. Export worldwide.",
    intro:
      "Wholesale minimalist earrings from Gemora Global. Clean, understated designs perfect for daily wear and aesthetic collections. MOQ 50 pairs, anti-tarnish finish.",
    body: [
      "Minimalist earrings are the cornerstone of modern fashion jewelry. Our wholesale minimalist earring range includes tiny stud earrings, small geometric hoops, delicate drop earrings, ear pins, and dainty bar earrings that complement any outfit without overpowering it.",
      "These lightweight pieces are bestsellers for online retailers, Instagram boutiques, and subscription jewelry boxes targeting Gen-Z and millennial buyers. Our minimalist earrings photograph beautifully against white and marble backgrounds — essential for social media-driven retail.",
      "All minimalist earrings feature anti-tarnish coating in gold, rhodium, or rose gold finish. MOQ starts at 50 pairs per design. Custom minimalist earring designs available from 500 pairs.",
    ],
    keywords: [
      "minimalist earrings wholesale",
      "dainty earrings supplier",
      "aesthetic earrings India",
      "tiny stud earrings wholesale",
    ],
    whatsappMsg:
      "Hi, I'm interested in minimalist earrings wholesale from Gemora Global",
    icon: "✨",
  },
  "party-wear-necklaces": {
    title:
      "Party Wear Necklaces Wholesale | Statement Necklace Supplier India | Gemora Global",
    h1: "Party Wear Necklaces — Bold Statement Styles",
    desc: "Wholesale party wear necklaces from India — Kundan sets, crystal statement necklaces, cocktail necklaces, bridal chokers. MOQ 50 pcs. Export UAE, UK, USA.",
    intro:
      "Wholesale party wear necklaces from Gemora Global. Bold Kundan sets, crystal statement pieces, and glamorous cocktail necklaces for boutiques globally.",
    body: [
      "Party wear necklaces are high-impact, high-value pieces that drive revenue for boutiques catering to event and occasion wear. Our wholesale collection includes heavy Kundan statement necklaces, crystal chandelier-style bibs, layered cocktail chokers, and complete bridal necklace sets.",
      "These pieces are top sellers in UAE, UK, USA, Canada, and Malaysia markets — particularly for South Asian diaspora boutiques supplying wedding season customers. The glamour factor makes them highly Instagrammable, driving organic social media exposure for your store.",
      "MOQ starts at 50 pieces per design. Complete sets (necklace + matching earrings) available with 25 sets MOQ. Gold plating, rhodium, and rose gold finishes available. Lead time 10–15 business days.",
    ],
    keywords: [
      "party wear necklaces wholesale",
      "statement necklaces India",
      "Kundan necklace wholesale",
      "crystal necklace supplier",
    ],
    whatsappMsg:
      "Hi, I'm interested in party wear necklaces wholesale from Gemora Global",
    icon: "💫",
  },
  "oxidised-rings": {
    title:
      "Oxidised Rings Wholesale | Antique Silver Rings Supplier India | Gemora Global",
    h1: "Oxidised Rings — Tribal & Antique Styles",
    desc: "Wholesale oxidised rings from India — tribal rings, antique silver adjustable rings, statement cocktail rings in oxidised finish. MOQ 50 pcs. Export UK, USA, Australia.",
    intro:
      "Wholesale oxidised rings from Gemora Global. Antique silver-tone tribal designs, adjustable bands, and statement rings in authentic oxidised finish.",
    body: [
      "Oxidised rings are a key part of any ethnic or boho fashion collection. Our wholesale oxidised ring range includes tribal statement rings, antique silver-tone floral rings, adjustable oxidised bands, multi-stone rings with dark metal settings, and traditional Indian finger rings.",
      "These designs are beloved by UK boho boutiques, USA festival fashion retailers, and Australian ethnic jewelry shops. The antique silver aesthetic transcends seasons and pairs beautifully with both ethnic and western outfits — making oxidised rings a reliable year-round seller.",
      "All oxidised rings feature stabilised plating with a protective topcoat. Available in adjustable and fixed sizes. MOQ 50 pieces per design. Combine with our oxidised earrings and bangles collection for a complete range.",
    ],
    keywords: [
      "oxidised rings wholesale India",
      "antique silver rings supplier",
      "tribal rings wholesale",
      "boho rings manufacturer",
    ],
    whatsappMsg:
      "Hi, I'm interested in oxidised rings wholesale from Gemora Global",
    icon: "⭕",
  },
  "korean-necklaces": {
    title:
      "Korean Necklaces Wholesale | K-Style Chain Necklaces India | Gemora Global",
    h1: "Korean-Style Necklaces — Layered Chain Aesthetic",
    desc: "Wholesale Korean-style chain necklaces from India — satellite chains, coin pendants, heart necklaces, layering sets. K-beauty aesthetic. MOQ 50 pcs. Export worldwide.",
    intro:
      "Wholesale Korean-style necklaces from Gemora Global. Satellite chains, heart pendants, coin charms, and layering sets inspired by K-beauty aesthetic.",
    body: [
      "Korean necklace styles are driving the global fashion jewelry market — and our wholesale K-style chain collection is specifically designed for boutiques and online retailers who want to capitalise on this trend. Our range includes satellite chain necklaces, coin pendant chokers, heart charm necklaces, star motif chains, and multi-layer layering sets.",
      "These designs are captured from K-pop idol styling, K-drama fashion, and South Korean social media influencers — ensuring your inventory reflects the authentic aesthetic buyers are searching for online. Thin, delicate, and layered is the signature Korean jewelry look.",
      "MOQ starts at 50 pieces per design. Monthly new designs added to keep inventory fresh. Gold and rhodium finishes. Combine with Korean earrings and rings for a complete K-aesthetic collection.",
    ],
    keywords: [
      "Korean necklaces wholesale",
      "K-style chain necklaces India",
      "satellite chain necklace wholesale",
      "aesthetic necklace supplier",
    ],
    whatsappMsg:
      "Hi, I'm interested in Korean style necklaces wholesale from Gemora Global",
    icon: "🌸",
  },
  "daily-wear-earrings": {
    title:
      "Daily Wear Earrings Wholesale | Lightweight Earring Supplier India | Gemora Global",
    h1: "Daily Wear Earrings — Lightweight & Comfortable",
    desc: "Wholesale daily wear earrings from India — lightweight studs, small hoops, simple drops for everyday use. Anti-tarnish, comfortable. MOQ 50 pairs. Export worldwide.",
    intro:
      "Wholesale daily wear earrings from Gemora Global. Lightweight studs, simple hoops, and comfortable drops for everyday use. MOQ 50 pairs.",
    body: [
      "Daily wear earrings are your highest-repeat-purchase jewelry category. Our wholesale range includes ultra-lightweight stud earrings, small hoop earrings, simple drop earrings, pearl-inspired studs, and delicate ear pins — all designed for comfortable all-day wear.",
      "We use specially lightweight alloy construction with secure butterfly backs to ensure comfort during extended wear. Anti-tarnish coating is optimised for daily contact with skin — essential for earrings that are worn hours every day. These pieces perform particularly well in humid markets like UAE and Singapore.",
      "MOQ 50 pairs per design. Available in gold, rhodium, and rose gold finish. Mix-and-match orders welcome across our daily wear and minimalist ranges to reach MOQ. Lead time 10–15 business days.",
    ],
    keywords: [
      "daily wear earrings wholesale India",
      "lightweight earrings supplier",
      "everyday earrings wholesale",
      "comfortable earrings manufacturer",
    ],
    whatsappMsg:
      "Hi, I'm interested in daily wear earrings wholesale from Gemora Global",
    icon: "☀️",
  },
  "statement-earrings": {
    title:
      "Statement Earrings Wholesale | Bold Fashion Earrings India | Gemora Global",
    h1: "Statement Earrings — Bold & Eye-Catching",
    desc: "Wholesale statement earrings from India — oversized hoops, chandbali, crystal danglers, large jhumkas. Bold fashion earrings. MOQ 50 pairs. Export UAE, UK, USA.",
    intro:
      "Wholesale statement earrings from Gemora Global. Oversized hoops, crystal danglers, chandbali, and bold fashion earrings. MOQ 50 pairs, global shipping.",
    body: [
      "Statement earrings are the fastest way to transform an outfit — and they're consistently among the highest-selling jewelry pieces for fashion boutiques worldwide. Our wholesale collection includes oversized geometric hoops, crystal chandelier earrings, large Kundan chandbali, tassel earrings, and dramatic cluster drops.",
      "Statement earrings are particularly strong sellers in UAE, where bold gold-tone jewelry is culturally valued for parties and special occasions. In UK and USA markets, they sell strongly in festival fashion and occasion wear boutiques. Our anti-tarnish coating ensures your customers' statement earrings retain their dramatic impact through a full evening.",
      "MOQ 50 pairs per design. Complete the look by pairing with our minimalist or daily wear pieces for a varied inventory. Gold and rhodium finishes available. Retail gift box packaging available on request.",
    ],
    keywords: [
      "statement earrings wholesale India",
      "bold earrings supplier",
      "oversized earrings manufacturer",
      "chandbali earrings wholesale",
    ],
    whatsappMsg:
      "Hi, I'm interested in statement earrings wholesale from Gemora Global",
    icon: "💎",
  },
  "gold-plated-jewelry": {
    title:
      "Gold Plated Jewelry Wholesale | Gold Plating Jewellery Supplier India | Gemora Global",
    h1: "Gold Plated Jewelry — Premium Wholesale from India",
    desc: "Wholesale gold plated jewelry from India — multi-layer gold plating, anti-tarnish finish, necklaces, earrings, bangles. MOQ 50 pcs. Export UAE, UK, USA, Europe.",
    intro:
      "Premium wholesale gold plated jewelry from Gemora Global. Multi-layer 22-carat gold plating, anti-tarnish finish, lasting quality for global markets.",
    body: [
      "Gold plated jewelry from Gemora Global uses a multi-layer electroplating process with 22-carat gold micro-coating over premium alloy base metals. Our gold plating is among the most durable available in the wholesale imitation jewelry market, with anti-tarnish treatment that keeps pieces looking freshly polished through regular wear.",
      "Gold plated jewelry is universally in demand — from UAE and Saudi Arabia where gold-tone is the dominant jewelry aesthetic, to South Asian boutiques in UK and USA that need affordable gold-look pieces for their customers. Our gold plated collection covers earrings, necklaces, bangles, rings, and complete sets.",
      "MOQ 50 pieces per design. Thickness of gold plating can be customised for premium orders. We also offer matte gold, rose gold, and 2-tone/3-tone plating variations. GST-compliant export invoices for all orders.",
    ],
    keywords: [
      "gold plated jewelry wholesale India",
      "22k gold plating jewellery supplier",
      "gold plated earrings wholesale",
      "gold jewellery manufacturer Jaipur",
    ],
    whatsappMsg:
      "Hi, I'm interested in gold plated jewelry wholesale from Gemora Global",
    icon: "✨",
  },
  "bridal-jewelry": {
    title:
      "Bridal Jewelry Wholesale | Wholesale Bridal Jewellery India | Gemora Global",
    h1: "Bridal Jewelry — Complete Wholesale Sets",
    desc: "Wholesale bridal jewelry from India — Kundan sets, Polki bridal sets, complete necklace earrings tikka bangles sets. MOQ 10 sets. Export UK, UAE, USA, Canada.",
    intro:
      "Wholesale bridal jewelry from Gemora Global. Kundan and Polki bridal sets, complete necklace + earring + Tikka + bangles. MOQ 10 sets. Exported to South Asian diaspora markets globally.",
    body: [
      "Bridal jewelry is our highest-value category — complete Kundan, Polki, and CZ bridal sets that give boutiques supplying the South Asian wedding market a premium, curated range to offer brides and their families. Our bridal sets include necklace, chandelier earrings, Maang Tikka, and matching bangles in coordinated gold-tone designs.",
      "We supply bridal jewelry to boutiques in UK (London, Birmingham, Leicester), USA (New York, New Jersey, Chicago), Canada (Toronto, Vancouver), UAE (Dubai, Abu Dhabi), and Singapore. Our bridal sets are designed specifically for South Asian wedding aesthetics — featuring Kundan stones, pearl drops, and meenakari accents.",
      "MOQ for complete bridal sets starts at 10 sets. Individual bridal necklaces available from 25 pieces. Lead time 15–20 days for bridal sets. We offer gift box packaging, anti-tarnish bags, and retail-ready presentation for boutique display.",
    ],
    keywords: [
      "bridal jewelry wholesale India",
      "Kundan bridal set supplier",
      "bridal jewellery manufacturer Jaipur",
      "wholesale bridal sets export",
    ],
    whatsappMsg:
      "Hi, I'm interested in bridal jewelry wholesale sets from Gemora Global",
    icon: "👰",
  },
  "kundan-jewelry": {
    title:
      "Kundan Jewelry Wholesale | Kundan Jewellery Manufacturer India | Gemora Global",
    h1: "Kundan Jewelry — Traditional Indian Craftsmanship",
    desc: "Wholesale Kundan jewelry from India — Kundan necklace sets, Kundan earrings, Kundan bangles, bridal Kundan sets. Jaipur manufacturer. MOQ 50 pcs. Global export.",
    intro:
      "Wholesale Kundan jewelry from Gemora Global, Jaipur's premier imitation jewellery manufacturer. Traditional Kundan craftsmanship at accessible wholesale prices.",
    body: [
      "Kundan jewelry is India's most celebrated jewellery tradition — and Gemora Global, based in Jaipur (the historic centre of Kundan jewellery manufacture), brings this tradition to wholesale buyers worldwide at accessible imitation jewellery prices. Our Kundan collection includes necklace sets, chandbali earrings, Maang Tikkas, bangles, and complete bridal sets.",
      "Authentic Kundan work uses glass or semi-precious stones set in a gold-foil framework — our imitation Kundan recreates this look with precision-cut glass stones in gold-plated bezels, achieving a near-identical visual effect at a fraction of the cost of fine Kundan jewelry. Ideal for boutiques whose customers want the Kundan look without the fine jewelry price.",
      "MOQ 50 pieces per design. Complete Kundan bridal sets from 10 sets. We supply Kundan jewelry to boutiques across UK, USA, UAE, Canada, Australia, Malaysia, and Singapore. Designs updated seasonally to reflect contemporary Kundan trends.",
    ],
    keywords: [
      "Kundan jewelry wholesale India",
      "Kundan jewellery manufacturer Jaipur",
      "imitation Kundan sets supplier",
      "wholesale Kundan necklace",
    ],
    whatsappMsg:
      "Hi, I'm interested in Kundan jewelry wholesale from Gemora Global",
    icon: "🪙",
  },
  "meenakari-jewelry": {
    title:
      "Meenakari Jewelry Wholesale | Meenakari Jewellery Supplier India | Gemora Global",
    h1: "Meenakari Jewelry — Vibrant Enamel Artistry",
    desc: "Wholesale Meenakari jewelry from India — Meenakari earrings, necklaces, bangles with vibrant enamel work. Jaipur manufacturer. MOQ 50 pcs. Global export.",
    intro:
      "Wholesale Meenakari jewelry from Gemora Global. Vibrant enamel artistry on earrings, necklaces, and bangles. Traditional Jaipur Meenakari at wholesale prices.",
    body: [
      "Meenakari is Jaipur's traditional enamelling art — and Gemora Global brings this unique craft to wholesale buyers worldwide. Our Meenakari jewelry collection features vibrant enamel work on necklaces, chandbali earrings, bangle sets, and bridal pieces, with designs featuring floral motifs, peacock patterns, and geometric coloured enamel inlays.",
      "Meenakari jewelry is particularly popular with buyers in Southeast Asian markets (Malaysia, Singapore) and the global South Asian diaspora — the vibrant colours and intricate patterns appeal to buyers seeking distinctively Indian artisan jewelry. These pieces are also popular in European ethnic and craft boutiques.",
      "MOQ 50 pieces per design. Available in Mehndi plating (warm gold-brown tone) and standard gold plating. Lead time 12–18 days due to hand-applied enamel process. Prices slightly premium to reflect the craft element.",
    ],
    keywords: [
      "Meenakari jewelry wholesale India",
      "Meenakari jewellery supplier Jaipur",
      "enamel jewelry manufacturer India",
      "vibrant Meenakari export",
    ],
    whatsappMsg:
      "Hi, I'm interested in Meenakari jewelry wholesale from Gemora Global",
    icon: "🎨",
  },
  "antique-jewelry": {
    title:
      "Antique Jewelry Wholesale | Antique Jewellery Supplier India | Gemora Global",
    h1: "Antique Jewelry — Heritage & Vintage Styles",
    desc: "Wholesale antique jewelry from India — antique gold, oxidised silver, heritage designs. Earrings, necklaces, sets. MOQ 50 pcs. Export UK, USA, Australia.",
    intro:
      "Wholesale antique jewelry from Gemora Global. Heritage and vintage-inspired designs with antique gold and oxidised silver finishes. MOQ 50 pieces.",
    body: [
      "Antique jewelry captures the charm of heritage Indian and Middle Eastern designs — featuring darkened gold and silver finishes that replicate centuries-old goldsmithing aesthetics. Our wholesale antique jewelry range includes earrings, necklaces, bangles, and complete sets in Mehndi plating (antique gold-brown) and oxidised silver-black finishes.",
      "These designs appeal to buyers in boho, ethnic, and heritage fashion markets worldwide. In UK and Australia, antique jewelry sells strongly in artisan boutiques, ethnic clothing stores, and festival fashion retailers. In the USA, antique-styled Indian jewelry is particularly popular in South Asian communities and among Western boho fashion buyers.",
      "All antique pieces feature protective topcoat over plating to maintain the vintage appearance during wear. MOQ 50 pieces per design. Pairs naturally with our oxidised jewelry and Kundan collections for a comprehensive heritage range.",
    ],
    keywords: [
      "antique jewelry wholesale India",
      "vintage jewellery supplier",
      "antique gold jewelry manufacturer",
      "heritage jewelry export Jaipur",
    ],
    whatsappMsg:
      "Hi, I'm interested in antique jewelry wholesale from Gemora Global",
    icon: "🏺",
  },
  "temple-jewelry": {
    title:
      "Temple Jewelry Wholesale | Temple Jewellery Manufacturer India | Gemora Global",
    h1: "Temple Jewelry — South Indian Classical Style",
    desc: "Wholesale temple jewelry from India — South Indian temple necklaces, earrings, bangles with traditional motifs. MOQ 50 pcs. Export Malaysia, Singapore, UAE, UK.",
    intro:
      "Wholesale temple jewelry from Gemora Global. South Indian classical designs with traditional temple motifs. Exported to South Asian markets globally.",
    body: [
      "Temple jewelry originated in South Indian temple traditions and features bold, sculptural designs with gods and goddess motifs, floral patterns, and deep gold-tone finishes. Gemora Global manufactures premium imitation temple jewelry at wholesale prices for global boutiques serving South Indian and South Asian buyers.",
      "Our temple jewelry collection includes elaborate necklace sets with matching earrings, temple chokers, large temple chandbali earrings, temple bangles, and complete South Indian bridal sets. These pieces are essential inventory for boutiques in Malaysia, Singapore, UK, USA, and UAE serving South Indian diaspora customers.",
      "MOQ 50 pieces per design. Available in matte gold and bright gold plating. These are considered premium pieces due to their elaborate construction — pricing reflects quality. Lead time 12–18 days.",
    ],
    keywords: [
      "temple jewelry wholesale India",
      "South Indian temple jewellery supplier",
      "temple jewellery manufacturer Jaipur",
      "classical temple jewelry export",
    ],
    whatsappMsg:
      "Hi, I'm interested in temple jewelry wholesale from Gemora Global",
    icon: "🏛️",
  },
  "indo-western-jewelry": {
    title:
      "Indo Western Jewelry Wholesale | Indo Western Jewellery India | Gemora Global",
    h1: "Indo Western Jewelry — East Meets West Aesthetic",
    desc: "Wholesale Indo Western jewelry from India — fusion designs blending Indian and Western aesthetics. Earrings, necklaces, rings. MOQ 50 pcs. Global export.",
    intro:
      "Wholesale Indo Western jewelry from Gemora Global. Fusion designs that blend Indian craftsmanship with Western minimalism. Global export, MOQ 50 pcs.",
    body: [
      "Indo Western jewelry bridges two aesthetics — Indian craftsmanship (Kundan settings, meenakari, oxidised finishes) with Western design sensibility (clean lines, geometric shapes, minimal construction). The result is jewelry that appeals to both South Asian buyers wanting a modern Indian look and Western buyers who appreciate the cultural artistry.",
      "Our Indo Western collection includes layered Kundan pendants on satellite chains, geometric Meenakari earrings, mixed-metal oxidised and gold-tone pieces, and contemporary designs that work with both kurtas and cocktail dresses. These designs are particularly popular with second-generation South Asian buyers in UK, USA, Canada, and Australia who want jewelry that reflects their dual cultural identity.",
      "MOQ 50 pieces per design. This collection is updated frequently as the Indo Western aesthetic evolves rapidly. WhatsApp us for the latest designs and seasonal drops.",
    ],
    keywords: [
      "Indo Western jewelry wholesale India",
      "fusion jewelry supplier",
      "contemporary Indian jewelry wholesale",
      "modern ethnic jewelry export",
    ],
    whatsappMsg:
      "Hi, I'm interested in Indo Western jewelry wholesale from Gemora Global",
    icon: "🌐",
  },
  "silver-oxidised-jewelry": {
    title:
      "Silver Oxidised Jewelry Wholesale | Oxidised Silver Jewellery India | Gemora Global",
    h1: "Silver Oxidised Jewelry — Antique & Tribal Aesthetic",
    desc: "Wholesale silver oxidised jewelry from India — oxidised silver earrings, necklaces, bangles, rings. Tribal and boho styles. MOQ 50 pcs. Export UK, USA, Australia.",
    intro:
      "Wholesale silver oxidised jewelry from Gemora Global. Authentic antique silver-tone pieces for boho, ethnic, and tribal fashion markets. MOQ 50 pcs.",
    body: [
      "Silver oxidised jewelry — also known as antique silver or blackened silver jewelry — is a staple of the global boho and ethnic fashion market. Gemora Global's wholesale oxidised silver collection includes jhumka earrings, chandbali sets, tribal necklaces, oxidised bangles, and statement rings in authentic darkened silver-tone finishes.",
      "Our oxidised silver pieces are manufactured using a controlled chemical oxidation process on alloy base metals, with a stabilising topcoat that maintains the antique appearance through regular wear. The result is a consistent, attractive oxidised finish that performs well even in humid and warm climates.",
      "MOQ 50 pieces per design. These designs are our best performers in UK, Australian, and German boho fashion boutiques. Combine with our Oxidised Jewelry collection for a comprehensive antique silver range.",
    ],
    keywords: [
      "silver oxidised jewelry wholesale India",
      "oxidised silver earrings supplier",
      "antique silver jewelry manufacturer",
      "oxidised jewellery export",
    ],
    whatsappMsg:
      "Hi, I'm interested in silver oxidised jewelry wholesale from Gemora Global",
    icon: "🖤",
  },
  "wholesale-bangles": {
    title: "Wholesale Bangles | Bangle Supplier India | Gemora Global",
    h1: "Wholesale Bangles — Gold, Oxidised & Kundan",
    desc: "Wholesale bangles from India — gold plated bangle sets, oxidised bangles, Kundan bangles, Kada. Sets of 2–24. MOQ 50 pcs. Export UAE, UK, USA, Malaysia.",
    intro:
      "Wholesale bangles from Gemora Global. Gold plated, oxidised, and Kundan bangle sets in all sizes. MOQ 50 pieces. Exported to UAE, UK, USA, Malaysia, and 20+ countries.",
    body: [
      "Bangles are a culturally significant jewelry item across South Asian, Middle Eastern, and African markets — and Gemora Global is one of India's leading wholesale bangle suppliers. Our bangle collection includes gold-plated bangle sets, oxidised silver bangles, Kundan-studded bangle sets, Meenakari bangles, and heavy bridal bangle sets.",
      "We supply bangles in standard Indian sizes 2.4 to 2.8 and in sets of 2, 4, 6, 12, and 24 pieces. UAE and Malaysian markets prefer elaborate gold-plated sets in 6 or 12 pieces. UK South Asian boutiques favour bridal bangle sets for the wedding season. Australian and USA markets order both traditional sets and modern chain-style bracelets.",
      "MOQ 50 pieces per design (individual pieces) or per set (for multi-piece sets). Bulk pricing tiers available from 200 pieces. Anti-tarnish coating on all bangles. Heavy-duty packaging for set protection during export.",
    ],
    keywords: [
      "wholesale bangles India",
      "bangle supplier Jaipur",
      "gold plated bangles wholesale",
      "bangle sets exporter India",
    ],
    whatsappMsg: "Hi, I'm interested in wholesale bangles from Gemora Global",
    icon: "⭕",
  },
};

const RELATED_COLLECTIONS = [
  { label: "Trendy Jewelry", to: "/collections/trendy-jewelry" },
  { label: "Earrings", to: "/collections/earrings" },
  { label: "Necklaces", to: "/collections/necklaces" },
  { label: "Rings", to: "/collections/rings" },
  { label: "Bracelets", to: "/collections/bracelets" },
  { label: "Oxidised", to: "/collections/oxidised-jewelry" },
];

export default function ProgrammaticCollection() {
  const { slug } = useParams<{ slug: string }>();
  const config = slug ? COLLECTION_MAP[slug] : undefined;

  const title = config?.title ?? "Fashion Jewelry Collection | Gemora Global";
  const desc =
    config?.desc ??
    "Wholesale fashion jewelry from Gemora Global. MOQ 50 units. Export worldwide.";

  usePageSEO({
    title,
    description: desc,
    canonical: `${BASE_URL}/collections/${slug ?? ""}`,
    breadcrumbs: [
      { name: "Home", url: BASE_URL },
      { name: "Collections", url: `${BASE_URL}/products` },
      {
        name: config?.h1 ?? "Collection",
        url: `${BASE_URL}/collections/${slug ?? ""}`,
      },
    ],
  });

  if (!config) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-16 container px-4 py-20 text-center">
          <h1 className="font-serif text-3xl font-bold mb-4">
            Collection Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            This collection doesn't exist yet. Browse all our jewelry
            categories.
          </p>
          <Button asChild className="bg-primary text-primary-foreground">
            <Link to="/products">View All Products</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Hero */}
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
              / {config.h1}
            </nav>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl" aria-hidden="true">
                {config.icon}
              </span>
              <h1 className="font-serif text-3xl md:text-4xl font-bold">
                {config.h1}
              </h1>
            </div>
            <p className="text-muted-foreground max-w-2xl text-sm md:text-base">
              {config.intro}
            </p>
          </div>
        </div>

        <div className="container px-4 py-10 md:py-16">
          {/* Main content */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="md:col-span-2">
              {config.body.map((para) => (
                <p
                  key={para.slice(0, 40)}
                  className="text-muted-foreground leading-relaxed mb-4 text-sm md:text-base"
                >
                  {para}
                </p>
              ))}
              <div className="mt-6">
                <h2 className="font-serif text-xl font-bold mb-4">
                  Why Choose Gemora Global?
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      icon: "🏭",
                      label: "Factory Direct",
                      desc: "No middlemen — direct from our Jaipur manufacturing unit.",
                    },
                    {
                      icon: "✨",
                      label: "Anti-Tarnish",
                      desc: "Premium coating for lasting shine in any market.",
                    },
                    {
                      icon: "📦",
                      label: "MOQ from 50",
                      desc: "Low minimum orders for testing new styles.",
                    },
                    {
                      icon: "🌍",
                      label: "Global Export",
                      desc: "Shipping to 20+ countries worldwide.",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="bg-muted/30 rounded-xl p-4 border border-border"
                    >
                      <div className="text-xl mb-2">{item.icon}</div>
                      <h3 className="font-semibold text-sm">{item.label}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-primary/5 rounded-xl p-5 border border-primary/20">
                <h3 className="font-semibold mb-3">📦 Wholesale Details</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>MOQ: 50 units per design</li>
                  <li>Finish: Gold, Oxidised, Rhodium, Rose Gold</li>
                  <li>Lead Time: 10–15 business days</li>
                  <li>Shipping: DHL, FedEx, EMS</li>
                  <li>Payment: T/T, PayPal, Western Union</li>
                </ul>
              </div>
              <div className="bg-muted/30 rounded-xl p-5 border border-border">
                <h3 className="font-semibold mb-3">🔑 Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {config.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1 text-xs font-medium"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Related */}
          <div className="mb-10">
            <h3 className="font-semibold text-sm mb-3 text-muted-foreground uppercase tracking-wider">
              Related Collections
            </h3>
            <div className="flex flex-wrap gap-2">
              {RELATED_COLLECTIONS.map((r) => (
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

          {/* CTA */}
          <div
            className="bg-primary text-primary-foreground rounded-xl p-8 text-center"
            data-ocid="programmatic.cta.section"
          >
            <h2 className="font-serif text-xl font-bold mb-2">
              Get Wholesale Pricing & Catalogue
            </h2>
            <p className="text-white/80 mb-5 text-sm">
              WhatsApp us to receive our catalogue with current pricing, MOQ
              options, and available designs.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                asChild
                className="bg-accent text-primary font-bold hover:bg-accent/90"
                data-ocid="programmatic.cta.whatsapp"
              >
                <a
                  href={`https://wa.me/917976341419?text=${encodeURIComponent(config.whatsappMsg)}`}
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
                data-ocid="programmatic.cta.products"
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
