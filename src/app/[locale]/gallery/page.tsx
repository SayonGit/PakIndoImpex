import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { getGalleryItems, getPageSeo } from "@/lib/data";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { EnglishContentNotice } from "@/components/ui/EnglishContentNotice";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";

// Renders per-request: GalleryGrid reads gallery items from Postgres,
// which isn't reachable during `next build`.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const pageSeo = await getPageSeo("/gallery");
  return buildMetadata({
    title: pageSeo?.seoTitle || "Gallery | PT. Pakindo Impex Perkasa",
    description:
      pageSeo?.seoDescription ||
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

  const items = await getGalleryItems();

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="A Visual Look at How We Work"
        description="Photos and videos of our products, packaging, and operations."
      />
      <Breadcrumbs items={[{ name: "Gallery", path: "/gallery" }]} />
      <EnglishContentNotice />

      <div className="bg-white">
        <section className="py-16 sm:py-24">
          <Container>
            <GalleryGrid items={items} />
          </Container>
        </section>
      </div>
    </>
  );
}
