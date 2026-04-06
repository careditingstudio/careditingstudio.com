import { SiteTopChrome } from "@/components/SiteTopChrome";
import { readCms } from "@/lib/cms-store";
import type { ReactNode } from "react";

export async function SiteTopChromeWrapper({ children }: { children: ReactNode }) {
  const cms = await readCms();
  return <SiteTopChrome site={cms.site}>{children}</SiteTopChrome>;
}
