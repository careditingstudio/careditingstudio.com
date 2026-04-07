import { NextResponse } from "next/server";
import { createMailboxMessage } from "@/lib/db/mailbox-repository";

export const runtime = "nodejs";

function getIpFromRequest(request: Request): string | null {
  // Vercel / proxies
  const fwd = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return fwd || request.headers.get("x-real-ip") || null;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;

  try {
    const created = await createMailboxMessage({
      kind: "CONTACT",
      fullName: b.fullName,
      emailOrWhatsapp: b.emailOrWhatsapp,
      message: b.message,
      ip: getIpFromRequest(request),
      userAgent: request.headers.get("user-agent"),
    });
    return NextResponse.json({ ok: true, id: created.id });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Could not submit.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

