import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import WhatsAppInquiryPopup from "./WhatsAppInquiryPopup";

export default function StickyLeadBar() {
  const [modalOpen, setModalOpen] = useState(false);

  const prefilledMessage = encodeURIComponent(
    "Hi Gemora Global! I want to get wholesale prices & bulk export catalogue."
  );

  return (
    <>
      {/* Mobile Sticky B2B Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0d1b6e]/95 backdrop-blur-md border-t border-accent/40 p-2.5 shadow-2xl flex items-center justify-between gap-2.5">
        <a
          href={`https://wa.me/917976341419?text=${prefilledMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-500 text-white font-bold text-xs py-2.5 px-3 rounded-xl shadow-md transition-all active:scale-95"
        >
          <MessageCircle className="w-4 h-4 fill-white flex-shrink-0" />
          <span>WhatsApp Quote</span>
        </a>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-accent hover:bg-accent/90 text-primary font-bold text-xs py-2.5 px-3 rounded-xl shadow-md transition-all active:scale-95"
        >
          <Send className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Get Bulk Price List</span>
        </button>
      </div>

      {/* Inquiry Modal */}
      <WhatsAppInquiryPopup
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        productName="Wholesale Jewellery Catalogue & Price List"
      />
    </>
  );
}
