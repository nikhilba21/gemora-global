import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { usePageSEO } from "../hooks/usePageSEO";

const FAQ_CATEGORIES = [
  {
    id: "ordering",
    title: "Ordering & MOQ",
    icon: "📦",
    questions: [
      {
        q: "What is the minimum order quantity (MOQ) at Gemora Global?",
        a: "Our standard MOQ is 50 units per design. You can mix different designs within a single order as long as the total quantity meets the minimum. For example, you can order 50 units across 2 designs (25 units each). For custom OEM and private label orders, the MOQ is 500 units per design.",
      },
      {
        q: "Can I place a trial or sample order before a bulk order?",
        a: "Yes. We offer sample orders of 1–10 pieces per design at wholesale prices plus DHL shipping charges. Sample orders are dispatched within 48 hours of payment. We encourage new buyers to sample our quality before committing to a bulk wholesale order.",
      },
      {
        q: "How do I place an order with Gemora Global?",
        a: "The easiest way is via WhatsApp (+91 7976341419). Browse our digital catalogue, select designs, and send us your design codes and quantities. We will issue a Proforma Invoice within 24 hours. You can also email us at globalgemora@gmail.com or use the Contact form on our website.",
      },
      {
        q: "Can I order a mix of different jewellery categories in one order?",
        a: "Absolutely. You can mix necklace sets, earrings, bangles, bridal sets, and any other category within a single order. Each design requires a minimum of 50 units, but you can combine as many designs as you wish in one shipment.",
      },
      {
        q: "Do you offer custom or OEM jewellery manufacturing?",
        a: "Yes. Gemora Global offers custom jewellery manufacturing, OEM production, and private label services. Minimum order for custom designs is 500 units per design with a 3–4 week production lead time. You can provide your own design sketches or select from our design library as a starting point.",
      },
    ],
  },
  {
    id: "products",
    title: "Products & Quality",
    icon: "💎",
    questions: [
      {
        q: "What types of imitation jewellery does Gemora Global manufacture?",
        a: "We manufacture a complete range of Indian imitation and fashion jewellery: necklace sets, earrings (jhumkas, chandbalis, studs, hoops), bangles, bracelets, bridal sets, Kundan jewellery, Meenakari jewellery, Temple jewellery, oxidised jewellery, American Diamond (CZ) jewellery, gold-plated jewellery, Indo-Western jewellery, and more. We stock 500+ active designs refreshed every season.",
      },
      {
        q: "What plating finishes do you offer?",
        a: "We offer Gold Plating (22K), Matte Gold Plating, Rhodium Plating, Rose Gold Plating, Oxidised/Antique Plating, Black Plating, Mehndi Plating, 2-Tone Plating, and 3-Tone Plating. All plating uses a multi-layer anti-tarnish coating to ensure durability.",
      },
      {
        q: "How long does the anti-tarnish coating last?",
        a: "Our multi-layer anti-tarnish coating typically maintains quality for 12–24 months under normal wear conditions. The coating is designed to be resistant to sweat, humidity, and perfume contact. Pieces should be stored in the pouches provided and kept away from water.",
      },
      {
        q: "Are your jewellery pieces nickel-free?",
        a: "We use nickel-free plating processes. For buyers requiring compliance with EU/UK Nickel Directive standards, we can provide material declarations and composition sheets on request. We recommend EU/UK buyers review these materials with their compliance team.",
      },
      {
        q: "How is quality controlled at Gemora Global?",
        a: "Each piece undergoes a 3-stage quality control process: post-production inspection, plating quality check, and pre-packaging final inspection. We share photographic QC reports for all bulk orders before dispatch. Any pieces that do not meet our quality standards are rejected and remanufactured.",
      },
    ],
  },
  {
    id: "shipping",
    title: "Shipping & Delivery",
    icon: "✈️",
    questions: [
      {
        q: "Which countries does Gemora Global ship to?",
        a: "We ship wholesale jewellery to 30+ countries including USA, UK, UAE, Saudi Arabia, Kuwait, Australia, Canada, Singapore, Malaysia, Sri Lanka, Nigeria, France, Germany, and across Europe, Southeast Asia, and Africa. Contact us if your country is not listed — we likely ship there too.",
      },
      {
        q: "How long does international shipping take?",
        a: "Delivery times vary by destination: USA (7–12 days via DHL), UK (5–8 days), UAE/Kuwait/Saudi Arabia (7–10 days), Australia (8–12 days), Canada (8–12 days), Singapore (3–5 days), Malaysia (4–7 days), Sri Lanka (3–5 days). Economy shipping options are available at lower cost.",
      },
      {
        q: "What shipping carriers do you use?",
        a: "We primarily use DHL Express and FedEx International Priority for reliable, trackable global delivery. For economy shipping, we use India Post EMS. All express shipments are fully insured and come with door-to-door tracking.",
      },
      {
        q: "Do you provide export documentation?",
        a: "Yes. All international wholesale shipments include: Commercial Invoice, Packing List, Certificate of Origin, Airway Bill, and GST-compliant export invoice. We can also provide material declarations, HS code documentation, and any country-specific documentation required for customs clearance.",
      },
      {
        q: "Do I need to pay customs duties on jewellery imports from India?",
        a: "Customs duties vary by destination country. Some countries (like GCC states) have minimal duties on jewellery imports from India. Others (like the UK and EU) may levy import duty and VAT/GST. We recommend buyers check applicable customs duties with their local customs agent before ordering. We provide all documentation needed for customs clearance.",
      },
    ],
  },
  {
    id: "payment",
    title: "Payment & Pricing",
    icon: "💳",
    questions: [
      {
        q: "What payment methods does Gemora Global accept?",
        a: "We accept international wire transfer (T/T / SWIFT bank transfer) in USD, GBP, EUR, and AED. For smaller orders, we also accept Western Union and payment apps. Cryptocurrency payments are not accepted. We do not accept credit card payments.",
      },
      {
        q: "What are your payment terms for new buyers?",
        a: "For new buyers, payment terms are 50% advance at order confirmation and 50% balance before dispatch. Once you have completed 3+ orders without payment issues, you may qualify for 30-day credit terms. For sample orders, 100% advance payment is required.",
      },
      {
        q: "Can I get a price list?",
        a: "Yes. Contact us via WhatsApp (+91 7976341419) or email (globalgemora@gmail.com) to receive our wholesale price list with current pricing. Prices vary by design, material, plating type, and order quantity. We quote in USD for international orders.",
      },
      {
        q: "Do you offer volume discounts?",
        a: "Yes. Orders of 200+ units per design receive a 10% discount. Orders of 500+ units per design receive a 20% discount. Orders above 1,000 units per design: contact us for special pricing. Discounts apply to the per-unit wholesale price.",
      },
      {
        q: "What is your pricing range?",
        a: "Wholesale prices range from USD $1.50 per piece (for basic earrings) to USD $25 per piece (for elaborate bridal sets). Average wholesale price per piece is USD $3–$8. Our factory-direct model gives you 15–30% cost advantage over agent-sourced alternatives.",
      },
    ],
  },
  {
    id: "returns",
    title: "Returns & Replacements",
    icon: "🔄",
    questions: [
      {
        q: "What is your return policy for wholesale orders?",
        a: "We accept returns within 7 days of delivery for items that are: (1) damaged in transit, (2) received with a manufacturing defect, or (3) incorrect items shipped vs. what was ordered. All returns must be reported via email or WhatsApp with photographic evidence within 7 days of receipt.",
      },
      {
        q: "Can I return jewellery if I change my mind or if it doesn't sell?",
        a: "No. Returns are not accepted for reasons of change of mind, market conditions, or items not matching personal aesthetic preference. Our wholesale policy is designed for B2B buyers — we strongly recommend ordering samples before placing bulk orders.",
      },
      {
        q: "What happens if items arrive damaged?",
        a: "If items arrive damaged, email photographic evidence to globalgemora@gmail.com within 7 days of receipt. We will offer a replacement, credit note, or refund at our discretion. All express shipments are insured, and we will process insurance claims on your behalf for transit damage.",
      },
      {
        q: "How long does a refund take?",
        a: "Approved refunds are processed within 5–7 business days via the original payment method (bank wire transfer). Refunds for international transfers may take an additional 3–5 banking days to appear in your account.",
      },
    ],
  },
];

