import { DevPostgresDisconnectedBanner } from "@/components/DevPostgresDisconnectedBanner";
import { SiteLocationsMapSection } from "@/components/SiteLocationsMapSection";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteTopChrome } from "@/components/SiteTopChrome";
import { VisitorLanguageBar } from "@/components/VisitorLanguageBar";
import { getVisitorShellMessages, navLabelsFromMessages } from "@/i18n/visitor-shell";
import { getPublicVisitorState } from "@/lib/public-visitor";
import { readCmsWithDbStatus } from "@/lib/cms-store";
import type { ReactNode } from "react";

export async function SiteTopChromeWrapper({ children }: { children: ReactNode }) {
  const { cms, devDbUnreachable } = await readCmsWithDbStatus();
  const visitor = await getPublicVisitorState();
  const shell = getVisitorShellMessages(visitor.locale);
  const navLabels = navLabelsFromMessages(shell);

  return (
    <>
      <DevPostgresDisconnectedBanner show={devDbUnreachable} />
      <SiteTopChrome
        site={cms.site}
        services={cms.services}
        servicePages={cms.servicePages}
        navLabels={navLabels}
        shell={shell}
        reserveLanguageBarSpace
      >
        {children}
        <SiteLocationsMapSection site={cms.site} layout={shell.layout} />
        <SiteFooter
          site={cms.site}
          services={cms.services}
          servicePages={cms.servicePages}
          shell={shell}
        />
      </SiteTopChrome>
      <VisitorLanguageBar locale={visitor.locale} />
    </>
  );
}
