"use client";

import { adminUploadFile } from "@/components/admin/admin-upload";
import { fetchAdminUploadList } from "@/lib/admin-uploads-api";
import { isUploadedAsset } from "@/lib/cms-types";
import Image from "next/image";
import { useCallback, useEffect, useId, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  /** Called when the user picks an existing file or finishes a new upload. */
  onPick: (url: string) => void;
  title?: string;
};

export function MediaLibraryModal({
  open,
  onClose,
  onPick,
  title = "Media library",
}: Props) {
  const fileId = useId();
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const list = await fetchAdminUploadList();
      setFiles(list);
    } catch {
      setErr("Could not load the library.");
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    void load();
  }, [open, load]);

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

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setErr("");
    try {
      const url = await adminUploadFile(file);
      setFiles((prev) => [url, ...prev.filter((u) => u !== url)]);
      onPick(url);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function select(url: string) {
    onPick(url);
    onClose();
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${fileId}-title`}
    >
      <button
        type="button"
        aria-label="Close library"
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative flex max-h-[min(40rem,85vh)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-zinc-700/90 bg-zinc-950 shadow-2xl shadow-black/50"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-zinc-800 px-5 py-4 sm:px-6">
          <h2
            id={`${fileId}-title`}
            className="text-lg font-semibold tracking-tight text-white"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            Esc
          </button>
        </div>

        <div className="shrink-0 border-b border-zinc-800/80 px-5 py-3 sm:px-6">
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-600 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-300 transition hover:border-[var(--accent)]/45 hover:bg-zinc-900">
            <span className="font-medium text-zinc-200">
              {uploading ? "Uploading…" : "Upload"}
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

        {err ? (
          <p className="shrink-0 px-5 py-2 text-sm text-red-400 sm:px-6">{err}</p>
        ) : null}

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5">
          {loading ? (
            <p className="py-12 text-center text-sm text-zinc-500">Loading library…</p>
          ) : files.length === 0 ? (
            <p className="rounded-xl border border-dashed border-zinc-700 py-12 text-center text-sm text-zinc-500">
              —
            </p>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              {files.map((url) => (
                <li key={url}>
                  <button
                    type="button"
                    onClick={() => select(url)}
                    className="group w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60 text-left ring-[var(--accent)] transition hover:border-[var(--accent)]/50 hover:ring-2 hover:ring-[var(--accent)]/25 focus-visible:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40"
                  >
                    <div className="relative aspect-[4/3] bg-black">
                      <Image
                        src={url}
                        alt=""
                        fill
                        className="object-cover transition group-hover:opacity-95"
                        sizes="(max-width:640px) 50vw, 200px"
                        unoptimized={isUploadedAsset(url)}
                      />
                    </div>
                    <p className="truncate px-2 py-2 font-mono text-[10px] text-zinc-500">
                      {url}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="shrink-0 border-t border-zinc-800 px-5 py-3 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border border-zinc-700 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800/80"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
