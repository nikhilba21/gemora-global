import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-4 h-4 flex-shrink-0"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-4 h-4 flex-shrink-0"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

/* ── SEO-Optimized Footer Link Data ─────────────────────────────────────────── */

const WHOLESALE_CATEGORIES = [
  { label: "Wholesale Kundan Jewellery", to: "/kundan-jewellery-wholesale" },
  { label: "Wholesale Bridal Jewellery Sets", to: "/bridal-jewellery-wholesale" },
  { label: "Wholesale Oxidised Jewellery", to: "/oxidised-jewellery-wholesale" },
  { label: "Wholesale Meenakari Jewellery", to: "/meenakari-jewellery-wholesale" },
  { label: "Wholesale American Diamond Jewellery", to: "/american-diamond-jewellery-wholesale" },
  { label: "Wholesale Gold Plated Jewellery", to: "/gold-plated-jewellery-wholesale-india" },
  { label: "Wholesale Antique Jewellery", to: "/antique-jewellery-wholesale-india" },
  { label: "Wholesale Temple Jewellery", to: "/temple-jewellery-manufacturer" },
  { label: "Bulk Jewellery Supplier India", to: "/bulk-jewellery-supplier" },
];

const MANUFACTURER_EXPORTER = [
  { label: "Imitation Jewellery Manufacturer Jaipur", to: "/imitation-jewellery-manufacturer-jaipur" },
  { label: "Fashion Jewellery Exporter India", to: "/fashion-jewellery-exporter-india" },
  { label: "Artificial Jewellery Exporter India", to: "/artificial-jewellery-exporter" },
  { label: "Wholesale Imitation Jewellery Manufacturer", to: "/wholesale-imitation-jewellery-manufacturer-exporter-india" },
  { label: "Custom Jewellery Manufacturer India", to: "/custom-jewellery-manufacturer" },
  { label: "Private Label Jewellery India", to: "/private-label-jewellery-india" },
  { label: "Fashion Jewellery Manufacturer India", to: "/fashion-jewellery-manufacturer-india" },
  { label: "Wholesale Jewellery Rajasthan", to: "/wholesale-jewellery-rajasthan" },
];

const EXPORT_COUNTRIES = [
  { label: "Imitation Jewellery Supplier USA", to: "/imitation-jewellery-supplier-usa" },
  { label: "Jewellery Exporter to USA", to: "/jewellery-exporter-to-usa" },
  { label: "Jewellery Supplier UK", to: "/jewellery-supplier-uk" },
  { label: "Wholesale Jewellery UK", to: "/wholesale-jewellery-uk" },
  { label: "Costume Jewellery Wholesale UK", to: "/costume-jewellery-wholesale-uk" },
  { label: "Jewellery Exporter UAE", to: "/jewellery-exporter-uae" },
  { label: "Jewellery Exporter Australia", to: "/jewellery-exporter-australia" },
  { label: "Jewellery Exporter Canada", to: "/jewellery-exporter-canada" },
  { label: "Jewellery Exporter Singapore", to: "/jewellery-exporter-singapore" },
  { label: "Jewellery Exporter Europe", to: "/jewellery-exporter-europe" },
];

const COMPANY_LINKS = [
  { label: "About Gemora Global", to: "/about" },
  { label: "Why Choose Us", to: "/why-choose-us" },
  { label: "Our Products", to: "/products" },
  { label: "Design Gallery", to: "/gallery" },
  { label: "Wholesale & Export", to: "/wholesale" },
  { label: "Global Export Markets", to: "/export" },
  { label: "Jewellery Blog", to: "/blog" },
  { label: "Contact Us", to: "/contact" },
];

const BLOG_LINKS = [
  { label: "Top Imitation Jewellery Trends 2026", to: "/blog/top-imitation-jewellery-trends-2026" },
  { label: "How to Start Jewellery Import Business", to: "/blog/how-to-start-jewellery-wholesale-import-business" },
  { label: "Why Indian Jewellery Dominates Global Markets", to: "/blog/why-indian-imitation-jewellery-dominates-global-markets" },
  { label: "Bridal Jewellery for International Buyers", to: "/blog/bridal-jewellery-collections-international-buyers" },
  { label: "Export Jewellery India to USA Guide", to: "/blog/export-jewellery-india-usa-guide" },
];

