"use client";

import {
  type BeforeAfterPair,
  type CmsJson,
  defaultBeforeAfterPair,
  defaultHomeReviewItem,
  defaultHomeServiceFeatureItem,
  defaultPortfolioGridItem,
  type HomeReviewItem,
  type HomeReviewsBlock,
  type HomeServiceFeatureItem,
  type HomeServiceFeaturesBlock,
  type HomeWhyChoosePillar,
  type HomeWhyChooseUsBlock,
  type PortfolioGridItem,
  type PricingContent,
  type PricingPlan,
  type ServicePageContent,
  type SiteSettings,
  dedupeFeaturedPortfolioOrder,
  defaultServicePageContent,
  normalizeServicePageContent,
  defaultHomeWhyChoosePillar,
  defaultHomeWhyChooseUsBlock,
  remapFeaturedOrderAfterRemove,
  remapFeaturedOrderAfterSwap,
  toServiceSlug,
} from "@/lib/cms-types";

function nextTempServiceId(
  services: { id: number; name: string }[],
): number {
  const ids = services.map((s) => s.id);
  const floor = ids.length ? Math.min(...ids, 0) : 0;
  return floor - 1;
}
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { adminUploadFile } from "@/components/admin/admin-upload";

type AdminCmsContextValue = {
  cms: CmsJson | null;
  loading: boolean;
  loadError: string;
  saving: boolean;
  flash: { type: "ok" | "err"; text: string } | null;
  setFlash: (v: { type: "ok" | "err"; text: string } | null) => void;
  setCms: React.Dispatch<React.SetStateAction<CmsJson | null>>;
  refresh: () => Promise<void>;
  save: () => Promise<boolean>;
  upload: (file: File) => Promise<string>;
  updateSite: (patch: Partial<SiteSettings>) => void;
  setHeroBanners: (urls: string[]) => void;
  setFloatingCar: (url: string) => void;
  setBeforeAfter: (pairs: BeforeAfterPair[]) => void;
  moveBanner: (index: number, dir: -1 | 1) => void;
  removeBanner: (index: number) => void;
  addBannerUrl: (url: string) => void;
  setPair: (index: number, patch: Partial<BeforeAfterPair>) => void;
  addPair: () => void;
  removePair: (index: number) => void;
  moveBeforeAfterPost: (index: number, dir: -1 | 1) => void;
  setPortfolioItem: (
    index: number,
    patch: Partial<PortfolioGridItem>,
  ) => void;
  addPortfolioItem: () => void;
  removePortfolioItem: (index: number) => void;
  movePortfolioItem: (index: number, dir: -1 | 1) => void;
  addService: () => void;
  removeService: (index: number) => void;
  moveService: (index: number, dir: -1 | 1) => void;
  setService: (index: number, patch: { name?: string }) => void;
  setServicePage: (
    serviceId: number,
    patch: Partial<Omit<ServicePageContent, "serviceId">>,
  ) => void;
  patchHomeReviews: (patch: Partial<HomeReviewsBlock>) => void;
  setHomeReviewItem: (index: number, patch: Partial<HomeReviewItem>) => void;
  addHomeReview: () => void;
  removeHomeReview: (index: number) => void;
  moveHomeReview: (index: number, dir: -1 | 1) => void;
  patchHomeServiceFeatures: (patch: Partial<HomeServiceFeaturesBlock>) => void;
  setServiceFeatureItem: (
    index: number,
    patch: Partial<HomeServiceFeatureItem>,
  ) => void;
  addServiceFeatureItem: () => void;
  removeServiceFeatureItem: (index: number) => void;
  moveServiceFeatureItem: (index: number, dir: -1 | 1) => void;
  patchHomeWhyChooseUs: (patch: Partial<HomeWhyChooseUsBlock>) => void;
  patchPricing: (patch: Partial<PricingContent>) => void;
  setPricingPlan: (index: number, patch: Partial<PricingPlan>) => void;
  addPricingPlan: () => void;
  removePricingPlan: (index: number) => void;
  movePricingPlan: (index: number, dir: -1 | 1) => void;
  setWhyChoosePillarItem: (
    index: number,
    patch: Partial<HomeWhyChoosePillar>,
  ) => void;
  addWhyChoosePillar: () => void;
  removeWhyChoosePillar: (index: number) => void;
  moveWhyChoosePillar: (index: number, dir: -1 | 1) => void;
  setHomeFeaturedPortfolioOrder: (order: number[]) => void;
};

