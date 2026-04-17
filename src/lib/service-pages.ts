import {
  type CmsJson,
  type PortfolioGridItem,
  type ServicePageContent,
  type ServiceRow,
  toServiceSlug,
} from "@/lib/cms-types";

export type ServicePageResolved = {
  serviceId: number;
  serviceName: string;
  slug: string;
  page: ServicePageContent;
  portfolioItems: PortfolioGridItem[];
};

function isCompletePortfolio(item: PortfolioGridItem) {
  return item.before.trim().length > 0 && item.after.trim().length > 0;
}

function uniqueSlug(base: string, used: Set<string>): string {
  let slug = toServiceSlug(base);
  let i = 2;
  while (used.has(slug)) {
    slug = `${toServiceSlug(base)}-${i}`;
    i += 1;
  }
  used.add(slug);
  return slug;
}

export function getResolvedServicePages(cms: CmsJson): ServicePageResolved[] {
  const pagesByService = new Map(
    (cms.servicePages ?? []).map((row) => [row.serviceId, row]),
  );
  const used = new Set<string>();
  return cms.services.map((svc) => {
    const base =
      pagesByService.get(svc.id) ?? {
        serviceId: svc.id,
        slug: "",
        pageTitle: svc.name,
        pageDescription: "",
        introTitle: svc.name,
        introBody: "",
        portfolioTitle: `${svc.name} Portfolio`,
        selectedPortfolioIndices: [],
      };
    const slug = uniqueSlug(base.slug || svc.name, used);
    const selected = base.selectedPortfolioIndices
      .map((idx) => cms.portfolioGrid[idx])
      .filter((x): x is PortfolioGridItem => Boolean(x))
      .filter(isCompletePortfolio);
    const fallback = cms.portfolioGrid.filter(
      (p) => p.serviceId === svc.id && isCompletePortfolio(p),
    );
    return {
      serviceId: svc.id,
      serviceName: svc.name.trim() || "Untitled service",
      slug,
      page: { ...base, slug, pageTitle: base.pageTitle || svc.name },
      portfolioItems: selected.length > 0 ? selected : fallback,
    };
  });
}

export function getServiceHrefMap(
  services: ServiceRow[],
  servicePages: ServicePageContent[] = [],
): Map<number, string> {
  const used = new Set<string>();
  const byService = new Map(servicePages.map((row) => [row.serviceId, row]));
  const out = new Map<number, string>();
  for (const svc of services) {
    const base = byService.get(svc.id)?.slug || svc.name;
    out.set(svc.id, `/services/${uniqueSlug(base, used)}`);
  }
  return out;
}
