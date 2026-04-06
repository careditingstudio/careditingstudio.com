"use client";

import { adminUploadFile } from "@/components/admin/admin-upload";
import { fetchAdminUploadList } from "@/lib/admin-uploads-api";
import { isUploadedAsset } from "@/lib/cms-types";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export default function AdminLibraryPage() {
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await fetchAdminUploadList();
      setFiles(list);
      setMsg("");
    } catch {
      setMsg("Could not list files.");
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function remove(url: string) {
    if (!confirm("Delete?")) {
      return;
    }
    const r = await fetch("/api/admin/uploads", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
      credentials: "include",
    });
    if (!r.ok) {
      setMsg("Delete failed.");
      return;
    }
    setMsg("File removed.");
    void load();
    setTimeout(() => setMsg(""), 3000);
  }

  async function onPickFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setMsg("");
    try {
      await adminUploadFile(file);
      setMsg("Uploaded.");
      void load();
      setTimeout(() => setMsg(""), 5000);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <header className="border-b border-zinc-800/80 pb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Media library
        </h1>
      </header>

      <label className="mt-8 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/40 px-6 py-12 text-center transition hover:border-[var(--accent)]/45 hover:bg-zinc-900/60">
        <span className="text-sm font-medium text-zinc-200">
          {uploading ? "Uploading…" : "Upload image"}
        </span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif,image/*"
          disabled={uploading}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            void onPickFile(f);
          }}
        />
      </label>

      {msg ? (
        <p className="mt-6 text-sm text-zinc-400">{msg}</p>
      ) : null}

      {loading ? (
        <p className="mt-10 text-zinc-500">Loading…</p>
      ) : files.length === 0 ? (
        <p className="mt-10 rounded-xl border border-dashed border-zinc-700 p-8 text-center text-sm text-zinc-500">
          —
        </p>
      ) : (
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {files.map((url) => (
            <li
              key={url}
              className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50"
            >
              <div className="relative aspect-[4/3] bg-black">
                <Image
                  src={url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width:768px) 100vw, 33vw"
                  unoptimized={isUploadedAsset(url)}
                />
              </div>
              <div className="space-y-2 p-3">
                <p className="break-all font-mono text-[10px] text-zinc-500">
                  {url}
                </p>
                <button
                  type="button"
                  onClick={() => void remove(url)}
                  className="w-full rounded-lg border border-red-900/40 py-1.5 text-xs text-red-400 hover:bg-red-950/30"
                >
                  Delete file
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
