import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { EnglishContentNotice } from "@/components/ui/EnglishContentNotice";
import { InlineCta } from "@/components/ui/InlineCta";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: "Gallery | PT. Pakindo Impex Perkasa",
    description:
      "A visual look at how PT. Pakindo Impex Perkasa approaches sourcing, quality coordination, packaging, documentation, and export logistics.",
    path: "/gallery",
    locale: locale as Locale,
  });
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="A Visual Look at How We Work"
        description="We don't yet have real facility or product photography to share, so this gallery represents our process and focus areas through graphic design instead — honest, and ready to be replaced with real photos as they become available."
      />
      <Breadcrumbs items={[{ name: "Gallery", path: "/gallery" }]} />
      <EnglishContentNotice />

      <section className="py-16 sm:py-24">
        <Container>
          <GalleryGrid />
        </Container>
      </section>

      <InlineCta
        message="Have a specific product or requirement in mind?"
        ctaLabel="Request a Quote"
        ctaHref="/request-a-quote"
      />
    </>
  );
}
