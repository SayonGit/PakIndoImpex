import { getTranslations } from "next-intl/server";
import { Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCard, FeaturedProductCard } from "@/components/ui/ProductCard";
import { QuoteModalTrigger } from "@/components/quote/QuoteModalTrigger";
import { Reveal } from "@/components/ui/Reveal";
import {
  ARECA_NUT_ROASTED_PHOTO,
  ARECA_NUT_SPLIT_PHOTO,
  ARECA_NUT_WHOLE_PHOTO,
} from "@/data/stock-imagery";

const SPLIT_WHATSAPP_LINK =
  "https://wa.me/+6281310188888?text=Hello.%0AI%20am%20interested%20in%20importing%20Split%20Betel%20Nut%20from%20Indonesia.%0ACould%20you%20please%20assist%20me?";
const WHOLE_WHATSAPP_LINK =
  "https://wa.me/+6281310188888/?text=Hello,%20I%20visited%20your%20website%20and%20I%27m%20interested%20in%20Whole%20Betel%20Nut.%20Please%20share%20your%20best%20price.";
const ROASTED_WHATSAPP_LINK =
  "https://wa.me/+6281310188888/?text=Hello,%20I%20visited%20your%20website%20and%20I%27m%20interested%20in%20Roasted%20Areca%20Nut.%20Please%20share%20quotation.";

/**
 * Split / Whole / Roasted are forms of the single verified export product
 * (areca / betel nut). There are no separate product pages — this section
 * is the only place product content lives. Each card's CTA opens a WhatsApp
 * chat pre-filled with a product-specific message.
 */
export async function ProductsPreview() {
  const [t, cta] = await Promise.all([
    getTranslations("home.products"),
    getTranslations("cta"),
  ]);

  return (
    <section id="products" className="scroll-mt-24 py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow={t("eyebrow")} title={t("heading")} description={t("intro")} />

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-5">
          <Reveal className="lg:col-span-3">
            <FeaturedProductCard
              name={t("featured.name")}
              badge={t("featured.badge")}
              description={t("featured.description")}
              features={t.raw("featured.features") as string[]}
              image={ARECA_NUT_SPLIT_PHOTO}
              href={SPLIT_WHATSAPP_LINK}
              external
              cta={cta("getExportPricing")}
            />
          </Reveal>

          <div className="flex flex-col gap-6 lg:col-span-2">
            <Reveal delay={80}>
              <ProductCard
                name={t("whole.name")}
                description={t("whole.description")}
                features={t.raw("whole.features") as string[]}
                image={ARECA_NUT_WHOLE_PHOTO}
                href={WHOLE_WHATSAPP_LINK}
                external
                slug="whole-betel-nut"
                cta={cta("askAboutProduct")}
                titleClassName="text-3xl"
              />
            </Reveal>

            <Reveal delay={160} className="flex flex-1">
              <ProductCard
                name={t("roasted.name")}
                description={t("roasted.description")}
                features={t.raw("roasted.features") as string[]}
                image={ARECA_NUT_ROASTED_PHOTO}
                href={ROASTED_WHATSAPP_LINK}
                external
                slug="roasted-areca-nut"
                cta={cta("askAboutProduct")}
                titleClassName="text-3xl"
              />
            </Reveal>
          </div>
        </div>

        <Reveal delay={240} className="mt-6">
          <div className="flex flex-col items-start gap-4 rounded-2xl border-2 border-dashed border-primary-300 bg-primary-50 p-6 transition-all duration-300 ease-spring hover:-translate-y-1 hover:border-primary-400 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="flex items-start gap-4 sm:items-center">
              <Sparkles className="size-8 shrink-0 text-primary-700" aria-hidden />
              <div>
                <h3 className="text-3xl leading-tight font-bold text-ink-950">{t("customSourcing.title")}</h3>
                <p className="mt-4 text-sm leading-relaxed text-ink-700">{t("customSourcing.copy")}</p>
              </div>
            </div>
            <QuoteModalTrigger variant="secondary" size="md" className="w-full shrink-0 sm:w-auto">
              {t("customSourcing.cta")}
            </QuoteModalTrigger>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