const AdminCmsContext = createContext<AdminCmsContextValue | null>(null);

function sanitizePayload(cms: CmsJson): CmsJson {
  return {
    ...cms,
    floatingCar: cms.floatingCar.trim(),
    heroBanners: cms.heroBanners.filter((u) => u.trim().length > 0),
    beforeAfter: cms.beforeAfter.map((p) => ({
      ...p,
      before: p.before.trim(),
      after: p.after.trim(),
      title: p.title.trim(),
      intro: p.intro.trim(),
      priceNote: p.priceNote.trim(),
      listTitle: p.listTitle.trim(),
      includes: p.includes.map((s) => s.trim()).filter((s) => s.length > 0),
      beforeAlt: p.beforeAlt.trim(),
      afterAlt: p.afterAlt.trim(),
      primaryCtaLabel: p.primaryCtaLabel.trim(),
      primaryCtaHref: p.primaryCtaHref.trim(),
      secondaryCtaLabel: p.secondaryCtaLabel.trim(),
      secondaryCtaHref: p.secondaryCtaHref.trim(),
      soloCtaLabel: p.soloCtaLabel.trim(),
      soloCtaHref: p.soloCtaHref.trim(),
    })),
    services: (() => {
      const seen = new Set<string>();
      const out: { id: number; name: string }[] = [];
      for (const s of cms.services) {
        const name = s.name.trim();
        if (name.length === 0) continue;
        const key = name.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({ id: s.id, name });
      }
      return out;
    })(),
    servicePages: (() => {
      const out: ServicePageContent[] = [];
      const byId = new Map(cms.servicePages.map((row) => [row.serviceId, row]));
      for (const service of cms.services) {
        const fallback = defaultServicePageContent(service.id, service.name);
        const current = byId.get(service.id);
        const name = service.name.trim() || fallback.pageTitle;
        const merged = normalizeServicePageContent({
          ...fallback,
          ...current,
          serviceId: service.id,
          slug: (current?.slug ?? fallback.slug) || name,
          pageTitle: current?.pageTitle ?? name,
        });
        if (!merged) continue;
        out.push({
          ...merged,
          slug: toServiceSlug(merged.slug || name),
          pageTitle: merged.pageTitle.trim() || name,
          selectedPortfolioIndices: dedupeFeaturedPortfolioOrder(
            merged.selectedPortfolioIndices,
            cms.portfolioGrid.length,
          ),
        });
      }
      return out;
    })(),
    portfolioGrid: cms.portfolioGrid.map((p) => ({
      ...p,
      label: p.label.trim(),
      before: p.before.trim(),
      after: p.after.trim(),
      beforeAlt: p.beforeAlt.trim(),
      afterAlt: p.afterAlt.trim(),
    })),
    homeFeaturedPortfolioOrder: dedupeFeaturedPortfolioOrder(
      cms.homeFeaturedPortfolioOrder ?? [],
      cms.portfolioGrid.length,
    ),
    homeReviews: {
      ...cms.homeReviews,
      eyebrow: cms.homeReviews.eyebrow.trim(),
      title: cms.homeReviews.title.trim(),
      subtitle: cms.homeReviews.subtitle.trim(),
      items: cms.homeReviews.items.map((r) => ({
        ...r,
        quote: r.quote.trim(),
        name: r.name.trim(),
        role: r.role.trim(),
        avatarSrc: r.avatarSrc.trim(),
        rating: Math.min(5, Math.max(1, Math.round(Number(r.rating) || 5))),
      })),
    },
    homeServiceFeatures: {
      ...cms.homeServiceFeatures,
      intro: cms.homeServiceFeatures.intro.trim(),
      sectionTitle: cms.homeServiceFeatures.sectionTitle.trim(),
      ctaLabel: cms.homeServiceFeatures.ctaLabel.trim(),
      ctaHref: cms.homeServiceFeatures.ctaHref.trim(),
      beforeAfterSectionEyebrow:
        cms.homeServiceFeatures.beforeAfterSectionEyebrow.trim(),
      beforeAfterSectionTitle:
        cms.homeServiceFeatures.beforeAfterSectionTitle.trim(),
      items: cms.homeServiceFeatures.items.map((it) => ({
        iconKey: it.iconKey.trim() || "sparkles",
        title: it.title.trim(),
        body: it.body.trim(),
      })),
    },
    homeWhyChooseUs: (() => {
      const fb = defaultHomeWhyChooseUsBlock();
      const badges = cms.homeWhyChooseUs.badges.map((b) => b.trim());
      while (badges.length < 3) badges.push(fb.badges[badges.length] ?? "");
      const pillars = cms.homeWhyChooseUs.pillars.map((p) => ({
        iconKey: (p.iconKey ?? "").trim() || "shield",
        title: p.title.trim(),
        body: p.body.trim(),
      }));
      const workflowSteps = cms.homeWhyChooseUs.workflowSteps.map((s) => ({
        title: s.title.trim(),
        subtitle: s.subtitle.trim(),
      }));
      while (workflowSteps.length < 5) {
        workflowSteps.push({ ...fb.workflowSteps[workflowSteps.length]! });
      }
      return {
        headline: cms.homeWhyChooseUs.headline.trim() || fb.headline,
        intro: cms.homeWhyChooseUs.intro.trim() || fb.intro,
        manualAiLabel:
          (cms.homeWhyChooseUs.manualAiLabel ?? "").trim() || fb.manualAiLabel,
        badges: badges.slice(0, 3),
        easyCommunicationTitle: "",
        easyCommunicationBody: "",
        pillars,
        workflowTitle: cms.homeWhyChooseUs.workflowTitle.trim() || fb.workflowTitle,
        workflowIntro: (cms.homeWhyChooseUs.workflowIntro ?? "").trim(),
        teamPhotoSrc: cms.homeWhyChooseUs.teamPhotoSrc.trim(),
        teamPhotoAlt: cms.homeWhyChooseUs.teamPhotoAlt.trim() || fb.teamPhotoAlt,
        workflowSteps: workflowSteps.slice(0, 5),
        portfolioStripTitle:
          (cms.homeWhyChooseUs.portfolioStripTitle ?? "").trim() ||
          fb.portfolioStripTitle,
        portfolioStripCtaLabel:
          (cms.homeWhyChooseUs.portfolioStripCtaLabel ?? "").trim() ||
          fb.portfolioStripCtaLabel,
      };
    })(),
    pricing: {
      ...cms.pricing,
      headingTitle: cms.pricing.headingTitle.trim(),
      headingDescription: cms.pricing.headingDescription.trim(),
      guaranteeTitle: cms.pricing.guaranteeTitle.trim(),
      guaranteeBody: cms.pricing.guaranteeBody.trim(),
      bulkTitle: cms.pricing.bulkTitle.trim(),
      bulkBody: cms.pricing.bulkBody.trim(),
      paymentTitle: cms.pricing.paymentTitle.trim(),
      plans: cms.pricing.plans.map((p) => ({
        packageLabel: p.packageLabel.trim(),
        title: p.title.trim(),
        singlePrice: p.singlePrice.trim(),
        bulkPrice: p.bulkPrice.trim(),
        features: p.features.map((f) => f.trim()).filter((f) => f.length > 0),
        featured: Boolean(p.featured),
      })),
    },
    site: {
      ...cms.site,
      businessName: cms.site.businessName.trim(),
      domainLabel: cms.site.domainLabel.trim(),
      email: cms.site.email.trim(),
      whatsappDial: cms.site.whatsappDial.replace(/\D/g, "") || cms.site.whatsappDial,
      whatsappDisplay: cms.site.whatsappDisplay.trim(),
      siteTagsText: cms.site.siteTagsText,
      siteTagsSeparator: cms.site.siteTagsSeparator,
      officeLocations: cms.site.officeLocations.map((o) => ({
        label: o.label.trim(),
        address: o.address.trim(),
        mapUrl: o.mapUrl.trim(),
        phone: (o.phone ?? "").trim(),
      })),
      socialLinks: (() => {
        const seen = new Set<string>();
        const out: { label: string; url: string }[] = [];
        for (const row of cms.site.socialLinks) {
          const label = row.label.trim();
          const url = row.url.trim();
          if (label.length === 0) continue;
          const key = label.toLowerCase();
          if (seen.has(key)) continue;
          seen.add(key);
          out.push({ label, url });
        }
        return out;
      })(),
      paymentMethods: (() => {
        const out: { label: string; imageUrl: string }[] = [];
        const seen = new Set<string>();
        for (const row of cms.site.paymentMethods ?? []) {
          const label = row.label.trim();
          if (!label) continue;
          const key = label.toLowerCase();
          if (seen.has(key)) continue;
          seen.add(key);
          out.push({ label, imageUrl: row.imageUrl.trim() });
        }
        return out;
      })(),
      faqs: (() => {
        const out: { question: string; answer: string }[] = [];
        for (const row of cms.site.faqs ?? []) {
          const question = row.question.trim();
          const answer = row.answer.trim();
          if (!question && !answer) continue;
          out.push({ question, answer });
        }
        return out;
      })(),
    } satisfies SiteSettings,
  };
}

