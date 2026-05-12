import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { usePageContent } from "../hooks/usePageContent";
import { usePageSEO } from "../hooks/usePageSEO";

const FAQ_ITEMS = [
  {
    q: "Where is Gemora Global's manufacturing facility located?",
    a: "Gemora Global is based in Jaipur, Rajasthan, India — at B 66 MAA Hinglaj Nagar, Jaipur 302021. Jaipur is India's foremost jewellery manufacturing hub, with generations of master craftspeople specialising in Kundan, Meenakari, Temple, and Antique imitation jewellery. Our strategic location in Jaipur gives us direct access to the best artisan talent, raw material suppliers, stone cutters, and plating workshops in the country.",
  },
  {
    q: "What is the minimum order quantity (MOQ) for wholesale buyers?",
    a: "Our standard MOQ is 50 units per design for most product categories including Earrings, Necklaces, Bangles, Bridal Sets, Pendant Sets, Mangalsutra, Finger Rings, Maang Tikka, and Anklets. Custom and OEM orders for private label jewellery manufacturing have an MOQ of 500 units with 3–4 weeks production lead time. We welcome both boutique buyers and large distributors.",
  },
  {
    q: "What plating and finishing options does Gemora Global offer?",
    a: "We offer 9 distinct plating and finishing types to match every retail market: Gold Plating (22k/18k equivalent look), Matte Gold Plating, Rhodium Plating (silver finish), Rose Gold Plating, Oxidised Plating, Black Plating, Mehndi Plating (antique gold), 2 Tone Plating, and 3 Tone Plating. All plating uses anti-tarnish coating for extended durability.",
  },
  {
    q: "Does Gemora Global offer custom jewellery manufacturing and private label services?",
    a: "Yes. We offer full OEM and private label jewellery manufacturing services. You can send us your own designs, sketches, or references for custom production. Alternatively, select from our 500+ design catalogue for customisation with your brand's logo, packaging, and labelling. Custom design orders require a minimum of 500 units and a 3–4 week production lead time from design approval.",
  },
  {
    q: "Which countries does Gemora Global export wholesale imitation jewellery to?",
    a: "We export wholesale imitation jewellery to 20+ countries including USA, UK, UAE, France, Canada, Australia, Singapore, Malaysia, Saudi Arabia, Nigeria, Sri Lanka, Kuwait, and Germany. Our export team handles all customs documentation, commercial invoices, packing lists, and freight coordination. We ship via DHL, FedEx, and UPS for express delivery, and via sea freight for large bulk orders.",
  },
];

const PRODUCT_CATEGORIES = [
  {
    name: "Earrings",
    items:
      "Jhumka, Chandbali, Stud, Hoop, Ear Chain, Drop Earrings, Dangler, Tassel, Ear Cuff, Boring Earring",
  },
  {
    name: "Necklaces & Chains",
    items:
      "Choker Necklace, Layered Chain, Pendant Set, Chain Pendant, Mala, Haaram, Long Necklace, Rani Haar",
  },
  {
    name: "Bangles & Bracelets",
    items: "Bangles, Bracelet, Kada, Baju Band, Hath Pan, Kangan",
  },
  {
    name: "Maang Tikka & Head Jewellery",
    items:
      "Maang Tikka, Earring Tikka, Tikka, Jhuda, Pasa, Damini, Shishful, Bore",
  },
  {
    name: "Bridal Sets",
    items:
      "Complete Bridal Set, Necklace + Earring Set, Maang Tikka Set, Bridal Hath Pan, Payal Set",
  },
  {
    name: "Rings & Nose Jewellery",
    items: "Finger Ring, Nose Ring, Nose Pin, Statement Ring, Cocktail Ring",
  },
  { name: "Waist & Feet Jewellery", items: "Payal, Anklet, Belt, Kamarband" },
  {
    name: "Hair Accessories",
    items: "Hair Clip, Hair Band, Hair Brooch, Juda Pin, Floral Hair Accessory",
  },
  {
    name: "Religious & Special",
    items: "Mangalsutra, Sindoor Box, Brooch, Chain Pendant, Matha Patti",
  },
];

const PLATING_TYPES = [
  "Gold Plating",
  "Matte Gold Plating",
  "Rhodium Plating",
  "Rose Gold Plating",
  "Oxidised Plating",
  "Black Plating",
  "Mehndi Plating",
  "2 Tone Plating",
  "3 Tone Plating",
];

