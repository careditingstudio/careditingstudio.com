import { PageHeading } from "@/components/PageHeading";
import { readCms } from "@/lib/cms-store";
import { DEFAULT_OG_IMAGE, absoluteUrl } from "@/lib/seo";
import { getResolvedServicePages } from "@/lib/service-pages";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services",
  description: "Automotive photo editing and retouching services.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Automotive Photo Editing Services",
    description: "Automotive photo editing and retouching services.",
    url: "/services",
    type: "website",
    images: [{ url: DEFAULT_OG_IMAGE, alt: "Car Editing Studio services" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Automotive Photo Editing Services",
    description: "Automotive photo editing and retouching services.",
    images: [DEFAULT_OG_IMAGE],
  },
};

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const cms = await readCms();
  const services = getResolvedServicePages(cms);
  const itemList = services.map((service, idx) => ({
    "@type": "ListItem",
    position: idx + 1,
    name: service.page.pageTitle || service.serviceName,
    url: absoluteUrl(`/services/${service.slug}`),
  }));
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "CollectionPage",
                name: "Services",
                url: absoluteUrl("/services"),
              },
              {
                "@type": "ItemList",
                itemListElement: itemList,
              },
            ],
          }),
        }}
      />
      <PageHeading
        title="Services"
        description="Cut-outs, color correction, background swaps, shadows, and campaign-ready assets — scoped to how you sell cars."
      />
      <div className="mx-auto max-w-[88rem] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-8 rounded-2xl border border-[var(--line)] bg-[var(--background)] p-4 sm:p-5">
          <p className="text-sm text-[var(--muted)]">
            Popular searches:{" "}
            <Link href="/car-photo-editing" className="font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]">
              car photo editing
            </Link>
            ,{" "}
            <Link href="/bike-photo-editing" className="font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]">
              bike photo editing
            </Link>
            ,{" "}
            <Link href="/bicycle-photo-editing" className="font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]">
              bicycle photo editing
            </Link>
            .
          </p>
        </div>
        {services.length === 0 ? (
          <p className="text-center text-[var(--muted)]">Services coming soon.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <li key={service.serviceId}>
                <Link
                  href={`/services/${service.slug}`}
                  className="block rounded-2xl border border-[var(--line)] bg-white/70 p-5 transition hover:-translate-y-0.5 hover:border-[var(--accent)]/40 hover:shadow-[0_16px_38px_-22px_rgba(0,0,0,0.45)] dark:bg-white/[0.03]"
                >
                  <p className="text-lg font-semibold text-[var(--foreground)]">
                    {service.page.pageTitle || service.serviceName}
                  </p>
                  <p className="mt-2 line-clamp-3 text-sm text-[var(--muted)]">
                    {service.page.pageDescription}
                  </p>
                  <span className="mt-4 inline-flex items-center text-sm font-semibold text-[var(--accent)]">
                    View service →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
