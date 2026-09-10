import type { Metadata, Viewport } from "next";
import { Open_Sans, Poppins } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing, rtlLocales, type Locale } from "@/i18n/routing";
import { SITE_URL, COMPANY } from "@/lib/constants";
import { organizationJsonLd, websiteJsonLd } from "@/lib/structured-data";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyMobileCTA } from "@/components/layout/StickyMobileCTA";
import "../globals.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
});

// Free stand-in for Euclid Circular A (a commercial typeface) — closest
// widely-available Google Font match for its geometric, rounded look.
// Poppins isn't a variable font, so explicit static weights are required.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#126a16",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${COMPANY.legalName} | Indonesian Export & Import Partner`,
    template: `%s | ${COMPANY.shortName}`,
  },
  description:
    "PT. Pakindo Impex Perkasa connects international buyers with Indonesian products through sourcing, quality coordination, export documentation, and logistics support.",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = rtlLocales.has(locale as Locale) ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} className={`${openSans.variable} ${poppins.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-paper font-sans text-ink-900 antialiased pb-16 sm:pb-0">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
        />
        <NextIntlClientProvider messages={messages}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-primary-700 focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to content
          </a>
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <StickyMobileCTA />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
