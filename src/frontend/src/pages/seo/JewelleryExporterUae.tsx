import SeoLandingPage from "../../components/SeoLandingPage";

export default function JewelleryExporterUae() {
  return (
    <SeoLandingPage
      title="Jewellery Exporter UAE | Wholesale from India — Gemora Global"
      metaDescription="Best jewellery exporter to UAE from India. Gemora Global supplies wholesale bridal and fashion jewellery to UAE boutiques. MOQ 50 units, fast delivery."
      canonical="https://www.gemoraglobal.co/jewellery-exporter-uae"
      h1="Jewellery Exporter UAE — Premium Indian Wholesale Jewellery"
      targetKeyword="jewellery-exporter-uae"
      heroSubtitle="Gemora Global exports wholesale jewellery to UAE boutiques, gold souks, and fashion retailers. Bridal sets, American diamond, and kundan collections popular in UAE."
      hreflangs={[
        { lang: "en-ae", url: "https://www.gemoraglobal.co/jewellery-exporter-uae" },
        { lang: "en", url: "https://www.gemoraglobal.co/jewellery-exporter-uae" },
        { lang: "x-default", url: "https://www.gemoraglobal.co/jewellery-exporter-uae" },
      ]}
      breadcrumbs={[
        { name: "Home", url: "https://www.gemoraglobal.co/" },
        { name: "Export Markets", url: "https://www.gemoraglobal.co/export" },
        { name: "Jewellery Exporter UAE — Premium Indian Wholesale Jewellery", url: "https://www.gemoraglobal.co/jewellery-exporter-uae" },
      ]}
      faqs={[
        { question: "Do you export to UAE?", answer: "Yes, Gemora Global regularly exports wholesale jewellery to UAE. We provide full export documentation, competitive pricing, and reliable shipping via DHL/FedEx." },
        { question: "What is the MOQ for wholesale orders?", answer: "Minimum order quantity is 50 units per design. Mix designs allowed for larger orders." },
        { question: "How long does delivery take?", answer: "Standard DHL delivery takes 5-8 business days. Express options available." },
        { question: "Do you provide export documentation?", answer: "Yes. We provide commercial invoice, packing list, certificate of origin, and all required export documents for smooth customs clearance." },
      ]}
    />
  );
}
