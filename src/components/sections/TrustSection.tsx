import { useTranslations } from "next-intl";
import { Search, ShieldCheck, Tags, Ship } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { Reveal } from "@/components/ui/Reveal";

const icons = [Search, ShieldCheck, Tags, Ship];

export function TrustSection() {
  const t = useTranslations("home.trust");
  const cards = t.raw("cards") as { title: string; copy: string }[];

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow={t("eyebrow")} title={t("heading")} description={t("copy")} />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, index) => (
            <Reveal key={card.title} delay={index * 80}>
              <FeatureCard icon={icons[index]} title={card.title} copy={card.copy} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
