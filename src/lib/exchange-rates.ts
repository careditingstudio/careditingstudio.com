import { unstable_cache } from "next/cache";

/**
 * USD → other currencies (multiplier: amountUsd * rates[currency]).
 * Cached ~1h. Falls back to empty on failure (caller shows USD strings).
 */
async function fetchUsdRatesUncached(): Promise<Record<string, number>> {
  const urls = [
    "https://open.er-api.com/v6/latest/USD",
    "https://api.exchangerate.host/latest?base=USD",
  ];
  for (const endpoint of urls) {
    try {
      const res = await fetch(endpoint, { next: { revalidate: 3600 } });
      if (!res.ok) continue;
      const data = (await res.json()) as {
        result?: string;
        rates?: Record<string, number>;
      };
      if (data.result === "error") continue;
      if (data.rates && typeof data.rates === "object") return data.rates;
    } catch {
      /* try next */
    }
  }
  return {};
}

export const getUsdExchangeRates = unstable_cache(
  fetchUsdRatesUncached,
  ["open-er-api-usd-rates"],
  { revalidate: 3600 },
);
