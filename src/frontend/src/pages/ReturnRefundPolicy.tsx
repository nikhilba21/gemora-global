import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { usePageSEO } from "../hooks/usePageSEO";

export default function ReturnRefundPolicy() {
  usePageSEO({
    title: "Return, Refund, Replacement & Cancellation Policy | Gemora Global",
    description:
      "Gemora Global wholesale jewellery return, refund, replacement & cancellation policy. 7-day returns for damaged/wrong items. 5–7 business day refunds. B2B wholesale policy.",
    canonical:
      "https://gemoraglobal-tje.caffeine.xyz/return-refund-cancellation-policy",
    ogTitle: "Return, Refund & Cancellation Policy | Gemora Global",
    ogDescription:
      "Return, refund, replacement & cancellation policy for wholesale imitation jewellery orders at Gemora Global.",
    schema: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Return, Refund, Replacement & Cancellation Policy — Gemora Global",
      url: "https://gemoraglobal-tje.caffeine.xyz/return-refund-cancellation-policy",
      publisher: {
        "@type": "Organization",
        name: "Gemora Global",
        url: "https://gemoraglobal-tje.caffeine.xyz",
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
              Return, Refund &amp; Cancellation Policy
            </span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-primary mb-3">
            Return, Refund, Replacement &amp; Cancellation Policy
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated: {lastUpdated} · This policy applies to all B2B
            wholesale orders placed with Gemora Global.
          </p>
        </div>
      </section>

      {/* Quick Summary Cards */}
      <section className="py-8 px-4 bg-card border-b border-border">
        <div className="container max-w-3xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            {[
              {
                icon: "📅",
                title: "7-Day Window",
                desc: "Return eligibility period",
              },
              {
                icon: "✅",
                title: "Damaged/Wrong",
                desc: "Only returnable conditions",
              },
              {
                icon: "💰",
                title: "5–7 Business Days",
                desc: "Refund processing time",
              },
              {
                icon: "❌",
                title: "Before Dispatch",
                desc: "Cancellation deadline",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-3 rounded-xl border border-blue-700/20 bg-background"
              >
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className="text-xs font-semibold text-foreground leading-tight">
                  {item.title}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 leading-tight">
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 px-4">
        <div className="container max-w-3xl mx-auto space-y-8 text-sm sm:text-base text-muted-foreground leading-relaxed">
          {/* Overview */}
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-primary mb-3">
              1. Overview
            </h2>
            <p>
              Gemora Global is a B2B imitation jewellery manufacturer and
              exporter. This policy governs returns, refunds, replacements, and
              cancellations for all wholesale orders placed by business buyers
              (boutiques, retailers, distributors, and resellers). All sales are
              made on a wholesale B2B basis. This policy is more restrictive
              than typical consumer return policies — we strongly recommend
              placing sample orders before committing to bulk wholesale
              purchases.
            </p>
          </div>

          {/* Return Eligibility */}
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-primary mb-3">
              2. Return Eligibility
            </h2>
            <p>We accept returns only under the following circumstances:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>
                <strong className="text-foreground">Transit Damage:</strong>{" "}
                Items arrive physically damaged (broken, bent, or cracked) due
                to transit handling. Photographic evidence required within 7
                days of receipt.
              </li>
              <li>
                <strong className="text-foreground">
                  Manufacturing Defect:
                </strong>{" "}
                Items received with a clear manufacturing defect (e.g. incorrect
                plating, faulty clasp mechanism, stone falling off on first wear
                due to manufacturing error). Photographic or video evidence
                required within 7 days of receipt.
              </li>
              <li>
                <strong className="text-foreground">
                  Wrong Items Shipped:
                </strong>{" "}
                Items received differ from what was ordered (wrong design code,
                wrong colour, wrong quantity exceeding a 5% variance). Confirmed
                against the original Proforma Invoice.
              </li>
            </ul>
            <p className="mt-3">
              <strong className="text-foreground">
                Returns are NOT accepted for:
              </strong>{" "}
              change of mind, items that did not sell, items that do not match
              personal or market preference, minor variations in colour/shade
              due to photography lighting differences, slight variations in
              handcrafted pieces (inherent in artisan manufacturing), or items
              damaged by the buyer after receipt.
            </p>
          </div>

          {/* Return Process */}
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-primary mb-3">
              3. Return Process
            </h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li>
                <strong className="text-foreground">
                  Report Within 7 Days:
                </strong>{" "}
                Email{" "}
                <a
                  href="mailto:globalgemora@gmail.com"
                  className="text-primary hover:underline"
                >
                  globalgemora@gmail.com
                </a>{" "}
                with your order number, clear photographs of the
                defective/damaged items, and a description of the issue.
                WhatsApp (+91 7976341419) is also accepted for initial
                reporting.
              </li>
              <li>
                <strong className="text-foreground">Assessment:</strong> Our
                quality team will assess the evidence within 2–3 business days
                and confirm whether the return is approved.
              </li>
              <li>
                <strong className="text-foreground">
                  Return Authorisation:
                </strong>{" "}
                If approved, we will issue a Return Merchandise Authorisation
                (RMA) number and return shipping instructions. Do not return
                items without an RMA — unauthorised returns will not be
                accepted.
              </li>
              <li>
                <strong className="text-foreground">Ship Items Back:</strong>{" "}
                Package items securely and ship via tracked service to our
                Jaipur address. For transit damage claims covered by our
                shipping insurance, we will arrange collection. For other
                approved returns, return shipping is at buyer's cost.
              </li>
              <li>
                <strong className="text-foreground">Resolution:</strong> Once
                items are received and inspected (3–5 days), we will process the
                agreed resolution — replacement, credit note, or refund.
              </li>
            </ol>
          </div>

          {/* Refund Policy */}
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-primary mb-3">
              4. Refund Policy
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-foreground">Refund Method:</strong>{" "}
                Refunds are processed via international wire transfer (T/T) to
                the buyer's bank account.
              </li>
              <li>
                <strong className="text-foreground">Refund Timeline:</strong>{" "}
                Approved refunds are processed within 5–7 business days of
                receiving and inspecting returned items. International bank
                transfers may take an additional 3–5 banking days to appear in
                the buyer's account.
              </li>
              <li>
                <strong className="text-foreground">Partial Refunds:</strong>{" "}
                Where only a portion of an order is eligible for return (e.g. a
                subset of items is damaged), a partial refund for the affected
                items will be issued.
              </li>
              <li>
                <strong className="text-foreground">
                  Shipping Cost Refunds:
                </strong>{" "}
                Original outbound shipping costs are non-refundable. For transit
                damage claims, we will process the shipping insurance claim and
                reimburse accordingly.
              </li>
              <li>
                <strong className="text-foreground">Currency:</strong> Refunds
                are processed in the currency of original payment (USD, GBP, or
                EUR). Refunds are not processed in Indian Rupees for
                international buyers.
              </li>
            </ul>
          </div>

          {/* Replacement Policy */}
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-primary mb-3">
              5. Replacement Policy
            </h2>
            <p>
              For approved returns due to manufacturing defect or wrong items
              shipped, we offer replacement as the preferred resolution —
              subject to stock availability. Replacement items are dispatched
              within 7–15 days of receiving the returned goods. Replacement
              items are shipped at our cost via DHL Express.
            </p>
            <p className="mt-3">
              If the exact replacement item is out of stock, we will offer an
              equivalent design as a replacement, a credit note for future
              orders, or a full refund at the buyer's preference.
            </p>
          </div>

          {/* Cancellation Policy */}
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-primary mb-3">
              6. Cancellation Policy
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-foreground">
                  Before Production Starts:
                </strong>{" "}
                Orders may be cancelled with a full refund of the advance
                payment before production has commenced. Contact us within 24
                hours of placing an order for no-penalty cancellation.
              </li>
              <li>
                <strong className="text-foreground">During Production:</strong>{" "}
                If production has commenced, cancellation may be possible but
                will incur a 25–50% production cost charge of the total order
                value, deducted from any advance paid.
              </li>
              <li>
                <strong className="text-foreground">After Dispatch:</strong>{" "}
                Orders cannot be cancelled once dispatched. In this case, the
                standard return process applies.
              </li>
              <li>
                <strong className="text-foreground">Custom/OEM Orders:</strong>{" "}
                Custom-designed or OEM orders cannot be cancelled once
                production has commenced, as these items cannot be restocked.
                The full order value is payable.
              </li>
            </ul>
          </div>

          {/* Non-Returnable Items */}
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-primary mb-3">
              7. Non-Returnable Items
            </h2>
            <p>
              The following are not eligible for return or refund under any
              circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>
                Custom or OEM manufactured jewellery (made to buyer
                specification)
              </li>
              <li>Private label or branded packaging orders</li>
              <li>Sample orders (sold on a final-sale basis)</li>
              <li>
                Items damaged by the buyer, customer, or during resale display
              </li>
              <li>Items reported outside the 7-day reporting window</li>
              <li>
                Items returned without a valid Return Merchandise Authorisation
                (RMA) number
              </li>
            </ul>
          </div>

          {/* Quality Commitment */}
          <div className="border border-blue-700/20 rounded-xl p-5 bg-card">
            <h2 className="text-lg sm:text-xl font-serif font-bold text-primary mb-3">
              Our Quality Commitment
            </h2>
            <p>
              Gemora Global conducts a 3-stage quality control process on every
              order before dispatch. We share photographic QC reports for all
              bulk orders. Our goal is zero returns — and we are continuously
              improving our manufacturing and packaging processes to ensure
              every piece arrives in perfect condition. We encourage buyers to
              raise any quality concerns promptly so we can resolve them
              swiftly.
            </p>
            <p className="mt-3">
              Contact us:{" "}
              <a
                href="mailto:globalgemora@gmail.com"
                className="text-primary hover:underline"
              >
                globalgemora@gmail.com
              </a>{" "}
              · WhatsApp:{" "}
              <a
                href="https://wa.me/917976341419"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                +91 7976341419
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="py-8 px-4 border-t border-border">
        <div className="container max-w-3xl mx-auto">
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground justify-center">
            <Link
              to="/faq"
              className="text-sky-500 hover:underline"
              data-ocid="returns.link"
            >
              FAQ
            </Link>
            <span>·</span>
            <Link
              to="/privacy-policy"
              className="text-sky-500 hover:underline"
              data-ocid="returns.link"
            >
              Privacy Policy
            </Link>
            <span>·</span>
            <Link
              to="/terms-and-conditions"
              className="text-sky-500 hover:underline"
              data-ocid="returns.link"
            >
              Terms &amp; Conditions
            </Link>
            <span>·</span>
            <Link
              to="/contact"
              className="text-sky-500 hover:underline"
              data-ocid="returns.link"
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
