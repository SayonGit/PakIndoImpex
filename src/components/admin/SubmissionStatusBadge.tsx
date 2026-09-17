import { clsx } from "clsx";
import type { InquiryStatus } from "@prisma/client";

const STATUS_STYLES: Record<InquiryStatus, string> = {
  NEW: "bg-primary-50 text-primary-700",
  REVIEWED: "bg-gold-50 text-gold-800",
  ARCHIVED: "bg-ink-100 text-ink-500",
};

const STATUS_LABELS: Record<InquiryStatus, string> = {
  NEW: "New",
  REVIEWED: "Reviewed",
  ARCHIVED: "Archived",
};

export function SubmissionStatusBadge({ status }: { status: InquiryStatus }) {
  return (
    <span className={clsx("shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold", STATUS_STYLES[status])}>
      {STATUS_LABELS[status]}
    </span>
  );
}
