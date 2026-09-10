import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { getPublishedArticles } from "@/lib/data";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { EnglishContentNotice } from "@/components/ui/EnglishContentNotice";
import { ArticleCard } from "@/components/ui/ArticleCard";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: "Export & Sourcing Guides | PT. Pakindo Impex Perkasa",
    description:
      "Guides for international buyers researching Indonesian suppliers, export documentation, shipping terms, and the import process.",
    path: "/blog",
    locale: locale as Locale,
  });
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const articles = await getPublishedArticles();

  return (
    <>
      <PageHero
        eyebrow="Buyer Resources"
        title="Export & Sourcing Guides"
        description="Practical guides for international buyers researching Indonesian suppliers, shipping terms, and the import process."
      />
      <Breadcrumbs items={[{ name: "Blog", path: "/blog" }]} />
      <EnglishContentNotice />

      <section className="py-16 sm:py-24">
        <Container>
          {articles.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  slug={article.slug}
                  title={article.title}
                  excerpt={article.excerpt}
                  category={article.category}
                  publishDate={article.publishDate}
                />
              ))}
            </div>
          ) : (
            <p className="text-ink-500">More guides are on the way — check back soon.</p>
          )}
        </Container>
      </section>
    </>
  );
}
