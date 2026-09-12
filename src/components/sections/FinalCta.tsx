import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { QuoteModalTrigger } from "@/components/quote/QuoteModalTrigger";
import { DotGrid } from "@/components/ui/DotGrid";

export function FinalCta() {
  const t = useTranslations("home.finalCta");

  return (
    <section className="relative overflow-hidden bg-secondary-600 py-20 text-white sm:py-24">
      <DotGrid className="pointer-events-none absolute inset-0 h-full w-full text-white/10" />
      <div
        className="pointer-events-none absolute -top-16 -left-10 h-72 w-72 rounded-full bg-gold-400/25 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-10 -bottom-16 h-72 w-72 rounded-full bg-white/15 blur-3xl"
        aria-hidden
      />
      <Container className="relative text-center">
        <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
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
