import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { usePageSEO } from "../../hooks/usePageSEO";

export interface CollectionPageData {
  slug: string;
  title: string;
  metaTitle: string;
  metaDesc: string;
  h2: string;
  intro: string;
  body: string;
  keywords: string[];
  category: string;
}

export function CollectionPageTemplate({ p }: { p: CollectionPageData }) {
  usePageSEO({
    title: p.metaTitle,
    description: p.metaDesc,
    canonical: `https://www.gemoraglobal.co/collections/${p.slug}`,
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
              <Link to="/products" className="hover:text-primary">
                Collections
              </Link>
              {" / "}
              {p.title}
            </nav>
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              {p.title}
            </h1>
            <p className="text-muted-foreground max-w-2xl text-sm md:text-base">
              {p.intro}
            </p>
          </div>
        </div>
        <div className="container px-4 py-10 md:py-16">
          <div className="max-w-3xl mb-10">
            <h2 className="font-serif text-2xl font-bold mb-4">{p.h2}</h2>
            {p.body.split("\n\n").map((para) => (
              <p
                key={para.slice(0, 30)}
                className="text-muted-foreground leading-relaxed mb-4 text-sm md:text-base"
              >
                {para}
              </p>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mb-10">
            {p.keywords.map((kw) => (
              <span
                key={kw}
                className="bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1 text-xs font-medium"
              >
                {kw}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="bg-primary text-primary-foreground">
              <Link
                to={`/products?category=${p.category}`}
                data-ocid={`collection.${p.slug}.shop_button`}
              >
                Shop {p.title}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-primary text-primary"
            >
              <a
                href={`https://wa.me/917976341419?text=Hi%2C%20I%27m%20interested%20in%20${encodeURIComponent(p.title)}%20wholesale`}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp Inquiry
              </a>
            </Button>
            <Button asChild variant="outline">
              <Link to="/wholesale">View Wholesale Terms</Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
