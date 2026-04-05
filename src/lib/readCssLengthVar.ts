export function readCssLengthVarPx(name: string, fallbackPx: number): number {
  if (typeof document === "undefined") return fallbackPx;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (!raw) return fallbackPx;
  if (raw.endsWith("rem")) {
    const n = parseFloat(raw);
    return Number.isFinite(n) ? n * 16 : fallbackPx;
  }
  if (raw.endsWith("px")) {
    const n = parseFloat(raw);
    return Number.isFinite(n) ? n : fallbackPx;
  }
  return fallbackPx;
}
