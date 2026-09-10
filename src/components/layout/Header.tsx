import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { NAV_LINKS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { CountryLanguageSwitcher } from "./CountryLanguageSwitcher";
import { MobileNav } from "./MobileNav";

export function Header() {
  const t = useTranslations("nav");

  return (
    <header className="shadow-soft sticky top-0 z-50 border-b border-ink-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="PT. Pakindo Impex Perkasa logo"
            width={177}
            height={67}
            priority
            className="h-12 w-auto sm:h-14"
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className="group relative py-1 text-[13px] font-semibold tracking-wide text-ink-700 uppercase transition-colors hover:text-primary-700"
            >
              {t(link.key)}
              <span className="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-gold-400 transition-transform duration-300 ease-spring group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden lg:block">
            <CountryLanguageSwitcher />
          </div>
          <Button href="/request-a-quote" size="md" className="hidden sm:inline-flex">
            {t("requestQuote")}
          </Button>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
