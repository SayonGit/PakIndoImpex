import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address.").max(180),
  password: z.string().min(1, "Please enter your password.").max(200),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

const optionalUrl = z.string().trim().url("Enter a full URL, e.g. https://...").max(300).optional().or(z.literal(""));

export const siteSettingsSchema = z.object({
  phone: z.string().trim().min(3, "Required.").max(40),
  whatsapp: z.string().trim().min(3, "Required.").max(40),
  email: z.string().trim().email("Please enter a valid email address.").max(180),
  address: z.string().trim().min(5, "Required.").max(400),
  shortAddress: z.string().trim().min(2, "Required.").max(120),
  businessHours: z.string().trim().min(2, "Required.").max(300),
  facebookUrl: optionalUrl,
  instagramUrl: optionalUrl,
  twitterUrl: optionalUrl,
  youtubeUrl: optionalUrl,
  logoUrl: z.string().trim().max(300).optional().or(z.literal("")),
  faviconUrl: z.string().trim().max(300).optional().or(z.literal("")),
  smtpHost: z.string().trim().max(200).optional().or(z.literal("")),
  smtpPort: z.union([z.coerce.number().int().min(1).max(65535), z.literal("")]).optional(),
  smtpSecure: z.boolean(),
  smtpUser: z.string().trim().max(200).optional().or(z.literal("")),
  /** Blank means "keep the currently saved password" — see the PUT handler. */
  smtpPassword: z.string().max(300).optional().or(z.literal("")),
  smtpFromName: z.string().trim().max(100).optional().or(z.literal("")),
  smtpFromEmail: z.string().trim().email("Enter a valid email address.").max(180).optional().or(z.literal("")),
  notifyToEmail: z.string().trim().email("Enter a valid email address.").max(180).optional().or(z.literal("")),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;

export const testEmailSchema = z.object({
  smtpHost: z.string().trim().min(1, "Required."),
  smtpPort: z.coerce.number().int().min(1).max(65535),
  smtpSecure: z.boolean(),
  smtpUser: z.string().trim().min(1, "Required."),
  /** Blank means "use the currently saved password". */
  smtpPassword: z.string().optional().or(z.literal("")),
  smtpFromName: z.string().trim().optional().or(z.literal("")),
  smtpFromEmail: z.string().trim().email("Enter a valid email address.").min(1, "Required."),
  to: z.string().trim().email("Enter a valid email address to send the test to."),
});

export type TestEmailInput = z.infer<typeof testEmailSchema>;

export const galleryItemSchema = z.object({
  mediaType: z.enum(["IMAGE", "VIDEO"]),
  url: z.string().trim().min(1, "Required.").max(300),
  altText: z.string().trim().min(1, "Required.").max(200),
  published: z.boolean(),
});

export type GalleryItemInput = z.infer<typeof galleryItemSchema>;

export const testimonialSchema = z.object({
  quote: z.string().trim().min(10, "Please enter the full quote.").max(600),
  role: z.string().trim().min(2, "Required.").max(80),
  country: z.string().trim().min(2, "Required.").max(80),
  published: z.boolean(),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;

export const teamMemberSchema = z.object({
  name: z.string().trim().min(2, "Required.").max(100),
  role: z.string().trim().min(2, "Required.").max(100),
  photoUrl: z.string().trim().max(300).optional().or(z.literal("")),
  published: z.boolean(),
});

export type TeamMemberInput = z.infer<typeof teamMemberSchema>;

export const blogCategorySchema = z.object({
  name: z.string().trim().min(2, "Required.").max(80),
});

export type BlogCategoryInput = z.infer<typeof blogCategorySchema>;

export const articleSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(3, "Slug must be at least 3 characters.")
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only."),
  title: z.string().trim().min(3, "Title must be at least 3 characters.").max(160),
  excerpt: z.string().trim().min(10, "Excerpt must be at least 10 characters.").max(300),
  content: z.string().trim().min(20, "Content must be at least 20 characters."),
  author: z.string().trim().min(2, "Author must be at least 2 characters.").max(100),
  category: z.string().trim().min(2, "Please select a category.").max(80),
  tags: z.array(z.string().trim().min(1)).max(10).default([]),
  coverImageUrl: z.string().trim().max(300).optional().or(z.literal("")),
  seoTitle: z.string().trim().min(3, "SEO title must be at least 3 characters.").max(160),
  seoDescription: z.string().trim().min(3, "SEO description must be at least 3 characters.").max(300),
  published: z.boolean(),
  publishDate: z.string().trim().min(1, "Please choose a publish date."),
});

export type ArticleInput = z.infer<typeof articleSchema>;

export const pageSeoSchema = z.object({
  path: z.string().trim().min(1).max(200),
  seoTitle: z.string().trim().max(160).optional().or(z.literal("")),
  seoDescription: z.string().trim().max(300).optional().or(z.literal("")),
});

export type PageSeoInput = z.infer<typeof pageSeoSchema>;

export const submissionStatusSchema = z.object({
  status: z.enum(["NEW", "REVIEWED", "ARCHIVED"]),
});

export type SubmissionStatusInput = z.infer<typeof submissionStatusSchema>;
