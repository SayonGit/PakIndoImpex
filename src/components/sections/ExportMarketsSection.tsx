import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DotGrid } from "@/components/ui/DotGrid";
import { TargetedCountriesMap } from "@/components/ui/TargetedCountriesMap";

const EXPORT_MARKETS_WHATSAPP_LINK =
  "https://wa.me/+6281310188888/?text=Hello,%20I%20visited%20your%20website%20and%20would%20like%20export%20offers%20for%20my%20market.%20Please%20share%20available%20products%20and%20prices.";

export function ExportMarketsSection({
  background = "decorated",
  standalone = true,
}: {
  /**
   * "decorated" (default) — the homepage's original look: dot-grid + glow
   * blobs over the page's own background, matching "What We Source".
   * "white" — plain solid white, no decoration (used on the Contact page).
   */
  background?: "decorated" | "white";
  /**
   * false when composed directly above FaqPreviewSection on the homepage —
   * skips this component's own <section>/background so the two share one
   * continuous decorated background instead of each clipping its own glow
   * blobs and creating a visible seam where they meet.
   */
  standalone?: boolean;
} = {}) {
  const tMarkets = useTranslations("home.exportMarkets");
  const highlights = tMarkets.raw("highlights") as string[];

  const content = (
    <Container className="relative">
      <SectionHeading eyebrow={tMarkets("eyebrow")} title={tMarkets("heading")} />
      <div className="mt-10">
        <TargetedCountriesMap
          highlights={highlights}
          whatsappCta={tMarkets("whatsappCta")}
          whatsappHref={EXPORT_MARKETS_WHATSAPP_LINK}
        />
      </div>
    </Container>
  );

  if (!standalone) {
    return (
      <div id="export-markets" className="scroll-mt-24">
        {content}
      </div>
    );
  }

  return (
    <section
      id="export-markets"
      className={`relative scroll-mt-24 overflow-hidden py-20 sm:py-28 ${
        background === "white" ? "bg-white" : ""
      }`}
    >
      {background === "decorated" && (
        <>
          <DotGrid
            id="dot-grid-export-markets"
            className="pointer-events-none absolute inset-0 h-full w-full text-ink-900/[0.035]"
          />
          <div
            className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-primary-200/30 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gold-300/30 blur-3xl"
            aria-hidden
          />
        </>
      )}

      {content}
    </section>
  );
}
