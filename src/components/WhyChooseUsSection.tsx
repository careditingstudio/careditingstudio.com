"use client";

import Image from "next/image";
import { useMemo, useState, type ReactNode } from "react";
import { display, sans } from "@/app/fonts";
import type { HomeWhyChooseUsBlock } from "@/lib/cms-types";
import { isUploadedAsset } from "@/lib/cms-types";

const PILLAR_ICONS: ReactNode[] = [
  (
    <svg key="pillar-0" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3 4 7v6c0 5 3.4 7.7 8 8 4.6-.3 8-3 8-8V7l-8-4Z" />
      <path d="m9.4 12 1.8 1.8 3.7-3.8" />
    </svg>
  ),
  (
    <svg key="pillar-1" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M8 10h8M8 14h5" />
      <path d="M4 19V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8l-4 3Z" />
    </svg>
  ),
  (
    <svg key="pillar-2" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 2v20" />
      <path d="M17 5H9a3 3 0 0 0 0 6h6a3 3 0 0 1 0 6H7" />
    </svg>
  ),
];

const PILLAR_IDS = ["quality", "support", "trust"] as const;
type PillarId = (typeof PILLAR_IDS)[number];

const MANUAL_AI_ICON = (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M12 3v2M12 19v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M3 12h2M19 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const BADGE_ICONS: ReactNode[] = [
  (
    <svg key="badge-0" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.7v4.8l2.9 1.9" />
    </svg>
  ),
  (
    <svg key="badge-1" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17" />
      <path d="M12 3.5v17" />
    </svg>
  ),
  (
    <svg key="badge-2" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
    </svg>
  ),
];

const WORKFLOW_ICONS: ReactNode[] = [
  (
    <svg key="wf-0" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M7 3h7l3 3v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M14 3v4h4" />
      <path d="M9 12h6M9 16h4" />
    </svg>
  ),
  (
    <svg key="wf-1" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 16V7" />
      <path d="m8.5 10.5 3.5-3.5 3.5 3.5" />
      <rect x="4" y="16" width="16" height="4" rx="1.5" />
    </svg>
  ),
  (
    <svg key="wf-2" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="9" cy="8" r="3" />
      <path d="M4.5 18a4.5 4.5 0 0 1 9 0" />
      <path d="M16 7h4M18 5v4" />
    </svg>
  ),
  (
    <svg key="wf-3" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="m9 12 2 2 4-4" />
      <circle cx="12" cy="12" r="8" />
    </svg>
  ),
  (
    <svg key="wf-4" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 4v10" />
      <path d="m8.5 10.5 3.5 3.5 3.5-3.5" />
      <rect x="4" y="17" width="16" height="3" rx="1.5" />
    </svg>
  ),
];

type Props = {
  block: HomeWhyChooseUsBlock;
};

export function WhyChooseUsSection({ block }: Props) {
  const teamSrc = block.teamPhotoSrc.trim();
  const [activeId, setActiveId] = useState<PillarId>(PILLAR_IDS[0]);

  const pillarsUi = useMemo(
    () =>
      PILLAR_IDS.map((id, i) => ({
        id,
        title: block.pillars[i]?.title ?? "",
        body: block.pillars[i]?.body ?? "",
        icon: PILLAR_ICONS[i] ?? PILLAR_ICONS[0],
      })),
    [block.pillars],
  );

  const active = useMemo(
    () => pillarsUi.find((p) => p.id === activeId) ?? pillarsUi[0],
    [activeId, pillarsUi],
  );

  if (!active) return null;

  return (
    <div className="relative px-4 py-8 text-zinc-100 sm:px-6 sm:py-9" aria-labelledby="why-choose-heading">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[1.3fr,1fr] lg:gap-6">
        <div className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <h2
              id="why-choose-heading"
              className={`${display.className} text-balance text-[1.45rem] font-semibold tracking-tight text-white sm:text-[1.72rem]`}
            >
              {block.headline}
            </h2>
            <p
              className={`${sans.className} mt-2 text-[0.84rem] leading-relaxed text-zinc-300 sm:text-[0.9rem]`}
            >
              {block.intro}
            </p>
          </div>

          <div className="mt-5 w-full min-w-0 overflow-x-auto overflow-y-visible pb-1 [-webkit-overflow-scrolling:touch] sm:mt-6">
            <div className="mx-auto flex w-max max-w-none flex-nowrap items-center justify-center gap-3 sm:gap-4">
              {block.manualAiLabel.trim() ? (
                <span
                  className={`${sans.className} relative inline-flex shrink-0 items-center gap-2.5 overflow-hidden rounded-2xl border border-violet-400/45 bg-gradient-to-br from-violet-500/35 via-violet-500/15 to-white/[0.08] px-4 py-2.5 text-sm font-semibold text-violet-50 shadow-[0_8px_32px_-12px_rgba(139,92,246,0.55),inset_0_1px_0_0_rgba(255,255,255,0.35)] backdrop-blur-md sm:px-5 sm:py-3 sm:text-[0.9375rem]`}
                >
                  <span
                    className="pointer-events-none absolute -left-1/4 top-0 h-full w-1/2 skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-60"
                    aria-hidden
                  />
                  <span className="relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-500/35 text-violet-100 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)] ring-1 ring-white/20 sm:h-9 sm:w-9">
                    {MANUAL_AI_ICON}
                  </span>
                  <span className="relative">{block.manualAiLabel.trim()}</span>
                </span>
              ) : null}
              {[0, 1, 2].map((i) => {
                const tones = [
                  {
                    wrap: "border-sky-400/40 bg-gradient-to-br from-sky-500/30 via-sky-400/12 to-white/[0.06] text-sky-50 shadow-[0_8px_28px_-10px_rgba(56,189,248,0.45),inset_0_1px_0_0_rgba(255,255,255,0.3)]",
                    icon: "bg-sky-500/30 text-sky-100 ring-sky-300/30",
                    sheen: "via-white/20",
                  },
                  {
                    wrap: "border-emerald-400/45 bg-gradient-to-br from-emerald-500/32 via-teal-400/14 to-white/[0.07] text-emerald-50 shadow-[0_8px_28px_-10px_rgba(52,211,153,0.42),inset_0_1px_0_0_rgba(255,255,255,0.32)]",
                    icon: "bg-emerald-500/35 text-emerald-100 ring-emerald-300/35",
                    sheen: "via-emerald-200/25",
                  },
                  {
                    wrap: "border-amber-400/45 bg-gradient-to-br from-amber-500/28 via-amber-400/12 to-white/[0.06] text-amber-50 shadow-[0_8px_28px_-10px_rgba(251,191,36,0.4),inset_0_1px_0_0_rgba(255,255,255,0.28)]",
                    icon: "bg-amber-500/30 text-amber-100 ring-amber-300/35",
                    sheen: "via-amber-100/20",
                  },
                ] as const;
                const t = tones[i] ?? tones[0]!;
                return (
                  <span
                    key={`badge-${i}`}
                    className={`${sans.className} relative inline-flex shrink-0 items-center gap-2.5 overflow-hidden rounded-2xl border px-4 py-2.5 text-sm font-semibold backdrop-blur-md sm:px-5 sm:py-3 sm:text-[0.9375rem] ${t.wrap}`}
                  >
                    <span
                      className={`pointer-events-none absolute -left-1/4 top-0 h-full w-1/2 skew-x-12 bg-gradient-to-r from-transparent ${t.sheen} to-transparent opacity-50`}
                      aria-hidden
                    />
                    <span
                      className={`relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.22)] ring-1 ring-inset ring-white/15 sm:h-9 sm:w-9 ${t.icon}`}
                    >
                      {BADGE_ICONS[i]}
                    </span>
                    <span className="relative text-left">
                      {block.badges[i]?.trim() || "—"}
                    </span>
                  </span>
                );
              })}
            </div>
          </div>

          <p className={`${display.className} mt-3 text-lg font-semibold text-white`}>
            {block.easyCommunicationTitle}
          </p>
          <p className={`${sans.className} mt-1 text-[0.83rem] leading-relaxed text-zinc-300 sm:text-[0.89rem]`}>
            {block.easyCommunicationBody}
          </p>
        </div>

        <div className="relative grid gap-2 sm:grid-cols-2 lg:self-start">
          {pillarsUi.map((item) => {
            const isActive = item.id === active.id;
            return (
              <button
                key={item.id}
                type="button"
                onMouseEnter={() => setActiveId(item.id)}
                onFocus={() => setActiveId(item.id)}
                onClick={() => setActiveId(item.id)}
                className={`group relative overflow-hidden rounded-xl px-3 py-2.5 text-left backdrop-blur-sm transition duration-300 sm:last:col-span-2 ${
                  isActive
                    ? "bg-white/[0.1] shadow-[0_10px_35px_rgba(0,0,0,0.24)]"
                    : "bg-white/[0.05] hover:bg-white/[0.08]"
                }`}
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.06] to-transparent" aria-hidden />
                <div className="relative flex items-start gap-2.5">
                  <span
                    className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-zinc-100 ${
                      isActive ? "ring-1 ring-white/25" : ""
                    }`}
                  >
                    {item.icon}
                  </span>
                  <div>
                    <p className={`${display.className} text-[0.92rem] font-semibold text-white`}>
                      {item.title}
                    </p>
                    <p className={`${sans.className} mt-0.5 text-[0.78rem] leading-relaxed text-zinc-300`}>
                      {item.body}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <h3
            id="how-it-works-heading"
            className={`${display.className} text-balance text-2xl font-semibold tracking-tight text-white sm:text-[2rem]`}
          >
            {block.workflowTitle}
          </h3>
          {block.workflowIntro.trim() ? (
            <p
              className={`${sans.className} mt-3 text-base leading-relaxed text-zinc-400 sm:mt-4 sm:text-[1.05rem]`}
            >
              {block.workflowIntro.trim()}
            </p>
          ) : null}
        </div>
        <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-stretch lg:gap-8 sm:mt-6">
          <div
            className="relative aspect-[4/3] min-h-[200px] overflow-hidden rounded-2xl bg-white/[0.04] ring-1 ring-white/10"
            aria-label={teamSrc ? undefined : "Team photo placeholder"}
          >
            {teamSrc ? (
              <Image
                src={teamSrc}
                alt={block.teamPhotoAlt.trim() || "Team photo"}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 100vw"
                unoptimized={isUploadedAsset(teamSrc)}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-white/[0.07] to-transparent px-4 text-center">
                <svg
                  viewBox="0 0 24 24"
                  className="h-10 w-10 text-zinc-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  aria-hidden
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <circle cx="8.5" cy="10" r="1.5" />
                  <path d="M3 17l5-5 4 4 5-6 4 4" />
                </svg>
                <p className={`${sans.className} text-sm text-zinc-500`}>
                  Add your group photo in Admin → Home page
                </p>
              </div>
            )}
          </div>

          <div className="grid min-w-0 gap-0 rounded-2xl bg-black/25 ring-1 ring-white/10 sm:grid-cols-2">
            {block.workflowSteps.slice(0, 4).map((step, idx) => (
              <article
                key={`wf-${idx}`}
                className={`flex min-w-0 items-center gap-3 px-3 py-4 sm:px-4 ${
                  idx % 2 === 0 ? "sm:border-r sm:border-dashed sm:border-white/20" : ""
                } ${idx < 2 ? "border-b border-dashed border-white/20" : ""}`}
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#0b1031] shadow-[0_8px_22px_rgba(255,255,255,0.14)]">
                  {WORKFLOW_ICONS[idx]}
                </span>
                <span className="min-w-0">
                  <p className={`${display.className} text-[0.98rem] font-semibold leading-snug text-white`}>
                    {step.title}
                  </p>
                  <p className={`${sans.className} text-[0.8125rem] text-zinc-400`}>{step.subtitle}</p>
                </span>
              </article>
            ))}
            {block.workflowSteps[4] ? (
              <article className="col-span-full flex items-center gap-3 border-t border-dashed border-white/20 px-3 py-4 sm:px-4">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#0b1031] shadow-[0_8px_22px_rgba(255,255,255,0.14)]">
                  {WORKFLOW_ICONS[4]}
                </span>
                <span className="min-w-0">
                  <p className={`${display.className} text-[0.98rem] font-semibold leading-snug text-white`}>
                    {block.workflowSteps[4].title}
                  </p>
                  <p className={`${sans.className} text-[0.8125rem] text-zinc-400`}>
                    {block.workflowSteps[4].subtitle}
                  </p>
                </span>
              </article>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
