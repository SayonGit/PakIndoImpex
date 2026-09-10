import Image from "next/image";
import { BRANDS } from "@/data/brands";
import { Container } from "@/components/ui/Container";

/**
 * Infinite auto-scrolling row of partner/client logos. Pure CSS marquee
 * (duplicated list + keyframe translate), pauses on hover/focus, and falls
 * back to a manually-scrollable row under prefers-reduced-motion.
 * Renders nothing until BRANDS is populated with verified logos.
 */
export function BrandScroller({ heading = "Brands We Support" }: { heading?: string }) {
  if (BRANDS.length === 0) return null;

  const track = [...BRANDS, ...BRANDS];

  return (
    <section className="border-y border-ink-100 bg-white py-14">
      <Container>
        <p className="text-center text-xs font-bold tracking-[0.2em] text-ink-500 uppercase">
          {heading}
        </p>
      </Container>
      <div className="mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="marquee-track flex w-max items-center gap-16">
          {track.map((brand, index) => (
            <div
              key={`${brand.name}-${index}`}
              className="flex h-12 w-32 shrink-0 items-center justify-center grayscale transition-all duration-300 hover:grayscale-0"
            >
              <Image
                src={brand.logoSrc}
                alt={brand.name}
                width={128}
                height={48}
                className="h-full w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
