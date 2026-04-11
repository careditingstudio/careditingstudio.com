import type { SiteSettings } from "@/lib/cms-types";
import { cleanSocialUrl, SocialMediaIcon } from "@/components/SocialMediaIcon";
import Link from "next/link";

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
    .map((s) => ({ label: s.label.trim(), url: cleanSocialUrl(s.url) }))
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
                      <SocialMediaIcon label={s.label} />
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

