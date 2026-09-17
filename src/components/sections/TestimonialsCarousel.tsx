"use client";

import { useCallback, useEffect, useState } from "react";
import { clsx } from "clsx";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";

type Testimonial = { quote: string; role: string; country: string };

const AUTOPLAY_MS = 6000;

export function TestimonialsCarousel({ items }: { items: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const goTo = useCallback(
    (next: number) => {
      setIndex(((next % items.length) + items.length) % items.length);
    },
    [items.length]
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    query.addEventListener("change", handler);
    return () => query.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion) return;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % items.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paused, reducedMotion, items.length]);

  const active = items[index];

  return (
    <div
      className="relative mx-auto mt-14 max-w-3xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <Quote className="mx-auto size-10 fill-primary-100 text-primary-100" aria-hidden />

      <div key={index} className="animate-fade-up mt-6 text-center">
        <p className="text-xl leading-relaxed font-medium text-ink-900 sm:text-2xl">&ldquo;{active.quote}&rdquo;</p>
        <p className="mt-6 text-sm font-bold tracking-wide text-primary-700 uppercase">
          {active.role} — {active.country}
        </p>
      </div>

      {items.length > 1 && (
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Previous testimonial"
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-ink-200 text-ink-600 transition-all duration-300 ease-spring hover:border-primary-400 hover:text-primary-700"
          >
            <ChevronLeft className="size-4 rtl-flip" aria-hidden />
          </button>

          <div className="flex items-center gap-2">
            {items.map((item, i) => (
              <button
                key={item.quote}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                aria-current={i === index}
                className={clsx(
                  "h-2 rounded-full transition-all duration-300 ease-spring",
                  i === index ? "w-8 bg-primary-600" : "w-2 bg-ink-200 hover:bg-ink-300"
                )}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Next testimonial"
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-ink-200 text-ink-600 transition-all duration-300 ease-spring hover:border-primary-400 hover:text-primary-700"
          >
            <ChevronRight className="size-4 rtl-flip" aria-hidden />
          </button>
        </div>
      )}
    </div>
  );
}
