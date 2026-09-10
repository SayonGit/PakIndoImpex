import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { getAllProducts } from "@/lib/data";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { EnglishContentNotice } from "@/components/ui/EnglishContentNotice";
import { ProductCard, ComingSoonProductCard } from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: "Indonesian Products | PT. Pakindo Impex Perkasa",
    description:
      "Explore Indonesian products available for international buyers and submit your product, quantity, specification, packaging, and destination requirements.",
    path: "/products",
    locale: locale as Locale,
  });
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const products = await getAllProducts();

  return (
    <>
      <PageHero
        eyebrow="What We Source"
        title="Indonesian Products for International Buyers"
        description="Browse our available product categories or contact us with a specific sourcing requirement."
      />
      <Breadcrumbs items={[{ name: "Products", path: "/products" }]} />
      <EnglishContentNotice />

      <section className="py-16 sm:py-24">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                name={product.name}
                description={product.shortDescription}
                href={`/products/${product.slug}`}
                slug={product.slug}
                cta="View Product"
              />
            ))}

            {PRODUCT_CATEGORIES.slice(products.length).map((category) => (
              <ComingSoonProductCard
                key={category}
                name={category}
                note="Category details coming soon"
              />
            ))}

            <div className="flex flex-col justify-between rounded-2xl border-2 border-dashed border-primary-300 bg-primary-50 p-6 transition-all duration-300 ease-spring hover:-translate-y-1 hover:border-primary-400">
              <div>
                <Sparkles className="size-8 text-primary-700" aria-hidden />
                <h3 className="mt-4 text-lg font-bold text-ink-950">Custom Sourcing</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  Looking for a specific Indonesian product? Send us your requirements and we
                  can review sourcing possibilities.
                </p>
              </div>
              <Button href="/request-a-quote" variant="secondary" size="md" className="mt-6 self-start">
                Request a Quote
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
