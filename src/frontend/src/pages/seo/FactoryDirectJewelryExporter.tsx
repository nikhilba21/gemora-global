import React from 'react';
import SeoLandingPage from '../../components/SeoLandingPage';
import { BASE_URL } from '../../hooks/usePageSEO';

const FAQ = [
  {
    q: "Why should I buy factory direct jewelry from Jaipur?",
    a: "Buying factory direct from Jaipur allows you to eliminate middleman margins (saving 40-60%), ensures direct quality control, and gives you access to the latest designs 3-4 months before they hit international wholesale markets."
  },
  {
    q: "What is the MOQ for factory direct orders?",
    a: "Our factory direct MOQ is just 50 units per design. This is specifically designed for boutiques and online retailers who want to keep their inventory fresh without high capital risk."
  },
  {
    q: "Do you offer private labeling for factory orders?",
    a: "Yes, we offer complete private label services including custom branding, packaging, and exclusive design manufacturing for orders over 500 units per design."
  },
  {
    q: "How long does factory production take?",
    a: "For ready-to-ship inventory, we dispatch within 48 hours. For custom production or bulk manufacturing, the lead time is typically 15-25 business days depending on design complexity."
  }
];

const FactoryDirectJewelryExporter: React.FC = () => {
  return (
    <SeoLandingPage
      title="Factory Direct Jewelry Exporter Jaipur | No Middleman Wholesale"
      metaDescription="Sourcing jewelry direct from factory in Jaipur, India. Gemora Global offers factory pricing, MOQ 50, and 500+ designs. Save 60% on wholesale imitation jewelry."
      canonical="https://www.gemoraglobal.co/factory-direct-jewelry-exporter"
      h1="Factory Direct Jewelry Exporter — Jaipur's Leading Manufacturing Hub"
      targetKeyword="factory direct jewelry exporter"
      heroSubtitle="Stop paying middleman commissions. Source directly from our Jaipur manufacturing unit and save up to 60% on wholesale imitation jewelry. MOQ starts at just 50 units."
      bodyContent={
        <>
          <p>
            In the competitive world of fashion retail, your sourcing strategy is your biggest advantage. Gemora Global operates as a <strong>factory direct jewelry exporter in Jaipur</strong>, providing international buyers with a direct line to the world's most skilled jewelry artisans. By bypassing trading companies and agents, our clients secure the lowest possible prices and the highest quality standards.
          </p>

          <h2 className="text-xl font-serif font-bold text-primary">Why Source Direct from Gemora Global Factory?</h2>
          <p>
            When you source from a <em>jewelry manufacturer in Jaipur</em>, you aren't just buying products; you're investing in a supply chain that prioritizes your profit margins. Our Jaipur facility combines traditional hand-setting techniques with modern anti-tarnish technology, ensuring every piece meets global retail standards.
          </p>

          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li><strong>Zero Middleman Margins:</strong> Save up to 60% compared to local wholesale prices in USA, UK, and UAE.</li>
            <li><strong>Quality Assurance:</strong> 3-stage inspection process before every shipment leaves our factory.</li>
            <li><strong>Agile Sourcing:</strong> Low MOQ of 50 units allows you to test trends with minimal investment.</li>
            <li><strong>Direct Communication:</strong> Speak directly with the production team for customizations and lead times.</li>
          </ul>

          <h2 className="text-xl font-serif font-bold text-primary">Manufacturing Excellence in Every Piece</h2>
          <p>
            Our factory specializes in a wide range of export-quality jewelry, including Kundan, American Diamond (AD), Oxidized Silver, and High-Fashion Brass jewelry. Every piece is treated with our proprietary <strong>anti-tarnish coating</strong>, making it the perfect choice for retailers targeting long-term customer satisfaction.
          </p>

          <h2 className="text-xl font-serif font-bold text-primary">Global Export Logistics</h2>
          <p>
            We handle the entire export process from our Jaipur factory. With daily shipments via DHL and FedEx, we ensure your factory-direct order reaches your doorstep in the USA, UK, Europe, or Australia within 5-7 business days. We provide all necessary export documentation, including commercial invoices and certificates of origin.
          </p>
        </>
      }
      faqs={FAQ}
      breadcrumbs={[
        { name: "Home", url: BASE_URL },
        { name: "Wholesale", url: `${BASE_URL}/wholesale` },
        { name: "Factory Direct Exporter", url: `${BASE_URL}/factory-direct-jewelry-exporter` }
      ]}
    />
  );
};

export default FactoryDirectJewelryExporter;
