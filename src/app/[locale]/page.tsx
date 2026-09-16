import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { faqJsonLd } from "@/lib/structured-data";
import type { FaqItem } from "@/components/ui/FaqAccordion";
import { Hero } from "@/components/sections/Hero";
import { TrustSection } from "@/components/sections/TrustSection";
import { AboutPreview } from "@/components/sections/AboutPreview";
import { AchievementCounter } from "@/components/sections/AchievementCounter";
import { ProductsPreview } from "@/components/sections/ProductsPreview";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { ExportMarketsSection } from "@/components/sections/ExportMarketsSection";
import { FaqPreviewSection } from "@/components/sections/FaqPreviewSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { BrandScroller } from "@/components/ui/BrandScroller";

// Renders per-request rather than at build time: ProductsPreview reads
// featured products from Postgres, which isn't reachable during `next build`.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: "PT. Pakindo Impex Perkasa | Indonesian Export & Import Partner",
    description:
      "PT. Pakindo Impex Perkasa connects international buyers with Indonesian products through sourcing, quality coordination, export documentation, and logistics support.",
    path: "/",
    locale: locale as Locale,
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home.faq");
  const faqItems = t.raw("items") as FaqItem[];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqItems)) }}
      />
      <Hero />
      <TrustSection />
      <AboutPreview />
      <AchievementCounter />
      <ProductsPreview />
      <ProcessSection />
      <ExportMarketsSection />
      <FaqPreviewSection />
      <BrandScroller />
      <TestimonialsSection />
    </>
  );
}
