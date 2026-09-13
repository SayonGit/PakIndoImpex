import { useTranslations } from "next-intl";
import {
  Send,
  FileSearch,
  ClipboardCheck,
  Package,
  FileText,
  Ship,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProcessStep } from "@/components/ui/ProcessStep";
import { Reveal } from "@/components/ui/Reveal";

// One icon per step, in order — matches home.process.steps in src/messages/en.json:
// 01 Send Your Requirements, 02 Product & Price Review, 03 Specification
// Confirmation, 04 Product Preparation, 05 Documentation & Loading,
// 06 International Shipment.
const STEP_ICONS = [Send, FileSearch, ClipboardCheck, Package, FileText, Ship];

// Desktop (lg+) is a 3-column "snake": row one flows left-to-right
// (01-02-03), row two flows right-to-left (04-05-06), so 04 sits directly
// under 03 and 06 sits directly under 01, matching the connector chain.
const GRID_PLACEMENT = [
  "lg:[grid-column:1] lg:[grid-row:1]", // 01
  "lg:[grid-column:2] lg:[grid-row:1]", // 02
  "lg:[grid-column:3] lg:[grid-row:1]", // 03
  "lg:[grid-column:3] lg:[grid-row:2]", // 04 — directly under 03
  "lg:[grid-column:2] lg:[grid-row:2]", // 05
  "lg:[grid-column:1] lg:[grid-row:2]", // 06 — directly under 01
];

const CONNECTOR_BASE =
  "absolute z-10 flex size-8 items-center justify-center rounded-full bg-gold-400 text-ink-950 shadow-[0_4px_10px_-2px_rgba(240,173,31,0.6)]";

export function ProcessSection() {
  const t = useTranslations("home.process");
  const steps = t.raw("steps") as { number: string; title: string; copy: string }[];

  return (
    <section id="how-we-work" className="relative scroll-mt-24 overflow-hidden bg-white py-20 sm:py-28">
      <Container className="relative">
        <SectionHeading eyebrow={t("eyebrow")} title={t("heading")} description={t("description")} />
        <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-3">
          {steps.map((step, index) => {
            const isLast = index === steps.length - 1;
            const isRowEnd = index % 3 === 2;
            const row = Math.floor(index / 3);
            const flowsRight = row % 2 === 0;

            return (
              <Reveal
                key={step.number}
                delay={index * 60}
                className={`relative h-full ${GRID_PLACEMENT[index]}`}
              >
                <ProcessStep
                  number={step.number}
                  title={step.title}
                  copy={step.copy}
                  icon={STEP_ICONS[index]}
                />

                {/* Down connector: always the flow between rows (e.g. 03 -> 04); also
                    doubles as the vertical connector for single-column mobile/tablet. */}
                {!isLast && (
                  <span
                    aria-hidden
                    className={`${CONNECTOR_BASE} bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 ${
                      isRowEnd ? "" : "lg:hidden"
                    }`}
                  >
                    <ChevronDown className="size-4" />
                  </span>
                )}

                {/* Within-row connector, direction follows the row's flow. */}
                {!isLast &&
                  !isRowEnd &&
                  (flowsRight ? (
                    <span
                      aria-hidden
                      className={`${CONNECTOR_BASE} top-1/2 right-0 hidden -translate-y-1/2 translate-x-1/2 lg:flex`}
                    >
                      <ChevronRight className="size-4" />
                    </span>
                  ) : (
                    <span
                      aria-hidden
                      className={`${CONNECTOR_BASE} top-1/2 left-0 hidden -translate-y-1/2 -translate-x-1/2 lg:flex`}
                    >
                      <ChevronLeft className="size-4" />
                    </span>
                  ))}
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
