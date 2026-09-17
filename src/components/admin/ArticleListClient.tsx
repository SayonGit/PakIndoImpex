"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Loader2, FileText } from "lucide-react";
import type { Article } from "@prisma/client";

export function ArticleListClient({ initialItems }: { initialItems: Article[] }) {
  const [items, setItems] = useState(initialItems);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function remove(id: string) {
    if (!confirm("Delete this article? This can't be undone.")) return;
    setBusyId(id);
    await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((item) => item.id !== id));
    setBusyId(null);
  }

  if (items.length === 0) {
    return (
      <p className="shadow-soft rounded-2xl border border-ink-100 bg-white p-8 text-center text-sm text-ink-500">
        No articles yet.
      </p>
    );
  }

  return (
    <div className="shadow-soft divide-y divide-ink-100 overflow-hidden rounded-2xl border border-ink-100 bg-white">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-4 p-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
            <FileText className="size-4" aria-hidden />
          </span>

          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-ink-950">{item.title}</p>
            <p className="mt-0.5 text-xs text-ink-500">
              {item.category} &middot; {item.publishDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
            </p>
          </div>

          <span
            className={
              item.published
                ? "shrink-0 rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700"
                : "shrink-0 rounded-full bg-ink-100 px-2.5 py-1 text-xs font-semibold text-ink-500"
            }
          >
            {item.published ? "Published" : "Draft"}
          </span>

          <div className="flex shrink-0 items-center gap-1.5">
            <Link
              href={`/admin/articles/${item.id}`}
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
