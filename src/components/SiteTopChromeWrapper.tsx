import { DevPostgresDisconnectedBanner } from "@/components/DevPostgresDisconnectedBanner";
import { SiteLocationsMapSection } from "@/components/SiteLocationsMapSection";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteTopChrome } from "@/components/SiteTopChrome";
import { readCmsWithDbStatus } from "@/lib/cms-store";
import type { ReactNode } from "react";

export async function SiteTopChromeWrapper({ children }: { children: ReactNode }) {
  const { cms, devDbUnreachable } = await readCmsWithDbStatus();
  return (
    <>
      <DevPostgresDisconnectedBanner show={devDbUnreachable} />
      <SiteTopChrome
        site={cms.site}
        services={cms.services}
        servicePages={cms.servicePages}
      >
        {children}
        <SiteLocationsMapSection site={cms.site} />
        <SiteFooter
          site={cms.site}
          services={cms.services}
          servicePages={cms.servicePages}
        />
      </SiteTopChrome>
    </>
  );
}
