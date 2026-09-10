import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { RouteMotif } from "@/components/ui/RouteMotif";
import { Reveal } from "@/components/ui/Reveal";

export function MarketsSection() {
  const t = useTranslations("home.markets");

  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-28">
      <Container className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal className="order-2 lg:order-1">
          <div className="shadow-soft relative overflow-hidden rounded-3xl border border-ink-100 bg-ink-50/60 p-8">
            <div
              className="pointer-events-none absolute -top-10 -right-10 h-48 w-48 rounded-full bg-primary-200/40 blur-3xl"
              aria-hidden
            />
            <RouteMotif className="relative h-auto w-full text-primary-600/60" />
          </div>
        </Reveal>
        <Reveal delay={100} className="order-1 lg:order-2">
          <SectionHeading eyebrow={t("eyebrow")} title={t("heading")} description={t("copy")} />
          <div className="mt-8">
            <Button href="/request-a-quote" variant="outline" showArrow>
              {t("cta")}
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
