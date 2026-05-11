"use client";

import { getVisitorShellMessages } from "@/i18n/visitor-shell";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function VisitorLanguageBar({
  show,
  locale,
  altLocale,
}: {
  show: boolean;
  locale: string;
  altLocale: string;
}) {
  const pathname = usePathname();
  if (!show || altLocale === "en") return null;

  const here = pathname && pathname.length > 0 ? pathname : "/";
  const redirect = here.startsWith("/") ? here : `/${here}`;
  const q = `redirect=${encodeURIComponent(redirect)}`;
  const enHref = `/api/visitor-prefs?locale=en&${q}`;
  const altHref = `/api/visitor-prefs?locale=${encodeURIComponent(altLocale)}&${q}`;

  const msgs = getVisitorShellMessages(locale);
  const altMsgs = getVisitorShellMessages(altLocale);
  const enActive = locale === "en";
  const altActive = locale === altLocale;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[55] border-t border-[var(--line)] bg-[var(--background)]/95 px-3 py-2.5 text-center text-xs text-[var(--muted)] backdrop-blur-md supports-[padding:env(safe-area-inset-bottom)]:pb-[calc(0.625rem+env(safe-area-inset-bottom))]"
      role="region"
      aria-label="Language"
    >
      <span className="mr-2 text-[var(--muted-2)]">{msgs.languageBar.hint}:</span>
      <Link
        href={enHref}
        prefetch={false}
        className={
          enActive
            ? "font-semibold text-[var(--foreground)]"
            : "text-[var(--accent)] hover:underline"
        }
      >
        {msgs.languageBar.english}
      </Link>
      <span className="mx-2 text-[var(--muted-2)]" aria-hidden>
        ·
      </span>
      <Link
        href={altHref}
        prefetch={false}
        className={
          altActive
            ? "font-semibold text-[var(--foreground)]"
            : "text-[var(--accent)] hover:underline"
        }
      >
        {altMsgs.nativeLanguageName}
      </Link>
    </div>
  );
}
