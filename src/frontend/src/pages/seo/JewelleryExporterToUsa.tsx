import SeoLandingPage from "../../components/SeoLandingPage";

export default function JewelleryExporterToUsa() {
  return (
    <SeoLandingPage
      title="Jewellery Exporter to USA | Wholesale Indian Jewellery — Gemora Global"
      metaDescription="Leading jewellery exporter to USA from India. Wholesale imitation jewellery, MOQ 50 units. Gold plated, American diamond, kundan sets. DHL delivery."
      canonical="https://www.gemoraglobal.co/jewellery-exporter-to-usa"
      h1="Jewellery Exporter to USA — Premium Wholesale from India"
      targetKeyword="jewellery-exporter-to-usa"
      heroSubtitle="Gemora Global exports wholesale jewellery to USA boutiques, distributors, and online retailers. 1700+ designs, factory pricing, full export documentation."
      hreflangs={[
        { lang: "en-us", url: "https://www.gemoraglobal.co/jewellery-exporter-to-usa" },
        { lang: "en", url: "https://www.gemoraglobal.co/jewellery-exporter-to-usa" },
        { lang: "x-default", url: "https://www.gemoraglobal.co/jewellery-exporter-to-usa" },
      ]}
      breadcrumbs={[
        { name: "Home", url: "https://www.gemoraglobal.co/" },
        { name: "Export Markets", url: "https://www.gemoraglobal.co/export" },
        { name: "Jewellery Exporter to USA — Premium Wholesale from India", url: "https://www.gemoraglobal.co/jewellery-exporter-to-usa" },
      ]}
      faqs={[
        { question: "Do you export to USA?", answer: "Yes, Gemora Global regularly exports wholesale jewellery to USA. We provide full export documentation, competitive pricing, and reliable shipping via DHL/FedEx." },
        { question: "What is the MOQ for wholesale orders?", answer: "Minimum order quantity is 50 units per design. Mix designs allowed for larger orders." },
        { question: "How long does delivery take?", answer: "Standard DHL delivery takes 5-8 business days. Express options available." },
        { question: "Do you provide export documentation?", answer: "Yes. We provide commercial invoice, packing list, certificate of origin, and all required export documents for smooth customs clearance." },
      ]}
    />
  );
}
