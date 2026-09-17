/** Pure helpers shared by the admin bulk uploader and (indirectly) the public grid — no server-only imports, safe in client components. */

export type GalleryMediaType = "IMAGE" | "VIDEO";

export function mediaTypeFromMime(mime: string): GalleryMediaType | null {
  if (mime.startsWith("image/")) return "IMAGE";
  if (mime.startsWith("video/")) return "VIDEO";
  return null;
}

/** Turns "areca-nut_packaging_02.jpg" into "Areca nut packaging 02". */
export function deriveAltText(filename: string): string {
  const withoutExtension = filename.replace(/\.[^./\\]+$/, "");
  const spaced = withoutExtension.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  if (!spaced) return "Gallery item";
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}
