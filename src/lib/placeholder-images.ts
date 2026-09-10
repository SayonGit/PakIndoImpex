/**
 * TEMPORARY generic placeholder images for visual preview only — not real
 * Pakindo photography. assets/CONTENT.md requires real photos (or an
 * honest photo-less design) rather than stock images implied to be the
 * company's own facilities/products, so these must be swapped for verified
 * photography (or removed in favor of the graphic design system) before
 * production launch. Every call site that uses these should read from this
 * one place so they're easy to find and rip out later.
 *
 * picsum.photos/seed/<seed>/<w>/<h> returns a deterministic (same seed =
 * same photo every time) generic stock photo, not connected to Pakindo.
 * i.pravatar.cc/<size>?u=<seed> returns a deterministic generic fake
 * portrait, purpose-built for exactly this "placeholder person" use case.
 */
export function placeholderPhoto(seed: string, width = 800, height = 600): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;
}

export function placeholderAvatar(seed: string, size = 300): string {
  return `https://i.pravatar.cc/${size}?u=${encodeURIComponent(seed)}`;
}
