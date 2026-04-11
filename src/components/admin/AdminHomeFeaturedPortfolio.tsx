"use client";

import { useAdminCms } from "@/components/admin/AdminCmsContext";

function serviceLabel(
  services: { id: number; name: string }[],
  serviceId: number | null,
): string {
  if (serviceId === null) return "No service";
  const s = services.find((x) => x.id === serviceId);
  return s?.name.trim() || "Unknown service";
}

export function AdminHomeFeaturedPortfolio() {
  const { cms, setPortfolioItem } = useAdminCms();
  if (!cms) return null;

  return (
    <section className="scroll-mt-8 space-y-4" id="home-featured-portfolio">
      <div>
        <h2 className="text-lg font-semibold text-white">
          Homepage portfolio strip
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Shown below &quot;How Car Editing Studio Works&quot; (same dark band).
          Assign slot 1–5 to feature up to five tiles; leave Off to fall back to
          the first five complete tiles. Edit images under{" "}
          <span className="text-zinc-400">Portfolio</span> in the sidebar.
        </p>
      </div>

      <ul className="space-y-1.5">
        {cms.portfolioGrid.length === 0 ? (
          <li className="rounded-lg border border-zinc-800/80 px-3 py-5 text-center text-[11px] text-zinc-600">
            No portfolio rows yet — add them from the Portfolio page in the
            sidebar.
          </li>
        ) : (
          cms.portfolioGrid.map((row, i) => (
            <li
              key={`home-pf-${i}`}
              className="flex flex-wrap items-center gap-3 rounded-lg border border-zinc-800/90 bg-zinc-900/40 px-3 py-2"
            >
              <span className="w-5 shrink-0 text-center text-[10px] font-medium text-zinc-600">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-zinc-200">
                  {row.label.trim() || "Untitled tile"}
                </p>
                <p className="truncate text-[10px] text-zinc-500">
                  {serviceLabel(cms.services, row.serviceId)}
                </p>
              </div>
              <label className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                Home slot
                <select
                  value={
                    row.homeFeaturedOrder != null &&
                    row.homeFeaturedOrder >= 1 &&
                    row.homeFeaturedOrder <= 5
                      ? String(row.homeFeaturedOrder)
                      : ""
                  }
                  onChange={(e) => {
                    const v = e.target.value;
                    setPortfolioItem(i, {
                      homeFeaturedOrder: v === "" ? null : Number(v),
                    });
                  }}
                  className="rounded border border-zinc-700 bg-zinc-950 px-1.5 py-1 text-[11px] text-zinc-200"
                >
                  <option value="">Off</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </label>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
