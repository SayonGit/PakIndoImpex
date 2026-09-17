"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { TextField, TextAreaField } from "@/components/forms/FormField";
import { Button } from "@/components/ui/Button";
import type { Testimonial } from "@prisma/client";

type Status = "idle" | "loading" | "error";

export function TestimonialForm({ initial }: { initial?: Testimonial }) {
  const router = useRouter();
  const [published, setPublished] = useState(initial?.published ?? true);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      quote: formData.get("quote"),
      role: formData.get("role"),
      country: formData.get("country"),
      published,
    };

    try {
      const response = await fetch(
        initial ? `/api/admin/testimonials/${initial.id}` : "/api/admin/testimonials",
        {
          method: initial ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const result = await response.json();
      if (!response.ok) {
        setError(result.error ?? "Something went wrong.");
        setStatus("error");
        return;
      }
      router.push("/admin/testimonials");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="shadow-soft space-y-5 rounded-2xl border border-ink-100 bg-white p-6">
        <TextAreaField label="Quote" name="quote" defaultValue={initial?.quote} required rows={4} />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Role" name="role" defaultValue={initial?.role} placeholder="e.g. Importer" required />
          <TextField label="Country" name="country" defaultValue={initial?.country} placeholder="e.g. India" required />
        </div>

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
          {initial ? "Save Changes" : "Create Testimonial"}
        </Button>
        {error && <span className="text-sm font-medium text-secondary-600">{error}</span>}
      </div>
    </form>
  );
}
