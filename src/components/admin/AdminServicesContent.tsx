"use client";

import { useAdminCms } from "@/components/admin/AdminCmsContext";

export function AdminServicesContent() {
  const { cms, addService, removeService, moveService, setService } =
    useAdminCms();

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

      <ul className="space-y-1.5">
        {cms.services.length === 0 ? (
          <li className="rounded-lg border border-zinc-800/80 px-3 py-5 text-center text-[11px] text-zinc-600">
            —
          </li>
        ) : (
          cms.services.map((svc, i) => (
            <li
              key={`${svc.id}-${i}`}
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
              <input
                type="text"
                value={svc.name}
                onChange={(e) => setService(i, { name: e.target.value })}
                className="min-w-0 flex-1 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30"
              />
              <button
                type="button"
                onClick={() => removeService(i)}
                className="shrink-0 rounded-md px-2 py-1 text-[11px] text-zinc-500 hover:text-red-400"
              >
                Remove
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
