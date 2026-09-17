import type { Metadata } from "next";
import { getAllQuoteRequestsForAdmin } from "@/lib/admin-data";
import { QuoteRequestListClient } from "@/components/admin/QuoteRequestListClient";

export const metadata: Metadata = { title: "Quote Requests | Admin" };

export default async function AdminQuoteRequestsPage() {
  const items = await getAllQuoteRequestsForAdmin();

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-950">Quote Requests</h1>
      <p className="mt-1 text-sm text-ink-500">Submissions from the Request a Quote form.</p>
      <div className="mt-8">
        <QuoteRequestListClient initialItems={items} />
      </div>
    </div>
  );
}
