import type { Metadata } from "next";
import { getAllGalleryItemsForAdmin } from "@/lib/admin-data";
import { GalleryManager } from "@/components/admin/GalleryManager";

export const metadata: Metadata = { title: "Gallery | Admin" };

export default async function AdminGalleryPage() {
  const items = await getAllGalleryItemsForAdmin();

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-950">Gallery</h1>
      <p className="mt-1 text-sm text-ink-500">Photos and videos shown on the public Gallery page.</p>

      <div className="mt-6">
        <GalleryManager initialItems={items} />
      </div>
    </div>
  );
}
