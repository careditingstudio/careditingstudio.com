"use client";

import { isUploadedAsset, type HomeReviewItem } from "@/lib/cms-types";
import Image from "next/image";
import { useEffect, useId } from "react";

function thumbSrc(raw: string): string | null {
  const s = raw.trim();
  return s.length > 0 ? s : null;
}

type Props = {
  open: boolean;
  onClose: () => void;
  index: number;
  item: HomeReviewItem;
  setPatch: (patch: Partial<HomeReviewItem>) => void;
  pickFromLibrary: (onPicked: (url: string) => void) => void;
  setFlash: (v: { type: "ok" | "err"; text: string } | null) => void;
  onDelete: () => void;
};

export function HomeReviewEditModal({
  open,
  onClose,
  index,
  item,
  setPatch,
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

  const avatar = thumbSrc(item.avatarSrc);
  const rating = Math.min(5, Math.max(1, Math.round(Number(item.rating) || 5)));

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
        className="relative flex max-h-[min(42rem,90vh)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-zinc-700/90 bg-zinc-950 shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-zinc-800 px-5 py-4">
          <h2 id={titleId} className="text-base font-semibold text-white">
            Review {index + 1}
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
            <div className="flex gap-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-zinc-800 bg-black">
                {avatar ? (
                  <Image
                    src={avatar}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="80px"
                    unoptimized={isUploadedAsset(avatar)}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-1 text-center text-[10px] text-zinc-600">
                    No photo
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col justify-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    pickFromLibrary((url) => {
                      setPatch({ avatarSrc: url });
                      setFlash({ type: "ok", text: "Photo updated." });
                    })
                  }
                  className="w-fit rounded-lg border border-[var(--accent)]/35 bg-[var(--accent)]/10 px-3 py-1.5 text-xs font-medium text-[var(--accent)] hover:bg-[var(--accent)]/20"
                >
                  Choose from library
                </button>
                {avatar ? (
                  <button
                    type="button"
                    onClick={() => setPatch({ avatarSrc: "" })}
                    className="w-fit text-[11px] text-zinc-500 hover:text-zinc-300"
                  >
                    Remove photo
                  </button>
                ) : null}
              </div>
            </div>

            <div>
              <label className={lab}>Rating</label>
              <div
                className="mt-2 flex items-center gap-0.5"
                role="group"
                aria-label="Star rating"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPatch({ rating: n })}
                    className={`rounded-md px-1.5 py-1 text-lg leading-none transition hover:scale-110 ${
                      n <= rating
                        ? "text-[var(--accent)]"
                        : "text-zinc-700 hover:text-zinc-500"
                    }`}
                    aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={lab}>Client name</label>
              <input
                type="text"
                value={item.name}
                onChange={(e) => setPatch({ name: e.target.value })}
                className={`mt-1.5 ${inp}`}
              />
            </div>
            <div>
              <label className={lab}>Role / company</label>
              <input
                type="text"
                value={item.role}
                onChange={(e) => setPatch({ role: e.target.value })}
                className={`mt-1.5 ${inp}`}
                placeholder="e.g. Dealer principal, Austin TX"
              />
            </div>
            <div>
              <label className={lab}>Review</label>
              <textarea
                value={item.quote}
                onChange={(e) => setPatch({ quote: e.target.value })}
                rows={5}
                className={`mt-1.5 resize-y ${inp}`}
              />
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-zinc-800 px-5 py-4">
          <button
            type="button"
            onClick={() => {
              onDelete();
              onClose();
            }}
            className="text-sm text-red-400/90 hover:text-red-400"
          >
            Delete review
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-black hover:opacity-90"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
