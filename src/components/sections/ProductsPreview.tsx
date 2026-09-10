import { getTranslations } from "next-intl/server";
import { Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { ProductCard, ComingSoonProductCard } from "@/components/ui/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import { getFeaturedProducts } from "@/lib/data";

export async function ProductsPreview() {
  const [t, cta, products] = await Promise.all([
    getTranslations("home.products"),
    getTranslations("cta"),
    getFeaturedProducts(),
  ]);

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow={t("eyebrow")} title={t("heading")} description={t("intro")} />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
            <Reveal key={product.id} delay={index * 80}>
              <ProductCard
                name={product.name}
                description={product.shortDescription}
                href={`/products/${product.slug}`}
                slug={product.slug}
                cta={cta("viewProduct")}
              />
            </Reveal>
          ))}

          {PRODUCT_CATEGORIES.slice(products.length).map((category, index) => (
            <Reveal key={category} delay={(products.length + index) * 80}>
              <ComingSoonProductCard name={category} note={t("comingSoon")} />
            </Reveal>
          ))}

          <Reveal delay={(PRODUCT_CATEGORIES.length + 1) * 80}>
            <div className="flex flex-col justify-between rounded-2xl border-2 border-dashed border-primary-300 bg-primary-50 p-6 transition-all duration-300 ease-spring hover:-translate-y-1 hover:border-primary-400">
              <div>
                <Sparkles className="size-8 text-primary-700" aria-hidden />
                <h3 className="mt-4 text-lg font-bold text-ink-950">
                  {t("customSourcing.title")}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  {t("customSourcing.copy")}
                </p>
              </div>
              <Button href="/request-a-quote" variant="secondary" size="md" className="mt-6 self-start">
                {t("customSourcing.cta")}
              </Button>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
