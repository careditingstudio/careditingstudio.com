"use client";

import { AdminFormModal } from "@/components/admin/AdminFormModal";
import { useAdminCms } from "@/components/admin/AdminCmsContext";

type Props = {
  open: boolean;
  onClose: () => void;
  pillarIndex: number;
};

export function WhyChoosePillarEditModal({
  open,
  onClose,
  pillarIndex,
}: Props) {
  const { cms, setWhyChoosePillarItem, removeWhyChoosePillar } = useAdminCms();

  if (!cms || !open) return null;
  const p = cms.homeWhyChooseUs.pillars[pillarIndex];
  if (!p) return null;

  return (
    <AdminFormModal
      open={open}
      onClose={onClose}
      title={`Pillar card ${pillarIndex + 1}`}
      nested
      maxWidthClass="max-w-3xl"
      maxHeightClass="max-h-[min(92vh,52rem)]"
    >
      <div className="space-y-4">
        <label className="block text-sm text-zinc-400">
          Title
          <input
            value={p.title}
            onChange={(e) =>
              setWhyChoosePillarItem(pillarIndex, { title: e.target.value })
            }
            className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
          />
        </label>
        <label className="block text-sm text-zinc-400">
          Text
          <textarea
            value={p.body}
            rows={12}
            onChange={(e) =>
              setWhyChoosePillarItem(pillarIndex, { body: e.target.value })
            }
            className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
          />
        </label>
        <div className="flex flex-wrap justify-end gap-2 border-t border-zinc-800 pt-4">
          <button
            type="button"
            onClick={() => {
              removeWhyChoosePillar(pillarIndex);
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
