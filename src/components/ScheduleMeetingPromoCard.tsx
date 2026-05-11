import Link from "next/link";
import { display, sans } from "@/app/fonts";
import { cn } from "@/lib/utils";

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="5" width="18" height="16" rx="2.5" />
      <path d="M16 3v4M8 3v4M3 11h18" />
    </svg>
  );
}

type Props = {
  eyebrow: string;
  title: string;
  body: string;
  ctaLabel: string;
  className?: string;
};

/**
 * Dark promo card → `/schedule-meeting` (homepage beside contact, contact page sidebar).
 */
export function ScheduleMeetingPromoCard({
  eyebrow,
  title,
  body,
  ctaLabel,
  className,
}: Props) {
  return (
    <Link
      href="/schedule-meeting"
      prefetch
      className={cn(
        "group relative block overflow-hidden rounded-2xl border border-[var(--accent)]/30",
        "bg-[#101012] p-6 shadow-[0_28px_60px_-36px_rgba(0,0,0,0.9)] transition duration-300",
        "hover:-translate-y-0.5 hover:border-[var(--accent)]/50 hover:shadow-[0_32px_70px_-32px_rgba(224,122,69,0.12)]",
        className,
      )}
      aria-label={`${title} — ${ctaLabel}`}
    >
      <span
        className="pointer-events-none absolute -left-14 -top-14 h-44 w-44 rounded-full bg-[var(--accent)]/18 blur-3xl"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_0%_0%,rgba(224,122,69,0.14)_0%,transparent_55%)]"
        aria-hidden
      />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start">
        <span className="mx-auto grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/[0.06] text-[var(--accent)] ring-1 ring-[var(--accent)]/35 sm:mx-0">
          <CalendarIcon />
        </span>
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <p
            className={`${sans.className} text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]`}
          >
            {eyebrow}
          </p>
          <p
            className={`${display.className} mt-2 text-balance text-lg font-semibold leading-snug tracking-tight text-white sm:text-xl`}
          >
            {title}
          </p>
          <p
            className={`${sans.className} mt-2 text-sm leading-relaxed text-zinc-400`}
          >
            {body}
          </p>
          <span
            className={`${sans.className} mt-4 inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-[var(--accent)] transition group-hover:gap-2.5 sm:justify-start`}
          >
            {ctaLabel}
            <svg
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden
              className="h-4 w-4"
            >
              <path
                d="M4 10h10m0 0-3.5-3.5M14 10l-3.5 3.5"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
