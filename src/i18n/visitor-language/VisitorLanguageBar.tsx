"use client";

/**
 * Bottom language selector — **not rendered in production** unless
 * `NEXT_PUBLIC_CES_VISITOR_I18N=1`. Wired from `SiteTopChromeWrapper`.
 */
import {
  getVisitorShellMessages,
  VISITOR_SHELL_UI_LOCALES,
} from "@/i18n/visitor-shell";
import { usePathname } from "next/navigation";

export function VisitorLanguageBar({ locale }: { locale: string }) {
  const pathname = usePathname();
  const here = pathname && pathname.length > 0 ? pathname : "/";
  const redirect = here.startsWith("/") ? here : `/${here}`;
  const q = `redirect=${encodeURIComponent(redirect)}`;

  const safeValue = VISITOR_SHELL_UI_LOCALES.includes(locale) ? locale : "en";
  const msgs = getVisitorShellMessages(safeValue);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[265] border-t border-[var(--line)] bg-[var(--background)]/95 px-3 py-2.5 backdrop-blur-md supports-[padding:env(safe-area-inset-bottom)]:pb-[calc(0.625rem+env(safe-area-inset-bottom))]"
      role="region"
      aria-label={msgs.languageBar.hint}
    >
      <div className="mx-auto flex max-w-lg flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs text-[var(--muted)] sm:pl-24">
        <label htmlFor="ces-ui-locale" className="shrink-0 text-[var(--muted-2)]">
          {msgs.languageBar.hint}
        </label>
        <select
          id="ces-ui-locale"
          value={safeValue}
          className="min-w-[12rem] max-w-full rounded-lg border border-[var(--line-strong)] bg-[color-mix(in_oklab,var(--background)_92%,white_8%)] px-3 py-2 text-sm font-medium text-[var(--foreground)] shadow-sm outline-none ring-[var(--accent)]/40 transition focus:ring-2"
          aria-label={msgs.languageBar.hint}
          onChange={(e) => {
            const next = e.target.value;
            const href = `/api/visitor-prefs?locale=${encodeURIComponent(next)}&${q}`;
            window.location.assign(href);
          }}
        >
          {VISITOR_SHELL_UI_LOCALES.map((code) => {
            const m = getVisitorShellMessages(code);
            return (
              <option key={code} value={code}>
                {m.nativeLanguageName}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}
