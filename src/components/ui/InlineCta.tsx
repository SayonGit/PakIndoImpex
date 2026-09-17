import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { QuoteModalTrigger } from "@/components/quote/QuoteModalTrigger";
import { DotGrid } from "@/components/ui/DotGrid";

/** Slim banner CTA used to close out interior pages (About, Export Process, FAQ, ...). */
export function InlineCta({
  message,
  ctaLabel,
  ctaHref,
}: {
  message: string;
  ctaLabel: string;
  /** Omit to open the Request a Quote modal instead of navigating to a page. */
  ctaHref?: string;
}) {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="shadow-soft-lg relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-3xl bg-ink-950 px-6 py-10 text-white sm:flex-row sm:items-center sm:px-10">
          <DotGrid id="dot-grid-inline-cta" className="pointer-events-none absolute inset-0 h-full w-full text-white/[0.05]" />
          <div className="glow-mesh" />
          <p className="relative max-w-xl text-lg font-semibold sm:text-xl">{message}</p>
          {ctaHref ? (
            <Button href={ctaHref} variant="gold" showArrow className="relative shrink-0">
              {ctaLabel}
            </Button>
          ) : (
            <QuoteModalTrigger variant="gold" showArrow className="relative shrink-0">
              {ctaLabel}
            </QuoteModalTrigger>
          )}
        </div>
      </Container>
    </section>
  );
}
