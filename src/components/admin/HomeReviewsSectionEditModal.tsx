"use client";

import type { HomeReviewsBlock } from "@/lib/cms-types";
import { useEffect, useId } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  block: HomeReviewsBlock;
  patch: (partial: Partial<HomeReviewsBlock>) => void;
};

export function HomeReviewsSectionEditModal({
  open,
  onClose,
  block,
  patch,
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
        className="relative flex max-h-[min(36rem,90vh)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-zinc-700/90 bg-zinc-950 shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-zinc-800 px-5 py-4">
          <h2 id={titleId} className="text-base font-semibold text-white">
            Reviews — section text
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
              <label className={lab}>Eyebrow</label>
              <input
                type="text"
                value={block.eyebrow}
                onChange={(e) => patch({ eyebrow: e.target.value })}
                className={`mt-1.5 ${inp}`}
                placeholder="Testimonials"
              />
            </div>
            <div>
              <label className={lab}>Heading</label>
              <input
                type="text"
                value={block.title}
                onChange={(e) => patch({ title: e.target.value })}
                className={`mt-1.5 ${inp}`}
                placeholder="What clients say"
              />
            </div>
            <div>
              <label className={lab}>Subtitle</label>
              <textarea
                value={block.subtitle}
                onChange={(e) => patch({ subtitle: e.target.value })}
                rows={3}
                className={`mt-1.5 resize-y ${inp}`}
              />
            </div>
          </div>
        </div>

        <div className="flex shrink-0 justify-end border-t border-zinc-800 px-5 py-4">
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
