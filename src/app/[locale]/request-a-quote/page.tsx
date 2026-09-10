import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { EnglishContentNotice } from "@/components/ui/EnglishContentNotice";
import { QuoteForm } from "@/components/forms/QuoteForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: "Request a Quote | PT. Pakindo Impex Perkasa",
    description:
      "Request an export quotation from PT. Pakindo Impex Perkasa. Send your product, quantity, quality, packaging, destination, and shipping requirements.",
    path: "/request-a-quote",
    locale: locale as Locale,
  });
}

export default async function RequestQuotePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ product?: string }>;
}) {
  const { locale } = await params;
  const { product } = await searchParams;
  setRequestLocale(locale);

  return (
    <>
      <PageHero
        eyebrow="Let's Talk Trade"
        title="Request a Quote"
        description="Tell us what you need and we will review your inquiry."
      />
      <Breadcrumbs items={[{ name: "Request a Quote", path: "/request-a-quote" }]} />
      <EnglishContentNotice />

      <section className="py-16 sm:py-24">
        <Container className="shadow-soft max-w-3xl rounded-2xl border border-ink-100 bg-white p-6 sm:p-10">
          <QuoteForm defaultProduct={product} />
        </Container>
      </section>
    </>
  );
}
