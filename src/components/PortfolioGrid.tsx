"use client";

import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import type { CmsJson, PortfolioGridItem } from "@/lib/cms-types";
import { useMemo, useState } from "react";

const ALL = "__all__";
const OTHER = "__other__";

function isComplete(item: PortfolioGridItem) {
  return item.before.trim().length > 0 && item.after.trim().length > 0;
}

function isOrphanService(
  item: PortfolioGridItem,
  serviceIds: Set<number>,
): boolean {
  if (item.serviceId === null) return false;
  return !serviceIds.has(item.serviceId);
}

export function PortfolioGrid({ cms }: { cms: CmsJson }) {
  const [filter, setFilter] = useState<string>(ALL);

  const serviceIds = useMemo(
    () => new Set(cms.services.map((s) => s.id)),
    [cms.services],
  );

  const complete = useMemo(
    () => cms.portfolioGrid.filter(isComplete),
    [cms.portfolioGrid],
  );

  const hasOther = useMemo(
    () => complete.some((item) => isOrphanService(item, serviceIds)),
    [complete, serviceIds],
  );

  const filtered = useMemo(() => {
    if (filter === ALL) return complete;
    if (filter === OTHER) {
      return complete.filter((item) => isOrphanService(item, serviceIds));
    }
    const fid = Number(filter);
    return complete.filter((item) => item.serviceId === fid);
  }, [complete, filter, serviceIds]);

  if (complete.length === 0) {
    return (
      <p className="text-center text-[var(--muted)]">
        Examples coming soon.
      </p>
    );
  }

  return (
    <div className="space-y-10">
      <div
        className="flex flex-wrap gap-2.5 sm:gap-3"
        role="tablist"
        aria-label="Filter portfolio by service"
      >
        <FilterPill
          label="All"
          selected={filter === ALL}
          onClick={() => setFilter(ALL)}
        />
        {cms.services.map((svc) => (
          <FilterPill
            key={svc.id}
            label={svc.name.trim() || "Untitled"}
            selected={filter === String(svc.id)}
            onClick={() => setFilter(String(svc.id))}
          />
        ))}
        {hasOther ? (
          <FilterPill
            label="Other"
            selected={filter === OTHER}
            onClick={() => setFilter(OTHER)}
          />
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-[var(--muted)]">
          No work in this filter yet.
        </p>
      ) : (
        <ul className="mx-auto grid w-full grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-12">
          {filtered.map((item, i) => (
            <li
              key={`${item.before}-${item.after}-${item.serviceId}-${i}`}
              className="w-full"
            >
              <BeforeAfterSlider
                layout="portfolio"
                beforeSrc={item.before}
                afterSrc={item.after}
                beforeAlt={item.beforeAlt}
                afterAlt={item.afterAlt}
                priority={i < 6}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterPill({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={onClick}
      className={[
        "relative overflow-hidden rounded-full px-4 py-2 text-sm font-medium tracking-tight",
        "border transition-all duration-300 ease-out",
        "motion-safe:active:scale-[0.97]",
        selected
          ? "border-[var(--accent)]/60 bg-[var(--accent)]/12 text-[var(--foreground)] shadow-[0_0_24px_-4px_var(--accent)]"
          : "border-white/10 bg-white/[0.03] text-[var(--muted)] hover:border-[var(--accent)]/35 hover:bg-white/[0.06] hover:text-[var(--foreground)] hover:shadow-[0_0_20px_-8px_var(--accent)]",
      ].join(" ")}
    >
      <span className="relative z-[1]">{label}</span>
      {selected ? (
        <span
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--accent)]/20 via-transparent to-transparent opacity-90"
          aria-hidden
        />
      ) : null}
    </button>
  );
}
