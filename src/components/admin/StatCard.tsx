import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "neutral",
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  tone?: "neutral" | "highlight";
}) {
  return (
    <div className="shadow-soft flex items-center gap-4 rounded-2xl border border-ink-100 bg-white p-5">
      <span
        className={
          tone === "highlight"
            ? "flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gold-300 to-gold-500 text-ink-950"
            : "flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700"
        }
      >
        <Icon className="size-5" aria-hidden />
      </span>
      <div>
        <p className="text-2xl font-bold text-ink-950">{value}</p>
        <p className="text-xs font-medium text-ink-500">{label}</p>
      </div>
    </div>
  );
}
