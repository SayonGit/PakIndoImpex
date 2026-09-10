import { useTranslations } from "next-intl";
import {
  FileText,
  ShieldCheck,
  Box,
  Hash,
  Anchor,
  FileSignature,
  ClipboardList,
  CalendarClock,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const icons = [FileText, ShieldCheck, Box, Hash, Anchor, FileSignature, ClipboardList, CalendarClock];

export function BuyerBenefits() {
  const t = useTranslations("home.buyerBenefits");
  const items = t.raw("items") as string[];

  return (
    <section className="relative overflow-hidden bg-primary-900 py-20 text-white sm:py-28">
      <div className="glow-mesh" />
      <Container className="relative">
        <SectionHeading eyebrow={t("eyebrow")} title={t("heading")} description={t("copy")} tone="light" />
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => {
            const Icon = icons[index];
            return (
              <Reveal key={item} delay={index * 50}>
                <div className="glass group flex items-center gap-3 rounded-2xl p-4 transition-all duration-300 ease-spring hover:-translate-y-1">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gold-400/15 text-gold-300 transition-transform duration-300 ease-spring group-hover:scale-105">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span className="text-sm font-semibold">{item}</span>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
