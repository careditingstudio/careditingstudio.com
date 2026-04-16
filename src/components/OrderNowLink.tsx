"use client";

import { sans } from "@/app/fonts";
import Link from "next/link";

type Props = {
  className?: string;
  onNavigate?: () => void;
};

export function OrderNowLink({ className = "", onNavigate }: Props) {
  return (
    <Link
      href="/order"
      prefetch
      onClick={onNavigate}
      className={[
        "group relative isolate overflow-hidden",
        sans.className,
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/25 bg-gradient-to-r from-[var(--accent)] via-[var(--accent)] to-[var(--accent-hover)] px-6 py-3 text-[15px] font-semibold leading-none text-white shadow-[0_14px_28px_-14px_rgba(0,0,0,0.55)]",
        "transition-all duration-300 ease-out",
        "before:absolute before:inset-0 before:-z-10 before:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.35),transparent_58%)] before:opacity-0 before:transition-opacity before:duration-300",
        "hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-16px_rgba(0,0,0,0.62)] hover:before:opacity-100",
        "active:translate-y-0 active:brightness-[0.98]",
        "sm:min-h-[3.25rem] sm:px-7 sm:text-[16px]",
        className,
      ].join(" ")}
    >
      <span className="relative z-[1]">Order now</span>
      <svg
        viewBox="0 0 20 20"
        fill="none"
        className="relative z-[1] h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
        aria-hidden
      >
        <path
          d="M4 10h10m0 0-3.5-3.5M14 10l-3.5 3.5"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}
