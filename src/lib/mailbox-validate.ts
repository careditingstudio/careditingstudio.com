export function cleanText(v: unknown, maxLen: number): string {
  const s = typeof v === "string" ? v.trim() : "";
  if (!s) return "";
  if (s.length <= maxLen) return s;
  return s.slice(0, maxLen);
}

export function cleanEmail(v: unknown): string {
  const s = typeof v === "string" ? v.trim() : "";
  if (!s) return "";
  // intentionally simple: avoid rejecting valid-but-rare emails
  if (!s.includes("@") || s.startsWith("@") || s.endsWith("@")) return "";
  if (s.length > 254) return "";
  return s;
}

export function cleanPhoneOrWhatsapp(v: unknown): string {
  const s = typeof v === "string" ? v.trim() : "";
  if (!s) return "";
  // keep + and digits only
  const out = s.replace(/[^\d+]/g, "");
  // very loose sanity bounds
  if (out.replace(/\D/g, "").length < 7) return "";
  if (out.length > 32) return "";
  return out;
}

