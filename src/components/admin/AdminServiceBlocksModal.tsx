"use client";

import { AdminServiceBlockEditorModal } from "@/components/admin/AdminServiceBlockEditorModal";
import { MediaLibraryModal } from "@/components/admin/MediaLibraryModal";
import {
  type ServicePageBlock,
  newServicePageBlock,
} from "@/lib/cms-types";
import { useEffect, useId, useRef, useState } from "react";

function blockLabel(b: ServicePageBlock): string {
  switch (b.type) {
    case "heading":
      return b.text.trim() || "Heading";
    case "paragraph":
      return b.text.trim().slice(0, 48) || "Paragraph";
    case "image":
      return b.src.trim() ? "Image" : "Image (no URL)";
    case "portfolio":
      return "Portfolio grid";
    case "faq":
      return "FAQ section";
    case "spacer":
      return `Spacer (${b.size ?? "md"})`;
    default:
      return "Block";
  }
}

type Props = {
  open: boolean;
  onClose: () => void;
  blocks: ServicePageBlock[];
  onChangeBlocks: (blocks: ServicePageBlock[]) => void;
  setFlash: (v: { type: "ok" | "err"; text: string } | null) => void;
};

export function AdminServiceBlocksModal({
  open,
  onClose,
  blocks,
  onChangeBlocks,
  setFlash,
}: Props) {
  const titleId = useId();
  const [mediaOpen, setMediaOpen] = useState(false);
  const pickRef = useRef<(url: string) => void>(() => {});
  const [editorBlock, setEditorBlock] = useState<ServicePageBlock | null>(null);

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

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= blocks.length) return;
    const next = [...blocks];
    [next[i], next[j]] = [next[j]!, next[i]!];
    onChangeBlocks(next);
  }

  function removeAt(i: number) {
    onChangeBlocks(blocks.filter((_, k) => k !== i));
  }

  function addBlock(
    type: ServicePageBlock["type"],
  ) {
    onChangeBlocks([...blocks, newServicePageBlock(type)]);
    setFlash({ type: "ok", text: "Block added." });
    setTimeout(() => setFlash(null), 2500);
  }

  if (!open) return null;

  return (
    <>
      <MediaLibraryModal
        open={mediaOpen}
        onClose={() => setMediaOpen(false)}
        onPick={(url) => {
          pickRef.current(url);
          setMediaOpen(false);
        }}
        title="Choose image"
      />
      <AdminServiceBlockEditorModal
        open={editorBlock !== null}
        onClose={() => setEditorBlock(null)}
        block={editorBlock}
        onSave={(b) => {
          const idx = blocks.findIndex((x) => x.id === b.id);
          if (idx < 0) return;
          const next = [...blocks];
          next[idx] = b;
          onChangeBlocks(next);
        }}
        openMediaPicker={(cb) => {
          pickRef.current = cb;
          setMediaOpen(true);
        }}
      />

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
              Page blocks
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-2 py-1 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white"
            >
              Close
            </button>
          </div>

          <p className="border-b border-zinc-800 px-5 py-3 text-xs leading-relaxed text-zinc-500">
            Build the service page like a simple page builder: add sections, drag
            order with ↑↓, and place portfolio or FAQ where you want. Leave the
            list empty to use the classic intro + portfolio + FAQ layout.
          </p>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] uppercase tracking-wide text-zinc-600">
                Add:
              </span>
              {(
                [
                  "heading",
                  "paragraph",
                  "image",
                  "portfolio",
                  "faq",
                  "spacer",
                ] as const
              ).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => addBlock(t)}
                  className="rounded border border-zinc-700 px-2 py-1 text-[11px] text-zinc-300 hover:bg-zinc-800"
                >
                  + {t}
                </button>
              ))}
            </div>

            <ul className="mt-4 space-y-2">
              {blocks.length === 0 ? (
                <li className="rounded-lg border border-zinc-800/80 px-3 py-6 text-center text-[11px] text-zinc-600">
                  No blocks — classic layout is used.
                </li>
              ) : (
                blocks.map((b, i) => (
                  <li
                    key={b.id}
                    className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2"
                  >
                    <div className="flex shrink-0 flex-col gap-0.5">
                      <button
                        type="button"
                        aria-label="Move up"
                        disabled={i === 0}
                        onClick={() => move(i, -1)}
                        className="rounded border border-zinc-700 px-1.5 py-0.5 text-[10px] text-zinc-400 hover:bg-zinc-800 disabled:opacity-25"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        aria-label="Move down"
                        disabled={i === blocks.length - 1}
                        onClick={() => move(i, 1)}
                        className="rounded border border-zinc-700 px-1.5 py-0.5 text-[10px] text-zinc-400 hover:bg-zinc-800 disabled:opacity-25"
                      >
                        ↓
                      </button>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium capitalize text-zinc-200">
                        {b.type}
                      </p>
                      <p className="truncate text-[11px] text-zinc-500">
                        {blockLabel(b)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditorBlock(b)}
                      className="shrink-0 rounded-md border border-zinc-600 px-2 py-1 text-[11px] text-zinc-200 hover:border-[var(--accent)]/40"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => removeAt(i)}
                      className="shrink-0 text-[11px] text-zinc-500 hover:text-red-400"
                    >
                      Remove
                    </button>
                  </li>
                ))
              )}
            </ul>
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
