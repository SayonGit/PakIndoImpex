"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Globe2, Package, Workflow, Languages as LanguagesIcon, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

type Stat = { value: number; label: string };

const ICONS: LucideIcon[] = [Globe2, Package, Workflow, LanguagesIcon];
const DURATION_MS = 1400;

function StatCounter({ value, label, icon: Icon }: Stat & { icon: LucideIcon }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reducedMotion =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;

        if (reducedMotion) {
          setDisplay(value);
          observer.disconnect();
          return;
        }

        const start = performance.now();
        function tick(now: number) {
          const progress = Math.min((now - start) / DURATION_MS, 1);
          const eased = 1 - (1 - progress) ** 3;
          setDisplay(Math.round(eased * value));
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="group flex flex-col items-center px-6 py-4 text-center">
      <span
        className="animate-float flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-300 to-gold-500 text-ink-950 shadow-[0_0_32px_-6px_rgba(253,218,126,0.65)] transition-transform duration-300 ease-spring group-hover:scale-110"
        style={{ animationDuration: "6s" }}
      >
        <Icon className="size-8" strokeWidth={1.75} aria-hidden />
      </span>

      <p className="font-heading drop-shadow-[0_0_24px_rgba(253,218,126,0.35)] mt-5 flex items-baseline bg-gradient-to-b from-gold-200 to-gold-500 bg-clip-text text-6xl leading-none font-semibold text-transparent tabular-nums sm:text-7xl">
        {display}
        <span className="ml-0.5 text-4xl sm:text-5xl">+</span>
      </p>

      <p className="mt-4 text-sm font-semibold tracking-[0.15em] text-white/90 uppercase sm:text-base">
        {label}
      </p>
    </div>
  );
}

export function AchievementCounter() {
  const t = useTranslations("home.achievements");
  const items = t.raw("items") as Stat[];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-800 via-primary-700 to-primary-950 py-12 sm:py-12">
      <div className="glow-mesh" />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent"
        aria-hidden
      />

      <Container className="relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-white/15">
          {items.map((item, index) => (
            <Reveal key={item.label} delay={index * 100}>
              <StatCounter value={item.value} label={item.label} icon={ICONS[index]} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
