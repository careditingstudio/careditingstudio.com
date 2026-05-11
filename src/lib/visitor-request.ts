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
  /** Local dev is usually http:// — Secure cookies would not be stored, breaking geo/currency prefs. */
  secure: process.env.NODE_ENV === "production",
};

/** Optional server env `VISITOR_COUNTRY_OVERRIDE=DK` (ISO2) to simulate geo when IP headers are missing. */
function countryFromEnvOverride(): string | null {
  const raw =
    process.env.VISITOR_COUNTRY_OVERRIDE?.trim() ||
    process.env.NEXT_PUBLIC_VISITOR_COUNTRY?.trim();
  if (!raw || raw.length !== 2) return null;
  return raw.toUpperCase().slice(0, 2);
}

/**
 * When CDN geo headers are absent (common on localhost), infer country from the
 * first BCP47 tag that includes a region, e.g. `da-DK` → DK, `en-DK` → DK.
 */
function countryFromAcceptLanguage(header: string | null): string | null {
  if (!header?.trim()) return null;
  const parts = header.split(",").map((s) => s.trim().split(";")[0]!.trim());
  for (const part of parts) {
    const m = /^[a-z]{2}-([a-z]{2})$/i.exec(part);
    if (!m?.[1]) continue;
    const cc = m[1].toUpperCase();
    if (cc.length === 2) return cc;
  }
  return null;
}

export function inferCountryCode(request: NextRequest): string {
  const fromEnv = countryFromEnvOverride();
  if (fromEnv) return fromEnv;

  const fromCdn =
    request.headers.get("x-vercel-ip-country")?.trim() ||
    request.headers.get("cf-ipcountry")?.trim() ||
    "";
  if (fromCdn && fromCdn !== "XX" && fromCdn.length === 2) {
    return fromCdn.toUpperCase().slice(0, 2);
  }

  const fromLang = countryFromAcceptLanguage(request.headers.get("accept-language"));
  if (fromLang) return fromLang;

  return "US";
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
  /** Always use inferred geo for pricing/currency so it updates when you travel; `ces_manual` only pins UI language. */
  const country = geoCountry.toUpperCase().slice(0, 2);

  const prefs = countryPrefsFromCode(country);
  const currency = prefs.currency.toUpperCase().slice(0, 3);

  const rawLoc = manual && request.cookies.get(CES_LOC)?.value?.trim()
    ? request.cookies.get(CES_LOC)!.value.trim()
    : prefs.locale;

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
