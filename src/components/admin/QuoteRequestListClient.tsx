"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2, Loader2, Eye } from "lucide-react";
import { SubmissionStatusBadge } from "@/components/admin/SubmissionStatusBadge";
import type { QuoteRequest } from "@prisma/client";

export function QuoteRequestListClient({ initialItems }: { initialItems: QuoteRequest[] }) {
  const [items, setItems] = useState(initialItems);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function remove(id: string) {
    if (!confirm("Delete this quote request? This can't be undone.")) return;
    setBusyId(id);
    await fetch(`/api/admin/submissions/quotes/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((item) => item.id !== id));
    setBusyId(null);
  }

  if (items.length === 0) {
    return (
      <p className="shadow-soft rounded-2xl border border-ink-100 bg-white p-8 text-center text-sm text-ink-500">
        No quote requests yet.
      </p>
    );
  }

  return (
    <div className="shadow-soft divide-y divide-ink-100 overflow-hidden rounded-2xl border border-ink-100 bg-white">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-4 p-4">
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-ink-950">
              {item.name} {item.company && <span className="font-normal text-ink-500">— {item.company}</span>}
            </p>
            <p className="mt-0.5 truncate text-xs text-ink-500">
              {item.email} &middot; {item.destinationCountry} &middot;{" "}
              {item.createdAt.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
            </p>
          </div>

          <SubmissionStatusBadge status={item.status} />

          <div className="flex shrink-0 items-center gap-1.5">
            <Link
              href={`/admin/submissions/quotes/${item.id}`}
              className="flex size-9 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-primary-50 hover:text-primary-700"
            >
              <Eye className="size-4" aria-hidden />
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
