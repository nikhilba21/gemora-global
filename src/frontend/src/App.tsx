import React, { Suspense, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import AdminGuard from "./components/AdminGuard";
import BulkQuoteCart from "./components/BulkQuoteCart";
import ScrollToTop from "./components/ScrollToTop";
import WhatsAppButton from "./components/WhatsAppButton";
import { useActor } from "./hooks/useActor";

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Lazy imports
const About = React.lazy(() => import("./pages/About"));
const Blog = React.lazy(() => import("./pages/Blog"));
const BlogPost = React.lazy(() => import("./pages/BlogPost"));
const Contact = React.lazy(() => import("./pages/Contact"));
const ExportMarkets = React.lazy(() => import("./pages/ExportMarkets"));
const FAQ = React.lazy(() => import("./pages/FAQ"));
const Gallery = React.lazy(() => import("./pages/Gallery"));
import Home from "./pages/Home";
const JewelleryExporterKuwait = React.lazy(() => import("./pages/JewelleryExporterKuwait"));
const JewelleryExporterMalaysia = React.lazy(() => import("./pages/JewelleryExporterMalaysia"));
const JewelleryExporterNigeria = React.lazy(() => import("./pages/JewelleryExporterNigeria"));
const JewelleryExporterSaudiArabia = React.lazy(() => import("./pages/JewelleryExporterSaudiArabia"));
const JewelleryExporterSriLanka = React.lazy(() => import("./pages/JewelleryExporterSriLanka"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const PrivacyPolicy = React.lazy(() => import("./pages/PrivacyPolicy"));
const ProductDetail = React.lazy(() => import("./pages/ProductDetail"));
const Products = React.lazy(() => import("./pages/Products"));
const ReturnRefundPolicy = React.lazy(() => import("./pages/ReturnRefundPolicy"));
const TermsAndConditions = React.lazy(() => import("./pages/TermsAndConditions"));
const Wholesale = React.lazy(() => import("./pages/Wholesale"));
const Catalogues = React.lazy(() => import("./pages/Catalogues"));
const WhyChooseUs = React.lazy(() => import("./pages/WhyChooseUs"));

// Admin
const AdminAnalytics = React.lazy(() => import("./pages/admin/AdminAnalytics"));
const AdminAutomation = React.lazy(() => import("./pages/admin/AdminAutomation"));
const AdminBlog = React.lazy(() => import("./pages/admin/AdminBlog"));
const AdminCMS = React.lazy(() => import("./pages/admin/AdminCMS"));
const AdminCatalogue = React.lazy(() => import("./pages/admin/AdminCatalogue"));
const AdminCategories = React.lazy(() => import("./pages/admin/AdminCategories"));
const AdminContent = React.lazy(() => import("./pages/admin/AdminContent"));
const AdminCountrySettings = React.lazy(() => import("./pages/admin/AdminCountrySettings"));
const AdminCustomers = React.lazy(() => import("./pages/admin/AdminCustomers"));
const AdminDashboard = React.lazy(() => import("./pages/admin/AdminDashboard"));
const AdminGallery = React.lazy(() => import("./pages/admin/AdminGallery"));
const AdminInquiries = React.lazy(() => import("./pages/admin/AdminInquiries"));
const AdminLogin = React.lazy(() => import("./pages/admin/AdminLogin"));
const AdminLogistics = React.lazy(() => import("./pages/admin/AdminLogistics"));
const AdminMarketing = React.lazy(() => import("./pages/admin/AdminMarketing"));
const AdminOrders = React.lazy(() => import("./pages/admin/AdminOrders"));
const AdminPayments = React.lazy(() => import("./pages/admin/AdminPayments"));
const AdminProducts = React.lazy(() => import("./pages/admin/AdminProducts"));
const AdminSettings = React.lazy(() => import("./pages/admin/AdminSettings"));
const AdminSystemSettings = React.lazy(() => import("./pages/admin/AdminSystemSettings"));
const AdminTestimonials = React.lazy(() => import("./pages/admin/AdminTestimonials"));
const AdminWebsiteSettings = React.lazy(() => import("./pages/admin/AdminWebsiteSettings"));
const AdminWhatsAppLeads = React.lazy(() => import("./pages/admin/AdminWhatsAppLeads"));
const AdminGalleryFolders = React.lazy(() => import("./pages/admin/AdminGalleryFolders"));
const AdminEmailCampaigns = React.lazy(() => import("./pages/admin/AdminEmailCampaigns"));

// Collections
const Bracelets = React.lazy(() => import("./pages/collections/BraceletsCollection"));
const DailyWear = React.lazy(() => import("./pages/collections/DailyWearJewelry"));
const Earrings = React.lazy(() => import("./pages/collections/EarringsCollection"));
const Korean = React.lazy(() => import("./pages/collections/KoreanJewelry"));
const Minimalist = React.lazy(() => import("./pages/collections/MinimalistJewelry"));
const Necklaces = React.lazy(() => import("./pages/collections/NecklacesCollection"));
const Oxidised = React.lazy(() => import("./pages/collections/OxidisedJewelry"));
const PartyWear = React.lazy(() => import("./pages/collections/PartyWearJewelry"));
const ProgrammaticCollection = React.lazy(() => import("./pages/collections/ProgrammaticCollection"));
const Rings = React.lazy(() => import("./pages/collections/RingsCollection"));
const TrendyJewelry = React.lazy(() => import("./pages/collections/TrendyJewelry"));

// Export Markets
const ExportAustralia = React.lazy(() => import("./pages/export-markets/Australia"));
const ExportCanada = React.lazy(() => import("./pages/export-markets/Canada"));
const ExportFrance = React.lazy(() => import("./pages/export-markets/France"));
const ExportKuwait = React.lazy(() => import("./pages/export-markets/Kuwait"));
const ExportMalaysia = React.lazy(() => import("./pages/export-markets/Malaysia"));
const ExportNigeria = React.lazy(() => import("./pages/export-markets/Nigeria"));
const ExportSaudiArabia = React.lazy(() => import("./pages/export-markets/SaudiArabia"));
const ExportSingapore = React.lazy(() => import("./pages/export-markets/Singapore"));
const ExportSriLanka = React.lazy(() => import("./pages/export-markets/SriLanka"));
const ExportUAE = React.lazy(() => import("./pages/export-markets/UAE"));
const ExportUK = React.lazy(() => import("./pages/export-markets/UK"));
const ExportUSA = React.lazy(() => import("./pages/export-markets/USA"));

// SEO pages
const ArtificialJewelleryExporter = React.lazy(() => import("./pages/seo/ArtificialJewelleryExporter"));
const BridalImitationJewellery = React.lazy(() => import("./pages/seo/BridalImitationJewellery"));
const BridalImitationJewelleryWholesale = React.lazy(() => import("./pages/seo/BridalImitationJewelleryWholesale"));
const BridalJewelleryWholesale = React.lazy(() => import("./pages/seo/BridalJewelleryWholesale"));
const BulkJewellerySupplier = React.lazy(() => import("./pages/seo/BulkJewellerySupplier"));
const CustomJewelleryManufacturer = React.lazy(() => import("./pages/seo/CustomJewelleryManufacturer"));
const FashionJewelleryExporter = React.lazy(() => import("./pages/seo/FashionJewelleryExporter"));
const FashionJewelleryExporterIndia = React.lazy(() => import("./pages/seo/FashionJewelleryExporterIndia"));
const FashionJewelleryManufacturerIndia = React.lazy(() => import("./pages/seo/FashionJewelleryManufacturerIndia"));
const ImitationJewelleryExporterIndia = React.lazy(() => import("./pages/seo/ImitationJewelleryExporterIndia"));
const ImitationJewelleryManufacturerJaipur = React.lazy(() => import("./pages/seo/ImitationJewelleryManufacturerJaipur"));
const ImitationJewellerySupplierUsa = React.lazy(() => import("./pages/seo/ImitationJewellerySupplierUsa"));
const JewelleryExporterAustralia = React.lazy(() => import("./pages/seo/JewelleryExporterAustralia"));
const JewelleryExporterCanada = React.lazy(() => import("./pages/seo/JewelleryExporterCanada"));
const JewelleryExporterEurope = React.lazy(() => import("./pages/seo/JewelleryExporterEurope"));
const JewelleryExporterFrance = React.lazy(() => import("./pages/seo/JewelleryExporterFrance"));
const JewelleryExporterSingapore = React.lazy(() => import("./pages/seo/JewelleryExporterSingapore"));
const JewelleryExporterToUsa = React.lazy(() => import("./pages/seo/JewelleryExporterToUsa"));
const JewelleryExporterUae = React.lazy(() => import("./pages/seo/JewelleryExporterUae"));
const JewellerySupplierUk = React.lazy(() => import("./pages/seo/JewellerySupplierUk"));
const KundanJewelleryWholesale = React.lazy(() => import("./pages/seo/KundanJewelleryWholesale"));
const MeenakariJewelleryWholesale = React.lazy(() => import("./pages/seo/MeenakariJewelleryWholesale"));
const OxidisedJewellerySupplier = React.lazy(() => import("./pages/seo/OxidisedJewellerySupplier"));
const OxidisedJewelleryWholesale = React.lazy(() => import("./pages/seo/OxidisedJewelleryWholesale"));
const PrivateLabelJewelleryIndia = React.lazy(() => import("./pages/seo/PrivateLabelJewelleryIndia"));
const TempleJewelleryManufacturer = React.lazy(() => import("./pages/seo/TempleJewelleryManufacturer"));
const WholesaleJewelleryRajasthan = React.lazy(() => import("./pages/seo/WholesaleJewelleryRajasthan"));
const WholesaleJewelleryUk = React.lazy(() => import("./pages/seo/WholesaleJewelleryUk"));
const FactoryDirectJewelryExporter = React.lazy(() => import("./pages/seo/FactoryDirectJewelryExporter"));
const ArtificialJewelryExporterMOQ = React.lazy(() => import("./pages/seo/ArtificialJewelryExporterMOQ"));
const AmericanDiamondJewelryExporter = React.lazy(() => import("./pages/seo/AmericanDiamondJewelryExporter"));
const AmericanDiamondJewelleryWholesale = React.lazy(() => import("./pages/seo/AmericanDiamondJewelleryWholesale"));
const WholesaleImitationJewelleryManufacturerExporter = React.lazy(() => import("./pages/seo/WholesaleImitationJewelleryManufacturerExporter"));
const GoldPlatedJewelleryWholesale = React.lazy(() => import("./pages/seo/GoldPlatedJewelleryWholesale"));
const AntiqueJewelleryWholesale = React.lazy(() => import("./pages/seo/AntiqueJewelleryWholesale"));
const CostumeJewelleryWholesaleUK = React.lazy(() => import("./pages/seo/CostumeJewelleryWholesaleUK"));
const ArtificialJewelleryWholesale = React.lazy(() => import("./pages/seo/ArtificialJewelleryWholesale"));
const WholesaleJewelryMOQ50 = React.lazy(() => import("./pages/seo/WholesaleJewelryMOQ50"));
const OxidizedSilverJewelryWholesale = React.lazy(() => import("./pages/seo/OxidizedSilverJewelryWholesale"));
const CostumeJewelryWholesaleSupplier = React.lazy(() => import("./pages/seo/CostumeJewelryWholesaleSupplier"));
const BridalJewelrySetsWholesale = React.lazy(() => import("./pages/seo/BridalJewelrySetsWholesale"));
const NecklaceSetsWholesale = React.lazy(() => import("./pages/seo/NecklaceSetsWholesale"));
const JhumkaEarringsWholesale = React.lazy(() => import("./pages/seo/JhumkaEarringsWholesale"));
const NoMiddlemanJewelryWholesale = React.lazy(() => import("./pages/seo/NoMiddlemanJewelryWholesale"));
const JewelleryExporterKuwait_SEO = React.lazy(() => import("./pages/JewelleryExporterKuwait")); // Avoid conflict
const JewelleryExporterMalaysia_SEO = React.lazy(() => import("./pages/JewelleryExporterMalaysia"));
const JewelleryExporterNigeria_SEO = React.lazy(() => import("./pages/JewelleryExporterNigeria"));
const JewelleryExporterSaudiArabia_SEO = React.lazy(() => import("./pages/JewelleryExporterSaudiArabia"));
const JewelleryExporterSriLanka_SEO = React.lazy(() => import("./pages/JewelleryExporterSriLanka"));
const JewelleryExporterAustralia_SEO = React.lazy(() => import("./pages/seo/JewelleryExporterAustralia"));
const JewelleryExporterCanada_SEO = React.lazy(() => import("./pages/seo/JewelleryExporterCanada"));
const JewelleryExporterSingapore_SEO = React.lazy(() => import("./pages/seo/JewelleryExporterSingapore"));
const JewelleryExporterEurope_SEO = React.lazy(() => import("./pages/seo/JewelleryExporterEurope"));
const JewelleryExporterFrance_SEO = React.lazy(() => import("./pages/seo/JewelleryExporterFrance"));
const FactoryDirectJewelryExporter_SEO = React.lazy(() => import("./pages/seo/FactoryDirectJewelryExporter"));
const ArtificialJewelryExporterMOQ_SEO = React.lazy(() => import("./pages/seo/ArtificialJewelryExporterMOQ"));
const AmericanDiamondJewelryExporter_SEO = React.lazy(() => import("./pages/seo/AmericanDiamondJewelryExporter"));


function VisitTracker() {
  const { actor } = useActor();
  const location = useLocation();

  useEffect(() => {
    if (actor) actor.recordVisit().catch(() => {});
  }, [actor, location]);

  // Tawk.to Page Tracking & Smart Referral Tracking for SPAs
  useEffect(() => {
    const updateTawk = () => {
      const Tawk_API = (window as any).Tawk_API;
      if (Tawk_API) {
        // 1. Get Referrer & UTM params
        const referrer = document.referrer || "Direct / None";
        const urlParams = new URLSearchParams(window.location.search);
        
        // 2. Try to extract organic keyword from referrer (works for some search engines)
        let organicKeyword = "Not Provided (Encrypted)";
        if (referrer) {
          try {
            const refUrl = new URL(referrer);
            organicKeyword = refUrl.searchParams.get('q') || refUrl.searchParams.get('query') || refUrl.searchParams.get('p') || organicKeyword;
          } catch(e) {}
        }

        // 3. Fallback: Use landing page intent (Smart Keyword)
        // If they landed on a specific SEO page, that's likely their keyword
        const landingPageIntent = document.title.split('|')[0].trim();
        const estimatedKeyword = (organicKeyword === "Not Provided (Encrypted)") ? landingPageIntent : organicKeyword;

        // 4. Update Visitor Attributes
        if (typeof Tawk_API.setAttributes === 'function') {
          Tawk_API.setAttributes({
            'page_url': window.location.href,
            'page_title': document.title,
            'referrer': referrer,
            'estimated_keyword': estimatedKeyword,
            'source': urlParams.get('utm_source') || (referrer.includes('google') ? 'Google Organic' : 'Direct'),
            'term': urlParams.get('utm_term') || estimatedKeyword
          }, () => {});
        }
        
        // 5. Add an Event
        if (typeof Tawk_API.addEvent === 'function') {
          Tawk_API.addEvent('Navigation', {
            'link': window.location.href,
            'from': referrer,
            'intent': estimatedKeyword
          }, () => {});
        }
      }
    };

    // Small delay to ensure document.title is updated by usePageSEO
    const timer = setTimeout(updateTawk, 500);
    return () => clearTimeout(timer);
  }, [location]);

  // Title Protector: Prevent Tawk.to from overriding SEO title with "1 new message"
  useEffect(() => {
    const originalTitle = document.title;
    const interval = setInterval(() => {
      if (document.title.includes("new message") || document.title.includes("Tawk.to")) {
        document.title = originalTitle;
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [location]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <VisitTracker />
      <Suspense fallback={<PageLoader />}>
        <Routes>
        {/* Core pages */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/item/:id" element={<ProductDetail />} />
        <Route path="/products/:categorySlug" element={<Products />} />
        <Route path="/wholesale" element={<Wholesale />} />
        <Route path="/export" element={<ExportMarkets />} />
        <Route path="/global-markets" element={<ExportMarkets />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/catalogues" element={<Catalogues />} />
        <Route path="/blog" element={<Blog />} />
        {/* 301 Redirects for deleted/merged blogs */}
        <Route path="/blog/global-delivery-solutions-for-wholesalers" element={<Navigate replace to="/wholesale-imitation-jewellery-manufacturer-exporter-india" />} />
        <Route path="/blog/fast-delivery-wholesale-jewellery-india" element={<Navigate replace to="/wholesale-imitation-jewellery-manufacturer-exporter-india" />} />
        <Route path="/blog/factory-direct-jewellery-supplier" element={<Navigate replace to="/wholesale-imitation-jewellery-manufacturer-exporter-india" />} />
        <Route path="/blog/wholesale-imitation-jewellery-exporter" element={<Navigate replace to="/wholesale-imitation-jewellery-manufacturer-exporter-india" />} />
        
        {/* Phase 2: Redirects to Wholesale Jewellery Export India Guide */}
        <Route path="/blog/how-to-start-imitation-jewellery-export-business" element={<Navigate replace to="/blog/wholesale-jewellery-export-india-guide" />} />
        <Route path="/blog/moq-explained-wholesale-jewellery-buyers" element={<Navigate replace to="/blog/wholesale-jewellery-export-india-guide" />} />
        <Route path="/blog/export-artificial-jewellery-jaipur-usa" element={<Navigate replace to="/blog/wholesale-jewellery-export-india-guide" />} />
        <Route path="/blog/imitation-jewellery-export-documentation-checklist" element={<Navigate replace to="/blog/wholesale-jewellery-export-india-guide" />} />
        <Route path="/blog/find-international-buyers-imitation-jewellery" element={<Navigate replace to="/blog/wholesale-jewellery-export-india-guide" />} />
        <Route path="/blog/hs-code-customs-duties-imitation-jewellery" element={<Navigate replace to="/blog/wholesale-jewellery-export-india-guide" />} />
        <Route path="/blog/export-imitation-jewellery-usa-guide" element={<Navigate replace to="/blog/wholesale-jewellery-export-india-guide" />} />
        <Route path="/blog/exporting-artificial-jewellery-uk-post-brexit" element={<Navigate replace to="/blog/wholesale-jewellery-export-india-guide" />} />
        <Route path="/blog/uae-jewellery-market-dubai-buyers" element={<Navigate replace to="/blog/wholesale-jewellery-export-india-guide" />} />
        <Route path="/blog/sell-indian-fashion-jewellery-australia" element={<Navigate replace to="/blog/wholesale-jewellery-export-india-guide" />} />
        <Route path="/blog/export-imitation-jewellery-germany-eu" element={<Navigate replace to="/blog/wholesale-jewellery-export-india-guide" />} />
        
        {/* Phase 2: Redirects to Jaipur Manufacturing Hub Guide */}
        <Route path="/blog/jaipur-vs-mumbai-jewellery-wholesale" element={<Navigate replace to="/blog/jaipur-jewellery-manufacturing-hub" />} />
        <Route path="/blog/india-vs-china-imitation-jewellery-suppliers" element={<Navigate replace to="/blog/jaipur-jewellery-manufacturing-hub" />} />
        
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/why-choose-us" element={<WhyChooseUs />} />

        {/* Policy & info pages */}
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route
          path="/return-refund-cancellation-policy"
          element={<ReturnRefundPolicy />}
        />
        <Route path="/return-policy" element={<ReturnRefundPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/terms-conditions" element={<TermsAndConditions />} />

        {/* Collection pages */}
        <Route path="/collections/trendy-jewelry" element={<TrendyJewelry />} />
        <Route path="/collections/earrings" element={<Earrings />} />
        <Route path="/collections/necklaces" element={<Necklaces />} />
        <Route path="/collections/rings" element={<Rings />} />
        <Route path="/collections/bracelets" element={<Bracelets />} />
        <Route path="/collections/party-wear-jewelry" element={<PartyWear />} />
        <Route path="/collections/daily-wear-jewelry" element={<DailyWear />} />
        <Route
          path="/collections/minimalist-jewelry"
          element={<Minimalist />}
        />
        <Route path="/collections/korean-jewelry" element={<Korean />} />
        <Route path="/collections/oxidised-jewelry" element={<Oxidised />} />

        {/* Programmatic collection pages */}
        <Route
          path="/collections/minimalist-earrings"
          element={<ProgrammaticCollection />}
        />
        <Route
          path="/collections/party-wear-necklaces"
          element={<ProgrammaticCollection />}
        />
        <Route
          path="/collections/oxidised-rings"
          element={<ProgrammaticCollection />}
        />
        <Route
          path="/collections/korean-necklaces"
          element={<ProgrammaticCollection />}
        />
        <Route
          path="/collections/daily-wear-earrings"
          element={<ProgrammaticCollection />}
        />
        <Route
          path="/collections/statement-earrings"
          element={<ProgrammaticCollection />}
        />
        <Route
          path="/collections/gold-plated-jewelry"
          element={<ProgrammaticCollection />}
        />
        <Route
          path="/collections/bridal-jewelry"
          element={<ProgrammaticCollection />}
        />
        <Route
          path="/collections/kundan-jewelry"
          element={<ProgrammaticCollection />}
        />
        <Route
          path="/collections/meenakari-jewelry"
          element={<ProgrammaticCollection />}
        />
        <Route
          path="/collections/antique-jewelry"
          element={<ProgrammaticCollection />}
        />
        <Route
          path="/collections/temple-jewelry"
          element={<ProgrammaticCollection />}
        />
        <Route
          path="/collections/indo-western-jewelry"
          element={<ProgrammaticCollection />}
        />
        <Route
          path="/collections/silver-oxidised-jewelry"
          element={<ProgrammaticCollection />}
        />
        <Route
          path="/collections/wholesale-bangles"
          element={<ProgrammaticCollection />}
        />

        {/* Export market redirects to primary SEO hubs */}
        <Route path="/export-markets/usa" element={<Navigate replace to="/imitation-jewellery-supplier-usa" />} />
        <Route path="/jewellery-exporter-to-usa" element={<Navigate replace to="/imitation-jewellery-supplier-usa" />} />
        
        <Route path="/export-markets/uk" element={<Navigate replace to="/wholesale-jewellery-uk" />} />
        <Route path="/jewellery-supplier-uk" element={<Navigate replace to="/wholesale-jewellery-uk" />} />
        <Route path="/costume-jewellery-wholesale-uk" element={<Navigate replace to="/wholesale-jewellery-uk" />} />
        
        <Route path="/export-markets/uae" element={<Navigate replace to="/jewellery-exporter-uae" />} />
        <Route path="/imitation-jewellery-supplier-uae" element={<Navigate replace to="/jewellery-exporter-uae" />} />
        
        <Route path="/export-markets/australia" element={<Navigate replace to="/jewellery-exporter-australia" />} />
        <Route path="/export-indian-fashion-jewellery-australia" element={<Navigate replace to="/jewellery-exporter-australia" />} />
        
        <Route path="/export-markets/canada" element={<Navigate replace to="/jewellery-exporter-canada" />} />
        <Route path="/export-imitation-jewellery-canada" element={<Navigate replace to="/jewellery-exporter-canada" />} />
        
        <Route path="/export-markets/singapore" element={<Navigate replace to="/jewellery-exporter-singapore" />} />
        <Route path="/export-imitation-jewellery-singapore" element={<Navigate replace to="/jewellery-exporter-singapore" />} />
        
        <Route path="/export-markets/france" element={<Navigate replace to="/jewellery-exporter-france" />} />
        <Route path="/export-imitation-jewellery-france" element={<Navigate replace to="/jewellery-exporter-france" />} />
        
        <Route path="/export-markets/kuwait" element={<Navigate replace to="/jewellery-exporter-kuwait" />} />
        <Route path="/export-markets/malaysia" element={<Navigate replace to="/jewellery-exporter-malaysia" />} />
        <Route path="/export-markets/nigeria" element={<Navigate replace to="/jewellery-exporter-nigeria" />} />
        <Route path="/export-markets/saudi-arabia" element={<Navigate replace to="/jewellery-exporter-saudi-arabia" />} />
        <Route path="/export-markets/sri-lanka" element={<Navigate replace to="/jewellery-exporter-sri-lanka" />} />
        <Route path="/export-imitation-jewellery-germany-eu" element={<Navigate replace to="/jewellery-exporter-europe" />} />

        {/* Legacy Kuwait/Malaysia/Nigeria/SaudiArabia/SriLanka pages */}
        <Route
          path="/jewellery-exporter-kuwait"
          element={<JewelleryExporterKuwait />}
        />
        <Route
          path="/jewellery-exporter-malaysia"
          element={<JewelleryExporterMalaysia />}
        />
        <Route
          path="/jewellery-exporter-saudi-arabia"
          element={<JewelleryExporterSaudiArabia />}
        />
        <Route
          path="/jewellery-exporter-nigeria"
          element={<JewelleryExporterNigeria />}
        />
        <Route
          path="/jewellery-exporter-sri-lanka"
          element={<JewelleryExporterSriLanka />}
        />

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <AdminGuard>
              <AdminDashboard />
            </AdminGuard>
          }
        />
        <Route
          path="/admin/products"
          element={
            <AdminGuard>
              <AdminProducts />
            </AdminGuard>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <AdminGuard>
              <AdminCategories />
            </AdminGuard>
          }
        />
        <Route
          path="/admin/inquiries"
          element={
            <AdminGuard>
              <AdminInquiries />
            </AdminGuard>
          }
        />
        <Route
          path="/admin/gallery"
          element={
            <AdminGuard>
              <AdminGallery />
            </AdminGuard>
          }
        />
        <Route
          path="/admin/testimonials"
          element={
            <AdminGuard>
              <AdminTestimonials />
            </AdminGuard>
          }
        />
        <Route
          path="/admin/content"
          element={
            <AdminGuard>
              <AdminContent />
            </AdminGuard>
          }
        />
        <Route
          path="/admin/cms"
          element={
            <AdminGuard>
              <AdminCMS />
            </AdminGuard>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminGuard>
              <AdminOrders />
            </AdminGuard>
          }
        />
        <Route
          path="/admin/customers"
          element={
            <AdminGuard>
              <AdminCustomers />
            </AdminGuard>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <AdminGuard>
              <AdminAnalytics />
            </AdminGuard>
          }
        />
        <Route
          path="/admin/whatsapp-leads"
          element={
            <AdminGuard>
              <AdminWhatsAppLeads />
            </AdminGuard>
          }
        />
        <Route
          path="/admin/website-settings"
          element={
            <AdminGuard>
              <AdminWebsiteSettings />
            </AdminGuard>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <AdminGuard>
              <AdminSettings />
            </AdminGuard>
          }
        />
        <Route
          path="/admin/marketing"
          element={
            <AdminGuard>
              <AdminMarketing />
            </AdminGuard>
          }
        />
        <Route
          path="/admin/country-settings"
          element={
            <AdminGuard>
              <AdminCountrySettings />
            </AdminGuard>
          }
        />
        <Route
          path="/admin/logistics"
          element={
            <AdminGuard>
              <AdminLogistics />
            </AdminGuard>
          }
        />
        <Route
          path="/admin/payments"
          element={
            <AdminGuard>
              <AdminPayments />
            </AdminGuard>
          }
        />
        <Route
          path="/admin/automation"
          element={
            <AdminGuard>
              <AdminAutomation />
            </AdminGuard>
          }
        />
        <Route
          path="/admin/blog"
          element={
            <AdminGuard>
              <AdminBlog />
            </AdminGuard>
          }
        />
        <Route
          path="/admin/catalogue"
          element={<AdminGuard><AdminCatalogue /></AdminGuard>}
        />
        <Route
          path="/admin/gallery-folders"
          element={<AdminGuard><AdminGalleryFolders /></AdminGuard>}
        />
        <Route
          path="/admin/email-campaigns"
          element={<AdminGuard><AdminEmailCampaigns /></AdminGuard>}
        />
        <Route
          path="/admin/system-settings"
          element={<AdminGuard><AdminSystemSettings /></AdminGuard>}
        />

        {/* SEO landing pages */}
        <Route
          path="/wholesale-imitation-jewellery-manufacturer-exporter-india"
          element={<WholesaleImitationJewelleryManufacturerExporter />}
        />
        <Route
          path="/imitation-jewellery-exporter-india"
          element={<ImitationJewelleryExporterIndia />}
        />
        {/* 301 Redirects for merged SEO Landing Pages */}
        <Route path="/wholesale-imitation-jewellery" element={<Navigate replace to="/wholesale-imitation-jewellery-manufacturer-exporter-india" />} />
        <Route path="/wholesale-imitation-jewellery-india" element={<Navigate replace to="/wholesale-imitation-jewellery-manufacturer-exporter-india" />} />
        <Route path="/imitation-jewellery-manufacturer-india" element={<Navigate replace to="/wholesale-imitation-jewellery-manufacturer-exporter-india" />} />
        <Route path="/artificial-jewellery-wholesaler-india" element={<Navigate replace to="/wholesale-imitation-jewellery-manufacturer-exporter-india" />} />
        <Route
          path="/bridal-jewellery-wholesale"
          element={<BridalJewelleryWholesale />}
        />
        <Route
          path="/fashion-jewellery-exporter"
          element={<FashionJewelleryExporter />}
        />
        <Route
          path="/custom-jewellery-manufacturer"
          element={<CustomJewelleryManufacturer />}
        />
        <Route
          path="/fashion-jewellery-manufacturer-india"
          element={<FashionJewelleryManufacturerIndia />}
        />
        <Route
          path="/bridal-imitation-jewellery-wholesale"
          element={<BridalImitationJewelleryWholesale />}
        />
        <Route
          path="/bulk-jewellery-supplier"
          element={<BulkJewellerySupplier />}
        />
        <Route
          path="/jewellery-exporter-to-usa"
          element={<JewelleryExporterToUsa />}
        />
        <Route
          path="/jewellery-supplier-uk"
          element={<JewellerySupplierUk />}
        />
        <Route
          path="/jewellery-exporter-uae"
          element={<JewelleryExporterUae />}
        />
        <Route
          path="/imitation-jewellery-supplier-uae"
          element={<JewelleryExporterUae />}
        />
        <Route
          path="/private-label-jewellery-india"
          element={<PrivateLabelJewelleryIndia />}
        />
        <Route
          path="/kundan-jewellery-wholesale"
          element={<KundanJewelleryWholesale />}
        />
        <Route
          path="/temple-jewellery-manufacturer"
          element={<TempleJewelleryManufacturer />}
        />
        <Route
          path="/artificial-jewellery-exporter"
          element={<ArtificialJewelleryExporter />}
        />
        <Route
          path="/bridal-imitation-jewellery"
          element={<BridalImitationJewellery />}
        />
        <Route
          path="/oxidised-jewellery-wholesale"
          element={<OxidisedJewelleryWholesale />}
        />
        <Route
          path="/fashion-jewellery-exporter-india"
          element={<FashionJewelleryExporterIndia />}
        />
        <Route
          path="/oxidised-jewellery-supplier"
          element={<OxidisedJewellerySupplier />}
        />
        <Route
          path="/imitation-jewellery-supplier-usa"
          element={<ImitationJewellerySupplierUsa />}
        />
        <Route
          path="/imitation-jewellery-manufacturer-jaipur"
          element={<ImitationJewelleryManufacturerJaipur />}
        />
        <Route
          path="/wholesale-jewellery-rajasthan"
          element={<WholesaleJewelleryRajasthan />}
        />
        <Route
          path="/meenakari-jewellery-wholesale"
          element={<MeenakariJewelleryWholesale />}
        />
        <Route path="/wholesale-jewellery-uk" element={<WholesaleJewelleryUk />} />
        <Route path="/american-diamond-jewellery-wholesale" element={<AmericanDiamondJewelleryWholesale />} />
        <Route path="/gold-plated-jewellery-wholesale-india" element={<GoldPlatedJewelleryWholesale />} />
        <Route path="/antique-jewellery-wholesale-india" element={<AntiqueJewelleryWholesale />} />
        <Route path="/costume-jewellery-wholesale-uk" element={<CostumeJewelleryWholesaleUK />} />
        <Route path="/artificial-jewellery-wholesale" element={<ArtificialJewelleryWholesale />} />
        <Route path="/wholesale-jewelry-moq-50" element={<WholesaleJewelryMOQ50 />} />
        <Route path="/oxidized-silver-jewelry-wholesale-exporter" element={<OxidizedSilverJewelryWholesale />} />
        <Route path="/costume-jewelry-wholesale-supplier-india" element={<CostumeJewelryWholesaleSupplier />} />
        <Route path="/wholesale-bridal-jewelry-sets" element={<BridalJewelrySetsWholesale />} />
        <Route path="/necklace-sets-wholesale-exporter" element={<NecklaceSetsWholesale />} />
        <Route path="/jhumka-earrings-wholesale-bulk" element={<JhumkaEarringsWholesale />} />
        <Route path="/wholesale-jewelry-no-middleman" element={<NoMiddlemanJewelryWholesale />} />
        <Route
          path="/jewellery-exporter-australia"
          element={<JewelleryExporterAustralia />}
        />
        <Route
          path="/jewellery-exporter-canada"
          element={<JewelleryExporterCanada />}
        />
        <Route
          path="/jewellery-exporter-singapore"
          element={<JewelleryExporterSingapore />}
        />
        <Route
          path="/jewellery-exporter-europe"
          element={<JewelleryExporterEurope />}
        />
        <Route
          path="/jewellery-exporter-france"
          element={<JewelleryExporterFrance />}
        />
        <Route path="/factory-direct-jewelry-exporter" element={<FactoryDirectJewelryExporter />} />
        <Route path="/artificial-jewelry-exporter-moq" element={<ArtificialJewelryExporterMOQ />} />
        <Route path="/american-diamond-jewelry-exporter" element={<AmericanDiamondJewelryExporter />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>
      <WhatsAppButton />
      <BulkQuoteCart />
      <Toaster />
    </BrowserRouter>
  );
}
