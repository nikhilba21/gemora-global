import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { usePageSEO } from "../hooks/usePageSEO";

export default function ReturnRefundPolicy() {
  usePageSEO({
    title: "Returns & Refunds Policy | Gemora Global",
    description:
      "Gemora Global strictly follows a no-return and no-refund policy for wholesale orders. All sales are final. Unboxing video required for damage claims.",
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
      <section className="pt-24 sm:pt-28 pb-8 px-4 bg-gradient-to-b from-blue-50 to-background border-b border-blue-700/20">
        <div className="container max-w-3xl mx-auto text-center md:text-left">
          <nav
            aria-label="Breadcrumb"
            className="mb-4 flex items-center justify-center md:justify-start gap-1 text-xs text-muted-foreground"
          >
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span aria-hidden="true" className="mx-1">/</span>
            <span className="text-foreground font-medium">Policy</span>
          </nav>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-primary mb-3">
            Returns &amp; Refunds Policy
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated: {lastUpdated} · This policy applies to all B2B
            wholesale orders.
          </p>
        </div>
      </section>

      {/* Quick Summary Cards (Original Design Restored) */}
      <section className="py-8 px-4 bg-card border-b border-border">
        <div className="container max-w-3xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            {[
              {
                icon: "📹",
                title: "360° Video",
                desc: "Compulsory for all claims",
              },
              {
                icon: "⚠️",
                title: "No Returns",
                desc: "Strict Final Sale policy",
              },
              {
                icon: "🚚",
                title: "3-4 Days",
                desc: "Dispatch timeline",
              },
              {
                icon: "❌",
                title: "No Exchange",
                desc: "Except in damage cases",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-3 rounded-xl border border-blue-700/20 bg-background shadow-sm hover:shadow-md transition-shadow"
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
          <div className="space-y-8 text-sm sm:text-base leading-relaxed">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-xl shadow-sm">
              <p className="font-bold text-slate-900 text-lg mb-2">Dear Customer,</p>
              <p className="text-slate-700 font-medium">
                Kindly refer to our Terms and Conditions before placing your order.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4 p-5 rounded-xl border border-border bg-card">
                <div className="text-2xl shrink-0">✅</div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2 uppercase text-sm tracking-wide">Warranty & Return Policy</h3>
                  <p className="text-slate-600 leading-relaxed">
                    <span className="font-bold text-slate-900">No Warranty, No Return, No Exchange, No Colour Fade warranty.</span> 
                    All products are Indian Manufactured. Please do not compare with imported quality as we manufacture competitive price range imitation jewellery specifically for E-commerce platforms.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-5 rounded-xl border border-border bg-card">
                <div className="text-2xl shrink-0">✅</div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2 uppercase text-sm tracking-wide">Missing & Damage Claims</h3>
                  <p className="text-slate-600 leading-relaxed">
                    For any missing or damage complaints, a <span className="font-bold text-slate-900 underline">360° Degree Opening Video/Images are COMPULSORY</span>. 
                    Damage exchange items must be reported within a specific window (often 2-3 days) and must be unused, in original packaging, with all tags attached.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-5 rounded-xl border border-border bg-card">
                <div className="text-2xl shrink-0">✅</div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2 uppercase text-sm tracking-wide">Order Specifications</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Before order and payment, please verify the design and quality scale correctly. After delivery, no excuses regarding your expectations or "look and feel" will be accepted.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-5 rounded-xl border border-border bg-card">
                <div className="text-2xl shrink-0">✅</div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2 uppercase text-sm tracking-wide">Payment & Dispatch</h3>
                  <p className="text-slate-600 leading-relaxed">
                    No product bookings or shipment dispatches will be accepted or processed without full payment. 
                    Once payment is received, your parcel will be dispatched within <span className="font-bold text-slate-900">3 to 4 days</span>.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-5 rounded-xl border border-border bg-card">
                <div className="text-2xl shrink-0">✅</div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2 uppercase text-sm tracking-wide">Tracking & Location</h3>
                  <p className="text-slate-600 leading-relaxed">
                    If you do not receive your order within 7 days after dispatch, please notify us immediately so we can track and share the real-time location.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-5 rounded-xl border-2 border-primary/10 bg-primary/5">
                <div className="text-2xl shrink-0">✅</div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2 uppercase text-sm tracking-wide">Important: Parcel Inspection</h3>
                  <p className="text-slate-600 leading-relaxed">
                    We do not offer a return/exchange policy. Before accepting the parcel, please ensure and inspect your parcel in front of the delivery executive. 
                    If the parcel is incorrect, torn, or doesn't contain your specified order information, <span className="font-bold text-slate-900">DO NOT ACCEPT IT</span>. 
                    We are not responsible if you receive a wrong parcel from them. Always make a 360 Opening unboxing video. 
                    <span className="font-bold text-slate-900"> Exchange policy applies in damage cases only, and only with full opening video proof.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
