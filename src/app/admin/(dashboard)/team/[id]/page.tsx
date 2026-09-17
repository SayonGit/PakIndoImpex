import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTeamMemberForAdmin } from "@/lib/admin-data";
import { TeamMemberForm } from "@/components/admin/TeamMemberForm";

export const metadata: Metadata = { title: "Edit Team Member | Admin" };

export default async function EditTeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getTeamMemberForAdmin(id);
  if (!item) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-950">Edit Team Member</h1>
      <div className="mt-8">
        <TeamMemberForm initial={item} />
      </div>
    </div>
  );
}
