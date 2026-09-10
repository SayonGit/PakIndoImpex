import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProcessStep } from "@/components/ui/ProcessStep";
import { Reveal } from "@/components/ui/Reveal";

export function ProcessSection() {
  const t = useTranslations("home.process");
  const steps = t.raw("steps") as { number: string; title: string; copy: string }[];

  return (
    <section id="how-we-work" className="scroll-mt-24 bg-ink-50 py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow={t("eyebrow")} title={t("heading")} />
        <div className="mt-14 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <Reveal key={step.number} delay={index * 60}>
              <ProcessStep number={step.number} title={step.title} copy={step.copy} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
