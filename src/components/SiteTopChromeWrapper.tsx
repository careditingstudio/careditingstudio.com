import { DevPostgresDisconnectedBanner } from "@/components/DevPostgresDisconnectedBanner";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteTopChrome } from "@/components/SiteTopChrome";
import { readCmsWithDbStatus } from "@/lib/cms-store";
import type { ReactNode } from "react";

export async function SiteTopChromeWrapper({ children }: { children: ReactNode }) {
  const { cms, devDbUnreachable } = await readCmsWithDbStatus();
  return (
    <>
      <DevPostgresDisconnectedBanner show={devDbUnreachable} />
      <SiteTopChrome site={cms.site}>
        {children}
        <SiteFooter site={cms.site} />
      </SiteTopChrome>
    </>
  );
}
