"use client";

import { useEffect, useState } from "react";

const INTERVAL_MS = 9000;

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
      <div
        className="absolute inset-0 scale-105 bg-cover bg-center bg-no-repeat motion-reduce:scale-100"
        style={{ backgroundImage: `url('${list[0]}')` }}
      />
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {list.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 scale-105 bg-cover bg-center bg-no-repeat motion-reduce:scale-100 motion-safe:transition-opacity motion-safe:duration-[1.4s] motion-safe:ease-out motion-reduce:transition-none"
          style={{
            backgroundImage: `url('${src}')`,
            opacity: i === index ? 1 : 0,
          }}
          aria-hidden={i !== index}
        />
      ))}
    </div>
  );
}
