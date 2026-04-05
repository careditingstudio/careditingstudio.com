import { sans } from "@/app/fonts";
import { servicesMegaMenuItems } from "@/config/services-mega-menu";
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
}: {
  onNavigate?: () => void;
  dense?: boolean;
  tone?: "default" | "overlay";
}) {
  const isOverlay = tone === "overlay";

  return (
    <ul
      className={[
        "grid list-none gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3",
        dense ? "lg:gap-x-5" : "lg:gap-x-8 lg:gap-y-5",
      ].join(" ")}
    >
      {servicesMegaMenuItems.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            onClick={onNavigate}
            className={[
              "group flex gap-3 rounded-xl p-2 text-left transition-colors sm:gap-3.5 sm:p-2.5",
              isOverlay
                ? "hover:bg-white/10"
                : "hover:bg-zinc-100/90 dark:hover:bg-zinc-800/60",
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
