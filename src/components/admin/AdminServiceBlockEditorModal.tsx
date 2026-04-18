"use client";

import type { ServicePageBlock } from "@/lib/cms-types";
import { useEffect, useId, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  block: ServicePageBlock | null;
  onSave: (b: ServicePageBlock) => void;
  openMediaPicker: (onPicked: (url: string) => void) => void;
};

const inp =
  "w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30";
const lab = "text-[11px] font-medium uppercase tracking-wide text-zinc-500";

export function AdminServiceBlockEditorModal({
  open,
  onClose,
  block,
  onSave,
  openMediaPicker,
}: Props) {
  const titleId = useId();
  const [draft, setDraft] = useState<ServicePageBlock | null>(null);

  useEffect(() => {
    if (open && block) setDraft(block);
  }, [open, block]);

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

  if (!open || !block || !draft) return null;

  function save() {
    if (!draft) return;
    onSave(draft);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative flex max-h-[min(36rem,88vh)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-zinc-700/90 bg-zinc-950 shadow-2xl">
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-zinc-800 px-5 py-4">
          <h2 id={titleId} className="text-base font-semibold text-white">
            Edit block ({draft.type})
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            Close
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4">
          {draft.type === "heading" ? (
            <>
              <div>
                <label className={lab}>Heading</label>
                <input
                  type="text"
                  value={draft.text}
                  onChange={(e) =>
                    setDraft({ ...draft, text: e.target.value })
                  }
                  className={`mt-1.5 ${inp}`}
                />
              </div>
              <div>
                <label className={lab}>Subtext (optional)</label>
                <textarea
                  value={draft.subtext ?? ""}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      subtext: e.target.value,
                    })
                  }
                  rows={3}
                  className={`mt-1.5 resize-y ${inp}`}
                />
              </div>
            </>
          ) : null}

          {draft.type === "paragraph" ? (
            <div>
              <label className={lab}>Text</label>
              <textarea
                value={draft.text}
                onChange={(e) =>
                  setDraft({ ...draft, text: e.target.value })
                }
                rows={8}
                className={`mt-1.5 resize-y ${inp}`}
              />
            </div>
          ) : null}

          {draft.type === "image" ? (
            <>
              <div>
                <label className={lab}>Image URL</label>
                <input
                  type="text"
                  value={draft.src}
                  onChange={(e) =>
                    setDraft({ ...draft, src: e.target.value })
                  }
                  className={`mt-1.5 font-mono text-xs ${inp}`}
                />
                <button
                  type="button"
                  onClick={() =>
                    openMediaPicker((url) => setDraft({ ...draft, src: url }))
                  }
                  className="mt-2 rounded-lg border border-[var(--accent)]/35 bg-[var(--accent)]/10 px-3 py-1.5 text-xs font-medium text-[var(--accent)] hover:bg-[var(--accent)]/20"
                >
                  Choose from library
                </button>
              </div>
              <div>
                <label className={lab}>Alt text</label>
                <input
                  type="text"
                  value={draft.alt}
                  onChange={(e) =>
                    setDraft({ ...draft, alt: e.target.value })
                  }
                  className={`mt-1.5 ${inp}`}
                />
              </div>
              <div>
                <label className={lab}>Caption (optional)</label>
                <input
                  type="text"
                  value={draft.caption ?? ""}
                  onChange={(e) =>
                    setDraft({ ...draft, caption: e.target.value })
                  }
                  className={`mt-1.5 ${inp}`}
                />
              </div>
            </>
          ) : null}

          {draft.type === "portfolio" ? (
            <div>
              <label className={lab}>Section title override (optional)</label>
              <input
                type="text"
                value={draft.title ?? ""}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    title: e.target.value.trim() ? e.target.value : undefined,
                  })
                }
                className={`mt-1.5 ${inp}`}
                placeholder="Uses default portfolio title if empty"
              />
            </div>
          ) : null}

          {draft.type === "faq" ? (
            <p className="text-sm text-zinc-400">
              This block shows the FAQ section configured under “FAQ section”.
              Position this block where you want FAQs to appear.
            </p>
          ) : null}

          {draft.type === "spacer" ? (
            <div>
              <label className={lab}>Size</label>
              <select
                value={draft.size ?? "md"}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    size: e.target.value as "sm" | "md" | "lg",
                  })
                }
                className={`mt-1.5 ${inp}`}
              >
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </select>
            </div>
          ) : null}
        </div>

        <div className="flex shrink-0 justify-end gap-2 border-t border-zinc-800 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-black hover:opacity-90"
          >
            Save block
          </button>
        </div>
      </div>
    </div>
  );
}
