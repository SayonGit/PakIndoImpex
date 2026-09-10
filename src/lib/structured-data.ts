import { SITE_URL, COMPANY } from "./constants";

/**
 * JSON-LD builders. Only verified information goes in here — no invented
 * ratings, reviews, prices, or availability (assets/CONTENT.md section 30).
 */

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: COMPANY.legalName,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    description:
      "Indonesian export and import trading company connecting international buyers with Indonesian products.",
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: COMPANY.shortName,
    url: SITE_URL,
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.path, SITE_URL).toString(),
    })),
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function productJsonLd(product: {
  name: string;
  description: string;
  slug: string;
  category: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    category: product.category,
    url: new URL(`/products/${product.slug}`, SITE_URL).toString(),
    brand: {
      "@type": "Organization",
      name: COMPANY.legalName,
    },
    // No offers/price/rating included — none of that is verified yet.
  };
}
