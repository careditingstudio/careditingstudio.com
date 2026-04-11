"use client";

import { isUploadedAsset, type BeforeAfterPair } from "@/lib/cms-types";
import Image from "next/image";
import { useEffect, useId } from "react";

function thumbSrc(raw: string): string | null {
  const s = raw.trim();
  return s.length > 0 ? s : null;
}

type Props = {
  open: boolean;
  onClose: () => void;
  postIndex: number;
  pair: BeforeAfterPair;
  setPairPatch: (patch: Partial<BeforeAfterPair>) => void;
  pickFromLibrary: (onPicked: (url: string) => void) => void;
  setFlash: (v: { type: "ok" | "err"; text: string }) => void;
  onDelete: () => void;
};

export function BeforeAfterPostEditModal({
  open,
  onClose,
  postIndex,
  pair,
  setPairPatch,
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
            Post {postIndex + 1}
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
              <label className={lab}>Title</label>
              <input
                type="text"
                value={pair.title}
                onChange={(e) => setPairPatch({ title: e.target.value })}
                className={`mt-1.5 ${inp}`}
              />
            </div>
            <div>
              <label className={lab}>Pricing / note</label>
              <input
                type="text"
                value={pair.priceNote}
                onChange={(e) => setPairPatch({ priceNote: e.target.value })}
                className={`mt-1.5 ${inp}`}
              />
            </div>
            <div>
              <label className={lab}>Description</label>
              <textarea
                value={pair.intro}
                onChange={(e) => setPairPatch({ intro: e.target.value })}
                rows={4}
                className={`mt-1.5 resize-y ${inp}`}
              />
            </div>
            <div>
              <label className={lab}>Feature list heading</label>
              <input
                type="text"
                value={pair.listTitle}
                onChange={(e) => setPairPatch({ listTitle: e.target.value })}
                className={`mt-1.5 ${inp}`}
              />
            </div>
            <div>
              <p className={lab}>Feature lines</p>
              <ul className="mt-2 space-y-2">
                {pair.includes.map((line, li) => (
                  <li key={li} className="flex gap-2">
                    <input
                      type="text"
                      value={line}
                      onChange={(e) => {
                        const next = [...pair.includes];
                        next[li] = e.target.value;
                        setPairPatch({ includes: next });
                      }}
                      className={`min-w-0 flex-1 ${inp}`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setPairPatch({
                          includes: pair.includes.filter((_, j) => j !== li),
                        })
                      }
                      className="shrink-0 rounded-lg border border-zinc-600 px-2 py-2 text-xs text-zinc-400 hover:bg-zinc-800"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() =>
                  setPairPatch({ includes: [...pair.includes, ""] })
                }
                className="mt-2 text-xs font-medium text-[var(--accent)] hover:underline"
              >
                + Line
              </button>
            </div>

            <div className="border-t border-zinc-800 pt-4">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  className="rounded border-zinc-600"
                  checked={pair.imageFirst}
                  onChange={(e) =>
                    setPairPatch({ imageFirst: e.target.checked })
                  }
                />
                Image on the left on large screens (text on the right)
              </label>
            </div>

            <div className="border-t border-zinc-800 pt-4">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  className="rounded border-zinc-600"
                  checked={pair.showDualCtas}
                  onChange={(e) =>
                    setPairPatch({ showDualCtas: e.target.checked })
                  }
                />
                Two buttons
              </label>
            </div>

            {pair.showDualCtas ? (
              <div className="grid gap-4 border-t border-zinc-800 pt-4 sm:grid-cols-2">
                <div>
                  <label className={lab}>Primary label</label>
                  <input
                    type="text"
                    value={pair.primaryCtaLabel}
                    onChange={(e) =>
                      setPairPatch({ primaryCtaLabel: e.target.value })
                    }
                    className={`mt-1.5 ${inp}`}
                  />
                  <label className={`mt-2 block ${lab}`}>Primary URL</label>
                  <input
                    type="text"
                    value={pair.primaryCtaHref}
                    onChange={(e) =>
                      setPairPatch({ primaryCtaHref: e.target.value })
                    }
                    className={`mt-1.5 font-mono text-xs ${inp}`}
                  />
                </div>
                <div>
                  <label className={lab}>Secondary label</label>
                  <input
                    type="text"
                    value={pair.secondaryCtaLabel}
                    onChange={(e) =>
                      setPairPatch({ secondaryCtaLabel: e.target.value })
                    }
                    className={`mt-1.5 ${inp}`}
                  />
                  <label className={`mt-2 block ${lab}`}>Secondary URL</label>
                  <input
                    type="text"
                    value={pair.secondaryCtaHref}
                    onChange={(e) =>
                      setPairPatch({ secondaryCtaHref: e.target.value })
                    }
                    className={`mt-1.5 font-mono text-xs ${inp}`}
                  />
                </div>
              </div>
            ) : (
              <div className="border-t border-zinc-800 pt-4">
                <label className={lab}>Link text</label>
                <input
                  type="text"
                  value={pair.soloCtaLabel}
                  onChange={(e) =>
                    setPairPatch({ soloCtaLabel: e.target.value })
                  }
                  className={`mt-1.5 ${inp}`}
                />
                <label className={`mt-2 block ${lab}`}>Link URL</label>
                <input
                  type="text"
                  value={pair.soloCtaHref}
                  onChange={(e) =>
                    setPairPatch({ soloCtaHref: e.target.value })
                  }
                  className={`mt-1.5 font-mono text-xs ${inp}`}
                />
              </div>
            )}

            <div className="border-t border-zinc-800 pt-4">
              <p className={lab}>Slider</p>
              <div className="mt-3 grid gap-6 md:grid-cols-2">
                {(["before", "after"] as const).map((side) => {
                  const sideSrc = thumbSrc(pair[side]);
                  const altKey = side === "before" ? "beforeAlt" : "afterAlt";
                  return (
                    <div key={side} className="space-y-2">
                      <p className="text-xs font-medium capitalize text-zinc-400">
                        {side}
                      </p>
                      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-zinc-900">
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
                        value={pair[altKey]}
                        onChange={(e) =>
                          setPairPatch({ [altKey]: e.target.value })
                        }
                        className={`${inp} text-xs`}
                      />
                      <input
                        type="text"
                        value={pair[side]}
                        onChange={(e) =>
                          setPairPatch({ [side]: e.target.value })
                        }
                        className={`font-mono text-xs ${inp}`}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          pickFromLibrary((url) => {
                            setPairPatch({ [side]: url });
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
            Delete post
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
