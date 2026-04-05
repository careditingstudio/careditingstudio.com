import { PublicHomePage } from "@/components/PublicHomePage";
import { AdminPortalRoot } from "@/components/admin/AdminPortalRoot";
import { isAdminRequestHost } from "@/lib/admin-host";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export default async function Home() {
  const host = (await headers()).get("host");
  if (isAdminRequestHost(host)) {
    return <AdminPortalRoot />;
  }

  return <PublicHomePage />;
}
