/**
 * Real, freely-licensed photography used on the homepage hero (floating
 * nuts, leaf accents). Unlike src/lib/placeholder-images.ts (generic,
 * unrelated placeholder imagery), these are genuinely areca/betel nut and
 * palm leaf photos — sourced via web search, each verified live before use.
 * They are still not Pakindo's own photography, so alt text stays
 * generic/descriptive rather than implying these are the company's
 * facilities or product.
 *
 * Licensing:
 * - Pixabay Content License images: free for commercial use, no
 *   attribution required.
 * - The Wikimedia Commons cross-section photo is CC BY-SA 3.0 Singapore
 *   and DOES require attribution — see ARECA_NUT_SPLIT_CREDIT below, and
 *   make sure that credit stays rendered somewhere on the page using it
 *   (currently: the footer) for as long as the image is in use.
 *
 * Source pages (for reference / re-verification):
 * - https://pixabay.com/photos/areca-nut-betel-nut-fruit-harvested-4033593/
 * - https://pixabay.com/photos/areca-nut-palm-seed-areca-palm-241989/
 * - https://pixabay.com/photos/areca-nut-fruit-red-ripe-plant-4671646/
 * - https://pixabay.com/illustrations/palm-leaf-leaves-green-tropical-4284589/
 * - https://commons.wikimedia.org/wiki/File:Areca_nut_cross-section,_2026-06-12.jpg
 */
export const ARECA_NUT_PHOTOS = [
  "https://cdn.pixabay.com/photo/2019/03/04/08/48/areca-nut-4033593_1280.jpg",
  "https://cdn.pixabay.com/photo/2014/01/11/07/10/areca-nut-241989_1280.jpg",
  "https://cdn.pixabay.com/photo/2019/12/04/04/24/areca-nut-4671646_1280.jpg",
] as const;

/** Cut/halved areca nut showing the marbled cross-section — CC BY-SA 3.0 SG, attribution required (see ARECA_NUT_SPLIT_CREDIT). */
export const ARECA_NUT_SPLIT_PHOTO =
  "https://upload.wikimedia.org/wikipedia/commons/5/5a/Areca_nut_cross-section%2C_2026-06-12.jpg";

export const ARECA_NUT_SPLIT_CREDIT = {
  text: 'Areca nut cross-section photo by "Whyiseverythingalreadyused" (Wikimedia Commons), CC BY-SA 3.0',
  href: "https://commons.wikimedia.org/wiki/File:Areca_nut_cross-section,_2026-06-12.jpg",
};

export const PALM_LEAF_PHOTO =
  "https://cdn.pixabay.com/photo/2019/06/19/10/27/palm-4284589_1280.jpg";
