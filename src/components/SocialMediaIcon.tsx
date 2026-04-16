import type { CSSProperties } from "react";
import {
  siFacebook,
  siInstagram,
  siTiktok,
  siWhatsapp,
  siX,
  siYoutube,
} from "simple-icons";
import type { SimpleIcon } from "simple-icons";

const LINKEDIN_ICON = {
  hex: "0A66C2",
  path: "M20.447 20.452H16.89V14.87c0-1.331-.027-3.045-1.856-3.045c-1.858 0-2.142 1.45-2.142 2.948v5.679H9.336V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85c3.601 0 4.266 2.37 4.266 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124a2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
} as const;

export function cleanSocialUrl(url: string): string {
  const u = url.trim();
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  return `https://${u}`;
}

function pickIcon(label: string): SimpleIcon | null {
  const key = label.trim().toLowerCase();
  if (key.includes("instagram")) return siInstagram;
  if (key.includes("facebook")) return siFacebook;
  if (key.includes("twitter") || key === "x" || key.includes("x (twitter)")) return siX;
  if (key.includes("youtube")) return siYoutube;
  if (key.includes("tiktok")) return siTiktok;
  if (key.includes("whatsapp")) return siWhatsapp;
  return null;
}

export function socialBrandColor(label: string): string {
  if (label.trim().toLowerCase().includes("linkedin")) return `#${LINKEDIN_ICON.hex}`;
  const icon = pickIcon(label);
  return icon ? `#${icon.hex}` : "#9ca3af";
}

/** Official filled brand icon from Simple Icons. */
export function SocialMediaIcon({
  label,
  size = 24,
}: {
  label: string;
  size?: number;
}) {
  const linkedInIcon = label.trim().toLowerCase().includes("linkedin") ? LINKEDIN_ICON : null;
  const icon = pickIcon(label);
  const fallbackPath = "M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20Zm4.29 13.71a1 1 0 0 1-1.41 1.41L12 14.24l-2.88 2.88a1 1 0 0 1-1.41-1.41L10.59 12L7.71 9.12a1 1 0 0 1 1.41-1.41L12 10.59l2.88-2.88a1 1 0 1 1 1.41 1.41L13.41 12Z";
  const path = linkedInIcon?.path ?? icon?.path ?? fallbackPath;
  const style: CSSProperties = {
    display: "block",
  };

  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden style={style}>
      <path d={path} />
    </svg>
  );
}
