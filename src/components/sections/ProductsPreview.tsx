import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCard, FeaturedProductCard } from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { DotGrid } from "@/components/ui/DotGrid";

const SPLIT_BETEL_NUT_PHOTO = "/images/products/split-betel-nut-1.webp";
const WHOLE_BETEL_NUT_PHOTO = "/images/products/whole-betel-nut-1.webp";
const ROASTED_ARECA_NUT_PHOTO = "/images/products/roasted-areca-nuts-1.webp";
const SLICED_BETEL_NUT_PHOTO = "/images/products/sliced-betel-nut-1.webp";
const BOILED_ARECA_NUT_PHOTO = "/images/products/b1-boiled-areca-nut-1.webp";
const DRIED_ARECA_NUT_PHOTO = "/images/products/dried-areca-nut-1.webp";

const SPLIT_WHATSAPP_LINK =
  "https://wa.me/+6281310188888?text=Hello.%0AI%20am%20interested%20in%20importing%20Split%20Betel%20Nut%20from%20Indonesia.%0ACould%20you%20please%20assist%20me?";
const WHOLE_WHATSAPP_LINK =
  "https://wa.me/+6281310188888/?text=Hello,%20I%20visited%20your%20website%20and%20I%27m%20interested%20in%20Whole%20Betel%20Nut.%20Please%20share%20your%20best%20price.";
const ROASTED_WHATSAPP_LINK =
  "https://wa.me/+6281310188888/?text=Hello,%20I%20visited%20your%20website%20and%20I%27m%20interested%20in%20Roasted%20Areca%20Nut.%20Please%20share%20quotation.";
const OTHER_PRODUCTS_WHATSAPP_LINK =
  "https://wa.me/+6281310188888/?text=Hello,%20I%20visited%20your%20website%20and%20would%20like%20information%20about%20your%20other%20areca%20nut%20products.";

/** Order matches home.products.customSourcing.items in src/messages/en.json. */
const OTHER_PRODUCT_PHOTOS = [SLICED_BETEL_NUT_PHOTO, BOILED_ARECA_NUT_PHOTO, DRIED_ARECA_NUT_PHOTO] as const;

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
    <section id="products" className="relative scroll-mt-24 overflow-hidden py-20 sm:py-28">
      <DotGrid id="dot-grid-products" className="pointer-events-none absolute inset-0 h-full w-full text-ink-900/[0.035]" />
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-primary-200/30 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gold-300/30 blur-3xl"
        aria-hidden
      />

      <Container className="relative">
        <SectionHeading eyebrow={t("eyebrow")} title={t("heading")} description={t("intro")} />

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-5">
          <Reveal className="lg:col-span-3">
            <FeaturedProductCard
              name={t("featured.name")}
              badge={t("featured.badge")}
              description={t("featured.description")}
              features={t.raw("featured.features") as string[]}
              image={SPLIT_BETEL_NUT_PHOTO}
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
                image={WHOLE_BETEL_NUT_PHOTO}
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
                image={ROASTED_ARECA_NUT_PHOTO}
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
          <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-primary-300 bg-transparent p-6 transition-colors duration-300 ease-spring hover:border-primary-400 sm:p-8">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
              <div className="lg:w-72 lg:shrink-0">
                <h3 className="text-2xl leading-tight font-bold text-ink-950 sm:text-3xl">
                  {(() => {
                    const title = t("customSourcing.title");
                    const match = title.match(/^(.*?)\s*([（(].*)$/);
                    if (!match) return title;
                    return (
                      <>
                        {match[1]}
                        <br />
                        {match[2]}
                      </>
                    );
                  })()}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-700">{t("customSourcing.copy")}</p>
              </div>

              <div className="h-px w-full bg-primary-200/70 lg:h-16 lg:w-px lg:shrink-0" aria-hidden />

              <div className="flex flex-1 flex-col items-center gap-6">
                <div className="grid w-full grid-cols-3 gap-3 sm:gap-4">
                  {(t.raw("customSourcing.items") as string[]).map((name, index) => {
                    const photo = OTHER_PRODUCT_PHOTOS[index];
                    return (
                      <div
                        key={name}
                        className="group flex flex-col items-center gap-2.5 rounded-xl bg-white/80 p-3 shadow-sm ring-1 ring-inset ring-primary-200/70 transition-all duration-300 ease-spring hover:-translate-y-1 hover:bg-white hover:shadow-soft-lg hover:ring-primary-300 sm:p-4"
                      >
                        <div className="relative size-12 shrink-0 overflow-hidden rounded-full shadow-sm ring-2 ring-white transition-transform duration-300 ease-spring group-hover:scale-110 sm:size-14">
                          <Image src={photo} alt="" fill sizes="56px" className="object-cover" />
                        </div>
                        <span className="text-center text-xs leading-tight font-bold text-ink-900 sm:text-sm">
                          {name}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <Button
                  href={OTHER_PRODUCTS_WHATSAPP_LINK}
                  external
                  variant="secondary"
                  size="md"
                  className="w-full sm:w-auto"
                >
                  {t("customSourcing.cta")}
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
