import { Link } from "react-router-dom";
import SeoLandingPage from "../../components/SeoLandingPage";

export default function BulkJewellerySupplier() {
  return (
    <SeoLandingPage
      title="Bulk Jewellery Supplier India | MOQ 50 Units | Tiered Pricing"
      metaDescription="Bulk jewellery supplier from Jaipur, India. MOQ 50 units. Tiered pricing: the more you order, the more you save. Custom packaging, private label available. Est. 2011."
      canonical="https://gemoraglobal-tje.caffeine.xyz/bulk-jewellery-supplier"
      h1="Bulk Jewellery Supplier India — MOQ 50 Units, Tiered Pricing Structure"
      targetKeyword="bulk jewellery supplier india"
      heroSubtitle="Jaipur's most transparent bulk jewellery supplier since 2011. Five-tier pricing from MOQ 50 units to 5,000+ units — the more you order, the more you save. Custom packaging, private label, and white-label available at every tier."
      breadcrumbs={[
        { name: "Home", url: "https://gemoraglobal-tje.caffeine.xyz/" },
        {
          name: "Bulk Jewellery Supplier",
          url: "https://gemoraglobal-tje.caffeine.xyz/bulk-jewellery-supplier",
        },
      ]}
      bodyContent={
        <>
          <h2 className="text-xl font-serif font-bold text-primary mt-0">
            Five-Tier Pricing Structure — MOQ 50 to 5,000+ Units
          </h2>
          <p>
            Gemora Global's bulk jewellery pricing is structured across five
            tiers, with progressively larger discounts for higher volume
            commitments. Unlike suppliers who quote arbitrary bulk discounts,
            our tiers are published, consistent, and applied automatically at
            order time — no negotiation required for standard tier pricing.
          </p>
          <p>
            All percentage discounts below are applied to our published base
            wholesale price per design. The base price varies by category —
            necklace sets, bridal sets, and statement earrings are priced higher
            than everyday fashion pieces.
          </p>

          {/* Pricing Tiers Table */}
          <div className="overflow-x-auto rounded-xl border border-blue-700/20 not-prose my-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-primary/10 border-b border-blue-700/20">
                  <th className="text-left px-4 py-3 font-semibold text-foreground">
                    Tier
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">
                    Units per Design
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">
                    Discount off Base Price
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">
                    Best For
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    tier: "Tier 1",
                    units: "50 – 99 units",
                    discount: "Base wholesale price",
                    for: "Boutiques, trial orders, first-time buyers",
                  },
                  {
                    tier: "Tier 2",
                    units: "100 – 499 units",
                    discount: "10% off base price",
                    for: "Regular retailers, online sellers, state stockists",
                  },
                  {
                    tier: "Tier 3",
                    units: "500 – 999 units",
                    discount: "20% off base price",
                    for: "Distributors, export buyers, boutique chains",
                  },
                  {
                    tier: "Tier 4",
                    units: "1,000 – 4,999 units",
                    discount: "30% off base price",
                    for: "Large exporters, institutional buyers, OEM brands",
                  },
                  {
                    tier: "Tier 5",
                    units: "5,000+ units",
                    discount: "Custom pricing",
                    for: "Private label, white label, container-load buyers",
                  },
                ].map((row, i) => (
                  <tr
                    key={row.tier}
                    className={`border-b border-blue-700/10 ${i % 2 === 0 ? "bg-background" : "bg-card"}`}
                  >
                    <td className="px-4 py-3 font-semibold text-primary">
                      {row.tier}
                    </td>
                    <td className="px-4 py-3 text-foreground">{row.units}</td>
                    <td className="px-4 py-3 text-sky-600 font-medium">
                      {row.discount}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {row.for}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-sm">
            Tier pricing applies per design. A 500-unit order of a single
            necklace design qualifies for Tier 3 pricing on that design.
            Mix-and-match within a category (e.g., 250 units earring design A +
            250 units earring design B = 500 units) can also qualify for Tier 3
            — contact our bulk team to confirm category-level mix eligibility.
          </p>

          <h2 className="text-xl font-serif font-bold text-primary">
            Custom Packaging Options at Each Tier
          </h2>
          <p>
            Packaging requirements differ significantly between buyer types —
            boutiques need retail-ready boxes, distributors need bulk cartons,
            and private label buyers need branded packaging. We offer a
            packaging option for every tier:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li>
              <strong>Tier 1–2 — Standard velvet pouches:</strong> Each piece in
              an individual Gemora Global branded velvet pouch. Elegant,
              protective, and ready for boutique shelf placement without
              additional packaging.
            </li>
            <li>
              <strong>Tier 2–3 — Jewellery gift boxes:</strong> Individual
              folding gift boxes in navy/gold (branded) or plain white
              (unbranded). Retail-ready — ideal for boutiques and gift shops.
            </li>
            <li>
              <strong>Tier 2–3 — Display card packaging:</strong> Pieces mounted
              on hanging display cards — for market stalls, trade show displays,
              and retail peg-board presentation. Branded or unbranded.
            </li>
            <li>
              <strong>All tiers — Bulk carton (economical):</strong> Pieces
              wrapped in anti-tarnish tissue, packed loose in master cartons by
              design code. Most economical option for distributors who repackage
              under their own brand.
            </li>
            <li>
              <strong>Tier 4–5 — Custom / private label packaging:</strong> Your
              logo, brand name, and colour scheme on jewellery boxes, pouches,
              hang tags, and display cards. MOQ: 1,000 units per packaging type.
              See private label section below.
            </li>
          </ul>

          <h2 className="text-xl font-serif font-bold text-primary">
            Private Label &amp; White Label Programme
          </h2>
          <p>
            Bulk buyers building their own jewellery brand — whether a boutique
            chain, online brand, or export house — can commission full private
            label and white label services from Gemora Global:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li>
              <strong>White label (unbranded):</strong> All Gemora Global
              branding removed. Plain, brand-neutral packaging only. Available
              at all tier levels with no MOQ surcharge — ideal for buyers who
              apply their own branding.
            </li>
            <li>
              <strong>Private label — packaging:</strong> Your brand name, logo,
              and colour scheme on velvet pouches, folding gift boxes, hang
              tags, and display cards. MOQ: 1,000 units per packaging SKU.
            </li>
            <li>
              <strong>Private label — custom jewellery designs (OEM):</strong>{" "}
              Your designer provides drawings, CAD files, or reference images.
              We manufacture to your specification with exclusive design
              ownership. MOQ: 500 units per design. Lead time: 5–7 weeks.
            </li>
            <li>
              <strong>Private label — custom stone &amp; metal specs:</strong>{" "}
              Specify your stone colours, metal finish, plating type, and
              dimensions for catalogue designs adapted to your brand aesthetic.
              Available for Tier 3+ orders.
            </li>
          </ul>
          <p className="text-sm">
            Private label orders are assigned a dedicated account manager and
            treated as priority production. For private label pricing and full
            programme details, contact our bulk sales team with your brand
            guidelines and volume requirements.
          </p>

          <h2 className="text-xl font-serif font-bold text-primary">
            Bulk Order Process — Sample to Shipment
          </h2>
          <ol className="list-decimal pl-6 space-y-2 text-sm">
            <li>
              <strong>Request samples:</strong> Order a sample set (10–20
              pieces) across your shortlisted designs. Sample cost is credited
              against your first bulk order of 200+ units. Shipped via DHL/FedEx
              within 5–7 business days.
            </li>
            <li>
              <strong>Sample approval:</strong> Review quality, finish, and
              packaging. Provide written approval or feedback for modifications.
            </li>
            <li>
              <strong>Place bulk order:</strong> Confirm designs, quantities,
              packaging specification, and shipping terms. Pay advance (30% for
              Tier 1–3; see payment terms table below).
            </li>
            <li>
              <strong>Production:</strong> In-catalogue designs: 7–30 business
              days depending on tier. Custom/OEM designs: 5–8 weeks.
            </li>
            <li>
              <strong>Pre-shipment quality control:</strong> Inline QC at each
              production stage. Pre-shipment inspection photos shared for your
              approval. Third-party QC inspection (SGS, Bureau Veritas)
              available at your cost.
            </li>
            <li>
              <strong>Dispatch:</strong> Pay balance before dispatch. Tracking
              number and all documents (commercial invoice, packing list, COO)
              shared within 24 hours.
            </li>
          </ol>

          <h2 className="text-xl font-serif font-bold text-primary">
            Quality Control for Bulk Orders
          </h2>
          <p>
            Bulk orders undergo a more rigorous QC process than small trial
            orders — a batch defect at 5,000 units has significant downstream
            retail impact. Our bulk QC programme:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li>
              <strong>Pre-production sample sign-off:</strong> For orders of
              500+ units, 3–5 pre-production samples are produced for your
              written approval before full production begins. No bulk production
              starts without approval.
            </li>
            <li>
              <strong>In-line QC checks:</strong> Quality inspections at each
              production stage — stone setting, base metal shaping, plating,
              polishing, and anti-tarnish coating. Defective pieces are removed
              before packing.
            </li>
            <li>
              <strong>Anti-tarnish coating verification:</strong> All pieces
              tested for finish durability. We guarantee a minimum 12-month
              anti-tarnish performance under normal retail and storage
              conditions.
            </li>
            <li>
              <strong>Pre-shipment inspection:</strong> Final inspection of the
              complete bulk order. Third-party inspectors (SGS, Bureau Veritas)
              are welcome at your cost — we have no restrictions on independent
              QC.
            </li>
          </ul>

          <h2 className="text-xl font-serif font-bold text-primary">
            Bulk Order Lead Times by Tier
          </h2>
          <div className="overflow-x-auto rounded-xl border border-blue-700/20 not-prose my-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-primary/10 border-b border-blue-700/20">
                  <th className="text-left px-4 py-3 font-semibold text-foreground">
                    Order Size
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">
                    In-Catalogue Designs
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground">
                    Custom / OEM Designs
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    size: "50–200 units (Tier 1)",
                    stock: "7–10 business days",
                    custom: "3–4 weeks",
                  },
                  {
                    size: "200–500 units (Tier 2)",
                    stock: "10–15 business days",
                    custom: "4–5 weeks",
                  },
                  {
                    size: "500–1,000 units (Tier 3)",
                    stock: "15–20 business days",
                    custom: "5–6 weeks",
                  },
                  {
                    size: "1,000–5,000 units (Tier 4)",
                    stock: "20–30 business days",
                    custom: "6–8 weeks",
                  },
                  {
                    size: "5,000+ units (Tier 5)",
                    stock: "30–45 business days",
                    custom: "8–12 weeks",
                  },
                ].map((row, i) => (
                  <tr
                    key={row.size}
                    className={`border-b border-blue-700/10 ${i % 2 === 0 ? "bg-background" : "bg-card"}`}
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {row.size}
                    </td>
                    <td className="px-4 py-3 text-sky-600">{row.stock}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {row.custom}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-serif font-bold text-primary">
            Bulk Order Payment Terms
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li>
              <strong>Tier 1–2 (50–499 units):</strong> 30% advance + 70% before
              dispatch. Accepted: bank transfer (SWIFT/TT), PayPal (up to USD
              5,000), NEFT/RTGS (domestic).
            </li>
            <li>
              <strong>Tier 3 (500–999 units):</strong> 30% advance + 30% at
              pre-shipment inspection + 40% before dispatch — or 40% + 60%
              before dispatch.
            </li>
            <li>
              <strong>Tier 4 (1,000–4,999 units):</strong> Negotiable milestones
              — typically 30% with order, 30% at production midpoint, 40% before
              dispatch. Letter of Credit (LC) accepted for orders above USD
              50,000.
            </li>
            <li>
              <strong>Tier 5 (5,000+ units):</strong> Custom payment milestones
              negotiated with dedicated account manager. LC at sight standard
              for container-load orders.
            </li>
          </ul>

          <h2 className="text-xl font-serif font-bold text-primary">
            Related Pages — Wholesale &amp; Export
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
                to="/artificial-jewellery-wholesaler-india"
                className="text-primary underline"
              >
                Artificial Jewellery Wholesaler India — Distributor Programme
              </Link>
            </li>
            <li>
              <Link
                to="/private-label-jewellery-india"
                className="text-primary underline"
              >
                Private Label Jewellery India — OEM &amp; Custom Designs
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
          q: "What are the five pricing tiers for bulk jewellery orders?",
          a: "Tier 1 (50–99 units): base wholesale price. Tier 2 (100–499 units): 10% off. Tier 3 (500–999 units): 20% off. Tier 4 (1,000–4,999 units): 30% off. Tier 5 (5,000+ units): custom pricing negotiated with account manager. All discounts applied to our published base wholesale price per design.",
        },
        {
          q: "Can I mix designs within a category to reach the MOQ threshold?",
          a: "Yes. Within the same category (e.g., earrings), you can mix multiple designs — 250 units of earring design A + 250 units of earring design B = 500 units qualifying for Tier 3 earring pricing on both. For Tier 4 and Tier 5 cross-category mix eligibility, contact our bulk team with your order requirements.",
        },
        {
          q: "What custom packaging options are available for bulk orders?",
          a: "Options range from standard velvet pouches (all tiers), jewellery gift boxes (branded or unbranded), display card packaging for retail peg-boards, bulk carton (no individual packaging — most economical), to full private label packaging with your logo, brand name, and colour scheme on boxes, pouches, and hang tags (MOQ 1,000 units per packaging type, Tier 4+).",
        },
        {
          q: "What is the process to get my own private label jewellery?",
          a: "For white label (unbranded packaging), available at any tier with no MOQ surcharge. For custom branded packaging (your logo on boxes/pouches), MOQ is 1,000 units per packaging type. For fully custom OEM jewellery designs, provide drawings or reference images — MOQ 500 units per design, 5–7 weeks lead time. Contact our bulk sales team with your brand guidelines and volume requirements.",
        },
        {
          q: "What quality checks are done for bulk orders above 500 units?",
          a: "For orders of 500+ units: (1) 3–5 pre-production samples produced for your written approval before bulk production starts; (2) in-line QC at stone setting, plating, polishing, and anti-tarnish coating stages; (3) anti-tarnish finish verified with 12-month durability guarantee; (4) pre-shipment inspection with photos shared for your approval. Third-party QC inspectors (SGS, Bureau Veritas) are welcome at your cost.",
        },
      ]}
    />
  );
}
