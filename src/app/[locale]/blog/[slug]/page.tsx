import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { getArticleBySlug } from "@/lib/data";
import { sanitizeArticleHtml } from "@/lib/sanitize";
import { placeholderPhoto } from "@/lib/placeholder-images";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Link } from "@/i18n/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  return buildMetadata({
    title: article.seoTitle,
    description: article.seoDescription,
    path: `/blog/${article.slug}`,
    locale: locale as Locale,
  });
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Blog", path: "/blog" },
          { name: article.title, path: `/blog/${article.slug}` },
        ]}
      />

      <div className="bg-white">
        <article className="py-16 sm:py-24">
          <Container className="max-w-3xl">
            <div className="shadow-soft relative mb-10 aspect-video overflow-hidden rounded-3xl bg-ink-900">
              <Image
                src={placeholderPhoto(`article-${article.slug}`, 1200, 675)}
                alt=""
                fill
                sizes="(min-width: 1024px) 768px, 100vw"
                priority
                className="object-cover"
              />
            </div>

            <p className="text-xs font-bold tracking-[0.2em] text-primary-700 uppercase">
              {article.category}
            </p>
            <h1 className="mt-3 text-3xl leading-[1.1] font-semibold tracking-tight text-ink-950 sm:text-4xl">
              {article.title}
            </h1>
            <div className="mt-4 flex items-center gap-2 text-sm text-ink-500">
              <span>{article.author}</span>
              <span aria-hidden>&middot;</span>
              <time dateTime={article.publishDate.toISOString()}>
                {article.publishDate.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>

            <div
              className="prose-article mt-10 max-w-none space-y-5 text-ink-700 [&_a]:text-primary-700 [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-ink-950 [&_li]:ml-5 [&_li]:list-disc [&_p]:leading-relaxed [&_ul]:space-y-2"
              dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(article.content) }}
            />

            {article.relatedProducts.length > 0 && (
              <div className="mt-14 border-t border-ink-100 pt-8">
                <h2 className="text-sm font-bold tracking-wide text-ink-500 uppercase">
                  Related Product
                </h2>
                <ul className="mt-4 flex flex-wrap gap-3">
                  {article.relatedProducts.map((product) => (
                    <li key={product.id}>
                      <Link
                        href="/#products"
                        className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-800 transition-all duration-300 ease-spring hover:-translate-y-0.5 hover:border-primary-600 hover:shadow-soft"
                      >
                        {product.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Container>
        </article>
      </div>
    </>
  );
}
