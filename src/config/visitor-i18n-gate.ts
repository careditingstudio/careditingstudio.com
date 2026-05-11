/**
 * Public-site visitor UI localization (nav/footer/forms copy, bottom language bar,
 * `/api/visitor-prefs` cookie switching).
 *
 * **Geo-based currency** (`country` / `currency` cookies and headers) stays on
 * regardless of this flag.
 *
 * Re-enable later: set `NEXT_PUBLIC_CES_VISITOR_I18N=1` and redeploy.
 * Related code: `VisitorLanguageBar`, `visitor-request` locale branch,
 * `visitor-shell.ts`, `/api/visitor-prefs`.
 */
export const VISITOR_I18N_ENABLED =
  process.env.NEXT_PUBLIC_CES_VISITOR_I18N?.trim() === "1";
