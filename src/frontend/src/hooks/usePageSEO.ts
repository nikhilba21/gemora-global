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
  schema?: object | object[];
  hreflangs?: HreflangEntry[];
  faqItems?: FAQItem[];
  breadcrumbs?: BreadcrumbItem[];
  howToSteps?: { name: string; description: string; steps: HowToStep[] };
  speakable?: boolean;
  isHomepage?: boolean;
}

function upsertMeta(selector: string, attr: string, value: string) {
  let el = document.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    const [attrName, attrVal] = attr.split("=");
    el.setAttribute(attrName, attrVal);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

const BASE_URL = "https://gemoraglobal-tje.caffeine.xyz";

export function usePageSEO(options: PageSEOOptions) {
  const {
    title,
    description,
    canonical: canonicalProp,
    robots = "index, follow",
    googlebot = "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    ogType = "website",
    ogTitle,
    ogDescription,
    ogImage,
    ogLocale = "en_GB",
    ogSiteName = "Gemora Global",
    twitterCard = "summary_large_image",
    schema,
    hreflangs,
    faqItems,
    breadcrumbs,
    howToSteps,
    speakable = false,
    isHomepage = false,
  } = options;

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
    upsertMeta("meta[name='robots']", "name=robots", robots);
    upsertMeta("meta[name='googlebot']", "name=googlebot", googlebot);

    // Description
    upsertMeta("meta[name='description']", "name=description", description);

    // OG tags
    upsertMeta("meta[property='og:type']", "property=og:type", ogType);
    upsertMeta("meta[property='og:url']", "property=og:url", canonical);
    upsertMeta(
      "meta[property='og:title']",
      "property=og:title",
      ogTitle || title,
    );
    upsertMeta(
      "meta[property='og:description']",
      "property=og:description",
      ogDescription || description,
    );
    if (ogImage)
      upsertMeta("meta[property='og:image']", "property=og:image", ogImage);
    upsertMeta("meta[property='og:locale']", "property=og:locale", ogLocale);
    upsertMeta(
      "meta[property='og:site_name']",
      "property=og:site_name",
      ogSiteName,
    );

    // Twitter
    upsertMeta("meta[name='twitter:card']", "name=twitter:card", twitterCard);
    upsertMeta(
      "meta[name='twitter:title']",
      "name=twitter:title",
      ogTitle || title,
    );
    upsertMeta(
      "meta[name='twitter:description']",
      "name=twitter:description",
      ogDescription || description,
    );
    if (ogImage)
      upsertMeta("meta[name='twitter:image']", "name=twitter:image", ogImage);

    // Build combined schema array
    const schemas: object[] = [];

    // Base schema from prop
    if (schema) {
      if (Array.isArray(schema)) schemas.push(...schema);
      else schemas.push(schema);
    }

    // Organization schema — always included
    const orgSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Gemora Global",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/assets/uploads/logo-removebg-preview-1.png`,
        width: 300,
        height: 60,
      },
      description:
        "India's leading imitation jewellery manufacturer and exporter from Jaipur, Rajasthan.",
      foundingDate: "2013",
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
        areaServed: "Worldwide",
      },
      sameAs: [
        "https://www.instagram.com/gemoraglobal",
        "https://www.indiamart.com/gemora-global",
        "https://www.tradeindia.com/gemora-global",
        "https://www.exportersindia.com/gemora-global",
        "https://wa.me/917976341419",
      ],
    };
    schemas.push(orgSchema);

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
    schema,
    hreflangs,
    faqItems,
    breadcrumbs,
    howToSteps,
    speakable,
    isHomepage,
  ]);
}
