"use client";

import { useState } from "react";
import { Loader2, Save, CheckCircle2 } from "lucide-react";
import { TextField, TextAreaField } from "@/components/forms/FormField";

type Status = "idle" | "loading" | "success" | "error";

export function SeoEditRow({
  label,
  sublabel,
  initialTitle,
  initialDescription,
  onSave,
}: {
  label: string;
  sublabel?: string;
  initialTitle: string;
  initialDescription: string;
  onSave: (seoTitle: string, seoDescription: string) => Promise<{ ok: boolean; error?: string }>;
}) {
  const [seoTitle, setSeoTitle] = useState(initialTitle);
  const [seoDescription, setSeoDescription] = useState(initialDescription);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setStatus("loading");
    setError(null);
    const result = await onSave(seoTitle, seoDescription);
    if (!result.ok) {
      setError(result.error ?? "Something went wrong.");
      setStatus("error");
      return;
    }
    setStatus("success");
  }

  return (
    <div className="shadow-soft rounded-2xl border border-ink-100 bg-white p-5">
      <p className="font-semibold text-ink-950">{label}</p>
      {sublabel && <p className="text-xs text-ink-500">{sublabel}</p>}
      <div className="mt-4 space-y-4">
        <TextField
          label="SEO Title"
          name={`${label}-title`}
          value={seoTitle}
          onChange={(event) => setSeoTitle(event.target.value)}
        />
        <TextAreaField
          label="SEO Description"
          name={`${label}-description`}
          value={seoDescription}
          onChange={(event) => setSeoDescription(event.target.value)}
          rows={2}
        />
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={status === "loading"}
          className="flex items-center gap-1.5 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 px-4 py-2 text-sm font-semibold text-white shadow-soft transition-all duration-200 ease-spring hover:-translate-y-0.5 disabled:opacity-60"
        >
          {status === "loading" ? (
            <Loader2 className="size-3.5 animate-spin" aria-hidden />
          ) : (
            <Save className="size-3.5" aria-hidden />
          )}
          Save
        </button>
        {status === "success" && (
          <span className="flex items-center gap-1 text-sm font-semibold text-primary-700">
            <CheckCircle2 className="size-3.5" aria-hidden />
            Saved
          </span>
        )}
        {error && <span className="text-sm font-medium text-secondary-600">{error}</span>}
      </div>
    </div>
  );
}
