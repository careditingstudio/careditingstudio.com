export type MailboxKind = "CONTACT" | "FREE_TRIAL";

export function isMailboxKind(v: unknown): v is MailboxKind {
  return v === "CONTACT" || v === "FREE_TRIAL";
}

