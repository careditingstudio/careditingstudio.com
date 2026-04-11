"use client";

import { AdminFormModal } from "@/components/admin/AdminFormModal";
import { WhyChoosePillarEditModal } from "@/components/admin/WhyChoosePillarEditModal";
import { useAdminCms } from "@/components/admin/AdminCmsContext";
import { isUploadedAsset } from "@/lib/cms-types";
import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  openMediaPicker: (onChosen: (url: string) => void) => void;
};

export function AdminWhyChooseUsEditModal({
  open,
  onClose,
  openMediaPicker,
}: Props) {
  const {
    cms,
    patchHomeWhyChooseUs,
    setFlash,
    addWhyChoosePillar,
    moveWhyChoosePillar,
  } = useAdminCms();
  const [pillarEditIdx, setPillarEditIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!open) setPillarEditIdx(null);
  }, [open]);

  if (!cms) return null;

  const block = cms.homeWhyChooseUs;

  return (
    <>
      <AdminFormModal
        open={open}
        onClose={onClose}
        title="Why choose us & how it works"
        maxWidthClass="max-w-6xl"
        maxHeightClass="max-h-[min(94vh,58rem)]"
      >
        <p className="mb-6 text-xs text-zinc-500">
          Same block as the dark band on the public homepage (pillar cards, workflow,
          team photo, portfolio strip wording). Pillar cards: add as many as you need
          — each has its own editor.
        </p>

        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm text-zinc-400 sm:col-span-2">
              Headline
              <input
                value={block.headline}
                onChange={(e) =>
                  patchHomeWhyChooseUs({ headline: e.target.value })
                }
                className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
              />
            </label>
            <label className="block text-sm text-zinc-400 sm:col-span-2">
              Intro
              <textarea
                value={block.intro}
                rows={4}
                onChange={(e) =>
                  patchHomeWhyChooseUs({ intro: e.target.value })
                }
                className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
              />
            </label>
            <label className="block text-sm text-zinc-400 sm:col-span-2">
              Manual + AI label (highlight pill; clear to hide)
              <input
                value={block.manualAiLabel ?? ""}
                onChange={(e) =>
                  patchHomeWhyChooseUs({ manualAiLabel: e.target.value })
                }
                placeholder="Manual + AI"
                className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
              />
            </label>
            <label className="block text-sm text-zinc-400">
              Badge 1
              <input
                value={block.badges[0] ?? ""}
                onChange={(e) => {
                  const b = [...block.badges];
                  b[0] = e.target.value;
                  patchHomeWhyChooseUs({ badges: b });
                }}
                className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
              />
            </label>
            <label className="block text-sm text-zinc-400">
              Badge 2
              <input
                value={block.badges[1] ?? ""}
                onChange={(e) => {
                  const b = [...block.badges];
                  b[1] = e.target.value;
                  patchHomeWhyChooseUs({ badges: b });
                }}
                className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
              />
            </label>
            <label className="block text-sm text-zinc-400">
              Badge 3
              <input
                value={block.badges[2] ?? ""}
                onChange={(e) => {
                  const b = [...block.badges];
                  b[2] = e.target.value;
                  patchHomeWhyChooseUs({ badges: b });
                }}
                className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
              />
            </label>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-zinc-300">Pillar cards</p>
                <p className="mt-1 text-xs text-zinc-500">
                  Add any number of cards. Use Edit for each card — no fixed limit.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const idx = block.pillars.length;
                  addWhyChoosePillar();
                  setPillarEditIdx(idx);
                }}
                className="shrink-0 rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-xs font-medium text-zinc-200 hover:bg-zinc-700"
              >
                + Add card
              </button>
            </div>
            <ul className="mt-4 space-y-2">
              {block.pillars.length === 0 ? (
                <li className="rounded-lg border border-zinc-800/80 px-3 py-6 text-center text-[11px] text-zinc-600">
                  No pillar cards yet — click &quot;+ Add card&quot; to create one.
                </li>
              ) : (
                block.pillars.map((p, i) => (
                  <li
                    key={`pillar-row-${i}`}
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
                        onClick={() => moveWhyChoosePillar(i, -1)}
                        className="rounded border border-zinc-700 px-1.5 py-0.5 text-[10px] text-zinc-400 hover:bg-zinc-800 disabled:opacity-25"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        aria-label="Move down"
                        disabled={i === block.pillars.length - 1}
                        onClick={() => moveWhyChoosePillar(i, 1)}
                        className="rounded border border-zinc-700 px-1.5 py-0.5 text-[10px] text-zinc-400 hover:bg-zinc-800 disabled:opacity-25"
                      >
                        ↓
                      </button>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-zinc-200">
                        {p.title.trim() || "Untitled card"}
                      </p>
                      <p className="line-clamp-1 text-[11px] text-zinc-500">
                        {p.body.trim() || "—"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPillarEditIdx(i)}
                      className="shrink-0 rounded-md border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-3 py-1.5 text-[11px] font-medium text-[var(--accent)] hover:bg-[var(--accent)]/20"
                    >
                      Edit
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            <label className="block text-sm text-zinc-400">
              Workflow section title
              <input
                value={block.workflowTitle}
                onChange={(e) =>
                  patchHomeWhyChooseUs({ workflowTitle: e.target.value })
                }
                className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
              />
            </label>
            <label className="mt-3 block text-sm text-zinc-400">
              Intro under workflow title
              <textarea
                value={block.workflowIntro ?? ""}
                onChange={(e) =>
                  patchHomeWhyChooseUs({ workflowIntro: e.target.value })
                }
                rows={3}
                className="mt-1.5 w-full resize-y rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
              />
            </label>

            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-lg bg-black sm:w-56">
                {block.teamPhotoSrc.trim() ? (
                  <Image
                    src={block.teamPhotoSrc.trim()}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="224px"
                    unoptimized={isUploadedAsset(block.teamPhotoSrc.trim())}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-2 text-center text-xs text-zinc-600">
                    No team photo
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                <p className="text-xs text-zinc-500">Team / group photo</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      openMediaPicker((url) => {
                        patchHomeWhyChooseUs({ teamPhotoSrc: url });
                        setFlash({ type: "ok", text: "Team photo updated." });
                      })
                    }
                    className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm text-white hover:bg-zinc-700"
                  >
                    Choose from library
                  </button>
                  <button
                    type="button"
                    onClick={() => patchHomeWhyChooseUs({ teamPhotoSrc: "" })}
                    className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-800"
                  >
                    Clear
                  </button>
                </div>
                <label className="block text-sm text-zinc-400">
                  Alt text
                  <input
                    value={block.teamPhotoAlt}
                    onChange={(e) =>
                      patchHomeWhyChooseUs({ teamPhotoAlt: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
                  />
                </label>
                <p className="break-all font-mono text-[11px] text-zinc-500">
                  {block.teamPhotoSrc || "—"}
                </p>
              </div>
            </div>

            <p className="mt-6 text-sm font-medium text-zinc-300">Five workflow steps</p>
            <ul className="mt-3 space-y-3">
              {block.workflowSteps.map((s, i) => (
                <li
                  key={`wf-${i}`}
                  className="grid gap-2 rounded-lg border border-zinc-800 bg-zinc-950/50 p-3 sm:grid-cols-2"
                >
                  <span className="text-xs text-zinc-600">Step {i + 1}</span>
                  <label className="block text-sm text-zinc-400 sm:col-span-2">
                    Title
                    <input
                      value={s.title}
                      onChange={(e) => {
                        const workflowSteps = block.workflowSteps.map((row, k) =>
                          k === i ? { ...row, title: e.target.value } : row,
                        );
                        patchHomeWhyChooseUs({ workflowSteps });
                      }}
                      className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-sm text-zinc-100"
                    />
                  </label>
                  <label className="block text-sm text-zinc-400 sm:col-span-2">
                    Subtitle
                    <input
                      value={s.subtitle}
                      onChange={(e) => {
                        const workflowSteps = block.workflowSteps.map((row, k) =>
                          k === i ? { ...row, subtitle: e.target.value } : row,
                        );
                        patchHomeWhyChooseUs({ workflowSteps });
                      }}
                      className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-sm text-zinc-100"
                    />
                  </label>
                </li>
              ))}
            </ul>

            <div className="mt-10 border-t border-zinc-800 pt-8">
              <p className="text-sm font-medium text-zinc-300">
                Homepage portfolio strip (heading)
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Title and link label for the horizontal portfolio row below this block.
              </p>
              <label className="mt-4 block text-sm text-zinc-400">
                Title
                <input
                  value={block.portfolioStripTitle ?? ""}
                  onChange={(e) =>
                    patchHomeWhyChooseUs({ portfolioStripTitle: e.target.value })
                  }
                  className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
                />
              </label>
              <label className="mt-3 block text-sm text-zinc-400">
                “See more” link label
                <input
                  value={block.portfolioStripCtaLabel ?? ""}
                  onChange={(e) =>
                    patchHomeWhyChooseUs({
                      portfolioStripCtaLabel: e.target.value,
                    })
                  }
                  className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
                />
              </label>
            </div>
          </div>
        </div>
      </AdminFormModal>

      {pillarEditIdx !== null && block.pillars[pillarEditIdx] ? (
        <WhyChoosePillarEditModal
          open
          pillarIndex={pillarEditIdx}
          onClose={() => setPillarEditIdx(null)}
        />
      ) : null}
    </>
  );
}
