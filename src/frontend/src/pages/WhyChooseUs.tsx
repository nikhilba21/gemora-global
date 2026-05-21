import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { usePageSEO } from "../hooks/usePageSEO";
import { useCanonical } from '../hooks/useCanonical';

const FAQ = [
  {
    q: "What makes Gemora Global different from other Indian jewelry exporters?",
    a: "Gemora Global is a direct manufacturer based in Jaipur, Rajasthan, not a trading agent. We own and operate our electroplating and casting foundries, which allows us to provide factory-direct pricing (saving buyers 15-30%), complete customization controls, multi-stage QC, and full regulatory compliance (REACH, Prop 65, CCPSA) that trading agents cannot guarantee.",
  },
  {
    q: "What is your Minimum Order Quantity (MOQ) for international boutique owners?",
    a: "Our MOQ is exceptionally low at just 50 units per design. This enables boutique owners, Shopify entrepreneurs, and wedding planners to test a wide range of designs in their local market with minimal capital investment.",
  },
  {
    q: "How does your anti-tarnish electro-coating process extend jewelry life?",
    a: "Every piece undergoes an advanced Electrophoretic Organic Lacquer coating (E-Coating) process. Using electrical currents, we deposit a microscopically thin, transparent organic lacquer barrier over the gold or silver plating, completely sealing it from air, sweat, and humidity, keeping it bright on showrooms for up to 12 months.",
  },
  {
    q: "Which countries do you regularly export to, and what is the transit time?",
    a: "We regularly export door-to-door to the USA, UK, Canada, UAE, Saudi Arabia, Kuwait, Australia, France, Germany, Singapore, and over 30 countries via DHL and FedEx. Standard door-to-door transit time is 5 to 8 business days.",
  },
  {
    q: "Do you provide custom design development and private labeling?",
    a: "Yes. For orders reaching Tier 4 (1,000+ units), we can fully brand and customize your velvet drawstring pouches, card inserts, and folding gift boxes with your brand logo directly at our Jaipur factory, providing retail-ready premium packaging.",
  },
];

