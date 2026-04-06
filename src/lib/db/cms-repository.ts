import "server-only";

import fs from "fs";
import path from "path";
import {
  type BeforeAfterPair,
  type CmsJson,
  type PortfolioGridItem,
  type ServiceRow,
  type SiteSettings,
  defaultCmsJson,
  defaultSiteSettings,
  normalizeCmsJson,
} from "@/lib/cms-types";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

const CMS_JSON = path.join(process.cwd(), "data", "cms.json");

const DEFAULT_SERVICE_NAMES = [
  "Background Removal",
  "Color Correction",
  "Shadow Masking",
  "E-Commerce Photo Editing",
  "Jewelry Retouching",
  "Photo Retouching",
];

let legacyImportAttempted = false;

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
      floatingCar: "",
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

async function importLegacyCmsJsonIfNeeded(): Promise<void> {
  if (legacyImportAttempted) return;

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

  legacyImportAttempted = true;

  if (count > 0) {
    return;
  }

  if (!fs.existsSync(CMS_JSON)) {
    await upsertDefaultSiteRow(defaultSiteSettings());
    await seedDefaultServices();
    return;
  }

  try {
    const raw = JSON.parse(fs.readFileSync(CMS_JSON, "utf-8"));
    const cms = normalizeCmsJson(raw);
    await writeCmsInternal(cms, { skipLegacyImport: true });
  } catch {
    await upsertDefaultSiteRow(defaultSiteSettings());
    await seedDefaultServices();
  }
}

export async function readCmsFromDb(): Promise<CmsJson> {
  await importLegacyCmsJsonIfNeeded();

  const siteRow = await prisma.siteSettings.findUnique({
    where: { id: 1 },
  });

  if (!siteRow) {
    return defaultCmsJson();
  }

  const site: SiteSettings = {
    businessName: siteRow.businessName,
    domainLabel: siteRow.domainLabel,
    email: siteRow.email,
    whatsappDial: siteRow.whatsappDial,
    whatsappDisplay: siteRow.whatsappDisplay,
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

  return {
    site,
    heroBanners,
    floatingCar: siteRow.floatingCar ?? "",
    beforeAfter,
    services,
    portfolioGrid,
    updatedAt: siteRow.updatedAt ?? "",
  };
}

type WriteOpts = { skipLegacyImport?: boolean };

async function writeCmsInternal(
  cms: CmsJson,
  opts?: WriteOpts,
): Promise<CmsJson> {
  if (!opts?.skipLegacyImport) {
    await importLegacyCmsJsonIfNeeded();
  }

  const now = new Date().toISOString();
  const site = cms.site;

  await prisma.$transaction(async (tx) => {
    await tx.siteSettings.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        businessName: site.businessName,
        domainLabel: site.domainLabel,
        email: site.email,
        whatsappDial: site.whatsappDial,
        whatsappDisplay: site.whatsappDisplay,
        floatingCar: cms.floatingCar.trim(),
        updatedAt: now,
      },
      update: {
        businessName: site.businessName,
        domainLabel: site.domainLabel,
        email: site.email,
        whatsappDial: site.whatsappDial,
        whatsappDisplay: site.whatsappDisplay,
        floatingCar: cms.floatingCar.trim(),
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
  });

  return readCmsFromDb();
}

export async function writeCmsToDb(cms: CmsJson): Promise<CmsJson> {
  return writeCmsInternal(cms, {});
}
