"use client";

import { AdminServiceEditModal } from "@/components/admin/AdminServiceEditModal";
import { useAdminCms } from "@/components/admin/AdminCmsContext";
import { useState } from "react";

export function AdminServicesContent() {
  const {
    cms,
    addService,
    removeService,
    moveService,
    setService,
    setServicePage,
  } = useAdminCms();
  const [editIndex, setEditIndex] = useState<number | null>(null);

  if (!cms) return null;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-white">Services</h2>
        <button
          type="button"
          onClick={() => addService()}
          className="shrink-0 rounded-lg border border-zinc-600 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800"
        >
          + Add service
        </button>
      </div>

      {editIndex !== null && cms.services[editIndex] ? (
        <AdminServiceEditModal
          open
          onClose={() => setEditIndex(null)}
          service={cms.services[editIndex]}
          serviceIndex={editIndex}
          page={
            cms.servicePages.find(
              (row) => row.serviceId === cms.services[editIndex]?.id,
            ) ?? null
          }
          portfolioLabels={cms.portfolioGrid.map(
            (item, idx) => item.label.trim() || `Portfolio #${idx + 1}`,
          )}
          onSetServiceName={(name) => setService(editIndex, { name })}
          onSetPage={(patch) => {
            const service = cms.services[editIndex];
            if (!service) return;
            setServicePage(service.id, patch);
          }}
          onDelete={() => {
            removeService(editIndex);
            setEditIndex(null);
          }}
        />
      ) : null}

      <ul className="space-y-2">
        {cms.services.length === 0 ? (
          <li className="rounded-lg border border-zinc-800/80 px-3 py-5 text-center text-[11px] text-zinc-600">
            —
          </li>
        ) : (
          cms.services.map((svc, i) => {
            const page =
              cms.servicePages.find((row) => row.serviceId === svc.id) ?? null;
            return (
              <li
                key={`${svc.id}-${i}`}
                className="rounded-lg border border-zinc-800/90 bg-zinc-900/40 px-3 py-3"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-1 w-5 shrink-0 text-center text-[10px] font-medium text-zinc-600">
                    {i + 1}
                  </span>
                  <div className="flex shrink-0 flex-col gap-0.5">
                    <button
                      type="button"
                      aria-label="Move up"
                      disabled={i === 0}
                      onClick={() => moveService(i, -1)}
                      className="rounded border border-zinc-700 px-1.5 py-0.5 text-[10px] text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-25"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      aria-label="Move down"
                      disabled={i === cms.services.length - 1}
                      onClick={() => moveService(i, 1)}
                      className="rounded border border-zinc-700 px-1.5 py-0.5 text-[10px] text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-25"
                    >
                      ↓
                    </button>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-100">
                      {svc.name.trim() || "Untitled service"}
                    </p>
                    <p className="mt-1 truncate text-[11px] text-zinc-500">
                      /services/{page?.slug || "service"}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-zinc-400">
                      <span className="rounded border border-zinc-700 px-1.5 py-0.5">
                        Portfolio picks:{" "}
                        {page?.selectedPortfolioIndices.length ?? 0}
                      </span>
                      <span className="rounded border border-zinc-700 px-1.5 py-0.5">
                        Page title: {page?.pageTitle.trim() ? "Set" : "Empty"}
                      </span>
                    </div>
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
                      onClick={() => removeService(i)}
                      className="rounded-md px-2 py-1 text-[11px] text-zinc-500 hover:text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