export default function WhyChooseUs() {
  useCanonical();
  usePageSEO({
    title: "Why Choose Gemora Global — India's Trusted Imitation Jewellery Exporter",
    description: "10+ years of export experience, anti-tarnish finishing, 500+ designs, factory-direct pricing, and reliable global shipping. Discover why boutiques and wholesalers in 15+ countries choose Gemora Global.",
    canonical: "https://www.gemoraglobal.co/why-choose-us",
    ogTitle: "Why Choose Gemora Global — India's Trusted Imitation Jewellery Exporter",
    ogImage: "https://www.gemoraglobal.co/images/og-why-choose-us.jpg",
    faqItems: FAQ,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Hero Section */}
        <div className="bg-card border-b border-border py-12 md:py-20 px-4">
          <div className="container max-w-5xl mx-auto text-center">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl font-bold mb-6 leading-tight text-foreground">
              Why Wholesale Buyers Around the World Choose Gemora Global
            </h1>
            <p className="text-muted-foreground text-base md:text-xl max-w-3xl mx-auto leading-relaxed mb-8">
              Sourcing imitation, costume, and bridge jewelry internationally involves real risks — inconsistent quality, unreliable suppliers, and complicated customs logistics. Gemora Global was built specifically to eliminate those risks for overseas B2B buyers. Browse our{" "}
              <Link to="/products" className="text-primary font-semibold hover:underline">
                product catalogue
              </Link>{" "}
              or explore our{" "}
              <Link to="/wholesale" className="text-primary font-semibold hover:underline">
                wholesale pricing
              </Link>
              .
            </p>
          </div>
        </div>

        {/* Detailed B2B deep-dive sections */}
        <div className="container max-w-5xl mx-auto py-12 md:py-24 px-4 space-y-16">
          <section className="space-y-6">
            <h2 className="font-serif text-2xl md:text-4xl font-bold text-primary leading-tight">
              1. 10+ Years of Certified B2B Export Track Record (2013-Present)
            </h2>
            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
              Since our founding in 2013 in the heart of Jaipur, Rajasthan, Gemora Global has evolved from a small artisan workshop into a premier global manufacturing partner. Over the past decade, our dedicated export division has successfully completed thousands of door-to-door commercial shipments to over 15 countries, primarily serving boutique owners, B2B wholesale distributors, online Shopify retailers, and wedding salons.
            </p>
            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
              We have a deep, professional understanding of the diverse customs requirements, import tariffs, and logistics procedures across major global regions:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
              <li>
                <strong>United States (US Customs &amp; Border Protection):</strong> We fully support US import declarations, supporting Section 321 duty-free limits (for orders under $800 USD) and providing correct HTS code classifications to ensure fast customs release.
              </li>
              <li>
                <strong>United Kingdom (HMRC Regulations):</strong> We provide commercial invoices optimized for UK VAT accounting, helping VAT-registered businesses leverage Postponed VAT Accounting (PVA) to optimize cash flow.
              </li>
              <li>
                <strong>Canada (CBSA Guidelines):</strong> We handle all necessary import documentation, ensuring full compliance with the Canada Border Services Agency.
              </li>
              <li>
                <strong>United Arab Emirates (India-UAE CEPA):</strong> We assist UAE importers in obtaining a registered Certificate of Origin (COO) to secure a **0% customs duty** under the historic CEPA free trade agreement.
              </li>
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="font-serif text-2xl md:text-4xl font-bold text-primary leading-tight">
              2. Direct-from-Factory Price Advantage: Bypassing the Middlemen
            </h2>
            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
              In the imitation jewelry sector, sourcing from a local wholesale representative or a European-based trading agent can be highly expensive. These intermediate entities rarely own production units; they buy from local markets, add a **15% to 30% commission markup**, and pass the costs on to you.
            </p>
            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
              Gemora Global is a direct manufacturer. We own and operate our casting, metal refining, and electroplating foundries in Jaipur, Rajasthan. When you partner with us, you enjoy the maximum B2B price advantage:
            </p>
            <div className="overflow-x-auto rounded-xl border border-blue-700/20 not-prose my-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-primary/10 border-b border-blue-700/20">
                    <th className="text-left px-4 py-3 font-semibold text-foreground">Sourcing Factor</th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground">Gemora Global Direct Factory</th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground">Standard Trading Agent</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-blue-700/10 bg-background">
                    <td className="px-4 py-3 font-semibold text-primary">Price Markup</td>
                    <td className="px-4 py-3 text-foreground">0% (Factory-direct manufacturing cost)</td>
                    <td className="px-4 py-3 text-foreground">15% - 30% added commission</td>
                  </tr>
                  <tr className="border-b border-blue-700/10 bg-card">
                    <td className="px-4 py-3 font-semibold text-primary">Customization Controls</td>
                    <td className="px-4 py-3 text-foreground">Complete (Adjust stone colors, plating, and base metals)</td>
                    <td className="px-4 py-3 text-foreground">Extremely limited (Only stock items from local markets)</td>
                  </tr>
                  <tr className="border-b border-blue-700/10 bg-background">
                    <td className="px-4 py-3 font-semibold text-primary">Quality Control (QC)</td>
                    <td className="px-4 py-3 text-foreground">5-Stage rigorous in-house audits with lab reports</td>
                    <td className="px-4 py-3 text-foreground">Basic visual check, prone to defects</td>
                  </tr>
                  <tr className="border-b border-blue-700/10 bg-card">
                    <td className="px-4 py-3 font-semibold text-primary">Heavy Metal Compliance</td>
                    <td className="px-4 py-3 text-foreground">Guaranteed (EU REACH, Health Canada CCPSA, US Prop 65)</td>
                    <td className="px-4 py-3 text-foreground">Cannot guarantee chemical limits</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="font-serif text-2xl md:text-4xl font-bold text-primary leading-tight">
              3. Advanced Anti-Tarnish E-Coating: Our Engineering Quality Seal
            </h2>
            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
              The leading concern for costume jewelry retail owners is **oxidation and tarnishing**. Standard gold-plated jewelry reacts quickly with moisture, central heating, and sweat, turning dark and causing massive customer returns that damage your retail brand's reputation.
            </p>
            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
              At Gemora Global, we address this issue through science. Every piece of jewelry we manufacture is treated in our advanced **Electrophoretic Organic Lacquer (E-Coating)** bath. In this process:
            </p>
            <ol className="list-decimal pl-6 space-y-3 text-sm text-muted-foreground">
              <li>
                The jewelry piece is submerged in a liquid bath containing a specialized acrylic/polyurethane lacquer suspension.
              </li>
              <li>
                An electrical current is passed through the bath, causing the lacquer particles to bond uniformly with the gold or silver plated surface at a microscopic molecular level.
              </li>
              <li>
                The piece is cured in clean baking ovens to create a completely transparent, durable, and organic protective barrier.
              </li>
            </ol>
            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
              This advanced microscopic seal completely protects the underlying metal from exposure to oxygen and sweat, extending the retail display life of our products by up to 12 months under showroom conditions. This is a critical commercial advantage for Canadian and Northern European retailers, where dry central heating and fluctuating indoor temperatures accelerate standard oxidation.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="font-serif text-2xl md:text-4xl font-bold text-primary leading-tight">
              4. Complete Global Regulatory Compliance &amp; Chemical Safety
            </h2>
            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
              Governments around the world have implemented strict health regulations targeting heavy metals in consumer accessories. Selling non-compliant jewelry can result in massive fines, stock recalls, and customs seizures.
            </p>
            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
              Gemora Global ensures that all export batches destined for North America and Europe are manufactured in strictly regulated foundries:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
              <li>
                <strong>US Proposition 65 &amp; CPSC Compliance:</strong> We maintain strict heavy metal limits (Lead &lt; 90 ppm, Cadmium &lt; 75 ppm) across all US shipments.
              </li>
              <li>
                <strong>European Union REACH Annex XVII Compliance:</strong> Our foundries utilize strictly nickel-free plating alloys. This ensures that all jewelry releases less than <strong>0.5 µg/cm²/week</strong> of nickel, preventing contact dermatitis and skin allergies.
              </li>
              <li>
                <strong>Health Canada CCPSA Compliance:</strong> We submit our production batches to leading international laboratories (such as SGS and Intertek) to obtain CCPSA heavy metal safety certificates.
              </li>
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="font-serif text-2xl md:text-4xl font-bold text-primary leading-tight">
              5. Eco-Friendly and Private Label Branded Packaging Options
            </h2>
            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
              Modern global consumers are highly eco-conscious and appreciate premium, sustainable presentation. Gemora Global helps you build your own brand identity directly from our Jaipur factory:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
              <li>
                <strong>Sustainable Kraft Packing:</strong> We offer natural, unbranded kraft paper boxes and recycled cardboard sleeves that minimize plastic waste and align with global green retail trends.
              </li>
              <li>
                <strong>Velvet Drawstring Pouches:</strong> Premium velvet or organic cotton pouches that protect the jewelry stone settings during transport and provide a high-end unboxing experience for your retail customers.
              </li>
              <li>
                <strong>Private Label Custom Branding:</strong> For orders reaching Tier 4 (1,000+ units), we can fully brand and customize your gift boxes, card inserts, and pouches with your brand logo, corporate colors, and custom barcodes, saving you substantial packaging costs.
              </li>
            </ul>
          </section>
        </div>

        {/* FAQ Section */}
        <div className="bg-primary/10 border-y border-primary/20 py-12 md:py-20 px-4">
          <div className="container max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-8 text-center text-foreground">
              Frequently Asked Questions (FAQs)
            </h2>
            <div className="space-y-6">
              {FAQ.map((f) => (
                <div key={f.q} className="bg-card border border-border rounded-xl p-6 md:p-8">
                  <h3 className="font-semibold text-lg mb-3 text-primary leading-tight">
                    {f.q}
                  </h3>
                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                    {f.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="container max-w-4xl mx-auto py-16 md:py-24 text-center px-4">
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6 text-foreground">
            Ready to Partner with Jaipur's Trusted Exporter?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-10 text-base md:text-lg leading-relaxed">
            Join thousands of global boutiques and wholesale distributors who trust Gemora Global for premium, compliant, and factory-direct imitation jewelry. View our{" "}
            <Link to="/gallery" className="text-primary font-semibold hover:underline">
              gallery
            </Link>{" "}
            or{" "}
            <Link to="/contact" className="text-primary font-semibold hover:underline">
              send an inquiry
            </Link>
            .
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-6 text-base font-semibold w-full sm:w-auto min-h-[48px] rounded-xl"
            >
              <Link to="/contact">Send Inquiry Now</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10 px-10 py-6 text-base font-semibold w-full sm:w-auto min-h-[48px] rounded-xl"
            >
              <Link to="/products">Browse Products</Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
