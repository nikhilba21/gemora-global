import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMemo, useState } from "react";
import type { Category, Product } from "../types";

interface BulkOrderCalculatorProps {
  products: Product[];
  categories?: Category[];
  initialProductId?: bigint;
  compact?: boolean;
}

interface Tier {
  label: string;
  range: string;
  min: number;
  max: number | null;
  discount: number;
}

const TIERS: Tier[] = [
  { label: "Starter", range: "50–100 pcs", min: 50, max: 100, discount: 0 },
  {
    label: "Wholesale",
    range: "101–500 pcs",
    min: 101,
    max: 500,
    discount: 10,
  },
  { label: "Bulk", range: "501–999 pcs", min: 501, max: 999, discount: 20 },
  {
    label: "Enterprise",
    range: "1000+ pcs",
    min: 1000,
    max: null,
    discount: 0,
  },
];

function getActiveTier(qty: number): number {
  if (qty >= 1000) return 3;
  if (qty >= 501) return 2;
  if (qty >= 101) return 1;
  return 0;
}

function formatCurrency(val: number): string {
  return `$${val.toFixed(2)}`;
}

export default function BulkOrderCalculator({
  products,
  categories,
  initialProductId,
  compact = false,
}: BulkOrderCalculatorProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [selectedProductId, setSelectedProductId] = useState<string>(
    initialProductId ? String(initialProductId) : "",
  );
  const [basePrice, setBasePrice] = useState<string>("3.00");
  const [quantity, setQuantity] = useState<number>(100);

  // Filter products by selected category
  const filteredProducts = useMemo(() => {
    if (selectedCategoryId === "all") return products;
    return products.filter((p) => String(p.categoryId) === selectedCategoryId);
  }, [products, selectedCategoryId]);

  // When category changes, reset product selection
  const handleCategoryChange = (catId: string) => {
    setSelectedCategoryId(catId);
    setSelectedProductId("");
  };

  const selectedProduct = useMemo(
    () => filteredProducts.find((p) => String(p.id) === selectedProductId),
    [filteredProducts, selectedProductId],
  );

  const activeTierIdx = getActiveTier(quantity);
  const activeTier = TIERS[activeTierIdx];
  const parsedBasePrice = Number.parseFloat(basePrice) || 3;

  // Calculated results
  const unitPrice =
    activeTierIdx < 3
      ? parsedBasePrice * (1 - activeTier.discount / 100)
      : parsedBasePrice;
  const totalCost = quantity * unitPrice;
  const savings = quantity * parsedBasePrice - totalCost;

  // Next tier hint
  const nextTier = activeTierIdx < 2 ? TIERS[activeTierIdx + 1] : null;
  const piecesToNextTier = nextTier ? nextTier.min - quantity : 0;

  const waMessage = () => {
    const productName = selectedProduct?.name ?? "imitation jewellery";
    const msg = `Hi GEMORA GLOBAL! I'd like a bulk order quote for: ${productName}. Quantity: ${quantity} pcs. Estimated total: ${formatCurrency(totalCost)}. Please share your best wholesale pricing.`;
    return `https://wa.me/917976341419?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div
      className={`bg-card border border-border rounded-2xl overflow-hidden ${compact ? "shadow-card" : "shadow-elevated"}`}
      data-ocid="bulk-calc.container"
    >
      {/* Header */}
      <div
        className="px-5 py-4 border-b border-border"
        style={{ background: "#1A237E" }}
      >
        <h3 className="font-serif font-bold text-white text-lg">
          Bulk Order Calculator
        </h3>
        <p className="text-white/70 text-xs mt-0.5">
          Enter quantity to see pricing tiers & savings
        </p>
      </div>

      <div
        className={`p-4 sm:p-5 ${compact ? "" : "md:grid md:grid-cols-2 md:gap-6"}`}
      >
        {/* Controls */}
        <div className="space-y-4">
          {/* Category filter */}
          {categories && categories.length > 0 && (
            <div>
              <Label className="text-xs font-medium mb-1 block">Category</Label>
              <select
                value={selectedCategoryId}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:border-primary h-10"
                data-ocid="bulk-calc.category"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={String(c.id)} value={String(c.id)}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Product selector */}
          {filteredProducts.length > 0 && (
            <div>
              <Label className="text-xs font-medium mb-1 block">
                Product{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:border-primary h-10"
                data-ocid="bulk-calc.product"
              >
                <option value="">Select a product...</option>
                {filteredProducts.map((p) => (
                  <option key={String(p.id)} value={String(p.id)}>
                    {p.name} — MOQ {p.moq}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Base price */}
          <div>
            <Label
              htmlFor="bc-price"
              className="text-xs font-medium mb-1 block"
            >
              Base Unit Price (USD)
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                $
              </span>
              <Input
                id="bc-price"
                type="number"
                min={0.01}
                step={0.01}
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                className="pl-7 text-sm"
                data-ocid="bulk-calc.base_price"
              />
            </div>
          </div>

          {/* Quantity */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <Label htmlFor="bc-qty" className="text-xs font-medium">
                Quantity
              </Label>
              <span className="font-bold text-sm" style={{ color: "#1A237E" }}>
                {quantity} pcs
              </span>
            </div>
            <Input
              id="bc-qty"
              type="number"
              min={1}
              max={9999}
              value={quantity}
              onChange={(e) =>
                setQuantity(
                  Math.max(1, Number.parseInt(e.target.value, 10) || 1),
                )
              }
              className="text-sm mb-2"
              data-ocid="bulk-calc.quantity"
            />
            <input
              type="range"
              min={0}
              max={2000}
              step={10}
              value={Math.min(quantity, 2000)}
              onChange={(e) =>
                setQuantity(Number.parseInt(e.target.value, 10) || 1)
              }
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: "#1A237E" }}
              aria-label="Quantity slider"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
              <span>0</span>
              <span>500</span>
              <span>1000</span>
              <span>1500</span>
              <span>2000+</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className={`${compact ? "mt-4" : "mt-4 md:mt-0"}`}>
          {activeTierIdx === 3 ? (
            /* Enterprise tier */
            <div
              className="rounded-xl p-4 border-2 text-center flex flex-col gap-3"
              style={{ borderColor: "#1A237E", background: "#f0f4ff" }}
              data-ocid="bulk-calc.result_enterprise"
            >
              <p className="text-2xl">🏭</p>
              <p className="font-bold text-base" style={{ color: "#1A237E" }}>
                Enterprise Pricing
              </p>
              <p className="text-sm text-muted-foreground">
                Contact us for custom pricing on 1000+ pieces — best rates for
                large wholesale orders.
              </p>
              <a
                href={waMessage()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors text-sm min-h-[48px]"
                data-ocid="bulk-calc.wa_enterprise"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 fill-white shrink-0"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Request Custom Pricing
              </a>
            </div>
          ) : (
            /* Active tier result */
            <div
              className="rounded-xl p-4 border-2 mb-4"
              style={{ borderColor: "#42A5F5", background: "#e8f4fe" }}
              data-ocid="bulk-calc.result_active"
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
                  style={{ background: "#1A237E" }}
                >
                  {activeTier.label} Tier — {activeTier.range}
                </span>
                {activeTier.discount > 0 && (
                  <span className="text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
                    {activeTier.discount}% OFF
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Unit Price
                  </span>
                  <span
                    className="font-bold text-base"
                    style={{ color: "#1A237E" }}
                  >
                    {formatCurrency(unitPrice)}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-border pt-2">
                  <span className="text-sm font-semibold">
                    Total ({quantity} pcs)
                  </span>
                  <span
                    className="font-bold text-xl"
                    style={{ color: "#1A237E" }}
                  >
                    {formatCurrency(totalCost)}
                  </span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between items-center text-green-700">
                    <span className="text-sm">You Save</span>
                    <span className="font-semibold text-sm">
                      {formatCurrency(savings)}
                    </span>
                  </div>
                )}
              </div>

              {/* Next tier hint */}
              {nextTier && piecesToNextTier > 0 && (
                <div className="mt-3 bg-white/70 rounded-lg px-3 py-2 text-xs text-muted-foreground">
                  💡 Add{" "}
                  <strong className="text-foreground">
                    {piecesToNextTier} more
                  </strong>{" "}
                  to reach{" "}
                  <strong className="text-foreground">
                    {nextTier.label} tier
                  </strong>{" "}
                  and save{" "}
                  <strong className="text-green-700">
                    {nextTier.discount}%
                  </strong>
                </div>
              )}
            </div>
          )}

          {/* Pricing tiers table */}
          <div className="rounded-lg overflow-hidden border border-border mb-4">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: "#1A237E" }}>
                  <th className="text-left px-3 py-2 text-white font-medium">
                    Tier
                  </th>
                  <th className="text-left px-3 py-2 text-white font-medium">
                    Quantity
                  </th>
                  <th className="text-right px-3 py-2 text-white font-medium">
                    Discount
                  </th>
                </tr>
              </thead>
              <tbody>
                {TIERS.map((tier, idx) => (
                  <tr
                    key={tier.label}
                    className={`border-t border-border transition-colors ${
                      idx === activeTierIdx
                        ? "font-semibold"
                        : "text-muted-foreground"
                    }`}
                    style={
                      idx === activeTierIdx
                        ? { background: "#e8f4fe", color: "#1A237E" }
                        : {}
                    }
                  >
                    <td className="px-3 py-2">{tier.label}</td>
                    <td className="px-3 py-2">{tier.range}</td>
                    <td className="px-3 py-2 text-right">
                      {idx === 3 ? (
                        <span className="text-primary">Contact us</span>
                      ) : tier.discount === 0 ? (
                        "Base price"
                      ) : (
                        <span className="text-green-700 font-bold">
                          {tier.discount}% off
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* WhatsApp CTA */}
          {activeTierIdx < 3 && (
            <a
              href={waMessage()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors text-sm min-h-[48px] w-full"
              data-ocid="bulk-calc.wa_quote"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 fill-white shrink-0"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Request Quote on WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
