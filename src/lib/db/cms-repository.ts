import "server-only";

import {
  type BeforeAfterPair,
  type CmsJson,
  type HomeReviewsBlock,
  type PricingContent,
  type ServicePageContent,
  type PortfolioGridItem,
  type ServiceRow,
  type SiteSettings,
  defaultCmsJson,
  defaultHomeReviewsBlock,
  defaultPricingContent,
  defaultServicePageContent,
  defaultHomeServiceFeaturesBlock,
  defaultHomeWhyChooseUsBlock,
  defaultSiteSettings,
  dedupeFeaturedPortfolioOrder,
  parseHomeServiceFeaturesFromJson,
  parseHomeWhyChooseUsFromJson,
} from "@/lib/cms-types";
import { ENV_VERCEL_SUPABASE } from "@/config/deployment-env";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

const { POSTGRES_PRISMA_URL, POSTGRES_URL_NON_POOLING } = ENV_VERCEL_SUPABASE;

const DEFAULT_SERVICE_NAMES = [
  "Background Removal",
  "Color Correction",
  "Shadow Masking",
  "E-Commerce Photo Editing",
  "Jewelry Retouching",
  "Photo Retouching",
];

let seedAttempted = false;

/**
 * Prisma schema expects `home_featured_portfolio_order_json`. If the DB was never
 * migrated, `findUnique` throws P2022. We add the column once (IF NOT EXISTS) so
 * local/prod recover without a failed deploy; still prefer `npm run db:migrate`.
 */
let homeFeaturedPortfolioOrderColumnEnsureAttempted = false;
let pricingColumnsEnsureAttempted = false;
let servicePagesColumnEnsureAttempted = false;

async function ensureHomeFeaturedPortfolioOrderColumnOnce(): Promise<void> {
  if (homeFeaturedPortfolioOrderColumnEnsureAttempted) return;
  homeFeaturedPortfolioOrderColumnEnsureAttempted = true;
  try {
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "home_featured_portfolio_order_json" TEXT NOT NULL DEFAULT '[]'`,
    );
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[cms] Could not ensure home_featured_portfolio_order_json column exists. Run: npx prisma migrate deploy",
        e,
      );
    }
  }
}

async function ensurePricingColumnsOnce(): Promise<void> {
  if (pricingColumnsEnsureAttempted) return;
  pricingColumnsEnsureAttempted = true;
  try {
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "pricing_json" TEXT NOT NULL DEFAULT '{}'`,
    );
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "payment_methods_json" TEXT NOT NULL DEFAULT '[]'`,
    );
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[cms] Could not ensure pricing/payment columns exist. Run: npx prisma migrate deploy",
        e,
      );
    }
  }
}

async function ensureServicePagesColumnOnce(): Promise<void> {
  if (servicePagesColumnEnsureAttempted) return;
  servicePagesColumnEnsureAttempted = true;
  try {
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "service_pages_json" TEXT NOT NULL DEFAULT '[]'`,
    );
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[cms] Could not ensure service_pages_json column exists. Run: npx prisma migrate deploy",
        e,
      );
    }
  }
}


async function seedDefaultServices(): Promise<void> {
  const n = await prisma.service.count();
  if (n > 0) return;
  await prisma.service.createMany({
    data: DEFAULT_SERVICE_NAMES.map((name, sortOrder) => ({
      sortOrder,
      name,
    })),
  });
}

/** Ensures row id=1 exists without failing on concurrent import or retry after a partial write. */
async function upsertDefaultSiteRow(site: SiteSettings): Promise<void> {
  const now = new Date().toISOString();
  await ensurePricingColumnsOnce();
  await ensureServicePagesColumnOnce();
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      businessName: site.businessName,
      domainLabel: site.domainLabel,
      email: site.email,
      whatsappDial: site.whatsappDial,
      whatsappDisplay: site.whatsappDisplay,
      socialLinksJson: JSON.stringify(site.socialLinks ?? []),
      officeLocationsJson: JSON.stringify(site.officeLocations ?? []),
      siteTagsText: site.siteTagsText ?? "",
      siteTagsSeparator: site.siteTagsSeparator ?? "newline",
      floatingCar: "",
      homeReviewsEyebrow: "",
      homeReviewsTitle: "",
      homeReviewsSubtitle: "",
      homeServiceFeaturesJson: JSON.stringify(defaultHomeServiceFeaturesBlock()),
      homeWhyChooseUsJson: JSON.stringify(defaultHomeWhyChooseUsBlock()),
      homeFeaturedPortfolioOrderJson: "[]",
      updatedAt: now,
    },
    update: {
      updatedAt: now,
    },
  });
  await prisma.$executeRaw`
    UPDATE "site_settings"
    SET "pricing_json" = ${JSON.stringify(defaultPricingContent())},
        "payment_methods_json" = ${JSON.stringify(site.paymentMethods ?? [])},
        "service_pages_json" = ${JSON.stringify([])}
    WHERE "id" = 1
  `;
}

