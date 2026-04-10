"use client";

import { display, sans } from "@/app/fonts";
import {
  isUploadedAsset,
  type HomeReviewItem,
  type HomeReviewsBlock,
} from "@/lib/cms-types";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const PREVIEW_LEN = 140;

const AVATAR_GRADIENTS = [
  "from-amber-600 to-orange-500",
  "from-violet-500 to-indigo-500",
  "from-emerald-600 to-teal-500",
  "from-rose-600 to-amber-700",
  "from-sky-500 to-blue-600",
  "from-fuchsia-600 to-orange-500",
] as const;

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function initialsFromName(name: string): string {
  const p = name.trim().split(/\s+/).filter(Boolean);
  if (p.length === 0) return "?";
  if (p.length === 1) return p[0]!.slice(0, 2).toUpperCase();
  return (p[0]!.slice(0, 1) + p[p.length - 1]!.slice(0, 1)).toUpperCase();
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const fn = () => setReduced(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return reduced;
}

function IconChevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {dir === "left" ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
    </svg>
  );
}

function IconGoogle() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303C33.736 32.657 29.223 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.058 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917Z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691 12.878 19.51C14.654 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.058 6.053 29.268 4 24 4 16.318 4 9.656 8.33 6.306 14.691Z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.197l-6.19-5.238C29.247 35.373 26.775 36 24 36c-5.203 0-9.704-3.317-11.28-7.946l-6.522 5.024C9.505 39.556 16.227 44 24 44Z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.084 5.565l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917Z"
      />
    </svg>
  );
}

