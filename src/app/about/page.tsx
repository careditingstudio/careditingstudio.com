import type { Metadata } from "next";
import { headers } from "next/headers";
import { AboutUsContent } from "@/components/about/AboutUsContent";

function metadataBaseFromHeaders(h: Headers): URL {
  const host =
    h.get("x-forwarded-host")?.split(",")[0]?.trim() ??
    h.get("host") ??
    "careditingstudio.com";
  const isLocal =
    host.startsWith("localhost") ||
    host.startsWith("127.0.0.1") ||
    host.startsWith("[::1]");
  const proto =
    h.get("x-forwarded-proto")?.split(",")[0]?.trim() ??
    (isLocal ? "http" : "https");
  return new URL(`${proto}://${host}`);
}

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
  },
  twitter: {
    card: "summary_large_image",
    title: "About Car Editing Studio",
    description:
      "Car photo editing and automotive retouching for dealers, ecommerce stores, marketplaces, and creators.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function AboutPage() {
  const h = await headers();
  const metadataBase = metadataBaseFromHeaders(h);
  const canonicalUrl = new URL("/about", metadataBase).toString();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "About Car Editing Studio",
            description:
              "Learn about Car Editing Studio: car photo editing, automotive retouching, and ecommerce-ready vehicle imagery built for dealers, marketplaces, and creators.",
            url: canonicalUrl,
            isPartOf: {
              "@type": "WebSite",
              name: "Car Editing Studio",
              url: metadataBase.toString().endsWith("/")
                ? metadataBase.toString()
                : `${metadataBase.toString()}/`,
            },
            about: [
              "car photo editing",
              "automotive retouching",
              "vehicle image editing",
              "ecommerce-ready car images",
              "background removal",
              "color correction",
              "compositing",
            ],
          }),
        }}
      />
      <AboutUsContent />
    </>
  );
}
