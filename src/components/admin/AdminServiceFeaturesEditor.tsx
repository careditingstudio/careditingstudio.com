"use client";

import { useAdminCms } from "@/components/admin/AdminCmsContext";
import {
  SERVICE_FEATURE_ICON_OPTIONS,
  ServiceFeatureIcon,
} from "@/lib/service-feature-icons";

export function AdminServiceFeaturesEditor() {
  const {
    cms,
    patchHomeServiceFeatures,
    setServiceFeatureItem,
    addServiceFeatureItem,
    removeServiceFeatureItem,
    moveServiceFeatureItem,
  } = useAdminCms();
  if (!cms) return null;

  const block = cms.homeServiceFeatures;

  return (
    <section className="scroll-mt-8 space-y-6" id="service-features">
      <h2 className="text-lg font-semibold text-white">Service features</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm text-zinc-400">
          Intro (above title)
          <textarea
            value={block.intro}
            rows={3}
            onChange={(e) => patchHomeServiceFeatures({ intro: e.target.value })}
            className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
          />
        </label>
        <label className="block text-sm text-zinc-400">
          Section title
          <input
            value={block.sectionTitle}
            onChange={(e) =>
              patchHomeServiceFeatures({ sectionTitle: e.target.value })
            }
            className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
          />
        </label>
        <label className="block text-sm text-zinc-400">
          Button label
          <input
            value={block.ctaLabel}
            onChange={(e) => patchHomeServiceFeatures({ ctaLabel: e.target.value })}
            className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
          />
        </label>
        <label className="block text-sm text-zinc-400">
          Button link
          <input
            value={block.ctaHref}
            onChange={(e) => patchHomeServiceFeatures({ ctaHref: e.target.value })}
            className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
            placeholder="/services"
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-zinc-500">Cards</p>
        <button
          type="button"
          onClick={addServiceFeatureItem}
          className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm text-white hover:bg-zinc-700"
        >
          Add card
        </button>
      </div>

      <ul className="space-y-6">
        {block.items.map((card, i) => (
          <li
            key={`sf-${i}`}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4"
          >
            <div className="mb-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => moveServiceFeatureItem(i, -1)}
                disabled={i === 0}
                className="rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-300 disabled:opacity-40"
              >
                Up
              </button>
              <button
                type="button"
                onClick={() => moveServiceFeatureItem(i, 1)}
                disabled={i === block.items.length - 1}
                className="rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-300 disabled:opacity-40"
              >
                Down
              </button>
              <button
                type="button"
                onClick={() => removeServiceFeatureItem(i)}
                className="ml-auto rounded border border-red-900/50 px-2 py-1 text-xs text-red-400 hover:bg-red-950/30"
              >
                Remove
              </button>
            </div>

            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
              Icon
            </p>
            <div className="mb-4 flex flex-wrap gap-1.5">
              {SERVICE_FEATURE_ICON_OPTIONS.map((opt) => {
                const on = card.iconKey === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    title={opt.label}
                    onClick={() =>
                      setServiceFeatureItem(i, { iconKey: opt.key })
                    }
                    className={[
                      "flex h-10 w-10 items-center justify-center rounded-lg border transition-colors",
                      on
                        ? "border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--accent)]"
                        : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200",
                    ].join(" ")}
                  >
                    <ServiceFeatureIcon iconKey={opt.key} className="h-5 w-5" />
                  </button>
                );
              })}
            </div>

            <label className="mb-3 block text-sm text-zinc-400">
              Title
              <input
                value={card.title}
                onChange={(e) =>
                  setServiceFeatureItem(i, { title: e.target.value })
                }
                className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
              />
            </label>
            <label className="block text-sm text-zinc-400">
              Text
              <textarea
                value={card.body}
                rows={3}
                onChange={(e) =>
                  setServiceFeatureItem(i, { body: e.target.value })
                }
                className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
              />
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}
