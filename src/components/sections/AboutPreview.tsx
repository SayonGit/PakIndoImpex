import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { placeholderPhoto } from "@/lib/placeholder-images";

export function AboutPreview() {
  const t = useTranslations("home.about");

  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-28">
      <Container className="relative grid items-center gap-16 lg:grid-cols-[0.95fr_1.05fr]">
        <Reveal>
          <div className="relative">
            <div
              className="absolute -inset-5 -rotate-3 rounded-[2.5rem] bg-gold-400/50"
              aria-hidden
            />
            <div className="shadow-soft-lg relative aspect-4/3 overflow-hidden rounded-3xl bg-primary-700">
              <Image
                src={placeholderPhoto("about-pakindo", 900, 675)}
                alt=""
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-primary-900/30" aria-hidden />
              <div className="absolute inset-6 rounded-2xl border border-white/25" aria-hidden />
            </div>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <SectionHeading eyebrow={t("eyebrow")} title={t("heading")} />

          <p className="mt-6 border-l-4 border-gold-400 pl-5 text-lg leading-relaxed text-ink-800 italic sm:text-xl">
            {t("copy1")}
          </p>
          <p className="mt-5 text-base leading-relaxed text-ink-600 sm:text-lg">{t("copy2")}</p>

          <div className="mt-9">
            <Button href="/about" variant="primary" showArrow>
              {t("cta")}
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
