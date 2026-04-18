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

/** Empty copy/layout defaults for new before/after posts and JSON normalization fallbacks. */
export function emptyBeforeAfterFields(): Omit<BeforeAfterPair, "before" | "after"> {
  return {
    title: "",
    intro: "",
    priceNote: "",
    listTitle: "",
    includes: [],
    beforeAlt: "",
    afterAlt: "",
    imageFirst: false,
    showDualCtas: false,
    primaryCtaLabel: "",
    primaryCtaHref: "",
    secondaryCtaLabel: "",
    secondaryCtaHref: "",
    soloCtaLabel: "",
    soloCtaHref: "",
  };
}

export function defaultBeforeAfterPair(): BeforeAfterPair {
  return {
    before: "",
    after: "",
    ...emptyBeforeAfterFields(),
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
    /** Used for map search / embed only; not shown on the public site when maps are set. */
    address: string;
    mapUrl: string;
    /** Shown under each office map and in the footer contact column. */
    phone: string;
  }[];
  /** Social links rendered in the public footer (label + URL). */
  socialLinks: { label: string; url: string }[];
  /** Shared payment methods shown in footer and pricing page. */
  paymentMethods: { label: string; imageUrl: string }[];
  /**
   * Multiline (or separator-delimited) tags used for SEO.
   * Store as text so the editor can control parsing rules.
   */
  siteTagsText: string;
  siteTagsSeparator: "newline" | "comma" | "semicolon" | "pipe";
  /** Editable FAQ entries used on the public FAQ section. */
  faqs: { question: string; answer: string }[];
};

export type PricingPlan = {
  packageLabel: string;
  title: string;
  singlePrice: string;
  bulkPrice: string;
  features: string[];
  featured: boolean;
};

export type PricingContent = {
  headingTitle: string;
  headingDescription: string;
  plans: PricingPlan[];
  guaranteeTitle: string;
  guaranteeBody: string;
  bulkTitle: string;
  bulkBody: string;
  paymentTitle: string;
};

export function defaultPricingContent(): PricingContent {
  const baseFeatures = [
    "1000 images daily",
    "100% guaranteed",
    "24/7 support",
    "Unlimited revision",
  ];
  return {
    headingTitle: "Simple & Transparent Pricing",
    headingDescription:
      "Our car photo editing services are affordable and designed to meet your needs with speed, reliability, and high-quality professional results.",
    plans: [
      {
        packageLabel: "Starter",
        title: "Background Remove",
        singlePrice: "$0.39",
        bulkPrice: "$0.29",
        features: baseFeatures,
        featured: false,
      },
      {
        packageLabel: "Most Popular",
        title: "Background Remove",
        singlePrice: "$0.39",
        bulkPrice: "$0.29",
        features: baseFeatures,
        featured: true,
      },
      {
        packageLabel: "Scale",
        title: "Background Remove",
        singlePrice: "$0.39",
        bulkPrice: "$0.29",
        features: baseFeatures,
        featured: false,
      },
    ],
    guaranteeTitle: "Corrections-Free Guarantee",
    guaranteeBody:
      "If your final images need any adjustments, we provide free revisions until you are completely satisfied. Your satisfaction is our top priority, and we are committed to ensuring every image looks perfect and ready to use.",
    bulkTitle: "Bulk Order Solutions for High-Volume Projects",
    bulkBody:
      "We handle high-volume image processing with precision and speed. Whether you have hundreds or thousands of images, our skilled and trained team is ready to complete your project efficiently and deliver on time.",
    paymentTitle: "Payment Method",
  };
}

/** Editable in admin (Services); portfolio tiles reference these by id. */
export type ServiceRow = {
  id: number;
  name: string;
};

/** One FAQ row on a service detail page (per-service, independent of site FAQs). */
export type ServiceFaqItem = {
  question: string;
  answer: string;
};

/** Section header + accordion items; all fields optional — hide blocks that are fully empty. */
export type ServicePageFaqSection = {
  eyebrow: string;
  title: string;
  subtitle: string;
  /** Two columns matches common service landing layouts (e.g. clipping path FAQ grids). */
  columns: 1 | 2;
  items: ServiceFaqItem[];
};

