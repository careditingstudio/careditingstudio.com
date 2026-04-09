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
  officeLocations: {
    label: string;
    address: string;
    mapUrl: string;
  }[];
  /** Social links rendered in the public footer (label + URL). */
  socialLinks: { label: string; url: string }[];
  /**
   * Multiline (or separator-delimited) tags used for SEO.
   * Store as text so the editor can control parsing rules.
   */
  siteTagsText: string;
  siteTagsSeparator: "newline" | "comma" | "semicolon" | "pipe";
};

/** Editable in admin (Services); portfolio tiles reference these by id. */
export type ServiceRow = {
  id: number;
  name: string;
};

/** Square before/after tile on /portfolio (same slider UI as home, grid layout). */
export type PortfolioGridItem = {
  /** Optional — shown in admin list only */
  label: string;
  /** References `services`; null/uncategorized; client may use negative ids before first save */
  serviceId: number | null;
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
};

export function defaultPortfolioGridItem(): PortfolioGridItem {
  return {
    label: "",
    serviceId: null,
    before: "",
    after: "",
    beforeAlt: "Before editing",
    afterAlt: "After editing",
  };
}

/** One client testimonial on the home page (editable in admin). */
export type HomeReviewItem = {
  quote: string;
  name: string;
  role: string;
  /** 1–5 */
  rating: number;
  /** Cloudinary or `/cms/...` headshot; empty = initials avatar */
  avatarSrc: string;
};

export type HomeReviewsBlock = {
  eyebrow: string;
  title: string;
  subtitle: string;
  items: HomeReviewItem[];
};

export function defaultHomeReviewItem(): HomeReviewItem {
  return {
    quote: "",
    name: "",
    role: "",
    rating: 5,
    avatarSrc: "",
  };
}

export function defaultHomeReviewsBlock(): HomeReviewsBlock {
  return {
    eyebrow: "Testimonials",
    title: "What clients say",
    subtitle:
      "Real feedback from teams who rely on consistent, retail-ready vehicle imagery.",
    items: [],
  };
}

/** One icon card in the home “Our Services Features” strip. */
export type HomeServiceFeatureItem = {
  iconKey: string;
  title: string;
  body: string;
};

export type HomeServiceFeaturesBlock = {
  intro: string;
  sectionTitle: string;
  ctaLabel: string;
  ctaHref: string;
  items: HomeServiceFeatureItem[];
};

export function defaultHomeServiceFeatureItem(): HomeServiceFeatureItem {
  return {
    iconKey: "sparkles",
    title: "",
    body: "",
  };
}

export function defaultHomeServiceFeaturesBlock(): HomeServiceFeaturesBlock {
  return {
    intro: "",
    sectionTitle: "Our Services Features",
    ctaLabel: "See more",
    ctaHref: "/services",
    items: [
      {
        iconKey: "creditCard",
        title: "Easy Payment System",
        body:
          "Our payment system is secure and hassle free. Payment can be completed via PayPal or bank account/check (for US).",
      },
      {
        iconKey: "lock",
        title: "Secure File Transfer",
        body:
          "We use secure FTP, WeTransfer, Dropbox so you can send up to 500 GB file safely.",
      },
      {
        iconKey: "percent",
        title: "Discount",
        body:
          "We offer amazing discount offers for large quantity of images. Sample trial available.",
      },
      {
        iconKey: "zap",
        title: "Rush Service",
        body:
          "Urgent work? No problem. We provide express service on request to meet your deadlines.",
      },
    ],
  };
}

export type CmsJson = {
  site: SiteSettings;
  heroBanners: string[];
  floatingCar: string;
  beforeAfter: BeforeAfterPair[];
  services: ServiceRow[];
  portfolioGrid: PortfolioGridItem[];
  homeReviews: HomeReviewsBlock;
  homeServiceFeatures: HomeServiceFeaturesBlock;
  updatedAt: string;
};

export function defaultSiteSettings(): SiteSettings {
  return {
    businessName: siteConfig.name,
    domainLabel: siteConfig.domain,
    email: siteConfig.email,
    whatsappDial: siteConfig.whatsappDial,
    whatsappDisplay: siteConfig.whatsappDisplay,
    officeLocations: [
      { label: "Main office", address: "", mapUrl: "" },
      { label: "UK office", address: "", mapUrl: "" },
    ],
    socialLinks: [
      { label: "Facebook", url: "" },
      { label: "Instagram", url: "" },
      { label: "LinkedIn", url: "" },
      { label: "X (Twitter)", url: "" },
      { label: "YouTube", url: "" },
      { label: "TikTok", url: "" },
    ],
    siteTagsText: "",
    siteTagsSeparator: "newline",
  };
}

