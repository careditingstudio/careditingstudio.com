import { PageHeading } from "@/components/PageHeading";
import { absoluteUrl, DEFAULT_OG_IMAGE } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Bicycle Photo Editing Services",
  description:
    "Professional bicycle photo editing for ecommerce catalogs and marketplace listings with clean backgrounds and balanced lighting.",
  alternates: {
    canonical: "/bicycle-photo-editing",
  },
  openGraph: {
    title: "Bicycle Photo Editing Services",
    description:
      "Professional bicycle photo editing for ecommerce catalogs and marketplace listings with clean backgrounds and balanced lighting.",
    url: "/bicycle-photo-editing",
    type: "website",
    images: [{ url: DEFAULT_OG_IMAGE, alt: "Bicycle photo editing services" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bicycle Photo Editing Services",
    description:
      "Professional bicycle photo editing for ecommerce catalogs and marketplace listings with clean backgrounds and balanced lighting.",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function BicyclePhotoEditingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Bicycle Photo Editing",
            serviceType: "Bicycle image retouching and cleanup",
            provider: {
              "@type": "Organization",
              name: "Car Editing Studio",
              url: absoluteUrl("/"),
            },
            areaServed: "Worldwide",
            url: absoluteUrl("/bicycle-photo-editing"),
          }),
        }}
      />
      <PageHeading
        title="Bicycle Photo Editing Services"
        description="Professional image cleanup and retouching for bicycle catalogs and product listings."
      />
      <div className="mx-auto max-w-[88rem] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-4 text-[var(--muted)]">
          <p>
            We edit bicycle photos for brands, distributors, and online stores. Services include background removal,
            dust and imperfection cleanup, color correction, and export-ready optimization for marketplaces.
          </p>
          <p>
            Browse our <Link href="/portfolio" className="text-[var(--accent)] hover:text-[var(--accent-hover)]">portfolio</Link>{" "}
            and <Link href="/services" className="text-[var(--accent)] hover:text-[var(--accent-hover)]">services</Link> to see how we handle different editing requirements.
          </p>
        </div>
      </div>
    </>
  );
}
