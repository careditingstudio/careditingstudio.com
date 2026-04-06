import type { SiteSettings } from "@/lib/cms-types";

export function parseSiteTags(site: Pick<SiteSettings, "siteTagsText" | "siteTagsSeparator">) {
  const raw = (site.siteTagsText ?? "").trim();
  if (!raw) return [] as string[];

  let parts: string[];
  switch (site.siteTagsSeparator) {
    case "comma":
      parts = raw.split(",");
      break;
    case "semicolon":
      parts = raw.split(";");
      break;
    case "pipe":
      parts = raw.split("|");
      break;
    case "newline":
    default:
      parts = raw.split(/\r?\n/);
      break;
  }

  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of parts) {
    const t = p.trim().replace(/\s+/g, " ");
    if (!t) continue;
    const key = t.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(t);
  }
  return out;
}