const ALL_FAQS = FAQ_CATEGORIES.flatMap((cat) => cat.questions);

export default function FAQ() {
  usePageSEO({
    title:
      "FAQ — Frequently Asked Questions | Gemora Global Wholesale Jewellery",
    description:
      "Find answers to all your questions about wholesale imitation jewellery from Gemora Global — MOQ, shipping, payment terms, returns policy, product quality, and ordering process.",
    canonical: "https://gemoraglobal-tje.caffeine.xyz/faq",
    ogTitle: "FAQ — Gemora Global Wholesale Imitation Jewellery",
    ogDescription:
      "Answers to 20+ frequently asked questions about wholesale imitation jewellery from Gemora Global — MOQ, shipping, returns, pricing, and more.",
    schema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: ALL_FAQS.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    },
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 sm:pt-28 pb-10 px-4 bg-gradient-to-b from-blue-50 to-background border-b border-blue-700/20">
        <div className="container max-w-4xl mx-auto text-center">
          <nav
            aria-label="Breadcrumb"
            className="mb-4 flex items-center justify-center gap-1 text-xs text-muted-foreground"
          >
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span aria-hidden="true" className="mx-1">
              /
            </span>
            <span className="text-foreground font-medium">FAQ</span>
          </nav>
          <p className="text-xs uppercase tracking-widest text-sky-500 mb-3 font-semibold">
            Help &amp; Support
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-primary leading-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto mb-6">
            Everything you need to know about wholesale imitation jewellery from
            Gemora Global — ordering, shipping, pricing, and returns. Can't find
            your answer?{" "}
            <Link
              to="/contact"
              className="text-primary hover:underline font-medium"
            >
              Contact our team
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Category Nav */}
      <section className="py-6 px-4 bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="container max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {FAQ_CATEGORIES.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-blue-700/30 bg-background text-xs font-medium hover:border-blue-500 hover:bg-blue-50/50 transition-colors"
                data-ocid="faq.tab"
              >
                <span>{cat.icon}</span>
                <span>{cat.title}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-12 px-4">
        <div className="container max-w-4xl mx-auto space-y-16">
          {FAQ_CATEGORIES.map((cat) => (
            <div key={cat.id} id={cat.id}>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl" aria-hidden="true">
                  {cat.icon}
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary">
                  {cat.title}
                </h2>
              </div>
              <div
                className="space-y-3"
                itemScope
                itemType="https://schema.org/FAQPage"
                data-ocid="faq.category.list"
              >
                {cat.questions.map((faq, i) => (
                  <details
                    key={faq.q}
                    className="group border border-blue-700/20 rounded-xl bg-card overflow-hidden"
                    itemScope
                    itemProp="mainEntity"
                    itemType="https://schema.org/Question"
                    data-ocid={`faq.${cat.id}.item.${i + 1}`}
                  >
                    <summary className="flex items-start justify-between px-5 py-4 cursor-pointer font-semibold text-foreground hover:text-primary transition-colors min-h-[52px] gap-3">
                      <span
                        itemProp="name"
                        className="text-sm sm:text-base leading-snug"
                      >
                        {faq.q}
                      </span>
                      <span className="text-sky-500 ml-2 shrink-0 mt-0.5 group-open:rotate-45 transition-transform text-lg leading-none">
                        +
                      </span>
                    </summary>
                    <div
                      itemScope
                      itemProp="acceptedAnswer"
                      itemType="https://schema.org/Answer"
                    >
                      <p
                        className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed"
                        itemProp="text"
                      >
                        {faq.a}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Still have questions CTA */}
      <section className="py-12 px-4 bg-gradient-to-r from-blue-900/15 to-blue-700/10 border-y border-blue-700/20">
        <div className="container max-w-3xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-primary mb-3">
            Still Have Questions?
          </h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Our export team is available Monday–Saturday, 9am–7pm IST. We
            respond to all inquiries within one business day.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/917976341419?text=Hi%20Gemora%20Global%2C%20I%20have%20a%20question%20about%20wholesale%20jewellery"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-800 hover:bg-blue-700 text-white font-bold text-sm transition-colors min-h-[44px]"
              data-ocid="faq.whatsapp_button"
            >
              💬 WhatsApp Us
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-blue-700/50 hover:border-blue-500 text-foreground font-medium text-sm transition-colors min-h-[44px]"
              data-ocid="faq.contact_button"
            >
              Send Email Inquiry
            </Link>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="py-8 px-4 border-t border-border">
        <div className="container max-w-4xl mx-auto">
          <p className="text-center text-xs text-muted-foreground mb-3">
            Related pages:
          </p>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-2 text-xs">
            {[
              { to: "/wholesale", label: "Wholesale Pricing" },
              { to: "/products", label: "View Products" },
              { to: "/contact", label: "Contact Us" },
              {
                to: "/return-refund-cancellation-policy",
                label: "Returns Policy",
              },
              { to: "/privacy-policy", label: "Privacy Policy" },
              { to: "/terms-and-conditions", label: "Terms & Conditions" },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sky-500 hover:underline"
                data-ocid="faq.link"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
