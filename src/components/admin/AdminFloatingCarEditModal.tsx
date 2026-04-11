"use client";

import { AdminFormModal } from "@/components/admin/AdminFormModal";
import { useAdminCms } from "@/components/admin/AdminCmsContext";
import { isUploadedAsset } from "@/lib/cms-types";
import Image from "next/image";
import { useId, useState } from "react";

function resolvedImageSrc(raw: string): string | null {
  const s = raw.trim();
  return s.length > 0 ? s : null;
}

type Props = {
  open: boolean;
  onClose: () => void;
  openMediaPicker: (onChosen: (url: string) => void) => void;
};

export function AdminFloatingCarEditModal({
  open,
  onClose,
  openMediaPicker,
}: Props) {
  const { cms, setFloatingCar, setFlash, upload } = useAdminCms();
  const fileId = useId();
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState("");

  if (!cms) return null;

  const src = resolvedImageSrc(cms.floatingCar);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setUploadErr("");
    try {
      const url = await upload(file);
      setFloatingCar(url);
      setFlash({ type: "ok", text: "Floating car image updated." });
    } catch (e) {
      setUploadErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <AdminFormModal
      open={open}
      onClose={onClose}
      title="Intro floating car"
      maxWidthClass="max-w-3xl"
      maxHeightClass="max-h-[min(90vh,42rem)]"
    >
      <div className="space-y-4">
        <p className="text-xs text-zinc-500">
          Transparent PNG or WebP cutout — shown on the dark band below the hero,
          right of the headline. Publish from the bar when you are done.
        </p>

        {uploadErr ? (
          <p className="text-sm text-red-400">{uploadErr}</p>
        ) : null}

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative mx-auto h-32 w-52 shrink-0 overflow-hidden rounded-lg bg-black sm:mx-0">
              {src ? (
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-contain p-1"
                  sizes="208px"
                  unoptimized={isUploadedAsset(src)}
                />
              ) : (
                <div className="flex h-full items-center justify-center px-3 text-center text-[11px] text-zinc-600">
                  No image yet
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <p className="break-all font-mono text-[11px] leading-relaxed text-zinc-500">
                {cms.floatingCar.trim() || "—"}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    openMediaPicker((picked) => {
                      setFloatingCar(picked);
                      setFlash({ type: "ok", text: "Image selected." });
                    })
                  }
                  className="rounded-lg border border-[var(--accent)]/35 bg-[var(--accent)]/10 px-3 py-1.5 text-xs text-[var(--accent)] hover:bg-[var(--accent)]/20"
                >
                  Media library
                </button>
                {cms.floatingCar.trim() ? (
                  <button
                    type="button"
                    onClick={() => {
                      setFloatingCar("");
                      setFlash({ type: "ok", text: "Cleared." });
                    }}
                    className="rounded-lg border border-red-900/50 px-3 py-1.5 text-xs text-red-400"
                  >
                    Remove
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-600 bg-zinc-900/30 px-6 py-8 text-center transition hover:border-[var(--accent)]/50">
          <span className="text-sm font-medium text-zinc-200">
            {uploading ? "Uploading…" : "Upload image from your computer"}
          </span>
          <span className="mt-1 text-xs text-zinc-500">
            PNG, WebP, JPEG — same as hero banners
          </span>
          <input
            id={fileId}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif,image/*"
            disabled={uploading}
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              e.target.value = "";
              void handleFile(f);
            }}
          />
        </label>
      </div>
    </AdminFormModal>
  );
}
