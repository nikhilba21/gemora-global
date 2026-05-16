import React from 'react';
import SeoLandingPage from '../../components/SeoLandingPage';
import { BASE_URL } from '../../hooks/usePageSEO';

const FAQ = [
  {
    q: "What makes your AD jewelry 'export quality'?",
    a: "Our American Diamond (AD) jewelry uses high-grade AAA+ cubic zirconia stones, precision micro-setting (not glued), and 18k/24k gold or rhodium plating with anti-tarnish coating to meet international retail standards."
  },
  {
    q: "Do you offer different plating colors for AD jewelry?",
    a: "Yes. We offer yellow gold, rose gold, white gold (rhodium), and two-tone finishes. All our platings are skin-friendly and long-lasting."
  },
  {
    q: "What is the MOQ for wholesale AD jewelry?",
    a: "The MOQ for our American Diamond collection is 50 units per design. This includes rings, earrings, necklaces, and bangles."
  },
  {
    q: "Are the stones used in your jewelry real diamonds?",
    a: "No, they are high-quality Cubic Zirconia (American Diamonds), which provide a similar sparkle and clarity to real diamonds at a fraction of the cost, making them ideal for the fashion jewelry market."
  }
];

const AmericanDiamondJewelryExporter: React.FC = () => {
  return (
    <SeoLandingPage
      title="American Diamond Jewelry Exporter | Wholesale AD Jewelry India"
      metaDescription="Gemora Global is a leading American Diamond (AD) jewelry exporter from Jaipur. High-sparkle AAA+ stones, anti-tarnish finish, MOQ 50. Exporting worldwide."
      canonical="https://www.gemoraglobal.co/american-diamond-jewelry-exporter"
      h1="American Diamond Jewelry Exporter — Brilliance at Wholesale Prices"
      targetKeyword="american diamond jewelry exporter"
      heroSubtitle="Source premium American Diamond (AD) jewelry directly from Jaipur. Gemora Global offers high-sparkle AAA+ stones with advanced anti-tarnish coating and a flexible MOQ of 50 units."
      bodyContent={
        <>
          <p>
            American Diamond jewelry, also known as Cubic Zirconia jewelry, is the fastest-growing segment in the global fashion market. Gemora Global stands as a premier <strong>American Diamond jewelry exporter in India</strong>, specializing in high-sparkle, micro-set designs that perfectly mimic the brilliance of real diamonds.
          </p>

          <h2 className="text-xl font-serif font-bold text-primary">Premium AD Jewelry Manufacturing in Jaipur</h2>
          <p>
            Our AD collection is crafted in our Jaipur facility using precision technology. Unlike cheaper alternatives that use glue, our stones are <strong>hand-set or micro-pave set</strong> to ensure they stay in place for years. Combined with our signature anti-tarnish rhodium and gold plating, our AD jewelry is the top choice for luxury fashion retailers.
          </p>

          <h2 className="text-xl font-serif font-bold text-primary">Our AD Jewelry Export Range</h2>
          <p>
            We export a comprehensive range of AD jewelry to markets in the USA, UK, UAE, and Europe. Our collection includes:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li><strong>AD Necklace Sets:</strong> Minimalist chokers, heavy bridal sets, and pendant sets.</li>
            <li><strong>AD Earrings:</strong> Studs, hoops, chandeliers, and daily-wear danglers.</li>
            <li><strong>AD Rings & Bangles:</strong> Solitaire rings, stackable bands, and Kada-style bangles.</li>
            <li><strong>Bridal AD Jewelry:</strong> Specialized collections for high-end wedding boutiques.</li>
          </ul>

          <h2 className="text-xl font-serif font-bold text-primary">Why Wholesale Buyers Choose Our AD Collection</h2>
          <p>
            As a dedicated <em>AD jewelry manufacturer</em>, we offer prices that are 40-50% lower than trading companies. Our low MOQ of 50 units allows you to curate a high-end collection with minimal capital. Every piece is inspected for stone clarity, setting strength, and plating consistency before export.
          </p>

          <h2 className="text-xl font-serif font-bold text-primary">Worldwide Express Delivery</h2>
          <p>
            We provide door-to-door delivery to over 30 countries. Our AD jewelry is carefully packaged in premium anti-tarnish pouches and outer boxes to ensure it arrives in showroom condition. We handle all export customs clearance for a hassle-free sourcing experience.
          </p>
        </>
      }
      faqs={FAQ}
      breadcrumbs={[
        { name: "Home", url: BASE_URL },
        { name: "Collections", url: `${BASE_URL}/products` },
        { name: "AD Jewelry Exporter", url: `${BASE_URL}/american-diamond-jewelry-exporter` }
      ]}
    />
  );
};

export default AmericanDiamondJewelryExporter;
