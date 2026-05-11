import { cookies, headers } from "next/headers";
import { resolveVisitorState } from "@/lib/visitor-request";

export type PublicVisitorState = {
  country: string;
  currency: string;
  locale: string;
  altLocale: string;
  showLanguageBar: boolean;
};

/**
 * Resolves visitor country/currency/locale from request headers (CDN geo,
 * Accept-Language) and cookies — same rules as middleware. Do not read only
 * `x-ces-*` here; those headers are not always exposed to `headers()` in RSC.
 */
export async function getPublicVisitorState(): Promise<PublicVisitorState> {
  const h = await headers();
  const c = await cookies();
  const v = resolveVisitorState(h, (n) => c.get(n)?.value?.trim());
  return {
    country: v.country,
    currency: v.currency,
    locale: v.locale,
    altLocale: v.altLocale,
    showLanguageBar: v.showLangBar,
  };
}