/**
 * Ordered page sections (builder). Empty array = use legacy intro + end portfolio + end FAQ.
 * When non-empty, blocks render in order; include `portfolio` / `faq` markers to position those sections.
 */
export type ServicePageBlock =
  | { id: string; type: "heading"; text: string; subtext?: string }
  | { id: string; type: "paragraph"; text: string }
  | { id: string; type: "image"; src: string; alt: string; caption?: string }
  | { id: string; type: "portfolio"; title?: string }
  | { id: string; type: "faq" }
  | { id: string; type: "spacer"; size?: "sm" | "md" | "lg" };

export type ServicePageContent = {
  serviceId: number;
  slug: string;
  pageTitle: string;
  pageDescription: string;
  introTitle: string;
  introBody: string;
  portfolioTitle: string;
  selectedPortfolioIndices: number[];
  faqSection: ServicePageFaqSection;
  blocks: ServicePageBlock[];
};

export function toServiceSlug(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return base || "service";
}

export function defaultServiceFaqSection(): ServicePageFaqSection {
  return {
    eyebrow: "",
    title: "",
    subtitle: "",
    columns: 2,
    items: [],
  };
}

export function newServicePageBlock(
  type: ServicePageBlock["type"],
): ServicePageBlock {
  const id = `b_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  switch (type) {
    case "heading":
      return { id, type: "heading", text: "", subtext: "" };
    case "paragraph":
      return { id, type: "paragraph", text: "" };
    case "image":
      return { id, type: "image", src: "", alt: "", caption: "" };
    case "portfolio":
      return { id, type: "portfolio", title: "" };
    case "faq":
      return { id, type: "faq" };
    case "spacer":
      return { id, type: "spacer", size: "md" };
    default:
      return { id, type: "paragraph", text: "" };
  }
}

export function defaultServicePageContent(
  serviceId: number,
  serviceName: string,
): ServicePageContent {
  const title = serviceName.trim() || "Untitled service";
  return {
    serviceId,
    slug: toServiceSlug(title),
    pageTitle: title,
    pageDescription: `${title} for automotive dealerships and studios with consistent, production-ready quality.`,
    introTitle: `Professional ${title}`,
    introBody:
      "We deliver accurate, fast, and scalable editing tailored to your workflow and visual standards.",
    portfolioTitle: `${title} Portfolio`,
    selectedPortfolioIndices: [],
    faqSection: defaultServiceFaqSection(),
    blocks: [],
  };
}

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

/** Deduplicate and clamp indices to valid portfolio grid positions. */
export function dedupeFeaturedPortfolioOrder(
  indices: number[],
  gridLength: number,
): number[] {
  const seen = new Set<number>();
  const out: number[] = [];
  for (const raw of indices) {
    if (typeof raw !== "number" || !Number.isFinite(raw)) continue;
    const i = Math.trunc(raw);
    if (i < 0 || i >= gridLength || seen.has(i)) continue;
    seen.add(i);
    out.push(i);
  }
  return out;
}

/** After removing portfolio row at `removedIndex`, fix stored featured indices. */
export function remapFeaturedOrderAfterRemove(
  order: number[],
  removedIndex: number,
): number[] {
  return order
    .filter((i) => i !== removedIndex)
    .map((i) => (i > removedIndex ? i - 1 : i));
}

/** After swapping two rows in the portfolio grid at `indexA` and `indexB`. */
export function remapFeaturedOrderAfterSwap(
  order: number[],
  indexA: number,
  indexB: number,
): number[] {
  return order.map((i) => {
    if (i === indexA) return indexB;
    if (i === indexB) return indexA;
    return i;
  });
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
  /** Optional heading above the before/after posts block (leave empty to hide). */
  beforeAfterSectionEyebrow: string;
  beforeAfterSectionTitle: string;
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
    beforeAfterSectionEyebrow: "",
    beforeAfterSectionTitle: "",
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

/** One pillar card in the home “Why choose us” column (icons cycle by index on the public site). */
export type HomeWhyChoosePillar = {
  iconKey: string;
  title: string;
  body: string;
};

export function defaultHomeWhyChoosePillar(): HomeWhyChoosePillar {
  return { iconKey: "shield", title: "", body: "" };
}

/** One step in the “How it works” grid (icons fixed by order in UI). */
export type HomeWhyChooseWorkflowStep = {
  title: string;
  subtitle: string;
};

/** Full editable home “Why choose us” + workflow section (stored as JSON in DB). */
export type HomeWhyChooseUsBlock = {
  headline: string;
  intro: string;
  /** Short label e.g. “Manual + AI” — shown as a highlight pill before the three badges. */
  manualAiLabel: string;
  /** Three pill labels (badges row). */
  badges: string[];
  /** Deprecated — kept for JSON compatibility; not shown on the public site. */
  easyCommunicationTitle: string;
  easyCommunicationBody: string;
  /** Unlimited pillar cards (order = display order). */
  pillars: HomeWhyChoosePillar[];
  workflowTitle: string;
  /** Paragraph under the workflow section title; empty = hidden. */
  workflowIntro: string;
  /** Cloudinary or `/cms/...` URL; empty = placeholder */
  teamPhotoSrc: string;
  teamPhotoAlt: string;
  /** Exactly five steps in UI (first four in 2×2, fifth full width). */
  workflowSteps: HomeWhyChooseWorkflowStep[];
  /** Homepage portfolio strip (below workflow, same band as reviews). */
  portfolioStripTitle: string;
  portfolioStripCtaLabel: string;
};

export function defaultHomeWhyChooseUsBlock(): HomeWhyChooseUsBlock {
  return {
    headline: "Why choose our company for car photo editing services?",
    intro:
      "With precision editing, fast delivery, and consistent quality, our dedicated team works all year with strong commitment. We keep support responsive via email and WhatsApp so your questions are answered quickly and clearly.",
    manualAiLabel: "Manual + AI",
    badges: [
      "24h service",
      "Fluent English-speaking team",
      "Fast turnaround",
    ],
    easyCommunicationTitle: "",
    easyCommunicationBody: "",
    pillars: [
      {
        iconKey: "shield",
        title: "Precision + Consistency",
        body:
          "Precision editing, fast delivery, and consistent quality from a dedicated year-round team.",
      },
      {
        iconKey: "chat",
        title: "Friendly Support",
        body:
          "Our support team is ready anytime via email and WhatsApp with clear, quick responses.",
      },
      {
        iconKey: "sparkles",
        title: "Honest Service",
        body:
          "We guarantee high-quality work and set realistic expectations, never false promises.",
      },
    ],
    workflowTitle: "How Car Editing Studio Works",
    workflowIntro:
      "From background replacement to advanced retouching, we provide complete solutions to enhance your images and grow your business",
    teamPhotoSrc: "",
    teamPhotoAlt: "Our editing team",
    workflowSteps: [
      { title: "Get A Quote", subtitle: "Take first step" },
      { title: "Upload Your", subtitle: "Photos" },
      { title: "Assigned to", subtitle: "Production" },
      { title: "Two Steps", subtitle: "Quality Checking" },
      { title: "Download", subtitle: "Edited File" },
    ],
    portfolioStripTitle: "Our Creative Portfolio",
    portfolioStripCtaLabel: "See more",
  };
}

export type CmsJson = {
  site: SiteSettings;
  pricing: PricingContent;
  heroBanners: string[];
  floatingCar: string;
  beforeAfter: BeforeAfterPair[];
  services: ServiceRow[];
  servicePages: ServicePageContent[];
  portfolioGrid: PortfolioGridItem[];
  /**
   * Ordered 0-based indices into `portfolioGrid` for the homepage portfolio strip.
   * Empty = fall back to first N complete tiles.
   */
  homeFeaturedPortfolioOrder: number[];
  homeReviews: HomeReviewsBlock;
  homeServiceFeatures: HomeServiceFeaturesBlock;
  homeWhyChooseUs: HomeWhyChooseUsBlock;
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
      { label: "Main office", address: "", mapUrl: "", phone: "" },
      { label: "UK office", address: "", mapUrl: "", phone: "" },
    ],
    socialLinks: [
      { label: "Facebook", url: "" },
      { label: "Instagram", url: "" },
      { label: "LinkedIn", url: "" },
      { label: "X (Twitter)", url: "" },
      { label: "YouTube", url: "" },
      { label: "TikTok", url: "" },
    ],
    paymentMethods: [
      { label: "Mastercard", imageUrl: "" },
      { label: "Visa", imageUrl: "" },
      { label: "PayPal", imageUrl: "" },
      { label: "Bank", imageUrl: "" },
      { label: "Zelle", imageUrl: "" },
    ],
    siteTagsText: "",
    siteTagsSeparator: "newline",
    faqs: [
      {
        question: "How much does your photo editing service cost?",
        answer:
          "Our pricing starts from $0.20 per image and varies based on complexity, including background removal, masking, retouching, and compositing. We also provide custom quotes for bulk orders.",
      },
      {
        question: "What is your turnaround time for image editing?",
        answer:
          "Standard delivery is usually within 12 to 24 hours, depending on order size and editing requirements. Urgent projects can be prioritized on request.",
      },
      {
        question: "Do you manually edit images or use automated tools?",
        answer:
          "We follow a fully manual Photoshop-based workflow for precise, high-quality results and consistent output across your full catalog.",
      },
      {
        question: "What types of products do you edit for e-commerce?",
        answer:
          "We edit automotive and product images for ecommerce, including cars, parts, accessories, apparel, and other marketplace-ready product photos.",
      },
      {
        question: "How do I send images and place an order?",
        answer:
          "You can send your images through our contact page or free trial form. After reviewing your requirements, we confirm timeline, pricing, and delivery format.",
      },
    ],
  };
}

export function defaultCmsJson(): CmsJson {
  return {
    site: defaultSiteSettings(),
    pricing: defaultPricingContent(),
    /** Add real files under public/ or upload via admin — no fake paths */
    heroBanners: [],
    floatingCar: "",
    beforeAfter: [],
    services: [],
    servicePages: [],
    portfolioGrid: [],
    homeFeaturedPortfolioOrder: [],
    homeReviews: defaultHomeReviewsBlock(),
    homeServiceFeatures: defaultHomeServiceFeaturesBlock(),
    homeWhyChooseUs: defaultHomeWhyChooseUsBlock(),
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

function normalizeServiceFaqItem(item: unknown): ServiceFaqItem | null {
  if (!item || typeof item !== "object") return null;
  const p = item as Record<string, unknown>;
  return {
    question: typeof p.question === "string" ? p.question : "",
    answer: typeof p.answer === "string" ? p.answer : "",
  };
}

function normalizeServiceFaqSection(
  raw: unknown,
  fallback: ServicePageFaqSection,
): ServicePageFaqSection {
  if (!raw || typeof raw !== "object") return { ...fallback };
  const o = raw as Record<string, unknown>;
  const items: ServiceFaqItem[] = [];
  if (Array.isArray(o.items)) {
    for (const x of o.items) {
      const row = normalizeServiceFaqItem(x);
      if (row) items.push(row);
    }
  }
  const columns = o.columns === 1 ? 1 : 2;
  return {
    eyebrow: typeof o.eyebrow === "string" ? o.eyebrow : fallback.eyebrow,
    title: typeof o.title === "string" ? o.title : fallback.title,
    subtitle: typeof o.subtitle === "string" ? o.subtitle : fallback.subtitle,
    columns,
    items,
  };
}

function normalizeServicePageBlock(raw: unknown): ServicePageBlock | null {
  if (!raw || typeof raw !== "object") return null;
  const p = raw as Record<string, unknown>;
  const id =
    typeof p.id === "string" && p.id.trim().length > 0
      ? p.id
      : `b_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const type = p.type;
  if (type === "heading") {
    return {
      id,
      type: "heading",
      text: typeof p.text === "string" ? p.text : "",
      subtext:
        typeof p.subtext === "string" && p.subtext.trim().length > 0
          ? p.subtext
          : undefined,
    };
  }
  if (type === "paragraph") {
    return { id, type: "paragraph", text: typeof p.text === "string" ? p.text : "" };
  }
  if (type === "image") {
    return {
      id,
      type: "image",
      src: typeof p.src === "string" ? p.src : "",
      alt: typeof p.alt === "string" ? p.alt : "",
      caption:
        typeof p.caption === "string" && p.caption.trim().length > 0
          ? p.caption
          : undefined,
    };
  }
  if (type === "portfolio") {
    return {
      id,
      type: "portfolio",
      title:
        typeof p.title === "string" && p.title.trim().length > 0
          ? p.title
          : undefined,
    };
  }
  if (type === "faq") {
    return { id, type: "faq" };
  }
  if (type === "spacer") {
    const size =
      p.size === "sm" || p.size === "md" || p.size === "lg" ? p.size : "md";
    return { id, type: "spacer", size };
  }
  return null;
}

