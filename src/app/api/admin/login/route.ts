import { NextResponse } from "next/server";
import { getAdminPassword, setAdminSessionCookie } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (
    !process.env.CMS_AUTH_SECRET?.trim() ||
    process.env.CMS_AUTH_SECRET.length < 16 ||
    !process.env.ADMIN_PASSWORD?.trim() ||
    process.env.ADMIN_PASSWORD.length < 8
  ) {
    return NextResponse.json(
      {
        error:
          "Set CMS_AUTH_SECRET (16+ chars) and ADMIN_PASSWORD (8+ chars) in .env.local",
      },
      { status: 503 },
    );
  }

  let body: { password?: string };
  try {
    body = (await request.json()) as { password?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const password = body.password ?? "";
  let expected: string;
  try {
    expected = getAdminPassword();
  } catch {
    return NextResponse.json({ error: "Auth misconfigured" }, { status: 503 });
  }

  if (password !== expected) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  await setAdminSessionCookie();

  return NextResponse.json({ ok: true });
}
