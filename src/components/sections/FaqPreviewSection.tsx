import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { FaqAccordion, type FaqItem } from "@/components/ui/FaqAccordion";

export function FaqPreviewSection() {
  const t = useTranslations("home.faq");
  const items = t.raw("items") as FaqItem[];

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading eyebrow={t("eyebrow")} title={t("heading")} />
          <Button href="/faq" variant="ghost" showArrow className="shrink-0">
            {t("cta")}
          </Button>
        </div>
        <div className="mt-10">
          <FaqAccordion items={items} />
        </div>
      </Container>
    </section>
  );
}
