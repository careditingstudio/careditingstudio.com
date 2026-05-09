"use client";

import type { ServicePageBlock } from "@/lib/cms-types";
import { SERVICE_FEATURE_ICON_OPTIONS } from "@/lib/service-feature-icons";
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

function linesToArray(s: string): string[] {
  return s
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

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
      <div className="relative flex max-h-[96vh] w-[96vw] max-w-6xl flex-col overflow-hidden rounded-2xl border border-zinc-700/90 bg-zinc-950 shadow-2xl">
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
            <>
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
              <div>
                <label className={lab}>Side title (optional)</label>
                <input
                  type="text"
                  value={draft.sideTitle ?? ""}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      sideTitle: e.target.value.trim() ? e.target.value : undefined,
                    })
                  }
                  className={`mt-1.5 ${inp}`}
                  placeholder="Title beside portfolio image"
                />
              </div>
              <div>
                <label className={lab}>Side text (optional)</label>
                <textarea
                  value={draft.sideText ?? ""}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      sideText: e.target.value.trim() ? e.target.value : undefined,
                    })
                  }
                  rows={5}
                  className={`mt-1.5 resize-y ${inp}`}
                  placeholder="Text shown beside portfolio"
                />
              </div>
            </>
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

          {draft.type === "featureCards" ? (
            <>
              <div>
                <label className={lab}>Section title</label>
                <input
                  type="text"
                  value={draft.sectionTitle}
                  onChange={(e) =>
                    setDraft({ ...draft, sectionTitle: e.target.value })
                  }
                  className={`mt-1.5 ${inp}`}
                />
              </div>
              <div>
                <label className={lab}>Section subtitle (optional)</label>
                <textarea
                  value={draft.sectionSubtext ?? ""}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      sectionSubtext: e.target.value,
                    })
                  }
                  rows={2}
                  className={`mt-1.5 resize-y ${inp}`}
                />
              </div>
              {[0, 1, 2].map((idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3"
                >
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                    Card {idx + 1}
                  </p>
                  <label className={lab}>Title</label>
                  <input
                    type="text"
                    value={draft.cards[idx]?.title ?? ""}
                    onChange={(e) => {
                      const next = [...draft.cards];
                      next[idx] = {
                        ...next[idx]!,
                        title: e.target.value,
                      };
                      setDraft({ ...draft, cards: next });
                    }}
                    className={`mt-1.5 ${inp}`}
                  />
                  <label className={`${lab} mt-2 block`}>Icon</label>
                  <select
                    value={draft.cards[idx]?.iconKey ?? "sparkles"}
                    onChange={(e) => {
                      const next = [...draft.cards];
                      next[idx] = {
                        ...next[idx]!,
                        iconKey: e.target.value,
                      };
                      setDraft({ ...draft, cards: next });
                    }}
                    className={`mt-1.5 ${inp}`}
                  >
                    {SERVICE_FEATURE_ICON_OPTIONS.map((opt) => (
                      <option key={opt.key} value={opt.key}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <label className={`${lab} mt-2 block`}>Body</label>
                  <textarea
                    value={draft.cards[idx]?.body ?? ""}
                    onChange={(e) => {
                      const next = [...draft.cards];
                      next[idx] = {
                        ...next[idx]!,
                        body: e.target.value,
                      };
                      setDraft({ ...draft, cards: next });
                    }}
                    rows={4}
                    className={`mt-1.5 resize-y ${inp}`}
                  />
                </div>
              ))}
            </>
          ) : null}

          {draft.type === "splitShowcase" ? (
            <>
              <div>
                <label className={lab}>Title (optional)</label>
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
                />
              </div>
              <div>
                <label className={lab}>Body</label>
                <textarea
                  value={draft.body}
                  onChange={(e) =>
                    setDraft({ ...draft, body: e.target.value })
                  }
                  rows={6}
                  className={`mt-1.5 resize-y ${inp}`}
                />
              </div>
              <div>
                <label className={lab}>Image URL</label>
                <input
                  type="text"
                  value={draft.imageSrc}
                  onChange={(e) =>
                    setDraft({ ...draft, imageSrc: e.target.value })
                  }
                  className={`mt-1.5 font-mono text-xs ${inp}`}
                />
                <button
                  type="button"
                  onClick={() =>
                    openMediaPicker((url) =>
                      setDraft({ ...draft, imageSrc: url }),
                    )
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
                  value={draft.imageAlt}
                  onChange={(e) =>
                    setDraft({ ...draft, imageAlt: e.target.value })
                  }
                  className={`mt-1.5 ${inp}`}
                />
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  checked={draft.imageRight}
                  onChange={(e) =>
                    setDraft({ ...draft, imageRight: e.target.checked })
                  }
                  className="rounded border-zinc-600"
                />
                Image on the right (off = image on the left)
              </label>
            </>
          ) : null}

          {draft.type === "pillChecklist" ? (
            <>
              <div>
                <label className={lab}>Title</label>
                <input
                  type="text"
                  value={draft.title}
                  onChange={(e) =>
                    setDraft({ ...draft, title: e.target.value })
                  }
                  className={`mt-1.5 ${inp}`}
                />
              </div>
              <div>
                <label className={lab}>Subtitle (optional)</label>
                <textarea
                  value={draft.subtext ?? ""}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      subtext: e.target.value,
                    })
                  }
                  rows={2}
                  className={`mt-1.5 resize-y ${inp}`}
                />
              </div>
              <div>
                <label className={lab}>Category pills (one per line)</label>
                <textarea
                  value={draft.pills.join("\n")}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      pills: linesToArray(e.target.value),
                    })
                  }
                  rows={5}
                  className={`mt-1.5 resize-y font-mono text-xs ${inp}`}
                />
              </div>
              <div>
                <label className={lab}>Checklist (one per line)</label>
                <textarea
                  value={draft.checks.join("\n")}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      checks: linesToArray(e.target.value),
                    })
                  }
                  rows={6}
                  className={`mt-1.5 resize-y font-mono text-xs ${inp}`}
                />
              </div>
            </>
          ) : null}

          {draft.type === "tickChecklist" ? (
            <>
              <div>
                <label className={lab}>Title</label>
                <input
                  type="text"
                  value={draft.title}
                  onChange={(e) =>
                    setDraft({ ...draft, title: e.target.value })
                  }
                  className={`mt-1.5 ${inp}`}
                />
              </div>
              <div>
                <label className={lab}>Subtitle (optional)</label>
                <textarea
                  value={draft.subtext ?? ""}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      subtext: e.target.value.trim() ? e.target.value : undefined,
                    })
                  }
                  rows={2}
                  className={`mt-1.5 resize-y ${inp}`}
                />
              </div>
              <div>
                <label className={lab}>Columns</label>
                <select
                  value={draft.columns ?? 2}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      columns: e.target.value === "1" ? 1 : 2,
                    })
                  }
                  className={`mt-1.5 ${inp}`}
                >
                  <option value="2">2 columns</option>
                  <option value="1">1 column</option>
                </select>
              </div>
              <div>
                <label className={lab}>Tick items (one per line)</label>
                <textarea
                  value={draft.items.join("\n")}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      items: linesToArray(e.target.value),
                    })
                  }
                  rows={10}
                  className={`mt-1.5 resize-y font-mono text-xs ${inp}`}
                />
              </div>
            </>
          ) : null}

          {draft.type === "valueColumns" ? (
            <>
              <div>
                <label className={lab}>Eyebrow (optional)</label>
                <input
                  type="text"
                  value={draft.eyebrow ?? ""}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      eyebrow: e.target.value,
                    })
                  }
                  className={`mt-1.5 ${inp}`}
                />
              </div>
              <div>
                <label className={lab}>Headline</label>
                <input
                  type="text"
                  value={draft.title}
                  onChange={(e) =>
                    setDraft({ ...draft, title: e.target.value })
                  }
                  className={`mt-1.5 ${inp}`}
                />
              </div>
              <div>
                <label className={lab}>Body</label>
                <textarea
                  value={draft.body}
                  onChange={(e) =>
                    setDraft({ ...draft, body: e.target.value })
                  }
                  rows={5}
                  className={`mt-1.5 resize-y ${inp}`}
                />
              </div>
              {[0, 1, 2].map((idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3"
                >
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                    Column {idx + 1}
                  </p>
                  <label className={lab}>Title</label>
                  <input
                    type="text"
                    value={draft.columns[idx]?.title ?? ""}
                    onChange={(e) => {
                      const next = [...draft.columns];
                      next[idx] = {
                        ...next[idx]!,
                        title: e.target.value,
                      };
                      setDraft({ ...draft, columns: next });
                    }}
                    className={`mt-1.5 ${inp}`}
                  />
                  <label className={`${lab} mt-2 block`}>Text</label>
                  <textarea
                    value={draft.columns[idx]?.body ?? ""}
                    onChange={(e) => {
                      const next = [...draft.columns];
                      next[idx] = {
                        ...next[idx]!,
                        body: e.target.value,
                      };
                      setDraft({ ...draft, columns: next });
                    }}
                    rows={3}
                    className={`mt-1.5 resize-y ${inp}`}
                  />
                </div>
              ))}
            </>
          ) : null}

          {draft.type === "supportCards" ? (
            <>
              <div>
                <label className={lab}>Eyebrow (optional)</label>
                <input
                  type="text"
                  value={draft.eyebrow ?? ""}
                  onChange={(e) => setDraft({ ...draft, eyebrow: e.target.value })}
                  className={`mt-1.5 ${inp}`}
                />
              </div>
              <div>
                <label className={lab}>Heading</label>
                <input
                  type="text"
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  className={`mt-1.5 ${inp}`}
                />
              </div>
              <div>
                <label className={lab}>Body</label>
                <textarea
                  value={draft.body}
                  onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                  rows={6}
                  className={`mt-1.5 resize-y ${inp}`}
                />
              </div>
              {[0, 1, 2].map((idx) => (
                <div key={idx} className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                    Card {idx + 1}
                  </p>
                  <label className={lab}>Title</label>
                  <input
                    type="text"
                    value={draft.cards[idx]?.title ?? ""}
                    onChange={(e) => {
                      const next = [...draft.cards];
                      next[idx] = { ...next[idx]!, title: e.target.value };
                      setDraft({ ...draft, cards: next });
                    }}
                    className={`mt-1.5 ${inp}`}
                  />
                  <label className={`${lab} mt-2 block`}>Text</label>
                  <textarea
                    value={draft.cards[idx]?.body ?? ""}
                    onChange={(e) => {
                      const next = [...draft.cards];
                      next[idx] = { ...next[idx]!, body: e.target.value };
                      setDraft({ ...draft, cards: next });
                    }}
                    rows={3}
                    className={`mt-1.5 resize-y ${inp}`}
                  />
                </div>
              ))}
            </>
          ) : null}

          {draft.type === "iconGrid" ? (
            <>
              <div>
                <label className={lab}>Section title</label>
                <input
                  type="text"
                  value={draft.title}
                  onChange={(e) =>
                    setDraft({ ...draft, title: e.target.value })
                  }
                  className={`mt-1.5 ${inp}`}
                />
              </div>
              <div>
                <label className={lab}>Subtitle (optional)</label>
                <textarea
                  value={draft.subtext ?? ""}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      subtext: e.target.value,
                    })
                  }
                  rows={2}
                  className={`mt-1.5 resize-y ${inp}`}
                />
              </div>
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3"
                >
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                    Item {idx + 1}
                  </p>
                  <label className={lab}>Title</label>
                  <input
                    type="text"
                    value={draft.items[idx]?.title ?? ""}
                    onChange={(e) => {
                      const next = [...draft.items];
                      next[idx] = {
                        ...next[idx]!,
                        title: e.target.value,
                      };
                      setDraft({ ...draft, items: next });
                    }}
                    className={`mt-1.5 ${inp}`}
                  />
                  <label className={`${lab} mt-2 block`}>Text</label>
                  <textarea
                    value={draft.items[idx]?.body ?? ""}
                    onChange={(e) => {
                      const next = [...draft.items];
                      next[idx] = {
                        ...next[idx]!,
                        body: e.target.value,
                      };
                      setDraft({ ...draft, items: next });
                    }}
                    rows={3}
                    className={`mt-1.5 resize-y ${inp}`}
                  />
                </div>
              ))}
            </>
          ) : null}

          {draft.type === "compactFeatureCards" ? (
            <>
              <div>
                <label className={lab}>Section title</label>
                <input
                  type="text"
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  className={`mt-1.5 ${inp}`}
                />
              </div>
              <div>
                <label className={lab}>Subtitle (optional)</label>
                <textarea
                  value={draft.subtext ?? ""}
                  onChange={(e) =>
                    setDraft({ ...draft, subtext: e.target.value.trim() ? e.target.value : undefined })
                  }
                  rows={2}
                  className={`mt-1.5 resize-y ${inp}`}
                />
              </div>
              {[0, 1, 2, 3].map((idx) => (
                <div key={idx} className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                    Card {idx + 1}
                  </p>
                  <label className={lab}>Title</label>
                  <input
                    type="text"
                    value={draft.items[idx]?.title ?? ""}
                    onChange={(e) => {
                      const next = [...draft.items];
                      next[idx] = { ...next[idx]!, title: e.target.value };
                      setDraft({ ...draft, items: next });
                    }}
                    className={`mt-1.5 ${inp}`}
                  />
                  <label className={`${lab} mt-2 block`}>Text</label>
                  <textarea
                    value={draft.items[idx]?.body ?? ""}
                    onChange={(e) => {
                      const next = [...draft.items];
                      next[idx] = { ...next[idx]!, body: e.target.value };
                      setDraft({ ...draft, items: next });
                    }}
                    rows={3}
                    className={`mt-1.5 resize-y ${inp}`}
                  />
                </div>
              ))}
            </>
          ) : null}

          {draft.type === "splitPillColumns" ? (
            <>
              <div>
                <label className={lab}>Left column title</label>
                <input
                  type="text"
                  value={draft.titleLeft}
                  onChange={(e) =>
                    setDraft({ ...draft, titleLeft: e.target.value })
                  }
                  className={`mt-1.5 ${inp}`}
                />
              </div>
              <div>
                <label className={lab}>Right column title</label>
                <input
                  type="text"
                  value={draft.titleRight}
                  onChange={(e) =>
                    setDraft({ ...draft, titleRight: e.target.value })
                  }
                  className={`mt-1.5 ${inp}`}
                />
              </div>
              <div>
                <label className={lab}>Left pills (one per line)</label>
                <textarea
                  value={draft.pillsLeft.join("\n")}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      pillsLeft: linesToArray(e.target.value),
                    })
                  }
                  rows={5}
                  className={`mt-1.5 resize-y font-mono text-xs ${inp}`}
                />
              </div>
              <div>
                <label className={lab}>Right pills (one per line)</label>
                <textarea
                  value={draft.pillsRight.join("\n")}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      pillsRight: linesToArray(e.target.value),
                    })
                  }
                  rows={5}
                  className={`mt-1.5 resize-y font-mono text-xs ${inp}`}
                />
              </div>
            </>
          ) : null}

          {draft.type === "contentWide" ? (
            <>
              <div>
                <label className={lab}>Title (optional)</label>
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
                />
              </div>
              <div>
                <label className={lab}>Body</label>
                <textarea
                  value={draft.body}
                  onChange={(e) =>
                    setDraft({ ...draft, body: e.target.value })
                  }
                  rows={10}
                  className={`mt-1.5 resize-y ${inp}`}
                />
              </div>
            </>
          ) : null}

          {draft.type === "whyChooseQuad" ? (
            <>
              <div>
                <label className={lab}>Section title</label>
                <input
                  type="text"
                  value={draft.sectionTitle}
                  onChange={(e) =>
                    setDraft({ ...draft, sectionTitle: e.target.value })
                  }
                  className={`mt-1.5 ${inp}`}
                />
              </div>
              <div>
                <label className={lab}>Section subtitle (optional)</label>
                <textarea
                  value={draft.sectionSubtext ?? ""}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      sectionSubtext: e.target.value,
                    })
                  }
                  rows={2}
                  className={`mt-1.5 resize-y ${inp}`}
                />
              </div>
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3"
                >
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                    Card {idx + 1}
                  </p>
                  <label className={lab}>Title</label>
                  <input
                    type="text"
                    value={draft.cards[idx]?.title ?? ""}
                    onChange={(e) => {
                      const next = [...draft.cards];
                      next[idx] = {
                        ...next[idx]!,
                        title: e.target.value,
                      };
                      setDraft({ ...draft, cards: next });
                    }}
                    className={`mt-1.5 ${inp}`}
                  />
                  <label className={`${lab} mt-2 block`}>Icon</label>
                  <select
                    value={draft.cards[idx]?.iconKey ?? "sparkles"}
                    onChange={(e) => {
                      const next = [...draft.cards];
                      next[idx] = {
                        ...next[idx]!,
                        iconKey: e.target.value,
                      };
                      setDraft({ ...draft, cards: next });
                    }}
                    className={`mt-1.5 ${inp}`}
                  >
                    {SERVICE_FEATURE_ICON_OPTIONS.map((opt) => (
                      <option key={opt.key} value={opt.key}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <label className={`${lab} mt-2 block`}>Body</label>
                  <textarea
                    value={draft.cards[idx]?.body ?? ""}
                    onChange={(e) => {
                      const next = [...draft.cards];
                      next[idx] = {
                        ...next[idx]!,
                        body: e.target.value,
                      };
                      setDraft({ ...draft, cards: next });
                    }}
                    rows={4}
                    className={`mt-1.5 resize-y ${inp}`}
                  />
                </div>
              ))}
            </>
          ) : null}

          {draft.type === "serviceArticle" ? (
            <>
              <div>
                <label className={lab}>Lead title (large)</label>
                <input
                  type="text"
                  value={draft.leadTitle}
                  onChange={(e) =>
                    setDraft({ ...draft, leadTitle: e.target.value })
                  }
                  className={`mt-1.5 ${inp}`}
                />
              </div>
              <div>
                <label className={lab}>Lead paragraph</label>
                <textarea
                  value={draft.leadBody}
                  onChange={(e) =>
                    setDraft({ ...draft, leadBody: e.target.value })
                  }
                  rows={6}
                  className={`mt-1.5 resize-y ${inp}`}
                />
              </div>
              <p className="text-[11px] text-zinc-500">
                Add any number of H2 sections below (title + paragraph each).
              </p>
              {draft.sections.map((sec, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                      H2 section {idx + 1}
                    </p>
                    <button
                      type="button"
                      className="text-[11px] text-red-400 hover:underline"
                      onClick={() =>
                        setDraft({
                          ...draft,
                          sections: draft.sections.filter((_, j) => j !== idx),
                        })
                      }
                    >
                      Remove
                    </button>
                  </div>
                  <label className={lab}>Section title</label>
                  <input
                    type="text"
                    value={sec.title}
                    onChange={(e) => {
                      const next = [...draft.sections];
                      next[idx] = { ...next[idx]!, title: e.target.value };
                      setDraft({ ...draft, sections: next });
                    }}
                    className={`mt-1.5 ${inp}`}
                  />
                  <label className={`${lab} mt-2 block`}>Section body</label>
                  <textarea
                    value={sec.body}
                    onChange={(e) => {
                      const next = [...draft.sections];
                      next[idx] = { ...next[idx]!, body: e.target.value };
                      setDraft({ ...draft, sections: next });
                    }}
                    rows={5}
                    className={`mt-1.5 resize-y ${inp}`}
                  />
                </div>
              ))}
              <button
                type="button"
                className="rounded-lg border border-zinc-600 px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-800"
                onClick={() =>
                  setDraft({
                    ...draft,
                    sections: [...draft.sections, { title: "", body: "" }],
                  })
                }
              >
                + Add H2 section
              </button>
            </>
          ) : null}

          {draft.type === "mediaSpotlight" ? (
            <>
              <div>
                <label className={lab}>Headline (above image)</label>
                <input
                  type="text"
                  value={draft.title}
                  onChange={(e) =>
                    setDraft({ ...draft, title: e.target.value })
                  }
                  className={`mt-1.5 ${inp}`}
                />
              </div>
              <div>
                <label className={lab}>Image URL</label>
                <input
                  type="text"
                  value={draft.imageSrc}
                  onChange={(e) =>
                    setDraft({ ...draft, imageSrc: e.target.value })
                  }
                  className={`mt-1.5 font-mono text-xs ${inp}`}
                />
                <button
                  type="button"
                  onClick={() =>
                    openMediaPicker((url) =>
                      setDraft({ ...draft, imageSrc: url }),
                    )
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
                  value={draft.imageAlt}
                  onChange={(e) =>
                    setDraft({ ...draft, imageAlt: e.target.value })
                  }
                  className={`mt-1.5 ${inp}`}
                />
              </div>
              <div>
                <label className={lab}>Description (below image)</label>
                <textarea
                  value={draft.body}
                  onChange={(e) =>
                    setDraft({ ...draft, body: e.target.value })
                  }
                  rows={8}
                  className={`mt-1.5 resize-y ${inp}`}
                />
              </div>
            </>
          ) : null}

          {draft.type === "pageOutro" ? (
            <>
              <div>
                <label className={lab}>Title</label>
                <input
                  type="text"
                  value={draft.title}
                  onChange={(e) =>
                    setDraft({ ...draft, title: e.target.value })
                  }
                  className={`mt-1.5 ${inp}`}
                />
              </div>
              <div>
                <label className={lab}>Body</label>
                <textarea
                  value={draft.body}
                  onChange={(e) =>
                    setDraft({ ...draft, body: e.target.value })
                  }
                  rows={8}
                  className={`mt-1.5 resize-y ${inp}`}
                />
              </div>
            </>
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
