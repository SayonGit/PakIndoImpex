import type { ReactNode } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { DotGrid } from "@/components/ui/DotGrid";
import { placeholderPhoto } from "@/lib/placeholder-images";

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-ink-950 py-16 text-white sm:py-20">
      <Image
        src={placeholderPhoto(`page-${title}`, 1600, 700)}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-950/55" />
      <DotGrid className="pointer-events-none absolute inset-0 h-full w-full text-white/[0.05]" />
      <div className="glow-mesh" />
      <Container className="relative">
        {eyebrow && (
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-gold-400 px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-black uppercase">
            {eyebrow}
          </p>
        )}
        <h1 className="max-w-3xl text-3xl leading-[1.1] font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-200 sm:text-lg">
            {description}
          </p>
        )}
      </Container>
    </section>
  );
}
