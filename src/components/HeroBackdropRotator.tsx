"use client";

import { useEffect, useState } from "react";

const INTERVAL_MS = 2900;
const MAX_BLUR_PX = 12;
const MAX_DARKEN_OPACITY = 0.42;

export function HeroBackdropRotator({ images }: { images: string[] }) {
  const list = images.filter((u) => u.trim().length > 0);
  const [index, setIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (list.length <= 1) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % list.length);
    }, INTERVAL_MS);
    return () => clearInterval(t);
  }, [list.length]);

  useEffect(() => {
    let ticking = false;

    const updateProgress = () => {
      const viewportHeight = Math.max(window.innerHeight, 1);
      // Fade/blur reaches max before one full viewport to feel responsive.
      const progress = Math.min(window.scrollY / (viewportHeight * 0.85), 1);
      setScrollProgress(progress);
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  if (list.length === 0) return null;

  const blurPx = Number((scrollProgress * MAX_BLUR_PX).toFixed(2));
  const darkenOpacity = Number((scrollProgress * MAX_DARKEN_OPACITY).toFixed(3));

  if (list.length === 1) {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 scale-105 bg-cover bg-center bg-no-repeat motion-reduce:scale-100"
          style={{
            backgroundImage: `url('${list[0]}')`,
            filter: `blur(${blurPx}px)`,
            transform: "scale(1.05)",
          }}
        />
        <div
          className="absolute inset-0 bg-black motion-safe:transition-opacity motion-safe:duration-150 motion-reduce:transition-none"
          style={{ opacity: darkenOpacity }}
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {list.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 scale-105 bg-cover bg-center bg-no-repeat motion-reduce:scale-100 motion-safe:transition-opacity motion-safe:duration-[0.45s] motion-safe:ease-out motion-reduce:transition-none"
          style={{
            backgroundImage: `url('${src}')`,
            opacity: i === index ? 1 : 0,
            filter: `blur(${blurPx}px)`,
            transform: "scale(1.05)",
          }}
          aria-hidden={i !== index}
        />
      ))}
      <div
        className="absolute inset-0 bg-black motion-safe:transition-opacity motion-safe:duration-150 motion-reduce:transition-none"
        style={{ opacity: darkenOpacity }}
      />
    </div>
  );
}
