import type { ServicePageContent, ServiceRow, SiteSettings } from "@/lib/cms-types";
import { getServiceHrefMap } from "@/lib/service-pages";
import { telHref } from "@/lib/tel-href";
import { cleanSocialUrl, socialBrandColor, SocialMediaIcon } from "@/components/SocialMediaIcon";
import { FooterScrollToTop } from "@/components/FooterScrollToTop";
import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";
import { isUploadedAsset } from "@/lib/cms-types";

function IconMail({ className }: { className?: string }) {
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
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m21 7-9 6L3 7" />
    </svg>
  );
}

function IconPhone({ className }: { className?: string }) {
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
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function IconWhatsApp({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

export function SiteFooter({
  site,
  services = [],
  servicePages = [],
}: {
  site: SiteSettings;
  services?: ServiceRow[];
  servicePages?: ServicePageContent[];
}) {
  const brand = site.businessName.trim() || "Car Editing Studio";
  const socials = (site.socialLinks ?? [])
    .map((s) => ({ label: s.label.trim(), url: cleanSocialUrl(s.url) }))
    .filter((s) => s.label.length > 0 && s.url.length > 0);
  const email = site.email.trim();
  const hasWhatsApp = site.whatsappDial.trim().length > 0;
  const waHref = hasWhatsApp ? `https://wa.me/${site.whatsappDial.trim()}` : "";
  const officesWithPhone = (site.officeLocations ?? []).filter(
    (o) => o.label.trim() && o.phone.trim(),
  );
  const paymentMethods = (site.paymentMethods ?? []).filter(
    (m) => m.label.trim().length > 0,
  );
  const paymentDisplayMethods =
    paymentMethods.length > 0
      ? paymentMethods
      : [
          { label: "Mastercard", imageUrl: "" },
          { label: "Visa", imageUrl: "" },
          { label: "PayPal", imageUrl: "" },
          { label: "Bank", imageUrl: "" },
          { label: "Zelle", imageUrl: "" },
        ];
  const serviceHrefs = getServiceHrefMap(services, servicePages);

  return (
    <footer className="relative z-20 mt-auto overflow-hidden border-t border-white/10 bg-[radial-gradient(120%_140%_at_10%_0%,#121826_0%,#0b1020_40%,#080b16_100%)] text-white">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-12 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />
      <FooterScrollToTop />
      <div className="mx-auto w-full max-w-[88rem] px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand + hours + social */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" prefetch className="inline-flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/25 bg-white/10 text-sm font-bold tracking-tight text-white shadow-[0_8px_28px_-14px_rgba(255,255,255,0.8)]">
                CE
              </span>
              <span className="text-lg font-semibold tracking-tight">{brand}</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/78">
              Automotive photo editing for dealers, marketplaces, and creators.
            </p>
            <div className="mt-5">
              <Link
                href="/free-trial"
                prefetch
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-gradient-to-r from-[var(--accent)] to-[#ec8f62] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_30px_-16px_rgba(224,122,69,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:from-[var(--accent-hover)] hover:to-[#f5a37d] hover:shadow-[0_18px_34px_-16px_rgba(224,122,69,0.95)]"
              >
                Free trial
              </Link>
            </div>
            {socials.length > 0 ? (
              <ul className="mt-6 flex flex-wrap items-center gap-3 sm:gap-3.5 lg:gap-4">
                {socials.map((s) => (
                  <li key={`${s.label}-${s.url}`}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      title={s.label}
                      style={{ "--social-brand": socialBrandColor(s.label) } as CSSProperties}
                      className="inline-flex items-center justify-center text-white/80 transition-all duration-200 ease-in-out hover:scale-110 hover:text-[var(--social-brand)]"
                    >
                      <SocialMediaIcon label={s.label} size={20} />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {/* Phones — no addresses (maps live above) */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55">
              Call us
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              {officesWithPhone.map((o, i) => {
                const href = telHref(o.phone);
                return (
                  <li
                    key={`${o.label}-${i}`}
                    className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 backdrop-blur-sm transition-all duration-300 hover:border-white/25 hover:bg-white/[0.08]"
                  >
                    <p className="font-medium text-white/95">{o.label.trim()}</p>
                    {href ? (
                      <a
                        href={href}
                        className="mt-1 inline-flex items-center gap-2 text-[var(--accent)] transition hover:text-[var(--accent-hover)]"
                      >
                        <IconPhone className="shrink-0 opacity-90" />
                        {o.phone.trim()}
                      </a>
                    ) : (
                      <p className="mt-0.5 text-white/70">{o.phone.trim()}</p>
                    )}
                  </li>
                );
              })}
            </ul>
            {officesWithPhone.length === 0 ? (
              <p className="mt-4 text-sm text-white/55">
                Add office phone numbers in Settings — maps stay on the page above.
              </p>
            ) : null}
            <div className="mt-6 space-y-2 border-t border-white/10 pt-5">
              {email ? (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2 text-sm text-white/85 transition hover:text-white"
                >
                  <IconMail className="text-white/60" />
                  <span className="min-w-0 break-all">{email}</span>
                </a>
              ) : null}
              {hasWhatsApp ? (
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-white/85 transition hover:text-white"
                >
                  <IconWhatsApp className="text-[var(--accent)]" />
                  <span className="min-w-0 truncate">
                    {site.whatsappDisplay.trim() || site.whatsappDial.trim()}
                  </span>
                </a>
              ) : null}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55">
              Explore
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-white/80">
              <li>
                <Link prefetch href="/" className="group inline-flex items-center gap-1.5 transition hover:translate-x-1 hover:text-white">
                  <span className="opacity-0 -translate-x-1 text-[var(--accent)] transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0">{">"}</span>
                  Home
                </Link>
              </li>
              <li>
                <Link prefetch href="/about" className="group inline-flex items-center gap-1.5 transition hover:translate-x-1 hover:text-white">
                  <span className="opacity-0 -translate-x-1 text-[var(--accent)] transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0">{">"}</span>
                  About us
                </Link>
              </li>
              <li>
                <Link prefetch href="/portfolio" className="group inline-flex items-center gap-1.5 transition hover:translate-x-1 hover:text-white">
                  <span className="opacity-0 -translate-x-1 text-[var(--accent)] transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0">{">"}</span>
                  Portfolio
                </Link>
              </li>
              <li>
                <Link prefetch href="/contact" className="group inline-flex items-center gap-1.5 transition hover:translate-x-1 hover:text-white">
                  <span className="opacity-0 -translate-x-1 text-[var(--accent)] transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0">{">"}</span>
                  Contact
                </Link>
              </li>
              <li>
                <Link prefetch href="/services" className="group inline-flex items-center gap-1.5 transition hover:translate-x-1 hover:text-white">
                  <span className="opacity-0 -translate-x-1 text-[var(--accent)] transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0">{">"}</span>
                  Services
                </Link>
              </li>
              <li>
                <Link prefetch href="/pricing" className="group inline-flex items-center gap-1.5 transition hover:translate-x-1 hover:text-white">
                  <span className="opacity-0 -translate-x-1 text-[var(--accent)] transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0">{">"}</span>
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Services from CMS */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55">
              Services
            </p>
            {services.length === 0 ? (
              <p className="mt-4 text-sm text-white/55">—</p>
            ) : (
              <ul className="mt-4 space-y-2.5 text-sm text-white/80">
                {services.slice(0, 8).map((svc) => (
                  <li key={svc.id}>
                    <Link
                      prefetch
                      href={serviceHrefs.get(svc.id) ?? "/services"}
                      className="group inline-flex items-center gap-1.5 transition hover:translate-x-1 hover:text-white"
                    >
                      <span className="opacity-0 -translate-x-1 text-[var(--accent)] transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0">{">"}</span>
                      {svc.name.trim() || "Service"}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          {paymentDisplayMethods.map((method) => (
            <span
              key={method.label}
              className="flex h-10 w-24 shrink-0 flex-col justify-stretch rounded-lg border border-neutral-200/90 bg-white p-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#0f1538] shadow-[0_8px_20px_-14px_rgba(0,0,0,0.35)] transition-transform duration-300 hover:-translate-y-0.5"
            >
              {method.imageUrl ? (
                <span className="relative min-h-0 flex-1 w-full">
                  <Image
                    src={method.imageUrl}
                    alt={method.label}
                    fill
                    className="object-contain p-px"
                    sizes="96px"
                    unoptimized={isUploadedAsset(method.imageUrl)}
                  />
                </span>
              ) : (
                <span className="flex flex-1 items-center justify-center px-1 text-center leading-tight">
                  {method.label}
                </span>
              )}
            </span>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {brand}. All rights reserved.
          </p>
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-1" aria-label="Legal">
            <Link prefetch href="/contact" className="hover:text-white">
              Terms &amp; conditions
            </Link>
            <span className="hidden text-white/30 sm:inline" aria-hidden>
              |
            </span>
            <Link prefetch href="/contact" className="hover:text-white">
              Privacy policy
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
