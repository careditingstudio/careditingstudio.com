"use client";

import { AdminFormModal } from "@/components/admin/AdminFormModal";
import { useAdminCms } from "@/components/admin/AdminCmsContext";
import {
  dedupeFeaturedPortfolioOrder,
  isUploadedAsset,
  type PortfolioGridItem,
} from "@/lib/cms-types";
import Image from "next/image";

function serviceLabel(
  services: { id: number; name: string }[],
  serviceId: number | null,
): string {
  if (serviceId === null) return "No service";
  const s = services.find((x) => x.id === serviceId);
  return s?.name.trim() || "Unknown service";
}

function isComplete(item: PortfolioGridItem): boolean {
  return item.before.trim().length > 0 && item.after.trim().length > 0;
}

type Props = {
  open: boolean;
  onClose: () => void;
};

export function AdminHomeFeaturedPortfolioModal({ open, onClose }: Props) {
  const {
    cms,
    setHomeFeaturedPortfolioOrder,
  } = useAdminCms();
  if (!cms) return null;

  const grid = cms.portfolioGrid;
  const order = dedupeFeaturedPortfolioOrder(
    cms.homeFeaturedPortfolioOrder ?? [],
    grid.length,
  );

  const featuredSet = new Set(order);
  const libraryIndices = grid
    .map((row, i) => ({ row, i }))
    .filter(
      ({ row, i }) =>
        isComplete(row) && !featuredSet.has(i),
    );

  function addIndex(idx: number) {
    if (featuredSet.has(idx)) return;
    setHomeFeaturedPortfolioOrder([...order, idx]);
  }

  function removeAt(position: number) {
    setHomeFeaturedPortfolioOrder(order.filter((_, k) => k !== position));
  }

  function moveFeatured(position: number, dir: -1 | 1) {
    const j = position + dir;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[position], next[j]] = [next[j]!, next[position]!];
    setHomeFeaturedPortfolioOrder(next);
  }

  return (
    <AdminFormModal
      open={open}
      onClose={onClose}
      title="Homepage portfolio"
      maxWidthClass="max-w-6xl"
      maxHeightClass="max-h-[min(94vh,58rem)]"
    >
      <p className="mb-4 text-xs text-zinc-500">
        Pick complete tiles from your portfolio library, then arrange the order shown
        on the homepage strip. Leave the featured list empty to auto-use the first
        complete tiles.
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="text-sm font-medium text-zinc-300">Library</h3>
          <p className="mt-1 text-[11px] text-zinc-600">
            Only tiles with before &amp; after images. Click Add to feature.
          </p>
          <ul className="mt-3 grid max-h-[min(22rem,50vh)] grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3">
            {libraryIndices.length === 0 ? (
              <li className="col-span-full rounded-lg border border-zinc-800/80 px-3 py-6 text-center text-[11px] text-zinc-600">
                {grid.length === 0
                  ? "No portfolio rows — add them under Portfolio in the sidebar."
                  : "All complete tiles are already featured, or add more portfolio items."}
              </li>
            ) : (
              libraryIndices.map(({ row, i }) => (
                <li key={`lib-${i}`} className="flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() => addIndex(i)}
                    className="group relative aspect-square overflow-hidden rounded-lg border border-zinc-700 bg-black ring-offset-2 ring-offset-zinc-950 transition hover:border-[var(--accent)]/50 hover:ring-2 hover:ring-[var(--accent)]/30"
                  >
                    <Image
                      src={row.after.trim() || row.before}
                      alt=""
                      fill
                      className="object-cover transition group-hover:scale-[1.03]"
                      sizes="120px"
                      unoptimized={isUploadedAsset(row.after || row.before)}
                    />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-1.5 py-1 text-[9px] font-medium text-white">
                      Add
                    </span>
                  </button>
                  <p className="line-clamp-2 text-[10px] text-zinc-500">
                    {row.label.trim() || "Untitled"}
                  </p>
                </li>
              ))
            )}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-medium text-zinc-300">Featured order</h3>
          <p className="mt-1 text-[11px] text-zinc-600">
            Homepage strip order (top = first). Use arrows to reorder.
          </p>
          <ul className="mt-3 max-h-[min(22rem,50vh)] space-y-2 overflow-y-auto pr-1">
            {order.length === 0 ? (
              <li className="rounded-lg border border-dashed border-zinc-700 px-3 py-6 text-center text-[11px] text-zinc-600">
                None selected — the site will use the first complete portfolio tiles
                automatically.
              </li>
            ) : (
              order.map((idx, position) => {
                const row = grid[idx];
                if (!row) return null;
                const src = row.after.trim() || row.before;
                return (
                  <li
                    key={`feat-${idx}-${position}`}
                    className="flex items-center gap-2 rounded-lg border border-zinc-800/90 bg-zinc-900/50 px-2 py-2"
                  >
                    <span className="w-5 shrink-0 text-center text-[10px] font-medium text-zinc-600">
                      {position + 1}
                    </span>
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-black">
                      {src ? (
                        <Image
                          src={src}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="48px"
                          unoptimized={isUploadedAsset(src)}
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs text-zinc-200">
                        {row.label.trim() || "Untitled"}
                      </p>
                      <p className="truncate text-[10px] text-zinc-500">
                        {serviceLabel(cms.services, row.serviceId)}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col gap-0.5">
                      <button
                        type="button"
                        aria-label="Move up"
                        disabled={position === 0}
                        onClick={() => moveFeatured(position, -1)}
                        className="rounded border border-zinc-700 px-1.5 py-0.5 text-[10px] text-zinc-400 hover:bg-zinc-800 disabled:opacity-25"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        aria-label="Move down"
                        disabled={position === order.length - 1}
                        onClick={() => moveFeatured(position, 1)}
                        className="rounded border border-zinc-700 px-1.5 py-0.5 text-[10px] text-zinc-400 hover:bg-zinc-800 disabled:opacity-25"
                      >
                        ↓
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAt(position)}
                      className="shrink-0 rounded px-2 py-1 text-[11px] text-zinc-500 hover:text-red-400"
                    >
                      Remove
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      </div>
    </AdminFormModal>
  );
}
