"use client";

import { AdminFloatingCarEditModal } from "@/components/admin/AdminFloatingCarEditModal";
import { AdminHeroEditModal } from "@/components/admin/AdminHeroEditModal";
import { AdminHomeFeaturedPortfolioModal } from "@/components/admin/AdminHomeFeaturedPortfolioModal";
import { AdminServiceFeaturesEditModal } from "@/components/admin/AdminServiceFeaturesEditModal";
import { AdminWhyChooseUsEditModal } from "@/components/admin/AdminWhyChooseUsEditModal";
import { BeforeAfterPostEditModal } from "@/components/admin/BeforeAfterPostEditModal";
import { HomeReviewEditModal } from "@/components/admin/HomeReviewEditModal";
import { HomeReviewsSectionEditModal } from "@/components/admin/HomeReviewsSectionEditModal";
import { MediaLibraryModal } from "@/components/admin/MediaLibraryModal";
import { useAdminCms } from "@/components/admin/AdminCmsContext";
import { isUploadedAsset } from "@/lib/cms-types";
import { ServiceFeatureIcon } from "@/lib/service-feature-icons";
import Image from "next/image";
import { useRef, useState, type ReactNode } from "react";

function resolvedImageSrc(raw: string): string | null {
  const s = raw.trim();
  return s.length > 0 ? s : null;
}

