import type { ReactNode } from "react";

export function cleanSocialUrl(url: string): string {
  const u = url.trim();
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  return `https://${u}`;
}

function Icon({
  children,
  className,
  size = 18,
}: {
  children: ReactNode;
  className?: string;
  size?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      {children}
    </svg>
  );
}

/** Picks an icon from the link label (e.g. “Instagram”, “Facebook”). */
export function SocialMediaIcon({
  label,
  size = 18,
}: {
  label: string;
  size?: number;
}) {
  const k = label.trim().toLowerCase();
  if (k.includes("instagram")) {
    return (
      <Icon size={size}>
        <rect x="4" y="4" width="16" height="16" rx="4" />
        <circle cx="12" cy="12" r="3.5" />
        <path d="M16.5 7.5h.01" />
      </Icon>
    );
  }
  if (k.includes("facebook")) {
    return (
      <Icon size={size}>
        <path d="M14 8h3V5h-3c-2.2 0-4 1.8-4 4v3H7v3h3v7h3v-7h3l1-3h-4V9c0-.55.45-1 1-1Z" />
      </Icon>
    );
  }
  if (k.includes("linkedin")) {
    return (
      <Icon size={size}>
        <path d="M6 9v12" />
        <path d="M6 6.5a1.5 1.5 0 1 0 0-.01" />
        <path d="M10 9v12" />
        <path d="M10 14.5c0-3 4-3.25 4-0.5V21" />
        <path d="M14 14v7" />
        <path d="M10 9h4" />
      </Icon>
    );
  }
  if (k.includes("twitter") || k === "x" || k.includes("x (twitter)")) {
    return (
      <Icon size={size}>
        <path d="M4 4l16 16" />
        <path d="M20 4 4 20" />
      </Icon>
    );
  }
  if (k.includes("youtube")) {
    return (
      <Icon size={size}>
        <path d="M21 8s0-2-2-2H5C3 6 3 8 3 8v8s0 2 2 2h14c2 0 2-2 2-2V8Z" />
        <path d="M10 9.5 16 12l-6 2.5v-5Z" />
      </Icon>
    );
  }
  if (k.includes("tiktok")) {
    return (
      <Icon size={size}>
        <path d="M14 3v11.5a4.5 4.5 0 1 1-4-4.47" />
        <path d="M14 7c1.5 2 3 3 5 3" />
      </Icon>
    );
  }
  return (
    <Icon size={size}>
      <path d="M12 21s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    </Icon>
  );
}
