// useCanonical.ts — sets canonical + hreflang on every page dynamically
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const BASE = 'https://www.gemoraglobal.co';

// Country pages that need specific hreflang
const COUNTRY_HREFLANG: Record<string, string[]> = {
  '/export-markets/usa':          ['en-us', 'en'],
  '/export-markets/uk':           ['en-gb', 'en'],
  '/export-markets/uae':          ['en-ae', 'ar-ae', 'en'],
  '/export-markets/australia':    ['en-au', 'en'],
  '/export-markets/canada':       ['en-ca', 'en'],
  '/export-markets/singapore':    ['en-sg', 'en'],
  '/export-markets/malaysia':     ['en-my', 'en'],
  '/export-markets/saudi-arabia': ['en-sa', 'ar-sa', 'en'],
  '/export-markets/kuwait':       ['en-kw', 'ar-kw', 'en'],
  '/export-markets/nigeria':      ['en-ng', 'en'],
  '/export-markets/sri-lanka':    ['en-lk', 'en'],
  '/export-markets/france':       ['fr-fr', 'en'],
  '/jewellery-exporter-to-usa':            ['en-us', 'en'],
  '/jewellery-supplier-uk':                ['en-gb', 'en'],
  '/jewellery-exporter-uae':               ['en-ae', 'en'],
  '/imitation-jewellery-supplier-uae':     ['en-ae', 'en'],
  '/imitation-jewellery-supplier-usa':     ['en-us', 'en'],
  '/wholesale-jewellery-uk':               ['en-gb', 'en'],
  '/jewellery-exporter-australia':         ['en-au', 'en'],
  '/jewellery-exporter-canada':            ['en-ca', 'en'],
  '/jewellery-exporter-singapore':         ['en-sg', 'en'],
  '/jewellery-exporter-europe':            ['en-gb', 'en'],
  '/jewellery-exporter-kuwait':            ['en-kw', 'en'],
  '/jewellery-exporter-malaysia':          ['en-my', 'en'],
  '/jewellery-exporter-saudi-arabia':      ['en-sa', 'en'],
  '/jewellery-exporter-nigeria':           ['en-ng', 'en'],
  '/jewellery-exporter-sri-lanka':         ['en-lk', 'en'],
  '/export-imitation-jewellery-france':    ['fr-fr', 'en'],
  '/export-indian-fashion-jewellery-australia': ['en-au', 'en'],
  '/export-imitation-jewellery-germany-eu':['de-de', 'en'],
  '/export-imitation-jewellery-canada':    ['en-ca', 'en'],
  '/export-imitation-jewellery-singapore': ['en-sg', 'en'],
  '/wholesale-jewellery-exporter-to-uae':  ['en-ae', 'en'],
};

function setOrCreate(rel: string, href: string, hreflang?: string) {
  const selector = hreflang
    ? `link[rel="alternate"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]`;
  let el = document.querySelector(selector) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    if (hreflang) el.setAttribute('hreflang', hreflang);
    document.head.appendChild(el);
  }
  el.href = href;
}

function removeOldHreflang() {
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());
}

export function useCanonical(overridePath?: string) {
  const location = useLocation();
  const path = overridePath || location.pathname;
  const canonical = `${BASE}${path === '/' ? '' : path}`.replace(/\/$/, '') || BASE + '/';

  useEffect(() => {
    // Set canonical
    setOrCreate('canonical', canonical);

    // Remove old hreflang tags
    removeOldHreflang();

    // Set hreflang tags
    const countryLangs = COUNTRY_HREFLANG[path];
    if (countryLangs) {
      countryLangs.forEach(lang => setOrCreate('alternate', canonical, lang));
    } else {
      // Default: en + x-default for all pages
      setOrCreate('alternate', canonical, 'en');
    }
    // Always set x-default
    setOrCreate('alternate', canonical, 'x-default');

    // Update og:url
    const ogUrl = document.querySelector('meta[property="og:url"]') as HTMLMetaElement | null;
    if (ogUrl) ogUrl.content = canonical;

  }, [canonical, path]);

  return canonical;
}
