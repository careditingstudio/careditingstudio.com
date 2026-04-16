"use client";

import { AdminFormModal } from "@/components/admin/AdminFormModal";
import { useAdminCms } from "@/components/admin/AdminCmsContext";
import { useMemo, useState } from "react";

export function AdminPricingContent() {
  const {
    cms,
    patchPricing,
    setPricingPlan,
    addPricingPlan,
    removePricingPlan,
    movePricingPlan,
  } = useAdminCms();
  const [headerOpen, setHeaderOpen] = useState(false);
  const [guaranteeOpen, setGuaranteeOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [paymentTitleOpen, setPaymentTitleOpen] = useState(false);
  const [editPlanIndex, setEditPlanIndex] = useState<number | null>(null);

  const featuredCount = useMemo(() => {
    if (!cms) return 0;
    return cms.pricing.plans.filter((p) => p.featured).length;
  }, [cms]);

  if (!cms) return null;
  const pricing = cms.pricing;
  const editPlan = editPlanIndex === null ? null : pricing.plans[editPlanIndex] ?? null;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header className="border-b border-zinc-800 pb-6">
        <h1 className="text-2xl font-semibold text-white">Pricing page content</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Edit the public pricing page cards and section copy.
        </p>
      </header>

      <section className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-white">Heading</h2>
          <button
            type="button"
            onClick={() => setHeaderOpen(true)}
            className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-200 hover:border-[var(--accent)]/50"
          >
            Edit
          </button>
        </div>
        <p className="text-sm text-zinc-300">{pricing.headingTitle || "—"}</p>
        <p className="line-clamp-2 text-xs text-zinc-500">{pricing.headingDescription || "—"}</p>
      </section>

      <section className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">Pricing cards</h2>
          <button
            type="button"
            onClick={() => addPricingPlan()}
            className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-200 hover:bg-zinc-800"
          >
            + Add card
          </button>
        </div>
        <div className="space-y-1.5">
          {pricing.plans.map((plan, i) => (
            <article
              key={`${plan.packageLabel}-${i}`}
              className="flex items-center gap-3 rounded-lg border border-zinc-800/90 bg-zinc-900/40 px-3 py-2"
            >
              <span className="w-5 shrink-0 text-center text-[10px] font-medium text-zinc-600">
                {i + 1}
              </span>
              <div className="flex shrink-0 flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => movePricingPlan(i, -1)}
                  disabled={i === 0}
                  className="rounded border border-zinc-700 px-1.5 py-0.5 text-[10px] text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-25"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => movePricingPlan(i, 1)}
                  disabled={i === pricing.plans.length - 1}
                  className="rounded border border-zinc-700 px-1.5 py-0.5 text-[10px] text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-25"
                >
                  ↓
                </button>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-zinc-200">
                  {plan.packageLabel || `Card ${i + 1}`} · {plan.title || "Untitled"}
                </p>
                <p className="truncate text-[10px] text-zinc-500">
                  Single {plan.singlePrice || "—"} · Bulk {plan.bulkPrice || "—"} ·{" "}
                  {plan.features.length} features
                  {plan.featured ? " · Featured" : ""}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setEditPlanIndex(i)}
                  className="rounded-md border border-zinc-600 bg-zinc-800/60 px-2.5 py-1 text-[11px] font-medium text-zinc-200 hover:border-[var(--accent)]/40 hover:text-white"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    removePricingPlan(i);
                    if (editPlanIndex === i) setEditPlanIndex(null);
                    if (editPlanIndex !== null && editPlanIndex > i) {
                      setEditPlanIndex(editPlanIndex - 1);
                    }
                  }}
                  className="rounded-md px-2 py-1 text-[11px] text-zinc-500 hover:text-red-400"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
          {pricing.plans.length === 0 ? (
            <div className="rounded-lg border border-zinc-800 px-3 py-5 text-center text-[11px] text-zinc-600">
              No pricing cards yet.
            </div>
          ) : null}
        </div>
        <p className="text-[11px] text-zinc-500">
          {pricing.plans.length} card{pricing.plans.length === 1 ? "" : "s"} · {featuredCount} featured
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-white">Guarantee block</h2>
            <button
              type="button"
              onClick={() => setGuaranteeOpen(true)}
              className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-200 hover:border-[var(--accent)]/50"
            >
              Edit
            </button>
          </div>
          <p className="mt-3 text-sm text-zinc-300">{pricing.guaranteeTitle || "—"}</p>
          <p className="mt-2 line-clamp-3 text-xs text-zinc-500">{pricing.guaranteeBody || "—"}</p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-white">Bulk order block</h2>
            <button
              type="button"
              onClick={() => setBulkOpen(true)}
              className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-200 hover:border-[var(--accent)]/50"
            >
              Edit
            </button>
          </div>
          <p className="mt-3 text-sm text-zinc-300">{pricing.bulkTitle || "—"}</p>
          <p className="mt-2 line-clamp-3 text-xs text-zinc-500">{pricing.bulkBody || "—"}</p>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-white">Payment section title</h2>
          <button
            type="button"
            onClick={() => setPaymentTitleOpen(true)}
            className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-200 hover:border-[var(--accent)]/50"
          >
            Edit
          </button>
        </div>
        <p className="mt-3 text-sm text-zinc-300">{pricing.paymentTitle || "—"}</p>
      </section>

      <AdminFormModal
        open={headerOpen}
        onClose={() => setHeaderOpen(false)}
        title="Edit heading"
        maxWidthClass="max-w-2xl"
      >
        <div className="space-y-4">
          <label className="block text-sm text-zinc-300">
            Title
            <input
              value={pricing.headingTitle}
              onChange={(e) => patchPricing({ headingTitle: e.target.value })}
              className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-[var(--accent)]"
            />
          </label>
          <label className="block text-sm text-zinc-300">
            Description
            <textarea
              value={pricing.headingDescription}
              onChange={(e) => patchPricing({ headingDescription: e.target.value })}
              rows={4}
              className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-[var(--accent)]"
            />
          </label>
        </div>
      </AdminFormModal>

      <AdminFormModal
        open={editPlan !== null}
        onClose={() => setEditPlanIndex(null)}
        title={`Edit pricing card ${editPlanIndex === null ? "" : editPlanIndex + 1}`}
        maxWidthClass="max-w-2xl"
      >
        {editPlan ? (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={editPlan.packageLabel}
                onChange={(e) => setPricingPlan(editPlanIndex!, { packageLabel: e.target.value })}
                placeholder="Package label"
                className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-[var(--accent)]"
              />
              <input
                value={editPlan.title}
                onChange={(e) => setPricingPlan(editPlanIndex!, { title: e.target.value })}
                placeholder="Service title"
                className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-[var(--accent)]"
              />
              <input
                value={editPlan.singlePrice}
                onChange={(e) => setPricingPlan(editPlanIndex!, { singlePrice: e.target.value })}
                placeholder="$0.39"
                className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-[var(--accent)]"
              />
              <input
                value={editPlan.bulkPrice}
                onChange={(e) => setPricingPlan(editPlanIndex!, { bulkPrice: e.target.value })}
                placeholder="$0.29"
                className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-[var(--accent)]"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={editPlan.featured}
                onChange={(e) => setPricingPlan(editPlanIndex!, { featured: e.target.checked })}
              />
              Highlight this card
            </label>
            <label className="block text-xs text-zinc-400">
              Features (one per line)
              <textarea
                value={editPlan.features.join("\n")}
                onChange={(e) =>
                  setPricingPlan(editPlanIndex!, {
                    features: e.target.value
                      .split("\n")
                      .map((x) => x.trim())
                      .filter(Boolean),
                  })
                }
                rows={5}
                className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-[var(--accent)]"
              />
            </label>
          </div>
        ) : null}
      </AdminFormModal>

      <AdminFormModal
        open={guaranteeOpen}
        onClose={() => setGuaranteeOpen(false)}
        title="Edit guarantee block"
        maxWidthClass="max-w-2xl"
      >
        <div className="space-y-4">
          <input
            value={pricing.guaranteeTitle}
            onChange={(e) => patchPricing({ guaranteeTitle: e.target.value })}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
          />
          <textarea
            value={pricing.guaranteeBody}
            onChange={(e) => patchPricing({ guaranteeBody: e.target.value })}
            rows={5}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
          />
        </div>
      </AdminFormModal>

      <AdminFormModal
        open={bulkOpen}
        onClose={() => setBulkOpen(false)}
        title="Edit bulk order block"
        maxWidthClass="max-w-2xl"
      >
        <div className="space-y-4">
          <input
            value={pricing.bulkTitle}
            onChange={(e) => patchPricing({ bulkTitle: e.target.value })}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
          />
          <textarea
            value={pricing.bulkBody}
            onChange={(e) => patchPricing({ bulkBody: e.target.value })}
            rows={5}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
          />
        </div>
      </AdminFormModal>

      <AdminFormModal
        open={paymentTitleOpen}
        onClose={() => setPaymentTitleOpen(false)}
        title="Edit payment section title"
        maxWidthClass="max-w-2xl"
      >
        <input
          value={pricing.paymentTitle}
          onChange={(e) => patchPricing({ paymentTitle: e.target.value })}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
        />
      </AdminFormModal>
    </div>
  );
}
