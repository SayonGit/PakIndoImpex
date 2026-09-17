import type { Metadata } from "next";
import { getAllBlogCategoriesForAdmin } from "@/lib/admin-data";
import { BlogCategoryManager } from "@/components/admin/BlogCategoryManager";

export const metadata: Metadata = { title: "Blog Categories | Admin" };

export default async function BlogCategoriesPage() {
  const items = await getAllBlogCategoriesForAdmin();

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-950">Blog Categories</h1>
      <p className="mt-1 text-sm text-ink-500">Offered in the category dropdown when writing an article.</p>
      <div className="mt-8">
        <BlogCategoryManager initialItems={items} />
      </div>
    </div>
  );
}
