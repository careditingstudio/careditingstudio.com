"use client";

import type { ServiceFaqItem, ServicePageFaqSection } from "@/lib/cms-types";
import { useEffect, useId, useState } from "react";

const inp =
  "w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30";
const lab = "text-[11px] font-medium uppercase tracking-wide text-zinc-500";

type Props = {
  open: boolean;
  onClose: () => void;
  section: ServicePageFaqSection;
  onChange: (next: ServicePageFaqSection) => void;
};

function FaqItemEditorModal({
  open,
  onClose,
  item,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  item: ServiceFaqItem;
  onSave: (v: ServiceFaqItem) => void;
}) {
  const titleId = useId();
  const [q, setQ] = useState(item.question);
  const [a, setA] = useState(item.answer);

  useEffect(() => {
    setQ(item.question);
    setA(item.answer);
  }, [item, open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[115] flex items-center justify-center p-4 sm:p-6"
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
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-700/90 bg-zinc-950 p-5 shadow-2xl">
        <h3 id={titleId} className="text-sm font-semibold text-white">
          Edit FAQ item
        </h3>
        <div className="mt-4 space-y-3">
          <div>
            <label className={lab}>Question</label>
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className={`mt-1.5 ${inp}`}
            />
          </div>
          <div>
            <label className={lab}>Answer</label>
            <textarea
              value={a}
              onChange={(e) => setA(e.target.value)}
              rows={6}
              className={`mt-1.5 resize-y ${inp}`}
            />
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onSave({ question: q, answer: a });
              onClose();
            }}
            className="rounded-lg bg-[var(--accent)] px-3 py-1.5 text-sm font-medium text-black hover:opacity-90"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminServiceFaqModal({
  open,
  onClose,
  section,
  onChange,
}: Props) {
  const titleId = useId();
  const [local, setLocal] = useState(section);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    if (open) setLocal(section);
  }, [open, section]);

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

  function moveItem(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= local.items.length) return;
    const next = [...local.items];
    [next[i], next[j]] = [next[j]!, next[i]!];
    setLocal({ ...local, items: next });
    onChange({ ...local, items: next });
  }

  const editingItem =
    editIndex !== null ? local.items[editIndex] ?? null : null;

  return (
    <>
      {editingItem && editIndex !== null ? (
        <FaqItemEditorModal
          open
          item={editingItem}
          onClose={() => setEditIndex(null)}
          onSave={(v) => {
            const items = local.items.map((row, k) =>
              k === editIndex ? v : row,
            );
            setLocal({ ...local, items });
            onChange({ ...local, items });
          }}
        />
      ) : null}

      <div
        className="fixed inset-0 z-[105] flex items-center justify-center p-4 sm:p-6"
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
        <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-zinc-700/90 bg-zinc-950 shadow-2xl">
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-zinc-800 px-5 py-4">
            <h2 id={titleId} className="text-base font-semibold text-white">
              FAQ section (this service)
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-2 py-1 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white"
            >
              Close
            </button>
          </div>

          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-4">
            <div className="space-y-3">
              <div>
                <label className={lab}>Eyebrow (optional)</label>
                <input
                  type="text"
                  value={local.eyebrow}
                  onChange={(e) => {
                    const next = { ...local, eyebrow: e.target.value };
                    setLocal(next);
                    onChange(next);
                  }}
                  className={`mt-1.5 ${inp}`}
                  placeholder="e.g. FAQ's"
                />
              </div>
              <div>
                <label className={lab}>Title (optional)</label>
                <input
                  type="text"
                  value={local.title}
                  onChange={(e) => {
                    const next = { ...local, title: e.target.value };
                    setLocal(next);
                    onChange(next);
                  }}
                  className={`mt-1.5 ${inp}`}
                />
              </div>
              <div>
                <label className={lab}>Subtitle (optional)</label>
                <textarea
                  value={local.subtitle}
                  onChange={(e) => {
                    const next = { ...local, subtitle: e.target.value };
                    setLocal(next);
                    onChange(next);
                  }}
                  rows={2}
                  className={`mt-1.5 resize-y ${inp}`}
                />
              </div>
              <div>
                <p className={lab}>Layout</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const next = { ...local, columns: 1 as const };
                      setLocal(next);
                      onChange(next);
                    }}
                    className={`rounded-lg border px-3 py-1.5 text-xs ${
                      local.columns === 1
                        ? "border-[var(--accent)] bg-[var(--accent)]/15 text-white"
                        : "border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                    }`}
                  >
                    One column
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const next = { ...local, columns: 2 as const };
                      setLocal(next);
                      onChange(next);
                    }}
                    className={`rounded-lg border px-3 py-1.5 text-xs ${
                      local.columns === 2
                        ? "border-[var(--accent)] bg-[var(--accent)]/15 text-white"
                        : "border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                    }`}
                  >
                    Two columns
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className={lab}>Questions &amp; answers</p>
                <button
                  type="button"
                  onClick={() => {
                    const items = [
                      ...local.items,
                      { question: "", answer: "" },
                    ];
                    const next = { ...local, items };
                    setLocal(next);
                    onChange(next);
                  }}
                  className="rounded border border-zinc-600 px-2 py-1 text-[11px] text-zinc-300 hover:bg-zinc-800"
                >
                  + Add
                </button>
              </div>
              <ul className="space-y-2">
                {local.items.length === 0 ? (
                  <li className="rounded border border-zinc-800 px-3 py-4 text-center text-[11px] text-zinc-600">
                    No FAQ items yet.
                  </li>
                ) : (
                  local.items.map((it, i) => (
                    <li
                      key={`faq-${i}-${it.question.slice(0, 12)}`}
                      className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2"
                    >
                      <div className="flex shrink-0 flex-col gap-0.5">
                        <button
                          type="button"
                          disabled={i === 0}
                          onClick={() => moveItem(i, -1)}
                          className="rounded border border-zinc-700 px-1.5 py-0.5 text-[10px] text-zinc-400 hover:bg-zinc-800 disabled:opacity-25"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          disabled={i === local.items.length - 1}
                          onClick={() => moveItem(i, 1)}
                          className="rounded border border-zinc-700 px-1.5 py-0.5 text-[10px] text-zinc-400 hover:bg-zinc-800 disabled:opacity-25"
                        >
                          ↓
                        </button>
                      </div>
                      <p className="min-w-0 flex-1 truncate text-xs text-zinc-300">
                        {it.question.trim() || "Empty question"}
                      </p>
                      <button
                        type="button"
                        onClick={() => setEditIndex(i)}
                        className="shrink-0 rounded-md border border-zinc-600 px-2 py-1 text-[11px] text-zinc-200 hover:border-[var(--accent)]/40"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const items = local.items.filter((_, k) => k !== i);
                          const next = { ...local, items };
                          setLocal(next);
                          onChange(next);
                        }}
                        className="shrink-0 text-[11px] text-zinc-500 hover:text-red-400"
                      >
                        Remove
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>

          <div className="flex shrink-0 justify-end border-t border-zinc-800 px-5 py-3">
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
    </>
  );
}
