import { Link } from "react-router-dom";
import SeoLandingPage from "../../components/SeoLandingPage";

export default function JhumkaEarringsWholesale() {
  return (
    <SeoLandingPage
      title="Jhumka Earrings Wholesale Bulk | Jaipur Manufacturer | Gemora Global"
      metaDescription="Leading Jhumka earrings wholesale supplier in India. Source bulk kundan, meenakari, and oxidized Jhumkas directly from manufacturer. MOQ 50 units. Worldwide shipping."
      canonical="https://www.gemoraglobal.co/jhumka-earrings-wholesale-bulk"
      h1="Jhumka Earrings Wholesale Bulk"
      targetKeyword="jhumka earrings wholesale bulk"
      heroSubtitle="Discover the largest collection of Jhumka earrings at wholesale prices. Gemora Global is a leading Jaipur manufacturer of ethnic and modern Jhumkas. MOQ 50 units per design."
      breadcrumbs={[
        { name: "Home", url: "https://www.gemoraglobal.co/" },
        {
          name: "Jhumka Earrings Wholesale",
          url: "https://www.gemoraglobal.co/jhumka-earrings-wholesale-bulk",
        },
      ]}
      bodyContent={
        <>
          <h2 className="text-xl font-serif font-bold text-primary mt-0">
            India's Favorite Jhumka Earrings Wholesale Source
          </h2>
          <p>
            Jhumkas are a timeless staple in ethnic fashion. Gemora Global offers 
            <strong> Jhumka earrings wholesale bulk</strong> orders for boutiques 
            and distributors worldwide. Our Jhumkas are handcrafted in Jaipur 
            using traditional and modern techniques.
          </p>
          
          <h2 className="text-xl font-serif font-bold text-primary">
            Our Jhumka Varieties
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li>
              <strong>Kundan Jhumkas:</strong> Elegant bridal-style Jhumkas with 
              stone settings and pearl hangings.
            </li>
            <li>
              <strong>Oxidized Silver Jhumkas:</strong> Tribal and boho-chic 
              designs perfect for casual and festive wear.
            </li>
            <li>
              <strong>Meenakari Jhumkas:</strong> Colorful hand-painted enamel 
              designs that are highly popular in ethnic retail.
            </li>
            <li>
              <strong>Antique Gold-Plated Jhumkas:</strong> Classic South Indian 
              and temple-style Jhumkas with a rich vintage look.
            </li>
          </ul>

          <h2 className="text-xl font-serif font-bold text-primary">
            Why Source Jhumkas from Us?
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li><strong>Factory Prices:</strong> Lowest price per unit for bulk buyers.</li>
            <li><strong>Low MOQ:</strong> Start with just 50 units per design.</li>
            <li><strong>Custom Designs:</strong> Private label and custom plating available.</li>
            <li><strong>Fast Shipping:</strong> Secure packaging and global delivery.</li>
          </ul>

          <h2 className="text-xl font-serif font-bold text-primary">
            Bulk Pricing Tiers
          </h2>
          <p>
            We offer specialized pricing for high-volume Jhumka orders. Contact 
            us for our latest catalogue and bulk price list.
          </p>

          <h2 className="text-xl font-serif font-bold text-primary">
            Related Collections
          </h2>
          <ul className="list-disc pl-6 space-y-1 text-sm">
            <li>
              <Link to="/oxidized-silver-jewelry-wholesale-exporter" className="text-primary underline">
                Oxidized Silver Jewelry Wholesale
              </Link>
            </li>
            <li>
              <Link to="/wholesale-jewelry-moq-50" className="text-primary underline">
                Wholesale Jewelry MOQ 50 Units
              </Link>
            </li>
            <li>
              <Link to="/imitation-jewellery-manufacturer-jaipur" className="text-primary underline">
                Artificial Jewelry Manufacturer Jaipur
              </Link>
            </li>
          </ul>
        </>
      }
      faqs={[
        {
          q: "What is the MOQ for Jhumka earrings?",
          a: "The MOQ for Jhumka earrings is 50 units per design.",
        },
        {
          q: "Are the earrings lightweight?",
          a: "We offer both lightweight daily-wear Jhumkas and heavy bridal-style Jhumkas. Specific weights are mentioned in our catalogue.",
        },
        {
          q: "Do you ship to the UK and Canada?",
          a: "Yes, we ship Jhumkas globally via DHL and FedEx.",
        },
      ]}
    />
  );
}
