import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllTeamMembersForAdmin } from "@/lib/admin-data";
import { TeamMemberListClient } from "@/components/admin/TeamMemberListClient";

export const metadata: Metadata = { title: "Team | Admin" };

export default async function AdminTeamPage() {
  const items = await getAllTeamMembersForAdmin();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-950">Team</h1>
          <p className="mt-1 text-sm text-ink-500">&ldquo;Our People&rdquo; shown on the About page.</p>
        </div>
        <Link
          href="/admin/team/new"
          className="flex items-center gap-1.5 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-all duration-200 ease-spring hover:-translate-y-0.5"
        >
          <Plus className="size-4" aria-hidden />
          Add Team Member
        </Link>
      </div>

      <div className="mt-8">
        <TeamMemberListClient initialItems={items} />
      </div>
    </div>
  );
}
