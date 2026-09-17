"use client";

import { useCallback, useRef, useState, type DragEvent } from "react";
import { UploadCloud, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { clsx } from "clsx";
import { mediaTypeFromMime, deriveAltText } from "@/lib/gallery-media";
import type { GalleryItem } from "@prisma/client";

type FileStatus = "pending" | "uploading" | "success" | "error";
type QueuedFile = { key: string; name: string; status: FileStatus; error?: string };

const ACCEPTED_MIME = ["image/png", "image/jpeg", "image/webp", "video/mp4", "video/webm"];

export function GalleryBulkUploader({ onUploaded }: { onUploaded: (item: GalleryItem) => void }) {
  const [dragging, setDragging] = useState(false);
  const [queue, setQueue] = useState<QueuedFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(async (files: File[]) => {
    const valid = files.filter((file) => ACCEPTED_MIME.includes(file.type));
    if (valid.length === 0) return;

    setProcessing(true);
    setQueue(valid.map((file) => ({ key: `${file.name}-${file.size}-${file.lastModified}`, name: file.name, status: "pending" })));

    for (const file of valid) {
      const key = `${file.name}-${file.size}-${file.lastModified}`;
      const mediaType = mediaTypeFromMime(file.type);
      if (!mediaType) continue;

      setQueue((prev) => prev.map((q) => (q.key === key ? { ...q, status: "uploading" } : q)));

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("category", "gallery");
        const uploadResponse = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const uploadResult = await uploadResponse.json();
        if (!uploadResponse.ok) throw new Error(uploadResult.error ?? "Upload failed.");

        const createResponse = await fetch("/api/admin/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mediaType,
            url: uploadResult.url,
            altText: deriveAltText(file.name),
            published: true,
          }),
        });
        const createResult = await createResponse.json();
        if (!createResponse.ok) throw new Error(createResult.error ?? "Could not save item.");

        setQueue((prev) => prev.map((q) => (q.key === key ? { ...q, status: "success" } : q)));
        onUploaded(createResult.item);
      } catch (error) {
        setQueue((prev) =>
          prev.map((q) => (q.key === key ? { ...q, status: "error", error: error instanceof Error ? error.message : "Failed." } : q))
        );
      }
    }

    setProcessing(false);
  }, [onUploaded]);

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    processFiles(Array.from(event.dataTransfer.files));
  }

  return (
    <div>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        className={clsx(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors duration-200",
          dragging ? "border-primary-500 bg-primary-50/60" : "border-ink-200 bg-white hover:border-primary-300"
        )}
      >
        <span className="flex size-12 items-center justify-center rounded-full bg-primary-50 text-primary-700">
          <UploadCloud className="size-6" aria-hidden />
        </span>
        <p className="text-sm font-semibold text-ink-800">Drag & drop photos or videos here, or click to browse</p>
        <p className="text-xs text-ink-500">PNG, JPEG, WEBP, MP4, or WEBM. Multiple files at once. Alt text is generated automatically.</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED_MIME.join(",")}
          className="hidden"
          onChange={(event) => {
            processFiles(Array.from(event.target.files ?? []));
            event.target.value = "";
          }}
        />
      </div>

      {queue.length > 0 && (
        <ul className="mt-4 space-y-1.5">
          {queue.map((item) => (
            <li key={item.key} className="flex items-center gap-2 text-sm text-ink-600">
              {item.status === "uploading" && <Loader2 className="size-3.5 shrink-0 animate-spin text-ink-400" aria-hidden />}
              {item.status === "pending" && <span className="size-3.5 shrink-0 rounded-full bg-ink-200" aria-hidden />}
              {item.status === "success" && <CheckCircle2 className="size-3.5 shrink-0 text-primary-600" aria-hidden />}
              {item.status === "error" && <AlertCircle className="size-3.5 shrink-0 text-secondary-600" aria-hidden />}
              <span className="truncate">{item.name}</span>
              {item.status === "error" && <span className="text-xs text-secondary-600">{item.error}</span>}
            </li>
          ))}
        </ul>
      )}
      {processing && <p className="mt-2 text-xs text-ink-500">Uploading…</p>}
    </div>
  );
}
