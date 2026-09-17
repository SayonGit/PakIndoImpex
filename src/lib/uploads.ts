import { randomUUID } from "node:crypto";
import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";

/**
 * Only these live under <project root>/uploads — keeps the upload endpoint
 * from ever being pointed at an arbitrary path. Filenames are always
 * generated (never taken from the client), so there's no path-traversal
 * surface.
 *
 * Deliberately NOT under public/: Next's production server (`next start`)
 * snapshots the public/ directory listing at startup, so a file written
 * there after boot 404s until the process restarts — a non-starter for an
 * admin upload feature. These are served instead by
 * src/app/uploads/[...path]/route.ts, which reads straight from disk on
 * every request.
 */
export const UPLOAD_CATEGORIES = ["logo", "favicon", "gallery", "articles", "team"] as const;
export type UploadCategory = (typeof UPLOAD_CATEGORIES)[number];

export const MIME_EXTENSIONS: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  "image/x-icon": "ico",
  "image/vnd.microsoft.icon": "ico",
  "video/mp4": "mp4",
  "video/webm": "webm",
};

/** Which mime types each category accepts — gallery is the only one that takes video. */
const CATEGORY_MIME_TYPES: Record<UploadCategory, string[]> = {
  logo: ["image/png", "image/jpeg", "image/webp", "image/svg+xml"],
  favicon: ["image/png", "image/x-icon", "image/vnd.microsoft.icon"],
  articles: ["image/png", "image/jpeg", "image/webp"],
  gallery: ["image/png", "image/jpeg", "image/webp", "video/mp4", "video/webm"],
  team: ["image/png", "image/jpeg", "image/webp"],
};

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

export function uploadsRootDir(): string {
  return path.join(process.cwd(), "uploads");
}

const CONTENT_TYPE_BY_EXTENSION: Record<string, string> = Object.fromEntries(
  Object.entries(MIME_EXTENSIONS).map(([mime, ext]) => [ext, mime])
);

export function contentTypeForFilename(filename: string): string | undefined {
  const extension = filename.split(".").pop()?.toLowerCase() ?? "";
  return CONTENT_TYPE_BY_EXTENSION[extension];
}

export class UploadError extends Error {}

/** Saves an uploaded image under <project root>/uploads/<category>/ and returns its public URL. */
export async function saveUploadedFile(file: File, category: UploadCategory): Promise<string> {
  if (!UPLOAD_CATEGORIES.includes(category)) {
    throw new UploadError("Invalid upload category.");
  }
  if (file.size === 0) {
    throw new UploadError("The uploaded file is empty.");
  }
  if (!CATEGORY_MIME_TYPES[category].includes(file.type)) {
    throw new UploadError("Unsupported file type for this upload.");
  }
  const isVideo = file.type.startsWith("video/");
  const maxSize = isVideo ? MAX_VIDEO_SIZE_BYTES : MAX_IMAGE_SIZE_BYTES;
  if (file.size > maxSize) {
    throw new UploadError(`File is too large (max ${isVideo ? "50MB" : "5MB"}).`);
  }
  const extension = MIME_EXTENSIONS[file.type];

  const dir = path.join(uploadsRootDir(), category);
  await mkdir(dir, { recursive: true });

  const filename = `${randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), buffer);

  return `/uploads/${category}/${filename}`;
}

/**
 * Deletes a file previously returned by saveUploadedFile(), given its
 * public URL (e.g. "/uploads/gallery/<uuid>.png"). Call this whenever a
 * row referencing an uploaded file is deleted, or the file is replaced —
 * otherwise the physical file is orphaned on disk forever. Silently no-ops
 * for anything that isn't one of our own "/uploads/<category>/<file>" URLs
 * (e.g. the "/images/logo.png" static fallback), and for a file that's
 * already gone.
 */
export async function deleteUploadedFile(url: string): Promise<void> {
  const match = /^\/uploads\/([^/]+)\/([^/]+)$/.exec(url);
  if (!match) return;
  const [, category, filename] = match;
  if (!UPLOAD_CATEGORIES.includes(category as UploadCategory)) return;

  const filePath = path.join(uploadsRootDir(), category, filename);
  await unlink(filePath).catch(() => {});
}
