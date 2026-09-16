import { useTranslations } from "next-intl";
import Image from "next/image";
import { Handshake, Phone, Mail } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { NAV_LINKS, SOCIAL_LINKS, COMPANY } from "@/lib/constants";
import { QuoteModalTextTrigger } from "@/components/quote/QuoteModalTextTrigger";
import { QuoteModalTrigger } from "@/components/quote/QuoteModalTrigger";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { DotGrid } from "@/components/ui/DotGrid";
import { FacebookIcon, InstagramIcon, TwitterXIcon, YouTubeIcon } from "@/components/ui/SocialIcons";

const SOCIAL_ICONS = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  twitter: TwitterXIcon,
  youtube: YouTubeIcon,
} as const;

const COMPANY_NAV_KEYS = new Set(["home", "about", "products", "gallery"]);
const RESOURCE_NAV_KEYS = new Set(["blog", "faq", "contact"]);

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const tCta = useTranslations("home.finalCta");
  const year = new Date().getFullYear();

  const companyLinks = NAV_LINKS.filter((link) => COMPANY_NAV_KEYS.has(link.key));
  const resourceLinks = NAV_LINKS.filter((link) => RESOURCE_NAV_KEYS.has(link.key));

  return (
    <footer className="relative overflow-hidden bg-white">
      {/* "Ready to Source from Indonesia?" CTA — floats above the footer
          shell below it via a negative bottom margin; z-10 keeps it
          painting in front of the shell's rounded top edge regardless of
          DOM order. Same content/background as the old standalone FinalCta
          section, which this replaces (see [locale]/page.tsx). */}
      <div className="relative z-10 mx-auto -mb-20 w-full max-w-6xl px-5 sm:-mb-24 sm:px-8 lg:px-10">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-800 via-primary-700 to-primary-950 py-14 text-white shadow-[0_30px_60px_-15px_rgba(4,30,6,0.4)] sm:py-16">
          <DotGrid className="pointer-events-none absolute inset-0 h-full w-full text-white/[0.08]" />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -top-16 -left-10 h-72 w-72 rounded-full bg-gold-400/25 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-10 -bottom-16 h-72 w-72 rounded-full bg-white/15 blur-3xl"
            aria-hidden
          />

          <Container className="relative text-center">
            <span
              className="animate-float mx-auto flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-300 to-gold-500 text-ink-950 shadow-[0_0_32px_-6px_rgba(253,218,126,0.65)]"
              style={{ animationDuration: "6s" }}
            >
              <Handshake className="size-8" strokeWidth={1.75} aria-hidden />
            </span>
            <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              {tCta("heading")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
              {tCta("copy")}
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <QuoteModalTrigger variant="white" size="lg" showArrow>
                {tCta("primaryCta")}
              </QuoteModalTrigger>
              <Button href="/contact" variant="outlineLight" size="lg">
                {tCta("secondaryCta")}
              </Button>
            </div>
          </Container>
        </div>
      </div>

      {/* Footer shell — its rounded top starts underneath the CTA card
          above. Same dot-grid + glow-blob background as "What We Source"
          (no solid fill there either — just the decoration over the page's
          own background). */}
      <div className="relative rounded-t-[2.5rem] pt-34 shadow-[0_-25px_40px_-20px_rgba(16,24,18,0.18)] sm:pt-42">
        <DotGrid className="pointer-events-none absolute inset-0 h-full w-full text-ink-900/[0.035]" />
        <div
          className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-primary-200/30 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gold-300/30 blur-3xl"
          aria-hidden
        />

        <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-5 pb-16 sm:px-8 lg:grid-cols-[1.3fr_1fr_1fr_1.1fr] lg:gap-8 lg:divide-x lg:divide-ink-200/60 lg:px-10 lg:pb-20">
          <div className="lg:pr-8">
            <Image src="/images/logo.png" alt="PT. Pakindo Impex Perkasa logo" width={177} height={67} className="h-16 w-auto" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-600">{t("tagline")}</p>
            <div className="mt-5 flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => {
                const Icon = SOCIAL_ICONS[social.key];
                return (
                  <a
                    key={social.key}
                    href={social.href}
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex size-9 items-center justify-center rounded-full text-ink-500 transition-all duration-200 ease-spring hover:-translate-y-0.5 hover:bg-primary-50 hover:text-primary-700"
                  >
                    <Icon className="size-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="lg:px-8">
            <h3 className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-ink-950 uppercase">
              <span className="h-1 w-5 rounded-full bg-gold-400" aria-hidden />
              {t("companyHeading")}
            </h3>
            <ul className="mt-5 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center text-sm text-ink-600 hover:text-primary-700"
                  >
                    <span className="relative">
                      {tNav(link.key)}
                      <span className="absolute -bottom-1 left-0 h-px w-0 bg-primary-700 transition-all duration-300 ease-spring group-hover:w-full" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:px-8">
            <h3 className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-ink-950 uppercase">
              <span className="h-1 w-5 rounded-full bg-gold-400" aria-hidden />
              {t("resourcesHeading")}
            </h3>
            <ul className="mt-5 space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center text-sm text-ink-600 hover:text-primary-700"
                  >
                    <span className="relative">
                      {tNav(link.key)}
                      <span className="absolute -bottom-1 left-0 h-px w-0 bg-primary-700 transition-all duration-300 ease-spring group-hover:w-full" />
                    </span>
                  </Link>
                </li>
              ))}
              <li>
                <QuoteModalTextTrigger className="group inline-flex items-center text-sm text-primary-700 hover:text-primary-900">
                  <span className="relative">
                    {tNav("requestQuote")}
                    <span className="absolute -bottom-1 left-0 h-px w-0 bg-primary-900 transition-all duration-300 ease-spring group-hover:w-full" />
                  </span>
                </QuoteModalTextTrigger>
              </li>
            </ul>
          </div>

          <div className="lg:pl-8">
            <h3 className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-ink-950 uppercase">
              <span className="h-1 w-5 rounded-full bg-gold-400" aria-hidden />
              {t("contactHeading")}
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-ink-600">
              <li>
                <a
                  href={`tel:${COMPANY.phone}`}
                  className="group flex items-center gap-3 hover:text-primary-700"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700 transition-transform duration-200 ease-spring group-hover:scale-110">
                    <Phone className="size-4" aria-hidden />
                  </span>
                  {COMPANY.whatsapp}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="group flex items-center gap-3 hover:text-primary-700"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700 transition-transform duration-200 ease-spring group-hover:scale-110">
                    <Mail className="size-4" aria-hidden />
                  </span>
                  {COMPANY.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="relative">
          <div className="mx-auto h-px w-full max-w-7xl bg-gradient-to-r from-transparent via-ink-200 to-transparent" aria-hidden />
          <div className="mx-auto flex w-full max-w-7xl items-center justify-center px-5 py-6 text-xs font-bold text-primary-700 sm:px-8 lg:px-10">
            <p>
              &copy; {year} {COMPANY.legalName}. {t("rights")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
