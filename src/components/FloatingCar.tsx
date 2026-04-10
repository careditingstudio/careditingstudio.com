"use client";

import { useEffect, useState } from "react";

const REVEAL_DISTANCE = 70;
const FADE_DISTANCE = 220;

type Props = {
  bandBottom: string;
  src: string;
  width?: number;
  height?: number;
  sizes: string;
};

export function FloatingCar({ bandBottom, src, width = 960, height = 540, sizes }: Props) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!src.trim()) return null;

  const reveal = Math.min(1, Math.max(0, scrollY / REVEAL_DISTANCE));
  const fadeProgress = Math.min(
    1,
    Math.max(0, (scrollY - REVEAL_DISTANCE) / FADE_DISTANCE),
  );
  const appearScale = 0.72 + 0.28 * reveal;
  const shrinkScale = 1 - 0.42 * fadeProgress;
  const scale = appearScale * shrinkScale;
  const appearOpacity = reveal;
  const fadeOpacity = Math.max(0, 1 - 1.05 * fadeProgress);
  const opacity = appearOpacity * fadeOpacity;
  const pointerEvents = opacity < 0.08 ? "none" : "auto";

  return (
    <div
      className="fixed left-1/2 z-[35] w-[min(80vw,500px)] max-w-[500px] sm:w-[min(76vw,540px)] sm:max-w-[540px]"
      style={{
        top: bandBottom,
        transform: "translateX(-50%)",
        pointerEvents,
      }}
      aria-hidden
    >
      <div
        className="motion-safe:transition-[transform,opacity] motion-safe:duration-300 motion-safe:ease-out motion-reduce:transition-none"
        style={{
          transform: `translateY(-50%) scale(${scale})`,
          opacity,
          transformOrigin: "center center",
        }}
      >
        <img
          src={src}
          alt=""
          width={width}
          height={height}
          draggable={false}
          loading="eager"
          decoding="async"
          className="h-auto w-full select-none object-contain outline-none ring-0 [filter:drop-shadow(0_32px_48px_rgba(0,0,0,0.34))] sm:[filter:drop-shadow(0_38px_56px_rgba(0,0,0,0.28))]"
          sizes={sizes}
        />
      </div>
    </div>
  );
}
