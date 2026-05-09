import type { CSSProperties } from "react";
import {
  siBehance,
  siBluesky,
  siDiscord,
  siDribbble,
  siFacebook,
  siGithub,
  siInstagram,
  siMedium,
  siPinterest,
  siReddit,
  siSnapchat,
  siTelegram,
  siThreads,
  siTiktok,
  siTwitch,
  siVimeo,
  siWhatsapp,
  siX,
  siYoutube,
} from "simple-icons";
import type { SimpleIcon } from "simple-icons";
import type { SocialPlatformId } from "@/lib/social-platforms";
import {
  inferPlatformFromLegacyLabel,
  isSocialPlatformId,
} from "@/lib/social-platforms";

const LINKEDIN_ICON = {
  hex: "0A66C2",
  path: "M20.447 20.452H16.89V14.87c0-1.331-.027-3.045-1.856-3.045c-1.858 0-2.142 1.45-2.142 2.948v5.679H9.336V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85c3.601 0 4.266 2.37 4.266 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124a2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
} as const;

const PLATFORM_SIMPLE_ICONS: Partial<Record<SocialPlatformId, SimpleIcon>> = {
  facebook: siFacebook,
  instagram: siInstagram,
  x: siX,
  youtube: siYoutube,
  tiktok: siTiktok,
  reddit: siReddit,
  pinterest: siPinterest,
  snapchat: siSnapchat,
  discord: siDiscord,
  telegram: siTelegram,
  threads: siThreads,
  bluesky: siBluesky,
  whatsapp: siWhatsapp,
  github: siGithub,
  medium: siMedium,
  vimeo: siVimeo,
  twitch: siTwitch,
  behance: siBehance,
  dribbble: siDribbble,
};

export function cleanSocialUrl(url: string): string {
  const u = url.trim();
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  return `https://${u}`;
}

function resolvePlatform(
  platform?: string,
  label?: string,
): SocialPlatformId | null {
  if (platform && isSocialPlatformId(platform)) return platform;
  if (label) return inferPlatformFromLegacyLabel(label);
  return null;
}

function iconPathAndHex(
  id: SocialPlatformId,
): { path: string; hex: string } | null {
  if (id === "linkedin") {
    return { path: LINKEDIN_ICON.path, hex: LINKEDIN_ICON.hex };
  }
  const si = PLATFORM_SIMPLE_ICONS[id];
  return si ? { path: si.path, hex: si.hex } : null;
}

/** Brand hex for hover states (Simple Icons). */
export function socialBrandColor(platformOrLegacyLabel: string): string {
  const id = isSocialPlatformId(platformOrLegacyLabel)
    ? platformOrLegacyLabel
    : inferPlatformFromLegacyLabel(platformOrLegacyLabel);
  if (!id) return "#9ca3af";
  const data = iconPathAndHex(id);
  return data ? `#${data.hex}` : "#9ca3af";
}

export function socialBrandColorForPlatform(id: SocialPlatformId): string {
  const data = iconPathAndHex(id);
  return data ? `#${data.hex}` : "#9ca3af";
}

/** Official filled brand icon from Simple Icons (X uses `siX`). */
export function SocialMediaIcon({
  platform,
  label,
  size = 24,
}: {
  /** Preferred — stable id from admin picker */
  platform?: SocialPlatformId | string;
  /** Legacy — matched by substring when `platform` omitted */
  label?: string;
  size?: number;
}) {
  const id = resolvePlatform(
    typeof platform === "string" ? platform : undefined,
    label,
  );
  const data = id ? iconPathAndHex(id) : null;
  const fallbackPath =
    "M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20Zm4.29 13.71a1 1 0 0 1-1.41 1.41L12 14.24l-2.88 2.88a1 1 0 0 1-1.41-1.41L10.59 12L7.71 9.12a1 1 0 0 1 1.41-1.41L12 10.59l2.88-2.88a1 1 0 1 1 1.41 1.41L13.41 12Z";
  const path = data?.path ?? fallbackPath;
  const style: CSSProperties = {
    display: "block",
  };

  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden style={style}>
      <path d={path} />
    </svg>
  );
}
