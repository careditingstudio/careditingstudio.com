"use client";

import { useAdminCms } from "@/components/admin/AdminCmsContext";
import { MediaLibraryModal } from "@/components/admin/MediaLibraryModal";
import { isUploadedAsset } from "@/lib/cms-types";
import Image from "next/image";
import { useRef, useState } from "react";

export function AdminWhyChooseUsEditor() {
  const { cms, patchHomeWhyChooseUs, setFlash } = useAdminCms();
  const pickHandlerRef = useRef<(url: string) => void>(() => {});
  const [mediaOpen, setMediaOpen] = useState(false);

  if (!cms) return null;

  const block = cms.homeWhyChooseUs;

  function openMediaPicker(onChosen: (url: string) => void) {
    pickHandlerRef.current = onChosen;
    setMediaOpen(true);
  }

  return (
    <section className="scroll-mt-8 space-y-6" id="why-choose-us">
      <MediaLibraryModal
        open={mediaOpen}
        onClose={() => setMediaOpen(false)}
        onPick={(url) => {
          pickHandlerRef.current(url);
          setMediaOpen(false);
        }}
        title="Choose image"
      />

      <div>
        <h2 className="text-lg font-semibold text-white">
          Why choose us &amp; how it works
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Edits the homepage block above reviews (headline, cards, workflow, team
          photo).
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm text-zinc-400 sm:col-span-2">
          Headline
          <input
            value={block.headline}
            onChange={(e) => patchHomeWhyChooseUs({ headline: e.target.value })}
            className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
          />
        </label>
        <label className="block text-sm text-zinc-400 sm:col-span-2">
          Intro
          <textarea
            value={block.intro}
            rows={4}
            onChange={(e) => patchHomeWhyChooseUs({ intro: e.target.value })}
            className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
          />
        </label>
        <label className="block text-sm text-zinc-400 sm:col-span-2">
          Manual + AI label (highlight pill before the three badges; clear to hide)
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
        <label className="block text-sm text-zinc-400">
          Easy communication — title
          <input
            value={block.easyCommunicationTitle}
            onChange={(e) =>
              patchHomeWhyChooseUs({ easyCommunicationTitle: e.target.value })
            }
            className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
          />
        </label>
        <label className="block text-sm text-zinc-400 sm:col-span-2">
          Easy communication — text
          <textarea
            value={block.easyCommunicationBody}
            rows={3}
            onChange={(e) =>
              patchHomeWhyChooseUs({ easyCommunicationBody: e.target.value })
            }
            className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
          />
        </label>
      </div>

      <div>
        <p className="text-sm font-medium text-zinc-300">Three pillar cards</p>
        <ul className="mt-3 space-y-4">
          {block.pillars.map((p, i) => (
            <li
              key={`pillar-${i}`}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4"
            >
              <p className="text-xs text-zinc-500">Card {i + 1}</p>
              <label className="mt-2 block text-sm text-zinc-400">
                Title
                <input
                  value={p.title}
                  onChange={(e) => {
                    const pillars = block.pillars.map((row, k) =>
                      k === i ? { ...row, title: e.target.value } : row,
                    );
                    patchHomeWhyChooseUs({ pillars });
                  }}
                  className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
                />
              </label>
              <label className="mt-2 block text-sm text-zinc-400">
                Body
                <textarea
                  value={p.body}
                  rows={2}
                  onChange={(e) => {
                    const pillars = block.pillars.map((row, k) =>
                      k === i ? { ...row, body: e.target.value } : row,
                    );
                    patchHomeWhyChooseUs({ pillars });
                  }}
                  className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
                />
              </label>
            </li>
          ))}
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
            <p className="text-xs text-zinc-500">Team / group photo (left column)</p>
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
      </div>
    </section>
  );
}
