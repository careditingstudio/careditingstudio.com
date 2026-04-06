import { PublicHomePage } from "@/components/PublicHomePage";
import { AdminPortalRoot } from "@/components/admin/AdminPortalRoot";
import { isAdminHostFromIncomingHeaders } from "@/lib/admin-host";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export default async function Home() {
  const h = await headers();
  if (isAdminHostFromIncomingHeaders((name) => h.get(name))) {
    return <AdminPortalRoot />;
  }

  return <PublicHomePage />;
}
