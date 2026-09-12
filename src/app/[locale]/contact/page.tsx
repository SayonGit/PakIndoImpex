import type { Metadata } from "next";
import { MessageCircle, Mail, MapPin, Clock } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { COMPANY } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { EnglishContentNotice } from "@/components/ui/EnglishContentNotice";
import { ContactForm } from "@/components/forms/ContactForm";

const CONTACT_ITEMS = [
  { icon: MessageCircle, label: "WhatsApp", value: COMPANY.whatsapp },
  { icon: Mail, label: "Email", value: COMPANY.email },
  { icon: MapPin, label: "Office", value: COMPANY.address },
  { icon: Clock, label: "Business Hours", value: COMPANY.businessHours },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: "Contact PT. Pakindo Impex Perkasa",
    description:
      "Contact PT. Pakindo Impex Perkasa for Indonesian product sourcing, export, import, and international trade inquiries.",
    path: "/contact",
    locale: locale as Locale,
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHero
        eyebrow="Get in Touch"
        title="Contact PT. Pakindo Impex Perkasa"
        description="Have a product requirement, sourcing request, or export inquiry? Contact our team with your details and requirements."
      />
      <Breadcrumbs items={[{ name: "Contact", path: "/contact" }]} />
      <EnglishContentNotice />

      <section className="py-16 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            {CONTACT_ITEMS.map((item) => (
              <div
                key={item.label}
                className="shadow-soft flex items-start gap-4 rounded-2xl border border-ink-100 bg-white p-5 transition-all duration-300 ease-spring hover:-translate-y-0.5 hover:shadow-soft-lg"
              >
                <item.icon className="mt-0.5 size-5 shrink-0 text-primary-700" aria-hidden />
                <div>
                  <p className="text-xs font-bold tracking-wide text-ink-500 uppercase">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm font-medium text-ink-900">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="shadow-soft rounded-2xl border border-ink-100 bg-white p-6 sm:p-10">
            <ContactForm />
          </div>
        </Container>
      </section>
    </>
  );
}
