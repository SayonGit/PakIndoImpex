"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react";
import type { GalleryItem } from "@prisma/client";

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const show = useCallback(
    (next: number) => setOpenIndex(((next % items.length) + items.length) % items.length),
    [items.length]
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

  if (items.length === 0) {
    return <p className="text-center text-ink-500">Photos and videos are on the way — check back soon.</p>;
  }

  const active = openIndex !== null ? items[openIndex] : null;

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => show(index)}
            className="group shadow-soft relative aspect-square overflow-hidden rounded-2xl bg-ink-900 transition-all duration-300 ease-spring hover:-translate-y-1 hover:shadow-soft-lg"
          >
            {item.mediaType === "VIDEO" ? (
              <>
                <video
                  src={item.url}
                  muted
                  loop
                  playsInline
                  autoPlay
                  className="size-full object-cover transition-transform duration-500 ease-spring group-hover:scale-105"
                />
                <span className="glass pointer-events-none absolute top-3 right-3 flex size-8 items-center justify-center rounded-full text-white">
                  <Play className="size-3.5" aria-hidden />
                </span>
              </>
            ) : (
              <Image
                src={item.url}
                alt={item.altText}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover transition-transform duration-500 ease-spring group-hover:scale-105"
              />
            )}
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={active.altText}
        >
          <button aria-hidden tabIndex={-1} onClick={close} className="absolute inset-0 bg-ink-950/85 backdrop-blur-sm" />

          <div className="shadow-soft-lg relative flex max-h-full w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-ink-950">
            <div className="relative aspect-video w-full">
              {active.mediaType === "VIDEO" ? (
                <video src={active.url} controls autoPlay className="size-full object-contain" />
              ) : (
                <Image src={active.url} alt={active.altText} fill sizes="768px" className="object-contain" />
              )}
            </div>

            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="glass absolute top-4 right-4 flex size-10 items-center justify-center rounded-full text-white"
            >
              <X className="size-4" aria-hidden />
            </button>
            {items.length > 1 && (
              <>
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
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
