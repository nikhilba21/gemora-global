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
        { q: "Do you export to UK?", a: "Yes, Gemora Global regularly exports wholesale jewellery to UK. We provide full export documentation, competitive pricing, and reliable shipping via DHL/FedEx." },
        { q: "What is the MOQ for wholesale orders?", a: "Minimum order quantity is 50 units per design. Mix designs allowed for larger orders." },
        { q: "How long does delivery take?", a: "Standard DHL delivery takes 5-8 business days. Express options available." },
        { q: "Do you provide export documentation?", a: "Yes. We provide commercial invoice, packing list, certificate of origin, and all required export documents for smooth customs clearance." },
      ]}
      bodyContent={<></>}
    />
  );
}
