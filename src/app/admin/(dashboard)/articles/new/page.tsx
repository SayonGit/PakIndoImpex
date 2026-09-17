import type { Metadata } from "next";
import { getAllBlogCategoriesForAdmin } from "@/lib/admin-data";
import { ArticleForm } from "@/components/admin/ArticleForm";

export const metadata: Metadata = { title: "New Article | Admin" };

export default async function NewArticlePage() {
  const categories = await getAllBlogCategoriesForAdmin();

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-950">New Article</h1>
      <div className="mt-8">
        <ArticleForm categories={categories} />
      </div>
    </div>
  );
}
