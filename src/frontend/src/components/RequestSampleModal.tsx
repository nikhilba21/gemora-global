import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FlaskConical, Mail, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const WHATSAPP_ICON = (
  <svg
    viewBox="0 0 24 24"
    className="w-4 h-4 fill-white shrink-0"
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

interface RequestSampleModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
}

interface FormState {
  name: string;
  company: string;
  country: string;
  whatsapp: string;
  address: string;
  message: string;
}

interface FormErrors {
  name?: string;
  country?: string;
  whatsapp?: string;
  address?: string;
}

const COUNTRIES = [
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

const EMPTY_FORM: FormState = {
  name: "",
  company: "",
  country: "",
  whatsapp: "",
  address: "",
  message: "",
};

export default function RequestSampleModal({
  isOpen,
  onClose,
  productName,
}: RequestSampleModalProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setForm(EMPTY_FORM);
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
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "Your name is required";
    if (!form.country) e.country = "Please select a country";
    if (!form.whatsapp.trim()) e.whatsapp = "WhatsApp number is required";
    if (!form.address.trim()) e.address = "Shipping address is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const buildMessage = () => {
    return [
      `Sample Request for: ${productName}`,
      "",
      `Name: ${form.name}`,
      form.company ? `Company: ${form.company}` : "",
      `Country: ${form.country}`,
      `WhatsApp: ${form.whatsapp}`,
      `Shipping To: ${form.address}`,
      form.message ? `Requirements: ${form.message}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  };

  const handleWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const msg = buildMessage();
    window.open(
      `https://wa.me/917976341419?text=${encodeURIComponent(msg)}`,
      "_blank",
      "noopener,noreferrer",
    );
    onClose();
  };

  const handleEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const subject = `Sample Request: ${productName}`;
    const body = buildMessage();
    window.open(
      `mailto:globalgemora@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      "_self",
    );
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        role="button"
        tabIndex={-1}
        aria-label="Close sample request"
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      />

      {/* Modal */}
      <dialog
        open
        aria-labelledby="sample-modal-title"
        className="fixed z-50 w-full left-0 right-0 bottom-0 sm:inset-0 sm:flex sm:items-center sm:justify-center sm:p-4 bg-transparent border-0 p-0 m-0 max-w-none"
        data-ocid="sample-request.dialog"
      >
        <div className="relative bg-card w-full sm:max-w-[500px] sm:rounded-2xl rounded-t-2xl shadow-xl overflow-hidden max-h-[92vh] flex flex-col">
          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-4 shrink-0"
            style={{ background: "#1A237E" }}
          >
            <div className="flex items-center gap-2.5">
              <FlaskConical className="w-5 h-5 text-white" />
              <div>
                <h2
                  id="sample-modal-title"
                  className="font-semibold text-white text-sm leading-tight"
                >
                  Request a Sample
                </h2>
                <p className="text-white/70 text-[10px] truncate max-w-[220px] sm:max-w-[300px]">
                  {productName}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close sample request"
              className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors text-white shrink-0"
              data-ocid="sample-request.close_button"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <div className="overflow-y-auto flex-1">
            <form className="px-5 py-4 space-y-4">
              {/* Product — readonly */}
              <div>
                <Label className="text-xs font-medium">Product</Label>
                <Input
                  value={productName}
                  readOnly
                  className="mt-1 bg-muted text-muted-foreground cursor-not-allowed text-sm"
                  data-ocid="sample-request.product_name"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sr-name" className="text-xs font-medium">
                    Your Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    ref={firstInputRef}
                    id="sr-name"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="Full name"
                    className={`mt-1 text-sm ${errors.name ? "border-destructive" : ""}`}
                    data-ocid="sample-request.name_input"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="sr-company" className="text-xs font-medium">
                    Company Name{" "}
                    <span className="text-muted-foreground font-normal">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    id="sr-company"
                    value={form.company}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, company: e.target.value }))
                    }
                    placeholder="Your company"
                    className="mt-1 text-sm"
                    data-ocid="sample-request.company_input"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sr-country" className="text-xs font-medium">
                    Country <span className="text-destructive">*</span>
                  </Label>
                  <select
                    id="sr-country"
                    value={form.country}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, country: e.target.value }))
                    }
                    className={`mt-1 w-full border rounded-md px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring h-9 ${errors.country ? "border-destructive" : "border-input"}`}
                    data-ocid="sample-request.country_select"
                  >
                    <option value="">Select country</option>
                    {COUNTRIES.map((c) => (
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
                  <Label htmlFor="sr-whatsapp" className="text-xs font-medium">
                    WhatsApp Number <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="sr-whatsapp"
                    type="tel"
                    value={form.whatsapp}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, whatsapp: e.target.value }))
                    }
                    placeholder="+1 234 567 8900"
                    className={`mt-1 text-sm ${errors.whatsapp ? "border-destructive" : ""}`}
                    data-ocid="sample-request.whatsapp_input"
                  />
                  {errors.whatsapp && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.whatsapp}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="sr-address" className="text-xs font-medium">
                  Shipping Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="sr-address"
                  value={form.address}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, address: e.target.value }))
                  }
                  placeholder="Full address including city and postal code"
                  className={`mt-1 text-sm ${errors.address ? "border-destructive" : ""}`}
                  data-ocid="sample-request.address_input"
                />
                {errors.address && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.address}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="sr-message" className="text-xs font-medium">
                  Message / Special Requirements{" "}
                  <span className="text-muted-foreground font-normal">
                    (optional)
                  </span>
                </Label>
                <Textarea
                  id="sr-message"
                  value={form.message}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      message: e.target.value.slice(0, 400),
                    }))
                  }
                  placeholder="Colour preferences, specific design notes, packaging requirements..."
                  rows={3}
                  className="mt-1 text-sm resize-none"
                  data-ocid="sample-request.message_textarea"
                />
                <p className="text-right text-[10px] text-muted-foreground mt-0.5">
                  {form.message.length}/400
                </p>
              </div>

              {/* Info note */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg px-3 py-2.5 text-xs text-muted-foreground leading-relaxed">
                💡 Samples are available for most designs. Sample cost is
                adjusted against bulk orders above 200 units.
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-2.5 pt-1 pb-1">
                <Button
                  type="submit"
                  className="w-full min-h-[48px] font-semibold text-sm gap-2 bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleWhatsApp}
                  data-ocid="sample-request.whatsapp_button"
                >
                  {WHATSAPP_ICON}
                  Send via WhatsApp
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full min-h-[44px] font-medium text-sm gap-2 border-primary text-primary hover:bg-primary/5"
                  onClick={handleEmail}
                  data-ocid="sample-request.email_button"
                >
                  <Mail className="w-4 h-4" />
                  Send via Email
                </Button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}

