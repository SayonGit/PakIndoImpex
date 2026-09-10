import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { routing, defaultLocale } from "@/i18n/routing";
import { getAllProducts, getPublishedArticles } from "@/lib/data";

export const dynamic = "force-dynamic";

const STATIC_PATHS = [
  "/",
  "/about",
  "/products",
  "/gallery",
  "/blog",
  "/faq",
  "/contact",
  "/request-a-quote",
];

function localizedUrl(path: string, locale: string): string {
  const prefixed = locale === defaultLocale ? path : `/${locale}${path}`;
  return new URL(prefixed || "/", SITE_URL).toString();
}

function alternates(path: string) {
  return Object.fromEntries(
    routing.locales.map((locale) => [locale, localizedUrl(path, locale)])
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, articles] = await Promise.all([getAllProducts(), getPublishedArticles()]);

  const dynamicPaths = [
    ...products.map((p) => `/products/${p.slug}`),
    ...articles.map((a) => `/blog/${a.slug}`),
  ];

  const allPaths = [...STATIC_PATHS, ...dynamicPaths];

  return allPaths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: localizedUrl(path, locale),
      lastModified: new Date(),
      changeFrequency: path === "/" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "/" ? 1 : 0.7,
      alternates: { languages: alternates(path) },
    }))
  );
}
