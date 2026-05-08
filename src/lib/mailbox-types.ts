export type MailboxKind = "CONTACT" | "FREE_TRIAL" | "ORDER";

export function isMailboxKind(v: unknown): v is MailboxKind {
  return v === "CONTACT" || v === "FREE_TRIAL" || v === "ORDER";
}

