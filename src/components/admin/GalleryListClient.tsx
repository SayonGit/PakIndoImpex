"use client";

import { useState } from "react";
import { ArrowUp, ArrowDown, Trash2, Loader2, Check, Video } from "lucide-react";
import type { GalleryItem } from "@prisma/client";

function ThumbnailPreview({ item }: { item: GalleryItem }) {
  if (item.mediaType === "VIDEO") {
    return (
      <div className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-ink-900 text-white">
        <video src={item.url} muted className="size-full object-cover opacity-70" />
        <Video className="absolute size-5" aria-hidden />
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element -- arbitrary admin-uploaded sizes; a plain thumbnail doesn't need next/image optimization
  return <img src={item.url} alt="" className="size-14 shrink-0 rounded-xl object-cover" />;
}

function GalleryRow({
  item,
  index,
  total,
  busy,
  onMove,
  onDelete,
  onSaveAltText,
}: {
  item: GalleryItem;
  index: number;
  total: number;
  busy: boolean;
  onMove: (id: string, direction: "up" | "down") => void;
  onDelete: (id: string) => void;
  onSaveAltText: (id: string, altText: string) => Promise<void>;
}) {
  const [altText, setAltText] = useState(item.altText);
  const [saved, setSaved] = useState(false);
  const dirty = altText !== item.altText;

  async function handleSave() {
    await onSaveAltText(item.id, altText);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div className="flex items-center gap-4 p-4">
      <div className="flex flex-col gap-0.5">
        <button
          type="button"
          disabled={busy || index === 0}
          onClick={() => onMove(item.id, "up")}
          aria-label="Move up"
          className="rounded p-1 text-ink-400 transition-colors hover:text-primary-700 disabled:opacity-30"
        >
          <ArrowUp className="size-3.5" aria-hidden />
        </button>
        <button
          type="button"
          disabled={busy || index === total - 1}
          onClick={() => onMove(item.id, "down")}
          aria-label="Move down"
          className="rounded p-1 text-ink-400 transition-colors hover:text-primary-700 disabled:opacity-30"
        >
          <ArrowDown className="size-3.5" aria-hidden />
        </button>
      </div>

      <ThumbnailPreview item={item} />

      <div className="flex min-w-0 flex-1 items-center gap-2">
        <input
          value={altText}
          onChange={(event) => setAltText(event.target.value)}
          className="w-full rounded-lg border border-ink-200 bg-white px-3 py-1.5 text-sm text-ink-900 transition-all duration-150 focus:border-primary-600 focus:outline-none focus:ring-4 focus:ring-primary-100"
          aria-label="Alt text"
        />
        {dirty && (
          <button
            type="button"
            onClick={handleSave}
            className="shrink-0 rounded-full bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-700"
          >
            Save
          </button>
        )}
        {saved && <Check className="size-4 shrink-0 text-primary-600" aria-hidden />}
      </div>

      <button
        type="button"
        onClick={() => onDelete(item.id)}
        disabled={busy}
        aria-label="Delete"
        className="flex size-9 shrink-0 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-secondary-50 hover:text-secondary-700 disabled:opacity-50"
      >
        {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Trash2 className="size-4" aria-hidden />}
      </button>
    </div>
  );
}

export function GalleryListClient({ items, setItems }: { items: GalleryItem[]; setItems: (items: GalleryItem[]) => void }) {
  const [busyId, setBusyId] = useState<string | null>(null);

  async function move(id: string, direction: "up" | "down") {
    setBusyId(id);
    await fetch(`/api/admin/gallery/${id}/move`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ direction }),
    });
    const response = await fetch("/api/admin/gallery");
    const result = await response.json();
    setItems(result.items ?? []);
    setBusyId(null);
  }

  async function remove(id: string) {
    if (!confirm("Delete this item? This can't be undone.")) return;
    setBusyId(id);
    await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    setItems(items.filter((item) => item.id !== id));
    setBusyId(null);
  }

  async function saveAltText(id: string, altText: string) {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    await fetch(`/api/admin/gallery/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mediaType: item.mediaType, url: item.url, altText, published: item.published }),
    });
    setItems(items.map((i) => (i.id === id ? { ...i, altText } : i)));
  }

  if (items.length === 0) {
    return (
      <p className="shadow-soft rounded-2xl border border-ink-100 bg-white p-8 text-center text-sm text-ink-500">
        No photos or videos yet — drag some in above.
      </p>
    );
  }

  return (
    <div className="shadow-soft divide-y divide-ink-100 overflow-hidden rounded-2xl border border-ink-100 bg-white">
      {items.map((item, index) => (
        <GalleryRow
          key={item.id}
          item={item}
          index={index}
          total={items.length}
          busy={busyId === item.id}
          onMove={move}
          onDelete={remove}
          onSaveAltText={saveAltText}
        />
      ))}
    </div>
  );
}
