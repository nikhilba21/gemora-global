import { useEffect } from "react";

export interface HreflangEntry {
  lang: string;
  url: string;
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface HowToStep {
  name: string;
  text: string;
}

interface PageSEOOptions {
  title: string;
  description: string;
  canonical?: string;
  robots?: string;
  googlebot?: string;
  ogType?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogLocale?: string;
  ogSiteName?: string;
  twitterCard?: string;
  twitterSite?: string;
  schema?: object | object[];
  hreflangs?: HreflangEntry[];
  faqItems?: FAQItem[];
  breadcrumbs?: BreadcrumbItem[];
  howToSteps?: { name: string; description: string; steps: HowToStep[] };
  speakable?: boolean;
  isHomepage?: boolean;
}

function upsertMetaProperty(property: string, value: string) {
  let el = document.querySelector(
    `meta[property='${property}']`,
  ) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

function upsertMetaName(name: string, value: string) {
  let el = document.querySelector(
    `meta[name='${name}']`,
  ) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

export const BASE_URL = "https://gemoraglobal-tje.caffeine.xyz";
const DEFAULT_OG_IMAGE = `${BASE_URL}/images/og-banner.jpg`;

const DEFAULT_DESCRIPTION =
  "Gemora Global — wholesale imitation jewellery from Jaipur. MOQ 50 units, 500+ designs, shipping to 30+ countries.";

export function usePageSEO(options: PageSEOOptions) {
  const {
    title,
    description: rawDescription,
    canonical: canonicalProp,
    robots = "index, follow",
    googlebot = "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    ogType = "website",
    ogTitle,
    ogDescription,
    ogImage = DEFAULT_OG_IMAGE,
    ogLocale = "en_GB",
    ogSiteName = "Gemora Global",
    twitterCard = "summary_large_image",
    twitterSite = "@gemoraglobal",
    schema,
    hreflangs,
    faqItems,
    breadcrumbs,
    howToSteps,
    speakable = false,
    isHomepage = false,
  } = options;

  // Ensure description is never empty or duplicates title
  const description =
    rawDescription?.trim() && rawDescription.trim() !== title
      ? rawDescription.trim()
      : DEFAULT_DESCRIPTION;

  // Dynamic self-referencing canonical
  const canonical =
    canonicalProp ??
    (typeof window !== "undefined" ? window.location.href : BASE_URL);

  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    // Canonical — self-referencing dynamic
    let canonicalEl = document.querySelector(
      "link[rel='canonical']",
    ) as HTMLLinkElement | null;
    if (!canonicalEl) {
      canonicalEl = document.createElement("link");
      canonicalEl.rel = "canonical";
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.href = canonical;

    // Robots meta
    upsertMetaName("robots", robots);
    upsertMetaName("googlebot", googlebot);

    // Description
    upsertMetaName("description", description);

    // Author
    upsertMetaName("author", "Gemora Global");

    // Open Graph tags — using property attribute
    upsertMetaProperty("og:type", ogType);
    upsertMetaProperty("og:url", canonical);
    upsertMetaProperty("og:title", ogTitle || title);
    upsertMetaProperty("og:description", ogDescription || description);
    upsertMetaProperty("og:image", ogImage);
    upsertMetaProperty("og:image:width", "1200");
    upsertMetaProperty("og:image:height", "630");
    upsertMetaProperty("og:locale", ogLocale);
    upsertMetaProperty("og:site_name", ogSiteName);

    // Twitter Card tags
    upsertMetaName("twitter:card", twitterCard);
    upsertMetaName("twitter:site", twitterSite);
    upsertMetaName("twitter:title", ogTitle || title);
    upsertMetaName("twitter:description", ogDescription || description);
    upsertMetaName("twitter:image", ogImage);

    // Build combined schema array
    const schemas: object[] = [];

    // Base schema from prop
    if (schema) {
      if (Array.isArray(schema)) schemas.push(...schema);
      else schemas.push(schema);
    }

    // Organization schema — always included with full contact info
    const orgSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Gemora Global",
      url: BASE_URL,
      email: "globalgemora@gmail.com",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/assets/uploads/logo-removebg-preview-1.png`,
        width: 300,
        height: 60,
      },
      description:
        "Jaipur-based imitation jewellery manufacturer and exporter, established 2011. 500+ wholesale designs. MOQ from 50 units. Anti-tarnish finishing. Shipping to 30+ countries worldwide.",
      foundingDate: "2011",
      address: {
        "@type": "PostalAddress",
        streetAddress: "B 66 MAA Hinglaj Nagar",
        addressLocality: "Jaipur",
        addressRegion: "Rajasthan",
        addressCountry: "IN",
        postalCode: "302021",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+91-7976341419",
        contactType: "sales",
        email: "globalgemora@gmail.com",
        availableLanguage: ["English", "Hindi"],
        areaServed: [
          "IN",
          "AE",
          "FR",
          "US",
          "GB",
          "CA",
          "AU",
          "SG",
          "MY",
          "SA",
          "NG",
          "LK",
          "KW",
        ],
      },
      sameAs: [
        "https://www.instagram.com/gemoraglobal",
        "https://www.indiamart.com/gemora-global",
        "https://www.tradeindia.com/gemora-global",
        "https://wa.me/917976341419",
      ],
    };
    schemas.push(orgSchema);

    // LocalBusiness schema
    schemas.push({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": `${BASE_URL}/#localbusiness`,
      name: "Gemora Global",
      image: `${BASE_URL}/images/og-banner.jpg`,
      telephone: "+91-7976341419",
      email: "globalgemora@gmail.com",
      url: BASE_URL,
      address: {
        "@type": "PostalAddress",
        streetAddress: "B 66 MAA Hinglaj Nagar",
        addressLocality: "Jaipur",
        addressRegion: "Rajasthan",
        postalCode: "302021",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 26.9124,
        longitude: 75.7873,
      },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "09:00",
        closes: "18:00",
      },
      priceRange: "$$",
    });

    // WebSite schema with SearchAction — homepage only
    if (isHomepage) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Gemora Global",
        url: BASE_URL,
        potentialAction: {
          "@type": "SearchAction",
          target: `${BASE_URL}/products?search={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      });
    }

    // BreadcrumbList schema
    if (breadcrumbs && breadcrumbs.length > 0) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((bc, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: bc.name,
          item: bc.url,
        })),
      });
    }

    // FAQPage schema
    if (faqItems && faqItems.length > 0) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqItems.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.a,
          },
        })),
      });
    }

    // HowTo schema
    if (howToSteps) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: howToSteps.name,
        description: howToSteps.description,
        step: howToSteps.steps.map((s) => ({
          "@type": "HowToStep",
          name: s.name,
          text: s.text,
        })),
      });
    }

    // Speakable schema
    if (speakable) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: title,
        url: canonical,
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: [".article-body", ".faq-section", "h1", "h2"],
        },
      });
    }

    // Inject all schemas
    const existing = document.getElementById("page-schema");
    if (existing) existing.remove();
    if (schemas.length > 0) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = "page-schema";
      script.textContent = JSON.stringify(
        schemas.length === 1 ? schemas[0] : schemas,
      );
      document.head.appendChild(script);
    }

    // Hreflang alternate links
    const injectedHreflangs: HTMLLinkElement[] = [];
    if (hreflangs && hreflangs.length > 0) {
      for (const el of document.querySelectorAll(
        "link[rel='alternate'][hreflang]",
      )) {
        el.remove();
      }
      for (const { lang, url } of hreflangs) {
        const link = document.createElement("link");
        link.rel = "alternate";
        link.setAttribute("hreflang", lang);
        link.href = url;
        document.head.appendChild(link);
        injectedHreflangs.push(link);
      }
    }

    return () => {
      document.title = prevTitle;
      for (const el of injectedHreflangs) el.remove();
    };
  }, [
    title,
    description,
    canonical,
    robots,
    googlebot,
    ogType,
    ogTitle,
    ogDescription,
    ogImage,
    ogLocale,
    ogSiteName,
    twitterCard,
    twitterSite,
    schema,
    hreflangs,
    faqItems,
    breadcrumbs,
    howToSteps,
    speakable,
    isHomepage,
  ]);
}
