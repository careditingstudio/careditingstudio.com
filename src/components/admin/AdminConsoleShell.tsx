"use client";

import { AdminCmsProvider, useAdminCms } from "@/components/admin/AdminCmsContext";
import { ADMIN_PAGE_NAV } from "@/config/admin-pages";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

const DASH = { href: "/admin-panel", label: "Dashboard" } as const;
const SITE_LINK = { href: "/admin-panel/settings", label: "Settings" } as const;
const LIBRARY = { href: "/admin-panel/library", label: "Upload library" } as const;
const MAILBOX = { href: "/admin-panel/mailbox", label: "Mailbox" } as const;

function normPath(p: string) {
  return p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p;
}

function pathActive(pathname: string, href: string) {
  const p = normPath(pathname);
  const h = normPath(href);
  if (h === "/admin-panel") {
    return p === "/admin-panel" || p === "/";
  }
  return p === h;
}

function AdminChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [publicSiteUrl, setPublicSiteUrl] = useState("");
  const { cms, loading, loadError, saving, flash, save, refresh } = useAdminCms();
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const { protocol, hostname, port } = window.location;
    const h = hostname.replace(/^admin\./i, "");
    const p = port ? `:${port}` : "";
    setPublicSiteUrl(`${protocol}//${h}${p}/`);
  }, []);

  if (loadError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
        <p className="text-red-400">{loadError}</p>
        <button
          type="button"
          onClick={() => refresh()}
          className="rounded-lg bg-zinc-800 px-4 py-2 text-sm text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  if (loading || !cms) {
    return (
      <div className="flex min-h-screen items-center justify-center text-zinc-500">
        Loading admin…
      </div>
    );
  }

  async function logout() {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    } finally {
      window.location.href = "/admin-panel/login";
    }
  }

  return (
    <div className="flex min-h-screen">
      <aside className="fixed bottom-0 left-0 top-0 z-40 flex w-[15.5rem] flex-col border-r border-zinc-800/80 bg-zinc-950 sm:w-64">
        <div className="border-b border-zinc-800/80 px-4 py-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            CMS
          </p>
          <p className="mt-1 font-semibold tracking-tight text-white">Control panel</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          <Link
            href={DASH.href}
            className={[
              "rounded-lg px-3 py-2.5 transition-colors",
              pathActive(pathname, DASH.href)
                ? "bg-[var(--accent)]/15 text-white ring-1 ring-[var(--accent)]/35"
                : "text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-100",
            ].join(" ")}
          >
            <span className="block text-sm font-medium">{DASH.label}</span>
          </Link>

          <p className="px-3 pb-0.5 pt-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
            Public pages
          </p>
          {ADMIN_PAGE_NAV.map((item) => {
            const on = pathActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "rounded-lg px-3 py-2.5 transition-colors",
                  on
                    ? "bg-[var(--accent)]/15 text-white ring-1 ring-[var(--accent)]/35"
                    : "text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-100",
                ].join(" ")}
              >
                <span className="block text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}

          <p className="px-3 pb-0.5 pt-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
            More
          </p>
          {[SITE_LINK, LIBRARY, MAILBOX].map((item) => {
            const on = pathActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "rounded-lg px-3 py-2.5 transition-colors",
                  on
                    ? "bg-[var(--accent)]/15 text-white ring-1 ring-[var(--accent)]/35"
                    : "text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-100",
                ].join(" ")}
              >
                <span className="block text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-zinc-800 p-3 space-y-2">
          {publicSiteUrl ? (
            <a
              href={publicSiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center rounded-lg border border-zinc-700 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
            >
              View public site
            </a>
          ) : (
            <span className="block py-2 text-center text-xs text-zinc-600">…</span>
          )}
          <button
            type="button"
            onClick={() => void logout()}
            disabled={loggingOut}
            className="flex w-full items-center justify-center rounded-lg border border-zinc-700 py-2 text-sm text-zinc-300 hover:bg-zinc-800 disabled:opacity-60"
          >
            {loggingOut ? "Logging out…" : "Logout"}
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col pl-[15.5rem] sm:pl-64">
        {flash ? (
          <div
            className={[
              "sticky top-0 z-30 border-b px-4 py-3 text-center text-sm sm:px-8",
              flash.type === "ok"
                ? "border-emerald-800/60 bg-emerald-950/90 text-emerald-200"
                : "border-red-900/60 bg-red-950/90 text-red-200",
            ].join(" ")}
          >
            {flash.text}
          </div>
        ) : null}

        <main className="flex-1 px-4 pb-28 pt-6 sm:px-10 sm:pb-24 sm:pt-9">
          {children}
        </main>

        <footer className="fixed bottom-0 right-0 z-30 flex items-center justify-end gap-3 border-t border-zinc-800/80 bg-zinc-950/95 px-4 py-3 backdrop-blur-md sm:left-64 sm:px-10">
          {cms.updatedAt ? (
            <p className="mr-auto hidden text-xs text-zinc-500 sm:block">
              {new Date(cms.updatedAt).toLocaleString()}
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => void save()}
            disabled={saving}
            className="rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:bg-[var(--accent-hover)] disabled:opacity-50"
          >
            {saving ? "Publishing…" : "Publish"}
          </button>
        </footer>
      </div>
    </div>
  );
}

export function AdminConsoleShell({ children }: { children: ReactNode }) {
  return (
    <AdminCmsProvider>
      <AdminChrome>{children}</AdminChrome>
    </AdminCmsProvider>
  );
}
