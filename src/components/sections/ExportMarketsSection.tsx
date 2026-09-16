import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TargetedCountriesMap } from "@/components/ui/TargetedCountriesMap";

const EXPORT_MARKETS_WHATSAPP_LINK =
  "https://wa.me/+6281310188888/?text=Hello,%20I%20visited%20your%20website%20and%20would%20like%20export%20offers%20for%20my%20market.%20Please%20share%20available%20products%20and%20prices.";

export function ExportMarketsSection() {
  const tMarkets = useTranslations("home.exportMarkets");
  const highlights = tMarkets.raw("highlights") as string[];

  return (
    <section id="export-markets" className="relative scroll-mt-24 overflow-hidden bg-white py-20 sm:py-28">
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
    </section>
  );
}
