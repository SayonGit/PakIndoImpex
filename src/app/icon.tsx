import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { getSiteSettings } from "@/lib/data";
import { contentTypeForFilename } from "@/lib/uploads";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

function DefaultIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#126a16",
          color: "#fdda7e",
          fontSize: 38,
          fontWeight: 800,
          fontFamily: "sans-serif",
        }}
      >
        P
      </div>
    ),
    { ...size }
  );
}

export default async function Icon() {
  const settings = await getSiteSettings();
  if (!settings.faviconUrl) return DefaultIcon();

  try {
    // faviconUrl is always "/uploads/favicon/<file>" (see saveUploadedFile()
    // in src/lib/uploads.ts) — only the filename itself is unpredictable, so
    // we join it onto a fully static "uploads/favicon" base. Turbopack can
    // then scope its build-time file tracing to that one subfolder instead
    // of tracing (and bundling) the entire project, which is what happens
    // if any part of the path is opaque to static analysis.
    const filename = path.basename(settings.faviconUrl);
    const filePath = path.join(process.cwd(), "uploads", "favicon", filename);
    const buffer = await readFile(filePath);
    return new Response(new Uint8Array(buffer), {
      headers: { "Content-Type": contentTypeForFilename(filename) ?? "image/png" },
    });
  } catch {
    return DefaultIcon();
  }
}
