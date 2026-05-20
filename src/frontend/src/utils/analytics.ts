/**
 * Google Analytics 4 (GA4) custom event tracking helper
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Tracks a custom event in GA4
 * @param eventName The name of the event in GA4
 * @param params Optional event parameters
 */
export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window !== "undefined" && window.gtag) {
    try {
      window.gtag("event", eventName, {
        ...params,
        send_to: "G-QNL80LE10N",
      });
      console.log(`[GA4 Event] ${eventName}`, params);
    } catch (e) {
      console.error("Failed to send GA4 event:", e);
    }
  }
}

/**
 * Specifically tracks B2B wholesale WhatsApp inquiries
 * @param pageName The page from which the inquiry originated
 * @param type The type of inquiry (e.g. 'catalog', 'direct_inquiry')
 */
export function trackWhatsAppInquiry(pageName: string, type: string) {
  trackEvent("whatsapp_inquiry", {
    page_name: pageName,
    inquiry_type: type,
    value: 50.0, // Estimated wholesale lead value ($50)
    currency: "USD",
  });
}

/**
 * Tracks when a buyer successfully submits the contact or wholesale inquiry form
 * @param pageName The page from which the form was sent
 */
export function trackFormInquiry(pageName: string) {
  trackEvent("form_submission", {
    page_name: pageName,
    value: 100.0, // Higher value for full lead form ($100)
    currency: "USD",
  });
}
