import { Link } from "react-router-dom";
import SeoLandingPage from "../../components/SeoLandingPage";

export default function NecklaceSetsWholesale() {
  return (
    <SeoLandingPage
      title="Necklace Sets Wholesale Exporter | Kundan & Gold-Plated | Gemora Global"
      metaDescription="Leading necklace sets wholesale exporter from India. Source kundan, choker, and bridal necklace sets directly from manufacturer. MOQ 50 units. Global shipping."
      canonical="https://www.gemoraglobal.co/necklace-sets-wholesale-exporter"
      h1="Necklace Sets Wholesale Exporter — Kundan & Gold-Plated"
      targetKeyword="necklace sets wholesale exporter"
      heroSubtitle="Discover premium necklace sets at factory-direct prices. Gemora Global is a leading exporter of Kundan, American Diamond, and gold-plated necklace sets from Jaipur. MOQ 50 units per design."
      breadcrumbs={[
        { name: "Home", url: "https://www.gemoraglobal.co/" },
        {
          name: "Necklace Sets Wholesale",
          url: "https://www.gemoraglobal.co/necklace-sets-wholesale-exporter",
        },
      ]}
      bodyContent={
        <>
          <h2 className="text-xl font-serif font-bold text-primary mt-0">
            India's Premier Necklace Sets Wholesale Hub
          </h2>
          <p>
            Gemora Global offers an extensive range of <strong>necklace sets wholesale</strong> 
            for international retailers and boutiques. Our collection spans from 
            traditional Indian ethnic wear to modern fusion designs, all manufactured 
            in our state-of-the-art Jaipur facility.
          </p>
          
          <h2 className="text-xl font-serif font-bold text-primary">
            Popular Necklace Categories
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li>
              <strong>Kundan Choker Sets:</strong> High-demand bridal and party 
              wear chokers with intricate stone settings.
            </li>
            <li>
              <strong>Long Mala Sets:</strong> Traditional Rani Haars and multi-layer 
              necklaces for a royal look.
            </li>
            <li>
              <strong>American Diamond (AD) Sets:</strong> Brilliant CZ stones 
              set in rhodium or gold plating for a luxury finish.
            </li>
            <li>
              <strong>Gold-Plated Designer Sets:</strong> Daily wear and festive 
              necklaces with premium anti-tarnish coating.
            </li>
          </ul>

          <h2 className="text-xl font-serif font-bold text-primary">
            Why Source Necklaces from Gemora Global?
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li><strong>MOQ 50 Units:</strong> Small-batch friendly for boutiques.</li>
            <li><strong>Factory Direct:</strong> Lowest possible prices, no middlemen.</li>
            <li><strong>Global Export:</strong> Fast shipping to USA, UK, UAE, and 30+ countries.</li>
            <li><strong>3-Stage QC:</strong> Every necklace set is inspected for finish and durability.</li>
          </ul>

          <h2 className="text-xl font-serif font-bold text-primary">
            Bulk Order Benefits
          </h2>
          <p>
            We offer tiered pricing for necklace sets. The more you order, the 
            more you save. Custom stone colors and plating options are available 
            for bulk orders above 200 units.
          </p>

          <h2 className="text-xl font-serif font-bold text-primary">
            Related Pages
          </h2>
          <ul className="list-disc pl-6 space-y-1 text-sm">
            <li>
              <Link to="/wholesale-bridal-jewelry-sets" className="text-primary underline">
                Bridal Jewelry Sets Wholesale
              </Link>
            </li>
            <li>
              <Link to="/kundan-jewellery-wholesale" className="text-primary underline">
                Kundan Jewelry Wholesale
              </Link>
            </li>
            <li>
              <Link to="/wholesale-jewelry-moq-50" className="text-primary underline">
                Wholesale Jewelry MOQ 50 Units
              </Link>
            </li>
          </ul>
        </>
      }
      faqs={[
        {
          q: "What is the MOQ for necklace sets?",
          a: "Our MOQ is 50 units per design for necklace sets.",
        },
        {
          q: "Do the sets include matching earrings?",
          a: "Yes, all our necklace sets come with a matching pair of earrings. Some bridal sets also include a maang tikka.",
        },
        {
          q: "Can I customize the stone colors?",
          a: "Yes, for wholesale orders, we can customize bead and stone colors to match your requirements.",
        },
      ]}
    />
  );
}
