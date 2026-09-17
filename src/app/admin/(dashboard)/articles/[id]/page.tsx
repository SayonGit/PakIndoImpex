import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticleForAdmin, getAllBlogCategoriesForAdmin } from "@/lib/admin-data";
import { ArticleForm } from "@/components/admin/ArticleForm";

export const metadata: Metadata = { title: "Edit Article | Admin" };

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [article, categories] = await Promise.all([getArticleForAdmin(id), getAllBlogCategoriesForAdmin()]);
  if (!article) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-950">Edit Article</h1>
      <div className="mt-8">
        <ArticleForm initial={article} categories={categories} />
      </div>
    </div>
  );
}
