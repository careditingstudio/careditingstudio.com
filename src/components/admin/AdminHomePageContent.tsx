"use client";

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
    setCms,
    setFlash,
  } = useAdminCms();
  const pickHandlerRef = useRef<(url: string) => void>(() => {});
  const [mediaOpen, setMediaOpen] = useState(false);

  function openMediaPicker(onChosen: (url: string) => void) {
    pickHandlerRef.current = onChosen;
    setMediaOpen(true);
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

      <header className="border-b border-zinc-800 pb-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Public page
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-white">Home</h1>
        <p className="mt-2 font-mono text-sm text-[var(--accent)]">/</p>
        <p className="mt-4 text-sm leading-relaxed text-zinc-400">
          Everything below appears only on the home page: full-screen hero
          backgrounds, the floating car, and the before/after blocks.
        </p>
      </header>

      <section className="scroll-mt-8" id="hero-banners">
        <h2 className="text-lg font-semibold text-white">Hero banners</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Full-screen images behind the headline. Multiple images cross-fade.
          Order = first in list shows first.
        </p>
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
                        setFlash({
                          type: "ok",
                          text: "Banner updated — publish when ready.",
                        });
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
              setFlash({
                type: "ok",
                text: "Banner added — publish when ready.",
              });
            })
          }
          className="mt-6 flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-600 bg-zinc-900/30 px-6 py-10 text-center transition hover:border-[var(--accent)]/50"
        >
          <span className="text-sm font-medium text-zinc-200">
            Add banner from library
          </span>
          <span className="mt-1 text-xs text-zinc-500">
            Opens your media library — pick an image or upload there
          </span>
        </button>
      </section>

      <section className="scroll-mt-8 border-t border-zinc-800 pt-16" id="floating-car">
        <h2 className="text-lg font-semibold text-white">Floating car</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Cut-out over the hero. PNG/WebP with transparency works best.
        </p>
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
                No image yet — set a URL below or choose from the library.
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
                setFlash({ type: "ok", text: "Updated — publish when ready." });
              })
            }
            className="mt-4 rounded-lg border border-[var(--accent)]/35 bg-[var(--accent)]/10 px-4 py-2.5 text-sm font-medium text-[var(--accent)] hover:bg-[var(--accent)]/20"
          >
            Choose from library…
          </button>
        </div>
      </section>

      <section className="scroll-mt-8 border-t border-zinc-800 pt-16" id="before-after">
        <h2 className="text-lg font-semibold text-white">Before / after</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Pair 1 and 2 map to the two showcase rows on the home page.
        </p>
        <ul className="mt-8 space-y-10">
          {cms.beforeAfter.map((pair, i) => (
            <li
              key={i}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-200">
                  Pair {i + 1}
                  {i === 0 ? " — first block" : i === 1 ? " — second block" : ""}
                </span>
                <button
                  type="button"
                  onClick={() => removePair(i)}
                  className="text-xs text-red-400 hover:underline"
                >
                  Remove
                </button>
              </div>
              <div className="grid gap-8 md:grid-cols-2">
                {(["before", "after"] as const).map((side) => {
                  const sideSrc = resolvedImageSrc(pair[side]);
                  return (
                    <div key={side} className="space-y-3">
                      <p className="text-xs font-semibold uppercase text-zinc-500">
                        {side}
                      </p>
                      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-zinc-950">
                        {sideSrc ? (
                          <Image
                            src={sideSrc}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="(max-width:768px) 100vw, 50vw"
                            unoptimized={isUploadedAsset(sideSrc)}
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-zinc-600">
                            Empty
                          </div>
                        )}
                      </div>
                      <input
                        type="text"
                        value={pair[side]}
                        onChange={(e) => setPair(i, { [side]: e.target.value })}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-xs text-zinc-200"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          openMediaPicker((url) => {
                            setPair(i, { [side]: url });
                            setFlash({
                              type: "ok",
                              text: "Image set — publish when ready.",
                            });
                          })
                        }
                        className="inline-flex rounded-lg border border-[var(--accent)]/35 bg-[var(--accent)]/10 px-3 py-2 text-xs font-medium text-[var(--accent)] hover:bg-[var(--accent)]/20"
                      >
                        Library — {side}
                      </button>
                    </div>
                  );
                })}
              </div>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => addPair()}
          className="mt-8 rounded-xl border border-zinc-600 px-5 py-3 text-sm text-zinc-300 hover:bg-zinc-800"
        >
          + Add pair
        </button>
      </section>
    </div>
  );
}
