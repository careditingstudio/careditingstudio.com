import { isAdminHostFromIncomingHeaders } from "@/lib/admin-host";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * Short URL for admin site-wide settings. See `library/page.tsx` for rationale.
 */
export default async function SiteShortcutPage() {
  const h = await headers();
  if (!isAdminHostFromIncomingHeaders((name) => h.get(name))) notFound();
  redirect("/admin-panel/settings");
}
