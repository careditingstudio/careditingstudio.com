import { siteConfig } from "@/config/site";

/** One before/after “post” on the home page — images plus all visible copy and CTAs. */
export type BeforeAfterPair = {
  before: string;
  after: string;
  title: string;
  intro: string;
  priceNote: string;
  listTitle: string;
  includes: string[];
  beforeAlt: string;
  afterAlt: string;
  imageFirst: boolean;
  /** When true: primary + secondary buttons; when false: single text link */
  showDualCtas: boolean;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  soloCtaLabel: string;
  soloCtaHref: string;
};

/** Defaults when adding a new post (rotates A/B layout presets). */
export const BEFORE_AFTER_BLUEPRINTS: Omit<BeforeAfterPair, "before" | "after">[] = [
  {
    title: "Studio-grade vehicle cleanup",
    intro:
      "Swap cluttered driveways for a clean studio look, tame reflections, and keep paint reading true—ideal for listings and ads.",
    priceNote:
      "Typical projects start around $1–$3 per image depending on complexity.",
    listTitle: "Includes:",
    includes: [
      "Background replacement",
      "Reflection & glare control",
      "Wheel and trim cleanup",
      "License plate handling",
      "Shadows that ground the car",
    ],
    beforeAlt: "Car photo before editing",
    afterAlt: "Car photo after professional editing",
    imageFirst: false,
    showDualCtas: true,
    primaryCtaLabel: "Get a free trial",
    primaryCtaHref: "/contact",
    secondaryCtaLabel: "View more",
    secondaryCtaHref: "/services",
    soloCtaLabel: "Talk to us about your set",
    soloCtaHref: "/contact",
  },
  {
    title: "Color & exposure you can trust",
    intro:
      "Correct white balance and exposure so every body line and interior detail matches what buyers see in person.",
    priceNote: "Color-focused edits often land around $0.50–$2.50 per frame.",
    listTitle: "Includes:",
    includes: [
      "White balance & exposure",
      "Interior exposure matching",
      "Paint color accuracy",
      "Window sky cleanup",
      "Batch consistency across sets",
    ],
    beforeAlt: "Vehicle image before color correction",
    afterAlt: "Vehicle image after color correction",
    imageFirst: true,
    showDualCtas: false,
    primaryCtaLabel: "Get a free trial",
    primaryCtaHref: "/contact",
    secondaryCtaLabel: "View more",
    secondaryCtaHref: "/services",
    soloCtaLabel: "Talk to us about your set",
    soloCtaHref: "/contact",
  },
];

export function beforeAfterBlueprint(
  index: number,
): Omit<BeforeAfterPair, "before" | "after"> {
  return BEFORE_AFTER_BLUEPRINTS[index % BEFORE_AFTER_BLUEPRINTS.length]!;
}

export function defaultBeforeAfterPair(index: number): BeforeAfterPair {
  const bp = beforeAfterBlueprint(index);
  return {
    before: "",
    after: "",
    ...bp,
    includes: [...bp.includes],
  };
}

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

function strField(
  p: Record<string, unknown>,
  key: string,
  fallback: string,
): string {
  const v = p[key];
  return typeof v === "string" ? v : fallback;
}

function boolField(
  p: Record<string, unknown>,
  key: string,
  fallback: boolean,
): boolean {
  const v = p[key];
  return typeof v === "boolean" ? v : fallback;
}

function normalizeBeforeAfterPair(
  item: unknown,
  index: number,
): BeforeAfterPair | null {
  if (!item || typeof item !== "object") return null;
  const p = item as Record<string, unknown>;
  if (typeof p.before !== "string" || typeof p.after !== "string") return null;
  const before = p.before;
  const after = p.after;
  const bp = beforeAfterBlueprint(index);

  let includes: string[] = [];
  if (Array.isArray(p.includes)) {
    includes = p.includes
      .filter((x): x is string => typeof x === "string")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }
  if (includes.length === 0) {
    includes = [...bp.includes];
  }

  const showDual =
    typeof p.showDualCtas === "boolean"
      ? p.showDualCtas
      : typeof p.showCtas === "boolean"
        ? p.showCtas
        : bp.showDualCtas;

  return {
    before,
    after,
    title: strField(p, "title", bp.title),
    intro: strField(p, "intro", bp.intro),
    priceNote: strField(p, "priceNote", bp.priceNote),
    listTitle: strField(p, "listTitle", bp.listTitle),
    includes,
    beforeAlt: strField(p, "beforeAlt", bp.beforeAlt),
    afterAlt: strField(p, "afterAlt", bp.afterAlt),
    imageFirst: boolField(p, "imageFirst", bp.imageFirst),
    showDualCtas: showDual,
    primaryCtaLabel: strField(p, "primaryCtaLabel", bp.primaryCtaLabel),
    primaryCtaHref: strField(p, "primaryCtaHref", bp.primaryCtaHref),
    secondaryCtaLabel: strField(p, "secondaryCtaLabel", bp.secondaryCtaLabel),
    secondaryCtaHref: strField(p, "secondaryCtaHref", bp.secondaryCtaHref),
    soloCtaLabel: strField(p, "soloCtaLabel", bp.soloCtaLabel),
    soloCtaHref: strField(p, "soloCtaHref", bp.soloCtaHref),
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
    for (let idx = 0; idx < ba.length; idx++) {
      const row = normalizeBeforeAfterPair(ba[idx], idx);
      if (row) pairs.push(row);
    }
    base.beforeAfter = pairs;
  }

  if (typeof o.updatedAt === "string") base.updatedAt = o.updatedAt;

  return base;
}

export function isUploadedAsset(url: string) {
  return url.startsWith("/cms/");
}
