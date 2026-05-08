import { isAdminHostFromIncomingHeaders } from "@/lib/admin-host";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * Short URL for the admin upload library. Middleware rewrites to /admin-panel/*
 * are not reliable for every path on the admin host; this route always runs.
 */
export default async function LibraryShortcutPage() {
  const h = await headers();
  if (!isAdminHostFromIncomingHeaders((name) => h.get(name))) notFound();
  redirect("/admin-panel/library");
}
