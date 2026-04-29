import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Printer, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { QuoteCartItem } from "../hooks/useQuoteCart";

interface PDFQuoteGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  items: QuoteCartItem[];
}

const EXPORT_COUNTRIES = [
  "UAE",
  "United Kingdom",
  "United States",
  "France",
  "Germany",
  "Canada",
  "Australia",
  "Singapore",
  "Netherlands",
  "Belgium",
  "Italy",
  "Spain",
  "Japan",
  "South Africa",
  "India",
  "Other",
];

type Step = "form" | "preview";

interface BuyerDetails {
  companyName: string;
  contactPerson: string;
  country: string;
  email: string;
  phone: string;
}

const EMPTY_BUYER: BuyerDetails = {
  companyName: "",
  contactPerson: "",
  country: "",
  email: "",
  phone: "",
};

function getPriceTier(qty: number): { unitPrice: string; tier: string } {
  if (qty >= 1000)
    return { unitPrice: "Contact for special pricing", tier: "1000+" };
  if (qty >= 501) return { unitPrice: "20% off base price", tier: "501–999" };
  if (qty >= 101) return { unitPrice: "10% off base price", tier: "101–500" };
  return { unitPrice: "Base price (USD 2.50–15.00)", tier: "50–100" };
}

function getEstimatedTotal(qty: number): string {
  if (qty >= 1000) return "Contact us";
  if (qty >= 501) return `~USD ${(qty * 4).toLocaleString()}`;
  if (qty >= 101) return `~USD ${(qty * 5.5).toLocaleString()}`;
  return `~USD ${(qty * 6.5).toLocaleString()}`;
}