const JEWELLERY_STYLES = [
  {
    style: "Kundan Jewellery",
    desc: "Traditional glass-setting technique from the Jaipur and Delhi courts. Ideal for bridal and festive wholesale buyers. Each piece is hand-set by master artisans with coloured glass stones in gold-plated frames.",
  },
  {
    style: "Meenakari Jewellery",
    desc: "Vibrant hand-painted enamel work on gold-plated metal. A hallmark of Rajasthani craftsmanship, popular among UAE boutiques, UK ethnic stores, and South Asian diaspora retailers worldwide.",
  },
  {
    style: "Temple Jewellery",
    desc: "South Indian-inspired jewellery featuring deity motifs and heavy gold plating. Extremely popular for wedding season wholesale, particularly for South Indian, Sri Lankan, and Malaysian buyers.",
  },
  {
    style: "Oxidised / Antique Jewellery",
    desc: "Silver oxidised and black-plated pieces for Indo-Western and bohemian retail markets. Trending strongly in USA, UK, Australia, and European boutiques targeting fashion-forward buyers.",
  },
  {
    style: "American Diamond (CZ)",
    desc: "Cubic Zirconia and CZ Jewellery for everyday luxury. Best-seller in USA, UK, and Australian wholesale markets. Offers the brilliance of diamonds at accessible wholesale prices.",
  },
  {
    style: "Bridal Jewellery Sets",
    desc: "Complete bridal sets including necklace, earrings, maang tikka, bangles, and payal — for South Asian wedding retailers, bridal boutiques, and event stylists across 20+ countries.",
  },
  {
    style: "Indo Western Jewellery",
    desc: "Contemporary designs blending Indian traditional motifs with Western minimalist aesthetics. Popular in Canada, Australia, Singapore, and among younger diaspora buyers in the USA and UK.",
  },
  {
    style: "Bollywood Jewellery",
    desc: "Statement pieces inspired by Bollywood fashion — heavy, layered, and dramatic. Popular for festive wholesale, fancy dress retailers, and event stylists globally.",
  },
  {
    style: "Ethnic & Traditional Jewellery",
    desc: "Heritage jewellery spanning Maharashtrian, Rajasthani, Bengali, South Indian traditions. Each style targets specific community-based boutiques across the UK, USA, Canada, and Australia.",
  },
];

const EXPORT_MARKETS = [
  {
    flag: "🇺🇸",
    country: "USA",
    desc: "American boutiques, South Asian stores, online sellers on Amazon and Etsy",
    route: "/imitation-jewellery-supplier-usa",
  },
  {
    flag: "🇬🇧",
    country: "UK",
    desc: "South Asian fashion boutiques, ethnic jewellery stores, indie retailers",
    route: "/wholesale-jewellery-uk",
  },
  {
    flag: "🇦🇪",
    country: "UAE",
    desc: "Dubai souks, Sharjah wholesalers, Abu Dhabi fashion boutiques",
    route: "/imitation-jewellery-supplier-uae",
  },
  {
    flag: "🇫🇷",
    country: "France",
    desc: "Parisian boutiques, multicultural fashion stores, African diaspora markets",
    route: "/export-imitation-jewellery-france",
  },
  {
    flag: "🇨🇦",
    country: "Canada",
    desc: "South Asian community boutiques in Toronto, Vancouver, and Montreal",
    route: "/export-imitation-jewellery-canada",
  },
  {
    flag: "🇦🇺",
    country: "Australia",
    desc: "Indian fashion boutiques in Sydney, Melbourne, and Brisbane",
    route: "/export-indian-fashion-jewellery-australia",
  },
  {
    flag: "🇸🇬",
    country: "Singapore",
    desc: "Little India jewellery shops, Mustafa Centre, fashion wholesalers",
    route: "/export-imitation-jewellery-singapore",
  },
  {
    flag: "🇲🇾",
    country: "Malaysia",
    desc: "Indian community boutiques, Brickfields market, online retailers",
    route: "/global-markets",
  },
  {
    flag: "🇸🇦",
    country: "Saudi Arabia",
    desc: "Riyadh and Jeddah wholesale importers, ethnic fashion boutiques",
    route: "/global-markets",
  },
  {
    flag: "🇳🇬",
    country: "Nigeria",
    desc: "Lagos fashion importers, bridal boutiques, fashion jewellery distributors",
    route: "/global-markets",
  },
  {
    flag: "🇱🇰",
    country: "Sri Lanka",
    desc: "Colombo fashion jewellery retailers and wholesale distributors",
    route: "/global-markets",
  },
  {
    flag: "🇰🇼",
    country: "Kuwait",
    desc: "South Asian community boutiques and fashion jewellery importers",
    route: "/global-markets",
  },
];

