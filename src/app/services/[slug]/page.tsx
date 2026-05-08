import { InnerPageBody } from "@/components/InnerPageBody";
import { ServicePageBody } from "@/components/ServicePageBody";
import { ServicePageHero } from "@/components/ServicePageHero";
import { readCms } from "@/lib/cms-store";
import { DEFAULT_OG_IMAGE, absoluteUrl } from "@/lib/seo";
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
      robots: { index: false, follow: false },
    };
  }
  const title = page.page.pageTitle || page.serviceName;
  const description = page.page.pageDescription || "Automotive photo editing service details.";
  const canonical = `/services/${page.slug}`;
  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      images: [{ url: DEFAULT_OG_IMAGE, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const cms = await readCms();
  const page = getResolvedServicePages(cms).find((row) => row.slug === slug);
  if (!page) notFound();
  const faqItems = page.page.faqSection.items
    .filter((item) => item.question.trim().length > 0 && item.answer.trim().length > 0)
    .map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    }));
  const pageTitle = page.page.pageTitle || page.serviceName;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Home",
                    item: absoluteUrl("/"),
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "Services",
                    item: absoluteUrl("/services"),
                  },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: pageTitle,
                    item: absoluteUrl(`/services/${page.slug}`),
                  },
                ],
              },
              {
                "@type": "Service",
                name: pageTitle,
                description: page.page.pageDescription,
                provider: {
                  "@type": "Organization",
                  name: "Car Editing Studio",
                  url: absoluteUrl("/"),
                },
                areaServed: "Worldwide",
                url: absoluteUrl(`/services/${page.slug}`),
              },
              ...(faqItems.length > 0
                ? [
                    {
                      "@type": "FAQPage",
                      mainEntity: faqItems,
                    },
                  ]
                : []),
            ],
          }),
        }}
      />
      <ServicePageHero
        title={pageTitle}
        description={page.page.pageDescription}
        bannerSrc={page.page.heroBannerSrc}
      />
      <InnerPageBody contentClassName="max-w-[88rem] space-y-0 text-base leading-relaxed">
        <ServicePageBody page={page.page} portfolioItems={page.portfolioItems} />
      </InnerPageBody>
    </>
  );
}
