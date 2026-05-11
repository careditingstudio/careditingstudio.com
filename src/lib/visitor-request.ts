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

/**
 * Infer ISO2 country from CDN/geo headers and Accept-Language.
 * Used by middleware and by Server Components — do not rely only on `x-ces-*`
 * (those are not always visible to `headers()` in the App Router on Vercel).
 */
export function inferCountryFromHeaders(headers: Headers): string {
  const fromEnv = countryFromEnvOverride();
  if (fromEnv) return fromEnv;

  const fromCdn =
    headers.get("x-vercel-ip-country")?.trim() ||
    headers.get("cf-ipcountry")?.trim() ||
    headers.get(H_CC)?.trim() ||
    "";
  if (fromCdn && fromCdn !== "XX" && fromCdn.length === 2) {
    return fromCdn.toUpperCase().slice(0, 2);
  }

  const fromLang = countryFromAcceptLanguage(headers.get("accept-language"));
  if (fromLang) return fromLang;

  return "US";
}

export function inferCountryCode(request: NextRequest): string {
  return inferCountryFromHeaders(request.headers);
}

export type ResolvedVisitorState = {
  country: string;
  currency: string;
  locale: string;
  altLocale: string;
  showLangBar: boolean;
};

/** Single source of truth for visitor prefs (geo + optional manual UI language). */
export function resolveVisitorState(
  headers: Headers,
  cookieValue: (name: string) => string | undefined,
): ResolvedVisitorState {
  const manual = cookieValue(CES_MANUAL) === "1";
  const country = inferCountryFromHeaders(headers).toUpperCase().slice(0, 2);
  const prefs = countryPrefsFromCode(country);
  const currency = prefs.currency.toUpperCase().slice(0, 3);

  const rawLoc =
    manual && cookieValue(CES_LOC) ? cookieValue(CES_LOC)! : prefs.locale;

  const locale = rawLoc
    .toLowerCase()
    .replace(/[^a-z-]/g, "")
    .slice(0, 12);
  const safeLocale = locale || "en";
  const altLocale = prefs.locale === "en" ? "en" : prefs.locale;
  const showLangBar = altLocale !== "en";

  return {
    country,
    currency,
    locale: safeLocale,
    altLocale,
    showLangBar,
  };
}

export function applyVisitorRequestHeaders(request: NextRequest): {
  country: string;
  currency: string;
  locale: string;
  altLocale: string;
  showLangBar: boolean;
  headers: Headers;
} {
  const v = resolveVisitorState(request.headers, (n) =>
    request.cookies.get(n)?.value?.trim(),
  );
  const headers = new Headers(request.headers);
  headers.set(H_CC, v.country);
  headers.set(H_CUR, v.currency);
  headers.set(H_LOC, v.locale);
  headers.set(H_ALT, v.altLocale);
  headers.set(H_SHOW_BAR, v.showLangBar ? "1" : "0");

  return {
    country: v.country,
    currency: v.currency,
    locale: v.locale,
    altLocale: v.altLocale,
    showLangBar: v.showLangBar,
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
