import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { NAV_LINKS } from "@/lib/constants";
import { COMPANY } from "@/lib/constants";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { DotGrid } from "@/components/ui/DotGrid";
import { ARECA_NUT_SPLIT_CREDIT } from "@/data/stock-imagery";

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-ink-950 text-ink-200">
      <DotGrid className="pointer-events-none absolute inset-0 h-full w-full text-white/[0.04]" />
      <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:px-10 lg:py-20">
        <div>
          <Image
            src="/images/logo.png"
            alt="PT. Pakindo Impex Perkasa logo"
            width={177}
            height={67}
            className="h-12 w-auto brightness-0 invert"
          />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-300">{t("tagline")}</p>
        </div>

        <div>
          <h3 className="text-xs font-bold tracking-[0.2em] text-white uppercase">
            {t("linksHeading")}
          </h3>
          <ul className="mt-4 space-y-2.5">
            {NAV_LINKS.map((link) => (
              <li key={link.key}>
                <Link href={link.href} className="text-sm text-ink-300 hover:text-gold-300">
                  {tNav(link.key)}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/request-a-quote" className="text-sm text-gold-300 hover:text-gold-200">
                {tNav("requestQuote")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold tracking-[0.2em] text-white uppercase">
            {t("contactHeading")}
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-300">
            <li>
              <span className="text-ink-500">{t("whatsapp")}: </span>
              {COMPANY.whatsapp}
            </li>
            <li>
              <span className="text-ink-500">{t("email")}: </span>
              {COMPANY.email}
            </li>
            <li>
              <span className="text-ink-500">{t("office")}: </span>
              {COMPANY.address}
            </li>
          </ul>
          <p className="mt-4 text-xs text-ink-500 italic">{t("verifyNotice")}</p>
        </div>

        <div>
          <h3 className="text-xs font-bold tracking-[0.2em] text-white uppercase">
            {t("newsletterHeading")}
          </h3>
          <p className="mt-4 text-sm text-ink-300">{t("newsletterCopy")}</p>
          <div className="mt-4">
            <NewsletterForm />
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-5 py-6 text-xs text-ink-500 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <p>
            &copy; {year} {COMPANY.legalName}. {t("rights")}
          </p>
          <p>
            <a
              href={ARECA_NUT_SPLIT_CREDIT.href}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="hover:text-ink-300"
            >
              {ARECA_NUT_SPLIT_CREDIT.text}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