function isMissingTablesError(e: unknown): boolean {
  return (
    e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2021"
  );
}

/** Pooler down, firewall, paused Supabase project, wrong URL, etc. */
function isDatabaseUnreachable(e: unknown): boolean {
  if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P1001") {
    return true;
  }
  return (
    e instanceof Error &&
    e.constructor.name === "PrismaClientInitializationError"
  );
}

/** Some layers wrap Prisma errors as `Error` with `cause` set. */
function isDatabaseUnreachableDeep(e: unknown): boolean {
  let cur: unknown = e;
  const seen = new Set<unknown>();
  for (let i = 0; i < 6 && cur != null; i++) {
    if (seen.has(cur)) break;
    seen.add(cur);
    if (isDatabaseUnreachable(cur)) return true;
    if (cur instanceof Error && cur.cause !== undefined) {
      cur = cur.cause;
      continue;
    }
    break;
  }
  return false;
}

const CMS_DB_CONNECT_HELP =
  `Check ${POSTGRES_PRISMA_URL}, that your Supabase project is not paused, and your network. If port 6543 (transaction pooler) fails locally, use Supabase’s Session mode URI on port 5432 for ${POSTGRES_PRISMA_URL}.`;

const CMS_LOCAL_DEV_DB_HINT =
  `Copy ${POSTGRES_PRISMA_URL} and ${POSTGRES_URL_NON_POOLING} from your Vercel project into .env so local dev uses the same database as production.`;

/** Empty DB: create site row + default services only (no file import). */
async function ensureCmsSeededIfEmpty(): Promise<void> {
  if (seedAttempted) return;

  let count: number;
  try {
    count = await prisma.siteSettings.count();
  } catch (e) {
    if (isMissingTablesError(e)) {
      throw new Error(
        "CMS database tables are missing. From the project folder run: npm run db:migrate",
      );
    }
    throw e;
  }

  seedAttempted = true;

  if (count > 0) {
    return;
  }

  await upsertDefaultSiteRow(defaultSiteSettings());
  await seedDefaultServices();
}

export type ReadCmsFromDbResult = {
  cms: CmsJson;
  /** `true` only in development when Postgres could not be reached (empty CMS fallback). */
  devDbUnreachable: boolean;
};

