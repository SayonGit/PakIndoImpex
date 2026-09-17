"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUp, ArrowDown, Pencil, Trash2, Loader2, Quote } from "lucide-react";
import type { Testimonial } from "@prisma/client";

export function TestimonialListClient({ initialItems }: { initialItems: Testimonial[] }) {
  const [items, setItems] = useState(initialItems);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function move(id: string, direction: "up" | "down") {
    setBusyId(id);
    await fetch(`/api/admin/testimonials/${id}/move`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ direction }),
    });
    const response = await fetch("/api/admin/testimonials");
    const result = await response.json();
    setItems(result.items ?? []);
    setBusyId(null);
  }

  async function remove(id: string) {
    if (!confirm("Delete this testimonial? This can't be undone.")) return;
    setBusyId(id);
    await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((item) => item.id !== id));
    setBusyId(null);
  }

  if (items.length === 0) {
    return (
      <p className="shadow-soft rounded-2xl border border-ink-100 bg-white p-8 text-center text-sm text-ink-500">
        No testimonials yet.
      </p>
    );
  }

  return (
    <div className="shadow-soft divide-y divide-ink-100 overflow-hidden rounded-2xl border border-ink-100 bg-white">
      {items.map((item, index) => (
        <div key={item.id} className="flex items-start gap-4 p-4">
          <div className="flex flex-col gap-0.5 pt-1">
            <button
              type="button"
              disabled={busyId === item.id || index === 0}
              onClick={() => move(item.id, "up")}
              aria-label="Move up"
              className="rounded p-1 text-ink-400 transition-colors hover:text-primary-700 disabled:opacity-30"
            >
              <ArrowUp className="size-3.5" aria-hidden />
            </button>
            <button
              type="button"
              disabled={busyId === item.id || index === items.length - 1}
              onClick={() => move(item.id, "down")}
              aria-label="Move down"
              className="rounded p-1 text-ink-400 transition-colors hover:text-primary-700 disabled:opacity-30"
            >
              <ArrowDown className="size-3.5" aria-hidden />
            </button>
          </div>

          <span className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700">
            <Quote className="size-4" aria-hidden />
          </span>

          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 text-sm text-ink-800">&ldquo;{item.quote}&rdquo;</p>
            <p className="mt-1 text-xs font-bold tracking-wide text-primary-700 uppercase">
              {item.role} — {item.country}
            </p>
          </div>

          {!item.published && (
            <span className="mt-1 shrink-0 rounded-full bg-ink-100 px-2.5 py-1 text-xs font-semibold text-ink-500">
              Hidden
            </span>
          )}

          <div className="flex shrink-0 items-center gap-1.5">
            <Link
              href={`/admin/testimonials/${item.id}`}
              className="flex size-9 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-primary-50 hover:text-primary-700"
            >
              <Pencil className="size-4" aria-hidden />
            </Link>
            <button
              type="button"
              onClick={() => remove(item.id)}
              disabled={busyId === item.id}
              aria-label="Delete"
              className="flex size-9 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-secondary-50 hover:text-secondary-700 disabled:opacity-50"
            >
              {busyId === item.id ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <Trash2 className="size-4" aria-hidden />
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
