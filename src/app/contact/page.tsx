import { InnerPageBody } from "@/components/InnerPageBody";
import { PageHeading } from "@/components/PageHeading";
import { ContactForm } from "@/components/forms/ContactForm";
import { readCms } from "@/lib/cms-store";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Car Editing Studio.",
};

export default async function ContactPage() {
  const cms = await readCms();
  const site = cms.site;
  const wa = `https://wa.me/${site.whatsappDial}`;
  const offices = (site.officeLocations ?? []).filter(
    (o) => o.label.trim().length > 0 || o.address.trim().length > 0,
  );

  return (
    <>
      <PageHeading
        title="Contact Us"
        description="Send a message and we’ll reply by email or WhatsApp."
      />
      <InnerPageBody>
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[1.35fr,0.65fr] lg:items-start">
            <div className="order-2 lg:order-1">
              <ContactForm
                hideHeading
                className="mt-0"
              />
            </div>

            <aside className="order-1 space-y-4 lg:order-2 lg:sticky lg:top-24">
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
                <div className="rounded-2xl border border-[var(--line)] bg-[var(--background)] p-6 shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-2)]">
                    Offices
                  </p>
                  <div className="mt-4 space-y-4">
                    {offices.slice(0, 2).map((o, i) => (
                      <div key={`${o.label}-${i}`} className="space-y-1">
                        <p className="text-sm font-semibold text-[var(--foreground)]">
                          {o.label.trim() || `Office ${i + 1}`}
                        </p>
                        {o.address.trim() ? (
                          <p className="text-sm leading-relaxed text-[var(--muted)]">
                            {o.address.trim()}
                          </p>
                        ) : null}
                        {o.mapUrl.trim() ? (
                          <a
                            href={o.mapUrl.trim()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex text-xs font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)]"
                          >
                            View on map →
                          </a>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </aside>
          </div>
        </div>
      </InnerPageBody>
    </>
  );
}
