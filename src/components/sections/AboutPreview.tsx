import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

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
            <div className="group shadow-soft-lg relative aspect-4/3 overflow-hidden rounded-3xl bg-primary-700 transition-all duration-500 ease-spring hover:-translate-y-1.5 hover:shadow-[0_28px_56px_-20px_rgba(4,30,6,0.45)]">
              <div className="absolute inset-0 transition-transform duration-500 ease-spring group-hover:scale-105">
                <Image
                  src="/images/about-us-1.webp"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="animate-kenburns-loop motion-reduce:animate-none object-cover"
                />
              </div>
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent"
                aria-hidden
              />
              <div className="glass pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-spring group-hover:opacity-100" />
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
