"use client";

import { useAdminCms } from "@/components/admin/AdminCmsContext";
import { MediaLibraryModal } from "@/components/admin/MediaLibraryModal";
import { PortfolioGridItemEditModal } from "@/components/admin/PortfolioGridItemEditModal";
import { useRef, useState } from "react";

function serviceLabel(
  services: { id: number; name: string }[],
  serviceId: number | null,
): string {
  if (serviceId === null) return "No service";
  const s = services.find((x) => x.id === serviceId);
  return s?.name.trim() || "Unknown service";
}

export function AdminPortfolioContent() {
  const {
    cms,
    setPortfolioItem,
    addPortfolioItem,
    removePortfolioItem,
    movePortfolioItem,
    setFlash,
  } = useAdminCms();
  const pickHandlerRef = useRef<(url: string) => void>(() => {});
  const [mediaOpen, setMediaOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  function openMediaPicker(onChosen: (url: string) => void) {
    pickHandlerRef.current = onChosen;
    setMediaOpen(true);
  }

  function reorderPortfolio(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (!cms || j < 0 || j >= cms.portfolioGrid.length) return;
    movePortfolioItem(i, dir);
    setEditIndex((cur) => {
      if (cur === null) return null;
      if (cur === i) return j;
      if (cur === j) return i;
      return cur;
    });
  }

  if (!cms) return null;

  return (
    <div className="mx-auto max-w-4xl space-y-16">
      <MediaLibraryModal
        open={mediaOpen}
        onClose={() => setMediaOpen(false)}
        onPick={(url) => {
          pickHandlerRef.current(url);
          setMediaOpen(false);
        }}
        title="Choose image"
      />

      <section className="scroll-mt-8" id="portfolio-grid">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-white">Portfolio grid</h2>
          <button
            type="button"
            onClick={() => {
              const next = cms.portfolioGrid.length;
              addPortfolioItem();
              setEditIndex(next);
            }}
            className="shrink-0 rounded-lg border border-zinc-600 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800"
          >
            + Add
          </button>
        </div>

        {editIndex !== null && cms.portfolioGrid[editIndex] ? (
          <PortfolioGridItemEditModal
            open
            itemIndex={editIndex}
            item={cms.portfolioGrid[editIndex]}
            services={cms.services}
            onClose={() => setEditIndex(null)}
            setItemPatch={(patch) => {
              const idx = editIndex;
              if (idx !== null) setPortfolioItem(idx, patch);
            }}
            pickFromLibrary={(cb) => openMediaPicker(cb)}
            setFlash={setFlash}
            onDelete={() => {
              const idx = editIndex;
              if (idx !== null) removePortfolioItem(idx);
              setEditIndex(null);
            }}
          />
        ) : null}

        <ul className="mt-4 space-y-1.5">
          {cms.portfolioGrid.length === 0 ? (
            <li className="rounded-lg border border-zinc-800/80 px-3 py-5 text-center text-[11px] text-zinc-600">
              —
            </li>
          ) : (
            cms.portfolioGrid.map((row, i) => {
              return (
                <li
                  key={`pg-${i}`}
                  className="flex items-center gap-3 rounded-lg border border-zinc-800/90 bg-zinc-900/40 px-3 py-2"
                >
                  <span className="w-5 shrink-0 text-center text-[10px] font-medium text-zinc-600">
                    {i + 1}
                  </span>
                  <div className="flex shrink-0 flex-col gap-0.5">
                    <button
                      type="button"
                      aria-label="Move up"
                      disabled={i === 0}
                      onClick={() => reorderPortfolio(i, -1)}
                      className="rounded border border-zinc-700 px-1.5 py-0.5 text-[10px] text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-25"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      aria-label="Move down"
                      disabled={i === cms.portfolioGrid.length - 1}
                      onClick={() => reorderPortfolio(i, 1)}
                      className="rounded border border-zinc-700 px-1.5 py-0.5 text-[10px] text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-25"
                    >
                      ↓
                    </button>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs text-zinc-200">
                      {row.label.trim() || "Untitled tile"}
                    </p>
                    <p className="truncate text-[10px] text-zinc-500">
                      {serviceLabel(cms.services, row.serviceId)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEditIndex(i)}
                      className="rounded-md border border-zinc-600 bg-zinc-800/60 px-2.5 py-1 text-[11px] font-medium text-zinc-200 hover:border-[var(--accent)]/40 hover:text-white"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        removePortfolioItem(i);
                        if (editIndex === i) setEditIndex(null);
                        if (editIndex !== null && editIndex > i) {
                          setEditIndex(editIndex - 1);
                        }
                      }}
                      className="rounded-md px-2 py-1 text-[11px] text-zinc-500 hover:text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </section>
    </div>
  );
}
