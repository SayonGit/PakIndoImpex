import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Users, ShieldCheck, Package, Ship } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { productJsonLd } from "@/lib/structured-data";
import { getProductBySlug } from "@/lib/data";
import { INCOTERMS } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { InlineCta } from "@/components/ui/InlineCta";
import { Link } from "@/i18n/navigation";

export const dynamic = "force-dynamic";

const BUYER_TYPES = [
  "Importers",
  "Wholesalers",
  "Distributors",
  "Trading companies",
  "Other commercial buyers",
];

async function loadProduct(slug: string) {
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  return product;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  return buildMetadata({
    title: product.seoTitle,
    description: product.seoDescription,
    path: `/products/${product.slug}`,
    locale: locale as Locale,
  });
}

const SPEC_ROWS: { label: string; key: keyof Awaited<ReturnType<typeof loadProduct>> }[] = [
  { label: "Product", key: "name" },
  { label: "Origin", key: "origin" },
  { label: "Grade", key: "grade" },
  { label: "Size", key: "size" },
  { label: "Processing", key: "processing" },
  { label: "Moisture", key: "moisture" },
  { label: "Packaging", key: "packaging" },
  { label: "MOQ", key: "moq" },
  { label: "HS Code", key: "hsCode" },
  { label: "Loading Port", key: "loadingPort" },
  { label: "Availability", key: "availability" },
];

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const product = await loadProduct(slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            productJsonLd({
              name: product.name,
              description: product.description,
              slug: product.slug,
              category: product.category,
            })
          ),
        }}
      />
      <PageHero eyebrow="Product" title={`${product.name.toUpperCase()} FROM INDONESIA`} />
      <Breadcrumbs
        items={[
          { name: "Products", path: "/products" },
          { name: product.name, path: `/products/${product.slug}` },
        ]}
      />

      <section className="py-16 sm:py-24">
        <Container className="max-w-3xl">
          <p className="text-base leading-relaxed text-ink-700 sm:text-lg">
            Looking for {product.name} from Indonesia? PT. Pakindo Impex Perkasa supports
            international buyers with product sourcing, specification coordination, packaging,
            export documentation, and shipment support.
          </p>
          <p className="mt-4 text-base leading-relaxed text-ink-600">{product.description}</p>
        </Container>
      </section>

      <section className="border-t border-ink-100 bg-white py-16 sm:py-24">
        <Container className="max-w-3xl">
          <h2 className="text-2xl font-extrabold tracking-tight text-ink-950">
            Product Information
          </h2>
          <div className="shadow-soft mt-6 overflow-x-auto rounded-2xl border border-ink-100">
            <table className="w-full min-w-[420px] border-collapse text-sm">
              <tbody>
                {SPEC_ROWS.map((row, index) => (
                  <tr
                    key={row.label}
                    className={index % 2 === 0 ? "bg-white" : "bg-ink-50/60"}
                  >
                    <th
                      scope="row"
                      className="w-1/3 border-b border-ink-100 px-4 py-3 text-left font-semibold text-ink-700"
                    >
                      {row.label}
                    </th>
                    <td className="border-b border-ink-100 px-4 py-3 text-ink-800">
                      {String(product[row.key] ?? "[VERIFY]")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container className="grid max-w-3xl gap-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                <ShieldCheck className="size-5" aria-hidden />
              </span>
              <h2 className="text-xl font-bold text-ink-950">Quality & Product Requirements</h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-600 sm:text-base">
              Product quality and specifications should be confirmed according to the buyer&apos;s
              requirements and the agreed commercial specification.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                <Package className="size-5" aria-hidden />
              </span>
              <h2 className="text-xl font-bold text-ink-950">Export Packaging</h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-600 sm:text-base">
              {product.packaging && !product.packaging.startsWith("[VERIFY")
                ? product.packaging
                : "[VERIFY: PACKAGING OPTIONS] — packaging format should be confirmed for this product."}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                <Ship className="size-5" aria-hidden />
              </span>
              <h2 className="text-xl font-bold text-ink-950">Export & Shipping</h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-600 sm:text-base">
              Potential supported shipping terms include {INCOTERMS.join(", ")}. Availability of
              each term should be confirmed for your specific shipment and destination.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                <Users className="size-5" aria-hidden />
              </span>
              <h2 className="text-xl font-bold text-ink-950">Typical Buyers</h2>
            </div>
            <ul className="mt-3 flex flex-wrap gap-2">
              {BUYER_TYPES.map((type) => (
                <li
                  key={type}
                  className="rounded-full border border-ink-200 bg-ink-50 px-3.5 py-1.5 text-xs font-medium text-ink-700"
                >
                  {type}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {product.relatedArticles.length > 0 && (
        <section className="border-t border-ink-100 bg-ink-50/60 py-16">
          <Container>
            <h2 className="text-xl font-bold text-ink-950">Related Guides</h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-3">
              {product.relatedArticles.map((article) => (
                <li key={article.id}>
                  <Link
                    href={`/blog/${article.slug}`}
                    className="shadow-soft hover:shadow-soft-lg block rounded-2xl border border-ink-100 bg-white p-5 transition-all duration-300 ease-spring hover:-translate-y-1 hover:border-primary-200"
                  >
                    <p className="text-sm font-bold text-ink-950">{article.title}</p>
                    <p className="mt-2 text-xs leading-relaxed text-ink-500">{article.excerpt}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <InlineCta
        message={`Ready to request pricing for ${product.name}?`}
        ctaLabel={`Request a Quote for ${product.name}`}
        ctaHref={`/request-a-quote?product=${encodeURIComponent(product.name)}`}
      />
    </>
  );
}
