import { InnerPageBody } from "@/components/InnerPageBody";
import { PageHeading } from "@/components/PageHeading";
import { ServicePageBody } from "@/components/ServicePageBody";
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
      <InnerPageBody contentClassName="max-w-[88rem] space-y-0 text-base leading-relaxed">
        <ServicePageBody page={page.page} portfolioItems={page.portfolioItems} />
      </InnerPageBody>
    </>
  );
}