export function AdminCmsProvider({ children }: { children: ReactNode }) {
  const [cms, setCms] = useState<CmsJson | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState<{ type: "ok" | "err"; text: string } | null>(
    null,
  );

  const refresh = useCallback(async () => {
    setLoadError("");
    setLoading(true);
    try {
      const request = () =>
        fetch("/api/admin/cms", {
          credentials: "include",
          cache: "no-store",
        });
      let r: Response;
      try {
        r = await request();
      } catch {
        // Dev HMR/domain handoff can briefly fail fetches; retry once.
        await new Promise((resolve) => setTimeout(resolve, 450));
        r = await request();
      }
      if (!r.ok) {
        if (r.status === 401) {
          window.location.href = "/admin-panel/login";
          return;
        }
        setLoadError("Could not load CMS data.");
        return;
      }
      setCms((await r.json()) as CmsJson);
    } catch {
      setLoadError(
        "Could not load CMS data (network error). If you are in dev mode, restart `npm run dev` and reload.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const save = useCallback(async () => {
    if (!cms) return false;
    setSaving(true);
    setFlash(null);
    try {
      const payload = sanitizePayload(cms);
      const r = await fetch("/api/admin/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      if (r.status === 401) {
        window.location.href = "/admin-panel/login";
        return false;
      }
      if (!r.ok) throw new Error("save");
      setCms((await r.json()) as CmsJson);
      setFlash({ type: "ok", text: "Published." });
      setTimeout(() => setFlash(null), 5000);
      return true;
    } catch {
      setFlash({ type: "err", text: "Save failed." });
      return false;
    } finally {
      setSaving(false);
    }
  }, [cms]);

  const upload = useCallback(async (file: File) => {
    return adminUploadFile(file);
  }, []);

  const updateSite = useCallback((patch: Partial<SiteSettings>) => {
    setCms((c) => (c ? { ...c, site: { ...c.site, ...patch } } : c));
  }, []);

  const setHeroBanners = useCallback((urls: string[]) => {
    setCms((c) => (c ? { ...c, heroBanners: urls } : c));
  }, []);

  const setFloatingCar = useCallback((url: string) => {
    setCms((c) => (c ? { ...c, floatingCar: url } : c));
  }, []);

  const setBeforeAfter = useCallback((pairs: BeforeAfterPair[]) => {
    setCms((c) => (c ? { ...c, beforeAfter: pairs } : c));
  }, []);

  const moveBanner = useCallback((index: number, dir: -1 | 1) => {
    setCms((c) => {
      if (!c) return c;
      const j = index + dir;
      if (j < 0 || j >= c.heroBanners.length) return c;
      const next = [...c.heroBanners];
      [next[index], next[j]] = [next[j], next[index]];
      return { ...c, heroBanners: next };
    });
  }, []);

  const removeBanner = useCallback((index: number) => {
    setCms((c) =>
      c
        ? { ...c, heroBanners: c.heroBanners.filter((_, k) => k !== index) }
        : c,
    );
  }, []);

  const addBannerUrl = useCallback((url: string) => {
    setCms((c) => (c ? { ...c, heroBanners: [...c.heroBanners, url] } : c));
  }, []);

  const setPair = useCallback((index: number, patch: Partial<BeforeAfterPair>) => {
    setCms((c) => {
      if (!c) return c;
      const beforeAfter = c.beforeAfter.map((p, k) =>
        k === index ? { ...p, ...patch } : p,
      );
      return { ...c, beforeAfter };
    });
  }, []);

  const addPair = useCallback(() => {
    setCms((c) =>
      c
        ? {
            ...c,
            beforeAfter: [
              ...c.beforeAfter,
              defaultBeforeAfterPair(),
            ],
          }
        : c,
    );
  }, []);

  const removePair = useCallback((index: number) => {
    setCms((c) =>
      c
        ? { ...c, beforeAfter: c.beforeAfter.filter((_, k) => k !== index) }
        : c,
    );
  }, []);

  const moveBeforeAfterPost = useCallback((index: number, dir: -1 | 1) => {
    setCms((c) => {
      if (!c) return c;
      const j = index + dir;
      if (j < 0 || j >= c.beforeAfter.length) return c;
      const next = [...c.beforeAfter];
      [next[index], next[j]] = [next[j], next[index]];
      return { ...c, beforeAfter: next };
    });
  }, []);

  const setPortfolioItem = useCallback(
    (index: number, patch: Partial<PortfolioGridItem>) => {
      setCms((c) => {
        if (!c) return c;
        const portfolioGrid = c.portfolioGrid.map((p, k) =>
          k === index ? { ...p, ...patch } : p,
        );
        return { ...c, portfolioGrid };
      });
    },
    [],
  );

  const addPortfolioItem = useCallback(() => {
    setCms((c) =>
      c
        ? {
            ...c,
            portfolioGrid: [...c.portfolioGrid, defaultPortfolioGridItem()],
          }
        : c,
    );
  }, []);

  const removePortfolioItem = useCallback((index: number) => {
    setCms((c) => {
      if (!c) return c;
      return {
        ...c,
        portfolioGrid: c.portfolioGrid.filter((_, k) => k !== index),
        homeFeaturedPortfolioOrder: remapFeaturedOrderAfterRemove(
          c.homeFeaturedPortfolioOrder ?? [],
          index,
        ),
        servicePages: c.servicePages.map((row) => ({
          ...row,
          selectedPortfolioIndices: remapFeaturedOrderAfterRemove(
            row.selectedPortfolioIndices,
            index,
          ),
        })),
      };
    });
  }, []);

  const movePortfolioItem = useCallback((index: number, dir: -1 | 1) => {
    setCms((c) => {
      if (!c) return c;
      const j = index + dir;
      if (j < 0 || j >= c.portfolioGrid.length) return c;
      const next = [...c.portfolioGrid];
      [next[index], next[j]] = [next[j]!, next[index]!];
      return {
        ...c,
        portfolioGrid: next,
        homeFeaturedPortfolioOrder: remapFeaturedOrderAfterSwap(
          c.homeFeaturedPortfolioOrder ?? [],
          index,
          j,
        ),
        servicePages: c.servicePages.map((row) => ({
          ...row,
          selectedPortfolioIndices: remapFeaturedOrderAfterSwap(
            row.selectedPortfolioIndices,
            index,
            j,
          ),
        })),
      };
    });
  }, []);

  const setHomeFeaturedPortfolioOrder = useCallback((order: number[]) => {
    setCms((c) => {
      if (!c) return c;
      return {
        ...c,
        homeFeaturedPortfolioOrder: dedupeFeaturedPortfolioOrder(
          order,
          c.portfolioGrid.length,
        ),
      };
    });
  }, []);

  const addService = useCallback(() => {
    setCms((c) => {
      if (!c) return c;
      const id = nextTempServiceId(c.services);
      return {
        ...c,
        services: [...c.services, { id, name: "New service" }],
        servicePages: [
          ...c.servicePages,
          defaultServicePageContent(id, "New service"),
        ],
      };
    });
  }, []);

  const removeService = useCallback((index: number) => {
    setCms((c) => {
      if (!c) return c;
      const removed = c.services[index];
      if (!removed) return c;
      const services = c.services.filter((_, k) => k !== index);
      const portfolioGrid = c.portfolioGrid.map((p) =>
        p.serviceId === removed.id ? { ...p, serviceId: null } : p,
      );
      const servicePages = c.servicePages.filter(
        (row) => row.serviceId !== removed.id,
      );
      return { ...c, services, portfolioGrid, servicePages };
    });
  }, []);

  const moveService = useCallback((index: number, dir: -1 | 1) => {
    setCms((c) => {
      if (!c) return c;
      const j = index + dir;
      if (j < 0 || j >= c.services.length) return c;
      const next = [...c.services];
      [next[index], next[j]] = [next[j], next[index]];
      return { ...c, services: next };
    });
  }, []);

  const setService = useCallback(
    (index: number, patch: { name?: string }) => {
      setCms((c) => {
        if (!c) return c;
        const services = c.services.map((s, k) =>
          k === index ? { ...s, ...patch } : s,
        );
        const target = services[index];
        if (!target) return { ...c, services };
        const servicePages = c.servicePages.map((row) =>
          row.serviceId === target.id
            ? {
                ...row,
                slug: toServiceSlug(
                  row.slug.trim() || patch.name?.trim() || target.name,
                ),
                pageTitle: row.pageTitle.trim() || target.name.trim(),
              }
            : row,
        );
        return { ...c, services, servicePages };
      });
    },
    [],
  );

  const setServicePage = useCallback(
    (
      serviceId: number,
      patch: Partial<Omit<ServicePageContent, "serviceId">>,
    ) => {
      setCms((c) => {
        if (!c) return c;
        const svc = c.services.find((row) => row.id === serviceId);
        if (!svc) return c;
        const fallback = defaultServicePageContent(serviceId, svc.name);
        const current =
          c.servicePages.find((row) => row.serviceId === serviceId) ?? fallback;
        const nextRow: ServicePageContent = {
          ...current,
          ...patch,
          serviceId,
          slug: toServiceSlug((patch.slug ?? current.slug).trim()),
          selectedPortfolioIndices: dedupeFeaturedPortfolioOrder(
            patch.selectedPortfolioIndices ?? current.selectedPortfolioIndices,
            c.portfolioGrid.length,
          ),
        };
        const found = c.servicePages.some((row) => row.serviceId === serviceId);
        const servicePages = found
          ? c.servicePages.map((row) =>
              row.serviceId === serviceId ? nextRow : row,
            )
          : [...c.servicePages, nextRow];
        return { ...c, servicePages };
      });
    },
    [],
  );

  const patchHomeReviews = useCallback((patch: Partial<HomeReviewsBlock>) => {
    setCms((c) =>
      c ? { ...c, homeReviews: { ...c.homeReviews, ...patch } } : c,
    );
  }, []);

  const setHomeReviewItem = useCallback(
    (index: number, patch: Partial<HomeReviewItem>) => {
      setCms((c) => {
        if (!c) return c;
        const items = c.homeReviews.items.map((it, k) =>
          k === index ? { ...it, ...patch } : it,
        );
        return { ...c, homeReviews: { ...c.homeReviews, items } };
      });
    },
    [],
  );

  const addHomeReview = useCallback(() => {
    setCms((c) =>
      c
        ? {
            ...c,
            homeReviews: {
              ...c.homeReviews,
              items: [...c.homeReviews.items, defaultHomeReviewItem()],
            },
          }
        : c,
    );
  }, []);

  const removeHomeReview = useCallback((index: number) => {
    setCms((c) =>
      c
        ? {
            ...c,
            homeReviews: {
              ...c.homeReviews,
              items: c.homeReviews.items.filter((_, k) => k !== index),
            },
          }
        : c,
    );
  }, []);

  const moveHomeReview = useCallback((index: number, dir: -1 | 1) => {
    setCms((c) => {
      if (!c) return c;
      const j = index + dir;
      if (j < 0 || j >= c.homeReviews.items.length) return c;
      const items = [...c.homeReviews.items];
      [items[index], items[j]] = [items[j]!, items[index]!];
      return { ...c, homeReviews: { ...c.homeReviews, items } };
    });
  }, []);

  const patchHomeServiceFeatures = useCallback(
    (patch: Partial<HomeServiceFeaturesBlock>) => {
      setCms((c) =>
        c
          ? { ...c, homeServiceFeatures: { ...c.homeServiceFeatures, ...patch } }
          : c,
      );
    },
    [],
  );

  const setServiceFeatureItem = useCallback(
    (index: number, patch: Partial<HomeServiceFeatureItem>) => {
      setCms((c) => {
        if (!c) return c;
        const items = c.homeServiceFeatures.items.map((it, k) =>
          k === index ? { ...it, ...patch } : it,
        );
        return {
          ...c,
          homeServiceFeatures: { ...c.homeServiceFeatures, items },
        };
      });
    },
    [],
  );

  const addServiceFeatureItem = useCallback(() => {
    setCms((c) =>
      c
        ? {
            ...c,
            homeServiceFeatures: {
              ...c.homeServiceFeatures,
              items: [
                ...c.homeServiceFeatures.items,
                defaultHomeServiceFeatureItem(),
              ],
            },
          }
        : c,
    );
  }, []);

  const removeServiceFeatureItem = useCallback((index: number) => {
    setCms((c) =>
      c
        ? {
            ...c,
            homeServiceFeatures: {
              ...c.homeServiceFeatures,
              items: c.homeServiceFeatures.items.filter((_, k) => k !== index),
            },
          }
        : c,
    );
  }, []);

  const patchHomeWhyChooseUs = useCallback(
    (patch: Partial<HomeWhyChooseUsBlock>) => {
      setCms((c) =>
        c
          ? { ...c, homeWhyChooseUs: { ...c.homeWhyChooseUs, ...patch } }
          : c,
      );
    },
    [],
  );

  const patchPricing = useCallback((patch: Partial<PricingContent>) => {
    setCms((c) => (c ? { ...c, pricing: { ...c.pricing, ...patch } } : c));
  }, []);

  const setPricingPlan = useCallback((index: number, patch: Partial<PricingPlan>) => {
    setCms((c) => {
      if (!c) return c;
      const plans = c.pricing.plans.map((row, k) => (k === index ? { ...row, ...patch } : row));
      return { ...c, pricing: { ...c.pricing, plans } };
    });
  }, []);

  const addPricingPlan = useCallback(() => {
    setCms((c) => {
      if (!c) return c;
      const base = c.pricing.plans[c.pricing.plans.length - 1] ?? {
        packageLabel: "Package",
        title: "Background Remove",
        singlePrice: "$0.39",
        bulkPrice: "$0.29",
        features: ["1000 images daily", "100% guaranteed", "24/7 support", "Unlimited revision"],
        featured: false,
      };
      return {
        ...c,
        pricing: { ...c.pricing, plans: [...c.pricing.plans, { ...base, featured: false }] },
      };
    });
  }, []);

  const removePricingPlan = useCallback((index: number) => {
    setCms((c) =>
      c
        ? { ...c, pricing: { ...c.pricing, plans: c.pricing.plans.filter((_, k) => k !== index) } }
        : c,
    );
  }, []);

  const movePricingPlan = useCallback((index: number, dir: -1 | 1) => {
    setCms((c) => {
      if (!c) return c;
      const j = index + dir;
      if (j < 0 || j >= c.pricing.plans.length) return c;
      const plans = [...c.pricing.plans];
      [plans[index], plans[j]] = [plans[j]!, plans[index]!];
      return { ...c, pricing: { ...c.pricing, plans } };
    });
  }, []);

  const setWhyChoosePillarItem = useCallback(
    (index: number, patch: Partial<HomeWhyChoosePillar>) => {
      setCms((c) => {
        if (!c) return c;
        const pillars = c.homeWhyChooseUs.pillars.map((row, k) =>
          k === index ? { ...row, ...patch } : row,
        );
        return {
          ...c,
          homeWhyChooseUs: { ...c.homeWhyChooseUs, pillars },
        };
      });
    },
    [],
  );

  const addWhyChoosePillar = useCallback(() => {
    setCms((c) =>
      c
        ? {
            ...c,
            homeWhyChooseUs: {
              ...c.homeWhyChooseUs,
              pillars: [
                ...c.homeWhyChooseUs.pillars,
                defaultHomeWhyChoosePillar(),
              ],
            },
          }
        : c,
    );
  }, []);

  const removeWhyChoosePillar = useCallback((index: number) => {
    setCms((c) =>
      c
        ? {
            ...c,
            homeWhyChooseUs: {
              ...c.homeWhyChooseUs,
              pillars: c.homeWhyChooseUs.pillars.filter((_, k) => k !== index),
            },
          }
        : c,
    );
  }, []);

  const moveWhyChoosePillar = useCallback((index: number, dir: -1 | 1) => {
    setCms((c) => {
      if (!c) return c;
      const j = index + dir;
      if (j < 0 || j >= c.homeWhyChooseUs.pillars.length) return c;
      const pillars = [...c.homeWhyChooseUs.pillars];
      [pillars[index], pillars[j]] = [pillars[j]!, pillars[index]!];
      return {
        ...c,
        homeWhyChooseUs: { ...c.homeWhyChooseUs, pillars },
      };
    });
  }, []);

  const moveServiceFeatureItem = useCallback((index: number, dir: -1 | 1) => {
    setCms((c) => {
      if (!c) return c;
      const j = index + dir;
      if (j < 0 || j >= c.homeServiceFeatures.items.length) return c;
      const items = [...c.homeServiceFeatures.items];
      [items[index], items[j]] = [items[j]!, items[index]!];
      return {
        ...c,
        homeServiceFeatures: { ...c.homeServiceFeatures, items },
      };
    });
  }, []);

  /* Stable CMS actions are useCallback([]); including every handler bounces eslint either
     “unnecessary” or “missing” — value must track `cms` and loading state only. */
  const value = useMemo(
    () => ({
      cms,
      loading,
      loadError,
      saving,
      flash,
      setFlash,
      setCms,
      refresh,
      save,
      upload,
      updateSite,
      setHeroBanners,
      setFloatingCar,
      setBeforeAfter,
      moveBanner,
      removeBanner,
      addBannerUrl,
      setPair,
      addPair,
      removePair,
      moveBeforeAfterPost,
      setPortfolioItem,
      addPortfolioItem,
      removePortfolioItem,
      movePortfolioItem,
      addService,
      removeService,
      moveService,
      setService,
      setServicePage,
      patchHomeReviews,
      setHomeReviewItem,
      addHomeReview,
      removeHomeReview,
      moveHomeReview,
      patchHomeServiceFeatures,
      setServiceFeatureItem,
      addServiceFeatureItem,
      removeServiceFeatureItem,
      moveServiceFeatureItem,
      patchHomeWhyChooseUs,
      patchPricing,
      setPricingPlan,
      addPricingPlan,
      removePricingPlan,
      movePricingPlan,
      setWhyChoosePillarItem,
      addWhyChoosePillar,
      removeWhyChoosePillar,
      moveWhyChoosePillar,
      setHomeFeaturedPortfolioOrder,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      cms,
      loading,
      loadError,
      saving,
      flash,
      refresh,
      save,
      upload,
      updateSite,
      setHeroBanners,
      setFloatingCar,
      setBeforeAfter,
      moveBanner,
      removeBanner,
      addBannerUrl,
      setPair,
      addPair,
      removePair,
      moveBeforeAfterPost,
      setPortfolioItem,
      addPortfolioItem,
      removePortfolioItem,
      movePortfolioItem,
      addService,
      removeService,
      moveService,
      setService,
      setServicePage,
      patchHomeReviews,
      setHomeReviewItem,
      addHomeReview,
      removeHomeReview,
      moveHomeReview,
      patchPricing,
      setPricingPlan,
      addPricingPlan,
      removePricingPlan,
      movePricingPlan,
      setWhyChoosePillarItem,
      addWhyChoosePillar,
      removeWhyChoosePillar,
      moveWhyChoosePillar,
      setHomeFeaturedPortfolioOrder,
    ],
  );

  return (
    <AdminCmsContext.Provider value={value}>{children}</AdminCmsContext.Provider>
  );
}

export function useAdminCms() {
  const ctx = useContext(AdminCmsContext);
  if (!ctx) {
    throw new Error("useAdminCms must be used inside AdminCmsProvider");
  }
  return ctx;
}
