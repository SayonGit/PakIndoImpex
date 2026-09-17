import { unstable_cache } from "next/cache";
import { prisma } from "./prisma";
import { COMPANY, SOCIAL_PLATFORMS } from "./constants";

/**
 * All reads here are wrapped in unstable_cache so repeated page loads don't
 * each pay for a fresh database round-trip (the Neon instance this project
 * points at is geographically far from local dev, ~250-900ms per query —
 * see the "why is rendering slow" investigation). Pages stay
 * `force-dynamic` (build-time DB access isn't available), but within the
 * revalidate window, requests hit this in-memory/data cache instead of
 * Postgres. Bump `revalidate` down (or call revalidateTag) once there's a
 * write path — e.g. a future admin panel — that needs fresher reads.
 */
const REVALIDATE_SECONDS = 300;

/**
 * unstable_cache round-trips its return value through JSON, so on a cache
 * *hit* any Date field (e.g. Article.publishDate) comes back as a plain
 * string instead of a Date instance, even though Prisma's/TypeScript's
 * types still say Date — breaking `.toISOString()`/`.toLocaleDateString()`
 * at call sites. Re-hydrate it here, once, so every consumer can keep
 * treating it as a real Date regardless of whether this was a cache hit.
 */
function hydratePublishDate<T extends { publishDate: Date | string }>(article: T): T {
  return { ...article, publishDate: new Date(article.publishDate) };
}

export const getFeaturedProducts = unstable_cache(
  async () =>
    prisma.product.findMany({
      where: { featured: true },
      orderBy: { sortOrder: "asc" },
    }),
  ["featured-products"],
  { revalidate: REVALIDATE_SECONDS, tags: ["products"] }
);

export const getAllProducts = unstable_cache(
  async () => prisma.product.findMany({ orderBy: { sortOrder: "asc" } }),
  ["all-products"],
  { revalidate: REVALIDATE_SECONDS, tags: ["products"] }
);

const _getProductBySlug = unstable_cache(
  async (slug: string) =>
    prisma.product.findUnique({
      where: { slug },
      include: { relatedArticles: { where: { published: true } } },
    }),
  ["product-by-slug"],
  { revalidate: REVALIDATE_SECONDS, tags: ["products"] }
);

export async function getProductBySlug(slug: string) {
  const product = await _getProductBySlug(slug);
  if (!product) return product;
  return { ...product, relatedArticles: product.relatedArticles.map(hydratePublishDate) };
}

const _getPublishedArticles = unstable_cache(
  async () =>
    prisma.article.findMany({
      where: { published: true },
      orderBy: { publishDate: "desc" },
    }),
  ["published-articles"],
  { revalidate: REVALIDATE_SECONDS, tags: ["articles"] }
);

export async function getPublishedArticles() {
  const articles = await _getPublishedArticles();
  return articles.map(hydratePublishDate);
}

const _getRecentArticles = unstable_cache(
  async (limit = 3) =>
    prisma.article.findMany({
      where: { published: true },
      orderBy: { publishDate: "desc" },
      take: limit,
    }),
  ["recent-articles"],
  { revalidate: REVALIDATE_SECONDS, tags: ["articles"] }
);

export async function getRecentArticles(limit = 3) {
  const articles = await _getRecentArticles(limit);
  return articles.map(hydratePublishDate);
}

const _getArticleBySlug = unstable_cache(
  async (slug: string) =>
    prisma.article.findUnique({
      where: { slug, published: true },
      include: { relatedProducts: true },
    }),
  ["article-by-slug"],
  { revalidate: REVALIDATE_SECONDS, tags: ["articles"] }
);

export async function getArticleBySlug(slug: string) {
  const article = await _getArticleBySlug(slug);
  return article ? hydratePublishDate(article) : article;
}

const _getRelatedArticlesForProduct = unstable_cache(
  async (productSlug: string, limit = 3) => {
    const product = await prisma.product.findUnique({
      where: { slug: productSlug },
      select: { relatedArticles: { where: { published: true }, take: limit } },
    });
    return product?.relatedArticles ?? [];
  },
  ["related-articles-for-product"],
  { revalidate: REVALIDATE_SECONDS, tags: ["products", "articles"] }
);

export async function getRelatedArticlesForProduct(productSlug: string, limit = 3) {
  const articles = await _getRelatedArticlesForProduct(productSlug, limit);
  return articles.map(hydratePublishDate);
}

export type SiteSettingsData = {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  shortAddress: string;
  businessHours: string;
  facebookUrl: string | null;
  instagramUrl: string | null;
  twitterUrl: string | null;
  youtubeUrl: string | null;
  logoUrl: string | null;
  faviconUrl: string | null;
};

/** Used until an admin sets real values via /admin/settings. */
const DEFAULT_SITE_SETTINGS: SiteSettingsData = {
  phone: COMPANY.phone,
  whatsapp: COMPANY.whatsapp,
  email: COMPANY.email,
  address: COMPANY.address,
  shortAddress: COMPANY.shortAddress,
  businessHours: COMPANY.businessHours,
  facebookUrl: null,
  instagramUrl: null,
  twitterUrl: null,
  youtubeUrl: null,
  logoUrl: null,
  faviconUrl: null,
};

export const getSiteSettings = unstable_cache(
  async (): Promise<SiteSettingsData> => {
    const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
    return settings ?? DEFAULT_SITE_SETTINGS;
  },
  ["site-settings"],
  { revalidate: REVALIDATE_SECONDS, tags: ["settings"] }
);

/** Social platforms with a real URL set, in SOCIAL_PLATFORMS order — never a fake "#" href. */
export function getSocialLinks(settings: SiteSettingsData) {
  const hrefByKey: Record<(typeof SOCIAL_PLATFORMS)[number]["key"], string | null> = {
    facebook: settings.facebookUrl,
    instagram: settings.instagramUrl,
    twitter: settings.twitterUrl,
    youtube: settings.youtubeUrl,
  };
  return SOCIAL_PLATFORMS.map((platform) => ({ ...platform, href: hrefByKey[platform.key] })).filter(
    (platform): platform is typeof platform & { href: string } => Boolean(platform.href)
  );
}

export const getPublishedTestimonials = unstable_cache(
  async () =>
    prisma.testimonial.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
    }),
  ["published-testimonials"],
  { revalidate: REVALIDATE_SECONDS, tags: ["testimonials"] }
);

export const getPublishedTeamMembers = unstable_cache(
  async () =>
    prisma.teamMember.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
    }),
  ["published-team-members"],
  { revalidate: REVALIDATE_SECONDS, tags: ["team"] }
);

export const getGalleryItems = unstable_cache(
  async () =>
    prisma.galleryItem.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
    }),
  ["gallery-items"],
  { revalidate: REVALIDATE_SECONDS, tags: ["gallery"] }
);

export const getPageSeo = unstable_cache(
  async (path: string) => prisma.pageSeo.findUnique({ where: { path } }),
  ["page-seo"],
  { revalidate: REVALIDATE_SECONDS, tags: ["page-seo"] }
);
