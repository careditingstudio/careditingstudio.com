/**
 * True when the request Host is the admin subdomain (e.g. admin.localhost,
 * admin.example.com). Use in middleware and root layout — do not rely only on
 * custom headers, which may not reach layouts in all environments.
 */
export function isAdminRequestHost(hostHeader: string | null): boolean {
  const h = hostHeader?.split(":")[0]?.trim().toLowerCase() ?? "";
  if (!h) return false;
  if (h === "admin.localhost") return true;
  if (h.startsWith("admin.")) return true;
  return false;
}
