/**
 * CMS price strings are treated as USD (e.g. "$0.39", "USD 1.20").
 */

export function parseUsdAmount(text: string): number | null {
  const cleaned = text.replace(/,/g, "").trim();
  const m = cleaned.match(/(?:usd\s*)?\$?\s*([\d]+(?:\.\d+)?)/i);
  if (!m?.[1]) return null;
  const n = Number.parseFloat(m[1]);
  return Number.isFinite(n) ? n : null;
}

export function formatMoneyAmount(
  amount: number,
  currency: string,
  locale: string,
): string {
  const cur = currency.toUpperCase();
  try {
    return new Intl.NumberFormat(locale || "en", {
      style: "currency",
      currency: cur,
      maximumFractionDigits: cur === "JPY" || cur === "KRW" || cur === "VND" ? 0 : 2,
    }).format(amount);
  } catch {
    return `${cur} ${amount.toFixed(2)}`;
  }
}

export function convertUsdPriceLabel(
  raw: string,
  currency: string,
  rates: Record<string, number>,
  locale: string,
): string {
  const cur = currency.toUpperCase();
  if (cur === "USD" || !rates[cur]) {
    return raw.trim();
  }
  const usd = parseUsdAmount(raw);
  if (usd === null) return raw.trim();
  const mult = rates[cur];
  if (!mult || !Number.isFinite(mult)) return raw.trim();
  const converted = usd * mult;
  return formatMoneyAmount(converted, cur, locale);
}
