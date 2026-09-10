import Image from "next/image";
import { useTranslations } from "next-intl";
import { Globe2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { placeholderPhoto } from "@/lib/placeholder-images";

export function AboutPreview() {
  const t = useTranslations("home.about");

  return (
    <section className="bg-white py-20 sm:py-28">
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <div className="shadow-soft-lg relative aspect-4/3 overflow-hidden rounded-3xl bg-primary-700">
            <Image
              src={placeholderPhoto("about-pakindo", 900, 675)}
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-primary-900/30" aria-hidden />
            <div
              className="pointer-events-none absolute -top-10 -right-10 h-56 w-56 rounded-full bg-gold-400/25 blur-3xl"
              aria-hidden
            />
            <div className="absolute inset-6 rounded-2xl border border-white/25" aria-hidden />
            <span className="glass absolute right-6 bottom-6 flex size-14 items-center justify-center rounded-2xl text-gold-300">
              <Globe2 className="size-7" strokeWidth={1.25} aria-hidden />
            </span>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <SectionHeading eyebrow={t("eyebrow")} title={t("heading")} />
          <p className="mt-5 text-base leading-relaxed text-ink-600 sm:text-lg">{t("copy1")}</p>
          <p className="mt-4 text-base leading-relaxed text-ink-600 sm:text-lg">{t("copy2")}</p>
          <div className="mt-8">
            <Button href="/about" variant="outline" showArrow>
              {t("cta")}
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
