import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { BASE_URL, usePageSEO } from "../../hooks/usePageSEO";

const FAQ = [
  {
    q: "What is Korean-style jewelry?",
    a: "Korean jewelry (K-jewelry) is inspired by K-beauty and K-pop aesthetics — featuring clean lines, pastel tones, dainty layering pieces, heart motifs, ribbon bows, and soft romantic designs that are highly popular on social media.",
  },
  {
    q: "What Korean jewelry styles do you wholesale?",
    a: "We offer Korean-style chain necklaces, small hoop earrings, bow and heart pendants, star motif studs, geometric layering sets, and pastel bead bracelets.",
  },
  {
    q: "Is Korean jewelry trending?",
    a: "Yes. Korean jewelry is one of the biggest global fashion jewelry trends, driven by K-pop, K-drama, and social media influencers on Instagram, Pinterest, and TikTok.",
  },
  {
    q: "What is MOQ for Korean jewelry wholesale?",
    a: "MOQ starts at 50 units per design. We offer assorted packs with multiple K-style designs for small-batch buyers.",
  },
];

export default function KoreanJewelry() {
  usePageSEO({
    title:
      "Korean Jewelry Style Online | K-Style Fashion Jewelry | Gemora Global",
    description:
      "Wholesale Korean-style jewelry from India — K-beauty inspired chains, bow pendants, heart studs, layering sets. Trending aesthetic jewelry. MOQ 50 pcs. Export USA, UK, UAE.",
    canonical: `${BASE_URL}/collections/korean-jewelry`,
    breadcrumbs: [
      { name: "Home", url: BASE_URL },
      { name: "Collections", url: `${BASE_URL}/products` },
      { name: "Korean Jewelry", url: `${BASE_URL}/collections/korean-jewelry` },
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
              / Korean Jewelry
            </nav>
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Korean-Style Jewelry — Trending K-Beauty Aesthetic
            </h1>
            <p className="text-muted-foreground max-w-2xl text-sm md:text-base">
              Wholesale Korean-style fashion jewelry from Gemora Global.
              K-beauty inspired chains, bow pendants, heart studs, minimalist
              hoops, and layering sets. Trending aesthetic jewelry. MOQ 50
              units. Global shipping.
            </p>
          </div>
        </div>

        <div className="container px-4 py-10 md:py-16">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h2 className="font-serif text-2xl font-bold mb-4">
                K-Style Jewelry Wholesale — The Biggest Trend in Fashion Jewelry
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The <strong>Korean jewelry trend</strong> has exploded globally,
                driven by the rise of K-pop, K-drama, and Korean beauty
                influencers on Instagram, Pinterest, and TikTok. Gemora Global's
                Korean-inspired jewelry collection captures this aesthetic
                perfectly — clean, romantic, delicate designs featuring heart
                motifs, bow pendants, satellite chains, star studs, and pastel
                bead accents.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our <strong>K-style jewelry</strong> is designed for boutiques
                and online retailers targeting Gen-Z and millennial buyers who
                want the social-media aesthetic at affordable prices. These
                pieces photograph beautifully, generate strong organic reach on
                Instagram and Pinterest, and have high repeat-purchase rates as
                buyers collect multiple designs.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong>Gen Z jewelry style</strong> — layering multiple
                delicate pieces — is the defining trend in Western markets. Our
                Korean jewelry range is perfectly suited for this: thin chains
                of varying lengths, mix-and-match earring sets, stacking ring
                assortments, and charm bracelets that buyers can customise for
                their personal style.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We update our Korean jewelry collection monthly based on viral
                trends from South Korean fashion brands, K-pop idol styling, and
                social media engagement data. Stockists who carry our K-style
                range consistently report it as a top-selling category with
                strong sell-through rates.
              </p>
            </div>
            <div className="space-y-4">
              <div className="bg-muted/30 rounded-xl p-5 border border-border">
                <h3 className="font-semibold mb-3">
                  🌸 K-Style Jewelry Designs
                </h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  {[
                    "Heart & Bow Pendant Necklaces",
                    "Satellite Chain Necklaces",
                    "Small Hoop & Huggie Earrings",
                    "Star & Moon Stud Earrings",
                    "Pearl Layering Sets",
                    "Charm Bracelets",
                    "Geometric Dainty Chains",
                    "Pastel Bead Accessories",
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
                  <li>Finish: Gold, Rhodium, Rose Gold</li>
                  <li>Style: K-beauty / Gen-Z aesthetic</li>
                  <li>Updates: Monthly new designs</li>
                  <li>Lead Time: 10–15 business days</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="font-serif text-2xl font-bold mb-4">
              Aesthetic Jewelry for Pinterest & Instagram Boutiques
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Korean jewelry is the engine of <strong>aesthetic jewelry</strong>{" "}
              culture online. If you sell through Instagram, TikTok Shop,
              Pinterest, or Etsy, our K-style collection gives you content-ready
              inventory that your audience will love. Clean, minimalist designs
              on white or marble backgrounds — our pieces photograph like
              ₹10,000 fine jewelry, even though they're affordable{" "}
              <Link
                to="/wholesale-imitation-jewellery"
                className="text-primary hover:underline"
              >
                wholesale imitation jewelry
              </Link>
              .
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Many of our Korean jewelry buyers are social media entrepreneurs
              who have built five- and six-figure online businesses around the
              K-aesthetic. We support these buyers with consistent new-design
              drops, assorted starter packs for first-time buyers, and reliable
              export shipping that keeps your inventory restocked fast.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Combine our{" "}
              <Link
                to="/collections/minimalist-jewelry"
                className="text-primary hover:underline"
              >
                minimalist jewelry
              </Link>{" "}
              with our Korean range for a complete "clean aesthetic" product
              line. WhatsApp us to discuss assorted packs and starter orders for
              new buyers.
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
                  ["/collections/minimalist-jewelry", "Minimalist"],
                  ["/collections/daily-wear-jewelry", "Daily Wear"],
                  ["/collections/earrings", "Earrings"],
                  ["/collections/necklaces", "Necklaces"],
                  ["/collections/trendy-jewelry", "Trendy"],
                  ["/collections/rings", "Rings"],
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
            data-ocid="korean.cta.section"
          >
            <h2 className="font-serif text-xl font-bold mb-2">
              Get Korean Jewelry Wholesale Catalogue
            </h2>
            <p className="text-white/80 mb-5 text-sm">
              WhatsApp for our K-style jewelry catalogue with current pricing
              and new monthly designs.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                asChild
                className="bg-accent text-primary font-bold hover:bg-accent/90"
                data-ocid="korean.cta.whatsapp"
              >
                <a
                  href="https://wa.me/917976341419?text=Hi%2C%20I%27m%20interested%20in%20Korean%20style%20jewelry%20wholesale%20from%20Gemora%20Global"
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
                data-ocid="korean.cta.products"
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
