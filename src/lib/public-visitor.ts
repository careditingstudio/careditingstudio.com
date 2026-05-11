import { headers } from "next/headers";
import {
  H_ALT,
  H_CC,
  H_CUR,
  H_LOC,
  H_SHOW_BAR,
} from "@/lib/visitor-request";

export type PublicVisitorState = {
  country: string;
  currency: string;
  locale: string;
  altLocale: string;
  showLanguageBar: boolean;
};

export async function getPublicVisitorState(): Promise<PublicVisitorState> {
  const h = await headers();
  const country = (h.get(H_CC) || "US").toUpperCase().slice(0, 2);
  const currency = (h.get(H_CUR) || "USD").toUpperCase().slice(0, 3);
  const locale = (h.get(H_LOC) || "en").toLowerCase().slice(0, 12);
  const altLocale = (h.get(H_ALT) || "en").toLowerCase().slice(0, 12);
  const showLanguageBar = h.get(H_SHOW_BAR) === "1";
  return {
    country,
    currency,
    locale,
    altLocale,
    showLanguageBar,
  };
}
