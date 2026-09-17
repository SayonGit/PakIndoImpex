import type { Metadata } from "next";
import { getAllContactMessagesForAdmin } from "@/lib/admin-data";
import { ContactMessageListClient } from "@/components/admin/ContactMessageListClient";

export const metadata: Metadata = { title: "Contact Messages | Admin" };

export default async function AdminContactMessagesPage() {
  const items = await getAllContactMessagesForAdmin();

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-950">Contact Messages</h1>
      <p className="mt-1 text-sm text-ink-500">Submissions from the general Contact form.</p>
      <div className="mt-8">
        <ContactMessageListClient initialItems={items} />
      </div>
    </div>
  );
}
