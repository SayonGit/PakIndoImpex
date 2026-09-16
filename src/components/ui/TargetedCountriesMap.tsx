"use client";

import dynamic from "next/dynamic";
import { Check } from "lucide-react";

// Leaflet touches `window` at module-import time, which crashes during
// server rendering — ssr:false defers the import entirely to the client.
// (This dynamic() call must live in a "use client" file: Next.js disallows
// ssr:false inside a Server Component.)
const TargetedCountriesMapInner = dynamic(
  () => import("./TargetedCountriesMapInner").then((mod) => mod.TargetedCountriesMapInner),
  {
    ssr: false,
    loading: () => (
      <div className="h-[820px] w-full animate-pulse rounded-3xl bg-slate-900/60 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.55)]" />
    ),
  }
);

export function TargetedCountriesMap({
  highlights,
  whatsappCta,
  whatsappHref,
}: {
  highlights: string[];
  whatsappCta: string;
  whatsappHref: string;
}) {
  return (
    <div className="relative">
      <TargetedCountriesMapInner />

      {/* Static overlay, kept outside the dynamically-loaded map so it
          renders immediately instead of waiting on the Leaflet chunk.
          A flatter, more opaque tint (tried earlier) reads as a dark card,
          not glass — the blur only looks "glassy" once enough of the map
          shows through, so this leans on a lighter, gradient-tinted fill
          plus a stronger blur/saturate and a lit top-left corner instead. */}
      <aside className="pointer-events-none absolute bottom-4 left-4 z-20 w-72 max-w-[calc(100%-2rem)] rounded-2xl bg-gradient-to-br from-white/15 via-slate-950/45 to-slate-950/70 p-4 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6)] backdrop-blur-2xl backdrop-saturate-150 sm:w-80">
        <ul className="flex flex-col gap-2">
          {highlights.map((line) => (
            <li
              key={line}
              className="flex items-start gap-2 text-xs font-semibold text-emerald-200 [text-shadow:0_1px_3px_rgba(0,0,0,0.65)] sm:text-sm"
            >
              <Check className="mt-0.5 size-4 shrink-0 text-emerald-400 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]" aria-hidden />
              {line}
            </li>
          ))}
        </ul>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto mt-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-gold-300 to-gold-500 px-3 py-1.5 text-xs font-bold text-ink-950 shadow-sm transition-all duration-200 ease-spring hover:-translate-y-0.5 hover:from-gold-400 hover:to-gold-600 hover:shadow-md"
        >
          {whatsappCta}
        </a>
      </aside>
    </div>
  );
}