export default function PDFQuoteGenerator({
  isOpen,
  onClose,
  items,
}: PDFQuoteGeneratorProps) {
  const [step, setStep] = useState<Step>("form");
  const [buyer, setBuyer] = useState<BuyerDetails>(EMPTY_BUYER);
  const [errors, setErrors] = useState<Partial<BuyerDetails>>({});
  const firstInputRef = useRef<HTMLInputElement>(null);

  const quoteRef = Date.now().toString(36).toUpperCase();
  const quoteDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const validUntil = new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000,
  ).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    if (isOpen) {
      setStep("form");
      setBuyer(EMPTY_BUYER);
      setErrors({});
      setTimeout(() => firstInputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const e: Partial<BuyerDetails> = {};
    if (!buyer.companyName.trim()) e.companyName = "Required";
    if (!buyer.contactPerson.trim()) e.contactPerson = "Required";
    if (!buyer.country) e.country = "Required";
    if (!buyer.email.trim() || !buyer.email.includes("@"))
      e.email = "Valid email required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) setStep("preview");
  };

  const handlePrint = () => window.print();

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #pdf-quote-printable, #pdf-quote-printable * { visibility: visible !important; }
          #pdf-quote-printable {
            position: fixed !important;
            left: 0; top: 0; width: 100%; z-index: 9999;
            background: white !important;
            color: black !important;
            font-family: Arial, sans-serif !important;
            font-size: 11pt !important;
            padding: 32px !important;
          }
          .no-print { display: none !important; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ccc; padding: 6px 10px; text-align: left; }
          th { background: #f0f0f0 !important; font-weight: bold; }
        }
      `}</style>

      {/* Overlay */}
      <div
        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        role="button"
        tabIndex={-1}
        aria-label="Close PDF generator"
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      />

      {/* Modal */}
      <dialog
        open
        aria-labelledby="pdf-modal-title"
        className="fixed z-[60] inset-0 flex items-center justify-center p-4 bg-transparent border-0 m-0 max-w-none w-full h-full"
        data-ocid="pdf-quote.dialog"
      >
        <div className="relative bg-card w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div
            className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0"
            style={{ background: "#1A237E" }}
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-white" />
              <h2 id="pdf-modal-title" className="font-semibold text-white">
                {step === "form"
                  ? "PDF Quote — Buyer Details"
                  : "Quote Preview"}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close PDF quote generator"
              className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-colors"
              data-ocid="pdf-quote.close_button"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* STEP 1 — Buyer Details Form */}
            {step === "form" && (
              <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Fill in the buyer details to generate a professional PDF quote
                  for <strong>{items.length}</strong> product
                  {items.length !== 1 ? "s" : ""}.
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="pdf-company"
                      className="text-xs font-medium"
                    >
                      Company Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      ref={firstInputRef}
                      id="pdf-company"
                      value={buyer.companyName}
                      onChange={(e) =>
                        setBuyer((b) => ({ ...b, companyName: e.target.value }))
                      }
                      placeholder="Your Company Ltd."
                      className={`mt-1 text-sm ${errors.companyName ? "border-destructive" : ""}`}
                      data-ocid="pdf-quote.company_input"
                    />
                    {errors.companyName && (
                      <p className="mt-1 text-xs text-destructive">
                        {errors.companyName}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="pdf-contact"
                      className="text-xs font-medium"
                    >
                      Contact Person <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="pdf-contact"
                      value={buyer.contactPerson}
                      onChange={(e) =>
                        setBuyer((b) => ({
                          ...b,
                          contactPerson: e.target.value,
                        }))
                      }
                      placeholder="Full name"
                      className={`mt-1 text-sm ${errors.contactPerson ? "border-destructive" : ""}`}
                      data-ocid="pdf-quote.contact_input"
                    />
                    {errors.contactPerson && (
                      <p className="mt-1 text-xs text-destructive">
                        {errors.contactPerson}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="pdf-country"
                      className="text-xs font-medium"
                    >
                      Country <span className="text-destructive">*</span>
                    </Label>
                    <select
                      id="pdf-country"
                      value={buyer.country}
                      onChange={(e) =>
                        setBuyer((b) => ({ ...b, country: e.target.value }))
                      }
                      className={`mt-1 w-full border rounded-md px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring h-9 ${errors.country ? "border-destructive" : "border-input"}`}
                      data-ocid="pdf-quote.country_select"
                    >
                      <option value="">Select country</option>
                      {EXPORT_COUNTRIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    {errors.country && (
                      <p className="mt-1 text-xs text-destructive">
                        {errors.country}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="pdf-email" className="text-xs font-medium">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="pdf-email"
                      type="email"
                      value={buyer.email}
                      onChange={(e) =>
                        setBuyer((b) => ({ ...b, email: e.target.value }))
                      }
                      placeholder="buyer@company.com"
                      className={`mt-1 text-sm ${errors.email ? "border-destructive" : ""}`}
                      data-ocid="pdf-quote.email_input"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-destructive">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <Label htmlFor="pdf-phone" className="text-xs font-medium">
                      Phone / WhatsApp{" "}
                      <span className="text-muted-foreground font-normal">
                        (optional)
                      </span>
                    </Label>
                    <Input
                      id="pdf-phone"
                      type="tel"
                      value={buyer.phone}
                      onChange={(e) =>
                        setBuyer((b) => ({ ...b, phone: e.target.value }))
                      }
                      placeholder="+1 234 567 8900"
                      className="mt-1 text-sm"
                      data-ocid="pdf-quote.phone_input"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full min-h-[48px] font-semibold text-sm gap-2"
                    style={{ background: "#42A5F5" }}
                    data-ocid="pdf-quote.submit_button"
                  >
                    <FileText className="w-4 h-4" />
                    Generate Quote Preview
                  </Button>
                </div>
              </form>
            )}

            {/* STEP 2 — Preview */}
            {step === "preview" && (
              <div className="p-4 sm:p-6">
                {/* Print button */}
                <div className="flex items-center justify-between mb-4 no-print">
                  <p className="text-sm text-muted-foreground">
                    Preview looks correct? Print or save as PDF.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setStep("form")}
                      className="text-xs"
                      data-ocid="pdf-quote.back_button"
                    >
                      ← Edit Details
                    </Button>
                    <Button
                      size="sm"
                      className="gap-2 text-xs font-semibold"
                      style={{ background: "#1A237E" }}
                      onClick={handlePrint}
                      data-ocid="pdf-quote.print_button"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Print / Save PDF
                    </Button>
                  </div>
                </div>

                {/* Printable content */}
                <div
                  id="pdf-quote-printable"
                  className="border border-border rounded-xl overflow-hidden bg-white text-black p-6 sm:p-8 text-sm"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6 pb-4 border-b-2 border-[#1A237E]">
                    <div>
                      <h1 className="text-2xl font-bold text-[#1A237E]">
                        GEMORA GLOBAL
                      </h1>
                      <p className="text-xs text-gray-500 mt-0.5">
                        India's Premier Imitation Jewellery Manufacturer &
                        Exporter
                      </p>
                      <p className="text-xs text-gray-500">
                        B 66 MAA Hinglaj Nagar, Jaipur 302021, Rajasthan, India
                      </p>
                      <p className="text-xs text-gray-500">
                        +91 7976341419 | globalgemora@gmail.com |
                        gemoraglobal-tje.caffeine.xyz
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-bold text-[#1A237E]">
                        WHOLESALE QUOTE
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Ref: QUOTE-{quoteRef}
                      </p>
                      <p className="text-xs text-gray-600">Date: {quoteDate}</p>
                      <p className="text-xs text-gray-600">
                        Valid Until: {validUntil}
                      </p>
                    </div>
                  </div>

                  {/* Buyer details */}
                  <div className="mb-5">
                    <h2 className="text-sm font-bold text-[#1A237E] mb-2 uppercase tracking-wide">
                      Buyer Details
                    </h2>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
                      <div>
                        <span className="text-gray-500">Company:</span>{" "}
                        <strong>{buyer.companyName}</strong>
                      </div>
                      <div>
                        <span className="text-gray-500">Contact:</span>{" "}
                        {buyer.contactPerson}
                      </div>
                      <div>
                        <span className="text-gray-500">Country:</span>{" "}
                        {buyer.country}
                      </div>
                      <div>
                        <span className="text-gray-500">Email:</span>{" "}
                        {buyer.email}
                      </div>
                      {buyer.phone && (
                        <div>
                          <span className="text-gray-500">Phone:</span>{" "}
                          {buyer.phone}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Products table */}
                  <div className="mb-5">
                    <h2 className="text-sm font-bold text-[#1A237E] mb-2 uppercase tracking-wide">
                      Quoted Products
                    </h2>
                    <table className="w-full border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#1A237E] text-white">
                          <th className="text-left p-2 border border-[#1A237E]">
                            Product Name
                          </th>
                          <th className="text-left p-2 border border-[#1A237E]">
                            Category
                          </th>
                          <th className="text-right p-2 border border-[#1A237E]">
                            Qty (pcs)
                          </th>
                          <th className="text-left p-2 border border-[#1A237E]">
                            Price Tier
                          </th>
                          <th className="text-right p-2 border border-[#1A237E]">
                            Est. Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, idx) => {
                          const tier = getPriceTier(item.quantity);
                          const est = getEstimatedTotal(item.quantity);
                          return (
                            <tr
                              key={item.productId}
                              className={
                                idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                              }
                            >
                              <td className="p-2 border border-gray-200 font-medium">
                                {item.productName}
                              </td>
                              <td className="p-2 border border-gray-200 text-gray-600">
                                {item.category}
                              </td>
                              <td className="p-2 border border-gray-200 text-right font-semibold">
                                {item.quantity.toLocaleString()}
                              </td>
                              <td className="p-2 border border-gray-200 text-gray-600">
                                {tier.tier} units
                              </td>
                              <td className="p-2 border border-gray-200 text-right font-semibold text-[#1A237E]">
                                {est}
                              </td>
                            </tr>
                          );
                        })}
                        <tr className="bg-[#1A237E]/5 font-bold">
                          <td
                            className="p-2 border border-gray-200"
                            colSpan={2}
                          >
                            TOTAL
                          </td>
                          <td className="p-2 border border-gray-200 text-right">
                            {items
                              .reduce((s, i) => s + i.quantity, 0)
                              .toLocaleString()}
                          </td>
                          <td
                            className="p-2 border border-gray-200"
                            colSpan={2}
                          />
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Pricing note */}
                  <div className="mb-4 p-3 border border-[#42A5F5]/40 rounded-lg bg-[#42A5F5]/5 text-xs text-gray-700">
                    <p className="font-semibold mb-1 text-[#1A237E]">
                      Pricing Tiers (All prices in USD, Ex-Works Jaipur)
                    </p>
                    <p>
                      • 50–100 units: Base price (USD 2.50–15.00 per piece
                      depending on design) &nbsp;|&nbsp; • 101–500 units: 10%
                      off base price
                    </p>
                    <p>
                      • 501–999 units: 20% off base price &nbsp;|&nbsp; • 1,000+
                      units: Contact for special pricing
                    </p>
                    <p className="mt-1 italic">
                      Prices are indicative. Final pricing confirmed upon order
                      confirmation. Prices exclude shipping & duties.
                    </p>
                  </div>

                  {/* Terms */}
                  <div className="mb-4 text-xs text-gray-700 space-y-1">
                    <p>
                      <strong>Payment Terms:</strong> T/T (bank transfer), LC at
                      sight, or 50% advance with 50% before dispatch.
                      GST-compliant export invoices provided.
                    </p>
                    <p>
                      <strong>Lead Time:</strong> 14–21 working days after order
                      confirmation and advance payment receipt.
                    </p>
                    <p>
                      <strong>Shipping:</strong> DHL, FedEx, or freight
                      forwarder of buyer's choice. Export packaging included.
                    </p>
                    <p>
                      <strong>Quote Validity:</strong> This quote is valid for
                      30 days from date of issue ({quoteDate}).
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="pt-4 border-t-2 border-[#1A237E] text-xs text-gray-500 text-center">
                    <p>
                      GEMORA GLOBAL | B 66 MAA Hinglaj Nagar, Jaipur 302021,
                      India | +91 7976341419 | globalgemora@gmail.com
                    </p>
                    <p className="mt-0.5">
                      Thank you for your interest. We look forward to a
                      long-term business partnership.
                    </p>
                  </div>
                </div>

                {/* Bottom print button for mobile */}
                <div className="mt-4 no-print">
                  <Button
                    className="w-full min-h-[48px] font-semibold gap-2 text-sm"
                    style={{ background: "#1A237E" }}
                    onClick={handlePrint}
                    data-ocid="pdf-quote.print_bottom_button"
                  >
                    <Printer className="w-4 h-4" />
                    Print / Save as PDF
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
