import type { SiteSettings } from "@/lib/cms-types";
import Link from "next/link";

function cleanUrl(url: string): string {
  const u = url.trim();
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  return `https://${u}`;
}

function Icon({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      {children}
    </svg>
  );
}

function SocialIcon({ label }: { label: string }) {
  const k = label.trim().toLowerCase();
  if (k.includes("instagram")) {
    return (
      <Icon>
        <rect x="4" y="4" width="16" height="16" rx="4" />
        <circle cx="12" cy="12" r="3.5" />
        <path d="M16.5 7.5h.01" />
      </Icon>
    );
  }
  if (k.includes("facebook")) {
    return (
      <Icon>
        <path d="M14 8h3V5h-3c-2.2 0-4 1.8-4 4v3H7v3h3v7h3v-7h3l1-3h-4V9c0-.55.45-1 1-1Z" />
      </Icon>
    );
  }
  if (k.includes("linkedin")) {
    return (
      <Icon>
        <path d="M6 9v12" />
        <path d="M6 6.5a1.5 1.5 0 1 0 0-.01" />
        <path d="M10 9v12" />
        <path d="M10 14.5c0-3 4-3.25 4-0.5V21" />
        <path d="M14 14v7" />
        <path d="M10 9h4" />
      </Icon>
    );
  }
  if (k.includes("twitter") || k === "x" || k.includes("x (twitter)")) {
    return (
      <Icon>
        <path d="M4 4l16 16" />
        <path d="M20 4 4 20" />
      </Icon>
    );
  }
  if (k.includes("youtube")) {
    return (
      <Icon>
        <path d="M21 8s0-2-2-2H5C3 6 3 8 3 8v8s0 2 2 2h14c2 0 2-2 2-2V8Z" />
        <path d="M10 9.5 16 12l-6 2.5v-5Z" />
      </Icon>
    );
  }
  if (k.includes("tiktok")) {
    return (
      <Icon>
        <path d="M14 3v11.5a4.5 4.5 0 1 1-4-4.47" />
        <path d="M14 7c1.5 2 3 3 5 3" />
      </Icon>
    );
  }
  return (
    <Icon>
      <path d="M12 21s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    </Icon>
  );
}

function IconMail() {
  return (
    <Icon>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m21 7-9 6L3 7" />
    </Icon>
  );
}

function IconWhatsApp() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="currentColor"
      aria-hidden
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

export function SiteFooter({ site }: { site: SiteSettings }) {
  const socials = (site.socialLinks ?? [])
    .map((s) => ({ label: s.label.trim(), url: cleanUrl(s.url) }))
    .filter((s) => s.label.length > 0 && s.url.length > 0);
  const email = site.email.trim();
  const hasWhatsApp = site.whatsappDial.trim().length > 0;
  const waHref = hasWhatsApp ? `https://wa.me/${site.whatsappDial.trim()}` : "";

  return (
    <footer className="relative z-20 mt-auto border-t border-[var(--line)] bg-[var(--background)]">
      <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Brand / contact */}
          <div className="md:col-span-5">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--accent)]/15 text-[var(--accent)] ring-1 ring-[var(--accent)]/25">
                <span className="text-sm font-semibold">CE</span>
              </span>
              <span className="text-base font-semibold tracking-tight text-[var(--foreground)]">
                Car Editing Studio
              </span>
            </Link>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--muted)]">
              Automotive photo editing, retouching, and visual services for dealers,
              brands, and creators.
            </p>

            <div className="mt-5">
              <Link
                href="/free-trial"
                className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--accent-hover)]"
              >
                Get a free trial
              </Link>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {email ? (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2 rounded-xl border border-[var(--line)] bg-white/[0.02] px-4 py-3 text-sm text-[var(--foreground)] transition hover:border-[var(--accent)]/30"
                >
                  <span className="text-[var(--muted)]">
                    <IconMail />
                  </span>
                  <span className="min-w-0 truncate">{email}</span>
                </a>
              ) : null}
              {hasWhatsApp ? (
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl border border-[var(--line)] bg-white/[0.02] px-4 py-3 text-sm text-[var(--foreground)] transition hover:border-[var(--accent)]/30"
                >
                  <span className="text-[var(--accent)]">
                    <IconWhatsApp />
                  </span>
                  <span className="min-w-0 truncate">
                    {site.whatsappDisplay.trim() || site.whatsappDial.trim()}
                  </span>
                </a>
              ) : null}
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-2)]">
              Information
            </p>
            <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
              <li>
                <Link className="hover:text-[var(--foreground)]" href="/services">
                  Services
                </Link>
              </li>
              <li>
                <Link className="hover:text-[var(--foreground)]" href="/pricing">
                  Pricing
                </Link>
              </li>
              <li>
                <Link className="hover:text-[var(--foreground)]" href="/portfolio">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link className="hover:text-[var(--foreground)]" href="/about">
                  About us
                </Link>
              </li>
              <li>
                <Link className="hover:text-[var(--foreground)]" href="/contact">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="md:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-2)]">
              Social
            </p>
            {socials.length === 0 ? (
              <p className="mt-4 text-sm text-[var(--muted)]">—</p>
            ) : (
              <ul className="mt-4 flex flex-wrap gap-2">
                {socials.map((s) => (
                  <li key={`${s.label}-${s.url}`}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      title={s.label}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-[var(--foreground)]/75 transition hover:border-[var(--accent)]/35 hover:bg-white/[0.06] hover:text-[var(--accent)]"
                    >
                      <SocialIcon label={s.label} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/[0.06] pt-6 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Car Editing Studio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

