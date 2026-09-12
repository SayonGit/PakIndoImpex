import type { LucideIcon } from "lucide-react";

export function ProcessStep({
  number,
  title,
  copy,
  icon: Icon,
}: {
  number: string;
  title: string;
  copy: string;
  icon: LucideIcon;
}) {
  return (
    <div className="btn-sheen group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-primary-600 to-primary-800 p-7 text-white shadow-soft-lg transition-all duration-300 ease-spring hover:-translate-y-1.5 hover:border-white/30 hover:from-primary-500 hover:to-primary-700 hover:shadow-[0_28px_56px_-20px_rgba(4,30,6,0.5)]">
      <span
        className="font-heading pointer-events-none absolute -top-2 right-4 text-6xl leading-none font-black text-white/10 select-none"
        aria-hidden
      >
        {number}
      </span>
      <span className="absolute top-0 left-0 h-1 w-10 rounded-r-full bg-gold-400 transition-all duration-300 ease-spring group-hover:w-full" />
      <span className="relative flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-300 to-gold-500 text-ink-950 shadow-[0_8px_16px_-6px_rgba(240,173,31,0.5)] transition-transform duration-300 ease-spring group-hover:-translate-y-0.5 group-hover:scale-105 group-hover:rotate-3">
        <Icon className="size-6" aria-hidden />
      </span>
      <h3 className="relative mt-5 text-lg font-bold text-white">{title}</h3>
      <p className="relative mt-2 text-sm leading-relaxed text-primary-100">{copy}</p>
    </div>
  );
}