export default function About() {
  const { content: pageContent } = usePageContent("about");

  usePageSEO({
    title:
      "About Gemora Global — India's Premier Imitation Jewellery Manufacturer & Exporter | Jaipur",
    description:
      "Gemora Global is Jaipur's leading imitation jewellery manufacturer & exporter since 2011. 500+ designs in Kundan, Bridal, Oxidised & Fashion jewellery. MOQ 50 units.",
    canonical: "https://www.gemoraglobal.co/about",
    ogTitle:
      "About Gemora Global — Imitation Jewellery Manufacturer India Jaipur",
    ogDescription:
      "Established 2011. India's premier imitation jewellery manufacturer in Jaipur — wholesale Kundan, Bridal, Temple, Antique, Oxidised & Fashion Jewellery for global buyers.",
    ogImage: "https://www.gemoraglobal.co/images/og-about.jpg",
    faqItems: FAQ_ITEMS,
    breadcrumbs: [
      { name: "Home", url: "https://www.gemoraglobal.co/" },
      { name: "About Us", url: "https://www.gemoraglobal.co/about" },
    ],
    speakable: true,
    schema: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      url: "https://www.gemoraglobal.co/about",
      name: "About Gemora Global — Imitation Jewellery Manufacturer India",
      description:
        "Gemora Global is a Jaipur-based imitation jewellery manufacturer established in 2011 with 10+ years of export experience serving 20+ countries.",
      mainEntity: {
        "@type": "Organization",
        name: "Gemora Global",
        foundingDate: "2011",
        foundingLocation: {
          "@type": "Place",
          name: "Jaipur, Rajasthan, India",
        },
        numberOfEmployees: {
          "@type": "QuantitativeValue",
          minValue: 50,
          maxValue: 200,
        },
        knowsAbout: [
          "Imitation jewellery manufacturing",
          "Kundan jewellery",
          "Bridal jewellery wholesale",
          "Fashion jewellery export",
          "Wholesale jewellery supply",
          "Temple jewellery",
          "Meenakari jewellery",
          "Gold plated jewellery",
          "American Diamond CZ jewellery",
          "Oxidised jewellery",
          "Bollywood jewellery",
          "Indo Western jewellery",
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Gemora Global Wholesale Catalogue",
          numberOfItems: 500,
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Hero */}
        <div className="bg-card border-b border-border py-10 md:py-16 px-4">
          <div className="container px-0 text-center">
            <p
              className="text-xs uppercase tracking-widest mb-3 font-semibold"
              style={{ color: "#D4AF37" }}
            >
              Established 2011 · Jaipur, Rajasthan, India
            </p>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-5xl font-bold mb-4 leading-tight">
              {pageContent.page_title ||
                "About Gemora Global — Jaipur\u2019s Premier Imitation Jewellery Manufacturer"}
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-3xl mx-auto mb-6">
              {pageContent.story_text ||
                "Since 2011, Gemora Global has been manufacturing and exporting premium imitation jewellery from Jaipur, India to wholesale buyers across 20+ countries."}
            </p>
            {/* Trust bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-3xl mx-auto">
              {[
                { value: "500+", label: "Designs in Catalogue" },
                { value: "2011", label: "Established in Jaipur" },
                { value: "20+", label: "Export Countries" },
                { value: "50 Units", label: "Minimum MOQ" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-primary/10 border border-primary/20 rounded-lg p-3 md:p-4"
                >
                  <div
                    className="font-serif text-xl md:text-2xl font-bold"
                    style={{ color: "#D4AF37" }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="container py-10 md:py-16 space-y-12 md:space-y-20 px-4 article-body">
          {/* Our Story */}
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
              <div className="rounded-xl overflow-hidden w-full aspect-video md:order-2">
                <img
                  src="/assets/generated/jewellery-bridal-hd.dim_800x800.jpg"
                  alt="Gemora Global manufacturing workshop — imitation jewellery manufacturer Jaipur India"
                  className="w-full h-full object-cover"
                  loading="eager"
                  width={800}
                  height={600}
                />
              </div>
              <div className="md:order-1">
                <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4 text-primary">
                  Our Story — From Jaipur to the World
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4 text-sm md:text-base">
                  Gemora Global was established in 2011 in the heart of Jaipur,
                  Rajasthan — India&apos;s undisputed capital of imitation
                  jewellery manufacturing. Our founding mission was simple but
                  ambitious: to bring the richness of Indian jewellery
                  craftsmanship to{" "}
                  <Link
                    to="/wholesale"
                    className="text-primary hover:underline"
                  >
                    wholesale buyers around the world
                  </Link>{" "}
                  at prices that make global retail truly viable. What began as
                  a focused workshop specialising in Kundan and Bridal jewellery
                  has grown into a full-scale imitation jewellery manufacturer
                  and exporter, serving clients across Europe, the Middle East,
                  North America, Southeast Asia, and Africa.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4 text-sm md:text-base">
                  The decision to base our operations in Jaipur was strategic.
                  Jaipur is not merely our home — it is the{" "}
                  <Link to="/imitation-jewellery-manufacturer-jaipur" className="text-primary hover:underline font-bold">
                    imitation jewellery manufacturing capital of India
                  </Link>
                  . The city&apos;s artisan ecosystem spans generations of
                  expertise in Kundan setting, Meenakari enamel work, and
                  gold-plating techniques that no other city in India can match.
                  Our craftspeople trained under master artisans and bring that
                  depth of expertise to every piece — whether an intricately
                  detailed{" "}
                  <Link to="/kundan-jewellery-wholesale" className="text-primary hover:underline font-semibold">
                    Kundan bridal necklace set
                  </Link>
                  , a lightweight American Diamond (CZ) daily-wear earring, or a
                  vibrant{" "}
                  <Link to="/meenakari-jewellery-wholesale" className="text-primary hover:underline font-semibold">
                    Meenakari pendant set
                  </Link>{" "}
                  destined for a UK boutique.
                </p>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  Our name — Gemora — reflects our commitment to gem-like
                  quality in every piece we produce. In over a decade of
                  business, we have built lasting relationships with wholesale
                  buyers in USA, UK, UAE, France, Canada, Australia, Singapore,
                  Malaysia, Saudi Arabia, Nigeria, Sri Lanka, and Kuwait. We
                  believe every retailer deserves a{" "}
                  <Link
                    to="/wholesale"
                    className="text-primary hover:underline"
                  >
                    wholesale supplier
                  </Link>{" "}
                  they can trust season after season — and that is exactly what
                  Gemora Global delivers.
                </p>
              </div>
            </div>
          </section>

          {/* Manufacturing Process */}
          <section className="bg-card rounded-xl p-6 md:p-10 border border-border">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center">
              Our Jewellery Manufacturing Excellence
            </h2>
            <p className="text-muted-foreground leading-relaxed text-center max-w-3xl mx-auto mb-6 text-sm md:text-base">
              Our manufacturing facility in{" "}
              <Link to="/imitation-jewellery-manufacturer-jaipur" className="text-primary hover:underline">
                Jaipur, Rajasthan
              </Link>{" "}
              operates at the heart of India&apos;s most celebrated
              jewellery-making region. We maintain end-to-end production control
              — from raw brass and alloy metal sourcing to stone cutting,
              setting, plating, polishing, and packaging. This factory-direct
              model eliminates middlemen and allows us to offer the most
              competitive{" "}
              <Link to="/wholesale" className="text-primary hover:underline">
                wholesale jewellery pricing
              </Link>{" "}
              for{" "}
              <Link
                to="/global-markets"
                className="text-primary hover:underline"
              >
                international buyers
              </Link>
              . Every jewellery piece at Gemora Global goes through a rigorous
              multi-stage manufacturing process: raw material inspection,
              mid-production quality checks, stone setting verification, plating
              quality testing, anti-tarnish coating application, and final
              pre-shipment inspection.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8">
              {[
                {
                  icon: "⚙️",
                  title: "Metal Fabrication",
                  desc: "Brass and white metal alloy frames formed using precision dies and handcrafting techniques specific to each jewellery style — from lightweight fashion earrings to heavy Kundan bridal sets.",
                },
                {
                  icon: "💎",
                  title: "Stone Setting",
                  desc: "American Diamond (CZ), Cubic Zirconia, glass stones, and synthetic gems set by experienced artisans using traditional Kundan and Jadau techniques — ensuring stones stay secure through regular wear.",
                },
                {
                  icon: "✨",
                  title: "Gold & Specialty Plating",
                  desc: "Multi-layer electroplating in Gold, Matte Gold, Rhodium, Rose Gold, Oxidised, Black, Mehndi, 2-Tone, and 3-Tone finishes — all with proprietary anti-tarnish coating for extended durability.",
                },
                {
                  icon: "🎨",
                  title: "Meenakari Enamel",
                  desc: "Hand-painted enamel in vibrant colours applied to Meenakari jewellery pieces — a centuries-old Jaipur art form that gives our pieces their distinctive colourful appeal in global markets.",
                },
                {
                  icon: "🔍",
                  title: "Multi-Stage Quality Inspection",
                  desc: "Each batch undergoes inspection covering metal finish, plating uniformity, stone security, clasp strength, and anti-tarnish coating durability before packaging for dispatch.",
                },
                {
                  icon: "📦",
                  title: "Export-Grade Packaging",
                  desc: "Anti-tarnish poly bags, bubble wrap inner packing, and reinforced master cartons — export packaging that meets international shipping requirements and protects jewellery in transit.",
                },
              ].map((step) => (
                <div
                  key={step.title}
                  className="bg-background border border-border rounded-lg p-4 md:p-5"
                >
                  <div className="text-3xl mb-3">{step.icon}</div>
                  <h3 className="font-semibold mb-2 text-sm md:text-base">
                    {step.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
            {/* Plating Types */}
            <div className="text-center">
              <p
                className="font-semibold text-sm mb-3"
                style={{ color: "#D4AF37" }}
              >
                All Plating & Finishing Options Available:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {PLATING_TYPES.map((plating) => (
                  <span
                    key={plating}
                    className="px-3 py-1.5 rounded-full text-xs font-medium border"
                    style={{
                      background: "rgba(212,175,55,0.12)",
                      borderColor: "rgba(212,175,55,0.3)",
                      color: "#b8962e",
                    }}
                  >
                    {plating}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Product Range */}
          <section>
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center text-primary">
              Our Complete Jewellery Collection
            </h2>
            <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-8 text-sm md:text-base">
              Gemora Global manufactures over 500 wholesale jewellery designs
              across all major product categories — from traditional ethnic and
              bridal sets to contemporary Indo Western and minimal Western
              jewellery. We cover every product segment a jewellery retailer or
              boutique needs, including Earrings, Necklaces, Bangles, Bracelets,
              Pendant Sets, Chain Pendants, Mangalsutra, Finger Rings, Nose
              Rings, Tikka, Maang Tikka, Bridal Sets, Mala, Kada, Baju Band,
              Hath Pan, Payal, Anklets, Jhuda, Pasa, Bore, Damini, Sindoor Box,
              Brooch, Belt, Shishful, Hair Clips, Hair Bands, Hair Brooches, Ear
              Chains, Chains, and Choker Necklaces. Browse our complete{" "}
              <Link to="/products" className="text-primary hover:underline">
                product catalogue
              </Link>{" "}
              for the full range with wholesale pricing.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {PRODUCT_CATEGORIES.map((cat) => (
                <div
                  key={cat.name}
                  className="bg-card border border-border rounded-lg p-4 md:p-5"
                >
                  <h3 className="font-semibold mb-2 text-sm md:text-base text-primary">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {cat.items}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-muted-foreground text-center mt-6 text-sm md:text-base">
              Explore the complete range at our{" "}
              <Link
                to="/products"
                className="text-primary hover:underline font-medium"
              >
                products page
              </Link>{" "}
              or browse the{" "}
              <Link
                to="/gallery"
                className="text-primary hover:underline font-medium"
              >
                gallery
              </Link>{" "}
              for high-resolution product photography.
            </p>
          </section>

          {/* Jewellery Styles */}
          <section className="bg-primary/5 border border-primary/20 rounded-xl p-6 md:p-10">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-6 text-center">
              Jewellery Styles We Specialise In
            </h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-8 text-sm md:text-base">
              Our design expertise spans every major jewellery style traded in
              global wholesale and retail markets — from the most traditional
              Indian ethnic styles to contemporary Indo Western and
              Bollywood-inspired fashion jewellery.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {JEWELLERY_STYLES.map((item) => (
                <div
                  key={item.style}
                  className="bg-card border border-border rounded-lg p-4"
                >
                  <h3
                    className="font-semibold mb-2 text-sm md:text-base"
                    style={{ color: "#D4AF37" }}
                  >
                    {item.style}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <p className="text-muted-foreground text-sm mb-4">
                We also manufacture:{" "}
                <strong>
                  Heritage Jewellery, Costume Jewellery, Maharashtrian
                  Jewellery, South Indian Collection, Designer Jewellery, Gold
                  Plated Jewellery
                </strong>
                , Silver Oxidised Jewellery, Traditional Jewellery, and Antique
                Jewellery. Each style is crafted by artisans who specialise in
                that tradition, ensuring authenticity and quality that boutique
                buyers and distributors can confidently present to their
                customers.
              </p>
            </div>
          </section>

          {/* Global Export Markets */}
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-start">
              <div className="rounded-xl overflow-hidden w-full aspect-video">
                <img
                  src="/assets/generated/jewellery-necklace-hd.dim_800x800.jpg"
                  alt="Gemora Global worldwide export — imitation jewellery to USA UK UAE Australia Canada Singapore"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  width={800}
                  height={600}
                />
              </div>
              <div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4 text-primary">
                  Our Global Export Markets
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-5 text-sm md:text-base">
                  Since 2011, Gemora Global has built a robust wholesale
                  distribution network spanning 20+ countries across North
                  America, Europe, the Middle East, Southeast Asia, and Africa.
                  Our export team manages all international shipping, customs
                  documentation, country-specific compliance requirements, and
                  freight coordination — so our B2B buyers can focus entirely on
                  growing their retail business. We provide detailed commercial
                  invoices, packing lists, certificates of origin, and
                  GST-compliant documents for seamless import clearance in every
                  destination country.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
                  {EXPORT_MARKETS.map((m) => (
                    <Link
                      key={m.country}
                      to={m.route}
                      className="flex items-start gap-2.5 p-2.5 bg-card border border-border rounded-lg hover:border-primary/40 transition-colors group"
                    >
                      <span className="text-xl flex-shrink-0">{m.flag}</span>
                      <div>
                        <span className="font-semibold text-xs group-hover:text-primary transition-colors">
                          {m.country}
                        </span>
                        <p className="text-xs text-muted-foreground leading-tight mt-0.5">
                          {m.desc}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  to="/global-markets"
                  className="inline-flex items-center justify-center text-primary text-sm hover:underline font-medium"
                >
                  View all country-specific export guides →
                </Link>
              </div>
            </div>
          </section>

          {/* Quality & Trust */}
          <section className="bg-card rounded-xl p-6 md:p-10 border border-border">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center">
              Quality &amp; Trust — Why Choose Gemora Global
            </h2>
            <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-8 text-sm md:text-base">
              In the imitation jewellery wholesale industry, quality consistency
              is the single most important factor for long-term B2B
              partnerships. At Gemora Global, we have built our reputation on
              delivering the same high quality across every batch — whether a
              buyer orders 50 pieces or 50,000 pieces. Here is why hundreds of
              international wholesale buyers choose Gemora Global as their
              preferred{" "}
              <Link
                to="/why-choose-us"
                className="text-primary hover:underline"
              >
                imitation jewellery supplier from India
              </Link>
              .
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
              <div>
                <h3 className="font-semibold text-base mb-3 text-primary">
                  Our Quality Commitment
                </h3>
                <ul className="space-y-3">
                  {[
                    "Raw material inspection — alloy composition and stone quality verified at source before production begins",
                    "Mid-production checks — stone setting security, soldering joints, and plating adhesion verified during manufacture",
                    "Final pre-shipment inspection — finish uniformity, anti-tarnish coating durability, clasp strength tested per batch",
                    "Batch sampling — random sampling for consistency across large wholesale orders ensures every piece meets standards",
                    "Anti-tarnish coating — our proprietary multi-layer anti-tarnish treatment extends wearable life significantly",
                    "Export-grade documentation — commercial invoice, packing list, certificate of origin provided for all shipments",
                    "GST-compliant invoicing for transparent accounting and hassle-free import clearance",
                  ].map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span className="text-primary flex-shrink-0 mt-0.5 font-bold">
                        ✓
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                {[
                  {
                    icon: "🔬",
                    title: "Factory-Direct Pricing",
                    desc: "No middlemen, no trading company markups. When you buy from Gemora Global, you buy directly from the manufacturer in Jaipur — this means the lowest possible wholesale prices for our B2B buyers.",
                  },
                  {
                    icon: "📦",
                    title: "Anti-Tarnish Export Packaging",
                    desc: "All shipments packed in anti-tarnish lined poly bags with bubble wrap inner and reinforced master cartons. Custom packaging with your brand logo and barcodes available for 500+ unit orders.",
                  },
                  {
                    icon: "🚢",
                    title: "Reliable Global Shipping",
                    desc: "DHL, FedEx, and UPS for express delivery to USA, UK, UAE, and Europe. Sea freight available for large bulk orders. Tracking details shared with every shipment. Average express delivery: 5–7 business days.",
                  },
                  {
                    icon: "🤝",
                    title: "Sampling Before Bulk Orders",
                    desc: "We offer sample orders for first-time buyers — allowing you to verify quality, size, and finish before committing to bulk production. Sample orders can be placed for most product categories.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 bg-background border border-border rounded-lg p-4"
                  >
                    <span className="text-2xl flex-shrink-0">{item.icon}</span>
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

            {/* Why Jaipur */}
            <div className="mt-8 p-5 md:p-6 bg-primary/5 border border-primary/20 rounded-xl">
              <h3 className="font-semibold text-base md:text-lg mb-3 text-center">
                Why Jaipur? India&apos;s Jewellery Manufacturing Capital
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm text-center max-w-3xl mx-auto">
                Jaipur is not just our home — it is the{" "}
                <strong>
                  imitation jewellery manufacturing capital of India
                </strong>
                . The Pink City&apos;s artisan ecosystem spans generations of
                expertise in Kundan setting, Meenakari enamel work, and
                gold-plating techniques for generations. No other city in India
                — not Mumbai, not Delhi, not Surat — has the concentration of
                skilled craftspeople, raw material suppliers, stone cutters, and
                plating workshops that Jaipur offers. This gives Gemora Global
                an unmatched manufacturing advantage — locally sourced
                materials, artisan families who have honed their craft over
                decades, and production expertise that trading companies and
                overseas manufacturers simply cannot replicate.
              </p>
            </div>
          </section>

          {/* Stats */}
          <section>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {[
                { value: "500+", label: "Designs in Catalogue" },
                { value: "20+", label: "Export Countries" },
                { value: "10,000+", label: "Wholesale Clients Served" },
                { value: "10+", label: "Years Manufacturing Experience" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-card border border-border rounded-xl p-4 md:p-6"
                >
                  <div className="font-serif text-2xl md:text-3xl font-bold text-primary mb-1 md:mb-2">
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ Section */}
          <section className="faq-section">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-6 text-center text-primary">
              Frequently Asked Questions
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
          </section>

          {/* CTA */}
          <section className="bg-primary/10 border border-primary/20 rounded-xl p-8 md:p-12 text-center">
            <h2 className="font-serif text-xl md:text-2xl font-bold mb-3">
              Ready to Source Wholesale Imitation Jewellery from Jaipur?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-6 text-sm md:text-base">
              Contact our wholesale team for pricing, catalogue access, and
              sample orders. MOQ from 50 units. Wholesale shipping to USA, UK,
              UAE, Canada, Australia, Singapore, and 20+ countries.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-lg text-sm font-medium transition-colors min-h-[44px]"
                data-ocid="about.cta_primary_button"
              >
                Contact Our Wholesale Team
              </Link>
              <a
                href="https://wa.me/917976341419?text=Hi%20Gemora%20Global%2C%20I%20want%20to%20know%20more%20about%20your%20wholesale%20imitation%20jewellery"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-sm font-medium transition-colors min-h-[44px]"
                data-ocid="about.whatsapp_button"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 fill-white flex-shrink-0"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp Us
              </a>
              <Link
                to="/products"
                className="inline-flex items-center justify-center border border-primary text-primary hover:bg-primary/10 px-8 py-3 rounded-lg text-sm font-medium transition-colors min-h-[44px]"
                data-ocid="about.products_button"
              >
                Browse Our Catalogue
              </Link>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
