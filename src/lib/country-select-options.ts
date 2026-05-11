import { ISO_3166_1_ALPHA2 } from "@/config/iso3166-alpha2";

export type CountryOption = { code: string; name: string };

/**
 * Full country list with names in the visitor's UI language (falls back to English).
 * Ends with an "Other" row (label translated via `otherLabel`).
 */
export function countrySelectOptions(
  uiLocale: string,
  otherLabel: string,
): CountryOption[] {
  const locales = [uiLocale, "en"].filter(Boolean);
  let dn: Intl.DisplayNames;
  try {
    dn = new Intl.DisplayNames(locales, { type: "region" });
  } catch {
    dn = new Intl.DisplayNames(["en"], { type: "region" });
  }

  const rows: CountryOption[] = ISO_3166_1_ALPHA2.map((code) => ({
    code,
    name: dn.of(code) ?? code,
  })).sort((a, b) => a.name.localeCompare(b.name, uiLocale || "en"));

  return [...rows, { code: "Other", name: otherLabel }];
}

/** Blank row + all countries + Other — for `<select>` forms. */
export function countrySelectOptionsForm(
  uiLocale: string,
  blankLabel: string,
  otherLabel: string,
): CountryOption[] {
  const all = countrySelectOptions(uiLocale, otherLabel);
  const otherRow = all.find((x) => x.code === "Other");
  const rest = all.filter((x) => x.code !== "Other");
  return [{ code: "", name: blankLabel }, ...rest, ...(otherRow ? [otherRow] : [])];
}

/** Resolved label for API payloads (matches dropdown display name). */
export function countryLabelFromCode(
  code: string,
  uiLocale: string,
  otherLabel: string,
): string {
  if (!code) return "";
  if (code === "Other") return otherLabel;
  try {
    const dn = new Intl.DisplayNames([uiLocale, "en"], { type: "region" });
    return dn.of(code) ?? code;
  } catch {
    return code;
  }
}
