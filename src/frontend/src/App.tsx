import { Toaster } from "@/components/ui/sonner";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import AdminGuard from "./components/AdminGuard";
import BulkQuoteCart from "./components/BulkQuoteCart";
import ScrollToTop from "./components/ScrollToTop";
import WhatsAppButton from "./components/WhatsAppButton";
import { useActor } from "./hooks/useActor";
import About from "./pages/About";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import ExportMarkets from "./pages/ExportMarkets";
import FAQ from "./pages/FAQ";
import Gallery from "./pages/Gallery";
import Home from "./pages/Home";
import JewelleryExporterKuwait from "./pages/JewelleryExporterKuwait";
import JewelleryExporterMalaysia from "./pages/JewelleryExporterMalaysia";
import JewelleryExporterNigeria from "./pages/JewelleryExporterNigeria";
import JewelleryExporterSaudiArabia from "./pages/JewelleryExporterSaudiArabia";
import JewelleryExporterSriLanka from "./pages/JewelleryExporterSriLanka";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ProductDetail from "./pages/ProductDetail";
import Products from "./pages/Products";
import ReturnRefundPolicy from "./pages/ReturnRefundPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import Wholesale from "./pages/Wholesale";
import Catalogues from "./pages/Catalogues";
import WhyChooseUs from "./pages/WhyChooseUs";
// Admin
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminAutomation from "./pages/admin/AdminAutomation";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminCMS from "./pages/admin/AdminCMS";
import AdminCatalogue from "./pages/admin/AdminCatalogue";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminContent from "./pages/admin/AdminContent";
import AdminCountrySettings from "./pages/admin/AdminCountrySettings";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminInquiries from "./pages/admin/AdminInquiries";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLogistics from "./pages/admin/AdminLogistics";
import AdminMarketing from "./pages/admin/AdminMarketing";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminSystemSettings from "./pages/admin/AdminSystemSettings";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminWebsiteSettings from "./pages/admin/AdminWebsiteSettings";
import AdminWhatsAppLeads from "./pages/admin/AdminWhatsAppLeads";
import AdminGalleryFolders from "./pages/admin/AdminGalleryFolders";
import AdminEmailCampaigns from "./pages/admin/AdminEmailCampaigns";
// Collections
import Bracelets from "./pages/collections/BraceletsCollection";
import DailyWear from "./pages/collections/DailyWearJewelry";
import Earrings from "./pages/collections/EarringsCollection";
import Korean from "./pages/collections/KoreanJewelry";
import Minimalist from "./pages/collections/MinimalistJewelry";
import Necklaces from "./pages/collections/NecklacesCollection";
import Oxidised from "./pages/collections/OxidisedJewelry";
import PartyWear from "./pages/collections/PartyWearJewelry";
import ProgrammaticCollection from "./pages/collections/ProgrammaticCollection";
import Rings from "./pages/collections/RingsCollection";
import TrendyJewelry from "./pages/collections/TrendyJewelry";
// Export Markets
import ExportAustralia from "./pages/export-markets/Australia";
import ExportCanada from "./pages/export-markets/Canada";
import ExportFrance from "./pages/export-markets/France";
import ExportKuwait from "./pages/export-markets/Kuwait";
import ExportMalaysia from "./pages/export-markets/Malaysia";
import ExportNigeria from "./pages/export-markets/Nigeria";
import ExportSaudiArabia from "./pages/export-markets/SaudiArabia";
import ExportSingapore from "./pages/export-markets/Singapore";
import ExportSriLanka from "./pages/export-markets/SriLanka";
import ExportUAE from "./pages/export-markets/UAE";
import ExportUK from "./pages/export-markets/UK";
import ExportUSA from "./pages/export-markets/USA";
// SEO pages
import ArtificialJewelleryExporter from "./pages/seo/ArtificialJewelleryExporter";
import BridalImitationJewellery from "./pages/seo/BridalImitationJewellery";
import BridalImitationJewelleryWholesale from "./pages/seo/BridalImitationJewelleryWholesale";
import BridalJewelleryWholesale from "./pages/seo/BridalJewelleryWholesale";
import BulkJewellerySupplier from "./pages/seo/BulkJewellerySupplier";
import CustomJewelleryManufacturer from "./pages/seo/CustomJewelleryManufacturer";
import FashionJewelleryExporter from "./pages/seo/FashionJewelleryExporter";
import FashionJewelleryExporterIndia from "./pages/seo/FashionJewelleryExporterIndia";
import FashionJewelleryManufacturerIndia from "./pages/seo/FashionJewelleryManufacturerIndia";
import ImitationJewelleryExporterIndia from "./pages/seo/ImitationJewelleryExporterIndia";
import ImitationJewelleryManufacturerJaipur from "./pages/seo/ImitationJewelleryManufacturerJaipur";
import ImitationJewellerySupplierUsa from "./pages/seo/ImitationJewellerySupplierUsa";
import JewelleryExporterAustralia from "./pages/seo/JewelleryExporterAustralia";
import JewelleryExporterCanada from "./pages/seo/JewelleryExporterCanada";
import JewelleryExporterEurope from "./pages/seo/JewelleryExporterEurope";
import JewelleryExporterFrance from "./pages/seo/JewelleryExporterFrance";
import JewelleryExporterSingapore from "./pages/seo/JewelleryExporterSingapore";
import JewelleryExporterToUsa from "./pages/seo/JewelleryExporterToUsa";
import JewelleryExporterUae from "./pages/seo/JewelleryExporterUae";
import JewellerySupplierUk from "./pages/seo/JewellerySupplierUk";
import KundanJewelleryWholesale from "./pages/seo/KundanJewelleryWholesale";
import MeenakariJewelleryWholesale from "./pages/seo/MeenakariJewelleryWholesale";
import OxidisedJewellerySupplier from "./pages/seo/OxidisedJewellerySupplier";
import OxidisedJewelleryWholesale from "./pages/seo/OxidisedJewelleryWholesale";
import PrivateLabelJewelleryIndia from "./pages/seo/PrivateLabelJewelleryIndia";
import TempleJewelleryManufacturer from "./pages/seo/TempleJewelleryManufacturer";
import WholesaleJewelleryRajasthan from "./pages/seo/WholesaleJewelleryRajasthan";
import WholesaleJewelleryUk from "./pages/seo/WholesaleJewelleryUk";
import AmericanDiamondJewelleryWholesale from "./pages/seo/AmericanDiamondJewelleryWholesale";
import WholesaleImitationJewelleryManufacturerExporter from "./pages/seo/WholesaleImitationJewelleryManufacturerExporter";
import GoldPlatedJewelleryWholesale from "./pages/seo/GoldPlatedJewelleryWholesale";
import AntiqueJewelleryWholesale from "./pages/seo/AntiqueJewelleryWholesale";
import CostumeJewelleryWholesaleUK from "./pages/seo/CostumeJewelleryWholesaleUK";
import ArtificialJewelleryWholesale from "./pages/seo/ArtificialJewelleryWholesale";


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

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <VisitTracker />
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

        {/* Export market pages */}
        <Route path="/export-markets/usa" element={<ExportUSA />} />
        <Route path="/export-markets/uk" element={<ExportUK />} />
        <Route path="/export-markets/australia" element={<ExportAustralia />} />
        <Route path="/export-markets/canada" element={<ExportCanada />} />
        <Route path="/export-markets/uae" element={<ExportUAE />} />
        <Route path="/export-markets/kuwait" element={<ExportKuwait />} />
        <Route path="/export-markets/malaysia" element={<ExportMalaysia />} />
        <Route path="/export-markets/singapore" element={<ExportSingapore />} />
        <Route
          path="/export-markets/saudi-arabia"
          element={<ExportSaudiArabia />}
        />
        <Route path="/export-markets/nigeria" element={<ExportNigeria />} />
        <Route path="/export-markets/sri-lanka" element={<ExportSriLanka />} />
        <Route path="/export-markets/france" element={<ExportFrance />} />

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
          path="/export-imitation-jewellery-france"
          element={<JewelleryExporterFrance />}
        />
        <Route
          path="/export-indian-fashion-jewellery-australia"
          element={<JewelleryExporterAustralia />}
        />
        <Route
          path="/export-imitation-jewellery-germany-eu"
          element={<JewelleryExporterEurope />}
        />
        <Route
          path="/export-imitation-jewellery-canada"
          element={<JewelleryExporterCanada />}
        />
        <Route
          path="/export-imitation-jewellery-singapore"
          element={<JewelleryExporterSingapore />}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <WhatsAppButton />
      <BulkQuoteCart />
      <Toaster />
    </BrowserRouter>
  );
}