export async function readCmsFromDb(): Promise<ReadCmsFromDbResult> {
  try {
    await ensureHomeFeaturedPortfolioOrderColumnOnce();
    await ensurePricingColumnsOnce();
    await ensureServicePagesColumnOnce();
    await ensureCmsSeededIfEmpty();

    const siteRow = await prisma.siteSettings.findUnique({
      where: { id: 1 },
    });

    if (!siteRow) {
      return { cms: defaultCmsJson(), devDbUnreachable: false };
    }

    const extraRows = await prisma.$queryRaw<
      {
        pricing_json: string | null;
        payment_methods_json: string | null;
        service_pages_json: string | null;
      }[]
    >`SELECT "pricing_json", "payment_methods_json", "service_pages_json" FROM "site_settings" WHERE "id" = 1 LIMIT 1`;
    const extra = extraRows[0] ?? {
      pricing_json: null,
      payment_methods_json: null,
      service_pages_json: null,
    };

    const site: SiteSettings = {
      businessName: siteRow.businessName,
      domainLabel: siteRow.domainLabel,
      email: siteRow.email,
      whatsappDial: siteRow.whatsappDial,
      whatsappDisplay: siteRow.whatsappDisplay,
      officeLocations: (() => {
        try {
          const parsed = JSON.parse(siteRow.officeLocationsJson || "[]") as unknown;
          if (!Array.isArray(parsed)) return [];
          const out: {
            label: string;
            address: string;
            mapUrl: string;
            phone: string;
          }[] = [];
          for (const row of parsed) {
            if (!row || typeof row !== "object") continue;
            const p = row as Record<string, unknown>;
            if (typeof p.label !== "string") continue;
            const address =
              typeof p.address === "string" ? p.address : "";
            const mapUrl = typeof p.mapUrl === "string" ? p.mapUrl : "";
            const phone = typeof p.phone === "string" ? p.phone : "";
            out.push({ label: p.label, address, mapUrl, phone });
          }
          return out;
        } catch {
          return [];
        }
      })(),
      socialLinks: (() => {
        try {
          const parsed = JSON.parse(siteRow.socialLinksJson || "[]") as unknown;
          if (!Array.isArray(parsed)) return [];
          const out: { label: string; url: string }[] = [];
          for (const row of parsed) {
            if (!row || typeof row !== "object") continue;
            const p = row as Record<string, unknown>;
            if (typeof p.label !== "string" || typeof p.url !== "string") continue;
            out.push({ label: p.label, url: p.url });
          }
          return out;
        } catch {
          return [];
        }
      })(),
      paymentMethods: (() => {
        try {
          const parsed = JSON.parse(extra.payment_methods_json || "[]") as unknown;
          if (!Array.isArray(parsed)) return [];
          const out: { label: string; imageUrl: string }[] = [];
          for (const row of parsed) {
            if (typeof row === "string") {
              const t = row.trim();
              if (!t) continue;
              out.push({ label: t, imageUrl: "" });
              continue;
            }
            if (!row || typeof row !== "object") continue;
            const p = row as Record<string, unknown>;
            const label = typeof p.label === "string" ? p.label.trim() : "";
            if (!label) continue;
            const imageUrl = typeof p.imageUrl === "string" ? p.imageUrl.trim() : "";
            out.push({ label, imageUrl });
          }
          return out;
        } catch {
          return [];
        }
      })(),
      siteTagsText: siteRow.siteTagsText ?? "",
      siteTagsSeparator:
        siteRow.siteTagsSeparator === "comma" ||
        siteRow.siteTagsSeparator === "semicolon" ||
        siteRow.siteTagsSeparator === "pipe"
          ? siteRow.siteTagsSeparator
          : "newline",
      faqs: [],
    };

    const heroRows = await prisma.heroBanner.findMany({
      orderBy: { sortOrder: "asc" },
    });
    const heroBanners = heroRows.map((r) => r.url);

    const baRows = await prisma.beforeAfterPost.findMany({
      orderBy: { sortOrder: "asc" },
    });

    const beforeAfter: BeforeAfterPair[] = baRows.map((r) => ({
      before: r.beforeUrl,
      after: r.afterUrl,
      title: r.title,
      intro: r.intro,
      priceNote: r.priceNote,
      listTitle: r.listTitle,
      includes: JSON.parse(r.includesJson || "[]") as string[],
      beforeAlt: r.beforeAlt,
      afterAlt: r.afterAlt,
      imageFirst: r.imageFirst,
      showDualCtas: r.showDualCtas,
      primaryCtaLabel: r.primaryCtaLabel,
      primaryCtaHref: r.primaryCtaHref,
      secondaryCtaLabel: r.secondaryCtaLabel,
      secondaryCtaHref: r.secondaryCtaHref,
      soloCtaLabel: r.soloCtaLabel,
      soloCtaHref: r.soloCtaHref,
    }));

    const svcRows = await prisma.service.findMany({
      orderBy: { sortOrder: "asc" },
    });
    const services: ServiceRow[] = svcRows.map((r) => ({
      id: r.id,
      name: r.name,
    }));
    const servicePages: ServicePageContent[] = (() => {
      const map = new Map<number, ServicePageContent>();
      try {
        const raw = JSON.parse(extra.service_pages_json || "[]") as unknown;
        if (Array.isArray(raw)) {
          for (const row of raw) {
            if (!row || typeof row !== "object") continue;
            const p = row as Record<string, unknown>;
            if (typeof p.serviceId !== "number" || !Number.isFinite(p.serviceId)) {
              continue;
            }
            const serviceId = Math.trunc(p.serviceId);
            map.set(serviceId, {
              serviceId,
              slug: typeof p.slug === "string" ? p.slug : "",
              pageTitle: typeof p.pageTitle === "string" ? p.pageTitle : "",
              pageDescription:
                typeof p.pageDescription === "string" ? p.pageDescription : "",
              introTitle: typeof p.introTitle === "string" ? p.introTitle : "",
              introBody: typeof p.introBody === "string" ? p.introBody : "",
              portfolioTitle:
                typeof p.portfolioTitle === "string" ? p.portfolioTitle : "",
              selectedPortfolioIndices: Array.isArray(p.selectedPortfolioIndices)
                ? p.selectedPortfolioIndices
                    .filter(
                      (x): x is number =>
                        typeof x === "number" && Number.isFinite(x),
                    )
                    .map((x) => Math.max(0, Math.trunc(x)))
                : [],
            });
          }
        }
      } catch {
        // fall through to defaults
      }
      return services.map((svc) => map.get(svc.id) ?? defaultServicePageContent(svc.id, svc.name));
    })();

    const pfRows = await prisma.portfolioItem.findMany({
      orderBy: { sortOrder: "asc" },
    });
    const portfolioGrid: PortfolioGridItem[] = pfRows.map((r) => ({
      label: r.label,
      serviceId: r.serviceId ?? null,
      before: r.beforeUrl,
      after: r.afterUrl,
      beforeAlt: r.beforeAlt,
      afterAlt: r.afterAlt,
    }));

    let homeFeaturedPortfolioOrder: number[] = [];
    const rawOrderJson = siteRow.homeFeaturedPortfolioOrderJson ?? "[]";
    try {
      const parsed = JSON.parse(rawOrderJson) as unknown;
      if (Array.isArray(parsed)) {
        const nums = parsed.filter(
          (x): x is number => typeof x === "number" && Number.isFinite(x),
        );
        homeFeaturedPortfolioOrder = dedupeFeaturedPortfolioOrder(
          nums.map((x) => Math.trunc(x)),
          portfolioGrid.length,
        );
      }
    } catch {
      homeFeaturedPortfolioOrder = [];
    }
    if (homeFeaturedPortfolioOrder.length === 0) {
      const legacy = pfRows
        .map((r, idx) => ({
          idx,
          slot: r.homeFeaturedOrder,
        }))
        .filter(
          (x) =>
            x.slot != null && x.slot >= 1 && x.slot <= 5,
        )
        .sort((a, b) => (a.slot ?? 0) - (b.slot ?? 0) || a.idx - b.idx)
        .map((x) => x.idx);
      homeFeaturedPortfolioOrder = dedupeFeaturedPortfolioOrder(
        legacy,
        portfolioGrid.length,
      );
    }

    const reviewRows = await prisma.clientReview.findMany({
      orderBy: { sortOrder: "asc" },
    });
    const hrDefaults = defaultHomeReviewsBlock();
    const eyebrow = (siteRow.homeReviewsEyebrow ?? "").trim();
    const hrTitle = (siteRow.homeReviewsTitle ?? "").trim();
    const hrSubtitle = (siteRow.homeReviewsSubtitle ?? "").trim();
    const homeReviews: HomeReviewsBlock = {
      eyebrow: eyebrow || hrDefaults.eyebrow,
      title: hrTitle || hrDefaults.title,
      subtitle: hrSubtitle || hrDefaults.subtitle,
      items: reviewRows.map((r) => ({
        quote: r.message,
        name: r.clientName,
        role: r.role,
        rating: Math.min(5, Math.max(1, Math.round(r.rating))),
        avatarSrc: r.avatarUrl,
      })),
    };

    const homeServiceFeatures = parseHomeServiceFeaturesFromJson(
      siteRow.homeServiceFeaturesJson,
    );

    const homeWhyChooseUs = parseHomeWhyChooseUsFromJson(
      siteRow.homeWhyChooseUsJson,
    );

    const pricing: PricingContent = (() => {
      const fallback = defaultPricingContent();
      try {
        const parsed = JSON.parse(extra.pricing_json || "{}") as unknown;
        const merged = {
          ...fallback,
          ...(parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {}),
        } as PricingContent;
        if (!Array.isArray(merged.plans) || merged.plans.length === 0) return fallback;
        return merged;
      } catch {
        return fallback;
      }
    })();

    return {
      cms: {
        site,
        heroBanners,
        floatingCar: siteRow.floatingCar ?? "",
        beforeAfter,
        services,
        servicePages,
        portfolioGrid,
        homeFeaturedPortfolioOrder,
        homeReviews,
        homeServiceFeatures,
        homeWhyChooseUs,
        pricing,
        updatedAt: siteRow.updatedAt ?? "",
      },
      devDbUnreachable: false,
    };
  } catch (e) {
    if (isDatabaseUnreachableDeep(e)) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[cms] Postgres unreachable — empty CMS in dev. " +
            CMS_DB_CONNECT_HELP +
            " " +
            CMS_LOCAL_DEV_DB_HINT,
        );
        return { cms: defaultCmsJson(), devDbUnreachable: true };
      }
      throw new Error(`CMS: ${CMS_DB_CONNECT_HELP}`, { cause: e });
    }
    throw e;
  }
}

