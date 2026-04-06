import type { SiteSettings } from "@/lib/cms-types";
import Link from "next/link";

function cleanUrl(url: string): string {
  const u = url.trim();
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  return `https://${u}`;
}

export function SiteFooter({ site }: { site: SiteSettings }) {
  const socials = (site.socialLinks ?? [])
    .map((s) => ({ label: s.label.trim(), url: cleanUrl(s.url) }))
    .filter((s) => s.label.length > 0 && s.url.length > 0);

  return (
    <footer className="mt-auto border-t border-white/[0.06] bg-black/10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-10 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold tracking-tight text-[var(--foreground)]">
              Car Editing Studio
            </p>
            <p className="max-w-lg text-sm text-[var(--muted)]">
              Automotive photo editing, retouching, and visual services for dealers,
              brands, and creators.
            </p>
          </div>

          {socials.length > 0 ? (
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                Social
              </p>
              <ul className="flex flex-wrap gap-2.5">
                {socials.map((s) => (
                  <li key={`${s.label}-${s.url}`}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] transition hover:border-[var(--accent)]/35 hover:bg-white/[0.06]"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 border-t border-white/[0.06] pt-6 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Car Editing Studio. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <Link className="hover:text-[var(--foreground)]" href="/services">
              Services
            </Link>
            <Link className="hover:text-[var(--foreground)]" href="/pricing">
              Pricing
            </Link>
            <Link className="hover:text-[var(--foreground)]" href="/portfolio">
              Portfolio
            </Link>
            <Link className="hover:text-[var(--foreground)]" href="/contact">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

