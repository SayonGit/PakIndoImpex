import type { Metadata } from "next";
import { CheckCircle2, Target, Eye } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { EnglishContentNotice } from "@/components/ui/EnglishContentNotice";
import { InlineCta } from "@/components/ui/InlineCta";
import { BrandScroller } from "@/components/ui/BrandScroller";
import { TeamSection } from "@/components/sections/TeamSection";

const WHAT_WE_DO = [
  "Product sourcing",
  "Export trading",
  "Import trading",
  "Supplier coordination",
  "Product specification management",
  "Quality coordination",
  "Packaging coordination",
  "Export documentation",
  "Logistics coordination",
  "Shipment support",
];

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

      <section className="py-16 sm:py-24">
        <Container className="max-w-3xl">
          <p className="text-base leading-relaxed text-ink-700 sm:text-lg">
            Our approach is centered on clear communication, buyer-specific requirements,
            product coordination, documentation, and logistics support.
          </p>
        </Container>
      </section>

      <section className="bg-white pb-16 sm:pb-24">
        <Container>
          <h2 className="text-2xl font-extrabold tracking-tight text-ink-950 sm:text-3xl">
            What We Do
          </h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {WHAT_WE_DO.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 rounded-xl border border-ink-100 bg-ink-50/50 px-4 py-3.5 transition-all duration-300 ease-spring hover:-translate-y-0.5 hover:border-primary-200 hover:bg-white hover:shadow-soft"
              >
                <CheckCircle2 className="size-5 shrink-0 text-primary-600" aria-hidden />
                <span className="text-sm font-medium text-ink-800">{item}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="pb-16 sm:pb-24">
        <Container className="grid gap-6 sm:grid-cols-2">
          <div className="shadow-soft rounded-3xl border border-ink-100 bg-primary-50 p-8 transition-all duration-300 ease-spring hover:-translate-y-1 hover:shadow-soft-lg">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-primary-600 text-white">
              <Target className="size-7" aria-hidden />
            </span>
            <h3 className="mt-5 text-xl font-bold text-ink-950">Our Mission</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-700 sm:text-base">
              To make Indonesian products more accessible to international buyers through
              dependable sourcing, clear communication, and professional trade coordination.
            </p>
          </div>
          <div className="shadow-soft rounded-3xl border border-ink-100 bg-gold-50 p-8 transition-all duration-300 ease-spring hover:-translate-y-1 hover:shadow-soft-lg">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-gold-400 text-ink-950">
              <Eye className="size-7" aria-hidden />
            </span>
            <h3 className="mt-5 text-xl font-bold text-ink-950">Our Vision</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-700 sm:text-base">
              To become a trusted Indonesian trading and export/import partner for buyers
              seeking reliable products and long-term business relationships.
            </p>
          </div>
        </Container>
      </section>

      <TeamSection />
      <BrandScroller />

      <InlineCta
        message="Have questions about working with us?"
        ctaLabel="Contact Us"
        ctaHref="/contact"
      />
    </>
  );
}
