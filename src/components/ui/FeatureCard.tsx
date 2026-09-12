import type { LucideIcon } from "lucide-react";
import { clsx } from "clsx";

type Tone = "primary" | "gold";

const TONE_ICON: Record<Tone, string> = {
  primary:
    "bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-[0_8px_16px_-6px_rgba(18,106,22,0.5)]",
  gold: "bg-gradient-to-br from-gold-300 to-gold-500 text-ink-950 shadow-[0_8px_16px_-6px_rgba(240,173,31,0.5)]",
};

const TONE_BAR: Record<Tone, string> = {
  primary: "bg-primary-500",
  gold: "bg-gold-400",
};

const TONE_BORDER: Record<Tone, string> = {
  primary: "hover:border-primary-200",
  gold: "hover:border-gold-300",
};

export function FeatureCard({
  icon: Icon,
  title,
  copy,
  number,
  tone = "primary",
}: {
  icon: LucideIcon;
  title: string;
  copy: string;
  number?: string;
  tone?: Tone;
}) {
  return (
    <div
      className={clsx(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white p-7 shadow-soft transition-all duration-300 ease-spring hover:-translate-y-1.5 hover:shadow-soft-lg",
        TONE_BORDER[tone]
      )}
    >
      <span
        className={clsx(
          "absolute top-0 left-0 h-1 w-10 rounded-r-full transition-all duration-300 ease-spring group-hover:w-full",
          TONE_BAR[tone]
        )}
      />
      {number && (
        <span
          className="font-heading pointer-events-none absolute -top-2 right-4 text-6xl leading-none font-semibold text-ink-100 select-none"
          aria-hidden
        >
          {number}
        </span>
      )}
      <div
        className={clsx(
          "relative flex size-14 items-center justify-center rounded-2xl transition-transform duration-300 ease-spring group-hover:-translate-y-0.5 group-hover:scale-105 group-hover:rotate-3",
          TONE_ICON[tone]
        )}
      >
        <Icon className="size-6" aria-hidden />
      </div>
      <h3 className="relative mt-5 text-lg font-semibold text-ink-950">{title}</h3>
      <p className="relative mt-2 text-sm leading-relaxed text-ink-600">{copy}</p>
    </div>
  );
}
