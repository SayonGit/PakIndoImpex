import type { Metadata } from "next";
import { SITE_URL, COMPANY } from "./constants";
import type { Locale } from "@/i18n/routing";
import { defaultLocale } from "@/i18n/routing";

type BuildMetadataParams = {
  title: string;
  description: string;
  path: string;
  locale: Locale;
  noIndex?: boolean;
  ogImagePath?: string;
};

/**
 * Builds consistent per-page metadata: unique title/description, canonical
 * URL, and Open Graph / Twitter tags. English (default locale) URLs carry no
 * prefix; other locales are addressed at /{locale}/path.
 */
export function buildMetadata({
  title,
  description,
  path,
  locale,
  noIndex,
  ogImagePath = "/opengraph-image",
}: BuildMetadataParams): Metadata {
  const localizedPath = locale === defaultLocale ? path : `/${locale}${path}`;
  const canonicalUrl = new URL(localizedPath || "/", SITE_URL).toString();
  const absoluteOgImage = new URL(ogImagePath, SITE_URL).toString();
  const fullTitle = title.includes(COMPANY.shortName)
    ? title
    : `${title} | ${COMPANY.shortName}`;

  return {
    // `absolute` bypasses the root layout's `%s | Company` title template —
    // buildMetadata already produces the final, complete title itself, so
    // without this the company name gets appended a second time.
    title: { absolute: fullTitle },
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: COMPANY.shortName,
      type: "website",
      images: [{ url: absoluteOgImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [absoluteOgImage],
    },
  };
}
