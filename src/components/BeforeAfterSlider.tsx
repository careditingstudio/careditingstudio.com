"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { isUploadedAsset } from "@/lib/cms-types";

type BeforeAfterSliderProps = {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  className?: string;
  priority?: boolean;
};

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  className = "",
  priority = false,
}: BeforeAfterSliderProps) {
  const unopt =
    isUploadedAsset(beforeSrc) || isUploadedAsset(afterSrc);
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

  const onKeyDown = (e: React.KeyboardEvent) => {
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
      className={`relative aspect-[4/3] w-full max-w-none cursor-ew-resize touch-none select-none overflow-hidden rounded-2xl bg-zinc-200 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.18)] ring-1 ring-[var(--line-strong)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:bg-zinc-800 dark:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.45)] ${className}`}
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
        sizes="(max-width: 1024px) 100vw, 50vw"
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
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          draggable={false}
        />
      </div>

      <div
        className="pointer-events-none absolute inset-y-0 z-[2] w-px"
        style={{ left: `${percent}%`, transform: "translateX(-50%)" }}
        aria-hidden
      >
        <div className="h-full w-px bg-white/95 shadow-[0_0_12px_rgba(0,0,0,0.25)]" />
        <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-[var(--foreground)] text-[var(--background)] shadow-lg">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <path d="M15 7.5 10.5 12 15 16.5V7.5ZM9 7.5 4.5 12 9 16.5V7.5Z" />
          </svg>
        </div>
      </div>

      <div
        className="pointer-events-none absolute left-3 top-1/2 z-[3] -translate-y-1/2 rounded-md bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm"
        aria-hidden
      >
        Before
      </div>
      <div
        className="pointer-events-none absolute right-3 top-1/2 z-[3] -translate-y-1/2 rounded-md bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm"
        aria-hidden
      >
        After
      </div>
    </div>
  );
}
