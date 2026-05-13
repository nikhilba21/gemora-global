import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { usePageSEO } from "../hooks/usePageSEO";

export default function PrivacyPolicy() {
  usePageSEO({
    title: "Privacy Policy | Gemora Global — Imitation Jewellery Exporter",
    description:
      "Gemora Global privacy policy — how we collect, use, and protect your personal data. B2B wholesale imitation jewellery export from Jaipur, India.",
    canonical: "https://www.gemoraglobal.co/privacy-policy",
    ogTitle: "Privacy Policy | Gemora Global",
    ogDescription:
      "Gemora Global privacy policy — how we collect, use, and protect your personal data.",
    schema: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Privacy Policy — Gemora Global",
      url: "https://www.gemoraglobal.co/privacy-policy",
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
            <span className="text-foreground font-medium">Privacy Policy</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-primary mb-3">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated: {lastUpdated} · Gemora Global, B 66 MAA Hinglaj Nagar,
            Jaipur 302021, Rajasthan, India
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 px-4">
        <div className="container max-w-3xl mx-auto prose-style space-y-8 text-sm sm:text-base text-muted-foreground leading-relaxed">
          {/* Introduction */}
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-primary mb-3">
              1. Introduction
            </h2>
            <p>
              Gemora Global (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is
              a B2B imitation jewellery manufacturer and exporter based at B 66
              MAA Hinglaj Nagar, Jaipur 302021, Rajasthan, India. This Privacy
              Policy explains how we collect, use, disclose, and protect
              personal information provided by visitors to our website (
              <a
                href="https://www.gemoraglobal.co"
                className="text-primary hover:underline"
              >
                www.gemoraglobal.co
              </a>
              ) and customers who engage with our wholesale services.
            </p>
            <p className="mt-3">
              By using our website or contacting us for business purposes, you
              agree to the collection and use of information in accordance with
              this policy. If you do not agree, please refrain from using our
              services.
            </p>
          </div>

          {/* Data Collection */}
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-primary mb-3">
              2. Information We Collect
            </h2>
            <p>
              We collect the following categories of personal and business
              information:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>
                <strong className="text-foreground">
                  Contact Information:
                </strong>{" "}
                Your name, email address, phone number (including WhatsApp), and
                business name provided via our inquiry forms, WhatsApp, or
                email.
              </li>
              <li>
                <strong className="text-foreground">
                  Business Information:
                </strong>{" "}
                Company name, business address, country of operation, type of
                business (retailer, distributor, boutique), and import/wholesale
                requirements.
              </li>
              <li>
                <strong className="text-foreground">Order Information:</strong>{" "}
                Product selections, quantities, delivery address, and payment
                records for wholesale orders placed with Gemora Global.
              </li>
              <li>
                <strong className="text-foreground">Website Usage Data:</strong>{" "}
                Browser type, IP address, pages visited, time spent on pages,
                referral source, and device information. Collected automatically
                via cookies and analytics tools (Google Analytics).
              </li>
              <li>
                <strong className="text-foreground">Communications:</strong>{" "}
                Messages sent via our contact form, email, or WhatsApp. We may
                retain business communications for our records.
              </li>
            </ul>
          </div>

          {/* How We Use Data */}
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-primary mb-3">
              3. How We Use Your Information
            </h2>
            <p>We use the information collected for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>
                <strong className="text-foreground">Order Processing:</strong>{" "}
                To process wholesale orders, issue invoices, arrange shipping,
                and manage customer accounts.
              </li>
              <li>
                <strong className="text-foreground">
                  Customer Communication:
                </strong>{" "}
                To respond to inquiries, send quotations, dispatch
                notifications, and provide post-order support.
              </li>
              <li>
                <strong className="text-foreground">
                  Catalogue &amp; Marketing:
                </strong>{" "}
                To send our product catalogue, new arrivals, seasonal lookbooks,
                and promotional communications to registered wholesale buyers.
                You may opt out at any time.
              </li>
              <li>
                <strong className="text-foreground">
                  Website Improvement:
                </strong>{" "}
                To analyse website traffic, understand user behaviour, and
                improve our website content and user experience.
              </li>
              <li>
                <strong className="text-foreground">Legal Compliance:</strong>{" "}
                To comply with applicable laws, export regulations, GST
                requirements, and legal obligations under Indian law.
              </li>
            </ul>
          </div>

          {/* Cookies */}
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-primary mb-3">
              4. Cookies
            </h2>
            <p>
              Our website uses cookies to enhance your browsing experience.
              Cookies are small text files placed on your device that help us
              understand how visitors use our site. We use:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>
                <strong className="text-foreground">Necessary Cookies:</strong>{" "}
                Required for basic website functionality. Cannot be disabled.
              </li>
              <li>
                <strong className="text-foreground">Analytics Cookies:</strong>{" "}
                Google Analytics cookies (anonymised) to track page visits,
                traffic sources, and user behaviour. You can opt out via
                Google's opt-out browser add-on.
              </li>
              <li>
                <strong className="text-foreground">Preference Cookies:</strong>{" "}
                Remember your preferences (e.g. cookie consent status) to avoid
                showing the same notices repeatedly.
              </li>
            </ul>
            <p className="mt-3">
              You can manage cookie settings via your browser settings. Blocking
              certain cookies may affect website functionality.
            </p>
          </div>

          {/* Third Party Sharing */}
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-primary mb-3">
              5. Third-Party Sharing
            </h2>
            <p>
              We do not sell, rent, or trade your personal information to third
              parties for marketing purposes. We may share data with:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>
                <strong className="text-foreground">Shipping Partners:</strong>{" "}
                DHL, FedEx, India Post — order and delivery address shared to
                arrange international shipments.
              </li>
              <li>
                <strong className="text-foreground">Payment Processors:</strong>{" "}
                Banking partners for wire transfer processing. We do not store
                complete payment details.
              </li>
              <li>
                <strong className="text-foreground">
                  Analytics Providers:
                </strong>{" "}
                Google Analytics (anonymised, aggregate data only).
              </li>
              <li>
                <strong className="text-foreground">Legal Authorities:</strong>{" "}
                Where required by Indian law, court order, or export regulation
                compliance.
              </li>
            </ul>
          </div>

          {/* Data Security */}
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-primary mb-3">
              6. Data Security
            </h2>
            <p>
              We implement reasonable technical and organisational security
              measures to protect your personal information from unauthorised
              access, disclosure, alteration, or destruction. Our website
              operates over HTTPS (SSL encryption). However, no internet
              transmission is completely secure, and we cannot guarantee
              absolute security of transmitted data.
            </p>
            <p className="mt-3">
              Order records and business communications are stored securely and
              accessible only to authorised Gemora Global staff involved in
              order processing and customer service.
            </p>
          </div>

          {/* Data Retention */}
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-primary mb-3">
              7. Data Retention
            </h2>
            <p>
              We retain customer and order data for as long as necessary to
              fulfil orders, comply with legal obligations (including GST
              record-keeping requirements under Indian tax law), resolve
              disputes, and maintain business records. Inquiry data from
              non-customers is retained for up to 12 months. You may request
              deletion of your data by contacting us (subject to legal retention
              obligations).
            </p>
          </div>

          {/* Your Rights */}
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-primary mb-3">
              8. Your Rights
            </h2>
            <p>
              Depending on your jurisdiction, you may have the following rights
              regarding your personal data:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>
                <strong className="text-foreground">Access:</strong> Request a
                copy of personal data we hold about you.
              </li>
              <li>
                <strong className="text-foreground">Correction:</strong> Request
                correction of inaccurate data.
              </li>
              <li>
                <strong className="text-foreground">Deletion:</strong> Request
                deletion of your data (subject to legal retention requirements).
              </li>
              <li>
                <strong className="text-foreground">Opt-Out:</strong>{" "}
                Unsubscribe from marketing communications at any time by
                contacting us.
              </li>
              <li>
                <strong className="text-foreground">Complaint:</strong> Lodge a
                complaint with your local data protection authority.
              </li>
            </ul>
            <p className="mt-3">
              To exercise these rights, email us at{" "}
              <a
                href="mailto:globalgemora@gmail.com"
                className="text-primary hover:underline"
              >
                globalgemora@gmail.com
              </a>
              .
            </p>
          </div>

          {/* Children */}
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-primary mb-3">
              9. Children's Privacy
            </h2>
            <p>
              Our website and services are intended for B2B buyers aged 18 and
              above. We do not knowingly collect personal information from
              individuals under 18 years of age. If we become aware that a child
              under 18 has provided us with personal information, we will delete
              it immediately.
            </p>
          </div>

          {/* Changes */}
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-primary mb-3">
              10. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. The updated
              date at the top of this page will reflect any changes. Continued
              use of our website after changes constitutes acceptance of the
              revised policy. We recommend reviewing this page periodically.
            </p>
          </div>

          {/* Contact */}
          <div className="border border-blue-700/20 rounded-xl p-5 bg-card">
            <h2 className="text-lg sm:text-xl font-serif font-bold text-primary mb-3">
              11. Contact Us
            </h2>
            <p className="mb-3">
              For privacy-related queries or to exercise your data rights,
              contact us:
            </p>
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
              to="/terms-and-conditions"
              className="text-sky-500 hover:underline"
              data-ocid="privacy.link"
            >
              Terms &amp; Conditions
            </Link>
            <span>·</span>
            <Link
              to="/return-refund-cancellation-policy"
              className="text-sky-500 hover:underline"
              data-ocid="privacy.link"
            >
              Return &amp; Refund Policy
            </Link>
            <span>·</span>
            <Link
              to="/faq"
              className="text-sky-500 hover:underline"
              data-ocid="privacy.link"
            >
              FAQ
            </Link>
            <span>·</span>
            <Link
              to="/contact"
              className="text-sky-500 hover:underline"
              data-ocid="privacy.link"
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

