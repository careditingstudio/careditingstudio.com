/**
 * True when the request Host is the admin subdomain (e.g. admin.localhost,
 * admin.careditingstudio.com). Use in middleware and root layout — do not rely
 * only on custom headers, which may not reach layouts in all environments.
 */
export function isAdminRequestHost(hostHeader: string | null | undefined): boolean {
  const h = hostHeader?.split(":")[0]?.trim().toLowerCase() ?? "";
  if (!h) return false;
  if (h === "admin.localhost") return true;
  if (h.startsWith("admin.")) return true;
  return false;
}

/**
 * Resolves admin mode from Host and optional X-Forwarded-Host (some proxies
 * preserve the visitor hostname there). Also honors x-cms-admin from middleware.
 */
export function isAdminHostFromIncomingHeaders(
  getHeader: (name: string) => string | null | undefined,
): boolean {
  if (getHeader("x-cms-admin") === "1") return true;
  const host = getHeader("host") ?? null;
  const xf = getHeader("x-forwarded-host");
  const forwardedFirst = xf?.split(",")[0]?.trim() ?? null;
  return (
    isAdminRequestHost(host) ||
    isAdminRequestHost(forwardedFirst)
  );
}
