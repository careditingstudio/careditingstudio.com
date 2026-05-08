import { PublicHomePage } from "@/components/PublicHomePage";
import { AdminPortalRoot } from "@/components/admin/AdminPortalRoot";
import { isAdminHostFromIncomingHeaders } from "@/lib/admin-host";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import type { Metadata } from "next";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Car Photo Editing Services",
  description:
    "Professional car editing and automotive photo retouching for dealerships, marketplaces, and creative teams.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Car Photo Editing Services | Car Editing Studio",
    description:
      "Professional car editing and automotive photo retouching for dealerships, marketplaces, and creative teams.",
    url: "/",
    type: "website",
    images: [{ url: DEFAULT_OG_IMAGE, alt: "Car Editing Studio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Car Photo Editing Services | Car Editing Studio",
    description:
      "Professional car editing and automotive photo retouching for dealerships, marketplaces, and creative teams.",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default async function Home() {
  const h = await headers();
  if (isAdminHostFromIncomingHeaders((name) => h.get(name))) {
    return <AdminPortalRoot />;
  }

  return <PublicHomePage />;
}