export function defaultCmsJson(): CmsJson {
  return {
    site: defaultSiteSettings(),
    /** Add real files under public/ or upload via admin — no fake paths */
    heroBanners: [],
    floatingCar: "",
    beforeAfter: [],
    services: [],
    portfolioGrid: [],
    homeReviews: defaultHomeReviewsBlock(),
    homeServiceFeatures: defaultHomeServiceFeaturesBlock(),
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

function normalizePortfolioCategoriesList(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const x of raw) {
    if (typeof x !== "string") continue;
    const t = x.trim();
    if (t.length === 0) continue;
    const key = t.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(t);
  }
  return out;
}

function normalizeServiceRow(item: unknown): ServiceRow | null {
  if (!item || typeof item !== "object") return null;
  const p = item as Record<string, unknown>;
  if (typeof p.name !== "string") return null;
  const id =
    typeof p.id === "number" && Number.isFinite(p.id) ? Math.trunc(p.id) : 0;
  return { id, name: p.name };
}

function normalizePortfolioGridItem(
  item: unknown,
  categoryToServiceId: Map<string, number>,
): PortfolioGridItem | null {
  if (!item || typeof item !== "object") return null;
  const p = item as Record<string, unknown>;
  if (typeof p.before !== "string" || typeof p.after !== "string") return null;

  let serviceId: number | null = null;
  if (typeof p.serviceId === "number" && Number.isFinite(p.serviceId)) {
    serviceId = Math.trunc(p.serviceId);
  } else {
    const catRaw = p.category;
    if (typeof catRaw === "string") {
      const key = catRaw.trim().toLowerCase();
      if (key.length > 0) {
        const mapped = categoryToServiceId.get(key);
        if (mapped !== undefined) serviceId = mapped;
      }
    }
  }

  return {
    label: typeof p.label === "string" ? p.label : "",
    serviceId,
    before: p.before,
    after: p.after,
    beforeAlt: strField(p, "beforeAlt", "Before editing"),
    afterAlt: strField(p, "afterAlt", "After editing"),
  };
}

function clampInt(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, Math.trunc(n)));
}

function normalizeHomeReviewItem(item: unknown): HomeReviewItem | null {
  if (!item || typeof item !== "object") return null;
  const p = item as Record<string, unknown>;
  const quote =
    typeof p.quote === "string"
      ? p.quote
      : typeof p.message === "string"
        ? p.message
        : "";
  const name =
    typeof p.name === "string"
      ? p.name
      : typeof p.clientName === "string"
        ? p.clientName
        : "";
  const role = typeof p.role === "string" ? p.role : "";
  const ratingRaw =
    typeof p.rating === "number"
      ? p.rating
      : typeof p.rating === "string"
        ? Number(p.rating)
        : 5;
  const avatarSrc =
    typeof p.avatarSrc === "string"
      ? p.avatarSrc
      : typeof p.avatarUrl === "string"
        ? p.avatarUrl
        : "";
  return {
    quote: quote.trim(),
    name: name.trim(),
    role: role.trim(),
    rating: clampInt(ratingRaw, 1, 5),
    avatarSrc: avatarSrc.trim(),
  };
}

function normalizeHomeServiceFeatureItem(
  item: unknown,
): HomeServiceFeatureItem | null {
  if (!item || typeof item !== "object") return null;
  const p = item as Record<string, unknown>;
  const title = typeof p.title === "string" ? p.title.trim() : "";
  const body =
    typeof p.body === "string"
      ? p.body.trim()
      : typeof p.description === "string"
        ? p.description.trim()
        : "";
  const iconKey =
    typeof p.iconKey === "string" && p.iconKey.trim().length > 0
      ? p.iconKey.trim()
      : "sparkles";
  return { iconKey, title, body };
}

function normalizeHomeServiceFeaturesBlock(
  raw: unknown,
  fallback: HomeServiceFeaturesBlock,
): HomeServiceFeaturesBlock {
  if (!raw || typeof raw !== "object") return fallback;
  const o = raw as Record<string, unknown>;
  const items: HomeServiceFeatureItem[] = [];
  let usedExplicitItems = false;
  if (Array.isArray(o.items)) {
    usedExplicitItems = true;
    for (const x of o.items) {
      const row = normalizeHomeServiceFeatureItem(x);
      if (row) items.push(row);
    }
  }
  const base: HomeServiceFeaturesBlock = {
    intro: strField(o, "intro", fallback.intro).trim() || fallback.intro,
    sectionTitle:
      strField(o, "sectionTitle", fallback.sectionTitle).trim() ||
      fallback.sectionTitle,
    ctaLabel: strField(o, "ctaLabel", fallback.ctaLabel).trim() || fallback.ctaLabel,
    ctaHref: strField(o, "ctaHref", fallback.ctaHref).trim() || fallback.ctaHref,
    items: usedExplicitItems ? items : fallback.items,
  };
  return base;
}

