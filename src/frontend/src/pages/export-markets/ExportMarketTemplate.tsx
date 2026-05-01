import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { usePageSEO } from "../../hooks/usePageSEO";

export interface ExportMarketData {
  slug: string;
  country: string;
  flag: string;
  metaTitle: string;
  metaDesc: string;
  h1: string;
  intro: string;
  body: string;
  keyPoints: string[];
  whatsappText: string;
}

export function ExportMarketTemplate({ p }: { p: ExportMarketData }) {
  usePageSEO({
    title: p.metaTitle,
    description: p.metaDesc,
    canonical: `https://www.gemoraglobal.co/export-markets/${p.slug}`,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <div className="bg-card border-b border-border py-8 md:py-12 px-4">
          <div className="container">
            <nav className="text-xs text-muted-foreground mb-3">
              <Link to="/" className="hover:text-primary">
                Home
              </Link>
              {" / "}
              <Link to="/global-markets" className="hover:text-primary">
                Export Markets
              </Link>
              {" / "}
              {p.country}
            </nav>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl" role="img" aria-label={p.country}>
                {p.flag}
              </span>
              <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold">
                {p.h1}
              </h1>
            </div>
            <p className="text-muted-foreground max-w-2xl text-sm md:text-base">
              {p.intro}
            </p>
          </div>
        </div>
        <div className="container px-4 py-10 md:py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="prose max-w-none">
                {p.body.split("\n\n").map((para) => (
                  <p
                    key={para.slice(0, 30)}
                    className="text-muted-foreground leading-relaxed mb-4 text-sm md:text-base"
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
                <h3 className="font-semibold mb-3 text-sm">
                  Why Choose Gemora Global for {p.country}?
                </h3>
                <ul className="space-y-2">
                  {p.keyPoints.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2 text-xs text-muted-foreground"
                    >
                      <span className="text-primary mt-0.5 shrink-0">✓</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-semibold mb-3 text-sm">
                  Get a Wholesale Quote
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Contact our {p.country} export team for pricing, MOQ, and
                  shipping details.
                </p>
                <Button
                  asChild
                  className="bg-primary text-primary-foreground w-full mb-2"
                  data-ocid={`export.${p.slug}.whatsapp_button`}
                >
                  <a
                    href={`https://wa.me/917976341419?text=${encodeURIComponent(p.whatsappText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp Now
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-primary text-primary"
                >
                  <Link to="/contact">Send Inquiry</Link>
                </Button>
              </div>
              <div className="bg-muted/30 rounded-xl p-4 text-xs text-muted-foreground space-y-1.5">
                <p>
                  <strong>MOQ:</strong> 50 units per design
                </p>
                <p>
                  <strong>Lead Time:</strong> 10–15 days
                </p>
                <p>
                  <strong>Shipping:</strong> DHL, FedEx, Air Cargo
                </p>
                <p>
                  <strong>Payment:</strong> T/T, LC, Western Union
                </p>
                <p>
                  <strong>Origin:</strong> Jaipur, Rajasthan, India
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border">
            <h2 className="font-serif text-xl font-bold mb-4">
              Explore Our Collections
            </h2>
            <div className="flex flex-wrap gap-2">
              {[
                "Earrings",
                "Necklaces",
                "Bangles",
                "Rings",
                "Bridal Sets",
                "Oxidised Jewelry",
                "Minimalist",
              ].map((cat) => (
                <Link
                  key={cat}
                  to="/products"
                  className="bg-card border border-border rounded-full px-4 py-2 text-xs font-medium hover:border-primary hover:text-primary transition-colors"
                >
                  {cat}
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
