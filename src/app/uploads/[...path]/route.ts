import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { uploadsRootDir, contentTypeForFilename, UPLOAD_CATEGORIES } from "@/lib/uploads";

/**
 * Serves files saved by saveUploadedFile() (see src/lib/uploads.ts) straight
 * from disk on every request — deliberately not relying on Next's public/
 * static file serving, which snapshots its directory listing at server
 * startup in production and would 404 anything uploaded after boot.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await params;

  // Expect exactly [category, filename] — reject anything else outright
  // (also blocks ".." traversal attempts, which would never match a real
  // category name).
  const [category, filename] = segments;
  if (segments.length !== 2 || !UPLOAD_CATEGORIES.includes(category as (typeof UPLOAD_CATEGORIES)[number])) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const root = uploadsRootDir();
  const filePath = path.join(root, category, filename);

  // Belt-and-suspenders: confirm the resolved path is still inside the
  // uploads root before touching the filesystem.
  if (!filePath.startsWith(root + path.sep)) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const contentType = contentTypeForFilename(filename);
  if (!contentType) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  try {
    await stat(filePath);
    const buffer = await readFile(filePath);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": contentType,
        // Filenames are random UUIDs — a given URL's content never changes.
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
}
