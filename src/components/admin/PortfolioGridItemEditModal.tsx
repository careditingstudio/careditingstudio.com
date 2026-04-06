"use client";

import {
  isUploadedAsset,
  type PortfolioGridItem,
  type ServiceRow,
} from "@/lib/cms-types";
import Image from "next/image";
import { useEffect, useId } from "react";

function thumbSrc(raw: string): string | null {
  const s = raw.trim();
  return s.length > 0 ? s : null;
}

type Props = {
  open: boolean;
  onClose: () => void;
  itemIndex: number;
  item: PortfolioGridItem;
  services: ServiceRow[];
  setItemPatch: (patch: Partial<PortfolioGridItem>) => void;
  pickFromLibrary: (onPicked: (url: string) => void) => void;
  setFlash: (v: { type: "ok" | "err"; text: string }) => void;
  onDelete: () => void;
};

export function PortfolioGridItemEditModal({
  open,
  onClose,
  itemIndex,
  item,
  services,
  setItemPatch,
  pickFromLibrary,
  setFlash,
  onDelete,
}: Props) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const inp =
    "w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30";
  const lab = "text-[11px] font-medium uppercase tracking-wide text-zinc-500";
  const sel =
    "mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30";

  const sid = item.serviceId;
  const known =
    sid !== null && services.some((s) => s.id === sid);
  const orphanLabel =
    sid !== null && !known ? `Service #${sid} (removed)` : null;

  const selectValue =
    sid === null ? "" : known ? String(sid) : `__orphan__${sid}`;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative flex max-h-[min(42rem,90vh)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-zinc-700/90 bg-zinc-950 shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-zinc-800 px-5 py-4">
          <h2 id={titleId} className="text-base font-semibold text-white">
            Tile {itemIndex + 1}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            Close
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <div className="space-y-4">
            <div>
              <label className={lab}>Label</label>
              <input
                type="text"
                value={item.label}
                onChange={(e) => setItemPatch({ label: e.target.value })}
                className={`mt-1.5 ${inp}`}
              />
            </div>

            <div>
              <label className={lab} htmlFor={`${titleId}-service`}>
                Service
              </label>
              <select
                id={`${titleId}-service`}
                value={selectValue}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "") setItemPatch({ serviceId: null });
                  else if (v.startsWith("__orphan__")) {
                    const n = Number(v.slice("__orphan__".length));
                    setItemPatch({
                      serviceId: Number.isFinite(n) ? n : null,
                    });
                  } else {
                    const n = Number(v);
                    setItemPatch({
                      serviceId: Number.isFinite(n) ? n : null,
                    });
                  }
                }}
                className={sel}
              >
                <option value="">— None —</option>
                {orphanLabel ? (
                  <option value={selectValue}>{orphanLabel}</option>
                ) : null}
                {services.map((s) => (
                  <option key={s.id} value={String(s.id)}>
                    {s.name.trim() || "(unnamed)"}
                  </option>
                ))}
              </select>
            </div>

            <div className="border-t border-zinc-800 pt-4">
              <p className={lab}>Slider</p>
              <div className="mt-3 grid gap-6 md:grid-cols-2">
                {(["before", "after"] as const).map((side) => {
                  const sideSrc = thumbSrc(item[side]);
                  const altKey = side === "before" ? "beforeAlt" : "afterAlt";
                  return (
                    <div key={side} className="space-y-2">
                      <p className="text-xs font-medium capitalize text-zinc-400">
                        {side}
                      </p>
                      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-zinc-900">
                        {sideSrc ? (
                          <Image
                            src={sideSrc}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="200px"
                            unoptimized={isUploadedAsset(sideSrc)}
                          />
                        ) : (
                          <div className="flex h-full min-h-[5rem] items-center justify-center text-[11px] text-zinc-600">
                            —
                          </div>
                        )}
                      </div>
                      <label className={`block ${lab}`}>Alt</label>
                      <input
                        type="text"
                        value={item[altKey]}
                        onChange={(e) =>
                          setItemPatch({ [altKey]: e.target.value })
                        }
                        className={`${inp} text-xs`}
                      />
                      <input
                        type="text"
                        value={item[side]}
                        onChange={(e) =>
                          setItemPatch({ [side]: e.target.value })
                        }
                        className={`font-mono text-xs ${inp}`}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          pickFromLibrary((url) => {
                            setItemPatch({ [side]: url });
                            setFlash({ type: "ok", text: "Updated." });
                          })
                        }
                        className="rounded-lg border border-[var(--accent)]/35 bg-[var(--accent)]/10 px-3 py-1.5 text-xs font-medium text-[var(--accent)] hover:bg-[var(--accent)]/20"
                      >
                        Library
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-zinc-800 px-5 py-3">
          <button
            type="button"
            onClick={onDelete}
            className="text-xs text-red-400 hover:underline"
          >
            Delete tile
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-zinc-800 px-4 py-2 text-sm text-white hover:bg-zinc-700"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
