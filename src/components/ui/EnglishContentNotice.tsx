import { getLocale, getTranslations } from "next-intl/server";
import { defaultLocale } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";

/**
 * Shown on pages whose body copy is English-only for now (see i18n scope
 * note in README). Nav, footer, and the homepage are fully localized;
 * deeper pages remain English until professionally translated.
 */
export async function EnglishContentNotice() {
  const locale = await getLocale();
  if (locale === defaultLocale) return null;

  const t = await getTranslations("switcher");

  return (
    <div className="border-b border-gold-200 bg-gold-50">
      <Container className="py-2.5 text-center text-xs font-medium text-gold-800">
        {t("englishFallback")}
      </Container>
    </div>
  );
}
