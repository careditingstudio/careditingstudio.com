import { PageHeading } from "@/components/PageHeading";
import { readCms } from "@/lib/cms-store";
import { getResolvedServicePages } from "@/lib/service-pages";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services",
  description: "Automotive photo editing and retouching services.",
};

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const cms = await readCms();
  const services = getResolvedServicePages(cms);
  return (
    <>
      <PageHeading
        title="Services"
        description="Cut-outs, color correction, background swaps, shadows, and campaign-ready assets — scoped to how you sell cars."
      />
      <div className="mx-auto max-w-[88rem] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
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
