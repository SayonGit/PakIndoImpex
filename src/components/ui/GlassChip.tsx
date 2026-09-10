import type { LucideIcon } from "lucide-react";

/** Small frosted-glass label chip used as decorative hero/section art. */
export function GlassChip({
  icon: Icon,
  label,
  className,
}: {
  icon: LucideIcon;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`glass shadow-soft inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white ${className ?? ""}`}
    >
      <Icon className="size-4 text-gold-300" aria-hidden />
      {label}
    </div>
  );
}
