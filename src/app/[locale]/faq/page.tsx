import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { faqJsonLd } from "@/lib/structured-data";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { EnglishContentNotice } from "@/components/ui/EnglishContentNotice";
import { FaqAccordion, type FaqItem } from "@/components/ui/FaqAccordion";
import { InlineCta } from "@/components/ui/InlineCta";

const FAQ_GROUPS: { category: string; items: FaqItem[] }[] = [
  {
    category: "Products",
    items: [
      {
        question: "What products can I source from Indonesia?",
        answer:
          "We offer selected Indonesian products and can review sourcing requirements for specific products. Please contact us with the product name, specification, quantity, and destination.",
      },
      {
        question: "Can I request a specific product specification?",
        answer:
          "Yes, buyers can submit their required specifications for review. Availability and sourcing feasibility should be confirmed for each inquiry.",
      },
      {
        question: "Can I request product samples?",
        answer:
          "Sample availability depends on the product and order requirements. Contact us with your product request to confirm the available options.",
      },
    ],
  },
  {
    category: "Quantity",
    items: [
      {
        question: "What is the MOQ?",
        answer:
          "MOQ depends on the product, grade, packaging, and shipment requirements. Please request a quotation for the specific product you need.",
      },
    ],
  },
  {
    category: "Packaging",
    items: [
      {
        question: "What packaging options are available?",
        answer:
          "Packaging depends on the product and buyer requirements. Contact us with your preferred packaging format so it can be reviewed.",
      },
    ],
  },
  {
    category: "Shipping",
    items: [
      {
        question: "Can you quote FOB, CFR, or CIF?",
        answer:
          "Shipping terms depend on the shipment and destination. Please include your destination port and preferred Incoterm in your inquiry.",
      },
    ],
  },
  {
    category: "Documentation",
    items: [
      {
        question: "What export documents are available?",
        answer:
          "Documentation depends on the product, destination, and applicable export requirements. Required documents should be confirmed for each shipment.",
      },
    ],
  },
  {
    category: "Buyers",
    items: [
      {
        question: "Do you work with wholesalers and distributors?",
        answer:
          "International commercial buyers such as importers, wholesalers, distributors, and trading companies can submit inquiries for review.",
      },
    ],
  },
  {
    category: "Quote",
    items: [
      {
        question: "What information should I include when requesting a quotation?",
        answer:
          "Include product name, quantity, quality/specification, packaging, destination port, preferred Incoterm, and any additional requirements.",
      },
    ],
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: "Frequently Asked Questions | PT. Pakindo Impex Perkasa",
    description:
      "Answers for international buyers on sourcing, MOQ, packaging, shipping terms, documentation, and requesting a quotation from PT. Pakindo Impex Perkasa.",
    path: "/faq",
    locale: locale as Locale,
  });
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const allItems = FAQ_GROUPS.flatMap((group) => group.items);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(allItems)) }}
      />
      <PageHero
        eyebrow="Common Questions"
        title="Frequently Asked Questions"
        description="Answers for international buyers researching Indonesian sourcing, quantity, packaging, shipping, documentation, and quotations."
      />
      <Breadcrumbs items={[{ name: "FAQ", path: "/faq" }]} />
      <EnglishContentNotice />

      <section className="py-16 sm:py-24">
        <Container className="max-w-3xl space-y-12">
          {FAQ_GROUPS.map((group) => (
            <div key={group.category}>
              <h2 className="text-xs font-bold tracking-[0.2em] text-primary-700 uppercase">
                {group.category}
              </h2>
              <div className="mt-4">
                <FaqAccordion items={group.items} />
              </div>
            </div>
          ))}
        </Container>
      </section>

      <InlineCta
        message="Still have questions specific to your order?"
        ctaLabel="Request a Quote"
        ctaHref="/request-a-quote"
      />
    </>
  );
}
