import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Tag } from "lucide-react";
import { getAllArticlesForAdmin } from "@/lib/admin-data";
import { ArticleListClient } from "@/components/admin/ArticleListClient";

export const metadata: Metadata = { title: "Blog Articles | Admin" };

export default async function AdminArticlesPage() {
  const items = await getAllArticlesForAdmin();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-950">Blog Articles</h1>
          <p className="mt-1 text-sm text-ink-500">Guides shown on the public Blog page.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/articles/categories"
            className="flex items-center gap-1.5 rounded-full border border-ink-200 px-4 py-2.5 text-sm font-semibold text-ink-700 transition-all duration-200 ease-spring hover:border-primary-300 hover:text-primary-700"
          >
            <Tag className="size-4" aria-hidden />
            Manage Categories
          </Link>
          <Link
            href="/admin/articles/new"
            className="flex items-center gap-1.5 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-all duration-200 ease-spring hover:-translate-y-0.5"
          >
            <Plus className="size-4" aria-hidden />
            New Article
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <ArticleListClient initialItems={items} />
      </div>
    </div>
  );
}
