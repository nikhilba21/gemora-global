import { Link } from "react-router-dom";
import SeoLandingPage from "../../components/SeoLandingPage";

export default function ArtificialJewelleryWholesalerIndia() {
  return (
    <SeoLandingPage
      title="Artificial Jewellery Wholesaler India | Distributor Programme"
      metaDescription="Gemora Global — artificial jewellery wholesaler in Jaipur. Wholesale distributor programme, credit terms, exclusive territory rights for India domestic buyers. Est. 2011."
      canonical="https://gemoraglobal-tje.caffeine.xyz/artificial-jewellery-wholesaler-india"
      h1="Artificial Jewellery Wholesaler India — Distributor & Reseller Programme"
      targetKeyword="artificial jewellery wholesaler india"
      heroSubtitle="India's domestic distributor programme from Gemora Global, Jaipur. Three-tier distributor structure (Bronze / Silver / Gold) with exclusive territory rights, credit terms, and advance catalogue access for verified wholesale partners. Established 2011."
      breadcrumbs={[
        { name: "Home", url: "https://gemoraglobal-tje.caffeine.xyz/" },
        {
          name: "Artificial Jewellery Wholesaler India",
          url: "https://gemoraglobal-tje.caffeine.xyz/artificial-jewellery-wholesaler-india",
        },
      ]}
      bodyContent={
        <>
          <h2 className="text-xl font-serif font-bold text-primary mt-0">
            India's Premier Artificial Jewellery Wholesale Distributor Programme
          </h2>
          <p>
            Gemora Global operates India's most structured artificial jewellery
            wholesale distributor programme — designed specifically for serious
            domestic buyers who want more than just a supplier. Our programme
            gives registered distributors exclusive territory rights, credit
            terms, deeper pricing, and a partnership that grows with your
            business volume.
          </p>
          <p>
            Based in Jaipur, Rajasthan — the heart of India's imitation
            jewellery industry — we supply artificial jewellery to distributors
            across every major state: Delhi NCR, Maharashtra, Gujarat, Tamil
            Nadu, Karnataka, Telangana, West Bengal, Uttar Pradesh, Punjab,
            Kerala, Madhya Pradesh, and Rajasthan. Our domestic supply chain is
            optimised for reliable delivery via BlueDart, Delhivery, and DTDC
            with same-day dispatch from our Jaipur warehouse on in-stock items.
          </p>

          <h2 className="text-xl font-serif font-bold text-primary">
            Three-Tier Distributor Structure — Bronze, Silver &amp; Gold
          </h2>
          <p>
            Unlike flat-rate wholesale suppliers, Gemora Global operates a
            structured three-tier distributor programme that rewards volume
            commitment with progressively better pricing, rights, and support:
          </p>

          <div className="overflow-x-auto rounded-xl border border-blue-700/20 not-prose my-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-primary/10 border-b border-blue-700/20">
                  <th className="text-left px-4 py-3 font-semibold text-foreground">
                    Tier
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">
                    Monthly Volume
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">
                    Pricing Benefit
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">
                    Territory Rights
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    tier: "🥉 Bronze",
                    volume: "₹25,000 – ₹1 lakh/month",
                    pricing: "5% below standard wholesale",
                    territory: "District-level preference",
                  },
                  {
                    tier: "🥈 Silver",
                    volume: "₹1 lakh – ₹5 lakh/month",
                    pricing: "10–12% below standard wholesale",
                    territory: "State-level territory preference",
                  },
                  {
                    tier: "🥇 Gold",
                    volume: "₹5 lakh+/month",
                    pricing: "15–20% below standard wholesale",
                    territory: "Exclusive state territory rights",
                  },
                ].map((row, i) => (
                  <tr
                    key={row.tier}
                    className={`border-b border-blue-700/10 ${i % 2 === 0 ? "bg-background" : "bg-card"}`}
                  >
                    <td className="px-4 py-3 font-semibold text-primary">
                      {row.tier}
                    </td>
                    <td className="px-4 py-3 text-foreground">{row.volume}</td>
                    <td className="px-4 py-3 text-sky-600 font-medium">
                      {row.pricing}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {row.territory}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-sm">
            All tiers receive access to the distributor price list, advance
            catalogue previews, and marketing support materials. Tier upgrades
            are assessed quarterly based on trailing 3-month purchase volume.
          </p>

          <h2 className="text-xl font-serif font-bold text-primary">
            Exclusive Territory Rights for Distributors
          </h2>
          <p>
            Our Silver and Gold tier distributors receive formal territory
            preference agreements — a commitment from Gemora Global to direct
            new retailer enquiries from within your assigned state or district
            to you, rather than supplying them directly:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li>
              <strong>District-level preference (Bronze):</strong> Retailer
              enquiries from your district are referred to you first. No formal
              exclusivity, but strong practical protection in your local market.
            </li>
            <li>
              <strong>State-level territory preference (Silver):</strong> New
              wholesale retailer enquiries from your assigned state are
              redirected to you. Gemora Global does not supply competing
              distributors in your state without your knowledge.
            </li>
            <li>
              <strong>Exclusive state rights (Gold):</strong> Formal written
              exclusive territory agreement — Gemora Global will not supply any
              other distributor in your state for the duration of the agreement.
              Retailer-direct purchases also channelled through you.
            </li>
          </ul>

          <h2 className="text-xl font-serif font-bold text-primary">
            Credit Terms for Verified Indian Distributors
          </h2>
          <p>
            We understand that managing inventory cycles requires flexible
            payment terms. Gemora Global offers structured credit terms to
            eligible registered distributors:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li>
              <strong>New distributor (first order):</strong> 100% advance
              payment required. This is standard for all new wholesale accounts.
            </li>
            <li>
              <strong>After first 3 verified orders:</strong> Eligible to apply
              for 30% advance + net-15 credit (70% within 15 days of delivery).
            </li>
            <li>
              <strong>Silver tier (6+ orders):</strong> Net-30 credit terms
              available with a signed credit agreement and post-dated cheque
              (PDC) security for orders above ₹50,000.
            </li>
            <li>
              <strong>Gold tier distributors:</strong> Net-45 credit terms and
              an assigned account manager. Credit limit reviewed and expanded
              based on order history.
            </li>
            <li>
              <strong>PDC accepted:</strong> Post-dated cheques accepted as
              security for all credit-term orders from registered distributors
              in good standing.
            </li>
          </ul>

          <h2 className="text-xl font-serif font-bold text-primary">
            Catalogue Access &amp; New Arrival Previews
          </h2>
          <p>
            Registered distributors receive privileged access to our product
            catalogue and new season previews — giving you the inventory
            advantage over unregistered buyers:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li>
              <strong>Advance season preview (4–6 weeks early):</strong>{" "}
              Seasonal collections (festive, bridal, casual, contemporary) are
              shared exclusively with registered distributors 4–6 weeks before
              general availability — letting you lock in popular designs before
              stock runs out.
            </li>
            <li>
              <strong>Personalised price-tier catalogue:</strong> Your digital
              catalogue shows your applicable distributor pricing tier
              automatically — no need to negotiate prices on each order.
            </li>
            <li>
              <strong>WhatsApp new arrivals broadcast:</strong> New designs
              added to the catalogue are sent via WhatsApp to registered
              distributors within 24 hours of going live.
            </li>
            <li>
              <strong>Seasonal lookbooks:</strong> Curated PDF lookbooks for
              each season with recommended display configurations for boutique
              and retail store settings.
            </li>
          </ul>

          <h2 className="text-xl font-serif font-bold text-primary">
            Marketing Support for Distributors
          </h2>
          <p>
            We equip our distributors with professional marketing materials to
            support their retailer outreach and social media:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li>
              <strong>High-resolution product images:</strong> Professional
              jewellery photography on white and lifestyle backgrounds,
              available for all catalogue designs. Use freely on your website,
              Instagram, or WhatsApp catalogue.
            </li>
            <li>
              <strong>Catalogue PDFs:</strong> Branded and unbranded PDF
              catalogues for sharing with your retail customers.
            </li>
            <li>
              <strong>WhatsApp-optimised content:</strong> Square-format product
              images and caption templates formatted for WhatsApp Commerce and
              Instagram sharing.
            </li>
            <li>
              <strong>Pricing &amp; margin guidance:</strong> Suggested retail
              price (SRP) recommendations by category to help you set
              competitive margins in your market.
            </li>
          </ul>

          <h2 className="text-xl font-serif font-bold text-primary">
            Domestic India Shipping — Same-Day Dispatch from Jaipur
          </h2>
          <p>
            We ship pan-India via BlueDart, Delhivery, DTDC, and Ekart. Our
            Jaipur warehouse dispatches confirmed in-stock orders on the same
            business day for orders placed before 2 PM IST:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-sm">
            <li>
              Metro cities (Delhi, Mumbai, Bengaluru, Chennai, Hyderabad,
              Kolkata): 1–2 business days
            </li>
            <li>Tier-2 cities and state capitals: 2–3 business days</li>
            <li>Tier-3 cities and remote locations: 3–5 business days</li>
          </ul>
          <p className="text-sm mt-2">
            All domestic shipments include consignment tracking. Silver and Gold
            tier distributors receive priority dispatch with same-day fulfilment
            guaranteed on in-stock items, regardless of order time.
          </p>

          <h2 className="text-xl font-serif font-bold text-primary">
            How to Become an Authorised Gemora Global Distributor
          </h2>
          <ol className="list-decimal pl-6 space-y-2 text-sm">
            <li>
              <strong>Submit your application:</strong> WhatsApp us at +91
              7976341419 or use the inquiry form below with your business name,
              GST number, operating state/district, and estimated monthly order
              volume.
            </li>
            <li>
              <strong>Verification &amp; tier assignment:</strong> Our wholesale
              team reviews your application within 2–3 business days and assigns
              your starting distributor tier based on your projected volume.
            </li>
            <li>
              <strong>Receive distributor price list:</strong> Approved
              distributors receive their personalised tier price list, territory
              agreement (Silver/Gold), and catalogue access credentials.
            </li>
            <li>
              <strong>Place your first order:</strong> 100% advance for the
              first order. Credit terms unlock after your first 3 verified
              orders.
            </li>
          </ol>

          <h2 className="text-xl font-serif font-bold text-primary">
            Related Pages — Export &amp; Bulk Supply
          </h2>
          <ul className="list-disc pl-6 space-y-1 text-sm">
            <li>
              <Link
                to="/imitation-jewellery-exporter-india"
                className="text-primary underline"
              >
                Imitation Jewellery Exporter India — Export Docs &amp; Trade
                Terms
              </Link>
            </li>
            <li>
              <Link
                to="/bulk-jewellery-supplier"
                className="text-primary underline"
              >
                Bulk Jewellery Supplier — Tiered Pricing &amp; MOQ Calculator
              </Link>
            </li>
            <li>
              <Link
                to="/wholesale-imitation-jewellery"
                className="text-primary underline"
              >
                Wholesale Imitation Jewellery — Full Catalogue
              </Link>
            </li>
            <li>
              <Link
                to="/collections/trendy-jewelry"
                className="text-primary underline"
              >
                Trendy Fashion Jewellery Collections
              </Link>
            </li>
          </ul>
        </>
      }
      faqs={[
        {
          q: "What is the minimum order for the domestic distributor programme?",
          a: "The minimum order to register as a distributor is ₹25,000/month (Bronze tier). First-time buyers can start with MOQ 50 units per design — no minimum total order value for your first order. After 3 verified orders, you qualify for credit terms and tier-based pricing.",
        },
        {
          q: "Do you offer exclusive territory rights?",
          a: "Yes. Silver tier distributors receive state-level territory preference — we redirect new retail enquiries from your state to you and do not supply competing distributors in your state without your knowledge. Gold tier distributors receive a formal exclusive state territory agreement in writing.",
        },
        {
          q: "How do I qualify for credit terms?",
          a: "Credit terms are available after your first 3 verified orders. Bronze/Silver tier distributors can apply for net-15 terms (30% advance + 70% within 15 days). Gold tier distributors with 6+ orders qualify for net-45 terms. A signed credit agreement and PDC security (for orders above ₹50,000) are required.",
        },
        {
          q: "How early do registered distributors receive new season catalogues?",
          a: "Registered distributors receive seasonal collections (festive, bridal, casual, contemporary) 4–6 weeks before general availability. This advance preview lets you lock in popular designs and build inventory before peak selling season. New arrivals are also broadcast via WhatsApp within 24 hours of going live.",
        },
        {
          q: "What marketing materials are provided to distributors?",
          a: "We provide high-resolution product photography (white background and lifestyle shots), branded and unbranded PDF catalogues, WhatsApp-optimised square-format product images, caption templates, and suggested retail price guidance by category. All materials are provided free of charge to registered distributors at any tier.",
        },
      ]}
    />
  );
}
