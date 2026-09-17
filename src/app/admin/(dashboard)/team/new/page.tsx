import type { Metadata } from "next";
import { TeamMemberForm } from "@/components/admin/TeamMemberForm";

export const metadata: Metadata = { title: "Add Team Member | Admin" };

export default function NewTeamMemberPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-950">Add Team Member</h1>
      <div className="mt-8">
        <TeamMemberForm />
      </div>
    </div>
  );
}
