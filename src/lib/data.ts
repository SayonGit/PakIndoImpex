import { prisma } from "./prisma";

export async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { featured: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getAllProducts() {
  return prisma.product.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { relatedArticles: { where: { published: true } } },
  });
}

export async function getPublishedArticles() {
  return prisma.article.findMany({
    where: { published: true },
    orderBy: { publishDate: "desc" },
  });
}

export async function getRecentArticles(limit = 3) {
  return prisma.article.findMany({
    where: { published: true },
    orderBy: { publishDate: "desc" },
    take: limit,
  });
}

export async function getArticleBySlug(slug: string) {
  return prisma.article.findUnique({
    where: { slug, published: true },
    include: { relatedProducts: true },
  });
}

export async function getRelatedArticlesForProduct(productSlug: string, limit = 3) {
  const product = await prisma.product.findUnique({
    where: { slug: productSlug },
    select: { relatedArticles: { where: { published: true }, take: limit } },
  });
  return product?.relatedArticles ?? [];
}
