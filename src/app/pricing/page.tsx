import { OrderNowLink } from "@/components/OrderNowLink";
import { PageHeading } from "@/components/PageHeading";
import { getVisitorShellMessages } from "@/i18n/visitor-shell";
import { getUsdExchangeRates } from "@/lib/exchange-rates";
import { convertUsdPriceLabel } from "@/lib/price-convert";
import { getPublicVisitorState } from "@/lib/public-visitor";
import { isUploadedAsset } from "@/lib/cms-types";
import { readCms } from "@/lib/cms-store";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple and transparent pricing for automotive photo editing.",
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "Automotive Photo Editing Pricing",
    description: "Simple and transparent pricing for automotive photo editing.",
    url: "/pricing",
    type: "website",
    images: [{ url: DEFAULT_OG_IMAGE, alt: "Car Editing Studio pricing" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Automotive Photo Editing Pricing",
    description: "Simple and transparent pricing for automotive photo editing.",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default async function PricingPage() {
  const cms = await readCms();
  const pricing = cms.pricing;
  const plans = pricing.plans;
  const paymentMethods = (cms.site.paymentMethods ?? []).filter(
    (m) => m.label.trim().length > 0,
  );
  const [visitor, rates] = await Promise.all([
    getPublicVisitorState(),
    getUsdExchangeRates(),
  ]);
  const shell = getVisitorShellMessages(visitor.locale);

  const displayPlans = plans.map((plan) => ({
    ...plan,
    singleDisplay: convertUsdPriceLabel(
      plan.singlePrice,
      visitor.currency,
      rates,
      visitor.locale,
    ),
    bulkDisplay: convertUsdPriceLabel(
      plan.bulkPrice,
      visitor.currency,
      rates,
      visitor.locale,
    ),
  }));
  return (
    <>
      <PageHeading
        title={pricing.headingTitle}
        description={pricing.headingDescription}
      />
      <div className="mx-auto max-w-[88rem] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {displayPlans.map((plan, planIndex) => (
            <article
              key={`${plan.packageLabel}-${planIndex}`}
              className={[
                "rounded-2xl border bg-[var(--background)] p-6 sm:p-7",
                plan.featured
                  ? "border-[var(--accent)]/45 shadow-[0_18px_40px_-30px_rgba(224,122,69,0.45)]"
                  : "border-[var(--line)]",
              ].join(" ")}
            >
              <p
                className={[
                  "text-[11px] font-semibold uppercase tracking-[0.18em]",
                  plan.featured ? "text-[var(--accent)]" : "text-[var(--muted-2)]",
                ].join(" ")}
              >
                {plan.packageLabel}
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
                {plan.title}
              </h2>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-[var(--line)] bg-black/15 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-2)]">
                    {shell.pricing.single}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
                    {plan.singleDisplay}
                  </p>
                </div>
                <div className="rounded-lg border border-[var(--line)] bg-black/15 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-2)]">
                    {shell.pricing.bulk}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
                    {plan.bulkDisplay}
                  </p>
                </div>
              </div>

              <ul className="mt-6 space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-[var(--muted)]">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <OrderNowLink className="mt-7 w-full justify-center" />
            </article>
          ))}
        </section>

        <p className="mt-6 max-w-3xl text-xs leading-relaxed text-[var(--muted-2)]">
          {shell.pricing.disclaimer}
        </p>

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-[var(--line)] bg-[var(--background)] p-6 sm:p-7">
            <h3 className="text-2xl font-semibold text-[var(--foreground)]">
              {pricing.guaranteeTitle}
            </h3>
            <p className="mt-3 leading-relaxed text-[var(--muted)]">
              {pricing.guaranteeBody}
            </p>
          </article>

          <article className="rounded-2xl border border-[var(--line)] bg-[var(--background)] p-6 sm:p-7">
            <h3 className="text-2xl font-semibold text-[var(--foreground)]">
              {pricing.bulkTitle}
            </h3>
            <p className="mt-3 leading-relaxed text-[var(--muted)]">
              {pricing.bulkBody}
            </p>
          </article>
        </section>

        <section className="mt-8 rounded-2xl border border-[var(--line)] bg-[var(--background)] p-6 sm:p-7">
          <h3 className="text-2xl font-semibold text-[var(--foreground)]">{pricing.paymentTitle}</h3>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {paymentMethods.map((method) => (
              <div
                key={method.label}
                className="flex h-10 w-24 shrink-0 flex-col justify-stretch rounded-lg border border-[var(--line)] bg-white p-0.5 text-sm font-medium text-[var(--foreground)] shadow-[0_8px_18px_-12px_rgba(0,0,0,0.2)]"
              >
                {method.imageUrl ? (
                  <span className="relative min-h-0 flex-1 w-full">
                    <Image
                      src={method.imageUrl}
                      alt={method.label}
                      fill
                      className="object-contain p-px"
                      sizes="96px"
                      unoptimized={isUploadedAsset(method.imageUrl)}
                    />
                  </span>
                ) : (
                  <span className="flex flex-1 items-center justify-center px-1 text-center text-xs leading-tight">
                    {method.label}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
