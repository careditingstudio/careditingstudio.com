import { navItems, siteConfig } from "@/config/site";
import { readCms } from "@/lib/cms-store";
import { getResolvedServicePages } from "@/lib/service-pages";
import type { MetadataRoute } from "next";

const baseUrl = `https://${siteConfig.domain}`;

function toAbsoluteUrl(pathname: string): string {
  return new URL(pathname, `${baseUrl}/`).toString();
}

const staticRoutes = Array.from(
  new Set([
    ...navItems.map((item) => item.href),
    "/schedule-meeting",
    "/terms",
    "/privacy",
  ]),
);
const seoLandingRoutes = [
  "/car-photo-editing",
  "/bike-photo-editing",
  "/bicycle-photo-editing",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [...staticRoutes, ...seoLandingRoutes].map((pathname) => ({
    url: toAbsoluteUrl(pathname),
    lastModified: now,
    changeFrequency: pathname === "/" ? "daily" : "weekly",
    priority: pathname === "/" ? 1 : 0.8,
  }));

  try {
    const cms = await readCms();
    const services = getResolvedServicePages(cms);

    for (const service of services) {
      entries.push({
        url: toAbsoluteUrl(`/services/${service.slug}`),
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  } catch {
    // Keep sitemap available even if CMS/database is temporarily unavailable.
  }

  return entries;
}
