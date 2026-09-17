import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { EnglishContentNotice } from "@/components/ui/EnglishContentNotice";
import { BrandScroller } from "@/components/ui/BrandScroller";
import { AboutIntro } from "@/components/sections/AboutIntro";
import { AchievementCounter } from "@/components/sections/AchievementCounter";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { TeamSection } from "@/components/sections/TeamSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: "About PT. Pakindo Impex Perkasa | Indonesian Trading Partner",
    description:
      "Learn about PT. Pakindo Impex Perkasa and our approach to Indonesian product sourcing, export/import trading, documentation, and international buyer support.",
    path: "/about",
    locale: locale as Locale,
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHero
        eyebrow="About Pakindo"
        title="Your Indonesian Partner for Global Trade"
        description="PT. Pakindo Impex Perkasa is an Indonesian trading and export/import company focused on connecting Indonesian products with international buyers."
      />
      <Breadcrumbs items={[{ name: "About Us", path: "/about" }]} />
      <EnglishContentNotice />

      <AboutIntro />
      <AchievementCounter />

      <ProcessSection />
      <TeamSection />
      <TestimonialsSection />
      <BrandScroller />
    </>
  );
}