function normalizeHomeReviewsBlock(
  raw: unknown,
  fallback: HomeReviewsBlock,
): HomeReviewsBlock {
  if (!raw || typeof raw !== "object") return fallback;
  const o = raw as Record<string, unknown>;
  const items: HomeReviewItem[] = [];
  if (Array.isArray(o.items)) {
    for (const x of o.items) {
      const row = normalizeHomeReviewItem(x);
      if (row) items.push(row);
    }
  }
  return {
    eyebrow:
      typeof o.eyebrow === "string" ? o.eyebrow.trim() : fallback.eyebrow,
    title: typeof o.title === "string" ? o.title.trim() : fallback.title,
    subtitle:
      typeof o.subtitle === "string" ? o.subtitle.trim() : fallback.subtitle,
    items,
  };
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
    if (typeof s.siteTagsText === "string") {
      d.siteTagsText = s.siteTagsText;
    }
    const sep = s.siteTagsSeparator;
    if (
      sep === "newline" ||
      sep === "comma" ||
      sep === "semicolon" ||
      sep === "pipe"
    ) {
      d.siteTagsSeparator = sep;
    }
    if (Array.isArray(s.socialLinks)) {
      const out: { label: string; url: string }[] = [];
      const seen = new Set<string>();
      for (const row of s.socialLinks) {
        if (!row || typeof row !== "object") continue;
        const p = row as Record<string, unknown>;
        if (typeof p.label !== "string" || typeof p.url !== "string") continue;
        const label = p.label.trim();
        const url = p.url.trim();
        if (label.length === 0) continue;
        const key = label.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({ label, url });
      }
      if (out.length > 0) d.socialLinks = out;
    }

    if (Array.isArray(s.officeLocations)) {
      const out: { label: string; address: string; mapUrl: string }[] = [];
      const seen = new Set<string>();
      for (const row of s.officeLocations) {
        if (!row || typeof row !== "object") continue;
        const p = row as Record<string, unknown>;
        if (
          typeof p.label !== "string" ||
          typeof p.address !== "string" ||
          typeof p.mapUrl !== "string"
        ) {
          continue;
        }
        const label = p.label.trim();
        const address = p.address.trim();
        const mapUrl = p.mapUrl.trim();
        if (label.length === 0) continue;
        const key = label.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({ label, address, mapUrl });
      }
      if (out.length > 0) d.officeLocations = out;
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

  let services: ServiceRow[] = [];
  if (Array.isArray(o.services)) {
    for (const x of o.services) {
      const row = normalizeServiceRow(x);
      if (row && row.name.trim().length > 0) services.push(row);
    }
  }
  const legacyCats = Object.prototype.hasOwnProperty.call(
    o,
    "portfolioCategories",
  )
    ? normalizePortfolioCategoriesList(o.portfolioCategories)
    : [];
  if (services.length === 0 && legacyCats.length > 0) {
    services = legacyCats.map((name, i) => ({ id: i + 1, name }));
  }
  base.services = services;

  const categoryToServiceId = new Map<string, number>();
  for (const s of base.services) {
    categoryToServiceId.set(s.name.trim().toLowerCase(), s.id);
  }

  const pg = o.portfolioGrid;
  if (Array.isArray(pg)) {
    const grid: PortfolioGridItem[] = [];
    for (const item of pg) {
      const row = normalizePortfolioGridItem(item, categoryToServiceId);
      if (row) grid.push(row);
    }
    base.portfolioGrid = grid;
  }

  base.homeReviews = normalizeHomeReviewsBlock(o.homeReviews, base.homeReviews);

  base.homeServiceFeatures = normalizeHomeServiceFeaturesBlock(
    o.homeServiceFeatures,
    base.homeServiceFeatures,
  );

  if (typeof o.updatedAt === "string") base.updatedAt = o.updatedAt;

  return base;
}

/** Parse DB JSON string into a block (used by `cms-repository`). */
export function parseHomeServiceFeaturesFromJson(
  raw: string | null | undefined,
): HomeServiceFeaturesBlock {
  const fallback = defaultHomeServiceFeaturesBlock();
  if (!raw?.trim()) return fallback;
  try {
    return normalizeHomeServiceFeaturesBlock(JSON.parse(raw) as unknown, fallback);
  } catch {
    return fallback;
  }
}

/** Legacy local files under /public/cms/uploads — use unoptimized Next/Image. */
export function isUploadedAsset(url: string) {
  return url.startsWith("/cms/");
}

export function isCloudinaryUrl(url: string) {
  return url.includes("res.cloudinary.com");
}
