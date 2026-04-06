"use client";

import { useAdminCms } from "@/components/admin/AdminCmsContext";
import { ADMIN_PAGE_NAV } from "@/config/admin-pages";
import Link from "next/link";

function IconHome(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-10.5Z" />
    </svg>
  );
}

function IconDoc(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
  );
}

function IconImage(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  );
}

function IconGlobe(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
    </svg>
  );
}

function IconFolder(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2v11Z" />
    </svg>
  );
}

function pageIcon(slug: string) {
  if (slug === "home") return IconHome;
  if (slug === "portfolio") return IconImage;
  return IconDoc;
}

export function AdminDashboard() {
  const { cms } = useAdminCms();
  if (!cms) return null;

  return (
    <div className="mx-auto max-w-5xl pb-8">
      <h2 className="mt-12 text-sm font-semibold uppercase tracking-wider text-zinc-500">
        Pages
      </h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ADMIN_PAGE_NAV.map((c) => {
          const slug = c.href.replace("/editor/", "");
          const Icon = pageIcon(slug);
          return (
            <li key={c.href}>
              <Link
                href={c.href}
                className="group flex h-full flex-col rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 shadow-sm transition hover:border-[var(--accent)]/40 hover:bg-zinc-900 hover:shadow-md hover:shadow-black/20"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-800/80 text-[var(--accent)] ring-1 ring-zinc-700/80 transition group-hover:bg-[var(--accent)]/15 group-hover:ring-[var(--accent)]/30">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-white group-hover:text-[var(--accent)]">
                  {c.label}
                </h3>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent)]">
                  Open
                  <span className="transition group-hover:translate-x-0.5" aria-hidden>
                    →
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <h2 className="mt-14 text-sm font-semibold uppercase tracking-wider text-zinc-500">
        Global
      </h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2">
        <li>
          <Link
            href="/admin-panel/site"
            className="group flex items-start gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 transition hover:border-zinc-600 hover:bg-zinc-900/70"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-800/80 text-sky-400 ring-1 ring-zinc-700/80">
              <IconGlobe className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h3 className="font-semibold text-white">Site-wide</h3>
            </div>
          </Link>
        </li>
        <li>
          <Link
            href="/admin-panel/library"
            className="group flex items-start gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 transition hover:border-zinc-600 hover:bg-zinc-900/70"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-800/80 text-amber-400/90 ring-1 ring-zinc-700/80">
              <IconFolder className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h3 className="font-semibold text-white">Upload library</h3>
            </div>
          </Link>
        </li>
      </ul>
    </div>
  );
}
