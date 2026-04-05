"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const FADE_DISTANCE = 200;

type Props = {
  bandBottom: string;
  src: string;
  width?: number;
  height?: number;
  sizes: string;
};

export function FloatingCar({ bandBottom, src, width = 960, height = 540, sizes }: Props) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const p = Math.min(1, Math.max(0, y / FADE_DISTANCE));
      setProgress(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scale = 1 - 0.42 * progress;
  const opacity = Math.max(0, 1 - 1.05 * progress);
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
        <Image
          src={src}
          alt=""
          width={width}
          height={height}
          priority
          draggable={false}
          className="h-auto w-full select-none object-contain outline-none ring-0 [filter:drop-shadow(0_32px_48px_rgba(0,0,0,0.34))] sm:[filter:drop-shadow(0_38px_56px_rgba(0,0,0,0.28))]"
          sizes={sizes}
        />
      </div>
    </div>
  );
}
