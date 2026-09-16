/**
 * Central place for facts about the company. Every field here is either
 * verified public information or an explicit [VERIFY: ...] placeholder per
 * assets/CONTENT.md section 2.1 — never fill these in with invented data.
 */
// `||` (not `??`) deliberately treats an empty string the same as unset —
// a blank NEXT_PUBLIC_SITE_URL env var (e.g. added but never filled in on a
// hosting dashboard) previously reached `new URL("")` and crashed the build.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const COMPANY = {
  legalName: "PT. Pakindo Impex Perkasa",
  shortName: "Pakindo Impex Perkasa",
  country: "Indonesia",
  whatsapp: "+6281310188888",
  /** Same number as WhatsApp — the only verified contact number on file. */
  phone: "+6281310188888",
  email: "info@pakindoimpex.com",
  address: "PT. Pakindo Impex Perkasa, Desa Tangkit, RT. 001, Sungai Gelam, Kabupaten Muaro Jambi, Jambi, Indonesia",
  /** Condensed for tight spaces (e.g. the top utility bar) — full address elsewhere. */
  shortAddress: "Jambi, Indonesia",
  businessHours: "Monday – Friday: 8:00 AM – 4:00 PM / Saturday: 8:00 AM – 1:00 PM / Sunday: Closed",
} as const;

/** wa.me deep link for the floating WhatsApp button. */
export const WHATSAPP_LINK =
  "https://wa.me/+6281310188888/?text=Hello,%20I%20visited%20your%20website%20and%20would%20like%20more%20information%20about%20your%20products.";

/**
 * Social profile links — NOT yet verified. Hrefs stay "#" (inert) until the
 * business owner supplies real URLs; never fabricate a handle or profile.
 */
export const SOCIAL_LINKS = [
  { key: "facebook", href: "#", label: "Facebook" },
  { key: "instagram", href: "#", label: "Instagram" },
  { key: "twitter", href: "#", label: "Twitter / X" },
  { key: "youtube", href: "#", label: "YouTube" },
] as const;

export const NAV_LINKS = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "products", href: "/#products" },
  { key: "gallery", href: "/gallery" },
  { key: "blog", href: "/blog" },
  { key: "faq", href: "/#faq" },
  { key: "contact", href: "/contact" },
] as const;

export const INCOTERMS = ["FOB", "CFR", "CIF"] as const;

/** Container-based volume estimates offered in the Request a Quote form's quantity dropdown. */
export const QUANTITY_ESTIMATES = [
  "Trial order (less than 1 x 20')",
  "1 x 20' FCL",
  "1 x 40' FCL",
  "More than 1 FCL",
] as const;

/**
 * ITU-T international calling codes, for the phone-number country-code
 * selector on the Request a Quote form. Standard public reference data
 * (not a business claim) — our verified target markets listed first, then
 * other common trading regions.
 */
export const COUNTRY_CALLING_CODES = [
  { dial: "+62", country: "Indonesia" },
  { dial: "+91", country: "India" },
  { dial: "+92", country: "Pakistan" },
  { dial: "+880", country: "Bangladesh" },
  { dial: "+977", country: "Nepal" },
  { dial: "+98", country: "Iran" },
  { dial: "+65", country: "Singapore" },
  { dial: "+60", country: "Malaysia" },
  { dial: "+86", country: "China" },
  { dial: "+971", country: "United Arab Emirates" },
  { dial: "+966", country: "Saudi Arabia" },
  { dial: "+974", country: "Qatar" },
  { dial: "+965", country: "Kuwait" },
  { dial: "+973", country: "Bahrain" },
  { dial: "+968", country: "Oman" },
  { dial: "+90", country: "Turkey" },
  { dial: "+20", country: "Egypt" },
  { dial: "+27", country: "South Africa" },
  { dial: "+234", country: "Nigeria" },
  { dial: "+254", country: "Kenya" },
  { dial: "+63", country: "Philippines" },
  { dial: "+84", country: "Vietnam" },
  { dial: "+66", country: "Thailand" },
  { dial: "+95", country: "Myanmar" },
  { dial: "+82", country: "South Korea" },
  { dial: "+81", country: "Japan" },
  { dial: "+852", country: "Hong Kong" },
  { dial: "+886", country: "Taiwan" },
  { dial: "+61", country: "Australia" },
  { dial: "+64", country: "New Zealand" },
  { dial: "+44", country: "United Kingdom" },
  { dial: "+49", country: "Germany" },
  { dial: "+31", country: "Netherlands" },
  { dial: "+33", country: "France" },
  { dial: "+39", country: "Italy" },
  { dial: "+34", country: "Spain" },
  { dial: "+1", country: "United States / Canada" },
  { dial: "+55", country: "Brazil" },
  { dial: "+52", country: "Mexico" },
] as const;

/**
 * Forms/processing variants of the one verified export product (areca /
 * betel nut). These are not separate database-backed product pages — all
 * three link back to the single real "Areca Nut" product record — but the
 * names themselves are real, so they're safe to display directly (unlike
 * fabricated specs, grades, or demand claims, which stay [VERIFY: ...]).
 */
export const PRODUCT_CATEGORIES = ["Split Betel Nut", "Whole Betel Nut", "Roasted Areca Nut"] as const;
