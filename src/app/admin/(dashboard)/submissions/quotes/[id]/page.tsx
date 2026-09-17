import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getQuoteRequestForAdmin } from "@/lib/admin-data";
import { SubmissionDetailActions } from "@/components/admin/SubmissionDetailActions";

export const metadata: Metadata = { title: "Quote Request | Admin" };

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold tracking-wide text-ink-500 uppercase">{label}</p>
      <p className="mt-1 text-sm text-ink-900">{value}</p>
    </div>
  );
}

export default async function QuoteRequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getQuoteRequestForAdmin(id);
  if (!item) notFound();

  return (
    <div className="max-w-2xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink-950">{item.name}</h1>
          <p className="mt-1 text-sm text-ink-500">
            Submitted {item.createdAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <SubmissionDetailActions kind="quotes" id={item.id} status={item.status} />
      </div>

      <div className="shadow-soft mt-6 space-y-5 rounded-2xl border border-ink-100 bg-white p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Email" value={item.email} />
          <Field label="Phone" value={item.phone || "—"} />
          <Field label="Company" value={item.company || "—"} />
          <Field label="Destination Country" value={item.destinationCountry} />
          <Field label="Approx. Quantity" value={item.quantityEstimate || "—"} />
          <Field label="Locale" value={item.locale} />
        </div>
        <div>
          <p className="text-xs font-bold tracking-wide text-ink-500 uppercase">Inquiry Details</p>
          <p className="mt-1 text-sm leading-relaxed whitespace-pre-wrap text-ink-900">{item.inquiryDetails}</p>
        </div>
      </div>
    </div>
  );
}
