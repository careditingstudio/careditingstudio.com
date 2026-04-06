import { AdminConsoleShell } from "@/components/admin/AdminConsoleShell";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";

export default async function AdminConsoleLayout({
  children,
}: {
  children: ReactNode;
}) {
  const authed = await isAdminAuthenticated();
  if (!authed) redirect("/admin-panel/login");
  return <AdminConsoleShell>{children}</AdminConsoleShell>;
}
