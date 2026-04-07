import { InnerPageBody } from "@/components/InnerPageBody";
import { PageHeading } from "@/components/PageHeading";
import { ContactForm } from "@/components/forms/ContactForm";
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
        description="Send us your details and a message — we’ll reply by email or WhatsApp."
      />
      <InnerPageBody>
        <div className="grid gap-5 sm:grid-cols-2">
          <a
            href={`mailto:${siteConfig.email}`}
            className="group rounded-2xl border border-[var(--line)] bg-[var(--background)] p-6 shadow-sm transition hover:border-[var(--accent)]/35 hover:shadow-md"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-2)]">
              Email
            </p>
            <p className="mt-2 text-[var(--foreground)] transition group-hover:text-[var(--accent)]">
              {siteConfig.email}
            </p>
            <p className="mt-3 text-sm text-[var(--muted)]">
              Best for detailed requests and reference links.
            </p>
          </a>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl border border-[var(--line)] bg-[var(--background)] p-6 shadow-sm transition hover:border-[var(--accent)]/35 hover:shadow-md"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-2)]">
              WhatsApp
            </p>
            <p className="mt-2 text-[var(--foreground)] transition group-hover:text-[var(--accent)]">
              {siteConfig.whatsappDisplay}
            </p>
            <p className="mt-3 text-sm text-[var(--muted)]">
              Best for quick messages and fast replies.
            </p>
          </a>
        </div>

        <ContactForm />
      </InnerPageBody>
    </>
  );
}
