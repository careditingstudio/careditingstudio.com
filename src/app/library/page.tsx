import { isAdminRequestHost } from "@/lib/admin-host";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/**
 * Short URL for the admin upload library. Middleware rewrites to /admin-panel/*
 * are not reliable for every path on the admin host; this route always runs.
 */
export default async function LibraryShortcutPage() {
  const host = (await headers()).get("host");
  if (!isAdminRequestHost(host)) notFound();
  redirect("/admin-panel/library");
}
