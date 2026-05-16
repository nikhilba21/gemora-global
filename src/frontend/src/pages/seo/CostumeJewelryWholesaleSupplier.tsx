import { Link } from "react-router-dom";
import SeoLandingPage from "../../components/SeoLandingPage";

export default function CostumeJewelryWholesaleSupplier() {
  return (
    <SeoLandingPage
      title="Costume Jewelry Wholesale Supplier India | Gemora Global"
      metaDescription="Looking for a costume jewelry wholesale supplier in India? Gemora Global offers trendy, high-fashion artificial jewelry at factory-direct prices. MOQ 50 units."
      canonical="https://www.gemoraglobal.co/costume-jewelry-wholesale-supplier-india"
      h1="Costume Jewelry Wholesale Supplier India"
      targetKeyword="costume jewelry wholesale supplier india"
      heroSubtitle="Source trendy costume jewelry directly from India's leading manufacturer. Gemora Global provides high-fashion artificial jewelry with a low MOQ of 50 units. Perfect for global fashion retailers."
      breadcrumbs={[
        { name: "Home", url: "https://www.gemoraglobal.co/" },
        {
          name: "Costume Jewelry Wholesale Supplier",
          url: "https://www.gemoraglobal.co/costume-jewelry-wholesale-supplier-india",
        },
      ]}
      bodyContent={
        <>
          <h2 className="text-xl font-serif font-bold text-primary mt-0">
            India's Leading Costume Jewelry Wholesale Supplier
          </h2>
          <p>
            Gemora Global is a premier <strong>costume jewelry wholesale supplier in India</strong>, 
            providing high-fashion artificial jewelry to retailers, wholesalers, and 
            importers worldwide. Our expertise lies in creating trendy, high-quality 
            pieces that mimic the look of precious jewelry at a fraction of the cost.
          </p>
          <p>
            Whether you are looking for Western fashion jewelry, Indo-Western fusion, 
            or traditional Indian ethnic styles, our vast collection of 1700+ designs 
            ensures you find the perfect stock for your market.
          </p>

          <h2 className="text-xl font-serif font-bold text-primary">
            Why Partner with a Direct Manufacturer?
          </h2>
          <p>
            By working with Gemora Global, you are sourcing directly from the factory 
            in Jaipur. This gives you several key advantages:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li>
              <strong>Better Profit Margins:</strong> No middleman markups. You get 
              the best possible wholesale price directly from the source.
            </li>
            <li>
              <strong>Consistent Quality:</strong> We control the entire production 
              line, ensuring every piece meets our strict quality standards.
            </li>
            <li>
              <strong>Customization:</strong> We can modify designs, change plating 
              colors, or use specific stones to match your brand's unique aesthetic.
            </li>
            <li>
              <strong>Reliable Delivery:</strong> With over 13 years of export 
              experience, we ensure your bulk orders are packed securely and delivered 
              on time.
            </li>
          </ul>

          <h2 className="text-xl font-serif font-bold text-primary">
            Our Fashion & Costume Jewelry Categories
          </h2>
          <ul className="list-disc pl-6 space-y-1 text-sm">
            <li><strong>Trendy Necklaces:</strong> Statement pieces, layering chains, and elegant pendants.</li>
            <li><strong>Fashion Earrings:</strong> Hoops, dangles, studs, and designer earrings.</li>
            <li><strong>Bracelets & Bangles:</strong> From minimalist cuffs to heavy traditional bangles.</li>
            <li><strong>Designer Rings:</strong> Adjustable and fixed-size rings in various finishes.</li>
          </ul>

          <h2 className="text-xl font-serif font-bold text-primary">
            Wholesale Order Information
          </h2>
          <p>
            Our MOQ for costume jewelry is 50 units per design. We offer tiered 
            discounts for larger orders:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-sm">
            <li><strong>50 - 200 units:</strong> Standard Wholesale Price</li>
            <li><strong>200 - 500 units:</strong> 10% Discount</li>
            <li><strong>500+ units:</strong> 20% Discount + Custom Options</li>
          </ul>

          <h2 className="text-xl font-serif font-bold text-primary">
            Explore Other B2B Pages
          </h2>
          <ul className="list-disc pl-6 space-y-1 text-sm">
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
          q: "What materials do you use for costume jewelry?",
          a: "We use high-quality base metals like brass and copper, plated with real gold, silver, or rhodium. We also use premium American Diamonds (CZ) and synthetic stones.",
        },
        {
          q: "Do you provide custom branding?",
          a: "Yes, for bulk orders we can provide custom display cards and packaging with your brand logo.",
        },
        {
          q: "How long does shipping take to the USA/UK?",
          a: "Express shipping via DHL/FedEx takes approximately 5-8 business days for most international destinations.",
        },
      ]}
    />
  );
}
