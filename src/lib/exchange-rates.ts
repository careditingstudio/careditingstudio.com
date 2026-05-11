/**
 * USD → other currencies (multiplier: amountUsd * rates[CURRENCY]).
 * Keys are always UPPERCASE ISO 4217. Uses ISR cache via fetch revalidate.
 */

function normalizeRateMap(raw: Record<string, number>): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(raw)) {
    if (typeof v !== "number" || !Number.isFinite(v)) continue;
    out[k.toUpperCase()] = v;
  }
  return out;
}

function mergeRates(
  base: Record<string, number>,
  patch: Record<string, number>,
): Record<string, number> {
  return { ...base, ...patch };
}

export async function getUsdExchangeRates(): Promise<Record<string, number>> {
  let merged: Record<string, number> = {};

  const urls = [
    "https://open.er-api.com/v6/latest/USD",
    "https://api.exchangerate.host/latest?base=USD",
    "https://api.frankfurter.app/v1/latest?from=USD",
  ];

  for (const endpoint of urls) {
    try {
      const res = await fetch(endpoint, { next: { revalidate: 1800 } });
      if (!res.ok) continue;
      const data = (await res.json()) as {
        result?: string;
        rates?: Record<string, number>;
      };
      if (data.result === "error") continue;
      if (data.rates && typeof data.rates === "object") {
        merged = mergeRates(merged, normalizeRateMap(data.rates));
      }
    } catch {
      /* try next source */
    }
  }

  merged.USD = 1;
  return merged;
}
