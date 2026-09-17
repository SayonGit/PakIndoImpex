import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { getPageSeo } from "@/lib/data";
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
import { DotGrid } from "@/components/ui/DotGrid";

// Renders per-request rather than at build time: ProductsPreview reads
// featured products from Postgres, which isn't reachable during `next build`.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const pageSeo = await getPageSeo("/");
  return buildMetadata({
    title: pageSeo?.seoTitle || "PT. Pakindo Impex Perkasa | Indonesian Export & Import Partner",
    description:
      pageSeo?.seoDescription ||
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
      {/* Shared background so "Targeted Countries" and "Common Questions"
          blend into one continuous section instead of each clipping its
          own glow blobs at their edges and creating a visible seam. */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <DotGrid
          id="dot-grid-export-faq"
          className="pointer-events-none absolute inset-0 h-full w-full text-ink-900/[0.035]"
        />
        <div
          className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-primary-200/30 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gold-300/30 blur-3xl"
          aria-hidden
        />

        <ExportMarketsSection standalone={false} />
        <div className="mt-32">
          <FaqPreviewSection standalone={false} />
        </div>
      </section>
      <BrandScroller />
      <TestimonialsSection />
    </>
  );
}
