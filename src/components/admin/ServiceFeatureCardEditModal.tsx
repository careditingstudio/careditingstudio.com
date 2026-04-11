"use client";

import { AdminFormModal } from "@/components/admin/AdminFormModal";
import { useAdminCms } from "@/components/admin/AdminCmsContext";
import {
  SERVICE_FEATURE_ICON_OPTIONS,
  ServiceFeatureIcon,
} from "@/lib/service-feature-icons";

type Props = {
  open: boolean;
  onClose: () => void;
  cardIndex: number;
};

export function ServiceFeatureCardEditModal({
  open,
  onClose,
  cardIndex,
}: Props) {
  const {
    cms,
    setServiceFeatureItem,
    removeServiceFeatureItem,
  } = useAdminCms();

  if (!cms || !open) return null;
  const card = cms.homeServiceFeatures.items[cardIndex];
  if (!card) return null;

  return (
    <AdminFormModal
      open={open}
      onClose={onClose}
      title={`Service feature ${cardIndex + 1}`}
      nested
      maxWidthClass="max-w-3xl"
      maxHeightClass="max-h-[min(92vh,52rem)]"
    >
      <div className="space-y-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
            Icon
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {SERVICE_FEATURE_ICON_OPTIONS.map((opt) => {
              const on = card.iconKey === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  title={opt.label}
                  onClick={() =>
                    setServiceFeatureItem(cardIndex, { iconKey: opt.key })
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
        </div>
        <label className="block text-sm text-zinc-400">
          Title
          <input
            value={card.title}
            onChange={(e) =>
              setServiceFeatureItem(cardIndex, { title: e.target.value })
            }
            className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
          />
        </label>
        <label className="block text-sm text-zinc-400">
          Text
          <textarea
            value={card.body}
            rows={12}
            onChange={(e) =>
              setServiceFeatureItem(cardIndex, { body: e.target.value })
            }
            className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
          />
        </label>
        <div className="flex flex-wrap justify-end gap-2 border-t border-zinc-800 pt-4">
          <button
            type="button"
            onClick={() => {
              removeServiceFeatureItem(cardIndex);
              onClose();
            }}
            className="rounded-lg border border-red-900/50 px-3 py-2 text-sm text-red-400 hover:bg-red-950/30"
          >
            Remove card
          </button>
        </div>
      </div>
    </AdminFormModal>
  );
}
