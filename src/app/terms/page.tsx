import { DEFAULT_OG_IMAGE, absoluteUrl } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & conditions",
  description: "Short terms for using Car Editing Studio and our services.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms & conditions — Car Editing Studio",
    description: "Short terms for using Car Editing Studio and our services.",
    url: "/terms",
    type: "website",
    images: [{ url: DEFAULT_OG_IMAGE, alt: "Car Editing Studio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms & conditions — Car Editing Studio",
    description: "Short terms for using Car Editing Studio and our services.",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function TermsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Terms & conditions",
            url: absoluteUrl("/terms"),
          }),
        }}
      />
      <div className="mx-auto max-w-[88rem] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <article className="mx-auto max-w-xl">
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
            Terms & conditions
          </h1>
          <p className="mt-1 text-xs text-[var(--muted-2)]">Last updated 11 May 2026</p>

          <div className="mt-8 space-y-4 text-sm leading-relaxed text-[var(--muted)]">
            <p>
              By using this website you agree to these terms. If you do not agree, please do not use
              the site.
            </p>
            <p>
              Our editing work follows what we agree with you for each order (scope, files, and
              price). You confirm you have the rights to send us the images we edit.
            </p>
            <p>
              We may change this page from time to time. The version here is the one that applies.
            </p>
            <p>
              Questions?{" "}
              <Link href="/contact" className="font-medium text-[var(--accent)] hover:underline">
                Contact us
              </Link>
              .
            </p>
          </div>
        </article>
      </div>
    </>
  );
}
