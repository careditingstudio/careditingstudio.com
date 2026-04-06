"use client";

import {
  type BeforeAfterPair,
  type CmsJson,
  defaultBeforeAfterPair,
  defaultPortfolioGridItem,
  type PortfolioGridItem,
  type SiteSettings,
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
};

const AdminCmsContext = createContext<AdminCmsContextValue | null>(null);

function sanitizePayload(cms: CmsJson): CmsJson {
  return {
    ...cms,
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
    portfolioGrid: cms.portfolioGrid.map((p) => ({
      ...p,
      label: p.label.trim(),
      before: p.before.trim(),
      after: p.after.trim(),
      beforeAlt: p.beforeAlt.trim(),
      afterAlt: p.afterAlt.trim(),
    })),
    site: {
      ...cms.site,
      businessName: cms.site.businessName.trim(),
      domainLabel: cms.site.domainLabel.trim(),
      email: cms.site.email.trim(),
      whatsappDial: cms.site.whatsappDial.replace(/\D/g, "") || cms.site.whatsappDial,
      whatsappDisplay: cms.site.whatsappDisplay.trim(),
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
    const r = await fetch("/api/admin/cms");
    if (!r.ok) {
      setLoadError("Could not load CMS data.");
      setLoading(false);
      return;
    }
    setCms((await r.json()) as CmsJson);
    setLoading(false);
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
      });
      if (!r.ok) throw new Error("save");
      setCms((await r.json()) as CmsJson);
      setFlash({ type: "ok", text: "Published to the live site." });
      setTimeout(() => setFlash(null), 5000);
      return true;
    } catch {
      setFlash({ type: "err", text: "Save failed. Try again." });
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
              defaultBeforeAfterPair(c.beforeAfter.length),
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
    setCms((c) =>
      c
        ? {
            ...c,
            portfolioGrid: c.portfolioGrid.filter((_, k) => k !== index),
          }
        : c,
    );
  }, []);

  const movePortfolioItem = useCallback((index: number, dir: -1 | 1) => {
    setCms((c) => {
      if (!c) return c;
      const j = index + dir;
      if (j < 0 || j >= c.portfolioGrid.length) return c;
      const next = [...c.portfolioGrid];
      [next[index], next[j]] = [next[j], next[index]];
      return { ...c, portfolioGrid: next };
    });
  }, []);

  const addService = useCallback(() => {
    setCms((c) => {
      if (!c) return c;
      const id = nextTempServiceId(c.services);
      return {
        ...c,
        services: [...c.services, { id, name: "New service" }],
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
      return { ...c, services, portfolioGrid };
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
        return { ...c, services };
      });
    },
    [],
  );

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
    }),
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
