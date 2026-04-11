"use client";

import { AdminFormModal } from "@/components/admin/AdminFormModal";
import { useAdminCms } from "@/components/admin/AdminCmsContext";
import { isUploadedAsset } from "@/lib/cms-types";
import Image from "next/image";

function resolvedImageSrc(raw: string): string | null {
  const s = raw.trim();
  return s.length > 0 ? s : null;
}

type Props = {
  open: boolean;
  onClose: () => void;
  openMediaPicker: (onChosen: (url: string) => void) => void;
};

export function AdminHeroEditModal({
  open,
  onClose,
  openMediaPicker,
}: Props) {
  const {
    cms,
    moveBanner,
    removeBanner,
    addBannerUrl,
    setCms,
    setFlash,
  } = useAdminCms();

  if (!cms) return null;

  return (
    <AdminFormModal
      open={open}
      onClose={onClose}
      title="Hero banner"
      maxWidthClass="max-w-5xl"
      maxHeightClass="max-h-[min(94vh,58rem)]"
    >
      <div>
        <p className="text-xs text-zinc-500">
          Rotating full-width backgrounds behind the headline (same order as the live
          site).
        </p>
        <ul className="mt-4 space-y-3">
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
          className="mt-4 flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-600 bg-zinc-900/30 px-6 py-8 text-center transition hover:border-[var(--accent)]/50"
        >
          <span className="text-sm font-medium text-zinc-200">Add banner</span>
        </button>
      </div>
    </AdminFormModal>
  );
}
