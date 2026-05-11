import type { NextRequest, NextResponse } from "next/server";
import { countryPrefsFromCode } from "@/lib/country-currency-locale";

export const CES_CC = "ces_cc";
export const CES_CUR = "ces_cur";
export const CES_LOC = "ces_loc";
export const CES_MANUAL = "ces_manual";

export const H_CC = "x-ces-cc";
export const H_CUR = "x-ces-currency";
export const H_LOC = "x-ces-locale";
export const H_ALT = "x-ces-alt-locale";
export const H_SHOW_BAR = "x-ces-show-lang-bar";

const COOKIE_BASE = {
  path: "/",
  maxAge: 60 * 60 * 24 * 400,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

export function inferCountryCode(request: NextRequest): string {
  const v =
    request.headers.get("x-vercel-ip-country")?.trim() ||
    request.headers.get("cf-ipcountry")?.trim() ||
    "";
  if (!v || v === "XX" || v.length !== 2) return "US";
  return v.toUpperCase().slice(0, 2);
}

export function applyVisitorRequestHeaders(request: NextRequest): {
  country: string;
  currency: string;
  locale: string;
  altLocale: string;
  showLangBar: boolean;
  headers: Headers;
} {
  const manual = request.cookies.get(CES_MANUAL)?.value === "1";
  const geoCountry = inferCountryCode(request);
  const geoPrefs = countryPrefsFromCode(geoCountry);

  const country = (
    manual && request.cookies.get(CES_CC)?.value?.trim()
      ? request.cookies.get(CES_CC)!.value.trim()
      : geoCountry
  )
    .toUpperCase()
    .slice(0, 2);

  const prefs = countryPrefsFromCode(country);

  const currency = (
    manual && request.cookies.get(CES_CUR)?.value?.trim()
      ? request.cookies.get(CES_CUR)!.value.trim()
      : prefs.currency
  )
    .toUpperCase()
    .slice(0, 3);

  const rawLoc = manual && request.cookies.get(CES_LOC)?.value?.trim()
    ? request.cookies.get(CES_LOC)!.value.trim()
    : geoPrefs.locale;

  const locale = rawLoc
    .toLowerCase()
    .replace(/[^a-z-]/g, "")
    .slice(0, 12);

  const safeLocale = locale || "en";
  const altLocale = prefs.locale === "en" ? "en" : prefs.locale;
  const showLangBar = altLocale !== "en";

  const headers = new Headers(request.headers);
  headers.set(H_CC, country);
  headers.set(H_CUR, currency);
  headers.set(H_LOC, safeLocale);
  headers.set(H_ALT, altLocale);
  headers.set(H_SHOW_BAR, showLangBar ? "1" : "0");

  return {
    country,
    currency,
    locale: safeLocale,
    altLocale,
    showLangBar,
    headers,
  };
}

export function persistVisitorCookies(
  request: NextRequest,
  response: NextResponse,
  prefs: { country: string; currency: string; locale: string },
): void {
  if (request.cookies.get(CES_MANUAL)?.value === "1") return;
  response.cookies.set(CES_CC, prefs.country, COOKIE_BASE);
  response.cookies.set(CES_CUR, prefs.currency, COOKIE_BASE);
  response.cookies.set(CES_LOC, prefs.locale, COOKIE_BASE);
}
