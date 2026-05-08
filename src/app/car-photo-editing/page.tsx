import { PageHeading } from "@/components/PageHeading";
import { absoluteUrl, DEFAULT_OG_IMAGE } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Car Photo Editing Services",
  description:
    "Professional car editing services for dealerships and marketplaces: background removal, retouching, shadow work, and color correction.",
  alternates: {
    canonical: "/car-photo-editing",
  },
  openGraph: {
    title: "Car Photo Editing Services",
    description:
      "Professional car editing services for dealerships and marketplaces: background removal, retouching, shadow work, and color correction.",
    url: "/car-photo-editing",
    type: "website",
    images: [{ url: DEFAULT_OG_IMAGE, alt: "Car photo editing services" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Car Photo Editing Services",
    description:
      "Professional car editing services for dealerships and marketplaces: background removal, retouching, shadow work, and color correction.",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function CarPhotoEditingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Car Photo Editing",
            serviceType: "Automotive photo editing",
            provider: {
              "@type": "Organization",
              name: "Car Editing Studio",
              url: absoluteUrl("/"),
            },
            areaServed: "Worldwide",
            url: absoluteUrl("/car-photo-editing"),
          }),
        }}
      />
      <PageHeading
        title="Car Photo Editing Services"
        description="Manual, detail-focused car editing for listings, ads, and social campaigns."
      />
      <div className="mx-auto max-w-[88rem] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-4 text-[var(--muted)]">
          <p>
            We provide professional car photo editing for dealerships, resellers, and automotive brands.
            Our workflow covers clipping paths, background replacement, paint cleanup, shadow creation,
            and color correction so your listings look clean and consistent.
          </p>
          <p>
            Need turnaround support for volume? Visit our full <Link href="/services" className="text-[var(--accent)] hover:text-[var(--accent-hover)]">services page</Link>{" "}
            or <Link href="/contact" className="text-[var(--accent)] hover:text-[var(--accent-hover)]">contact us</Link> for a custom workflow.
          </p>
        </div>
      </div>
    </>
  );
}
