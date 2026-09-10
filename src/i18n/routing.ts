import { defineRouting } from "next-intl/routing";

/**
 * Supported locales, mapped to the primary language of each target market:
 * Indonesia (id), India (hi), Pakistan (ur), Iran (fa), Nepal (ne),
 * Bangladesh (bn), Singapore & Malaysia (ms), China (zh). English remains
 * the default and source of truth for every page.
 */
export const locales = ["en", "id", "hi", "ur", "fa", "ne", "bn", "zh", "ms"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const rtlLocales: ReadonlySet<Locale> = new Set(["ur", "fa"]);

export const localeLabels: Record<Locale, { name: string; nativeName: string }> = {
  en: { name: "English", nativeName: "English" },
  id: { name: "Indonesian", nativeName: "Bahasa Indonesia" },
  hi: { name: "Hindi", nativeName: "हिन्दी" },
  ur: { name: "Urdu", nativeName: "اردو" },
  fa: { name: "Persian", nativeName: "فارسی" },
  ne: { name: "Nepali", nativeName: "नेपाली" },
  bn: { name: "Bengali", nativeName: "বাংলা" },
  zh: { name: "Chinese", nativeName: "中文" },
  ms: { name: "Malay", nativeName: "Bahasa Melayu" },
};

/** Target markets shown in the Country / Language switcher, each mapped to its suggested locale. */
export const marketCountries: {
  code: string;
  name: string;
  locale: Locale;
}[] = [
  { code: "GL", name: "Global", locale: "en" },
  { code: "ID", name: "Indonesia", locale: "id" },
  { code: "IN", name: "India", locale: "hi" },
  { code: "PK", name: "Pakistan", locale: "ur" },
  { code: "IR", name: "Iran", locale: "fa" },
  { code: "NP", name: "Nepal", locale: "ne" },
  { code: "BD", name: "Bangladesh", locale: "bn" },
  { code: "SG", name: "Singapore", locale: "en" },
  { code: "MY", name: "Malaysia", locale: "ms" },
  { code: "CN", name: "China", locale: "zh" },
];

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
  localeCookie: {
    name: "PAKINDO_LOCALE",
  },
});
