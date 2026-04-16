import { sans } from "@/app/fonts";
import { servicesMegaMenuItems } from "@/config/services-mega-menu";
import type { ServiceRow } from "@/lib/cms-types";
import Link from "next/link";

function ItemIcon() {
  return (
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-200/95 dark:bg-zinc-700/80"
      aria-hidden
    >
      <svg
        width="10"
        height="12"
        viewBox="0 0 10 12"
        className="ml-0.5 text-[var(--accent)]"
        fill="currentColor"
        aria-hidden
      >
        <path d="M0 0v12l10-6L0 0z" />
      </svg>
    </span>
  );
}

function ItemIconOverlay() {
  return (
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15"
      aria-hidden
    >
      <svg
        width="10"
        height="12"
        viewBox="0 0 10 12"
        className="ml-0.5 text-[var(--accent)]"
        fill="currentColor"
        aria-hidden
      >
        <path d="M0 0v12l10-6L0 0z" />
      </svg>
    </span>
  );
}

export function ServicesMegaMenuGrid({
  onNavigate,
  dense,
  tone = "default",
  services = [],
}: {
  onNavigate?: () => void;
  dense?: boolean;
  tone?: "default" | "overlay";
  services?: ServiceRow[];
}) {
  const isOverlay = tone === "overlay";
  const menuItems =
    services.length > 0
      ? services.map((service) => ({
          title: service.name.trim() || "Untitled service",
          description: "Professional car photo editing service.",
          href: "/services",
        }))
      : servicesMegaMenuItems;

  return (
    <ul
      className={[
        "grid list-none gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3",
        dense ? "lg:gap-x-5" : "lg:gap-x-8 lg:gap-y-5",
      ].join(" ")}
    >
      {menuItems.map((item) => (
        <li key={`${item.href}-${item.title}`}>
          <Link
            href={item.href}
            prefetch
            onClick={onNavigate}
            className={[
              "group flex gap-3 rounded-xl border border-transparent p-2 text-left transition-all duration-250 ease-out sm:gap-3.5 sm:p-2.5",
              isOverlay
                ? "hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10"
                : "hover:-translate-y-0.5 hover:border-zinc-200 hover:bg-zinc-100/90 hover:shadow-[0_14px_26px_-18px_rgba(0,0,0,0.45)] dark:hover:border-white/10 dark:hover:bg-zinc-800/60",
            ].join(" ")}
          >
            {isOverlay ? <ItemIconOverlay /> : <ItemIcon />}
            <span className="min-w-0">
              <span
                className={[
                  `${sans.className} block text-sm font-semibold transition-colors sm:text-[13px]`,
                  isOverlay
                    ? "text-white group-hover:text-[var(--accent)]"
                    : "text-zinc-900 group-hover:text-[var(--accent)] dark:text-zinc-100",
                ].join(" ")}
              >
                {item.title}
              </span>
              <span
                className={[
                  `${sans.className} mt-0.5 block text-xs leading-relaxed sm:text-[13px]`,
                  isOverlay ? "text-white/70" : "text-zinc-500 dark:text-zinc-400",
                ].join(" ")}
              >
                {item.description}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
