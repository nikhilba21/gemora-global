import { useEffect } from "react";
import type { Product, Category } from "../types";

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
  product?: Product;
  category?: Category;
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

export const BASE_URL = "https://www.gemoraglobal.co";
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
    product,
    category,
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

    // Product schema — Full Merchant Listing compliance
    if (product) {
      const prodImg = product.imageUrls && product.imageUrls.length > 0 
        ? product.imageUrls.map(url => url.startsWith('http') ? url : `${BASE_URL}${url}`)
        : [DEFAULT_OG_IMAGE];
      
      schemas.push({
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": `${BASE_URL}/products/item/${product.id}#product`,
        name: product.name,
        image: prodImg,
        description: product.description ? product.description.substring(0, 500) : description,
        sku: product.sku || `GG-${product.id}`,
        mpn: product.sku || `GG-${product.id}`,
        brand: {
          "@type": "Brand",
          name: "Gemora Global",
        },
        offers: {
          "@type": "Offer",
          url: canonical,
          priceCurrency: "USD",
          price: "1.00", // Factory-direct base price
          priceValidUntil: "2026-12-31",
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
          seller: {
            "@type": "Organization",
            name: "Gemora Global",
          },
          shippingDetails: {
            "@type": "OfferShippingDetails",
            shippingRate: {
              "@type": "MonetaryAmount",
              value: "0.00",
              currency: "USD"
            },
            shippingDestination: {
              "@type": "DefinedRegion",
              addressCountry: "US"
            },
            deliveryTime: {
              "@type": "ShippingDeliveryTime",
              handlingTime: {
                "@type": "QuantitativeValue",
                minValue: 1,
                maxValue: 3,
                unitCode: "d"
              },
              transitTime: {
                "@type": "QuantitativeValue",
                minValue: 5,
                maxValue: 10,
                unitCode: "d"
              }
            }
          }
        },
      });
    }

    // Category / ItemList schema
    if (category) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": `${BASE_URL}/products/${category.slug}#collection`,
        name: category.name,
        description: category.description || description,
        url: `${BASE_URL}/products/${category.slug}`,
        mainEntity: {
          "@type": "ItemList",
          name: category.name,
          description: `Browse our collection of wholesale ${category.name} from Jaipur.`,
          numberOfItems: 100, // Approximate
        }
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

    // Custom schema passed via props
    if (schema) {
      if (Array.isArray(schema)) {
        schemas.push(...schema);
      } else {
        schemas.push(schema);
      }
    }

    // Inject all schemas with deduplication for FAQPage and BreadcrumbList
    const existing = document.getElementById("page-schema");
    if (existing) existing.remove();

    if (schemas.length > 0) {
      // Deduplicate by @type for FAQPage and BreadcrumbList to be safe
      const uniqueSchemas: object[] = [];
      const typesSeen = new Set<string>();

      // We process in reverse to keep the "most recent" (often generated from props)
      // or we can just filter explicitly. Let's filter explicitly for FAQ and Breadcrumb.
      const finalSchemas = schemas.filter((s: any) => {
        const type = s["@type"];
        if (type === "FAQPage" || type === "BreadcrumbList") {
          if (typesSeen.has(type)) return false;
          typesSeen.add(type);
        }
        return true;
      });

      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = "page-schema";
      script.textContent = JSON.stringify(
        finalSchemas.length === 1 ? finalSchemas[0] : finalSchemas,
      );
      document.head.appendChild(script);
    }

    // Hreflang alternate links
    const injectedHreflangs: HTMLLinkElement[] = [];

    // 1. Start with provided hreflangs or empty array
    const cluster = [...(hreflangs || [])];

    // 2. Automatically add self-reference if not already present
    // We use 'en' as default or look for an existing lang for the current canonical
    const hasSelf = cluster.some(h => h.url === canonical);
    if (!hasSelf) {
      // If the page is a specific regional one, we might already have its lang.
      // But adding a general 'en' or 'x-default' for every page is safe.
      // If cluster is empty, this page is standalone.
      if (cluster.length === 0) {
        cluster.push({ lang: "en", url: canonical });
        cluster.push({ lang: "x-default", url: canonical });
      } else {
        // Part of a cluster but missing self-reference
        cluster.push({ lang: "en", url: canonical });
      }
    }

    // 3. Clear existing alternates
    for (const el of document.querySelectorAll(
      "link[rel='alternate'][hreflang]",
    )) {
      el.remove();
    }

    // 4. Inject unique hreflangs and sync HTML lang
    const seenLangs = new Set<string>();
    let pageLang = "en"; // Default

    for (const { lang, url } of cluster) {
      if (seenLangs.has(lang)) continue;
      seenLangs.add(lang);

      // If this entry is for the current page, use its lang for the HTML tag
      if (url === canonical) {
        pageLang = lang.split("-")[0];
      }

      const link = document.createElement("link");
      link.rel = "alternate";
      link.setAttribute("hreflang", lang);
      link.href = url;
      document.head.appendChild(link);
      injectedHreflangs.push(link);
    }

    // Sync <html> lang attribute
    document.documentElement.lang = pageLang;

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
    product,
    category,
  ]);
}
