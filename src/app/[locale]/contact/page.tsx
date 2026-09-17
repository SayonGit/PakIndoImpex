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
import { ExportMarketsSection } from "@/components/sections/ExportMarketsSection";
import { DotGrid } from "@/components/ui/DotGrid";

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

      <section className="relative overflow-hidden py-16 sm:py-24">
        <DotGrid id="dot-grid-contact" className="pointer-events-none absolute inset-0 h-full w-full text-ink-900/[0.035]" />
        <div
          className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-primary-200/30 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gold-300/30 blur-3xl"
          aria-hidden
        />

        <Container className="relative">
          <div className="grid overflow-hidden rounded-3xl border border-ink-100 shadow-[0_35px_70px_-20px_rgba(16,24,18,0.35)] lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 p-8 text-white sm:p-10">
              <div
                className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-gold-400/25 blur-3xl"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-gold-500/15 blur-3xl"
                aria-hidden
              />

              <h2 className="relative text-2xl font-bold">Contact Information</h2>
              <div className="relative mt-8 space-y-6">
                {CONTACT_ITEMS.map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <item.icon className="mt-0.5 size-5 shrink-0 text-gold-300" aria-hidden />
                    <div>
                      <p className="text-xs font-bold tracking-wide text-gold-300 uppercase">
                        {item.label}
                      </p>
                      {item.label === "Business Hours" ? (
                        <ul className="mt-1 space-y-1.5">
                          {item.value.split(" / ").map((line) => (
                            <li key={line} className="text-sm font-semibold text-white">
                              {line}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-1 text-sm font-semibold text-white">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 sm:p-10">
              <h2 className="text-2xl font-bold text-ink-950">Send us a message</h2>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <ExportMarketsSection background="white" />
    </>
  );
}
