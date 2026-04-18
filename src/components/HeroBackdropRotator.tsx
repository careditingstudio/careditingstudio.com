"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { isCloudinaryUrl, isUploadedAsset } from "@/lib/cms-types";

const INTERVAL_MS = 2200;

function heroImageUnoptimized(src: string) {
  return isUploadedAsset(src) || !isCloudinaryUrl(src);
}

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

  const sharedClass =
    "scale-105 select-none object-cover object-center motion-reduce:scale-100";

  if (list.length === 1) {
    const src = list[0];
    return (
      <Image
        src={src}
        alt=""
        fill
        priority
        sizes="100vw"
        quality={78}
        draggable={false}
        unoptimized={heroImageUnoptimized(src)}
        className={`absolute inset-0 h-full w-full ${sharedClass}`}
      />
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {list.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          sizes="100vw"
          quality={78}
          priority={i === 0}
          draggable={false}
          unoptimized={heroImageUnoptimized(src)}
          className={`absolute inset-0 h-full w-full ${sharedClass} motion-safe:transition-opacity motion-safe:duration-[0.32s] motion-safe:ease-out motion-reduce:transition-none`}
          style={{ opacity: i === index ? 1 : 0 }}
          aria-hidden={i !== index}
        />
      ))}
    </div>
  );
}
