"use client";

import { AdminFormModal } from "@/components/admin/AdminFormModal";
import { ServiceFeatureCardEditModal } from "@/components/admin/ServiceFeatureCardEditModal";
import { useAdminCms } from "@/components/admin/AdminCmsContext";
import { ServiceFeatureIcon } from "@/lib/service-feature-icons";
import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function AdminServiceFeaturesEditModal({ open, onClose }: Props) {
  const {
    cms,
    patchHomeServiceFeatures,
    addServiceFeatureItem,
    moveServiceFeatureItem,
  } = useAdminCms();
  const [cardEditIdx, setCardEditIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!open) setCardEditIdx(null);
  }, [open]);

  if (!cms) return null;

  const block = cms.homeServiceFeatures;

  return (
    <>
      <AdminFormModal
        open={open}
        onClose={onClose}
        title="Service features"
        maxWidthClass="max-w-6xl"
        maxHeightClass="max-h-[min(94vh,58rem)]"
      >
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm text-zinc-400">
              Intro (above title)
              <textarea
                value={block.intro}
                rows={3}
                onChange={(e) =>
                  patchHomeServiceFeatures({ intro: e.target.value })
                }
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
                onChange={(e) =>
                  patchHomeServiceFeatures({ ctaLabel: e.target.value })
                }
                className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
              />
            </label>
            <label className="block text-sm text-zinc-400">
              Button link
              <input
                value={block.ctaHref}
                onChange={(e) =>
                  patchHomeServiceFeatures({ ctaHref: e.target.value })
                }
                className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
                placeholder="/services"
              />
            </label>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
            <p className="text-sm font-medium text-zinc-300">
              Before &amp; after block (heading above examples)
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              Optional intro above the examples. Leave both empty for no heading.
            </p>
            <label className="mt-3 block text-sm text-zinc-400">
              Eyebrow (small line above title)
              <input
                value={block.beforeAfterSectionEyebrow ?? ""}
                onChange={(e) =>
                  patchHomeServiceFeatures({
                    beforeAfterSectionEyebrow: e.target.value,
                  })
                }
                className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
                placeholder="e.g. Examples"
              />
            </label>
            <label className="mt-3 block text-sm text-zinc-400">
              Section title
              <input
                value={block.beforeAfterSectionTitle ?? ""}
                onChange={(e) =>
                  patchHomeServiceFeatures({
                    beforeAfterSectionTitle: e.target.value,
                  })
                }
                className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
                placeholder="e.g. Before & after"
              />
            </label>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-zinc-300">Feature cards</p>
                <p className="mt-1 text-xs text-zinc-500">
                  Add as many cards as you need. Each opens in its own editor.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const idx = block.items.length;
                  addServiceFeatureItem();
                  setCardEditIdx(idx);
                }}
                className="shrink-0 rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-xs font-medium text-zinc-200 hover:bg-zinc-700"
              >
                + Add card
              </button>
            </div>
            <ul className="mt-4 space-y-2">
              {block.items.length === 0 ? (
                <li className="rounded-lg border border-zinc-800/80 px-3 py-6 text-center text-[11px] text-zinc-600">
                  No cards yet — click &quot;+ Add card&quot;.
                </li>
              ) : (
                block.items.map((card, i) => (
                  <li
                    key={`sf-row-${i}`}
                    className="flex items-center gap-3 rounded-lg border border-zinc-800/90 bg-zinc-950/40 px-3 py-2"
                  >
                    <span className="w-6 shrink-0 text-center text-[10px] font-medium text-zinc-600">
                      {i + 1}
                    </span>
                    <div className="flex shrink-0 flex-col gap-0.5">
                      <button
                        type="button"
                        aria-label="Move up"
                        disabled={i === 0}
                        onClick={() => moveServiceFeatureItem(i, -1)}
                        className="rounded border border-zinc-700 px-1.5 py-0.5 text-[10px] text-zinc-400 hover:bg-zinc-800 disabled:opacity-25"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        aria-label="Move down"
                        disabled={i === block.items.length - 1}
                        onClick={() => moveServiceFeatureItem(i, 1)}
                        className="rounded border border-zinc-700 px-1.5 py-0.5 text-[10px] text-zinc-400 hover:bg-zinc-800 disabled:opacity-25"
                      >
                        ↓
                      </button>
                    </div>
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 text-[var(--accent)]">
                      <ServiceFeatureIcon
                        iconKey={card.iconKey}
                        className="h-4 w-4"
                      />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-zinc-200">
                        {card.title.trim() || "Untitled card"}
                      </p>
                      <p className="line-clamp-1 text-[11px] text-zinc-500">
                        {card.body.trim() || "—"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCardEditIdx(i)}
                      className="shrink-0 rounded-md border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-3 py-1.5 text-[11px] font-medium text-[var(--accent)] hover:bg-[var(--accent)]/20"
                    >
                      Edit
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </AdminFormModal>

      {cardEditIdx !== null && cms.homeServiceFeatures.items[cardEditIdx] ? (
        <ServiceFeatureCardEditModal
          open
          cardIndex={cardEditIdx}
          onClose={() => setCardEditIdx(null)}
        />
      ) : null}
    </>
  );
}
