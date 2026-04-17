import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { InnerPageBody } from "@/components/InnerPageBody";
import { PageHeading } from "@/components/PageHeading";
import { readCms } from "@/lib/cms-store";
import { getResolvedServicePages } from "@/lib/service-pages";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cms = await readCms();
  const page = getResolvedServicePages(cms).find((row) => row.slug === slug);
  if (!page) {
    return {
      title: "Service",
      description: "Automotive photo editing service details.",
    };
  }
  return {
    title: page.page.pageTitle || page.serviceName,
    description: page.page.pageDescription || "Automotive photo editing service details.",
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const cms = await readCms();
  const page = getResolvedServicePages(cms).find((row) => row.slug === slug);
  if (!page) notFound();

  return (
    <>
      <PageHeading
        title={page.page.pageTitle || page.serviceName}
        description={page.page.pageDescription}
      />
      <InnerPageBody>
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-[var(--foreground)]">
            {page.page.introTitle}
          </h2>
          <p className="text-[var(--muted)]">{page.page.introBody}</p>
        </section>

        <section className="space-y-6">
          <h3 className="text-xl font-semibold text-[var(--foreground)]">
            {page.page.portfolioTitle}
          </h3>
          {page.portfolioItems.length === 0 ? (
            <p className="text-[var(--muted)]">
              Portfolio samples for this service will be added soon.
            </p>
          ) : (
            <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {page.portfolioItems.map((item, idx) => (
                <li key={`${item.before}-${item.after}-${idx}`}>
                  <BeforeAfterSlider
                    layout="portfolio"
                    beforeSrc={item.before}
                    afterSrc={item.after}
                    beforeAlt={item.beforeAlt}
                    afterAlt={item.afterAlt}
                    priority={idx < 4}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </InnerPageBody>
    </>
  );
}
