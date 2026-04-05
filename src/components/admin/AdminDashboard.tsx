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
      <header className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 px-6 py-8 sm:px-10 sm:py-10">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--accent)]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-violet-500/5 blur-3xl" />
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Admin
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Site dashboard
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-400">
          Choose a page below to customize what visitors see.{" "}
          <span className="text-zinc-300">Home</span> includes hero banners, the
          floating car image, and before/after sections. Use{" "}
          <span className="font-medium text-zinc-200">Publish changes</span> when
          you are finished.
        </p>
        {cms.updatedAt ? (
          <p className="mt-5 text-xs text-zinc-500">
            Last published{" "}
            <time dateTime={cms.updatedAt} className="text-zinc-400">
              {new Date(cms.updatedAt).toLocaleString()}
            </time>
          </p>
        ) : (
          <p className="mt-5 text-xs text-amber-200/80">
            Nothing published from this panel yet — edit a page, then publish.
          </p>
        )}
      </header>

      <h2 className="mt-12 text-sm font-semibold uppercase tracking-wider text-zinc-500">
        Pages
      </h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ADMIN_PAGE_NAV.map((c) => {
          const slug = c.href.replace("/editor/", "");
          const Icon = pageIcon(slug);
          const isHome = slug === "home";
          return (
            <li key={c.href}>
              <Link
                href={c.href}
                className="group flex h-full flex-col rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 shadow-sm transition hover:border-[var(--accent)]/40 hover:bg-zinc-900 hover:shadow-md hover:shadow-black/20"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-800/80 text-[var(--accent)] ring-1 ring-zinc-700/80 transition group-hover:bg-[var(--accent)]/15 group-hover:ring-[var(--accent)]/30">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  {isHome ? (
                    <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-400">
                      Full editor
                    </span>
                  ) : (
                    <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-500">
                      Coming soon
                    </span>
                  )}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white group-hover:text-[var(--accent)]">
                  {c.label}
                </h3>
                <p className="mt-1 font-mono text-[11px] text-zinc-500">{c.publicPath}</p>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-500">
                  {c.hint}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent)]">
                  {isHome ? "Customize home" : "Open page"}
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
              <p className="mt-1 text-sm text-zinc-500">
                Header, announcement bar, domain label on the hero
              </p>
              <span className="mt-3 inline-block text-sm font-medium text-sky-400 group-hover:underline">
                Edit site settings →
              </span>
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
              <p className="mt-1 text-sm text-zinc-500">
                Files stored under <span className="font-mono text-zinc-400">/cms/uploads</span>
              </p>
              <span className="mt-3 inline-block text-sm font-medium text-amber-400/90 group-hover:underline">
                Manage uploads →
              </span>
            </div>
          </Link>
        </li>
      </ul>
    </div>
  );
}
