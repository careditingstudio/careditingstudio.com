import { siteConfig } from "@/config/site";
import type { MetadataRoute } from "next";

const baseUrl = `https://${siteConfig.domain}`;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin-panel/", "/editor/", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
