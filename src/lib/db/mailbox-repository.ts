import "server-only";

import { prisma } from "@/lib/db/prisma";
import type { MailboxKind } from "@/lib/mailbox-types";
import { cleanEmail, cleanPhoneOrWhatsapp, cleanText } from "@/lib/mailbox-validate";

function parseEmailOrWhatsapp(v: unknown): { email?: string; whatsapp?: string } {
  const raw = typeof v === "string" ? v.trim() : "";
  const asEmail = cleanEmail(raw);
  if (asEmail) return { email: asEmail };
  const asPhone = cleanPhoneOrWhatsapp(raw);
  if (asPhone) return { whatsapp: asPhone };
  return {};
}

export async function createMailboxMessage(args: {
  kind: MailboxKind;
  fullName: unknown;
  email?: unknown;
  whatsapp?: unknown;
  emailOrWhatsapp?: unknown;
  country?: unknown;
  message: unknown;
  requirements?: unknown;
  ip?: string | null;
  userAgent?: string | null;
}): Promise<{ id: number }> {
  const fullName = cleanText(args.fullName, 120);
  const fromFields = {
    email: cleanEmail(args.email) || null,
    whatsapp: cleanPhoneOrWhatsapp(args.whatsapp) || null,
  };
  let email = fromFields.email;
  let whatsapp = fromFields.whatsapp;
  if (!email && !whatsapp) {
    const fb = parseEmailOrWhatsapp(args.emailOrWhatsapp);
    email = fb.email ?? null;
    whatsapp = fb.whatsapp ?? null;
  }
  if (!email && whatsapp && whatsapp.includes("@")) {
    const fixed = cleanEmail(whatsapp);
    email = fixed || null;
    whatsapp = fixed ? null : whatsapp;
  }
  const country = cleanText(args.country, 120) || null;
  const message = cleanText(args.message, 4000);
  const requirements = cleanText(args.requirements, 4000) || null;

  if (!fullName) throw new Error("Please enter your full name.");
  if (!email && !whatsapp) throw new Error("Please enter an email or WhatsApp number.");
  if (!message) throw new Error("Please write a message.");

  const created = await prisma.mailboxMessage.create({
    data: {
      kind: args.kind,
      fullName,
      email: email || null,
      whatsapp: whatsapp || null,
      country,
      message,
      requirements,
      ip: args.ip ?? null,
      userAgent: args.userAgent ?? null,
    },
    select: { id: true },
  });

  return created;
}

export async function adminListMailboxMessages(args: {
  kind?: MailboxKind;
  q?: string;
  includeRead?: boolean;
  limit?: number;
  cursorId?: number;
}) {
  const limit = Math.max(1, Math.min(args.limit ?? 30, 100));
  const includeRead = Boolean(args.includeRead);
  const q = (args.q ?? "").trim();

  return prisma.mailboxMessage.findMany({
    take: limit,
    ...(args.cursorId ? { skip: 1, cursor: { id: args.cursorId } } : {}),
    where: {
      ...(args.kind ? { kind: args.kind } : {}),
      ...(!includeRead ? { readAt: null } : {}),
      ...(q
        ? {
            OR: [
              { fullName: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
              { whatsapp: { contains: q, mode: "insensitive" } },
              { message: { contains: q, mode: "insensitive" } },
              { requirements: { contains: q, mode: "insensitive" } },
              { country: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    select: {
      id: true,
      kind: true,
      createdAt: true,
      readAt: true,
      fullName: true,
      email: true,
      whatsapp: true,
      country: true,
      message: true,
      requirements: true,
    },
  });
}

export async function adminMarkMailboxRead(id: number, read: boolean) {
  return prisma.mailboxMessage.update({
    where: { id },
    data: { readAt: read ? new Date() : null },
    select: { id: true, readAt: true },
  });
}

