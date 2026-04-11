"use client";

import { sans } from "@/app/fonts";
import Link from "next/link";

type Props = {
  className?: string;
  onNavigate?: () => void;
};

/**
 * Primary CTA — no looping animation (avoids jank); hover uses color + shadow only.
 */
export function OrderNowLink({ className = "", onNavigate }: Props) {
  return (
    <Link
      href="/order"
      onClick={onNavigate}
      className={[
        sans.className,
        "inline-flex min-h-12 items-center justify-center rounded-xl bg-[var(--accent)] px-6 py-3 text-[15px] font-semibold leading-none text-white shadow-md shadow-black/25 ring-1 ring-white/20",
        "transition-[background-color,box-shadow,ring-color] duration-200 ease-out",
        "hover:bg-[var(--accent-hover)] hover:shadow-lg hover:shadow-black/35 hover:ring-white/35",
        "active:brightness-[0.97]",
        "sm:min-h-[3.25rem] sm:px-7 sm:text-[16px]",
        className,
      ].join(" ")}
    >
      Order now
    </Link>
  );
}
