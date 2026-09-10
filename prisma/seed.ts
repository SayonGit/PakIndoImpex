import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Only Areca Nut is seeded as a real, indexable product page — it is the
 * one product named directly in assets/CONTENT.md's hero copy. The other
 * placeholder categories ([PRODUCT CATEGORY 2/3]) are rendered as
 * "coming soon" cards directly in the UI rather than fake DB-backed pages,
 * so no unverified product page is ever published. Every field below that
 * isn't publicly verifiable is an explicit [VERIFY: ...] placeholder.
 */
async function main() {
  const arecaNut = await prisma.product.upsert({
    where: { slug: "areca-nut" },
    update: {},
    create: {
      slug: "areca-nut",
      name: "Areca Nut",
      category: "Areca Nut",
      shortDescription:
        "Indonesian areca nut sourced and prepared for export, coordinated to buyer specifications.",
      description:
        "PT. Pakindo Impex Perkasa supports international buyers sourcing areca nut (betel nut) from Indonesia. We coordinate supplier sourcing, specification confirmation, packaging, export documentation, and shipment support according to each buyer's requirements.",
      origin: "Indonesia",
      grade: "[VERIFY: PRODUCT GRADE]",
      size: "[VERIFY]",
      processing: "[VERIFY]",
      moisture: "[VERIFY]",
      packaging: "[VERIFY: PACKAGING OPTIONS]",
      moq: "[VERIFY: MOQ]",
      hsCode: "[VERIFY: HS CODE]",
      loadingPort: "[VERIFY: LOADING PORT]",
      availability: "[VERIFY]",
      seoTitle: "Areca Nut Supplier & Exporter from Indonesia | PT. Pakindo Impex Perkasa",
      seoDescription:
        "Source areca nut (betel nut) from Indonesia with PT. Pakindo Impex Perkasa. Sourcing, specification coordination, packaging, and export documentation support for international buyers.",
      featuredImageAlt: "Areca nut prepared for export from Indonesia",
      featured: true,
      sortOrder: 1,
    },
  });

  const articles: {
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    category: string;
    tags: string[];
    seoTitle: string;
    seoDescription: string;
    relateToAreca?: boolean;
  }[] = [
    {
      slug: "fob-vs-cfr-vs-cif",
      title: "FOB vs CFR vs CIF: Which Shipping Term Should Importers Choose?",
      excerpt:
        "A plain-language comparison of the three Incoterms importers see most often when requesting a quotation from an Indonesian supplier.",
      category: "Shipping & Logistics",
      tags: ["incoterms", "shipping", "import guide"],
      seoTitle: "FOB vs CFR vs CIF Explained | PT. Pakindo Impex Perkasa",
      seoDescription:
        "Understand the difference between FOB, CFR, and CIF shipping terms and how each affects cost, risk, and responsibility when importing from Indonesia.",
      relateToAreca: true,
      content: `<p>When requesting a quotation from an Indonesian supplier, buyers are usually asked to choose a shipping term — most commonly FOB, CFR, or CIF. Each term defines a different split of cost and responsibility between the seller and the buyer.</p>

<h2>FOB (Free on Board)</h2>
<p>Under FOB, the seller is responsible for delivering the goods on board the vessel at the named port of loading. Once the goods are loaded, risk and further transport costs pass to the buyer. The buyer arranges and pays for the main sea freight and marine insurance.</p>

<h2>CFR (Cost and Freight)</h2>
<p>Under CFR, the seller pays for transport (freight) to the named port of destination, but risk still passes to the buyer once the goods are loaded on board at the origin port. The buyer is responsible for arranging their own marine insurance if they want coverage during transit.</p>

<h2>CIF (Cost, Insurance and Freight)</h2>
<p>CIF works like CFR, but the seller also arranges and pays for minimum marine insurance cover on the shipment to the destination port. Risk still transfers to the buyer once goods are loaded at origin — insurance simply means a claims process exists if something happens in transit.</p>

<h2>Which term should you choose?</h2>
<p>There is no universally "better" term — the right choice depends on your logistics setup, your relationship with a freight forwarder, your insurance preferences, and how much of the shipping process you want to manage directly. Buyers who already work with a trusted freight forwarder often prefer FOB for more control over freight costs. Buyers without existing freight relationships often prefer CFR or CIF for simplicity.</p>

<p>Preferred Incoterm can be specified directly when you <a href="/request-a-quote">request a quote</a>, and availability of each term should be confirmed for your specific product and destination.</p>`,
    },
    {
      slug: "verify-indonesian-export-supplier",
      title: "How to Verify an Indonesian Export Supplier Before Ordering",
      excerpt:
        "Practical checks international buyers can run before committing to a new supplier relationship in Indonesia.",
      category: "Buyer Guides",
      tags: ["supplier verification", "due diligence", "import guide"],
      seoTitle: "How to Verify an Indonesian Export Supplier | PT. Pakindo Impex Perkasa",
      seoDescription:
        "Practical steps international buyers can take to verify an Indonesian export supplier before placing an order, from legal checks to sample requests.",
      content: `<p>Sourcing from a new country naturally raises questions about reliability. Before placing an order with any Indonesian supplier, it is reasonable — and recommended — to run a basic verification process.</p>

<h2>1. Confirm the legal entity</h2>
<p>Ask for the supplier's registered company name and business registration details. A legitimate trading or export company should be able to share this without hesitation.</p>

<h2>2. Ask specific, technical questions</h2>
<p>Suppliers familiar with their product line should be able to answer detailed questions about specification, grading, packaging, and typical lead times. Vague or evasive answers to specific questions are a warning sign.</p>

<h2>3. Request clear written quotations</h2>
<p>A dependable supplier should be willing to provide a written quotation referencing the product, quantity, specification, packaging, and shipping term — not just a verbal price.</p>

<h2>4. Clarify sample and inspection options</h2>
<p>Ask whether samples are available for your intended order, and what pre-shipment inspection options exist. Availability depends on the product and order size, so confirm this for your specific case rather than assuming.</p>

<h2>5. Review communication and documentation practices</h2>
<p>Pay attention to how clearly a supplier communicates about documentation requirements, packaging options, and shipping terms. Trade documentation is detailed by nature, and a supplier that explains it clearly is generally easier to work with long-term.</p>

<p>If you are evaluating PT. Pakindo Impex Perkasa as a sourcing partner, the most direct way to start is to <a href="/request-a-quote">send your product requirements</a> and see how the inquiry is handled.</p>`,
    },
    {
      slug: "request-export-quotation-indonesia",
      title: "How to Request an Export Quotation from an Indonesian Supplier",
      excerpt:
        "What to include in your inquiry so a supplier can prepare an accurate quotation the first time.",
      category: "Buyer Guides",
      tags: ["quotation", "sourcing", "import guide"],
      seoTitle: "How to Request an Export Quotation from Indonesia | PT. Pakindo Impex Perkasa",
      seoDescription:
        "Learn what information to include when requesting an export quotation from an Indonesian supplier, so you get an accurate quote the first time.",
      relateToAreca: true,
      content: `<p>The speed and accuracy of a quotation usually depends on how much detail is provided in the original inquiry. A vague request ("What's your price for [product]?") typically leads to back-and-forth questions before a supplier can quote at all.</p>

<h2>Information worth including from the start</h2>
<ul>
<li><strong>Product</strong> — the specific product or category you need.</li>
<li><strong>Quantity</strong> — expected order volume, even if approximate.</li>
<li><strong>Quality / grade</strong> — any specification or grade you require, if known.</li>
<li><strong>Packaging</strong> — preferred packaging format, if you have one in mind.</li>
<li><strong>Destination port</strong> — where the shipment needs to arrive.</li>
<li><strong>Preferred Incoterm</strong> — FOB, CFR, CIF, or another term, if decided.</li>
<li><strong>Target delivery date</strong> — helps the supplier assess feasibility.</li>
</ul>

<h2>Why this matters</h2>
<p>Export pricing depends on more than the product itself — packaging, destination, and shipping term all affect the final quotation. Providing these details upfront lets a supplier prepare a more accurate quote and reduces the number of clarifying questions before you can compare offers.</p>

<h2>Submitting your inquiry</h2>
<p>You can submit all of the details above directly through our <a href="/request-a-quote">Request a Quote</a> form. Your inquiry will be reviewed and we will follow up with next steps based on the information provided.</p>`,
    },
  ];

  for (const article of articles) {
    const { relateToAreca, ...data } = article;
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: {
        ...data,
        author: "PT. Pakindo Impex Perkasa Team",
        publishDate: new Date(),
        published: true,
        relatedProducts: relateToAreca ? { connect: [{ id: arecaNut.id }] } : undefined,
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
