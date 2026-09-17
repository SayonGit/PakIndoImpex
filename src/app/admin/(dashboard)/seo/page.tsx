import type { Metadata } from "next";
import { getAllPageSeoForAdmin, getAllArticlesForAdmin } from "@/lib/admin-data";
import { SeoManager } from "@/components/admin/SeoManager";

export const metadata: Metadata = { title: "SEO | Admin" };

export default async function AdminSeoPage() {
  const [pageSeoRows, articles] = await Promise.all([getAllPageSeoForAdmin(), getAllArticlesForAdmin()]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-950">SEO</h1>
      <p className="mt-1 text-sm text-ink-500">Meta title and description shown in search results for each page.</p>
      <div className="mt-8">
        <SeoManager pageSeoRows={pageSeoRows} articles={articles} />
      </div>
    </div>
  );
}
