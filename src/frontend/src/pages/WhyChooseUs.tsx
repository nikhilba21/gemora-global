import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { usePageSEO } from "../hooks/usePageSEO";
import { useCanonical } from '../hooks/useCanonical';

const REASONS = [
  {
    icon: "🏷️",
    title: "10+ Years of Export Experience",
    body: "Since 2013, we have completed thousands of export shipments to over 15 countries. We understand the documentation requirements, duty structures, and delivery expectations of buyers in the UAE, France, UK, USA, and across Europe. Our export team manages the entire process from factory floor to your warehouse — you simply receive your goods, on time and to specification.",
  },
  {
    icon: "✨",
    title: "Anti-Tarnish Finishing — Our Quality Guarantee",
    body: "Our anti-tarnish finishing process is one of the most requested features among our international buyers. Standard imitation jewellery tarnishes within weeks of retail display — a major issue for boutiques and their customers. Gemora Global's multi-layer anti-tarnish coating dramatically extends the wearable life of each piece, reducing your customer return rate and protecting your brand reputation.",
  },
  {
    icon: "🎨",
    title: "500+ Seasonal Designs",
    body: "Our design studio releases 3–4 new collections per year, tracking trend reports from Paris, Dubai, and New York fashion markets. With 500+ active designs across all categories — and new additions each season — you will always have fresh inventory to offer your customers. We also accept custom design briefs for buyers who want exclusive or co-branded collections.",
  },
  {
    icon: "💰",
    title: "Factory-Direct Pricing",
    body: "Because you buy directly from our manufacturing facility — not through an agent or trading company — you benefit from the most competitive pricing available in the Indian market. Factory-direct purchasing typically saves buyers 15–30% compared to agent-sourced alternatives, on identical quality.",
  },
  {
    icon: "🤝",
    title: "End-to-End Export Support",
    body: "Sourcing imitation jewellery internationally involves real risk — inconsistent quality, unreliable suppliers, and complicated logistics. Gemora Global was built specifically to eliminate those risks for overseas wholesale buyers. Our team handles all documentation, customs, and shipping — making your purchasing experience as smooth as possible.",
  },
];

const FAQ = [
  {
    q: "What is the MOQ for Gemora Global?",
    a: "Minimum order quantity starts from 50 units per design for most categories.",
  },
  {
    q: "Do you offer custom jewellery designs?",
    a: "Yes, custom designs are available for orders of 500+ units with 3–4 weeks lead time.",
  },
  {
    q: "Which countries do you export to?",
    a: "UAE, France, USA, UK, Germany, Canada, Australia, Singapore and 10+ more countries.",
  },
];

export default function WhyChooseUs() {
  useCanonical();
  usePageSEO({
    title:
      "Why Choose Gemora Global — India's Trusted Imitation Jewellery Exporter",
    description:
      "10+ years of export experience, anti-tarnish finishing, 500+ designs, factory-direct pricing, and reliable global shipping. Discover why boutiques and wholesalers in 15+ countries choose Gemora Global.",
    canonical: "https://www.gemoraglobal.co/why-choose-us",
    ogTitle:
      "Why Choose Gemora Global — India's Trusted Imitation Jewellery Exporter",
    ogImage:
      "https://www.gemoraglobal.co/images/og-why-choose-us.jpg",
    faqItems: FAQ,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Hero — proper height on mobile */}
        <div className="bg-card border-b border-border py-10 md:py-16 px-4">
          <div className="container px-0 text-center">
            <h1 className="font-serif text-2xl sm:text-3xl md:text-5xl font-bold mb-4 leading-tight">
              Why Wholesale Buyers Around the World Choose Gemora Global
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
              Sourcing imitation jewellery internationally involves real risk —
              inconsistent quality, unreliable suppliers, and complicated
              logistics. Gemora Global was built specifically to eliminate those
              risks for overseas wholesale buyers. Browse our{" "}
              <Link to="/products" className="text-primary hover:underline">
                product catalogue
              </Link>{" "}
              or explore our{" "}
              <Link to="/wholesale" className="text-primary hover:underline">
                wholesale pricing
              </Link>
              .
            </p>
          </div>
        </div>

        {/* Reasons — feature grid: grid-cols-1 on mobile */}
        <div className="container py-10 md:py-16 space-y-4 md:space-y-8 px-4">
          {REASONS.map((r) => (
            <div
              key={r.title}
              className="bg-card border border-border rounded-xl p-5 md:p-8 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start gap-4 md:gap-6">
                <div
                  className="text-4xl md:text-5xl flex-shrink-0 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center"
                  aria-hidden="true"
                >
                  {r.icon}
                </div>
                <div className="min-w-0">
                  <h2 className="font-serif text-lg md:text-2xl font-bold mb-2 md:mb-3 text-primary leading-tight">
                    {r.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                    {r.body}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="bg-primary/10 border-y border-primary/20 py-12 md:py-16 px-4">
          <div className="container">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="max-w-2xl mx-auto space-y-4 md:space-y-6">
              {FAQ.map((f) => (
                <div
                  key={f.q}
                  className="bg-card border border-border rounded-xl p-5 md:p-6"
                >
                  <h3 className="font-semibold mb-2 text-sm md:text-base">
                    {f.q}
                  </h3>
                  <p className="text-muted-foreground text-sm">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA — full-width buttons on mobile */}
        <div className="container py-12 md:py-16 text-center px-4">
          <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">
            Ready to Start Sourcing?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8 text-sm md:text-base">
            Join thousands of boutiques and wholesalers who trust Gemora Global
            for premium imitation jewellery. View our{" "}
            <Link to="/gallery" className="text-primary hover:underline">
              gallery
            </Link>{" "}
            or{" "}
            <Link to="/contact" className="text-primary hover:underline">
              send an inquiry
            </Link>
            .
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 w-full sm:w-auto min-h-[48px]"
            >
              <Link to="/contact">Send Inquiry Now</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10 px-10 w-full sm:w-auto min-h-[48px]"
            >
              <Link to="/products">Browse Products</Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
