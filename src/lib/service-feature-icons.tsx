import type { ReactElement, ReactNode } from "react";

function S({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

const ICON_RENDERERS: Record<string, (className?: string) => ReactElement> = {
  creditCard: (c) => (
    <S className={c}>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </S>
  ),
  lock: (c) => (
    <S className={c}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </S>
  ),
  percent: (c) => (
    <S className={c}>
      <path d="M19 5L5 19" />
      <circle cx="6.5" cy="6.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
    </S>
  ),
  zap: (c) => (
    <S className={c}>
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </S>
  ),
  shield: (c) => (
    <S className={c}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    </S>
  ),
  truck: (c) => (
    <S className={c}>
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </S>
  ),
  clock: (c) => (
    <S className={c}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </S>
  ),
  headphones: (c) => (
    <S className={c}>
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3v5ZM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3v5Z" />
    </S>
  ),
  image: (c) => (
    <S className={c}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </S>
  ),
  layers: (c) => (
    <S className={c}>
      <path d="m12.83 2.18 8 3.33a1 1 0 0 1 0 1.84l-8 3.33a2 2 0 0 1-1.66 0l-8-3.33a1 1 0 0 1 0-1.84l8-3.33a2 2 0 0 1 1.66 0Z" />
      <path d="m21 12-9 3.75L3 12" />
      <path d="m21 17-9 3.75L3 17" />
    </S>
  ),
  refresh: (c) => (
    <S className={c}>
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </S>
  ),
  star: (c) => (
    <S className={c}>
      <path d="m12 2 2.2 4.46 4.91.71-3.55 3.46.84 4.89L12 13.77 8.6 15.52l.84-4.89-3.55-3.46 4.91-.71L12 2z" />
    </S>
  ),
  checkCircle: (c) => (
    <S className={c}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="M22 4 12 14.01l-3-3" />
    </S>
  ),
  globe: (c) => (
    <S className={c}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
    </S>
  ),
  mail: (c) => (
    <S className={c}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 6-10 7L2 6" />
    </S>
  ),
  folder: (c) => (
    <S className={c}>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2v11Z" />
    </S>
  ),
  users: (c) => (
    <S className={c}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </S>
  ),
  award: (c) => (
    <S className={c}>
      <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
      <circle cx="12" cy="8" r="6" />
    </S>
  ),
  sparkles: (c) => (
    <S className={c}>
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z" />
      <path d="M5 3v4M19 17v4M3 5h4M17 19h4" />
    </S>
  ),
  heart: (c) => (
    <S className={c}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </S>
  ),
  calendar: (c) => (
    <S className={c}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </S>
  ),
  mapPin: (c) => (
    <S className={c}>
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </S>
  ),
  wallet: (c) => (
    <S className={c}>
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h3v-4Z" />
    </S>
  ),
};

/** Keys with human labels for the CMS icon picker (order = display order). */
export const SERVICE_FEATURE_ICON_OPTIONS: { key: string; label: string }[] = [
  { key: "creditCard", label: "Card" },
  { key: "wallet", label: "Wallet" },
  { key: "lock", label: "Lock" },
  { key: "shield", label: "Shield" },
  { key: "percent", label: "Percent" },
  { key: "zap", label: "Lightning" },
  { key: "truck", label: "Truck" },
  { key: "clock", label: "Clock" },
  { key: "headphones", label: "Support" },
  { key: "image", label: "Image" },
  { key: "layers", label: "Layers" },
  { key: "refresh", label: "Refresh" },
  { key: "star", label: "Star" },
  { key: "checkCircle", label: "Check" },
  { key: "globe", label: "Globe" },
  { key: "mail", label: "Mail" },
  { key: "folder", label: "Folder" },
  { key: "users", label: "Users" },
  { key: "award", label: "Award" },
  { key: "heart", label: "Heart" },
  { key: "calendar", label: "Calendar" },
  { key: "mapPin", label: "Pin" },
  { key: "sparkles", label: "Sparkles" },
];

export const DEFAULT_SERVICE_FEATURE_ICON_KEY = "sparkles";

export function isKnownServiceFeatureIconKey(key: string): boolean {
  return Object.prototype.hasOwnProperty.call(ICON_RENDERERS, key);
}

export function ServiceFeatureIcon({
  iconKey,
  className,
}: {
  iconKey: string;
  className?: string;
}) {
  const k = isKnownServiceFeatureIconKey(iconKey)
    ? iconKey
    : DEFAULT_SERVICE_FEATURE_ICON_KEY;
  return ICON_RENDERERS[k]!(className);
}
