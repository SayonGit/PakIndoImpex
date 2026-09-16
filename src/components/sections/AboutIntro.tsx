import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

/**
 * About page's own "who we are" intro (image + copy) + Vision/Mission
 * cards — deliberately separate content from home.about (AboutPreview on
 * the homepage), so each can be edited independently without affecting
 * the other. Same image treatment as AboutPreview, different text.
 */
export function AboutIntro() {
  const t = useTranslations("aboutPage");

  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-24">
      <Container className="relative grid items-center gap-16 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative">
          <div className="absolute -inset-5 -rotate-3 rounded-[2.5rem] bg-gold-400/50" aria-hidden />
          <div className="group shadow-soft-lg relative aspect-4/3 overflow-hidden rounded-3xl bg-primary-700 transition-all duration-500 ease-spring hover:-translate-y-1.5 hover:shadow-[0_28px_56px_-20px_rgba(4,30,6,0.45)]">
            <div className="absolute inset-0 transition-transform duration-500 ease-spring group-hover:scale-105">
              <Image
                src="/images/about-us-1.webp"
                alt=""
                fill
                priority
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

        <div>
          <SectionHeading eyebrow={t("eyebrow")} title={t("heading")} />
          <p className="mt-6 border-l-4 border-gold-400 pl-5 text-lg leading-relaxed text-ink-800 italic sm:text-xl">
            {t("paragraph1")}
          </p>
          <p className="mt-5 text-base leading-relaxed text-ink-600 sm:text-lg">{t("paragraph2")}</p>
        </div>
      </Container>

      <Container className="relative mt-14 sm:mt-20">
        <div className="grid gap-6 sm:grid-cols-2">
          <Reveal delay={80}>
            <div className="shadow-soft h-full rounded-2xl border-l-4 border-gold-400 bg-white p-6 transition-all duration-300 ease-spring hover:-translate-y-1 hover:shadow-soft-lg sm:p-8">
              <h3 className="text-xl font-bold text-ink-950">{t("vision.title")}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-700 sm:text-base">{t("vision.copy")}</p>
            </div>
          </Reveal>
          <Reveal delay={140}>
            <div className="shadow-soft h-full rounded-2xl border-l-4 border-primary-600 bg-white p-6 transition-all duration-300 ease-spring hover:-translate-y-1 hover:shadow-soft-lg sm:p-8">
              <h3 className="text-xl font-bold text-ink-950">{t("mission.title")}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-700 sm:text-base">{t("mission.copy")}</p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