export function normalizeServicePageContent(item: unknown): ServicePageContent | null {
  if (!item || typeof item !== "object") return null;
  const p = item as Record<string, unknown>;
  if (typeof p.serviceId !== "number" || !Number.isFinite(p.serviceId)) return null;
  const serviceId = Math.trunc(p.serviceId);
  if (serviceId === 0) return null;

  const selectedPortfolioIndices = Array.isArray(p.selectedPortfolioIndices)
    ? p.selectedPortfolioIndices
        .filter((x): x is number => typeof x === "number" && Number.isFinite(x))
        .map((x) => Math.max(0, Math.trunc(x)))
    : [];

  const fbFaq = defaultServiceFaqSection();
  const blocksRaw = Array.isArray(p.blocks) ? p.blocks : [];
  const blocks: ServicePageBlock[] = [];
  for (const x of blocksRaw) {
    const b = normalizeServicePageBlock(x);
    if (b) blocks.push(b);
  }

  return {
    serviceId,
    slug: typeof p.slug === "string" ? p.slug.trim() : "",
    pageTitle: typeof p.pageTitle === "string" ? p.pageTitle.trim() : "",
    pageDescription:
      typeof p.pageDescription === "string" ? p.pageDescription.trim() : "",
    introTitle: typeof p.introTitle === "string" ? p.introTitle.trim() : "",
    introBody: typeof p.introBody === "string" ? p.introBody.trim() : "",
    portfolioTitle:
      typeof p.portfolioTitle === "string" ? p.portfolioTitle.trim() : "",
    selectedPortfolioIndices,
    faqSection: normalizeServiceFaqSection(
      p.faqSection ?? p.faq,
      fbFaq,
    ),
    blocks,
  };
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
    beforeAfterSectionEyebrow: strField(
      o,
      "beforeAfterSectionEyebrow",
      fallback.beforeAfterSectionEyebrow,
    ).trim(),
    beforeAfterSectionTitle: strField(
      o,
      "beforeAfterSectionTitle",
      fallback.beforeAfterSectionTitle,
    ).trim(),
    items: usedExplicitItems ? items : fallback.items,
  };
  return base;
}

