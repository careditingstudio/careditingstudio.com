"use client";

import { useHomeChromeSolid } from "@/components/HomeChromeProvider";
import { cleanSocialUrl, socialBrandColor, SocialMediaIcon } from "@/components/SocialMediaIcon";
import type { SiteSettings } from "@/lib/cms-types";
import { useEffect, useId, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";

function IconMail({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  );
}

type Props = {
  contact: SiteSettings;
};

function PhoneContactDialog({
  open,
  onClose,
  digits,
  phoneDisplay,
  titleId,
}: {
  open: boolean;
  onClose: () => void;
  digits: string;
  phoneDisplay: string;
  titleId: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted || !open) return null;

  const telHref = `tel:+${digits}`;
  const waMessage = `https://wa.me/${digits}`;
  const waCall = `whatsapp://call?phone=${digits}`;

  return createPortal(
    <div
      className="fixed inset-0 z-[250] flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close contact options"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-[min(100%,20rem)] rounded-2xl border border-white/12 bg-zinc-950/98 p-5 shadow-2xl ring-1 ring-white/10"
      >
        <p id={titleId} className="text-center text-sm font-medium text-white">
          Contact options
        </p>
        <p className="mt-1 text-center text-sm tabular-nums text-zinc-300">
          {phoneDisplay}
        </p>
        <p className="mt-0.5 text-center text-xs text-zinc-500">
          Choose how to reach this number
        </p>
        <ul className="mt-5 flex flex-col gap-2">
          <li>
            <a
              href={telHref}
              onClick={onClose}
              className="flex w-full items-center justify-center rounded-xl bg-white/[0.08] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.12]"
            >
              Call
            </a>
          </li>
          <li>
            <a
              href={waCall}
              onClick={onClose}
              className="flex w-full items-center justify-center rounded-xl bg-[#25D366]/15 px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#25D366]/25"
            >
              WhatsApp call
            </a>
          </li>
          <li>
            <a
              href={waMessage}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="flex w-full items-center justify-center rounded-xl border border-white/12 bg-transparent px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
            >
              WhatsApp message
            </a>
          </li>
        </ul>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full text-center text-sm text-zinc-500 transition hover:text-zinc-300"
        >
          Cancel
        </button>
      </div>
    </div>,
    document.body,
  );
}

export function AnnouncementBar({ contact }: Props) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const chromeSolid = useHomeChromeSolid();
  const overlay = isHome && !chromeSolid;
  const [phoneOpen, setPhoneOpen] = useState(false);
  const dialogTitleId = useId();

  const digits = contact.whatsappDial.replace(/\D/g, "");
  const phoneDisplay =
    contact.whatsappDisplay.trim() || (digits ? digits : "");

  const socials = (contact.socialLinks ?? [])
    .map((s) => ({ label: s.label.trim(), url: cleanSocialUrl(s.url) }))
    .filter((s) => s.label.length > 0 && s.url.length > 0);

  const linkClass = [
    "transition-colors",
    overlay
      ? "text-white/75 hover:text-white"
      : "text-[var(--announcement-fg)] hover:text-[var(--announcement-hover)]",
  ].join(" ");

  const iconMuted = overlay
    ? "opacity-70 group-hover:opacity-100"
    : "opacity-60 group-hover:opacity-100";

  return (
    <div
      className={[
        "relative z-0 flex w-full min-h-[var(--announcement-h)] items-center transition-[background-color,border-color] duration-300",
        overlay
          ? "border-b border-transparent bg-transparent"
          : "border-b border-white/[0.06] bg-[var(--announcement-bg)]",
      ].join(" ")}
      role="region"
      aria-label="Contact shortcuts"
    >
      <div className="mx-auto flex w-full max-w-[88rem] flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1 sm:gap-x-4">
          <a
            href={`mailto:${contact.email}`}
            className={`group flex min-w-0 items-center gap-2.5 text-[14px] leading-snug sm:text-[15px] ${linkClass}`}
          >
            <IconMail className={`shrink-0 transition-opacity ${iconMuted}`} />
            <span className="truncate">{contact.email}</span>
          </a>

          {digits.length > 0 ? (
            <>
              <span
                className={[
                  "select-none px-0.5 text-[15px] leading-none",
                  overlay ? "text-white/35" : "text-zinc-600",
                ].join(" ")}
                aria-hidden
              >
                ·
              </span>
              <button
                type="button"
                onClick={() => setPhoneOpen(true)}
                className={`shrink-0 text-left text-[14px] tabular-nums leading-snug underline-offset-2 transition-colors hover:underline sm:text-[15px] ${linkClass}`}
                aria-haspopup="dialog"
                aria-expanded={phoneOpen}
              >
                {phoneDisplay}
              </button>
            </>
          ) : null}
        </div>

        {socials.length > 0 ? (
          <ul
            className="flex shrink-0 items-center gap-2.5 sm:gap-3 lg:gap-4"
            aria-label="Social media"
          >
            {socials.map((s) => (
              <li key={`${s.label}-${s.url}`}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  style={{ "--social-brand": socialBrandColor(s.label) } as CSSProperties}
                  className={[
                    "inline-flex items-center justify-center transition-all duration-200 ease-in-out hover:scale-110 hover:text-[var(--social-brand)]",
                    overlay
                      ? "text-white/80"
                      : "text-[#666]",
                  ].join(" ")}
                >
                  <SocialMediaIcon label={s.label} size={18} />
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {digits.length > 0 ? (
        <PhoneContactDialog
          open={phoneOpen}
          onClose={() => setPhoneOpen(false)}
          digits={digits}
          phoneDisplay={phoneDisplay}
          titleId={dialogTitleId}
        />
      ) : null}
    </div>
  );
}
