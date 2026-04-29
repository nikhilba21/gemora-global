import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, MessageCircle, ShoppingCart, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useQuoteCart } from "../hooks/useQuoteCart";
import PDFQuoteGenerator from "./PDFQuoteGenerator";

export default function BulkQuoteCart() {
  const {
    items,
    isOpen,
    setOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
  } = useQuoteCart();
  const [pdfOpen, setPdfOpen] = useState(false);

  const totalItems = items.length;
  const totalQty = getCartTotal();

  const handleWhatsAppQuote = () => {
    if (items.length === 0) return;
    const itemLines = items.map(
      (item) =>
        `• ${item.productName} (${item.category}): ${item.quantity} pcs`,
    );
    const msg = [
      "Hi GEMORA GLOBAL! I'd like a bulk quote for the following products:",
      "",
      ...itemLines,
      "",
      `Total Quantity: ${totalQty} pcs`,
      "",
      "Please share pricing and availability. Thank you.",
    ].join("\n");
    window.open(
      `https://wa.me/917976341419?text=${encodeURIComponent(msg)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <>
      {/* Floating cart button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Open quote cart — ${totalItems} items`}
        className="fixed bottom-[88px] right-4 sm:right-6 z-40 w-14 h-14 bg-[#1A237E] hover:bg-[#1A237E]/90 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        data-ocid="quote-cart.open_button"
      >
        <ShoppingCart className="w-6 h-6" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#42A5F5] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center leading-none">
            {totalItems > 9 ? "9+" : totalItems}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          role="button"
          tabIndex={-1}
          aria-label="Close quote cart"
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        />
      )}

      {/* Slide-out drawer */}
      <div
        className={`fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[420px] bg-card shadow-2xl flex flex-col transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        data-ocid="quote-cart.drawer"
        aria-label="Quote Cart"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0"
          style={{ background: "#1A237E" }}
        >
          <div className="flex items-center gap-2.5">
            <ShoppingCart className="w-5 h-5 text-white" />
            <h2 className="font-semibold text-white text-base">
              Bulk Quote Cart
              {totalItems > 0 && (
                <span className="ml-2 text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">
                  {totalItems} item{totalItems !== 1 ? "s" : ""}
                </span>
              )}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close quote cart"
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors text-white"
            data-ocid="quote-cart.close_button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto" data-ocid="quote-cart.list">
          {items.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center h-full text-center px-6 py-12"
              data-ocid="quote-cart.empty_state"
            >
              <ShoppingCart className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <p className="font-semibold text-base mb-2">
                Your quote cart is empty
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Browse our catalogue and click{" "}
                <span className="font-medium text-primary">"Add to Quote"</span>{" "}
                on any product to build a multi-item bulk order quote.
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {items.map((item, idx) => (
                <div
                  key={item.productId}
                  className="flex gap-3 bg-background border border-border rounded-xl p-3"
                  data-ocid={`quote-cart.item.${idx + 1}`}
                >
                  {/* Image */}
                  <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-border bg-muted">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                        width={56}
                        height={56}
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">
                        💎
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-xs sm:text-sm leading-snug line-clamp-2 mb-0.5">
                      {item.productName}
                    </p>
                    <p className="text-[10px] text-muted-foreground mb-2">
                      {item.category}
                    </p>
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor={`qty-${item.productId}`}
                        className="text-[10px] text-muted-foreground shrink-0"
                      >
                        Qty:
                      </label>
                      <Input
                        id={`qty-${item.productId}`}
                        type="number"
                        min={50}
                        step={50}
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(
                            item.productId,
                            Number.parseInt(e.target.value) || 50,
                          )
                        }
                        className="h-7 w-20 text-xs px-2"
                        data-ocid={`quote-cart.qty.${idx + 1}`}
                      />
                      <span className="text-[10px] text-muted-foreground">
                        pcs (min 50)
                      </span>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.productId)}
                    aria-label={`Remove ${item.productName} from quote`}
                    className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors text-muted-foreground"
                    data-ocid={`quote-cart.delete_button.${idx + 1}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer actions */}
        {items.length > 0 && (
          <div className="px-4 pb-5 pt-3 border-t border-border shrink-0 space-y-3 bg-card">
            {/* Summary */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {totalItems} product type{totalItems !== 1 ? "s" : ""}
              </span>
              <span className="font-semibold">
                Total:{" "}
                <span className="text-primary">
                  {totalQty.toLocaleString()} pcs
                </span>
              </span>
            </div>

            <Button
              className="w-full min-h-[48px] gap-2 font-semibold text-sm"
              style={{ background: "#42A5F5" }}
              onClick={() => {
                setOpen(false);
                setPdfOpen(true);
              }}
              data-ocid="quote-cart.generate_pdf_button"
            >
              <FileText className="w-4 h-4" />
              Generate PDF Quote
            </Button>

            <Button
              className="w-full min-h-[44px] gap-2 font-semibold text-sm bg-green-600 hover:bg-green-700 text-white"
              onClick={handleWhatsAppQuote}
              data-ocid="quote-cart.whatsapp_button"
            >
              <MessageCircle className="w-4 h-4" />
              Send via WhatsApp
            </Button>

            <button
              type="button"
              onClick={clearCart}
              className="w-full text-xs text-muted-foreground hover:text-destructive transition-colors py-1.5"
              data-ocid="quote-cart.clear_button"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>

      {/* PDF Quote Generator Modal */}
      <PDFQuoteGenerator
        isOpen={pdfOpen}
        onClose={() => setPdfOpen(false)}
        items={items}
      />
    </>
  );
}
