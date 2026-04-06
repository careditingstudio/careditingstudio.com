import { AdminConsoleShell } from "@/components/admin/AdminConsoleShell";
import { isAdminHostFromIncomingHeaders } from "@/lib/admin-host";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

/**
 * CMS page editors live at /editor/* on the admin host only.
 * Real filesystem routes avoid relying on middleware rewrites to /admin-panel/...,
 * which were returning 404 for nested dynamic segments in dev.
 */
export default async function EditorLayout({
  children,
}: {
  children: ReactNode;
}) {
  const h = await headers();
  if (!isAdminHostFromIncomingHeaders((name) => h.get(name))) {
    notFound();
  }

  return <AdminConsoleShell>{children}</AdminConsoleShell>;
}
