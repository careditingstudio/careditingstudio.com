import { isAdminHostFromIncomingHeaders } from "@/lib/admin-host";
import { NextResponse, type NextRequest } from "next/server";

const ADMIN_SESSION_COOKIE = "cms_admin";

function hasAdminCookie(req: NextRequest): boolean {
  return Boolean(req.cookies.get(ADMIN_SESSION_COOKIE)?.value);
}

function adminEnvConfigured(): boolean {
  const secret = process.env.CMS_AUTH_SECRET?.trim();
  const user = process.env.ADMIN_USERNAME?.trim();
  const pass = process.env.ADMIN_PASSWORD?.trim();
  return Boolean(
    secret &&
      secret.length >= 16 &&
      user &&
      user.length >= 3 &&
      pass &&
      pass.length >= 8,
  );
}

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
  const { pathname } = request.nextUrl;
  const isAdmin = isAdminHostFromIncomingHeaders((n) => request.headers.get(n));

  // Public host should not expose admin pages/APIs.
  if (!isAdmin && pathname.startsWith("/api/admin")) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (!isAdmin && pathname.startsWith("/admin-panel")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Admin host: enforce login for admin panel + admin APIs.
  if (isAdmin) {
    const isAdminPanel = pathname === "/admin-panel" || pathname.startsWith("/admin-panel/");
    const isAdminApi = pathname.startsWith("/api/admin/");
    const isLoginPage = pathname === "/admin-panel/login";
    const isLoginApi = pathname === "/api/admin/login";
    const isLogoutApi = pathname === "/api/admin/logout";

    if ((isAdminPanel || isAdminApi) && !isLoginPage && !isLoginApi && !isLogoutApi) {
      // In production, fail closed if auth is not configured.
      if (process.env.NODE_ENV === "production" && !adminEnvConfigured()) {
        if (isAdminApi) {
          return NextResponse.json(
            { error: "Admin auth is not configured." },
            { status: 503 },
          );
        }
        return NextResponse.redirect(new URL("/admin-panel/login", request.url));
      }

      if (!hasAdminCookie(request)) {
        if (isAdminApi) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.redirect(new URL("/admin-panel/login", request.url));
      }
    }

    // Keep legacy admin-host conveniences.
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
    "/((?!_next/static|_next/image|favicon.ico|icon\\.svg|icon\\.png|robots\\.txt).*)",
  ],
};
