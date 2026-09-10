import { z } from "zod";

/**
 * Shared server-side validation for the Request a Quote form. Mirrors the
 * field list in assets/CONTENT.md section 22. Client-side validation is a
 * convenience only — this is the source of truth enforced in the API route.
 */
export const quoteRequestSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(120),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  email: z.string().trim().email("Please enter a valid email address.").max(180),
  phone: z.string().trim().min(5, "Please enter a valid phone / WhatsApp number.").max(40),
  country: z.string().trim().min(2, "Please select your country.").max(80),
  product: z.string().trim().min(2, "Please tell us which product you need.").max(160),
  quantity: z.string().trim().min(1, "Please enter the quantity you require.").max(80),
  quality: z.string().trim().max(160).optional().or(z.literal("")),
  specification: z.string().trim().max(160).optional().or(z.literal("")),
  packaging: z.string().trim().max(160).optional().or(z.literal("")),
  destinationPort: z.string().trim().max(160).optional().or(z.literal("")),
  incoterm: z.string().trim().max(20).optional().or(z.literal("")),
  targetDeliveryDate: z.string().trim().max(60).optional().or(z.literal("")),
  additionalRequirements: z.string().trim().max(2000).optional().or(z.literal("")),
  locale: z.string().trim().max(10).optional(),
  /** Honeypot field — must stay empty. Bots that fill every field trip this. */
  website: z.string().max(0).optional().or(z.literal("")),
});

export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;

export const contactMessageSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(120),
  email: z.string().trim().email("Please enter a valid email address.").max(180),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  country: z.string().trim().max(80).optional().or(z.literal("")),
  subject: z.string().trim().max(160).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Please share a few details about your inquiry.").max(3000),
  locale: z.string().trim().max(10).optional(),
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;

export const newsletterSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address.").max(180),
  locale: z.string().trim().max(10).optional(),
  website: z.string().max(0).optional().or(z.literal("")),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
