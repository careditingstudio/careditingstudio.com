import { ContactForm } from "@/components/forms/ContactForm";
import { ScheduleMeetingPromoCard } from "@/components/ScheduleMeetingPromoCard";
import { readCms } from "@/lib/cms-store";
import { getVisitorShellMessages } from "@/i18n/visitor-shell";
import { getPublicVisitorState } from "@/lib/public-visitor";
import { DEFAULT_OG_IMAGE, absoluteUrl } from "@/lib/seo";
import { telHref } from "@/lib/tel-href";
import type { Metadata } from "next";

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
  const visitor = await getPublicVisitorState();
  const shell = getVisitorShellMessages(visitor.locale);
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
              {shell.pages.contactTitle}
            </h1>
            <p className="mt-3 text-sm text-[var(--muted)] sm:text-base">
              {shell.pages.contactSubtitle}
            </p>
          </div>
          <div className="grid w-full gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-start">
            <aside className="order-1 w-full space-y-4">
              <ScheduleMeetingPromoCard
                eyebrow={shell.pages.contactScheduleEyebrow}
                title={shell.pages.contactScheduleTitle}
                body={shell.pages.contactScheduleBody}
                ctaLabel={shell.pages.contactOpenScheduler}
              />

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
                forms={shell.forms}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
