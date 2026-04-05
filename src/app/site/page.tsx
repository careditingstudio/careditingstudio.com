import { isAdminRequestHost } from "@/lib/admin-host";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/**
 * Short URL for admin site-wide settings. See `library/page.tsx` for rationale.
 */
export default async function SiteShortcutPage() {
  const host = (await headers()).get("host");
  if (!isAdminRequestHost(host)) notFound();
  redirect("/admin-panel/site");
}
