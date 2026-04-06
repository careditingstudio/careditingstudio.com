"use client";

import { BeforeAfterPostEditModal } from "@/components/admin/BeforeAfterPostEditModal";
import { MediaLibraryModal } from "@/components/admin/MediaLibraryModal";
import { useAdminCms } from "@/components/admin/AdminCmsContext";
import { isUploadedAsset } from "@/lib/cms-types";
import Image from "next/image";
import { useRef, useState } from "react";

function resolvedImageSrc(raw: string): string | null {
  const s = raw.trim();
  return s.length > 0 ? s : null;
}

export function AdminHomePageContent() {
  const {
    cms,
    moveBanner,
    removeBanner,
    addBannerUrl,
    setFloatingCar,
    setPair,
    addPair,
    removePair,
    moveBeforeAfterPost,
    setCms,
    setFlash,
  } = useAdminCms();
  const pickHandlerRef = useRef<(url: string) => void>(() => {});
  const [mediaOpen, setMediaOpen] = useState(false);
  const [editPostIndex, setEditPostIndex] = useState<number | null>(null);

  function openMediaPicker(onChosen: (url: string) => void) {
    pickHandlerRef.current = onChosen;
    setMediaOpen(true);
  }

  function reorderBeforeAfter(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (!cms || j < 0 || j >= cms.beforeAfter.length) return;
    moveBeforeAfterPost(i, dir);
    setEditPostIndex((cur) => {
      if (cur === null) return null;
      if (cur === i) return j;
      if (cur === j) return i;
      return cur;
    });
  }

  if (!cms) return null;

  const floatingSrc = resolvedImageSrc(cms.floatingCar);

  return (
    <div className="mx-auto max-w-4xl space-y-16">
      <MediaLibraryModal
        open={mediaOpen}
        onClose={() => setMediaOpen(false)}
        onPick={(url) => {
          pickHandlerRef.current(url);
          setMediaOpen(false);
        }}
        title="Choose image"
      />


      <section className="scroll-mt-8" id="hero-banners">
        <h2 className="text-lg font-semibold text-white">Hero banners</h2>
        <ul className="mt-6 space-y-3">
          {cms.heroBanners.map((url, i) => {
            const src = resolvedImageSrc(url);
            return (
              <li
                key={`banner-${i}`}
                className="flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 sm:flex-row sm:items-center"
              >
                <div className="relative h-24 w-40 shrink-0 overflow-hidden rounded-lg bg-black">
                  {src ? (
                    <Image
                      src={src}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="160px"
                      unoptimized={isUploadedAsset(src)}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-2 text-center text-[10px] text-zinc-600">
                      No image
                    </div>
                  )}
                </div>
                <p className="min-w-0 flex-1 break-all font-mono text-xs text-zinc-400">
                  {url}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      openMediaPicker((picked) => {
                        setCms((c) => {
                          if (!c) return c;
                          const next = [...c.heroBanners];
                          next[i] = picked;
                          return { ...c, heroBanners: next };
                        });
                        setFlash({ type: "ok", text: "Updated." });
                      })
                    }
                    className="rounded-lg border border-[var(--accent)]/35 bg-[var(--accent)]/10 px-3 py-1.5 text-xs text-[var(--accent)] hover:bg-[var(--accent)]/20"
                  >
                    Library
                  </button>
                  <button
                    type="button"
                    onClick={() => moveBanner(i, -1)}
                    disabled={i === 0}
                    className="rounded-lg border border-zinc-600 px-3 py-1.5 text-xs text-zinc-300 disabled:opacity-30"
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    onClick={() => moveBanner(i, 1)}
                    disabled={i === cms.heroBanners.length - 1}
                    className="rounded-lg border border-zinc-600 px-3 py-1.5 text-xs text-zinc-300 disabled:opacity-30"
                  >
                    Down
                  </button>
                  <button
                    type="button"
                    onClick={() => removeBanner(i)}
                    className="rounded-lg border border-red-900/50 px-3 py-1.5 text-xs text-red-400"
                  >
                    Remove
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        <button
          type="button"
          onClick={() =>
            openMediaPicker((url) => {
              addBannerUrl(url);
              setFlash({ type: "ok", text: "Added." });
            })
          }
          className="mt-6 flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-600 bg-zinc-900/30 px-6 py-10 text-center transition hover:border-[var(--accent)]/50"
        >
          <span className="text-sm font-medium text-zinc-200">
            Add banner
          </span>
        </button>
      </section>

      <section className="scroll-mt-8 border-t border-zinc-800 pt-16" id="floating-car">
        <h2 className="text-lg font-semibold text-white">Floating car</h2>
        <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="relative mx-auto aspect-[16/10] max-w-md bg-zinc-950">
            {floatingSrc ? (
              <Image
                src={floatingSrc}
                alt=""
                fill
                className="object-contain p-4"
                sizes="(max-width:768px) 100vw, 448px"
                unoptimized={isUploadedAsset(floatingSrc)}
              />
            ) : (
              <div className="flex h-full min-h-[12rem] items-center justify-center px-4 text-center text-sm text-zinc-600">
                —
              </div>
            )}
          </div>
          <label className="mt-6 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Image URL
          </label>
          <input
            type="text"
            value={cms.floatingCar}
            onChange={(e) => setFloatingCar(e.target.value)}
            className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 font-mono text-sm text-zinc-200 outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30"
          />
          <button
            type="button"
            onClick={() =>
              openMediaPicker((url) => {
                setFloatingCar(url);
                setFlash({ type: "ok", text: "Updated." });
              })
            }
            className="mt-4 rounded-lg border border-[var(--accent)]/35 bg-[var(--accent)]/10 px-4 py-2.5 text-sm font-medium text-[var(--accent)] hover:bg-[var(--accent)]/20"
          >
            Library
          </button>
        </div>
      </section>

      <section className="scroll-mt-8 border-t border-zinc-800 pt-16" id="before-after">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-white">Before / after</h2>
          <button
            type="button"
            onClick={() => {
              const next = cms.beforeAfter.length;
              addPair();
              setEditPostIndex(next);
            }}
            className="shrink-0 rounded-lg border border-zinc-600 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800"
          >
            + Add
          </button>
        </div>

        {editPostIndex !== null && cms.beforeAfter[editPostIndex] ? (
          <BeforeAfterPostEditModal
            open
            postIndex={editPostIndex}
            pair={cms.beforeAfter[editPostIndex]}
            onClose={() => setEditPostIndex(null)}
            setPairPatch={(patch) => {
              const idx = editPostIndex;
              if (idx !== null) setPair(idx, patch);
            }}
            pickFromLibrary={(cb) => openMediaPicker(cb)}
            setFlash={setFlash}
            onDelete={() => {
              const idx = editPostIndex;
              if (idx !== null) removePair(idx);
              setEditPostIndex(null);
            }}
          />
        ) : null}

        <ul className="mt-4 space-y-1.5">
          {cms.beforeAfter.length === 0 ? (
            <li className="rounded-lg border border-zinc-800/80 px-3 py-5 text-center text-[11px] text-zinc-600">
              —
            </li>
          ) : (
            cms.beforeAfter.map((pair, i) => {
              return (
                <li
                  key={`ba-${i}`}
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
                      onClick={() => reorderBeforeAfter(i, -1)}
                      className="rounded border border-zinc-700 px-1.5 py-0.5 text-[10px] text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-25"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      aria-label="Move down"
                      disabled={i === cms.beforeAfter.length - 1}
                      onClick={() => reorderBeforeAfter(i, 1)}
                      className="rounded border border-zinc-700 px-1.5 py-0.5 text-[10px] text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-25"
                    >
                      ↓
                    </button>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs text-zinc-200">
                      {pair.title.trim() || "Untitled"}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEditPostIndex(i)}
                      className="rounded-md border border-zinc-600 bg-zinc-800/60 px-2.5 py-1 text-[11px] font-medium text-zinc-200 hover:border-[var(--accent)]/40 hover:text-white"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        removePair(i);
                        if (editPostIndex === i) setEditPostIndex(null);
                        if (editPostIndex !== null && editPostIndex > i) {
                          setEditPostIndex(editPostIndex - 1);
                        }
                      }}
                      className="rounded-md px-2 py-1 text-[11px] text-zinc-500 hover:text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </section>
    </div>
  );
}
