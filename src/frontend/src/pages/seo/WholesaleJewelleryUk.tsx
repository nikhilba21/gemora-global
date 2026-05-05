import SeoLandingPage from "../../components/SeoLandingPage";

export default function WholesaleJewelleryUk() {
  return (
    <SeoLandingPage
      title="Wholesale Jewellery UK | Indian Imitation Jewellery Supplier — Gemora Global"
      metaDescription="Buy wholesale jewellery for UK market from Gemora Global, Jaipur India. 1700+ designs, MOQ 50 units. Gold plated, oxidised, statement jewellery."
      canonical="https://www.gemoraglobal.co/wholesale-jewellery-uk"
      h1="Wholesale Jewellery UK — Direct from India's Top Manufacturer"
      targetKeyword="wholesale-jewellery-uk"
      heroSubtitle="Gemora Global supplies wholesale jewellery to UK boutiques and fashion stores. Premium Indian fashion jewellery at factory-direct prices with full export documentation."
      hreflangs={[
        { lang: "en-gb", url: "https://www.gemoraglobal.co/wholesale-jewellery-uk" },
        { lang: "en", url: "https://www.gemoraglobal.co/wholesale-jewellery-uk" },
        { lang: "x-default", url: "https://www.gemoraglobal.co/wholesale-jewellery-uk" },
      ]}
      breadcrumbs={[
        { name: "Home", url: "https://www.gemoraglobal.co/" },
        { name: "Export Markets", url: "https://www.gemoraglobal.co/export" },
        { name: "Wholesale Jewellery UK — Direct from India's Top Manufacturer", url: "https://www.gemoraglobal.co/wholesale-jewellery-uk" },
      ]}
      faqs={[
        { question: "Do you export to UK?", answer: "Yes, Gemora Global regularly exports wholesale jewellery to UK. We provide full export documentation, competitive pricing, and reliable shipping via DHL/FedEx." },
        { question: "What is the MOQ for wholesale orders?", answer: "Minimum order quantity is 50 units per design. Mix designs allowed for larger orders." },
        { question: "How long does delivery take?", answer: "Standard DHL delivery takes 5-8 business days. Express options available." },
        { question: "Do you provide export documentation?", answer: "Yes. We provide commercial invoice, packing list, certificate of origin, and all required export documents for smooth customs clearance." },
      ]}
    />
  );
}
