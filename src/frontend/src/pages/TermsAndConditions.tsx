import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { usePageSEO } from "../hooks/usePageSEO";

export default function TermsAndConditions() {
  usePageSEO({
    title: "Terms & Conditions | Gemora Global — Wholesale Imitation Jewellery",
    description:
      "Terms and conditions for wholesale imitation jewellery purchases from Gemora Global. B2B wholesale context — ordering, pricing, shipping, intellectual property, and governing law.",
    canonical: "https://www.gemoraglobal.co/terms-and-conditions",
    ogTitle: "Terms & Conditions | Gemora Global",
    ogDescription:
      "Terms and conditions for wholesale imitation jewellery from Gemora Global. B2B wholesale policy — ordering, pricing, shipping, and governing law (Rajasthan, India).",
    schema: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Terms & Conditions — Gemora Global",
      url: "https://www.gemoraglobal.co/terms-and-conditions",
      publisher: {
        "@type": "Organization",
        name: "Gemora Global",
        url: "https://www.gemoraglobal.co",
      },
    },
  });

  const lastUpdated = "January 2025";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 sm:pt-28 pb-8 px-4 bg-gradient-to-b from-blue-50 to-background border-b border-blue-700/20">
        <div className="container max-w-3xl mx-auto">
          <nav
            aria-label="Breadcrumb"
            className="mb-4 flex items-center gap-1 text-xs text-muted-foreground"
          >
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span aria-hidden="true" className="mx-1">
              /
            </span>
            <span className="text-foreground font-medium">
              Terms &amp; Conditions
            </span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-primary mb-3">
            Terms &amp; Conditions
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated: {lastUpdated} · These terms govern all wholesale
            transactions with Gemora Global, Jaipur, Rajasthan, India.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 px-4">
        <div className="container max-w-3xl mx-auto space-y-8 text-sm sm:text-base text-muted-foreground leading-relaxed">
          {/* Acceptance */}
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-primary mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By placing a wholesale order, accessing our website, or engaging
              with Gemora Global for business purposes, you (&quot;Buyer&quot;,
              &quot;you&quot;) agree to be bound by these Terms and Conditions
              (&quot;Terms&quot;). These Terms constitute a legally binding
              agreement between you and Gemora Global (&quot;we&quot;,
              &quot;us&quot;, &quot;Seller&quot;), a proprietorship firm
              registered at B 66 MAA Hinglaj Nagar, Jaipur 302021, Rajasthan,
              India.
            </p>
            <p className="mt-3">
              If you do not agree to these Terms, you must not place orders or
              use our services. We reserve the right to update these Terms at
              any time. Continued engagement after updates constitutes
              acceptance.
            </p>
          </div>

          {/* Eligibility */}
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-primary mb-3">
              2. Eligibility & Wholesale Business Only
            </h2>
            <p>
              Gemora Global sells exclusively to B2B buyers — boutiques,
              retailers, distributors, wholesalers, and resellers. Our prices
              and terms are wholesale and intended for business buyers only, not
              for individual end consumers. By placing an order, you confirm
              that you are purchasing for commercial resale purposes, that you
              are 18 years of age or older, and that you are legally authorised
              to enter into business contracts in your jurisdiction.
            </p>
          </div>

          {/* Product Descriptions */}
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-primary mb-3">
              3. Product Descriptions
            </h2>
            <p>
              We make reasonable efforts to accurately describe our products
              including materials, dimensions, plating type, and finishes.
              However, the following should be noted:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>
                Colours may vary slightly from catalogue/website images due to
                screen calibration differences and photography lighting.
              </li>
              <li>
                Handcrafted jewellery items may have minor variations between
                individual pieces — this is inherent in artisan manufacturing
                and does not constitute a defect.
              </li>
              <li>
                Gemstone sizes and stone placement may vary by up to ±10% from
                sample pieces due to handcraft variability.
              </li>
              <li>
                Jewellery is described as imitation/fashion jewellery. We do not
                represent any piece as containing real gold, silver, diamonds,
                or precious gemstones unless explicitly stated.
              </li>
            </ul>
          </div>

          {/* Pricing & Payment */}
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-primary mb-3">
              4. Pricing &amp; Payment
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-foreground">Pricing:</strong> All prices
                are quoted in USD unless otherwise agreed in writing. Prices are
                ex-works from our Jaipur factory (excluding shipping, customs
                duties, and taxes in the buyer's country).
              </li>
              <li>
                <strong className="text-foreground">Price Validity:</strong>{" "}
                Quoted prices are valid for 30 days from the date of the
                Proforma Invoice. After 30 days, prices may be subject to
                revision due to material cost changes.
              </li>
              <li>
                <strong className="text-foreground">Payment Terms:</strong>{" "}
                Standard terms are 50% advance payment at order confirmation and
                50% balance before dispatch. Payment is accepted via
                international wire transfer (T/T/SWIFT) only.
              </li>
              <li>
                <strong className="text-foreground">Currency:</strong> Payment
                is accepted in USD, GBP, and EUR. Bank charges and currency
                conversion costs are the buyer's responsibility.
              </li>
              <li>
                <strong className="text-foreground">Taxes &amp; Duties:</strong>{" "}
                All prices are exclusive of customs duties, import taxes,
                GST/VAT, and any other charges in the buyer's country. These are
                entirely the buyer's responsibility.
              </li>
              <li>
                <strong className="text-foreground">Late Payment:</strong>{" "}
                Orders where the balance payment is not received within 7 days
                of dispatch-ready notification will be subject to a storage fee
                of 1% per week, and the order may be cancelled with the advance
                forfeited.
              </li>
            </ul>
          </div>

          {/* Order Processing */}
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-primary mb-3">
              5. Order Processing &amp; Lead Times
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-foreground">Order Confirmation:</strong>{" "}
                An order is confirmed only upon receipt of the advance payment
                and our written order confirmation (via email or WhatsApp).
              </li>
              <li>
                <strong className="text-foreground">Lead Time:</strong> Standard
                orders take 7–15 business days from order confirmation.
                Custom/OEM orders take 21–30 business days. Lead times are
                estimates and may vary during peak seasons (Diwali, Eid,
                Christmas).
              </li>
              <li>
                <strong className="text-foreground">
                  Minimum Order Quantity:
                </strong>{" "}
                MOQ is 50 units per design for standard orders and 500 units per
                design for custom/OEM orders.
              </li>
              <li>
                <strong className="text-foreground">
                  Order Modifications:
                </strong>{" "}
                Order modifications (design changes, quantity changes) may be
                accepted within 24 hours of order placement at no charge. After
                24 hours, modifications are subject to additional production
                charges.
              </li>
            </ul>
          </div>

          {/* Shipping */}
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-primary mb-3">
              6. Shipping &amp; Delivery
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-foreground">Carrier:</strong> We ship
                via DHL Express, FedEx International Priority, or India Post EMS
                as agreed. All express shipments are insured up to the declared
                value.
              </li>
              <li>
                <strong className="text-foreground">Risk of Loss:</strong> Risk
                of loss or damage to goods passes to the buyer upon handover to
                the courier at our Jaipur facility (FOB Jaipur). After handover,
                transit risk is covered by shipment insurance.
              </li>
              <li>
                <strong className="text-foreground">Delivery Estimates:</strong>{" "}
                Delivery times are estimates only and not guaranteed. We are not
                liable for delays caused by carrier issues, customs clearance
                delays, natural events, or force majeure.
              </li>
              <li>
                <strong className="text-foreground">Customs Clearance:</strong>{" "}
                The buyer is responsible for all customs clearance, import
                duties, and compliance with import regulations in their country.
                We provide complete export documentation to facilitate smooth
                customs clearance.
              </li>
              <li>
                <strong className="text-foreground">Refused Shipments:</strong>{" "}
                If a buyer refuses a shipment at customs or for any other
                reason, the buyer is responsible for all additional costs
                including return shipping, storage, and re-export charges.
              </li>
            </ul>
          </div>

          {/* Intellectual Property */}
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-primary mb-3">
              7. Intellectual Property
            </h2>
            <p>
              All product designs, images, catalogues, website content, brand
              names, trademarks, and trade dress of Gemora Global are our
              exclusive intellectual property. Buyers may not:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>
                Reproduce, distribute, or publicly display our catalogue images
                without written permission
              </li>
              <li>
                Pass off our designs as their own original creations for the
                purpose of claiming intellectual property rights
              </li>
              <li>
                Copy or reverse-engineer our jewellery designs for manufacturing
                purposes without entering into a formal OEM agreement
              </li>
              <li>
                Use the Gemora Global brand name, logo, or trademarks without
                written authorisation
              </li>
            </ul>
            <p className="mt-3">
              Buyers are granted a non-exclusive licence to use product images
              solely for the purpose of reselling Gemora Global products in
              their sales channels.
            </p>
          </div>

          {/* Warranties & Liability */}
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-primary mb-3">
              8. Warranties &amp; Limitation of Liability
            </h2>
            <p>
              Our jewellery is warranted against manufacturing defects for 7
              days from the date of delivery. Beyond this period, no warranty is
              provided. We do not warrant that our jewellery will be free from
              tarnishing under all conditions — our anti-tarnish coating extends
              the jewellery's life but does not provide a permanent guarantee
              against tarnishing.
            </p>
            <p className="mt-3">
              To the maximum extent permitted by law, Gemora Global's total
              liability to any buyer arising from any order shall not exceed the
              invoice value of that specific order. We are not liable for: loss
              of profit, loss of revenue, loss of business, indirect or
              consequential losses, or damages arising from buyer's resale
              activities.
            </p>
          </div>

          {/* Force Majeure */}
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-primary mb-3">
              9. Force Majeure
            </h2>
            <p>
              We are not liable for failure to perform any obligation under
              these Terms due to circumstances beyond our reasonable control
              including natural disasters, pandemics, government restrictions,
              transport strikes, customs authority actions, civil unrest, or
              acts of war. In such events, we will notify the buyer promptly and
              work to fulfil the order as soon as practicable.
            </p>
          </div>

          {/* Governing Law */}
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-primary mb-3">
              10. Governing Law &amp; Dispute Resolution
            </h2>
            <p>
              These Terms and Conditions are governed by the laws of Rajasthan,
              India, and the courts of Jaipur, Rajasthan shall have exclusive
              jurisdiction over any disputes arising from these Terms or from
              wholesale transactions with Gemora Global.
            </p>
            <p className="mt-3">
              In the event of a dispute, both parties agree to first attempt
              resolution through good-faith negotiation for 30 days before
              initiating formal legal proceedings. We welcome direct discussion
              and aim to resolve all commercial disputes amicably.
            </p>
          </div>

          {/* Entire Agreement */}
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-primary mb-3">
              11. Entire Agreement
            </h2>
            <p>
              These Terms, together with any written order confirmation,
              Proforma Invoice, and applicable export documentation, constitute
              the entire agreement between Gemora Global and the buyer for each
              wholesale transaction. These Terms supersede all prior oral or
              written agreements regarding the subject matter hereof.
            </p>
          </div>

          {/* Contact */}
          <div className="border border-blue-700/20 rounded-xl p-5 bg-card">
            <h2 className="text-lg sm:text-xl font-serif font-bold text-primary mb-3">
              Contact Us
            </h2>
            <address className="not-italic space-y-1 text-sm">
              <p>
                <strong className="text-foreground">Gemora Global</strong>
              </p>
              <p>B 66 MAA Hinglaj Nagar, Jaipur 302021, Rajasthan, India</p>
              <p>
                Email:{" "}
                <a
                  href="mailto:globalgemora@gmail.com"
                  className="text-primary hover:underline"
                >
                  globalgemora@gmail.com
                </a>
              </p>
              <p>
                WhatsApp:{" "}
                <a
                  href="https://wa.me/917976341419"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  +91 7976341419
                </a>
              </p>
            </address>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="py-8 px-4 border-t border-border">
        <div className="container max-w-3xl mx-auto">
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground justify-center">
            <Link
              to="/privacy-policy"
              className="text-sky-500 hover:underline"
              data-ocid="terms.link"
            >
              Privacy Policy
            </Link>
            <span>·</span>
            <Link
              to="/return-refund-cancellation-policy"
              className="text-sky-500 hover:underline"
              data-ocid="terms.link"
            >
              Return &amp; Refund Policy
            </Link>
            <span>·</span>
            <Link
              to="/faq"
              className="text-sky-500 hover:underline"
              data-ocid="terms.link"
            >
              FAQ
            </Link>
            <span>·</span>
            <Link
              to="/contact"
              className="text-sky-500 hover:underline"
              data-ocid="terms.link"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

