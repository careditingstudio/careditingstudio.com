import { siteConfig } from "@/config/site";

export type BeforeAfterPair = {
  before: string;
  after: string;
};

/** Editable contact & branding shown on the public site */
export type SiteSettings = {
  businessName: string;
  domainLabel: string;
  email: string;
  whatsappDial: string;
  whatsappDisplay: string;
};

export type CmsJson = {
  site: SiteSettings;
  heroBanners: string[];
  floatingCar: string;
  beforeAfter: BeforeAfterPair[];
  updatedAt: string;
};

export function defaultSiteSettings(): SiteSettings {
  return {
    businessName: siteConfig.name,
    domainLabel: siteConfig.domain,
    email: siteConfig.email,
    whatsappDial: siteConfig.whatsappDial,
    whatsappDisplay: siteConfig.whatsappDisplay,
  };
}

export function defaultCmsJson(): CmsJson {
  return {
    site: defaultSiteSettings(),
    /** Add real files under public/ or upload via admin — no fake paths */
    heroBanners: [],
    floatingCar: "",
    beforeAfter: [],
    updatedAt: "",
  };
}

export function normalizeCmsJson(raw: unknown): CmsJson {
  const base = defaultCmsJson();
  if (!raw || typeof raw !== "object") return base;
  const o = raw as Record<string, unknown>;

  const siteRaw = o.site;
  if (siteRaw && typeof siteRaw === "object") {
    const s = siteRaw as Record<string, unknown>;
    const d = { ...base.site };
    if (typeof s.businessName === "string")
      d.businessName = s.businessName.trim() || d.businessName;
    if (typeof s.domainLabel === "string")
      d.domainLabel = s.domainLabel.trim() || d.domainLabel;
    if (typeof s.email === "string")
      d.email = s.email.trim() || d.email;
    if (typeof s.whatsappDisplay === "string")
      d.whatsappDisplay = s.whatsappDisplay.trim() || d.whatsappDisplay;
    if (typeof s.whatsappDial === "string") {
      const digits = s.whatsappDial.replace(/\D/g, "");
      if (digits.length > 0) d.whatsappDial = digits;
    }
    base.site = d;
  }

  const heroBanners = o.heroBanners;
  if (Array.isArray(heroBanners) && heroBanners.every((x) => typeof x === "string")) {
    base.heroBanners = heroBanners.filter((s) => s.trim().length > 0);
  }

  if (typeof o.floatingCar === "string") {
    base.floatingCar = o.floatingCar.trim();
  }

  const ba = o.beforeAfter;
  if (Array.isArray(ba)) {
    const pairs: BeforeAfterPair[] = [];
    for (const item of ba) {
      if (!item || typeof item !== "object") continue;
      const p = item as Record<string, unknown>;
      if (typeof p.before === "string" && typeof p.after === "string") {
        pairs.push({ before: p.before, after: p.after });
      }
    }
    base.beforeAfter = pairs;
  }

  if (typeof o.updatedAt === "string") base.updatedAt = o.updatedAt;

  return base;
}

export function isUploadedAsset(url: string) {
  return url.startsWith("/cms/");
}
