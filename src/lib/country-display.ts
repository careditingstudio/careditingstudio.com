/** Resolve stored country (ISO alpha-2 or full name) to a readable label. */
export function formatCountryLabel(country: string | null | undefined): string {
  if (!country) return "";
  const t = country.trim();
  if (!t) return "";

  if (/^[A-Za-z]{2}$/.test(t)) {
    try {
      const name = new Intl.DisplayNames(["en"], { type: "region" }).of(t.toUpperCase());
      if (name) return name;
    } catch {
      // ignore
    }
  }

  return t;
}
