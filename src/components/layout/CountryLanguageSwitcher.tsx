"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { clsx } from "clsx";
import { Globe, Check, ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { marketCountries, localeLabels, type Locale } from "@/i18n/routing";

const STORAGE_KEY = "pakindo-country-code";

/** First country in the list that serves this locale — the fallback when there's no (valid) stored pick. */
function defaultCodeForLocale(locale: Locale): string {
  return marketCountries.find((c) => c.locale === locale)?.code ?? marketCountries[0].code;
}

/** Reads the last country explicitly picked here, but only if it still matches the locale actually being served (a shared /hi link shouldn't show "Global" as active). */
function storedCodeForLocale(locale: Locale): string {
  if (typeof window === "undefined") return defaultCodeForLocale(locale);
  let stored: string | null = null;
  try {
    stored = localStorage.getItem(STORAGE_KEY);
  } catch {
    // localStorage unavailable (private browsing, etc.) — fall back below.
  }
  const storedCountry = marketCountries.find((c) => c.code === stored);
  return storedCountry && storedCountry.locale === locale ? storedCountry.code : defaultCodeForLocale(locale);
}

export function CountryLanguageSwitcher({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const t = useTranslations("switcher");
  const activeLocale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Several countries can share one locale (e.g. Global and Singapore both
  // use English), so which single entry is "active" can't be inferred from
  // the locale alone — it has to be the specific country last picked here.
  const [selectedCode, setSelectedCode] = useState<string>(() => storedCodeForLocale(activeLocale));
  const [lastLocale, setLastLocale] = useState(activeLocale);

  // Re-derive the active country when the locale changes from outside this
  // dropdown (e.g. a direct link) — computed during render, not an effect,
  // per https://react.dev/learn/you-might-not-need-an-effect#adjusting-state-when-a-prop-changes
  if (activeLocale !== lastLocale) {
    setLastLocale(activeLocale);
    setSelectedCode(storedCodeForLocale(activeLocale));
  }

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  function selectCountry(code: string, locale: Locale) {
    setOpen(false);
    setSelectedCode(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      // Ignore — the selection still works for this session via state.
    }
    router.replace(pathname, { locale });
  }

  const activeCountry = marketCountries.find((c) => c.code === selectedCode) ?? marketCountries[0];

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={clsx(
          "flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold tracking-wide uppercase transition-all duration-300 ease-spring",
          tone === "dark"
            ? "border-ink-200 text-ink-800 hover:border-primary-600 hover:text-primary-700"
            : "border-white/25 text-white hover:border-gold-300 hover:text-gold-300"
        )}
      >
        <Globe className="size-4" aria-hidden />
        <span>
          {activeCountry.code} · {localeLabels[activeLocale].nativeName}
        </span>
        <ChevronDown
          className={clsx("size-3.5 transition-transform duration-300 ease-spring", open && "rotate-180")}
          aria-hidden
        />
      </button>

      <div
        role="menu"
        className={clsx(
          "shadow-soft-lg absolute right-0 z-50 mt-2 w-72 origin-top-right rounded-2xl border border-ink-200 bg-white p-2 transition-all duration-200 ease-spring",
          open
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        )}
        aria-hidden={!open}
        inert={!open || undefined}
      >
        <p className="px-2 py-1.5 text-[11px] font-bold tracking-[0.15em] text-ink-500 uppercase">
          {t("countryLabel")} / {t("languageLabel")}
        </p>
        <ul className="max-h-80 overflow-y-auto">
          {marketCountries.map((country) => {
            const isActive = country.code === selectedCode;
            return (
              <li key={country.code}>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => selectCountry(country.code, country.locale)}
                  className={clsx(
                    "flex w-full items-center justify-between gap-3 rounded-xl px-2.5 py-2 text-left text-sm transition-colors",
                    isActive ? "bg-primary-50 text-primary-800" : "text-ink-800 hover:bg-ink-50"
                  )}
                >
                  <span>
                    <span className="font-semibold">{country.name}</span>
                    <span className="text-ink-500"> — {localeLabels[country.locale].nativeName}</span>
                  </span>
                  {isActive && <Check className="size-4 shrink-0" aria-hidden />}
                </button>
              </li>
            );
          })}
        </ul>
        <p className="border-t border-ink-100 px-2 pt-2 pb-1 text-[11px] leading-snug text-ink-500">
          {t("note")}
        </p>
      </div>
    </div>
  );
}
