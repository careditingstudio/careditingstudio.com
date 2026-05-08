import { PageHeading } from "@/components/PageHeading";
import { absoluteUrl, DEFAULT_OG_IMAGE } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Bike Photo Editing Services",
  description:
    "Professional bike photo editing services for motorcycles and scooters, including background removal, retouching, and color enhancement.",
  alternates: {
    canonical: "/bike-photo-editing",
  },
  openGraph: {
    title: "Bike Photo Editing Services",
    description:
      "Professional bike photo editing services for motorcycles and scooters, including background removal, retouching, and color enhancement.",
    url: "/bike-photo-editing",
    type: "website",
    images: [{ url: DEFAULT_OG_IMAGE, alt: "Bike photo editing services" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bike Photo Editing Services",
    description:
      "Professional bike photo editing services for motorcycles and scooters, including background removal, retouching, and color enhancement.",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function BikePhotoEditingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Bike Photo Editing",
            serviceType: "Motorcycle and bike image editing",
            provider: {
              "@type": "Organization",
              name: "Car Editing Studio",
              url: absoluteUrl("/"),
            },
            areaServed: "Worldwide",
            url: absoluteUrl("/bike-photo-editing"),
          }),
        }}
      />
      <PageHeading
        title="Bike Photo Editing Services"
        description="Clean, conversion-focused editing for motorcycles, scooters, and bike listings."
      />
      <div className="mx-auto max-w-[88rem] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-4 text-[var(--muted)]">
          <p>
            Our bike editing workflow improves motorcycle and scooter images for ecommerce and marketplaces.
            We handle background cleanup, color balancing, reflection and shadow control, and final export tuning.
          </p>
          <p>
            Explore all editing options on <Link href="/services" className="text-[var(--accent)] hover:text-[var(--accent-hover)]">services</Link>{" "}
            or send your sample images through <Link href="/free-trial" className="text-[var(--accent)] hover:text-[var(--accent-hover)]">free trial</Link>.
          </p>
        </div>
      </div>
    </>
  );
}
