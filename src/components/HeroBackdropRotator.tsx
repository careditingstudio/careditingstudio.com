"use client";

import { useEffect, useState } from "react";

const INTERVAL_MS = 2900;

export function HeroBackdropRotator({ images }: { images: string[] }) {
  const list = images.filter((u) => u.trim().length > 0);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (list.length <= 1) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % list.length);
    }, INTERVAL_MS);
    return () => clearInterval(t);
  }, [list.length]);

  if (list.length === 0) return null;

  if (list.length === 1) {
    return (
      <img
        src={list[0]}
        alt=""
        draggable={false}
        decoding="async"
        loading="eager"
        fetchPriority="high"
        className="absolute inset-0 h-full w-full scale-105 select-none object-cover object-center motion-reduce:scale-100"
      />
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {list.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          draggable={false}
          decoding="async"
          loading={i < 2 ? "eager" : "lazy"}
          fetchPriority={i === 0 ? "high" : i === 1 ? "auto" : "low"}
          className="absolute inset-0 h-full w-full scale-105 select-none object-cover object-center motion-reduce:scale-100 motion-safe:transition-opacity motion-safe:duration-[0.45s] motion-safe:ease-out motion-reduce:transition-none"
          style={{ opacity: i === index ? 1 : 0 }}
          aria-hidden={i !== index}
        />
      ))}
    </div>
  );
}
