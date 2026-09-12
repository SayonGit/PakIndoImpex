import { unstable_cache } from "next/cache";
import { prisma } from "./prisma";

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
