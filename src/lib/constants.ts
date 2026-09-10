/**
 * Central place for facts about the company. Every field here is either
 * verified public information or an explicit [VERIFY: ...] placeholder per
 * assets/CONTENT.md section 2.1 — never fill these in with invented data.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const COMPANY = {
  legalName: "PT. Pakindo Impex Perkasa",
  shortName: "Pakindo Impex Perkasa",
  country: "Indonesia",
  whatsapp: "[VERIFY: WHATSAPP NUMBER]",
  email: "[VERIFY: EMAIL ADDRESS]",
  address: "[VERIFY: OFFICE ADDRESS]",
  businessHours: "[VERIFY: BUSINESS HOURS]",
} as const;

export const NAV_LINKS = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "products", href: "/products" },
  { key: "gallery", href: "/gallery" },
  { key: "blog", href: "/blog" },
  { key: "faq", href: "/faq" },
  { key: "contact", href: "/contact" },
] as const;

export const INCOTERMS = ["FOB", "CFR", "CIF"] as const;

export const PRODUCT_CATEGORIES = [
  "Areca Nut",
  "[PRODUCT CATEGORY 2]",
  "[PRODUCT CATEGORY 3]",
] as const;
