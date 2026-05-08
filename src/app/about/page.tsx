import type { Metadata } from "next";
import { AboutUsContent } from "@/components/about/AboutUsContent";
import { DEFAULT_OG_IMAGE, SITE_URL, absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About Car Editing Studio",
  description:
    "Learn about Car Editing Studio: car photo editing, automotive retouching, and ecommerce-ready vehicle imagery built for dealers, marketplaces, and creators.",
  keywords: [
    "car photo editing",
    "automotive retouching",
    "vehicle image editing",
    "car dealership photo editing",
    "ecommerce car images",
    "background removal",
    "color correction",
    "compositing",
    "Bangladesh photo editing",
  ],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Car Editing Studio",
    description:
      "Car photo editing and automotive retouching for dealers, ecommerce stores, marketplaces, and creators.",
    type: "website",
    url: "/about",
    images: [{ url: DEFAULT_OG_IMAGE, alt: "About Car Editing Studio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Car Editing Studio",
    description:
      "Car photo editing and automotive retouching for dealers, ecommerce stores, marketplaces, and creators.",
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebPage",
                name: "About Car Editing Studio",
                description:
                  "Learn about Car Editing Studio: car photo editing, automotive retouching, and ecommerce-ready vehicle imagery built for dealers, marketplaces, and creators.",
                url: absoluteUrl("/about"),
                isPartOf: {
                  "@type": "WebSite",
                  name: "Car Editing Studio",
                  url: `${SITE_URL}/`,
                },
              },
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
                    name: "About",
                    item: absoluteUrl("/about"),
                  },
                ],
              },
            ],
          }),
        }}
      />
      <AboutUsContent />
    </>
  );
}
