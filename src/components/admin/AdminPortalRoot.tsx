"use client";

import { AdminConsoleShell } from "@/components/admin/AdminConsoleShell";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

/**
 * Renders the admin shell + dashboard on `/` when the request is on the admin
 * host. Root `page.tsx` uses this so we never flash the public homepage on
 * admin.*. Short paths like `/library` and `/site` use dedicated routes under
 * `app/library` and `app/site` that redirect to `/admin-panel/*` because
 * middleware rewrites are not reliable for every segment.
 */
export function AdminPortalRoot() {
  return (
    <AdminConsoleShell>
      <AdminDashboard />
    </AdminConsoleShell>
  );
}
