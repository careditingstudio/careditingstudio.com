import { siteConfig } from "@/config/site";

export const SITE_URL = `https://${siteConfig.domain}`;
export const DEFAULT_OG_IMAGE = "/logo.png";

export function absoluteUrl(pathname: string): string {
  return new URL(pathname, `${SITE_URL}/`).toString();
}
