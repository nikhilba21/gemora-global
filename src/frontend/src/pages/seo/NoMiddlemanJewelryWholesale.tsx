import { Link } from "react-router-dom";
import SeoLandingPage from "../../components/SeoLandingPage";

export default function NoMiddlemanJewelryWholesale() {
  return (
    <SeoLandingPage
      title="Wholesale Jewelry No Middleman | Direct from Manufacturer | Gemora Global"
      metaDescription="Source wholesale jewelry directly from manufacturer with no middleman. Save 30-50% on cost. Gemora Global Jaipur offers factory-direct prices. MOQ 50 units."
      canonical="https://www.gemoraglobal.co/wholesale-jewelry-no-middleman"
      h1="Wholesale Jewelry No Middleman — Direct from Factory"
      targetKeyword="wholesale jewelry no middleman"
      heroSubtitle="Stop paying agent commissions. Source your wholesale jewelry directly from our Jaipur factory. Gemora Global offers transparent, no-middleman pricing for retailers worldwide. MOQ 50 units."
      breadcrumbs={[
        { name: "Home", url: "https://www.gemoraglobal.co/" },
        {
          name: "Wholesale Jewelry No Middleman",
          url: "https://www.gemoraglobal.co/wholesale-jewelry-no-middleman",
        },
      ]}
      bodyContent={
        <>
          <h2 className="text-xl font-serif font-bold text-primary mt-0">
            Why Source Jewelry with No Middleman?
          </h2>
          <p>
            In the jewelry industry, every agent, trading company, and local 
            wholesaler adds a markup of 20% to 50% to the product's base cost. 
            When you source <strong>wholesale jewelry with no middleman</strong>, 
            you bypass these unnecessary costs and gain a significant 
            competitive advantage in your retail market.
          </p>
          <p>
            Gemora Global is a direct manufacturer based in Jaipur. When you 
            work with us, you are communicating directly with the source.
          </p>
          
          <h2 className="text-xl font-serif font-bold text-primary">
            The Benefits of Factory-Direct Sourcing
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li>
              <strong>Maximum Profit Margins:</strong> Access the true base price 
              of the jewelry. Save up to 50% compared to local importers.
            </li>
            <li>
              <strong>Direct Quality Control:</strong> We handle the production. 
              There is no ambiguity about the materials or plating quality.
            </li>
            <li>
              <strong>Faster Communication:</strong> Get immediate updates on 
              production status and custom requirements directly from our production team.
            </li>
            <li>
              <strong>Exclusive Access:</strong> Be the first to stock new 
              designs as soon as they leave our production floor.
            </li>
          </ul>

          <h2 className="text-xl font-serif font-bold text-primary">
            Transparency in Every Order
          </h2>
          <p>
            We believe in transparent B2B relationships. Our pricing tiers are 
            consistent, our lead times are realistic, and our quality is 
            guaranteed. We handle the export documentation and logistics, 
            making the direct sourcing process as simple as buying from a local wholesaler.
          </p>

          <h2 className="text-xl font-serif font-bold text-primary">
            Ready to Cut the Middleman?
          </h2>
          <ul className="list-disc pl-6 space-y-1 text-sm">
            <li>
              <Link to="/imitation-jewellery-manufacturer-jaipur" className="text-primary underline">
                Artificial Jewelry Manufacturer Jaipur
              </Link>
            </li>
            <li>
              <Link to="/wholesale-jewelry-moq-50" className="text-primary underline">
                Wholesale Jewelry MOQ 50 Units
              </Link>
            </li>
            <li>
              <Link to="/bulk-jewellery-supplier" className="text-primary underline">
                Bulk Jewelry Supplier India
              </Link>
            </li>
          </ul>
        </>
      }
      faqs={[
        {
          q: "How much can I save by buying direct from the manufacturer?",
          a: "Typically, retailers save between 30% to 50% when they source directly from our factory compared to buying from local importers or trading companies in their country.",
        },
        {
          q: "Is it difficult to handle the import process?",
          a: "Not with us. We handle all the export documentation (Commercial Invoice, COO, etc.) and provide door-to-door shipping via DHL/FedEx. It's as simple as ordering locally.",
        },
        {
          q: "What is your MOQ for direct factory orders?",
          a: "Our factory-direct MOQ is just 50 units per design.",
        },
      ]}
    />
  );
}
