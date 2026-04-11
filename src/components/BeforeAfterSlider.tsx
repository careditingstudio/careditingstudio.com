"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { isCloudinaryUrl, isUploadedAsset } from "@/lib/cms-types";

export function BeforeAfterSliderHeader() {
  return (
    <header className="mx-auto mb-[clamp(2.5rem,6vw,3.75rem)] max-w-3xl text-center">
      <h2 className="text-balance text-2xl font-bold leading-tight text-[var(--foreground)] sm:text-3xl">
        Elevate Your Car Images with Expert Editing
        <br className="hidden sm:inline" />
        <span className="mt-2 block text-lg font-medium text-[var(--accent)] sm:text-xl">
          for E-Commerce and Businesses
        </span>
      </h2>
    </header>
  );
}

type BeforeAfterSliderProps = {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  /** Home: landscape; legacy square; portfolio: square tile (grid). */
  layout?: "landscape" | "square" | "portfolio";
  className?: string;
  priority?: boolean;
};

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  layout = "landscape",
  className = "",
  priority = false,
}: BeforeAfterSliderProps) {
  const unopt =
    isUploadedAsset(beforeSrc) ||
    isUploadedAsset(afterSrc) ||
    !isCloudinaryUrl(beforeSrc) ||
    !isCloudinaryUrl(afterSrc);
  const aspectClass =
    layout === "square" || layout === "portfolio"
      ? "aspect-square"
      : "aspect-[4/3]";
  const imageSizes =
    layout === "square" || layout === "portfolio"
      ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      : "(max-width: 1024px) 100vw, 50vw";
  const id = useId();
  const labelId = `${id}-label`;
  const containerRef = useRef<HTMLDivElement>(null);
  const [percent, setPercent] = useState(50);
  const [dragging, setDragging] = useState(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const w = rect.width || 1;
    const x = clientX - rect.left;
    setPercent(Math.min(100, Math.max(0, (x / w) * 100)));
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const move = (e: PointerEvent) => setFromClientX(e.clientX);
    const up = () => setDragging(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [dragging, setFromClientX]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPercent((p) => Math.max(0, p - 5));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setPercent((p) => Math.min(100, p + 5));
    } else if (e.key === "Home") {
      e.preventDefault();
      setPercent(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setPercent(100);
    }
  };

  return (
    <div
      ref={containerRef}
      role="slider"
      tabIndex={0}
      aria-labelledby={labelId}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(percent)}
      aria-valuetext={`${Math.round(percent)} percent before visible`}
      className={`group relative ${aspectClass} w-full max-w-none cursor-ew-resize touch-none select-none overflow-hidden rounded-3xl bg-zinc-200 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.18)] ring-1 ring-black/10 outline-none transition-shadow duration-300 focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:bg-zinc-800 dark:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.45)] dark:ring-white/10 ${className}`}
      onPointerDown={(e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        (e.currentTarget as HTMLElement).focus();
        setDragging(true);
        setFromClientX(e.clientX);
      }}
      onKeyDown={onKeyDown}
    >
      <span id={labelId} className="sr-only">
        {beforeAlt}. Compared with: {afterAlt}. Drag horizontally or use arrow
        keys to reveal more before or after.
      </span>

      <Image
        src={afterSrc}
        alt={afterAlt}
        fill
        priority={priority}
        unoptimized={unopt}
        sizes={imageSizes}
        className="pointer-events-none object-cover"
        draggable={false}
      />

      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ clipPath: `inset(0 ${100 - percent}% 0 0)` }}
        aria-hidden
      >
        <Image
          src={beforeSrc}
          alt=""
          fill
          priority={priority}
          unoptimized={unopt}
          sizes={imageSizes}
          className="object-cover"
          draggable={false}
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-[2] bg-black/0 transition-colors duration-300 group-hover:bg-black/30 group-focus-within:bg-black/30"
        aria-hidden
      />

      {/* Divider gaps at ring (56px ø → 28px radius); line does not cross transparent center */}
      <div
        className="pointer-events-none absolute z-[3] w-0"
        style={{
          left: `${percent}%`,
          transform: "translateX(-50%)",
          top: 0,
          bottom: 0,
        }}
        aria-hidden
      >
        <div
          className="absolute left-1/2 top-0 w-[4px] -translate-x-1/2 bg-white shadow-[0_0_8px_rgba(0,0,0,0.32),0_0_1px_rgba(0,0,0,0.18)]"
          style={{ height: "calc(50% - 28px)" }}
        />
        <div
          className="absolute bottom-0 left-1/2 w-[4px] -translate-x-1/2 bg-white shadow-[0_0_8px_rgba(0,0,0,0.32),0_0_1px_rgba(0,0,0,0.18)]"
          style={{ height: "calc(50% - 28px)" }}
        />
        <div className="absolute left-1/2 top-1/2 z-[1] flex h-[56px] w-[56px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-white bg-transparent shadow-[0_4px_22px_rgba(0,0,0,0.45)]">
          <svg
            width="32"
            height="18"
            viewBox="0 0 32 18"
            fill="white"
            aria-hidden
            className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
          >
            <path d="M5 9 13 2.5 13 15.5 5 9Z" />
            <path d="M27 9 19 2.5 19 15.5 27 9Z" />
          </svg>
        </div>
      </div>

      <div
        className="pointer-events-none absolute left-4 top-1/2 z-[4] -translate-y-1/2 opacity-0 transition-all duration-300 group-hover:opacity-100 group-focus-within:opacity-100"
        aria-hidden
      >
        <span className="inline-block rounded-lg border border-white/25 bg-black/35 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white shadow-lg backdrop-blur-md [text-shadow:0_1px_2px_rgba(0,0,0,0.6)]">
          Before
        </span>
      </div>
      <div
        className="pointer-events-none absolute right-4 top-1/2 z-[4] -translate-y-1/2 opacity-0 transition-all duration-300 group-hover:opacity-100 group-focus-within:opacity-100"
        aria-hidden
      >
        <span className="inline-block rounded-lg border border-white/25 bg-black/35 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white shadow-lg backdrop-blur-md [text-shadow:0_1px_2px_rgba(0,0,0,0.6)]">
          After
        </span>
      </div>
    </div>
  );
}
