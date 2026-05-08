import { NextResponse } from "next/server";
import { createMailboxMessage } from "@/lib/db/mailbox-repository";
import { verifyTurnstileToken } from "@/lib/turnstile-server";

export const runtime = "nodejs";

function getIpFromRequest(request: Request): string | null {
  const fwd = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return fwd || request.headers.get("x-real-ip") || null;
}

function asTrimmedString(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
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
    const meetingDateRaw = asTrimmedString(b.meetingDate);
    const parsedDate = meetingDateRaw ? new Date(meetingDateRaw) : null;
    const meetingDateLabel =
      parsedDate && !Number.isNaN(parsedDate.getTime())
        ? parsedDate.toISOString().slice(0, 10)
        : "";

    const meetingTime = asTrimmedString(b.meetingTime);
    const duration = asTrimmedString(b.duration);
    const platform = asTrimmedString(b.platform);
    const topic = asTrimmedString(b.topic);
    const timeZone = asTrimmedString(b.timeZone);
    const companyName = asTrimmedString(b.companyName);

    const requirementsLines = [
      "[MEETING REQUEST]",
      meetingDateLabel ? `Date: ${meetingDateLabel}` : "",
      meetingTime ? `Time: ${meetingTime}${timeZone ? ` (${timeZone})` : ""}` : "",
      duration ? `Duration: ${duration}` : "",
      platform ? `Platform: ${platform}` : "",
      topic ? `Topic: ${topic}` : "",
      companyName ? `Company: ${companyName}` : "",
    ].filter((s) => s.length > 0);

    const created = await createMailboxMessage({
      kind: "CONTACT",
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
