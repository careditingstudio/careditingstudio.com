import { OrderForm } from "@/components/forms/OrderForm";
import { ENV_APP } from "@/config/deployment-env";
import { getVisitorShellMessages } from "@/i18n/visitor-shell";
import { readCms } from "@/lib/cms-store";
import { getPublicVisitorState } from "@/lib/public-visitor";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order",
  description: "Place an order for automotive photo editing.",
  alternates: {
    canonical: "/order",
  },
  openGraph: {
    title: "Order Automotive Photo Editing",
    description: "Place an order for automotive photo editing.",
    url: "/order",
    type: "website",
    images: [{ url: DEFAULT_OG_IMAGE, alt: "Order car photo editing service" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Order Automotive Photo Editing",
    description: "Place an order for automotive photo editing.",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default async function OrderPage() {
  const cms = await readCms();
  const visitor = await getPublicVisitorState();
  const shell = getVisitorShellMessages(visitor.locale);
  const siteKey = process.env[ENV_APP.TURNSTILE_SITE_KEY]?.trim() ?? "";
  const serviceOptions = Array.from(
    new Set(cms.services.map((s) => s.name.trim()).filter((s) => s.length > 0)),
  ).slice(0, 18);
  return (
    <div className="mx-auto w-full max-w-[88rem] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto w-full max-w-[82rem]">
        <div className="mb-8 text-center sm:mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
            {shell.pages.orderTitle}
          </h1>
          <p className="mt-3 text-sm text-[var(--muted)] sm:text-base">
            {shell.pages.orderSubtitle}
          </p>
        </div>
        <OrderForm
          turnstileSiteKey={siteKey}
          serviceOptions={serviceOptions}
          uiLocale={visitor.locale}
          forms={shell.forms}
        />
      </div>
    </div>
  );
}
