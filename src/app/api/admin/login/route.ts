import { NextResponse } from "next/server";
import { ENV_APP } from "@/config/deployment-env";
import { getAdminPassword, setAdminSessionCookie } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secret = process.env[ENV_APP.CMS_AUTH_SECRET]?.trim();
  const adminPass = process.env[ENV_APP.ADMIN_PASSWORD]?.trim();
  if (!secret || secret.length < 16 || !adminPass || adminPass.length < 8) {
    return NextResponse.json(
      {
        error: `Set ${ENV_APP.CMS_AUTH_SECRET} (16+ chars) and ${ENV_APP.ADMIN_PASSWORD} (8+ chars) in .env`,
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
