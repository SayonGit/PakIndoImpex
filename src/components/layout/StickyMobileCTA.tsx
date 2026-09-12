import { useTranslations } from "next-intl";
import { QuoteModalTrigger } from "@/components/quote/QuoteModalTrigger";

/** Persistent mobile-only quote CTA so the primary conversion is always one tap away. */
export function StickyMobileCTA() {
  const t = useTranslations("nav");

  return (
    <div
      className="shadow-soft-lg fixed inset-x-0 bottom-0 z-40 rounded-t-2xl border-t border-ink-100 bg-white/95 p-3 backdrop-blur-md sm:hidden"
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
    >
      <QuoteModalTrigger variant="primary" size="lg" className="w-full">
        {t("requestQuote")}
      </QuoteModalTrigger>
    </div>
  );
}
