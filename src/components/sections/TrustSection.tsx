import { useTranslations } from "next-intl";
import { Search, ShieldCheck, Tags, Ship } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { Reveal } from "@/components/ui/Reveal";
import { DotGrid } from "@/components/ui/DotGrid";

const icons = [Search, ShieldCheck, Tags, Ship] as const;
const tones = ["primary", "gold", "primary", "gold"] as const;
const numbers = ["01", "02", "03", "04"];

export function TrustSection() {
  const t = useTranslations("home.trust");
  const cards = t.raw("cards") as { title: string; copy: string }[];

  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
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
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("heading")}
          description={t("copy")}
          maxWidthClassName="max-w-3xl"
        />
        <div className="mt-12 grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, index) => (
            <Reveal key={card.title} delay={index * 80} className="h-full">
              <FeatureCard
                icon={icons[index]}
                title={card.title}
                copy={card.copy}
                number={numbers[index]}
                tone={tones[index]}
              />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
