import { Handshake } from "lucide-react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { QuoteModalTrigger } from "@/components/quote/QuoteModalTrigger";
import { DotGrid } from "@/components/ui/DotGrid";

export function FinalCta() {
  const t = useTranslations("home.finalCta");

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-800 via-primary-700 to-primary-950 py-20 text-white sm:py-24">
      <DotGrid className="pointer-events-none absolute inset-0 h-full w-full text-white/[0.08]" />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-16 -left-10 h-72 w-72 rounded-full bg-gold-400/25 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-10 -bottom-16 h-72 w-72 rounded-full bg-white/15 blur-3xl"
        aria-hidden
      />
      <Container className="relative text-center">
        <span
          className="animate-float mx-auto flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-300 to-gold-500 text-ink-950 shadow-[0_0_32px_-6px_rgba(253,218,126,0.65)]"
          style={{ animationDuration: "6s" }}
        >
          <Handshake className="size-8" strokeWidth={1.75} aria-hidden />
        </span>
        <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
          {t("heading")}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
          {t("copy")}
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <QuoteModalTrigger variant="white" size="lg" showArrow>
            {t("primaryCta")}
          </QuoteModalTrigger>
          <Button href="/contact" variant="outlineLight" size="lg">
            {t("secondaryCta")}
          </Button>
        </div>
      </Container>
    </section>
  );
}
