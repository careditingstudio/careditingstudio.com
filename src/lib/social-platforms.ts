/** Stable ids for footer / announcement social icons (admin picker + stored JSON). */

export const SOCIAL_PLATFORM_IDS = [
  "facebook",
  "instagram",
  "x",
  "linkedin",
  "youtube",
  "tiktok",
  "reddit",
  "pinterest",
  "snapchat",
  "discord",
  "telegram",
  "threads",
  "bluesky",
  "whatsapp",
  "github",
  "medium",
  "vimeo",
  "twitch",
  "behance",
  "dribbble",
] as const;

export type SocialPlatformId = (typeof SOCIAL_PLATFORM_IDS)[number];

export const SOCIAL_PLATFORM_OPTIONS: {
  id: SocialPlatformId;
  title: string;
}[] = [
  { id: "facebook", title: "Facebook" },
  { id: "instagram", title: "Instagram" },
  { id: "x", title: "X" },
  { id: "linkedin", title: "LinkedIn" },
  { id: "youtube", title: "YouTube" },
  { id: "tiktok", title: "TikTok" },
  { id: "reddit", title: "Reddit" },
  { id: "pinterest", title: "Pinterest" },
  { id: "snapchat", title: "Snapchat" },
  { id: "discord", title: "Discord" },
  { id: "telegram", title: "Telegram" },
  { id: "threads", title: "Threads" },
  { id: "bluesky", title: "Bluesky" },
  { id: "whatsapp", title: "WhatsApp" },
  { id: "github", title: "GitHub" },
  { id: "medium", title: "Medium" },
  { id: "vimeo", title: "Vimeo" },
  { id: "twitch", title: "Twitch" },
  { id: "behance", title: "Behance" },
  { id: "dribbble", title: "Dribbble" },
];

const TITLE_BY_ID = new Map(
  SOCIAL_PLATFORM_OPTIONS.map((o) => [o.id, o.title] as const),
);

export function socialPlatformTitle(id: SocialPlatformId): string {
  return TITLE_BY_ID.get(id) ?? id;
}

export function isSocialPlatformId(x: string): x is SocialPlatformId {
  return (SOCIAL_PLATFORM_IDS as readonly string[]).includes(x);
}

/** Guess platform from legacy free-text labels (pre–icon-picker rows). */
export function inferPlatformFromLegacyLabel(label: string): SocialPlatformId | null {
  const key = label.trim().toLowerCase();
  if (!key) return null;
  if (key.includes("instagram")) return "instagram";
  if (key.includes("facebook")) return "facebook";
  if (
    key.includes("linkedin") ||
    key.includes("linked in")
  )
    return "linkedin";
  if (key.includes("twitter") || key.includes("x (twitter)") || key === "x")
    return "x";
  if (key.includes("youtube")) return "youtube";
  if (key.includes("tiktok")) return "tiktok";
  if (key.includes("reddit")) return "reddit";
  if (key.includes("pinterest")) return "pinterest";
  if (key.includes("snapchat")) return "snapchat";
  if (key.includes("discord")) return "discord";
  if (key.includes("telegram")) return "telegram";
  if (key.includes("threads")) return "threads";
  if (key.includes("bluesky")) return "bluesky";
  if (key.includes("whatsapp")) return "whatsapp";
  if (key.includes("github")) return "github";
  if (key.includes("medium")) return "medium";
  if (key.includes("vimeo")) return "vimeo";
  if (key.includes("twitch")) return "twitch";
  if (key.includes("behance")) return "behance";
  if (key.includes("dribbble")) return "dribbble";
  return null;
}

export const DEFAULT_NEW_SOCIAL_PLATFORM: SocialPlatformId = "facebook";
