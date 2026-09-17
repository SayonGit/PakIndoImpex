"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SeoEditRow } from "@/components/admin/SeoEditRow";
import type { PageSeo, Article } from "@prisma/client";

export const STATIC_PAGES = [
  {
    path: "/",
    label: "Home",
    defaultTitle: "PT. Pakindo Impex Perkasa | Indonesian Export & Import Partner",
    defaultDescription:
      "PT. Pakindo Impex Perkasa connects international buyers with Indonesian products through sourcing, quality coordination, export documentation, and logistics support.",
  },
  {
    path: "/about",
    label: "About",
    defaultTitle: "About PT. Pakindo Impex Perkasa | Indonesian Trading Partner",
    defaultDescription:
      "Learn about PT. Pakindo Impex Perkasa and our approach to Indonesian product sourcing, export/import trading, documentation, and international buyer support.",
  },
  {
    path: "/gallery",
    label: "Gallery",
    defaultTitle: "Gallery | PT. Pakindo Impex Perkasa",
    defaultDescription:
      "A visual look at how PT. Pakindo Impex Perkasa approaches sourcing, quality coordination, packaging, documentation, and export logistics.",
  },
  {
    path: "/contact",
    label: "Contact",
    defaultTitle: "Contact PT. Pakindo Impex Perkasa",
    defaultDescription:
      "Contact PT. Pakindo Impex Perkasa for Indonesian product sourcing, export, import, and international trade inquiries.",
  },
  {
    path: "/blog",
    label: "Blog",
    defaultTitle: "Export & Sourcing Guides | PT. Pakindo Impex Perkasa",
    defaultDescription:
      "Guides for international buyers researching Indonesian suppliers, export documentation, shipping terms, and the import process.",
  },
];

export function SeoManager({
  pageSeoRows,
  articles,
}: {
  pageSeoRows: PageSeo[];
  articles: Article[];
}) {
  const pageSeoByPath = new Map(pageSeoRows.map((row) => [row.path, row]));

  async function savePage(path: string, seoTitle: string, seoDescription: string) {
    const response = await fetch("/api/admin/seo/pages", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path, seoTitle, seoDescription }),
    });
    const result = await response.json();
    return response.ok ? { ok: true } : { ok: false, error: result.error };
  }

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-sm font-bold tracking-wide text-ink-500 uppercase">Pages</h2>
        <div className="mt-4 space-y-4">
          {STATIC_PAGES.map((page) => {
            const existing = pageSeoByPath.get(page.path);
            return (
              <SeoEditRow
                key={page.path}
                label={page.label}
                sublabel={page.path}
                initialTitle={existing?.seoTitle ?? page.defaultTitle}
                initialDescription={existing?.seoDescription ?? page.defaultDescription}
                onSave={(seoTitle, seoDescription) => savePage(page.path, seoTitle, seoDescription)}
              />
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold tracking-wide text-ink-500 uppercase">Blog Articles</h2>
        <p className="mt-1 text-xs text-ink-500">Edited from within each article — open one to change its SEO title/description.</p>
        <div className="shadow-soft mt-4 divide-y divide-ink-100 overflow-hidden rounded-2xl border border-ink-100 bg-white">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/admin/articles/${article.id}`}
              className="group flex items-center justify-between gap-4 p-4 transition-colors hover:bg-primary-50/40"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold text-ink-950">{article.title}</p>
                <p className="truncate text-xs text-ink-500">/blog/{article.slug}</p>
              </div>
              <ArrowRight className="size-4 shrink-0 text-ink-400 transition-colors group-hover:text-primary-700" aria-hidden />
            </Link>
          ))}
          {articles.length === 0 && <p className="p-4 text-sm text-ink-500">No articles yet.</p>}
        </div>
      </section>
    </div>
  );
}
