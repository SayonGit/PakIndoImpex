"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { clsx } from "clsx";
import { Sparkle, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { QuoteModalTrigger } from "@/components/quote/QuoteModalTrigger";
import { PALM_LEAF_PHOTO } from "@/data/stock-imagery";

type Slide = {
  eyebrow: string;
  title: string;
  copy: string;
  primaryCta: string;
  secondaryCta: string;
};

// Real facility photos, one per slide.
const HERO_PHOTOS = [
  "/images/hero/hero-slide-bg-1.webp",
  "/images/hero/hero-slide-bg-2.webp",
  "/images/hero/hero-slide-bg-3.webp",
];

const SECONDARY_HREFS = ["/#products", "/about", "/#how-we-work"];
const AUTOPLAY_MS = 7000;

export function Hero() {
  const t = useTranslations("home.hero");
  const slides = t.raw("slides") as Slide[];
  const [index, setIndex] = useState(0);
  // Bumped on every slide change so the active image's zoom (keyed off this)
  // restarts each time — including repeat visits to the same slide.
  const [cycle, setCycle] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (next: number) => {
      setIndex(((next % slides.length) + slides.length) % slides.length);
      setCycle((c) => c + 1);
    },
    [slides.length]
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    query.addEventListener("change", handler);
    return () => query.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion) return;
    timerRef.current = setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
      setCycle((c) => c + 1);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, reducedMotion, slides.length]);

  const slide = slides[index];

  return (
    <section
      className="relative flex h-dvh min-h-[640px] items-center overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Highlights"
    >
      {/* Background layer — the "far" plane: slow, heavy crossfade + zoom. */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {HERO_PHOTOS.map((photo, i) => (
          <div
            key={photo}
            className={clsx(
              "absolute inset-0 overflow-hidden transition-all duration-[2600ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]",
              i === index ? "scale-100 opacity-100" : "scale-[1.08] opacity-0"
            )}
          >
            <Image
              key={i === index ? `${photo}-${cycle}` : photo}
              src={photo}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              className={clsx("object-cover", i === index && !reducedMotion && "animate-kenburns")}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/65 via-ink-950/35 to-ink-950/5" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/45 via-transparent to-ink-950/5" />
      </div>

      {/* Mid layer — leaf accents drift at their own pace, independent of both. */}
      <Image
        src={PALM_LEAF_PHOTO}
        alt=""
        width={420}
        height={420}
        className="pointer-events-none absolute -top-16 -right-10 hidden h-48 w-48 rotate-[175deg] transition-transform duration-700 ease-spring sm:block sm:h-64 sm:w-64"
      />
      <Image
        src={PALM_LEAF_PHOTO}
        alt=""
        width={420}
        height={420}
        className="pointer-events-none absolute -bottom-10 -left-12 hidden h-48 w-48 rotate-[95deg] -scale-x-100 transition-transform duration-700 ease-spring sm:block sm:h-64 sm:w-64"
      />

      {/* Foreground layer — the "near" plane: text moves quickly, settling
          well before the background finishes, for a layered depth cue. */}
      <Container className="relative py-24">
        <div
          key={index}
          role="group"
          aria-roledescription="slide"
          aria-label={`${index + 1} of ${slides.length}`}
          className="max-w-2xl"
        >
          <div
            className="animate-slide-fade mb-6 inline-flex items-center gap-2 rounded-full bg-gold-400 px-4 py-2 text-xs font-bold tracking-[0.2em] text-black uppercase"
            style={{ animationDuration: "1s", animationDelay: "0ms" }}
          >
            <Sparkle className="size-3.5" aria-hidden />
            {slide.eyebrow}
          </div>

          <h1
            className="animate-slide-fade max-w-2xl text-4xl leading-[1.05] font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl"
            style={{ animationDuration: "1.1s", animationDelay: "150ms" }}
          >
            {slide.title}
          </h1>

          <p
            className="animate-slide-fade mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg"
            style={{ animationDuration: "1.1s", animationDelay: "300ms" }}
          >
            {slide.copy}
          </p>

          <div
            className="animate-slide-fade mt-9 flex flex-wrap gap-4"
            style={{ animationDuration: "1.1s", animationDelay: "450ms" }}
          >
            <QuoteModalTrigger variant="primary" size="lg" showArrow>
              {slide.primaryCta}
            </QuoteModalTrigger>
            <Button href={SECONDARY_HREFS[index] ?? "/#products"} variant="outlineLight" size="lg">
              {slide.secondaryCta}
            </Button>
          </div>

          <div
            className="animate-fade-in mt-10 flex items-center gap-4"
            style={{ animationDuration: "1s", animationDelay: "600ms" }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            <SlideControls
              index={index}
              count={slides.length}
              paused={paused}
              onPrev={() => goTo(index - 1)}
              onNext={() => goTo(index + 1)}
              onSelect={goTo}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}

function SlideControls({
  index,
  count,
  paused,
  onPrev,
  onNext,
  onSelect,
}: {
  index: number;
  count: number;
  paused: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onPrev}
        aria-label="Previous slide"
        className="glass flex size-9 shrink-0 items-center justify-center rounded-full text-white transition-transform duration-300 ease-spring hover:scale-105"
      >
        <ChevronLeft className="size-4 rtl-flip" aria-hidden />
      </button>
      <div className="flex items-center gap-2">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            className={clsx(
              "relative h-1.5 overflow-hidden rounded-full bg-white/25 transition-all duration-300 ease-spring",
              i === index ? "w-8" : "w-1.5 hover:bg-white/40"
            )}
          >
            {i === index && (
              <span
                key={index}
                className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-gold-400"
                style={{
                  animationName: "slide-progress",
                  animationDuration: `${AUTOPLAY_MS}ms`,
                  animationTimingFunction: "linear",
                  animationFillMode: "forwards",
                  animationPlayState: paused ? "paused" : "running",
                }}
              />
            )}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={onNext}
        aria-label="Next slide"
        className="glass flex size-9 shrink-0 items-center justify-center rounded-full text-white transition-transform duration-300 ease-spring hover:scale-105"
      >
        <ChevronRight className="size-4 rtl-flip" aria-hidden />
      </button>
    </div>
  );
}
