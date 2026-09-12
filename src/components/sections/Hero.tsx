"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { clsx } from "clsx";
import { Sparkle, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { QuoteModalTrigger } from "@/components/quote/QuoteModalTrigger";
import { ARECA_NUT_PHOTOS, ARECA_NUT_SPLIT_PHOTO, PALM_LEAF_PHOTO } from "@/data/stock-imagery";

type Slide = {
  eyebrow: string;
  title: string;
  copy: string;
  primaryCta: string;
  secondaryCta: string;
};

const SECONDARY_HREFS = ["/#products", "/about", "/#how-we-work"];
const AUTOPLAY_MS = 7000;

type Nut = {
  photo: string;
  size: number;
  top: string;
  left?: string;
  right?: string;
  duration: number;
  delay: number;
  hideOnMobile?: boolean;
};

const NUTS: Nut[] = [
  { photo: ARECA_NUT_PHOTOS[0], size: 96, top: "8%", left: "3%", duration: 6, delay: 0 },
  { photo: ARECA_NUT_SPLIT_PHOTO, size: 64, top: "68%", left: "9%", duration: 7.5, delay: 0.6, hideOnMobile: true },
  { photo: ARECA_NUT_PHOTOS[2], size: 84, top: "14%", right: "6%", duration: 6.8, delay: 0.3 },
  { photo: ARECA_NUT_SPLIT_PHOTO, size: 56, top: "78%", right: "17%", duration: 5.6, delay: 0.9, hideOnMobile: true },
  { photo: ARECA_NUT_PHOTOS[1], size: 70, top: "42%", right: "2%", duration: 7, delay: 1.2, hideOnMobile: true },
  { photo: ARECA_NUT_PHOTOS[2], size: 60, top: "4%", left: "38%", duration: 6.2, delay: 1.5, hideOnMobile: true },
];

function FloatingNuts({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {NUTS.map((nut, i) => (
        <div
          key={i}
          className={clsx(
            "shadow-soft-lg absolute rounded-full ring-4 ring-white",
            nut.hideOnMobile && "hidden sm:block",
            !reducedMotion && "animate-float"
          )}
          style={{
            width: nut.size,
            height: nut.size,
            top: nut.top,
            left: nut.left,
            right: nut.right,
            animationDuration: `${nut.duration}s`,
            animationDelay: `${nut.delay}s`,
          }}
        >
          <Image
            src={nut.photo}
            alt=""
            fill
            sizes="120px"
            className="rounded-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}

export function Hero() {
  const t = useTranslations("home.hero");
  const slides = t.raw("slides") as Slide[];
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (next: number) => {
      setIndex(((next % slides.length) + slides.length) % slides.length);
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
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, reducedMotion, slides.length]);

  const slide = slides[index];

  return (
    <section
      className="relative flex h-dvh min-h-[640px] items-center overflow-hidden bg-paper"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Highlights"
    >
      <div className="stripe-texture pointer-events-none absolute inset-0" />

      <Image
        src={PALM_LEAF_PHOTO}
        alt=""
        width={420}
        height={420}
        className="pointer-events-none absolute -top-16 -right-10 h-48 w-48 rotate-[175deg] mix-blend-multiply sm:h-64 sm:w-64"
      />
      <Image
        src={PALM_LEAF_PHOTO}
        alt=""
        width={420}
        height={420}
        className="pointer-events-none absolute -bottom-10 -left-12 h-48 w-48 rotate-[95deg] -scale-x-100 mix-blend-multiply sm:h-64 sm:w-64"
      />

      <FloatingNuts reducedMotion={reducedMotion} />

      <Container className="relative grid items-center gap-14 py-24 lg:grid-cols-[1.05fr_0.95fr]">
        <div
          key={index}
          role="group"
          aria-roledescription="slide"
          aria-label={`${index + 1} of ${slides.length}`}
        >
          <div
            className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full bg-gold-400 px-4 py-2 text-xs font-bold tracking-[0.2em] text-black uppercase"
            style={{ animationDelay: "0ms" }}
          >
            <Sparkle className="size-3.5" aria-hidden />
            {slide.eyebrow}
          </div>

          <h1
            className="animate-fade-up max-w-2xl text-4xl leading-[1.05] font-semibold tracking-tight text-primary-800 sm:text-5xl lg:text-6xl"
            style={{ animationDelay: "90ms" }}
          >
            {slide.title}
          </h1>

          <p
            className="animate-fade-up mt-6 max-w-xl text-base leading-relaxed text-ink-600 sm:text-lg"
            style={{ animationDelay: "180ms" }}
          >
            {slide.copy}
          </p>

          <div
            className="animate-fade-up mt-9 flex flex-wrap gap-4"
            style={{ animationDelay: "270ms" }}
          >
            <QuoteModalTrigger variant="primary" size="lg" showArrow>
              {slide.primaryCta}
            </QuoteModalTrigger>
            <Button href={SECONDARY_HREFS[index] ?? "/#products"} variant="outline" size="lg">
              {slide.secondaryCta}
            </Button>
          </div>

          <div
            className="animate-fade-up mt-10 flex items-center gap-4 lg:hidden"
            style={{ animationDelay: "340ms" }}
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

        <div className="hidden lg:block">
          <div className="relative mx-auto aspect-square w-full max-w-lg">
            <span
              className="font-heading pointer-events-none absolute inset-0 flex items-center justify-center text-[16rem] leading-none font-black text-primary-100 select-none"
              aria-hidden
            >
              {index + 1}
            </span>

            <span className="absolute inset-[6%] rounded-full bg-primary-50" aria-hidden />

            <div
              key={index}
              className="animate-fade-in animate-float absolute inset-[9%] overflow-hidden rounded-full shadow-soft-lg ring-8 ring-white"
              style={{ animationDuration: "8s" }}
            >
              <Image
                src={index === 0 ? ARECA_NUT_SPLIT_PHOTO : ARECA_NUT_PHOTOS[index % ARECA_NUT_PHOTOS.length]}
                alt=""
                fill
                sizes="(min-width: 1024px) 36vw, 60vw"
                priority={index === 0}
                className="object-cover"
              />
            </div>

            {index === 0 && (
              <div className="glass-on-light shadow-soft-lg absolute bottom-2 left-0 flex items-center gap-3 rounded-2xl px-4 py-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                  <Sparkle className="size-4" aria-hidden />
                </span>
                <div className="leading-tight">
                  <p className="text-[11px] font-bold tracking-wide text-ink-500 uppercase">Origin</p>
                  <p className="text-sm font-semibold text-ink-900">Indonesia</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-10 flex justify-center">
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
        className="glass-on-light flex size-9 shrink-0 items-center justify-center rounded-full text-ink-900 transition-transform duration-300 ease-spring hover:scale-105"
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
              "relative h-1.5 overflow-hidden rounded-full bg-ink-900/15 transition-all duration-300 ease-spring",
              i === index ? "w-8" : "w-1.5 hover:bg-ink-900/30"
            )}
          >
            {i === index && (
              <span
                key={index}
                className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-primary-600"
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
        className="glass-on-light flex size-9 shrink-0 items-center justify-center rounded-full text-ink-900 transition-transform duration-300 ease-spring hover:scale-105"
      >
        <ChevronRight className="size-4 rtl-flip" aria-hidden />
      </button>
    </div>
  );
}
