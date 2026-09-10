"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { NAV_LINKS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { CountryLanguageSwitcher } from "./CountryLanguageSwitcher";

export function MobileNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  // Close the drawer on navigation. Computed during render (not an effect)
  // per https://react.dev/learn/you-might-not-need-an-effect#adjusting-state-when-a-prop-changes
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("menu")}
        aria-expanded={open}
        className="flex size-10 items-center justify-center rounded-full border border-ink-200 text-ink-900 transition-colors duration-200 hover:border-primary-600 hover:text-primary-700"
      >
        <Menu className="size-5" aria-hidden />
      </button>

      <div
        className={`fixed inset-0 z-[60] flex justify-end transition-opacity duration-300 ease-spring ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
        inert={!open || undefined}
      >
        <button
          aria-hidden
          tabIndex={-1}
          onClick={() => setOpen(false)}
          className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm"
        />
        <div
          className={`relative flex h-full w-full max-w-sm flex-col overflow-y-auto bg-white p-6 shadow-2xl transition-transform duration-300 ease-spring ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold tracking-wide text-ink-900 uppercase">
              {t("menu")}
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t("close")}
              className="flex size-10 items-center justify-center rounded-full border border-ink-200 text-ink-900 transition-colors duration-200 hover:border-secondary-600 hover:text-secondary-600"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>

          <nav className="mt-8 flex flex-col gap-1" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className="border-b border-ink-100 py-3.5 text-lg font-semibold text-ink-900 transition-colors hover:text-primary-700"
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>

          <div className="mt-6">
            <CountryLanguageSwitcher />
          </div>

          <div className="mt-auto pt-8">
            <Button href="/request-a-quote" variant="primary" size="lg" className="w-full">
              {t("requestQuote")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
