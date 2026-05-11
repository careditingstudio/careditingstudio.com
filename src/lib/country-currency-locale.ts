/**
 * ISO 3166-1 alpha-2 country → default display locale + currency for visitors.
 * Locale must exist in `VISITOR_MESSAGES` (except `en` fallback).
 */

export type CountryPrefs = { locale: string; currency: string };

const EURO_EN: CountryPrefs = { locale: "en", currency: "EUR" };

/** EUR countries without a dedicated translation use English UI + EUR. */
const EUR_ZONE: Record<string, true> = {
  AT: true,
  BE: true,
  CY: true,
  EE: true,
  FI: true,
  GR: true,
  IE: true,
  LV: true,
  LT: true,
  LU: true,
  MT: true,
  SK: true,
  SI: true,
};

const TABLE: Record<string, CountryPrefs> = {
  US: { locale: "en", currency: "USD" },
  CA: { locale: "en", currency: "CAD" },
  GB: { locale: "en", currency: "GBP" },
  AU: { locale: "en", currency: "AUD" },
  NZ: { locale: "en", currency: "NZD" },
  IN: { locale: "hi", currency: "INR" },
  BD: { locale: "bn", currency: "BDT" },
  PK: { locale: "en", currency: "PKR" },
  LK: { locale: "en", currency: "LKR" },
  NP: { locale: "en", currency: "NPR" },
  CN: { locale: "zh", currency: "CNY" },
  TW: { locale: "zh", currency: "TWD" },
  HK: { locale: "en", currency: "HKD" },
  SG: { locale: "en", currency: "SGD" },
  MY: { locale: "en", currency: "MYR" },
  TH: { locale: "th", currency: "THB" },
  VN: { locale: "vi", currency: "VND" },
  ID: { locale: "id", currency: "IDR" },
  PH: { locale: "en", currency: "PHP" },
  JP: { locale: "ja", currency: "JPY" },
  KR: { locale: "ko", currency: "KRW" },
  MX: { locale: "es", currency: "MXN" },
  BR: { locale: "pt", currency: "BRL" },
  AR: { locale: "es", currency: "ARS" },
  CL: { locale: "es", currency: "CLP" },
  CO: { locale: "es", currency: "COP" },
  SA: { locale: "ar", currency: "SAR" },
  AE: { locale: "ar", currency: "AED" },
  EG: { locale: "ar", currency: "EGP" },
  IL: { locale: "en", currency: "ILS" },
  TR: { locale: "tr", currency: "TRY" },
  PL: { locale: "pl", currency: "PLN" },
  CZ: { locale: "en", currency: "CZK" },
  HU: { locale: "en", currency: "HUF" },
  RO: { locale: "en", currency: "RON" },
  SE: { locale: "en", currency: "SEK" },
  NO: { locale: "en", currency: "NOK" },
  DK: { locale: "en", currency: "DKK" },
  CH: { locale: "en", currency: "CHF" },
  ZA: { locale: "en", currency: "ZAR" },
  NG: { locale: "en", currency: "NGN" },
  KE: { locale: "en", currency: "KES" },
  GH: { locale: "en", currency: "GHS" },
  RU: { locale: "ru", currency: "RUB" },
  UA: { locale: "en", currency: "UAH" },
  DE: { locale: "de", currency: "EUR" },
  FR: { locale: "fr", currency: "EUR" },
  ES: { locale: "es", currency: "EUR" },
  IT: { locale: "it", currency: "EUR" },
  NL: { locale: "nl", currency: "EUR" },
  PT: { locale: "pt", currency: "EUR" },
};

export function countryPrefsFromCode(iso2: string | undefined | null): CountryPrefs {
  const cc = (iso2 ?? "US").toUpperCase().slice(0, 2);
  if (TABLE[cc]) return TABLE[cc]!;
  if (EUR_ZONE[cc]) return EURO_EN;
  return { locale: "en", currency: "USD" };
}
