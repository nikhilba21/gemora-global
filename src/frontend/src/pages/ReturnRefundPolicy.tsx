import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { usePageSEO } from "../hooks/usePageSEO";

export default function ReturnRefundPolicy() {
  usePageSEO({
    title: "No-Return & No-Refund Policy | Gemora Global",
    description:
      "Gemora Global has a strict no-return and no-refund policy for wholesale orders. All sales are final. Manufacturing damage claims require a 360° unboxing video proof.",
    canonical:
      "https://www.gemoraglobal.co/return-refund-cancellation-policy",
    ogTitle: "Returns & Refunds Policy — Gemora Global",
    ogDescription:
      "Strict no-return and no-refund policy for wholesale imitation jewellery orders at Gemora Global.",
    schema: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "No-Return & No-Refund Policy — Gemora Global",
      url: "https://www.gemoraglobal.co/return-refund-cancellation-policy",
      publisher: {
        "@type": "Organization",
        name: "Gemora Global",
        url: "https://www.gemoraglobal.co",
      },
    },
  });

  const lastUpdated = "May 2026";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 sm:pt-28 pb-8 px-4 bg-gradient-to-b from-red-50 to-background border-b border-red-700/10">
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
              No-Return &amp; No-Refund Policy
            </span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mb-3">
            Returns &amp; Refunds Policy
          </h1>
          <p className="text-sm text-red-600 font-semibold uppercase tracking-wider">
            Important: Strict No-Return and No-Refund Policy
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
      <section className="py-12 px-4">
        <div className="container max-w-3xl mx-auto">
          <div className="space-y-8">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-xl shadow-sm">
              <p className="font-bold text-slate-900 text-lg mb-2">Dear Customer,</p>
              <p className="text-slate-700 font-medium">
                Kindly refer to our Terms and Conditions before placing your order.
              </p>
            </div>

            <div className="space-y-6 mt-8">
              <div className="flex gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="text-2xl shrink-0">✅</div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1 uppercase text-sm tracking-wide">Warranty & Returns</h3>
                  <p className="text-slate-700 leading-relaxed">
                    <span className="font-bold">No Warranty, No Return, No Exchange, No Colour Fade warranty.</span> 
                    All products are Indian Manufactured. Please do not compare with imported quality as we manufacture competitive price range imitation jewellery specifically for E-commerce platforms.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="text-2xl shrink-0">✅</div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1 uppercase text-sm tracking-wide">Missing & Damage Claims</h3>
                  <p className="text-slate-700 leading-relaxed">
                    For any missing or damage complaints, a <span className="font-bold underline">360° Degree Opening Video/Images are COMPULSORY</span>. 
                    Damage exchange items must be reported within a specific window (often 2-3 days) and must be unused, in original packaging, with all tags attached.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="text-2xl shrink-0">✅</div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1 uppercase text-sm tracking-wide">Quality Expectations</h3>
                  <p className="text-slate-700 leading-relaxed">
                    Before ordering and payment, please verify the design and quality scale correctly. 
                    After delivery, no excuses regarding personal expectations or "look and feel" will be accepted.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="text-2xl shrink-0">✅</div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1 uppercase text-sm tracking-wide">Payment Policy</h3>
                  <p className="text-slate-700 leading-relaxed">
                    No product bookings or shipment dispatches will be accepted or processed without full payment.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="text-2xl shrink-0">✅</div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1 uppercase text-sm tracking-wide">Shipping & Tracking</h3>
                  <p className="text-slate-700 leading-relaxed">
                    Once payment is received, your parcel will be dispatched within <span className="font-bold">3 to 4 days</span>. 
                    If you do not receive your order within 7 days after dispatch, please notify us immediately so we can track and share the real-time location.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border-2 border-primary/10">
                <div className="text-2xl shrink-0">✅</div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1 uppercase text-sm tracking-wide">Parcel Inspection at Delivery</h3>
                  <p className="text-slate-700 leading-relaxed">
                    Before accepting the parcel, please ensure and inspect your parcel in front of the delivery executive. 
                    If the parcel is incorrect, torn, or doesn't contain your order information, <span className="font-bold">DO NOT ACCEPT IT</span>. 
                    We are not responsible if you receive a wrong parcel from them without inspection. 
                    Always make a 360 Opening unboxing video. Exchange policy applies in damage cases only, and only with full opening video proof.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-8 bg-slate-900 text-white rounded-2xl text-center">
              <h2 className="font-serif text-2xl font-bold mb-4">Need Help?</h2>
              <p className="text-slate-300 mb-6">Our support team is available via WhatsApp for any queries regarding your order or our policies.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="https://wa.me/917976341419" className="bg-white text-slate-900 px-8 py-3 rounded-lg font-bold hover:bg-slate-100 transition-colors">
                  Contact via WhatsApp
                </a>
                <a href="mailto:globalgemora@gmail.com" className="border border-white/30 px-8 py-3 rounded-lg font-bold hover:bg-white/10 transition-colors">
                  Email Support
                </a>
              </div>
            </div>
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
