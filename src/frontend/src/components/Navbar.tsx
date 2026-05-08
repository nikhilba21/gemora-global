import api from '../lib/api';
import { Button } from "@/components/ui/button";
import { ChevronDown, Menu, MessageCircle, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const MAIN_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Products", to: "/products" },
  { label: "Wholesale", to: "/wholesale" },
  { label: "Markets", to: "/export" },
  { label: "Gallery", to: "/gallery" },
  { label: "Catalogue", to: "/catalogues" },
  { label: "Blog", to: "/blog" },
  { label: "Contact", to: "/contact" },
];

const SERVICE_LINKS = [
  { label: "Kundan Jewellery Wholesale", to: "/kundan-jewellery-wholesale" },
  {
    label: "Temple Jewellery Manufacturer",
    to: "/temple-jewellery-manufacturer",
  },
  {
    label: "Artificial Jewellery Exporter",
    to: "/artificial-jewellery-exporter",
  },
  { label: "Bridal Imitation Jewellery", to: "/bridal-imitation-jewellery" },
  {
    label: "Oxidised Jewellery Wholesale",
    to: "/oxidised-jewellery-wholesale",
  },
  {
    label: "Imitation Jewellery Manufacturer India",
    to: "/imitation-jewellery-manufacturer-india",
  },
  {
    label: "Artificial Jewellery Wholesaler India",
    to: "/artificial-jewellery-wholesaler-india",
  },
  {
    label: "Fashion Jewellery Exporter India",
    to: "/fashion-jewellery-exporter-india",
  },
  { label: "Oxidised Jewellery Supplier", to: "/oxidised-jewellery-supplier" },
  {
    label: "Imitation Jewellery Supplier USA",
    to: "/imitation-jewellery-supplier-usa",
  },
  {
    label: "Imitation Jewellery Exporter India",
    to: "/imitation-jewellery-exporter-india",
  },
  {
    label: "Wholesale Imitation Jewellery",
    to: "/wholesale-imitation-jewellery",
  },
  { label: "Bridal Jewellery Wholesale", to: "/bridal-jewellery-wholesale" },
  { label: "Fashion Jewellery Exporter", to: "/fashion-jewellery-exporter" },
  {
    label: "Custom Jewellery Manufacturer",
    to: "/custom-jewellery-manufacturer",
  },
  {
    label: "Wholesale Imitation Jewellery India",
    to: "/wholesale-imitation-jewellery-india",
  },
  {
    label: "Fashion Jewellery Manufacturer India",
    to: "/fashion-jewellery-manufacturer-india",
  },
  {
    label: "Bridal Imitation Jewellery Wholesale",
    to: "/bridal-imitation-jewellery-wholesale",
  },
  { label: "Bulk Jewellery Supplier", to: "/bulk-jewellery-supplier" },
  { label: "Jewellery Exporter to USA", to: "/jewellery-exporter-to-usa" },
  { label: "Jewellery Supplier UK", to: "/jewellery-supplier-uk" },
  { label: "Jewellery Exporter UAE", to: "/jewellery-exporter-uae" },
  {
    label: "Private Label Jewellery India",
    to: "/private-label-jewellery-india",
  },
  {
    label: "Imitation Jewellery Manufacturer Jaipur",
    to: "/imitation-jewellery-manufacturer-jaipur",
  },
  {
    label: "Wholesale Jewellery Rajasthan",
    to: "/wholesale-jewellery-rajasthan",
  },
  {
    label: "Meenakari Jewellery Wholesale",
    to: "/meenakari-jewellery-wholesale",
  },
  { label: "Wholesale Jewellery UK", to: "/wholesale-jewellery-uk" },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsHover, setProductsHover] = useState(false);

  const { data: navCategories = [] } = useQuery({
    queryKey: ["nav-categories"],
    queryFn: () => api.getCategories(),
    enabled: true,
    staleTime: 10 * 60 * 1000,
  });

  // Subcategory map per category
  const SUBCATS: Record<string, string[]> = {
    "imitation-jewellery": ["Earring","Ear Chain","Necklace","Bangles","Bracelet","Bridal Set","Finger Ring","Mangalsutra","Pendant Set","Tikka","Nose Ring","Payal","Hath Pan","Belt","Baju Band","Kada","Bore","Jhuda","Chain Pendant","Hair Clip","Hair Band","Sindoor Box","Shishful","Damini","Brooch","Anklet","Pasa","Hair Brooch"],
    "antique-jewellery": ["Earring","Ear Chain","Necklace","Bangles","Bracelet","Pendant Set","Tikka","Mangalsutra","Finger Ring","Nose Ring","Hath Pan","Pasa","Shishful","Mala","Damini","Belt","Earring Tikka","Payal"],
    "kundan-jewellery": ["Earring","Ear Chain","Necklace","Bangles","Bracelet","Pendant Set","Tikka","Mangalsutra","Finger Ring","Nose Ring","Hath Pan","Kada","Mala","Pasa","Shishful","Belt","Bore","Damini","Payal"],
    "american-diamond-jewellery": ["Earring","Ear Chain","Necklace","Chain","Chain Pendant","Bangles","Bracelet","Hath Pan","Tikka","Pasa","Belt","Mala","Payal","Earring Tikka"],
    "indo-western-jewellery": ["Earring","Ear Chain","Necklace","Pendant Set","Bangles","Bracelet","Finger Ring","Tikka","Pasa","Hath Pan","Shishful","Belt","Payal","Hair Band","Hair Brooch","Earring Tikka"],
    "oxidised-jewellery": ["Earring","Necklace","Pendant Set","Bangles","Bracelet","Kada","Finger Ring","Tikka","Belt","Jhuda","Payal"],
    "western-jewellery": ["Earring","Necklace","Pendant Set","Chain Pendant","Bracelet","Kada","Finger Ring","Mala","Hath Pan","Brooch"],
  };
  const [servicesHover, setServicesHover] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change — use a ref to avoid stale closure
  const prevPathRef = useRef(location.pathname);
  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      prevPathRef.current = location.pathname;
      setMobileOpen(false);
      setMobileServicesOpen(false);
    }
  });

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isHomePage = location.pathname === "/";
  const isSolid = scrolled || mobileOpen || !isHomePage;

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileServicesOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isSolid
            ? "bg-primary shadow-elevated border-b border-primary/60"
            : "bg-transparent border-b border-transparent"
        }`}
        data-ocid="nav.bar"
      >
        <div className="container flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center flex-shrink-0 min-w-0"
            onClick={closeMobile}
          >
            <img
              src="/assets/uploads/logo-removebg-preview-1-1.png"
              alt="Gemora Global Private Limited"
              className="h-9 sm:h-12 w-auto object-contain max-w-[140px] sm:max-w-[180px]"
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-4">
            {MAIN_LINKS.map((l) => {
              if (l.label === "Products") {
                return (
                  <div
                    key={l.to}
                    className="relative"
                    onMouseEnter={() => setProductsHover(true)}
                    onMouseLeave={() => setProductsHover(false)}
                  >
                    <Link
                      to="/products"
                      className={`flex items-center gap-1 text-sm font-medium transition-colors whitespace-nowrap ${
                        location.pathname.startsWith("/products") ? "text-accent" : "text-white/90 hover:text-accent"
                      }`}
                    >
                      Products
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${productsHover ? "rotate-180" : ""}`} />
                    </Link>
                    {productsHover && (
                      <div className="absolute top-full left-0 mt-2 w-[820px] bg-[#0d1554] border border-white/10 rounded-xl shadow-2xl z-50 p-4">
                        <div className="grid grid-cols-4 gap-3">
                          {(navCategories as Array<{id:number;name:string;slug:string}>).map(cat => {
                            const subs = SUBCATS[cat.slug] || [];
                            return (
                              <div key={cat.id}>
                                <Link
                                  to={`/products/${cat.slug}`}
                                  className="block text-sm font-semibold text-accent mb-2 hover:underline"
                                  onClick={() => setProductsHover(false)}
                                >
                                  {cat.name}
                                </Link>
                                <div className="space-y-1">
                                  {subs.slice(0, 8).map(sub => (
                                    <Link
                                      key={sub}
                                      to={`/products/${cat.slug}?sub=${encodeURIComponent(sub)}`}
                                      className="block text-xs text-white/60 hover:text-white hover:text-accent transition-colors py-0.5"
                                      onClick={() => setProductsHover(false)}
                                    >
                                      {sub}
                                    </Link>
                                  ))}
                                  {subs.length > 8 && (
                                    <Link
                                      to={`/products/${cat.slug}`}
                                      className="block text-xs text-accent/70 hover:text-accent"
                                      onClick={() => setProductsHover(false)}
                                    >
                                      +{subs.length - 8} more →
                                    </Link>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="border-t border-white/10 mt-3 pt-3 flex gap-4">
                          <Link to="/products" className="text-xs text-white/60 hover:text-accent" onClick={() => setProductsHover(false)}>All Products →</Link>
                          <Link to="/products?newArrivals=true" className="text-xs text-white/60 hover:text-accent" onClick={() => setProductsHover(false)}>New Arrivals →</Link>
                          <Link to="/wholesale" className="text-xs text-white/60 hover:text-accent" onClick={() => setProductsHover(false)}>Wholesale Inquiry →</Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  data-ocid="nav.link"
                  className={`text-sm font-medium transition-colors whitespace-nowrap ${
                    location.pathname === l.to ? "text-accent" : "text-white/90 hover:text-accent"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}

            {/* Our Services dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesHover(true)}
              onMouseLeave={() => setServicesHover(false)}
            >
              <button
                type="button"
                data-ocid="nav.services_toggle"
                className={`flex items-center gap-1 text-sm font-medium transition-colors whitespace-nowrap ${
                  servicesHover
                    ? "text-accent"
                    : "text-white/90 hover:text-accent"
                }`}
              >
                Our Services
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    servicesHover ? "rotate-180" : ""
                  }`}
                />
              </button>
              {servicesHover && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[540px] bg-primary border border-primary/70 rounded-lg shadow-elevated z-50 py-3">
                  <div className="grid grid-cols-2">
                    {SERVICE_LINKS.map((s) => (
                      <Link
                        key={s.to}
                        to={s.to}
                        className="block px-4 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-accent transition-colors"
                        onClick={() => setServicesHover(false)}
                      >
                        {s.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/917976341419?text=Hi%20Gemora%20Global%2C%20I%20am%20interested%20in%20wholesale%20jewellery"
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="nav.whatsapp_cta"
              className="flex items-center gap-1.5 bg-green-500 hover:bg-green-400 text-white text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>

            <Button
              asChild
              size="sm"
              className="bg-accent hover:bg-accent/90 text-primary font-bold"
            >
              <Link to="/contact" data-ocid="nav.quote_cta">
                Get Quote
              </Link>
            </Button>
          </div>

          {/* Mobile right side: WhatsApp icon + hamburger */}
          <div className="lg:hidden flex items-center gap-1">
            <a
              href="https://wa.me/917976341419?text=Hi%20Gemora%20Global%2C%20I%20am%20interested%20in%20wholesale%20jewellery"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              data-ocid="nav.whatsapp_mobile"
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
                isSolid
                  ? "text-white hover:bg-white/10"
                  : "text-white bg-black/20 hover:bg-black/30"
              }`}
              onClick={() => setMobileOpen(!mobileOpen)}
              data-ocid="nav.mobile_toggle"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" strokeWidth={2.5} />
              ) : (
                <Menu className="w-5 h-5" strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay backdrop */}
      {mobileOpen && (
        <button
          type="button"
          className="lg:hidden fixed inset-0 z-40 bg-black/50 cursor-default"
          onClick={closeMobile}
          onKeyDown={(e) => e.key === "Escape" && closeMobile()}
          aria-label="Close menu"
          tabIndex={-1}
        />
      )}

      {/* Mobile menu panel — slides in from top */}
      <div
        className={`lg:hidden fixed top-0 left-0 right-0 z-[60] transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{ maxHeight: "100dvh" }}
        data-ocid="nav.mobile_menu"
      >
        {/* Nav bar replica at top of slide-in panel */}
        <div className="flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6 bg-primary border-b border-white/10">
          <Link
            to="/"
            className="flex items-center flex-shrink-0"
            onClick={closeMobile}
          >
            <img
              src="/assets/uploads/logo-removebg-preview-1-1.png"
              alt="Gemora Global Private Limited"
              className="h-9 sm:h-12 w-auto object-contain max-w-[140px]"
            />
          </Link>
          <button
            type="button"
            aria-label="Close menu"
            className="flex items-center justify-center w-10 h-10 rounded-lg text-white hover:bg-white/10 transition-colors"
            onClick={closeMobile}
          >
            <X className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>

        {/* Scrollable menu body */}
        <div
          className="bg-primary overflow-y-auto"
          style={{ maxHeight: "calc(100dvh - 3.5rem)" }}
        >
          <div className="px-4 py-3 flex flex-col">
            {/* Main links */}
            {MAIN_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                data-ocid="nav.link"
                className={`flex items-center min-h-[44px] py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === l.to
                    ? "text-accent bg-white/8"
                    : "text-white/90 hover:text-accent hover:bg-white/5"
                }`}
                onClick={closeMobile}
              >
                {l.label}
              </Link>
            ))}

            {/* Divider */}
            <div className="h-px bg-white/10 my-2" />

            {/* Mobile Services accordion */}
            <button
              type="button"
              className="flex items-center justify-between min-h-[44px] py-2 px-3 w-full text-left text-sm font-medium text-white/90 hover:text-accent hover:bg-white/5 rounded-lg transition-colors"
              onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
              data-ocid="nav.services_mobile_toggle"
              aria-expanded={mobileServicesOpen}
            >
              <span>Our Services</span>
              <ChevronDown
                className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${
                  mobileServicesOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {mobileServicesOpen && (
              <div className="mt-1 pl-3 border-l-2 border-accent/40 ml-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                  {SERVICE_LINKS.map((s) => (
                    <Link
                      key={s.to}
                      to={s.to}
                      className="flex items-center min-h-[40px] py-1.5 text-xs text-white/70 hover:text-accent transition-colors"
                      onClick={closeMobile}
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="h-px bg-white/10 my-3" />

            {/* CTA buttons */}
            <div className="flex flex-col gap-2 pb-4">
              <a
                href="https://wa.me/917976341419?text=Hi%20Gemora%20Global%2C%20I%20am%20interested%20in%20wholesale%20jewellery"
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="nav.whatsapp_cta_mobile"
                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white text-sm font-semibold px-4 py-3 rounded-lg transition-colors min-h-[44px]"
                onClick={closeMobile}
              >
                <MessageCircle className="w-5 h-5" />
                Chat on WhatsApp
              </a>
              <Link
                to="/contact"
                data-ocid="nav.quote_cta_mobile"
                className="flex items-center justify-center bg-accent hover:bg-accent/90 text-primary text-sm font-bold px-4 py-3 rounded-lg transition-colors min-h-[44px]"
                onClick={closeMobile}
              >
                Get Quote
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
