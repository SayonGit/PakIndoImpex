"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import { Loader2, Trash2 } from "lucide-react";
import type { InquiryStatus } from "@prisma/client";

const STATUSES: InquiryStatus[] = ["NEW", "REVIEWED", "ARCHIVED"];

export function SubmissionDetailActions({
  kind,
  id,
  status,
}: {
  kind: "quotes" | "contact";
  id: string;
  status: InquiryStatus;
}) {
  const router = useRouter();
  const [current, setCurrent] = useState(status);
  const [busy, setBusy] = useState(false);

  async function setStatus(next: InquiryStatus) {
    setBusy(true);
    const response = await fetch(`/api/admin/submissions/${kind}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    if (response.ok) setCurrent(next);
    setBusy(false);
  }

  async function remove() {
    if (!confirm("Delete this submission? This can't be undone.")) return;
    setBusy(true);
    await fetch(`/api/admin/submissions/${kind}/${id}`, { method: "DELETE" });
    router.push(`/admin/submissions/${kind}`);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1.5 rounded-full border border-ink-200 bg-white p-1">
        {STATUSES.map((option) => (
          <button
            key={option}
            type="button"
            disabled={busy}
            onClick={() => setStatus(option)}
            className={clsx(
              "rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition-colors duration-150 disabled:opacity-60",
              current === option ? "bg-primary-600 text-white" : "text-ink-500 hover:bg-primary-50 hover:text-primary-700"
            )}
          >
            {option.toLowerCase()}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={remove}
        disabled={busy}
        className="flex items-center gap-1.5 rounded-full border border-ink-200 px-3.5 py-1.5 text-sm font-semibold text-ink-700 transition-all duration-200 ease-spring hover:border-secondary-300 hover:text-secondary-700 disabled:opacity-60"
      >
        {busy ? <Loader2 className="size-3.5 animate-spin" aria-hidden /> : <Trash2 className="size-3.5" aria-hidden />}
        Delete
      </button>
    </div>
  );
}
