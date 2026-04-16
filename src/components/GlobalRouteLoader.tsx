"use client";

import { useEffect, useState } from "react";

type Props = {
  carSrc?: string;
  /** Prevent flash on fast route transitions. */
  revealDelayMs?: number;
};

export function GlobalRouteLoader({ carSrc = "", revealDelayMs = 140 }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), revealDelayMs);
    return () => window.clearTimeout(timer);
  }, [revealDelayMs]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-[3px]">
      <div
        className="flex flex-col items-center gap-4"
        role="status"
        aria-live="polite"
        aria-label="Loading page"
      >
        <div className="relative h-44 w-44 sm:h-48 sm:w-48">
          <div className="route-loader-spin absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,rgba(255,255,255,0.06),rgba(224,122,69,1),rgba(255,255,255,0.06))]" />
          <div className="absolute inset-[4px] rounded-full bg-black/75 p-[6px]">
            <div className="relative h-full w-full overflow-hidden rounded-full border border-white/15 bg-black/65">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.08),transparent_62%)]" />
              {carSrc.trim().length > 0 ? (
                <div className="route-loader-car-motion absolute inset-0 flex items-center justify-center">
                  <img
                    src={carSrc}
                    alt=""
                    draggable={false}
                    loading="eager"
                    decoding="async"
                    className="pointer-events-none h-auto w-[170%] max-w-none select-none object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.55)]"
                  />
                </div>
              ) : (
                <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)] shadow-[0_0_14px_2px_rgba(224,122,69,0.7)]" />
              )}
            </div>
          </div>
        </div>
        <p className="text-sm font-medium tracking-wide text-white/85">
          Loading...
        </p>
        <div className="flex items-center gap-1.5" aria-hidden>
          <span className="route-loader-dot h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          <span className="route-loader-dot h-1.5 w-1.5 rounded-full bg-[var(--accent)] [animation-delay:120ms]" />
          <span className="route-loader-dot h-1.5 w-1.5 rounded-full bg-[var(--accent)] [animation-delay:240ms]" />
        </div>
      </div>
    </div>
  );
}