async function writeCmsInternal(cms: CmsJson): Promise<CmsJson> {
  await ensureHomeFeaturedPortfolioOrderColumnOnce();
  await ensurePricingColumnsOnce();
  await ensureServicePagesColumnOnce();
  await ensureCmsSeededIfEmpty();

  const now = new Date().toISOString();
  const site = cms.site;

  await prisma.$transaction(
    async (tx) => {
    await tx.siteSettings.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        businessName: site.businessName,
        domainLabel: site.domainLabel,
        email: site.email,
        whatsappDial: site.whatsappDial,
        whatsappDisplay: site.whatsappDisplay,
          socialLinksJson: JSON.stringify(site.socialLinks ?? []),
          officeLocationsJson: JSON.stringify(site.officeLocations ?? []),
          siteTagsText: site.siteTagsText ?? "",
          siteTagsSeparator: site.siteTagsSeparator ?? "newline",
        floatingCar: cms.floatingCar.trim(),
        homeReviewsEyebrow: cms.homeReviews.eyebrow.trim(),
        homeReviewsTitle: cms.homeReviews.title.trim(),
        homeReviewsSubtitle: cms.homeReviews.subtitle.trim(),
        homeServiceFeaturesJson: JSON.stringify(cms.homeServiceFeatures),
        homeWhyChooseUsJson: JSON.stringify(cms.homeWhyChooseUs),
        homeFeaturedPortfolioOrderJson: JSON.stringify(
          cms.homeFeaturedPortfolioOrder ?? [],
        ),
        updatedAt: now,
      },
      update: {
        businessName: site.businessName,
        domainLabel: site.domainLabel,
        email: site.email,
        whatsappDial: site.whatsappDial,
        whatsappDisplay: site.whatsappDisplay,
          socialLinksJson: JSON.stringify(site.socialLinks ?? []),
          officeLocationsJson: JSON.stringify(site.officeLocations ?? []),
          siteTagsText: site.siteTagsText ?? "",
          siteTagsSeparator: site.siteTagsSeparator ?? "newline",
        floatingCar: cms.floatingCar.trim(),
        homeReviewsEyebrow: cms.homeReviews.eyebrow.trim(),
        homeReviewsTitle: cms.homeReviews.title.trim(),
        homeReviewsSubtitle: cms.homeReviews.subtitle.trim(),
        homeServiceFeaturesJson: JSON.stringify(cms.homeServiceFeatures),
        homeWhyChooseUsJson: JSON.stringify(cms.homeWhyChooseUs),
        homeFeaturedPortfolioOrderJson: JSON.stringify(
          cms.homeFeaturedPortfolioOrder ?? [],
        ),
        updatedAt: now,
      },
    });

    await tx.$executeRaw`
      UPDATE "site_settings"
      SET "pricing_json" = ${JSON.stringify(cms.pricing)},
          "payment_methods_json" = ${JSON.stringify(cms.site.paymentMethods ?? [])}
      WHERE "id" = 1
    `;

    await tx.heroBanner.deleteMany();
    if (cms.heroBanners.length > 0) {
      await tx.heroBanner.createMany({
        data: cms.heroBanners.map((url, sortOrder) => ({
          sortOrder,
          url,
        })),
      });
    }

    await tx.beforeAfterPost.deleteMany();
    if (cms.beforeAfter.length > 0) {
      await tx.beforeAfterPost.createMany({
        data: cms.beforeAfter.map((p, sortOrder) => ({
          sortOrder,
          beforeUrl: p.before,
          afterUrl: p.after,
          title: p.title,
          intro: p.intro,
          priceNote: p.priceNote,
          listTitle: p.listTitle,
          includesJson: JSON.stringify(p.includes),
          beforeAlt: p.beforeAlt,
          afterAlt: p.afterAlt,
          imageFirst: p.imageFirst,
          showDualCtas: p.showDualCtas,
          primaryCtaLabel: p.primaryCtaLabel,
          primaryCtaHref: p.primaryCtaHref,
          secondaryCtaLabel: p.secondaryCtaLabel,
          secondaryCtaHref: p.secondaryCtaHref,
          soloCtaLabel: p.soloCtaLabel,
          soloCtaHref: p.soloCtaHref,
        })),
      });
    }

    const idMap = new Map<number, number>();
    const incoming = cms.services.filter((s) => s.name.trim().length > 0);

    for (let i = 0; i < incoming.length; i++) {
      const s = incoming[i]!;
      if (s.id > 0) {
        const row = await tx.service.findUnique({ where: { id: s.id } });
        if (row) {
          await tx.service.update({
            where: { id: s.id },
            data: { name: s.name.trim(), sortOrder: i },
          });
          idMap.set(s.id, s.id);
        } else {
          const created = await tx.service.create({
            data: { name: s.name.trim(), sortOrder: i },
          });
          idMap.set(s.id, created.id);
        }
      } else {
        const created = await tx.service.create({
          data: { name: s.name.trim(), sortOrder: i },
        });
        idMap.set(s.id, created.id);
      }
    }

    const keepIds = new Set<number>();
    for (const s of incoming) {
      const mapped = idMap.get(s.id);
      if (mapped !== undefined) keepIds.add(mapped);
    }

    const allSvc = await tx.service.findMany({ select: { id: true } });
    for (const { id } of allSvc) {
      if (!keepIds.has(id)) {
        await tx.service.delete({ where: { id } });
      }
    }

    const finalRows = await tx.service.findMany({ select: { id: true } });
    const finalIds = new Set(finalRows.map((r) => r.id));

    function resolveServiceId(sid: number | null): number | null {
      if (sid === null || sid === undefined) return null;
      const mapped = idMap.has(sid) ? idMap.get(sid)! : sid;
      return finalIds.has(mapped) ? mapped : null;
    }

    const normalizedServicePages = (cms.servicePages ?? [])
      .map((row) => ({
        ...row,
        serviceId: resolveServiceId(row.serviceId) ?? 0,
      }))
      .filter((row) => row.serviceId > 0);
    await tx.$executeRaw`
      UPDATE "site_settings"
      SET "service_pages_json" = ${JSON.stringify(normalizedServicePages)}
      WHERE "id" = 1
    `;

    await tx.portfolioItem.deleteMany();
    if (cms.portfolioGrid.length > 0) {
      await tx.portfolioItem.createMany({
        data: cms.portfolioGrid.map((p, sortOrder) => ({
          sortOrder,
          label: p.label.trim(),
          serviceId: resolveServiceId(p.serviceId),
          beforeUrl: p.before,
          afterUrl: p.after,
          beforeAlt: p.beforeAlt,
          afterAlt: p.afterAlt,
          homeFeaturedOrder: null,
        })),
      });
    }

    await tx.clientReview.deleteMany();
    const reviewItems = cms.homeReviews.items.filter(
      (r) => r.name.trim().length > 0 && r.quote.trim().length > 0,
    );
    if (reviewItems.length > 0) {
      await tx.clientReview.createMany({
        data: reviewItems.map((r, sortOrder) => ({
          sortOrder,
          clientName: r.name.trim(),
          role: r.role.trim(),
          rating: Math.min(5, Math.max(1, Math.round(r.rating))),
          message: r.quote.trim(),
          avatarUrl: r.avatarSrc.trim(),
        })),
      });
    }
    },
    // Interactive transaction can exceed Prisma default (5s) in dev.
    { maxWait: 15_000, timeout: 60_000 },
  );

  const r = await readCmsFromDb();
  return r.cms;
}

export async function writeCmsToDb(cms: CmsJson): Promise<CmsJson> {
  try {
    return await writeCmsInternal(cms);
  } catch (e) {
    if (isDatabaseUnreachableDeep(e)) {
      throw new Error(`Cannot save CMS: ${CMS_DB_CONNECT_HELP}`, {
        cause: e,
      });
    }
    throw e;
  }
}
