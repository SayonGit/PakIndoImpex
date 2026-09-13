import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FaqAccordion, type FaqItem } from "@/components/ui/FaqAccordion";
import { DotGrid } from "@/components/ui/DotGrid";

export function FaqPreviewSection() {
  const t = useTranslations("home.faq");
  const items = t.raw("items") as FaqItem[];

  return (
    <section id="faq" className="relative scroll-mt-24 overflow-hidden py-20 sm:py-28">
      <DotGrid className="pointer-events-none absolute inset-0 h-full w-full text-ink-900/[0.035]" />
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-primary-200/30 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gold-300/30 blur-3xl"
        aria-hidden
      />

      <Container className="relative">
        <SectionHeading eyebrow={t("eyebrow")} title={t("heading")} />
        <div className="mt-10">
          <FaqAccordion items={items} />
        </div>
      </Container>
    </section>
  );
}
