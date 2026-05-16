import { Link } from "react-router-dom";
import SeoLandingPage from "../../components/SeoLandingPage";

export default function OxidizedSilverJewelryWholesale() {
  return (
    <SeoLandingPage
      title="Oxidized Silver Jewelry Wholesale Exporter | Jaipur | Gemora Global"
      metaDescription="Leading oxidized silver jewelry wholesale exporter from Jaipur. Source bulk ethnic, boho, and tribal jewelry directly from manufacturer. MOQ 50 units. Global shipping."
      canonical="https://www.gemoraglobal.co/oxidized-silver-jewelry-wholesale-exporter"
      h1="Oxidized Silver Jewelry Wholesale Exporter"
      targetKeyword="oxidized silver jewelry wholesale exporter"
      heroSubtitle="Discover the finest oxidized silver jewelry from Jaipur. As a direct manufacturer and exporter, Gemora Global provides high-quality tribal and ethnic designs at wholesale prices. MOQ 50 units per design."
      breadcrumbs={[
        { name: "Home", url: "https://www.gemoraglobal.co/" },
        {
          name: "Oxidized Silver Jewelry Wholesale",
          url: "https://www.gemoraglobal.co/oxidized-silver-jewelry-wholesale-exporter",
        },
      ]}
      bodyContent={
        <>
          <h2 className="text-xl font-serif font-bold text-primary mt-0">
            Jaipur's Finest Oxidized Silver Jewelry Manufacturing
          </h2>
          <p>
            Jaipur is the global hub for traditional silver and oxidized jewelry 
            craftsmanship. At Gemora Global, we specialize in 
            <strong> oxidized silver jewelry wholesale</strong>, offering designs 
             that blend traditional Rajasthani motifs with modern boho-chic aesthetics.
          </p>
          <p>
            Our collection includes intricate necklaces, earrings (Jhumkas), 
            bangles, and rings made with high-grade base metals and premium 
            silver plating that undergoes a specialized oxidation process for 
            that authentic antique look.
          </p>

          <h2 className="text-xl font-serif font-bold text-primary">
            Why Source Oxidized Jewelry from Gemora Global?
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li>
              <strong>Authentic Designs:</strong> Tribal, ethnic, and vintage-inspired 
              collections that are in high demand globally.
            </li>
            <li>
              <strong>Premium Finish:</strong> We use advanced plating techniques 
              to ensure the oxidized look is durable and skin-friendly.
            </li>
            <li>
              <strong>Factory Direct Prices:</strong> Buy directly from our Jaipur 
              manufacturing unit and save on middleman margins.
            </li>
            <li>
              <strong>Export Quality:</strong> Every piece is checked for finish, 
              durability, and stone setting to meet international standards.
            </li>
          </ul>

          <h2 className="text-xl font-serif font-bold text-primary">
            Our Oxidized Jewelry Collection
          </h2>
          <p>
            We offer a wide range of products in the oxidized segment:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-sm">
            <li><strong>Oxidized Necklaces:</strong> Chokers, long malas, and statement bib necklaces.</li>
            <li><strong>Jhumkas & Earrings:</strong> Traditional Chandbalis, Studs, and heavy tribal Jhumkas.</li>
            <li><strong>Bangles & Cuffs:</strong> Adjustable tribal cuffs and traditional Rajasthani bangles.</li>
            <li><strong>Rings:</strong> Large statement rings with intricate floral and peacock motifs.</li>
          </ul>

          <h2 className="text-xl font-serif font-bold text-primary">
            Related Collections
          </h2>
          <ul className="list-disc pl-6 space-y-1 text-sm">
            <li>
              <Link to="/wholesale-jewelry-moq-50" className="text-primary underline">
                Wholesale Jewelry MOQ 50 Units
              </Link>
            </li>
            <li>
              <Link to="/kundan-jewellery-wholesale" className="text-primary underline">
                Kundan Jewelry Wholesale
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
          q: "Is your oxidized jewelry nickel-free?",
          a: "Yes, we prioritize safety and use skin-friendly, lead-free and nickel-free base metals for all our oxidized jewelry.",
        },
        {
          q: "What is the MOQ for oxidized jewelry?",
          a: "Our standard MOQ is 50 units per design. We also allow mixed design orders for larger bulk shipments.",
        },
        {
          q: "Do you export to the USA and Europe?",
          a: "Yes, we regularly export oxidized silver jewelry to boutiques and retailers in the USA, UK, and across Europe via DHL and FedEx.",
        },
      ]}
    />
  );
}
