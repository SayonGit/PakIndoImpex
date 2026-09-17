"use client";

import { useState } from "react";
import { GalleryBulkUploader } from "@/components/admin/GalleryBulkUploader";
import { GalleryListClient } from "@/components/admin/GalleryListClient";
import type { GalleryItem } from "@prisma/client";

export function GalleryManager({ initialItems }: { initialItems: GalleryItem[] }) {
  const [items, setItems] = useState(initialItems);

  return (
    <div className="space-y-6">
      <GalleryBulkUploader onUploaded={(item) => setItems((prev) => [...prev, item])} />
      <GalleryListClient items={items} setItems={setItems} />
    </div>
  );
}
