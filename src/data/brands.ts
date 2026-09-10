export type Brand = {
  name: string;
  /** Path under /public, e.g. "/images/brands/acme.png" */
  logoSrc: string;
};

/**
 * Partner/client company logos for the "Brands We Support" scroller.
 *
 * Empty until verified: assets/CONTENT.md forbids implying a business
 * relationship with a company that hasn't actually been confirmed. Do not
 * add an entry here without (a) a real logo image file in
 * public/images/brands/ and (b) explicit confirmation this is a current,
 * real partner/client. <BrandScroller /> renders nothing while this is
 * empty, so it's safe to leave wired into pages ahead of time.
 */
export const BRANDS: Brand[] = [];
