/** Build a `tel:` href from a display phone string. */
export function telHref(phone: string): string {
  const t = phone.trim();
  if (!t) return "";
  const core = t.startsWith("+")
    ? `+${t.slice(1).replace(/\D/g, "")}`
    : t.replace(/\D/g, "");
  return core.length > 0 ? `tel:${core}` : "";
}
