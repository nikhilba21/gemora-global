import SeoLandingPage from "../../components/SeoLandingPage";

export default function JewellerySupplierUk() {
  return (
    <SeoLandingPage
      title="Jewellery Supplier UK | Indian Wholesale Jewellery — Gemora Global"
      metaDescription="Top jewellery supplier for UK boutiques. Gemora Global supplies wholesale imitation jewellery to UK. MOQ 50 units, nickel-free options, DHL 5-8 days."
      canonical="https://www.gemoraglobal.co/jewellery-supplier-uk"
      h1="Jewellery Supplier UK — Wholesale Indian Fashion Jewellery"
      targetKeyword="jewellery-supplier-uk"
      heroSubtitle="Gemora Global is a leading jewellery supplier to UK boutiques, ethnic fashion stores, and online retailers. Nickel-free collections available for EU compliance."
      hreflangs={[
        { lang: "en-gb", url: "https://www.gemoraglobal.co/jewellery-supplier-uk" },
        { lang: "en", url: "https://www.gemoraglobal.co/jewellery-supplier-uk" },
        { lang: "x-default", url: "https://www.gemoraglobal.co/jewellery-supplier-uk" },
      ]}
      breadcrumbs={[
        { name: "Home", url: "https://www.gemoraglobal.co/" },
        { name: "Export Markets", url: "https://www.gemoraglobal.co/export" },
        { name: "Jewellery Supplier UK — Wholesale Indian Fashion Jewellery", url: "https://www.gemoraglobal.co/jewellery-supplier-uk" },
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
