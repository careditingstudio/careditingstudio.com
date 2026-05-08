import { ContactForm } from "@/components/forms/ContactForm";
import { readCms } from "@/lib/cms-store";
import { DEFAULT_OG_IMAGE, absoluteUrl } from "@/lib/seo";
import { telHref } from "@/lib/tel-href";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Car Editing Studio.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Car Editing Studio",
    description: "Get in touch with Car Editing Studio.",
    url: "/contact",
    type: "website",
    images: [{ url: DEFAULT_OG_IMAGE, alt: "Contact Car Editing Studio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Car Editing Studio",
    description: "Get in touch with Car Editing Studio.",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default async function ContactPage() {
  const cms = await readCms();
  const site = cms.site;
  const wa = `https://wa.me/${site.whatsappDial}`;
  const offices = (site.officeLocations ?? []).filter(
    (o) =>
      o.label.trim().length > 0 ||
      o.address.trim().length > 0 ||
      o.mapUrl.trim().length > 0 ||
      o.phone.trim().length > 0,
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            url: absoluteUrl("/contact"),
            name: "Contact Car Editing Studio",
          }),
        }}
      />
      <div className="mx-auto w-full max-w-[88rem] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto w-full max-w-[82rem]">
          <div className="mb-8 text-center sm:mb-10">
            <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
              Contact us
            </h1>
            <p className="mt-3 text-sm text-[var(--muted)] sm:text-base">
              Reach out to us if you have any problems and questions.
            </p>
          </div>
          <div className="grid w-full gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-start">
            <aside className="order-1 w-full space-y-4">
              <Link
                href="/schedule-meeting"
                prefetch
                className="group relative block overflow-hidden rounded-2xl border border-[var(--accent)]/30 bg-gradient-to-br from-[var(--accent)]/15 via-[color-mix(in_oklab,var(--background)_88%,white_12%)] to-[var(--background)] p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--accent)]/55"
              >
                <span
                  className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[var(--accent)]/25 blur-2xl"
                  aria-hidden
                />
                <div className="relative flex items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[var(--accent)]/20 text-[var(--accent)] ring-1 ring-[var(--accent)]/30">
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <rect x="3" y="5" width="18" height="16" rx="2.5" />
                      <path d="M16 3v4M8 3v4M3 11h18" />
                    </svg>
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                      Schedule a meeting
                    </p>
                    <p className="mt-1.5 text-sm font-semibold text-[var(--foreground)]">
                      Book a 1-on-1 with our team
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
                      Pick a date and time. We&apos;ll review your photos and
                      build a plan with you.
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)] transition group-hover:gap-2.5">
                      Open scheduler
                      <svg
                        viewBox="0 0 20 20"
                        fill="none"
                        aria-hidden
                        className="h-3.5 w-3.5"
                      >
                        <path
                          d="M4 10h10m0 0-3.5-3.5M14 10l-3.5 3.5"
                          stroke="currentColor"
                          strokeWidth="1.9"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>

              <a
                href={`mailto:${site.email}`}
                className="group block rounded-2xl border border-[var(--line)] bg-[var(--background)] p-6 shadow-sm transition hover:border-[var(--accent)]/35"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-2)]">
                  Email
                </p>
                <p className="mt-2 break-all text-sm font-semibold text-[var(--foreground)] transition group-hover:text-[var(--accent)]">
                  {site.email}
                </p>
              </a>
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-2xl border border-[var(--line)] bg-[var(--background)] p-6 shadow-sm transition hover:border-[var(--accent)]/35"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-2)]">
                  WhatsApp
                </p>
                <p className="mt-2 text-sm font-semibold text-[var(--foreground)] transition group-hover:text-[var(--accent)]">
                  {site.whatsappDisplay}
                </p>
              </a>

              {offices.length > 0 ? (
                <>
                  {offices.slice(0, 2).map((o, i) => {
                    const ph = telHref(o.phone);
                    return (
                      <div
                        key={`${o.label}-${i}`}
                        className="rounded-2xl border border-[var(--line)] bg-[var(--background)] p-6 shadow-sm"
                      >
                        <p className="text-sm font-semibold text-[var(--foreground)]">
                          {o.label.trim() || `Office ${i + 1}`}
                        </p>
                        {o.address.trim() ? (
                          <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                            {o.address.trim()}
                          </p>
                        ) : null}
                        {o.phone.trim() ? (
                          ph ? (
                            <a
                              href={ph}
                              className="mt-2 inline-flex text-sm font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)]"
                            >
                              {o.phone.trim()}
                            </a>
                          ) : (
                            <p className="mt-2 text-sm text-[var(--muted)]">{o.phone.trim()}</p>
                          )
                        ) : null}
                      </div>
                    );
                  })}
                </>
              ) : null}
            </aside>

            <div className="order-2">
              <ContactForm
                hideHeading
                className="mt-0"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
