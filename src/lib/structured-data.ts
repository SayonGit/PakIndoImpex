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

type FaqTreeItem = { question: string; answer: string; children?: FaqTreeItem[] };

/** schema.org's FAQPage has no concept of nested questions, so every question
 * in the tree — parent and chained follow-ups alike — is flattened into one
 * list for the structured data, even though the on-page UI nests them. */
function flattenFaqItems(items: FaqTreeItem[]): { question: string; answer: string }[] {
  return items.flatMap((item) => [
    { question: item.question, answer: item.answer },
    ...(item.children ? flattenFaqItems(item.children) : []),
  ]);
}

export function faqJsonLd(items: FaqTreeItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: flattenFaqItems(items).map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
