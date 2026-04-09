import "server-only";

import {
  type BeforeAfterPair,
  type CmsJson,
  type HomeReviewsBlock,
  type PortfolioGridItem,
  type ServiceRow,
  type SiteSettings,
  defaultCmsJson,
  defaultHomeReviewsBlock,
  defaultHomeServiceFeaturesBlock,
  defaultSiteSettings,
  parseHomeServiceFeaturesFromJson,
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
      updatedAt: now,
    },
    update: {
      updatedAt: now,
    },
  });
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
    await ensureCmsSeededIfEmpty();

    const siteRow = await prisma.siteSettings.findUnique({
      where: { id: 1 },
    });

    if (!siteRow) {
      return { cms: defaultCmsJson(), devDbUnreachable: false };
    }

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
          const out: { label: string; address: string; mapUrl: string }[] = [];
          for (const row of parsed) {
            if (!row || typeof row !== "object") continue;
            const p = row as Record<string, unknown>;
            if (
              typeof p.label !== "string" ||
              typeof p.address !== "string" ||
              typeof p.mapUrl !== "string"
            ) {
              continue;
            }
            out.push({ label: p.label, address: p.address, mapUrl: p.mapUrl });
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
      siteTagsText: siteRow.siteTagsText ?? "",
      siteTagsSeparator:
        siteRow.siteTagsSeparator === "comma" ||
        siteRow.siteTagsSeparator === "semicolon" ||
        siteRow.siteTagsSeparator === "pipe"
          ? siteRow.siteTagsSeparator
          : "newline",
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

    return {
      cms: {
        site,
        heroBanners,
        floatingCar: siteRow.floatingCar ?? "",
        beforeAfter,
        services,
        portfolioGrid,
        homeReviews,
        homeServiceFeatures,
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
        updatedAt: now,
      },
    });

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
