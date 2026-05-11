import { NextResponse, type NextRequest } from "next/server";
import { VISITOR_I18N_ENABLED } from "@/config/visitor-i18n-gate";
import { CES_LOC, CES_MANUAL } from "@/lib/visitor-request";

const ALLOW = new Set([
  "en",
  "bn",
  "es",
  "de",
  "fr",
  "hi",
  "pt",
  "ja",
  "ko",
  "zh",
  "ar",
  "it",
  "nl",
  "pl",
  "tr",
  "ru",
  "vi",
  "th",
  "id",
]);

export function GET(request: NextRequest) {
  if (!VISITOR_I18N_ENABLED) {
    return NextResponse.json(
      { error: "Visitor language switching is disabled." },
      { status: 404 },
    );
  }
  const url = request.nextUrl;
  const raw = url.searchParams.get("locale")?.toLowerCase().trim() ?? "";
  const locale = ALLOW.has(raw) ? raw : "en";
  const redirectTo = url.searchParams.get("redirect")?.trim() || "/";
  let target: URL;
  try {
    target = new URL(redirectTo, request.url);
  } catch {
    target = new URL("/", request.url);
  }
  if (target.origin !== new URL(request.url).origin) {
    target = new URL("/", request.url);
  }

  const res = NextResponse.redirect(target);
  res.cookies.set(CES_LOC, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 400,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.cookies.set(CES_MANUAL, "1", {
    path: "/",
    maxAge: 60 * 60 * 24 * 400,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
