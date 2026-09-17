import { prisma } from "./prisma";
import type { SiteSettings } from "@prisma/client";

/**
 * Reads used only by the admin panel — always fresh (no unstable_cache),
 * since an editor needs to see their own just-made change immediately.
 * Public-facing reads live in ./data.ts and are cached there.
 */
export async function getSiteSettingsForAdmin() {
  return prisma.siteSettings.findUnique({ where: { id: 1 } });
}

export type AdminSiteSettings = Omit<SiteSettings, "smtpPassword"> & {
  smtpPassword: string;
  smtpPasswordSet: boolean;
};

/**
 * Same as getSiteSettingsForAdmin(), but with the real SMTP password
 * stripped out — safe to pass straight into a client component or an API
 * response, since the plaintext password must never reach the browser
 * (only smtpPasswordSet, a boolean, tells the form whether one exists).
 */
export async function getSiteSettingsForAdminMasked(): Promise<AdminSiteSettings | null> {
  const settings = await getSiteSettingsForAdmin();
  if (!settings) return null;
  const { smtpPassword, ...rest } = settings;
  return { ...rest, smtpPassword: "", smtpPasswordSet: Boolean(smtpPassword) };
}

export async function getAllGalleryItemsForAdmin() {
  return prisma.galleryItem.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getGalleryItemForAdmin(id: string) {
  return prisma.galleryItem.findUnique({ where: { id } });
}

export async function getAllTestimonialsForAdmin() {
  return prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getTestimonialForAdmin(id: string) {
  return prisma.testimonial.findUnique({ where: { id } });
}

export async function getAllArticlesForAdmin() {
  return prisma.article.findMany({ orderBy: { publishDate: "desc" } });
}

export async function getArticleForAdmin(id: string) {
  return prisma.article.findUnique({ where: { id } });
}

export async function getAllTeamMembersForAdmin() {
  return prisma.teamMember.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getTeamMemberForAdmin(id: string) {
  return prisma.teamMember.findUnique({ where: { id } });
}

export async function getAllBlogCategoriesForAdmin() {
  return prisma.blogCategory.findMany({ orderBy: { name: "asc" } });
}

export async function getAllPageSeoForAdmin() {
  return prisma.pageSeo.findMany();
}

export async function getAllQuoteRequestsForAdmin() {
  return prisma.quoteRequest.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getQuoteRequestForAdmin(id: string) {
  return prisma.quoteRequest.findUnique({ where: { id } });
}

export async function getAllContactMessagesForAdmin() {
  return prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getContactMessageForAdmin(id: string) {
  return prisma.contactMessage.findUnique({ where: { id } });
}

export async function getDashboardStats() {
  const [newQuotes, newMessages, articles, galleryItems, testimonials, teamMembers] = await Promise.all([
    prisma.quoteRequest.count({ where: { status: "NEW" } }),
    prisma.contactMessage.count({ where: { status: "NEW" } }),
    prisma.article.count({ where: { published: true } }),
    prisma.galleryItem.count({ where: { published: true } }),
    prisma.testimonial.count({ where: { published: true } }),
    prisma.teamMember.count({ where: { published: true } }),
  ]);
  return { newQuotes, newMessages, articles, galleryItems, testimonials, teamMembers };
}
