import { isAdminRequestHost } from "@/lib/admin-host";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function shouldRewriteAdminPath(pathname: string) {
  /** Served by `src/app/editor/*` on the admin host — do not rewrite. */
  if (pathname === "/editor" || pathname.startsWith("/editor/")) return false;
  if (pathname.startsWith("/admin-panel")) return false;
  if (pathname.startsWith("/api")) return false;
  if (pathname.startsWith("/_next")) return false;
  if (pathname.startsWith("/cms")) return false;
  for (const p of ["/hero", "/portfolio", "/icon", "/favicon"]) {
    if (pathname.startsWith(p)) return false;
  }
  if (/\.[a-z0-9]{2,4}$/i.test(pathname)) return false;
  return true;
}

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const { pathname } = request.nextUrl;
  const isAdmin = isAdminRequestHost(host);

  if (!isAdmin && pathname.startsWith("/api/admin")) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!isAdmin && pathname.startsWith("/admin-panel")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isAdmin) {
    if (pathname === "/page" || pathname.startsWith("/page/")) {
      const url = request.nextUrl.clone();
      url.pathname = pathname.replace(/^\/page/, "/editor") || "/editor/home";
      if (url.pathname === "/editor" || url.pathname === "/editor/") {
        url.pathname = "/editor/home";
      }
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith("/media/")) {
      return NextResponse.redirect(new URL("/editor/home", request.url));
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-cms-admin", "1");

    if (shouldRewriteAdminPath(pathname)) {
      const url = request.nextUrl.clone();
      const tail = pathname === "/" ? "" : pathname;
      url.pathname = `/admin-panel${tail}`;
      return NextResponse.rewrite(url, {
        request: { headers: requestHeaders },
      });
    }

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  return NextResponse.next();
}

/**
 * Include `/` and `/login` — the root path does NOT match `/((?!…).*)` on many
 * Next versions. `/site` and `/library` also have real App Router pages (admin
 * redirects); keeping them here preserves any middleware behavior you add later.
 */
export const config = {
  matcher: [
    "/",
    "/login",
    "/site",
    "/library",
    "/page/:path*",
    "/editor",
    "/editor/:path*",
    "/((?!_next/static|_next/image|favicon.ico|icon\\.svg|robots\\.txt).*)",
  ],
};
