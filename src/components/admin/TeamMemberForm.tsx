"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { TextField } from "@/components/forms/FormField";
import { Button } from "@/components/ui/Button";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import type { TeamMember } from "@prisma/client";

type Status = "idle" | "loading" | "error";

export function TeamMemberForm({ initial }: { initial?: TeamMember }) {
  const router = useRouter();
  const [photoUrl, setPhotoUrl] = useState<string | null>(initial?.photoUrl ?? null);
  const [published, setPublished] = useState(initial?.published ?? true);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get("name"),
      role: formData.get("role"),
      photoUrl: photoUrl ?? "",
      published,
    };

    try {
      const response = await fetch(initial ? `/api/admin/team/${initial.id}` : "/api/admin/team", {
        method: initial ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error ?? "Something went wrong.");
        setStatus("error");
        return;
      }
      router.push("/admin/team");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="shadow-soft space-y-5 rounded-2xl border border-ink-100 bg-white p-6">
        <TextField label="Name" name="name" defaultValue={initial?.name} required />
        <TextField label="Role" name="role" defaultValue={initial?.role} placeholder="e.g. Export Manager" required />

        <ImageUploadField
          label="Photo (optional)"
          value={photoUrl}
          onChange={setPhotoUrl}
          category="team"
          hint="Falls back to a generic avatar if not set."
        />

        <label className="flex items-center gap-2.5 text-sm font-semibold text-ink-800">
          <input
            type="checkbox"
            checked={published}
            onChange={(event) => setPublished(event.target.checked)}
            className="size-4 rounded border-ink-300 text-primary-600 focus:ring-primary-500"
          />
          Published (visible on the site)
        </label>
      </div>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={status === "loading"}>
          {status === "loading" ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Save className="size-4" aria-hidden />
          )}
          {initial ? "Save Changes" : "Add Team Member"}
        </Button>
        {error && <span className="text-sm font-medium text-secondary-600">{error}</span>}
      </div>
    </form>
  );
}
