"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import type { UploadCategory } from "@/lib/uploads";

export function ImageUploadField({
  label,
  value,
  onChange,
  category,
  hint,
}: {
  label: string;
  value: string | null;
  onChange: (url: string | null) => void;
  category: UploadCategory;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", category);
      const response = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error ?? "Upload failed.");
        return;
      }
      onChange(result.url);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-ink-800">{label}</label>
      {hint && <p className="mb-2 text-xs text-ink-500">{hint}</p>}
      <div className="flex items-center gap-4">
        <div className="shadow-soft flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-ink-100 bg-white">
          {value ? (
            <Image src={value} alt="" width={80} height={80} className="size-full object-contain" />
          ) : (
            <span className="text-[10px] font-medium text-ink-300">No image</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5 rounded-full border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-700 transition-all duration-200 ease-spring hover:border-primary-300 hover:text-primary-700 disabled:opacity-60"
          >
            {uploading ? <Loader2 className="size-3.5 animate-spin" aria-hidden /> : <Upload className="size-3.5" aria-hidden />}
            {value ? "Replace" : "Upload"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="flex items-center gap-1.5 text-xs font-medium text-ink-400 hover:text-secondary-600"
            >
              <X className="size-3" aria-hidden />
              Remove
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml,image/x-icon"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      {error && (
        <p role="alert" className="mt-1.5 text-xs font-medium text-secondary-600">
          {error}
        </p>
      )}
    </div>
  );
}
