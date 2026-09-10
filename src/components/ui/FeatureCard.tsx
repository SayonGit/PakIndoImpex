import type { LucideIcon } from "lucide-react";

export function FeatureCard({
  icon: Icon,
  title,
  copy,
}: {
  icon: LucideIcon;
  title: string;
  copy: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-ink-100 bg-white p-7 shadow-soft transition-all duration-300 ease-spring hover:-translate-y-1 hover:border-primary-200 hover:shadow-soft-lg">
      <span className="absolute top-0 left-0 h-1 w-10 rounded-r-full bg-gold-400 transition-all duration-300 ease-spring group-hover:w-full" />
      <div className="flex size-12 items-center justify-center rounded-xl bg-primary-50 text-primary-700 transition-transform duration-300 ease-spring group-hover:-translate-y-0.5 group-hover:scale-105">
        <Icon className="size-6" aria-hidden />
      </div>
      <h3 className="mt-5 text-lg font-bold text-ink-950">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-600">{copy}</p>
    </div>
  );
}
