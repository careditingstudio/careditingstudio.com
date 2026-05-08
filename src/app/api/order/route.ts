import { NextResponse } from "next/server";
import { createMailboxMessage } from "@/lib/db/mailbox-repository";
import { verifyTurnstileToken } from "@/lib/turnstile-server";

export const runtime = "nodejs";

function getIpFromRequest(request: Request): string | null {
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
  const turnstileToken = typeof b.turnstileToken === "string" ? b.turnstileToken : "";

  const ip = getIpFromRequest(request);
  const captcha = await verifyTurnstileToken({ token: turnstileToken, ip });
  if (!captcha.ok) {
    return NextResponse.json({ error: captcha.error }, { status: 400 });
  }

  try {
    const selectedServices = Array.isArray(b.services)
      ? b.services
          .map((v) => (typeof v === "string" ? v.trim() : ""))
          .filter((v) => v.length > 0)
      : [];
    const googleDriveLink =
      typeof b.googleDriveLink === "string" ? b.googleDriveLink.trim() : "";
    const neededBeforeRaw =
      typeof b.neededBefore === "string" ? b.neededBefore.trim() : "";
    const neededBeforeDate = neededBeforeRaw ? new Date(neededBeforeRaw) : null;
    const neededBefore =
      neededBeforeDate && !Number.isNaN(neededBeforeDate.getTime())
        ? neededBeforeDate.toISOString().slice(0, 10)
        : "";

    const requirementsLines = [
      selectedServices.length > 0 ? `Services: ${selectedServices.join(", ")}` : "",
      neededBefore ? `Need it before: ${neededBefore}` : "",
      googleDriveLink ? `Google Drive link: ${googleDriveLink}` : "",
    ].filter((s) => s.length > 0);

    const created = await createMailboxMessage({
      kind: "ORDER",
      fullName: b.fullName,
      email: b.email,
      whatsapp: b.whatsapp,
      emailOrWhatsapp: b.emailOrWhatsapp,
      country: b.country,
      requirements: requirementsLines.join("\n"),
      message: b.message,
      ip,
      userAgent: request.headers.get("user-agent"),
    });

    return NextResponse.json({ ok: true, id: created.id });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Could not submit.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

