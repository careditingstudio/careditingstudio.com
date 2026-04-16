import { OrderNowLink } from "@/components/OrderNowLink";
import { PageHeading } from "@/components/PageHeading";
import { readCms } from "@/lib/cms-store";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple and transparent pricing for automotive photo editing.",
};

export default async function PricingPage() {
  const cms = await readCms();
  const pricing = cms.pricing;
  const plans = pricing.plans;
  const paymentMethods = cms.site.paymentMethods ?? [];
  return (
    <>
      <PageHeading
        title={pricing.headingTitle}
        description={pricing.headingDescription}
      />
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.packageLabel}
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
                    Single
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
                    {plan.singlePrice}
                  </p>
                </div>
                <div className="rounded-lg border border-[var(--line)] bg-black/15 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-2)]">
                    Bulk
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
                    {plan.bulkPrice}
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
          <div className="mt-4 flex flex-wrap gap-3">
            {paymentMethods.map((method) => (
              <div
                key={method}
                className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-medium text-[var(--foreground)]"
              >
                {method}
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