function StarsDark({ value, label }: { value: number; label: string }) {
  const full = Math.min(5, Math.max(0, Math.round(value)));
  return (
    <div className="flex gap-0.5" role="img" aria-label={label}>
      {Array.from({ length: 5 }, (_, i) => {
        const on = i < full;
        return (
          <svg
            key={i}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill={on ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={on ? 0 : 1.5}
            className={on ? "text-amber-400" : "text-white/25"}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
            />
          </svg>
        );
      })}
    </div>
  );
}

function ClientAvatar({
  item,
  gradient,
  className,
}: {
  item: HomeReviewItem;
  gradient: string;
  className?: string;
}) {
  const src = item.avatarSrc?.trim();
  if (src) {
    return (
      <Image
        src={src}
        alt={item.name}
        width={96}
        height={96}
        className={`shrink-0 rounded-full object-cover ${className ?? ""}`}
        unoptimized={isUploadedAsset(src)}
      />
    );
  }
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-semibold text-white ${gradient} ${sans.className} ${className ?? ""}`}
      aria-hidden
    >
      {initialsFromName(item.name)}
    </div>
  );
}

function AvatarSmall({ item }: { item: HomeReviewItem }) {
  const g =
    AVATAR_GRADIENTS[hashString(item.name) % AVATAR_GRADIENTS.length] ??
    AVATAR_GRADIENTS[0];
  return (
    <ClientAvatar
      item={item}
      gradient={g}
      className="h-9 w-9 ring-2 ring-white/15 sm:h-10 sm:w-10"
    />
  );
}

function ReviewQuote({ quote }: { quote: string }) {
  const full = quote.trim();
  const needsToggle = full.length > PREVIEW_LEN;
  const [expanded, setExpanded] = useState(false);

  const text =
    needsToggle && !expanded
      ? `${full.slice(0, PREVIEW_LEN).trim()}…`
      : full;

  return (
    <div className="mt-3">
      <p
        className={`${sans.className} text-[0.8125rem] leading-relaxed text-zinc-300 sm:text-sm`}
      >
        {text}
      </p>
      {needsToggle ? (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className={`${sans.className} mt-2 text-left text-xs font-semibold text-[var(--accent)] transition hover:text-[var(--accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]`}
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      ) : null}
    </div>
  );
}

type Props = {
  block: HomeReviewsBlock;
  embedded?: boolean;
};

export function HomeReviews({ block, embedded = false }: Props) {
  const reducedMotion = usePrefersReducedMotion();
  const items = useMemo(
    () =>
      block.items.filter(
        (r) => r.quote.trim().length > 0 && r.name.trim().length > 0,
      ),
    [block.items],
  );
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const scrollByCards = useCallback((dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const first = el.querySelector<HTMLElement>("[data-review-card]");
    if (!first) return;
    const style = window.getComputedStyle(el);
    const gap = Number.parseFloat(style.columnGap || style.gap || "0") || 0;
    const w = first.offsetWidth + gap;
    el.scrollBy({ left: dir * w, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    if (items.length <= 1) return;
    const t = window.setInterval(() => {
      scrollByCards(1);
    }, 6500);
    return () => window.clearInterval(t);
  }, [items.length, reducedMotion, scrollByCards]);

  if (items.length === 0) return null;

  return (
    <section
      className={
        embedded
          ? "relative z-10 border-t-0 bg-transparent pb-14 pt-10 text-white sm:pb-16 sm:pt-12"
          : "relative z-20 border-t border-white/[0.06] bg-[#0a0a0a] py-14 text-white sm:py-16"
      }
      aria-labelledby="home-reviews-heading"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <h2
          id="home-reviews-heading"
          className={`${display.className} text-balance text-center text-2xl font-semibold tracking-tight text-white sm:text-3xl`}
        >
          {block.title.trim() || "Customer Reviews"}
        </h2>
      </div>

      <div className="relative mx-auto mt-8 max-w-7xl px-4 sm:mt-10 sm:px-6">
        <div className="relative">
          <button
            type="button"
            onClick={() => scrollByCards(-1)}
            disabled={items.length <= 1}
            className="absolute left-0 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white shadow-lg backdrop-blur-md transition hover:bg-white/18 disabled:opacity-40 md:inline-flex lg:left-1"
            aria-label="Scroll reviews left"
          >
            <IconChevron dir="left" />
          </button>

          <button
            type="button"
            onClick={() => scrollByCards(1)}
            disabled={items.length <= 1}
            className="absolute right-0 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white shadow-lg backdrop-blur-md transition hover:bg-white/18 disabled:opacity-40 md:inline-flex lg:right-1"
            aria-label="Scroll reviews right"
          >
            <IconChevron dir="right" />
          </button>

          <div
            ref={scrollerRef}
            className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 pl-1 pr-1 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-4 md:px-10 [&::-webkit-scrollbar]:hidden"
          >
            {items.map((it, idx) => {
              const r = Math.min(
                5,
                Math.max(1, Math.round(Number(it.rating) || 5)),
              );

              return (
                <article
                  key={`${it.name}-${idx}`}
                  data-review-card
                  className="relative w-[min(78vw,252px)] shrink-0 snap-start rounded-2xl border border-white/[0.12] bg-white/[0.07] p-4 shadow-[0_12px_40px_-18px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:w-[min(42vw,268px)] lg:w-[260px]"
                >
                  <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.08] to-transparent" aria-hidden />

                  <div className="relative flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-start gap-2.5">
                      <div className="mt-0.5 shrink-0">
                        <AvatarSmall item={it} />
                      </div>
                      <div className="min-w-0">
                        <p
                          className={`${display.className} truncate text-[0.8125rem] font-semibold text-white sm:text-sm`}
                        >
                          {it.name}
                        </p>
                        {it.role.trim() ? (
                          <p
                            className={`${sans.className} mt-0.5 truncate text-[10px] text-zinc-400 sm:text-[11px]`}
                          >
                            {it.role.trim()}
                          </p>
                        ) : null}
                        <div className="mt-1 flex flex-wrap items-center gap-1.5">
                          <StarsDark value={r} label={`${r} out of 5 stars`} />
                          <span
                            className={`${sans.className} text-[10px] text-zinc-500 sm:text-[11px]`}
                          >
                            {r}.0
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      className="flex shrink-0 items-center justify-center rounded-full bg-white/12 p-1.5 ring-1 ring-white/10"
                      title="Google review"
                    >
                      <IconGoogle />
                    </div>
                  </div>

                  <ReviewQuote quote={it.quote} />
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
