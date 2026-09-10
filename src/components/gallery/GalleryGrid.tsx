"use client";

import { useCallback, useEffect, useState } from "react";
import { clsx } from "clsx";
import {
  Search,
  ShieldCheck,
  Package,
  FileText,
  Boxes,
  Ship,
  Leaf,
  Globe2,
  Handshake,
  X,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { placeholderPhoto } from "@/lib/placeholder-images";

type Tone = "primary" | "secondary" | "gold" | "ink";

type Tile = {
  icon: LucideIcon;
  title: string;
  caption: string;
  tone: Tone;
  span?: string;
};

const TONE_BG: Record<Tone, string> = {
  primary: "bg-primary-700",
  secondary: "bg-secondary-600",
  gold: "bg-gold-500",
  ink: "bg-ink-800",
};

const TONE_ICON_WRAP: Record<Tone, string> = {
  primary: "bg-white/15 text-white",
  secondary: "bg-white/15 text-white",
  gold: "bg-ink-950/10 text-ink-950",
  ink: "bg-white/15 text-white",
};

const TONE_TEXT: Record<Tone, string> = {
  primary: "text-white",
  secondary: "text-white",
  gold: "text-ink-950",
  ink: "text-white",
};

const TONE_SCRIM: Record<Tone, string> = {
  primary: "from-primary-950/85 via-primary-900/30",
  secondary: "from-secondary-950/85 via-secondary-900/30",
  gold: "from-gold-900/80 via-gold-800/25",
  ink: "from-ink-950/85 via-ink-900/30",
};

const TILES: Tile[] = [
  {
    icon: Search,
    title: "Sourcing",
    caption: "Reviewing supplier options against buyer requirements and agreed specifications.",
    tone: "primary",
    span: "col-span-2 row-span-2",
  },
  {
    icon: ShieldCheck,
    title: "Quality Coordination",
    caption: "Confirming product quality and grade expectations before shipment.",
    tone: "gold",
  },
  {
    icon: Package,
    title: "Packaging",
    caption: "Preparing packaging according to the agreed export specification.",
    tone: "ink",
  },
  {
    icon: FileText,
    title: "Export Documentation",
    caption: "Coordinating the paperwork required for international shipment.",
    tone: "secondary",
  },
  {
    icon: Boxes,
    title: "Container Loading",
    caption: "Coordinating loading arrangements ahead of shipment.",
    tone: "primary",
    span: "row-span-2",
  },
  {
    icon: Ship,
    title: "International Shipment",
    caption: "Shipment proceeding according to the agreed trade and logistics terms.",
    tone: "gold",
  },
  {
    icon: Leaf,
    title: "Areca Nut",
    caption: "Our featured Indonesian export product.",
    tone: "secondary",
  },
  {
    icon: Globe2,
    title: "Global Reach",
    caption: "Connecting Indonesian products with international buyers.",
    tone: "ink",
  },
  {
    icon: Handshake,
    title: "Trade Partnership",
    caption: "Clear communication from initial inquiry through to delivery.",
    tone: "primary",
  },
];

function TileArt({ tile, className }: { tile: Tile; className?: string }) {
  const Icon = tile.icon;
  return (
    <div
      className={clsx(
        "relative flex h-full flex-col justify-end overflow-hidden p-5",
        TONE_BG[tile.tone],
        TONE_TEXT[tile.tone],
        className
      )}
    >
      <Image
        src={placeholderPhoto(`gallery-${tile.title}`, 700, 700)}
        alt=""
        fill
        sizes="(min-width: 1024px) 33vw, 50vw"
        className="object-cover"
      />
      <div
        className={clsx("pointer-events-none absolute inset-0 bg-gradient-to-t", TONE_SCRIM[tile.tone])}
        aria-hidden
      />
      <span
        className={clsx(
          "relative mb-auto flex size-11 items-center justify-center rounded-xl",
          TONE_ICON_WRAP[tile.tone]
        )}
      >
        <Icon className="size-5" aria-hidden />
      </span>
      <p className="relative text-base font-bold">{tile.title}</p>
    </div>
  );
}

export function GalleryGrid() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const show = useCallback(
    (next: number) => setOpenIndex(((next % TILES.length) + TILES.length) % TILES.length),
    []
  );

  useEffect(() => {
    if (openIndex === null) return;
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") show((openIndex ?? 0) + 1);
      if (event.key === "ArrowLeft") show((openIndex ?? 0) - 1);
    }
    document.addEventListener("keydown", handleKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.documentElement.style.overflow = "";
    };
  }, [openIndex, close, show]);

  const active = openIndex !== null ? TILES[openIndex] : null;

  return (
    <>
      <div className="grid auto-rows-[150px] grid-cols-2 gap-4 sm:auto-rows-[180px] sm:grid-cols-3 lg:auto-rows-[200px]">
        {TILES.map((tile, index) => (
          <button
            key={tile.title}
            type="button"
            onClick={() => show(index)}
            className={clsx(
              "group block h-full w-full overflow-hidden rounded-2xl text-left shadow-soft transition-all duration-300 ease-spring hover:-translate-y-1 hover:shadow-soft-lg",
              tile.span
            )}
          >
            <TileArt
              tile={tile}
              className="transition-transform duration-500 ease-spring group-hover:scale-[1.03]"
            />
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
        >
          <button
            aria-hidden
            tabIndex={-1}
            onClick={close}
            className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm"
          />
          <div className="shadow-soft-lg relative w-full max-w-2xl overflow-hidden rounded-3xl bg-ink-950">
            <div className="relative">
              <TileArt tile={active} className="h-64 sm:h-80" />

              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="glass absolute top-4 right-4 flex size-10 items-center justify-center rounded-full text-white"
              >
                <X className="size-4" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => show((openIndex ?? 0) - 1)}
                aria-label="Previous"
                className="glass absolute top-1/2 left-4 flex size-10 -translate-y-1/2 items-center justify-center rounded-full text-white"
              >
                <ChevronLeft className="size-4 rtl-flip" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => show((openIndex ?? 0) + 1)}
                aria-label="Next"
                className="glass absolute top-1/2 right-4 flex size-10 -translate-y-1/2 items-center justify-center rounded-full text-white"
              >
                <ChevronRight className="size-4 rtl-flip" aria-hidden />
              </button>
            </div>
            <div className="relative p-6 sm:p-8">
              <p className="text-sm leading-relaxed text-ink-200">{active.caption}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
