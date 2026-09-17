import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TestimonialsCarousel } from "@/components/sections/TestimonialsCarousel";
import { getPublishedTestimonials } from "@/lib/data";

export async function TestimonialsSection() {
  const t = await getTranslations("home.testimonials");
  const items = await getPublishedTestimonials();

  if (items.length === 0) return null;

  return (
    <section className="relative bg-white py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow={t("eyebrow")} title={t("heading")} description={t("description")} align="center" />
        <TestimonialsCarousel items={items} />
      </Container>
    </section>
  );
}