const HELP_SUPPORT_LINKS = [
  { label: "FAQ", to: "/faq" },
  { label: "Privacy Policy", to: "/privacy-policy" },
  {
    label: "Return, Refund & Cancellation Policy",
    to: "/return-refund-cancellation-policy",
  },
  { label: "Terms & Conditions", to: "/terms-and-conditions" },
];

function FooterLink({ label, to }: { label: string; to: string }) {
  return (
    <li>
      <Link
        to={to}
        className="flex items-center min-h-[40px] sm:min-h-[32px] py-0.5 text-sm transition-colors text-white/65 hover:text-[#D4AF37]"
      >
        {label}
      </Link>
    </li>
  );
}

function FooterColTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4
      className="font-semibold text-sm uppercase tracking-wider mb-3 sm:mb-4"
      style={{ color: "#D4AF37" }}
    >
      {children}
    </h4>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: "#0d1b6e", color: "#fff" }}>
      {/* Contextual SEO paragraph — passes link equity to money pages */}
      <div className="container px-4 sm:px-6 pt-10 pb-4">
        <p className="text-sm leading-relaxed text-center max-w-4xl mx-auto" style={{ color: "rgba(255,255,255,0.6)" }}>
          <strong style={{ color: "#D4AF37" }}>Gemora Global</strong> is a Jaipur-based{" "}
          <Link to="/imitation-jewellery-manufacturer-jaipur" className="text-white/80 hover:text-[#D4AF37] underline">
            imitation jewellery manufacturer
          </Link>{" "}
          &amp; exporter since 2011. We supply{" "}
          <Link to="/wholesale-imitation-jewellery-manufacturer-exporter-india" className="text-white/80 hover:text-[#D4AF37] underline">
            wholesale imitation jewellery
          </Link>
          ,{" "}
          <Link to="/bridal-jewellery-wholesale" className="text-white/80 hover:text-[#D4AF37] underline">
            bridal jewellery sets
          </Link>
          ,{" "}
          <Link to="/kundan-jewellery-wholesale" className="text-white/80 hover:text-[#D4AF37] underline">
            Kundan jewellery
          </Link>
          , and{" "}
          <Link to="/oxidised-jewellery-wholesale" className="text-white/80 hover:text-[#D4AF37] underline">
            oxidised jewellery
          </Link>{" "}
          to buyers in{" "}
          <Link to="/imitation-jewellery-supplier-usa" className="text-white/80 hover:text-[#D4AF37] underline">USA</Link>,{" "}
          <Link to="/jewellery-supplier-uk" className="text-white/80 hover:text-[#D4AF37] underline">UK</Link>,{" "}
          <Link to="/jewellery-exporter-uae" className="text-white/80 hover:text-[#D4AF37] underline">UAE</Link>,{" "}
          <Link to="/jewellery-exporter-australia" className="text-white/80 hover:text-[#D4AF37] underline">Australia</Link>, and 30+ countries. MOQ from 50 units.
        </p>
      </div>

      {/* Main footer grid */}
      <div className="container px-4 sm:px-6 py-8 sm:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-8 lg:gap-5">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-3 xl:col-span-1 text-center sm:text-left">
            <div className="mb-4 flex justify-center sm:justify-start">
              <img
                src="/assets/uploads/logo-removebg-preview-1-1.png"
                alt="Gemora Global Private Limited — Imitation Jewellery Manufacturer Jaipur India"
                className="h-12 w-auto object-contain"
                width={180}
                height={48}
                loading="lazy"
              />
            </div>
            <p
              className="text-sm leading-relaxed mb-1"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              Jaipur-based imitation jewellery manufacturer &amp; global
              exporter. Established 2011. 500+ wholesale designs. MOQ from 50
              units.
            </p>
            <p
              className="text-xs mb-4"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Established 2011 · 500+ Designs · 20+ Countries
            </p>

            {/* Address & contact */}
            <div
              className="space-y-2.5 text-sm text-left"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              <div className="flex items-start gap-2">
                <MapPin
                  className="w-4 h-4 mt-0.5 flex-shrink-0"
                  style={{ color: "#D4AF37" }}
                />
                <address className="not-italic leading-snug">
                  B 66 MAA Hinglaj Nagar,
                  <br />
                  Jaipur - 302021, Rajasthan, India
                </address>
              </div>
              <a
                href="tel:+917976341419"
                className="flex items-center gap-2 min-h-[44px] sm:min-h-0 hover:text-[#D4AF37] transition-colors"
              >
                <Phone
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: "#D4AF37" }}
                />
                +91 7976341419
              </a>
              <a
                href="mailto:globalgemora@gmail.com"
                className="flex items-center gap-2 min-h-[44px] sm:min-h-0 hover:text-[#D4AF37] transition-colors break-all"
              >
                <Mail
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: "#D4AF37" }}
                />
                globalgemora@gmail.com
              </a>
            </div>

            {/* Social icons */}
            <div className="flex flex-wrap gap-3 mt-5 justify-center sm:justify-start">
              <a
                href="https://wa.me/917976341419"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                className="flex items-center gap-2 text-sm font-medium px-3 py-2 min-h-[44px] rounded-lg transition-colors"
                style={{
                  background: "rgba(37,211,102,0.15)",
                  color: "#25d366",
                }}
              >
                <WhatsAppIcon />
                WhatsApp
              </a>
              <a
                href="https://instagram.com/gemoraglobal"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow on Instagram"
                className="flex items-center gap-2 text-sm font-medium px-3 py-2 min-h-[44px] rounded-lg transition-colors"
                style={{
                  background: "rgba(225,48,108,0.15)",
                  color: "#e1306c",
                }}
              >
                <InstagramIcon />
                Instagram
              </a>
            </div>
          </div>

          {/* Wholesale Categories */}
          <div>
            <FooterColTitle>Wholesale Categories</FooterColTitle>
            <ul className="space-y-0">
              {WHOLESALE_CATEGORIES.map((c) => (
                <FooterLink key={c.to} label={c.label} to={c.to} />
              ))}
            </ul>
          </div>

          {/* Manufacturer & Exporter */}
          <div>
            <FooterColTitle>Manufacturer & Exporter</FooterColTitle>
            <ul className="space-y-0">
              {MANUFACTURER_EXPORTER.map((c) => (
                <FooterLink key={c.to} label={c.label} to={c.to} />
              ))}
            </ul>
          </div>

          {/* Export Countries */}
          <div>
            <FooterColTitle>Export Countries</FooterColTitle>
            <ul className="space-y-0">
              {EXPORT_COUNTRIES.map((r) => (
                <FooterLink key={r.to} label={r.label} to={r.to} />
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <FooterColTitle>Company</FooterColTitle>
            <ul className="space-y-0">
              {COMPANY_LINKS.map((c) => (
                <FooterLink key={c.to} label={c.label} to={c.to} />
              ))}
            </ul>
          </div>

          {/* Important Blog Articles */}
          <div>
            <FooterColTitle>Popular Articles</FooterColTitle>
            <ul className="space-y-0">
              {BLOG_LINKS.map((item) => (
                <FooterLink key={item.to} label={item.label} to={item.to} />
              ))}
            </ul>
          </div>

          {/* Help & Support */}
          <div data-ocid="footer.help_support.section">
            <FooterColTitle>Help &amp; Support</FooterColTitle>
            <ul className="space-y-0">
              {HELP_SUPPORT_LINKS.map((item) => (
                <FooterLink key={item.to} label={item.label} to={item.to} />
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <div
          className="container px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-center sm:text-left"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          <span>
            &copy; {year} Gemora Global Private Limited — Established 2011. Imitation Jewellery
            Manufacturer &amp; Exporter, Jaipur, India. All rights reserved.
          </span>
          <span className="whitespace-nowrap">
            Built with <span aria-hidden="true">&#10084;</span> using{" "}
            
          </span>
        </div>
      </div>
    </footer>
  );
}