function HomeEditSection({
  id,
  title,
  description,
  onEdit,
  children,
}: {
  id?: string;
  title: string;
  description?: string;
  onEdit: () => void;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-8 rounded-2xl border border-zinc-800/90 bg-gradient-to-b from-zinc-900/40 to-zinc-950/90 p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-semibold tracking-tight text-white">
            {title}
          </h2>
          {description ? (
            <p className="mt-1 max-w-xl text-xs leading-relaxed text-zinc-500">
              {description}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="shrink-0 rounded-lg border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-4 py-2 text-xs font-medium text-[var(--accent)] hover:bg-[var(--accent)]/20"
        >
          Edit
        </button>
      </div>
      <div className="mt-5 border-t border-zinc-800/80 pt-5">{children}</div>
    </section>
  );
}

export function AdminHomePageContent() {
  const {
    cms,
    moveBeforeAfterPost,
    removePair,
    addPair,
    setPair,
    patchHomeReviews,
    setHomeReviewItem,
    addHomeReview,
    removeHomeReview,
    moveHomeReview,
    setFlash,
  } = useAdminCms();
  const pickHandlerRef = useRef<(url: string) => void>(() => {});
  const [mediaOpen, setMediaOpen] = useState(false);
  const [heroOpen, setHeroOpen] = useState(false);
  const [floatingCarOpen, setFloatingCarOpen] = useState(false);
  const [serviceFeaturesOpen, setServiceFeaturesOpen] = useState(false);
  const [whyOpen, setWhyOpen] = useState(false);
  const [portfolioSlotsOpen, setPortfolioSlotsOpen] = useState(false);
  const [editPostIndex, setEditPostIndex] = useState<number | null>(null);
  const [reviewsSectionOpen, setReviewsSectionOpen] = useState(false);
  const [editReviewIndex, setEditReviewIndex] = useState<number | null>(null);

  function openMediaPicker(onChosen: (url: string) => void) {
    pickHandlerRef.current = onChosen;
    setMediaOpen(true);
  }

  function reorderBeforeAfter(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (!cms || j < 0 || j >= cms.beforeAfter.length) return;
    moveBeforeAfterPost(i, dir);
    setEditPostIndex((cur) => {
      if (cur === null) return null;
      if (cur === i) return j;
      if (cur === j) return i;
      return cur;
    });
  }

  if (!cms) return null;

  const sf = cms.homeServiceFeatures;
  const wu = cms.homeWhyChooseUs;

  return (
    <div className="mx-auto max-w-5xl space-y-5 pb-8">
      <MediaLibraryModal
        open={mediaOpen}
        onClose={() => setMediaOpen(false)}
        onPick={(url) => {
          pickHandlerRef.current(url);
          setMediaOpen(false);
        }}
        title="Choose image"
      />

      <AdminHeroEditModal
        open={heroOpen}
        onClose={() => setHeroOpen(false)}
        openMediaPicker={openMediaPicker}
      />
      <AdminFloatingCarEditModal
        open={floatingCarOpen}
        onClose={() => setFloatingCarOpen(false)}
        openMediaPicker={openMediaPicker}
      />
      <AdminServiceFeaturesEditModal
        open={serviceFeaturesOpen}
        onClose={() => setServiceFeaturesOpen(false)}
      />
      <AdminWhyChooseUsEditModal
        open={whyOpen}
        onClose={() => setWhyOpen(false)}
        openMediaPicker={openMediaPicker}
      />
      <AdminHomeFeaturedPortfolioModal
        open={portfolioSlotsOpen}
        onClose={() => setPortfolioSlotsOpen(false)}
      />

      <header className="rounded-2xl border border-zinc-800/80 bg-zinc-950/50 px-5 py-4 sm:px-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
          Homepage
        </p>
        <h1 className="mt-1 text-lg font-semibold text-white">
          Match the live page order — edit each block in a popup
        </h1>
        <p className="mt-2 max-w-2xl text-xs leading-relaxed text-zinc-500">
          Previews update as you type inside an editor. Publish from the bar when you
          are ready.
        </p>
      </header>

      <HomeEditSection
        id="hero-banners"
        title="Hero banner"
        description="Rotating full-width backgrounds behind the homepage headline."
        onEdit={() => setHeroOpen(true)}
      >
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-2">
            {cms.heroBanners.slice(0, 8).map((url, i) => {
              const src = resolvedImageSrc(url);
              return (
                <div
                  key={`pv-b-${i}`}
                  className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-zinc-700 bg-black"
                >
                  {src ? (
                    <Image
                      src={src}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="80px"
                      unoptimized={isUploadedAsset(src)}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[9px] text-zinc-600">
                      —
                    </div>
                  )}
                </div>
              );
            })}
            {cms.heroBanners.length === 0 ? (
              <span className="text-xs text-zinc-600">No banners yet</span>
            ) : null}
          </div>
          <p className="text-xs text-zinc-500">
            <span className="font-medium text-zinc-300">
              {cms.heroBanners.length} banner
              {cms.heroBanners.length === 1 ? "" : "s"}
            </span>
            {cms.heroBanners.length > 8 ? (
              <span className="text-zinc-600">
                {" "}
                (showing first 8)
              </span>
            ) : null}
          </p>
        </div>
      </HomeEditSection>

      <HomeEditSection
        id="floating-car"
        title="Intro floating car"
        description="PNG cutout on the dark band below the hero — text on the left, vehicle on the right. Edit to upload or pick from the library."
        onEdit={() => setFloatingCarOpen(true)}
      >
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg border border-zinc-700 bg-black">
            {resolvedImageSrc(cms.floatingCar) ? (
              <Image
                src={resolvedImageSrc(cms.floatingCar)!}
                alt=""
                fill
                className="object-contain p-0.5"
                sizes="112px"
                unoptimized={isUploadedAsset(resolvedImageSrc(cms.floatingCar)!)}
              />
            ) : (
              <div className="flex h-full items-center justify-center px-1 text-center text-[9px] text-zinc-600">
                —
              </div>
            )}
          </div>
          <p className="text-xs text-zinc-500">
            <span className="font-medium text-zinc-300">
              {cms.floatingCar.trim() ? "Image set" : "No image"}
            </span>
            {" · "}
            <span className="text-zinc-600">Edit to upload or choose</span>
          </p>
        </div>
      </HomeEditSection>

      <HomeEditSection
        id="service-features"
        title="Service features"
        description="Intro, grid cards, CTA, and the heading above the before/after examples."
        onEdit={() => setServiceFeaturesOpen(true)}
      >
        <div className="space-y-3">
          <p className="text-sm font-medium text-zinc-200">
            {sf.sectionTitle.trim() || "Untitled section"}
          </p>
          <p className="line-clamp-2 text-xs text-zinc-500">
            {sf.intro.trim() || "No intro"}
          </p>
          <div className="flex flex-wrap gap-2">
            {sf.items.slice(0, 4).map((card, i) => (
              <div
                key={`pv-sf-${i}`}
                className="flex max-w-[11rem] items-start gap-2 rounded-lg border border-zinc-800/90 bg-zinc-900/50 px-2.5 py-2"
              >
                <ServiceFeatureIcon
                  iconKey={card.iconKey}
                  className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]"
                />
                <span className="line-clamp-2 text-[11px] leading-snug text-zinc-400">
                  {card.title.trim() || "Card"}
                </span>
              </div>
            ))}
            {sf.items.length > 4 ? (
              <span className="self-center text-[11px] text-zinc-600">
                +{sf.items.length - 4} more
              </span>
            ) : null}
          </div>
          <p className="text-[11px] text-zinc-600">
            {sf.items.length} card{sf.items.length === 1 ? "" : "s"} · CTA:{" "}
            <span className="text-zinc-500">
              {sf.ctaLabel.trim() || "—"}
            </span>
          </p>
        </div>
      </HomeEditSection>

      <section
        className="scroll-mt-8 rounded-2xl border border-zinc-800/90 bg-gradient-to-b from-zinc-900/40 to-zinc-950/90 p-5 sm:p-6"
        id="before-after"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-white">Before / after</h2>
            <p className="mt-1 max-w-xl text-xs text-zinc-500">
              Section titles are edited under Service features. Use Edit on each row
              for images and copy.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              const next = cms.beforeAfter.length;
              addPair();
              setEditPostIndex(next);
            }}
            className="shrink-0 rounded-lg border border-zinc-600 px-3 py-2 text-xs font-medium text-zinc-200 hover:bg-zinc-800"
          >
            + Add example
          </button>
        </div>

        {editPostIndex !== null && cms.beforeAfter[editPostIndex] ? (
          <BeforeAfterPostEditModal
            open
            postIndex={editPostIndex}
            pair={cms.beforeAfter[editPostIndex]}
            onClose={() => setEditPostIndex(null)}
            setPairPatch={(patch) => {
              const idx = editPostIndex;
              if (idx !== null) setPair(idx, patch);
            }}
            pickFromLibrary={(cb) => openMediaPicker(cb)}
            setFlash={setFlash}
            onDelete={() => {
              const idx = editPostIndex;
              if (idx !== null) removePair(idx);
              setEditPostIndex(null);
            }}
          />
        ) : null}

        <ul className="mt-5 space-y-1.5 border-t border-zinc-800/80 pt-5">
          {cms.beforeAfter.length === 0 ? (
            <li className="rounded-lg border border-zinc-800/80 px-3 py-5 text-center text-[11px] text-zinc-600">
              No examples yet — add one or edit under Service features for section
              headings.
            </li>
          ) : (
            cms.beforeAfter.map((pair, i) => (
              <li
                key={`ba-${i}`}
                className="flex items-center gap-3 rounded-lg border border-zinc-800/90 bg-zinc-900/40 px-3 py-2"
              >
                <span className="w-5 shrink-0 text-center text-[10px] font-medium text-zinc-600">
                  {i + 1}
                </span>
                <div className="flex shrink-0 flex-col gap-0.5">
                  <button
                    type="button"
                    aria-label="Move up"
                    disabled={i === 0}
                    onClick={() => reorderBeforeAfter(i, -1)}
                    className="rounded border border-zinc-700 px-1.5 py-0.5 text-[10px] text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-25"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    aria-label="Move down"
                    disabled={i === cms.beforeAfter.length - 1}
                    onClick={() => reorderBeforeAfter(i, 1)}
                    className="rounded border border-zinc-700 px-1.5 py-0.5 text-[10px] text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-25"
                  >
                    ↓
                  </button>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs text-zinc-200">
                    {pair.title.trim() || "Untitled"}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setEditPostIndex(i)}
                    className="rounded-md border border-zinc-600 bg-zinc-800/60 px-2.5 py-1 text-[11px] font-medium text-zinc-200 hover:border-[var(--accent)]/40 hover:text-white"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      removePair(i);
                      if (editPostIndex === i) setEditPostIndex(null);
                      if (editPostIndex !== null && editPostIndex > i) {
                        setEditPostIndex(editPostIndex - 1);
                      }
                    }}
                    className="rounded-md px-2 py-1 text-[11px] text-zinc-500 hover:text-red-400"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </section>

      <HomeEditSection
        id="why-choose-us"
        title="Why choose us & how it works"
        description="Headline, pillars, workflow, team photo, and portfolio strip wording."
        onEdit={() => setWhyOpen(true)}
      >
        <div className="space-y-2">
          <p className="text-sm font-medium text-zinc-200">
            {wu.headline.trim() || "No headline"}
          </p>
          <p className="line-clamp-2 text-xs text-zinc-500">
            {wu.intro.trim() || "No intro"}
          </p>
          <p className="text-[11px] text-zinc-600">
            {wu.pillars.length} pillar cards · {wu.workflowSteps.length} workflow
            steps
          </p>
        </div>
      </HomeEditSection>

      <HomeEditSection
        id="home-featured-portfolio"
        title="Homepage portfolio slots"
        description="Which portfolio tiles appear in slots 1–5 on the strip."
        onEdit={() => setPortfolioSlotsOpen(true)}
      >
        <p className="text-xs text-zinc-500">
          {cms.portfolioGrid.length === 0
            ? "No portfolio items — add rows under Portfolio in the sidebar."
            : (cms.homeFeaturedPortfolioOrder?.length ?? 0) > 0
              ? `${cms.homeFeaturedPortfolioOrder!.length} featured in order · ${cms.portfolioGrid.length} portfolio row(s) total`
              : `Auto (first complete tiles) · ${cms.portfolioGrid.length} portfolio row(s) total`}
        </p>
      </HomeEditSection>

      <HomeEditSection
        id="home-reviews"
        title="Reviews strip"
        description="Auto-scrolling testimonials above the footer."
        onEdit={() => setReviewsSectionOpen(true)}
      >
        <HomeReviewsSectionEditModal
          open={reviewsSectionOpen}
          onClose={() => setReviewsSectionOpen(false)}
          block={cms.homeReviews}
          patch={patchHomeReviews}
        />

        {editReviewIndex !== null && cms.homeReviews.items[editReviewIndex] ? (
          <HomeReviewEditModal
            open
            onClose={() => setEditReviewIndex(null)}
            index={editReviewIndex}
            item={cms.homeReviews.items[editReviewIndex]!}
            setPatch={(patch) => setHomeReviewItem(editReviewIndex, patch)}
            pickFromLibrary={(cb) => openMediaPicker(cb)}
            setFlash={setFlash}
            onDelete={() => {
              removeHomeReview(editReviewIndex);
              setEditReviewIndex(null);
            }}
          />
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-600">
            {cms.homeReviews.items.length} review
            {cms.homeReviews.items.length === 1 ? "" : "s"}
          </p>
          <button
            type="button"
            onClick={() => {
              addHomeReview();
              setEditReviewIndex(cms.homeReviews.items.length);
            }}
            className="rounded-lg border border-zinc-600 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800"
          >
            + Add review
          </button>
        </div>

        <ul className="mt-3 space-y-1.5">
          {cms.homeReviews.items.length === 0 ? (
            <li className="rounded-lg border border-zinc-800/80 px-3 py-5 text-center text-[11px] text-zinc-600">
              No reviews yet — add one to show the strip on the live site.
            </li>
          ) : (
            cms.homeReviews.items.map((rev, i) => {
              const preview =
                rev.quote.trim().slice(0, 72) +
                (rev.quote.trim().length > 72 ? "…" : "");
              return (
                <li
                  key={`rev-${i}-${rev.name}`}
                  className="flex items-center gap-3 rounded-lg border border-zinc-800/90 bg-zinc-900/40 px-3 py-2"
                >
                  <span className="w-5 shrink-0 text-center text-[10px] font-medium text-zinc-600">
                    {i + 1}
                  </span>
                  <div className="flex shrink-0 flex-col gap-0.5">
                    <button
                      type="button"
                      aria-label="Move up"
                      disabled={i === 0}
                      onClick={() => moveHomeReview(i, -1)}
                      className="rounded border border-zinc-700 px-1.5 py-0.5 text-[10px] text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-25"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      aria-label="Move down"
                      disabled={i === cms.homeReviews.items.length - 1}
                      onClick={() => moveHomeReview(i, 1)}
                      className="rounded border border-zinc-700 px-1.5 py-0.5 text-[10px] text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-25"
                    >
                      ↓
                    </button>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-zinc-200">
                      {rev.name.trim() || "Unnamed"}{" "}
                      <span className="font-normal text-zinc-500">
                        · {rev.rating}★
                      </span>
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-[11px] text-zinc-500">
                      {preview || "—"}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEditReviewIndex(i)}
                      className="rounded-md border border-zinc-600 bg-zinc-800/60 px-2.5 py-1 text-[11px] font-medium text-zinc-200 hover:border-[var(--accent)]/40 hover:text-white"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        removeHomeReview(i);
                        if (editReviewIndex === i) setEditReviewIndex(null);
                        if (
                          editReviewIndex !== null &&
                          editReviewIndex > i
                        ) {
                          setEditReviewIndex(editReviewIndex - 1);
                        }
                      }}
                      className="rounded-md px-2 py-1 text-[11px] text-zinc-500 hover:text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </HomeEditSection>
    </div>
  );
}