function normalizeHomeWhyChoosePillar(
  item: unknown,
  fallback: HomeWhyChoosePillar,
): HomeWhyChoosePillar {
  if (!item || typeof item !== "object") return { ...fallback };
  const p = item as Record<string, unknown>;
  const iconKey =
    typeof p.iconKey === "string" && p.iconKey.trim().length > 0
      ? p.iconKey.trim()
      : fallback.iconKey;
  return {
    iconKey,
    title:
      typeof p.title === "string" ? p.title.trim() : fallback.title,
    body: typeof p.body === "string" ? p.body.trim() : fallback.body,
  };
}

function normalizeHomeWhyChooseWorkflowStep(
  item: unknown,
  fallback: HomeWhyChooseWorkflowStep,
): HomeWhyChooseWorkflowStep {
  if (!item || typeof item !== "object") return { ...fallback };
  const p = item as Record<string, unknown>;
  return {
    title: typeof p.title === "string" ? p.title.trim() : fallback.title,
    subtitle:
      typeof p.subtitle === "string" ? p.subtitle.trim() : fallback.subtitle,
  };
}

function normalizeHomeWhyChooseUsBlock(
  raw: unknown,
  fallback: HomeWhyChooseUsBlock,
): HomeWhyChooseUsBlock {
  const fb = defaultHomeWhyChooseUsBlock();
  if (!raw || typeof raw !== "object") return fallback;
  const o = raw as Record<string, unknown>;

  const badges: string[] = [];
  if (Array.isArray(o.badges)) {
    for (const x of o.badges) {
      if (typeof x === "string" && x.trim()) badges.push(x.trim());
    }
  }
  while (badges.length < 3) {
    badges.push(fb.badges[badges.length] ?? "");
  }
  if (badges.length > 3) badges.length = 3;

  const pillars: HomeWhyChoosePillar[] = [];
  if (Array.isArray(o.pillars)) {
    const fbP = fb.pillars;
    for (let i = 0; i < o.pillars.length; i++) {
      const fbRow =
        fbP[i] ?? fbP[fbP.length - 1] ?? defaultHomeWhyChoosePillar();
      pillars.push(normalizeHomeWhyChoosePillar(o.pillars[i], fbRow));
    }
  }

  const workflowSteps: HomeWhyChooseWorkflowStep[] = [];
  if (Array.isArray(o.workflowSteps)) {
    for (let i = 0; i < Math.min(o.workflowSteps.length, 5); i++) {
      workflowSteps.push(
        normalizeHomeWhyChooseWorkflowStep(
          o.workflowSteps[i],
          fb.workflowSteps[i]!,
        ),
      );
    }
  }
  while (workflowSteps.length < 5) {
    workflowSteps.push({ ...fb.workflowSteps[workflowSteps.length]! });
  }

  return {
    headline:
      strField(o, "headline", fallback.headline).trim() || fb.headline,
    intro: strField(o, "intro", fallback.intro).trim() || fb.intro,
    manualAiLabel:
      strField(o, "manualAiLabel", fallback.manualAiLabel).trim() ||
      fb.manualAiLabel,
    badges,
    easyCommunicationTitle:
      strField(o, "easyCommunicationTitle", fallback.easyCommunicationTitle).trim() ||
      fb.easyCommunicationTitle,
    easyCommunicationBody:
      strField(o, "easyCommunicationBody", fallback.easyCommunicationBody).trim() ||
      fb.easyCommunicationBody,
    pillars,
    workflowTitle:
      strField(o, "workflowTitle", fallback.workflowTitle).trim() ||
      fb.workflowTitle,
    workflowIntro: strField(o, "workflowIntro", fallback.workflowIntro).trim(),
    teamPhotoSrc: strField(o, "teamPhotoSrc", fallback.teamPhotoSrc).trim(),
    teamPhotoAlt:
      strField(o, "teamPhotoAlt", fallback.teamPhotoAlt).trim() ||
      fb.teamPhotoAlt,
    workflowSteps,
    portfolioStripTitle:
      strField(o, "portfolioStripTitle", fallback.portfolioStripTitle).trim() ||
      fb.portfolioStripTitle,
    portfolioStripCtaLabel:
      strField(o, "portfolioStripCtaLabel", fallback.portfolioStripCtaLabel).trim() ||
      fb.portfolioStripCtaLabel,
  };
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

function normalizePricingPlan(item: unknown, fallback: PricingPlan): PricingPlan {
  if (!item || typeof item !== "object") return fallback;
  const p = item as Record<string, unknown>;
  const features: string[] = [];
  if (Array.isArray(p.features)) {
    for (const row of p.features) {
      if (typeof row === "string" && row.trim()) features.push(row.trim());
    }
  }
  return {
    packageLabel: strField(p, "packageLabel", fallback.packageLabel).trim() || fallback.packageLabel,
    title: strField(p, "title", fallback.title).trim() || fallback.title,
    singlePrice: strField(p, "singlePrice", fallback.singlePrice).trim() || fallback.singlePrice,
    bulkPrice: strField(p, "bulkPrice", fallback.bulkPrice).trim() || fallback.bulkPrice,
    features: features.length > 0 ? features : fallback.features,
    featured: boolField(p, "featured", fallback.featured),
  };
}

function normalizePricingContent(raw: unknown, fallback: PricingContent): PricingContent {
  if (!raw || typeof raw !== "object") return fallback;
  const o = raw as Record<string, unknown>;
  const plansRaw = Array.isArray(o.plans) ? o.plans : [];
  const plans: PricingPlan[] = [];
  for (let i = 0; i < plansRaw.length; i++) {
    const fb = fallback.plans[i] ?? fallback.plans[fallback.plans.length - 1]!;
    plans.push(normalizePricingPlan(plansRaw[i], fb));
  }
  if (plans.length === 0) {
    plans.push(...fallback.plans);
  }
  return {
    headingTitle: strField(o, "headingTitle", fallback.headingTitle).trim() || fallback.headingTitle,
    headingDescription:
      strField(o, "headingDescription", fallback.headingDescription).trim() ||
      fallback.headingDescription,
    plans,
    guaranteeTitle:
      strField(o, "guaranteeTitle", fallback.guaranteeTitle).trim() ||
      fallback.guaranteeTitle,
    guaranteeBody:
      strField(o, "guaranteeBody", fallback.guaranteeBody).trim() || fallback.guaranteeBody,
    bulkTitle: strField(o, "bulkTitle", fallback.bulkTitle).trim() || fallback.bulkTitle,
    bulkBody: strField(o, "bulkBody", fallback.bulkBody).trim() || fallback.bulkBody,
    paymentTitle:
      strField(o, "paymentTitle", fallback.paymentTitle).trim() || fallback.paymentTitle,
  };
}

function normalizeBeforeAfterPair(item: unknown): BeforeAfterPair | null {
  if (!item || typeof item !== "object") return null;
  const p = item as Record<string, unknown>;
  if (typeof p.before !== "string" || typeof p.after !== "string") return null;
  const before = p.before;
  const after = p.after;
  const d = emptyBeforeAfterFields();

  let includes: string[] = [];
  if (Array.isArray(p.includes)) {
    includes = p.includes
      .filter((x): x is string => typeof x === "string")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }

  const showDual =
    typeof p.showDualCtas === "boolean"
      ? p.showDualCtas
      : typeof p.showCtas === "boolean"
        ? p.showCtas
        : d.showDualCtas;

  return {
    before,
    after,
    title: strField(p, "title", d.title),
    intro: strField(p, "intro", d.intro),
    priceNote: strField(p, "priceNote", d.priceNote),
    listTitle: strField(p, "listTitle", d.listTitle),
    includes,
    beforeAlt: strField(p, "beforeAlt", d.beforeAlt),
    afterAlt: strField(p, "afterAlt", d.afterAlt),
    imageFirst: boolField(p, "imageFirst", d.imageFirst),
    showDualCtas: showDual,
    primaryCtaLabel: strField(p, "primaryCtaLabel", d.primaryCtaLabel),
    primaryCtaHref: strField(p, "primaryCtaHref", d.primaryCtaHref),
    secondaryCtaLabel: strField(p, "secondaryCtaLabel", d.secondaryCtaLabel),
    secondaryCtaHref: strField(p, "secondaryCtaHref", d.secondaryCtaHref),
    soloCtaLabel: strField(p, "soloCtaLabel", d.soloCtaLabel),
    soloCtaHref: strField(p, "soloCtaHref", d.soloCtaHref),
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
    if (Array.isArray(s.paymentMethods)) {
      const out: { label: string; imageUrl: string }[] = [];
      const seen = new Set<string>();
      for (const row of s.paymentMethods) {
        let label = "";
        let imageUrl = "";
        if (typeof row === "string") {
          label = row.trim();
        } else if (row && typeof row === "object") {
          const p = row as Record<string, unknown>;
          label = typeof p.label === "string" ? p.label.trim() : "";
          imageUrl = typeof p.imageUrl === "string" ? p.imageUrl.trim() : "";
        }
        if (!label) continue;
        const key = label.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({ label, imageUrl });
      }
      d.paymentMethods = out;
    }

    if (Array.isArray(s.faqs)) {
      const out: { question: string; answer: string }[] = [];
      for (const row of s.faqs) {
        if (!row || typeof row !== "object") continue;
        const p = row as Record<string, unknown>;
        const question = typeof p.question === "string" ? p.question.trim() : "";
        const answer = typeof p.answer === "string" ? p.answer.trim() : "";
        if (!question && !answer) continue;
        out.push({ question, answer });
      }
      d.faqs = out;
    }

    if (Array.isArray(s.officeLocations)) {
      const out: {
        label: string;
        address: string;
        mapUrl: string;
        phone: string;
      }[] = [];
      const seen = new Set<string>();
      for (const row of s.officeLocations) {
        if (!row || typeof row !== "object") continue;
        const p = row as Record<string, unknown>;
        if (typeof p.label !== "string") continue;
        const label = p.label.trim();
        if (label.length === 0) continue;
        const address =
          typeof p.address === "string" ? p.address.trim() : "";
        const mapUrl = typeof p.mapUrl === "string" ? p.mapUrl.trim() : "";
        const phone = typeof p.phone === "string" ? p.phone.trim() : "";
        const key = label.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({ label, address, mapUrl, phone });
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
      const row = normalizeBeforeAfterPair(ba[idx]);
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
  const byService = new Map<number, ServicePageContent>();
  if (Array.isArray(o.servicePages)) {
    for (const x of o.servicePages) {
      const row = normalizeServicePageContent(x);
      if (!row) continue;
      byService.set(row.serviceId, row);
    }
  }
  base.servicePages = base.services.map((svc) => {
    const row = byService.get(svc.id);
    const fallback = defaultServicePageContent(svc.id, svc.name);
    if (!row) return fallback;
    const name = svc.name.trim() || fallback.pageTitle;
    return {
      ...fallback,
      ...row,
      serviceId: svc.id,
      slug: toServiceSlug(row.slug || name),
      pageTitle: row.pageTitle.trim() ? row.pageTitle : name,
      pageDescription: row.pageDescription ?? fallback.pageDescription,
      introTitle: row.introTitle ?? fallback.introTitle,
      introBody: row.introBody ?? fallback.introBody,
      portfolioTitle: row.portfolioTitle ?? fallback.portfolioTitle,
      selectedPortfolioIndices: dedupeFeaturedPortfolioOrder(
        row.selectedPortfolioIndices,
        base.portfolioGrid.length,
      ),
      faqSection: normalizeServiceFaqSection(row.faqSection, fallback.faqSection),
      blocks: Array.isArray(row.blocks)
        ? row.blocks
            .map((x) => normalizeServicePageBlock(x))
            .filter((x): x is ServicePageBlock => x !== null)
        : fallback.blocks,
    };
  });

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
  base.servicePages = base.servicePages.map((row) => ({
    ...row,
    selectedPortfolioIndices: dedupeFeaturedPortfolioOrder(
      row.selectedPortfolioIndices,
      base.portfolioGrid.length,
    ),
  }));

  const fo = o.homeFeaturedPortfolioOrder;
  if (Array.isArray(fo)) {
    const raw = fo.filter(
      (x): x is number => typeof x === "number" && Number.isFinite(x),
    );
    base.homeFeaturedPortfolioOrder = dedupeFeaturedPortfolioOrder(
      raw.map((x) => Math.trunc(x)),
      base.portfolioGrid.length,
    );
  }

  base.homeReviews = normalizeHomeReviewsBlock(o.homeReviews, base.homeReviews);

  base.homeServiceFeatures = normalizeHomeServiceFeaturesBlock(
    o.homeServiceFeatures,
    base.homeServiceFeatures,
  );

  base.homeWhyChooseUs = normalizeHomeWhyChooseUsBlock(
    o.homeWhyChooseUs,
    base.homeWhyChooseUs,
  );

  base.pricing = normalizePricingContent(o.pricing, base.pricing);

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

/** Parse DB JSON string into home Why choose us block (used by `cms-repository`). */
export function parseHomeWhyChooseUsFromJson(
  raw: string | null | undefined,
): HomeWhyChooseUsBlock {
  const fallback = defaultHomeWhyChooseUsBlock();
  if (!raw?.trim()) return fallback;
  try {
    return normalizeHomeWhyChooseUsBlock(JSON.parse(raw) as unknown, fallback);
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
