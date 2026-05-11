import { DevPostgresDisconnectedBanner } from "@/components/DevPostgresDisconnectedBanner";
import { SiteLocationsMapSection } from "@/components/SiteLocationsMapSection";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteTopChrome } from "@/components/SiteTopChrome";
import { VISITOR_I18N_ENABLED } from "@/config/visitor-i18n-gate";
import { VisitorLanguageBar } from "@/i18n/visitor-language/VisitorLanguageBar";
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
      <div className="flex min-h-0 w-full flex-1 flex-col">
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
      </div>
      {VISITOR_I18N_ENABLED ? <VisitorLanguageBar locale={visitor.locale} /> : null}
    </>
  );
}
