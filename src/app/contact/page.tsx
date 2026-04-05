import { InnerPageBody } from "@/components/InnerPageBody";
import { PageHeading } from "@/components/PageHeading";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Car Editing Studio.",
};

export default function ContactPage() {
  const wa = `https://wa.me/${siteConfig.whatsappDial}`;

  return (
    <>
      <PageHeading
        title="Contact Us"
        description="Reach us by email or WhatsApp — a form can be added here later."
      />
      <InnerPageBody>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
          <a
            href={`mailto:${siteConfig.email}`}
            className="group rounded-xl border border-[var(--line)] bg-[var(--background)] p-6 transition hover:border-[var(--accent)]/35 hover:shadow-sm"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-2)]">
              Email
            </p>
            <p className="mt-2 text-[var(--foreground)] transition group-hover:text-[var(--accent)]">
              {siteConfig.email}
            </p>
          </a>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-xl border border-[var(--line)] bg-[var(--background)] p-6 transition hover:border-[var(--accent)]/35 hover:shadow-sm"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-2)]">
              WhatsApp
            </p>
            <p className="mt-2 text-[var(--foreground)] transition group-hover:text-[var(--accent)]">
              {siteConfig.whatsappDisplay}
            </p>
          </a>
        </div>
      </InnerPageBody>
    </>
  );
}
