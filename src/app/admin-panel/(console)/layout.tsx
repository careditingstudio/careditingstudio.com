import { AdminConsoleShell } from "@/components/admin/AdminConsoleShell";
import type { ReactNode } from "react";

export default function AdminConsoleLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AdminConsoleShell>{children}</AdminConsoleShell>;
}
