import { DEFAULT_OG_IMAGE, absoluteUrl } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How Car Editing Studio handles information you share with us.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy policy — Car Editing Studio",
    description: "How Car Editing Studio handles information you share with us.",
    url: "/privacy",
    type: "website",
    images: [{ url: DEFAULT_OG_IMAGE, alt: "Car Editing Studio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy policy — Car Editing Studio",
    description: "How Car Editing Studio handles information you share with us.",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function PrivacyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Privacy policy",
            url: absoluteUrl("/privacy"),
          }),
        }}
      />
      <div className="mx-auto max-w-[88rem] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <article className="mx-auto max-w-xl">
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
            Privacy policy
          </h1>
          <p className="mt-1 text-xs text-[var(--muted-2)]">Last updated 11 May 2026</p>

          <div className="mt-8 space-y-4 text-sm leading-relaxed text-[var(--muted)]">
            <p>
              We collect details you give us (for example in contact or order forms) so we can reply
              and provide our services.
            </p>
            <p>We do not sell your personal information.</p>
            <p>
              Like most sites, our hosting may keep basic technical logs to run the site safely.
            </p>
            <p>
              For privacy questions,{" "}
              <Link href="/contact" className="font-medium text-[var(--accent)] hover:underline">
                contact us
              </Link>
              .
            </p>
          </div>
        </article>
      </div>
    </>
  );
}
