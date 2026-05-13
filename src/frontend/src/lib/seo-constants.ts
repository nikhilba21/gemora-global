export const BASE_URL = "https://www.gemoraglobal.co";

export interface HreflangEntry {
  lang: string;
  url: string;
}

/**
 * Centralized Hreflang Cluster for Regional Exporter Pages.
 * All pages in this list MUST point to each other to satisfy reciprocal hreflang requirements.
 * ONLY use indexable canonical URLs here.
 */
export const EXPORT_HREFLANG_CLUSTER: HreflangEntry[] = [
  { lang: "x-default", url: `${BASE_URL}/global-markets` },
  { lang: "en-US", url: `${BASE_URL}/imitation-jewellery-supplier-usa` },
  { lang: "en-GB", url: `${BASE_URL}/wholesale-jewellery-uk` },
  { lang: "en-AE", url: `${BASE_URL}/jewellery-exporter-uae` },
  { lang: "en-AU", url: `${BASE_URL}/jewellery-exporter-australia` },
  { lang: "en-CA", url: `${BASE_URL}/jewellery-exporter-canada` },
  { lang: "en-SG", url: `${BASE_URL}/jewellery-exporter-singapore` },
  { lang: "en-FR", url: `${BASE_URL}/jewellery-exporter-france` },
  { lang: "en-DE", url: `${BASE_URL}/jewellery-exporter-europe` },
  { lang: "ar-KW", url: `${BASE_URL}/jewellery-exporter-kuwait` },
  { lang: "en-MY", url: `${BASE_URL}/jewellery-exporter-malaysia` },
  { lang: "en-NG", url: `${BASE_URL}/jewellery-exporter-nigeria` },
  { lang: "ar-SA", url: `${BASE_URL}/jewellery-exporter-saudi-arabia` },
  { lang: "en-LK", url: `${BASE_URL}/jewellery-exporter-sri-lanka` },
];
