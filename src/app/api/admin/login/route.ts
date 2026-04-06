import { NextResponse } from "next/server";
import { ENV_APP } from "@/config/deployment-env";
import {
  getAdminPassword,
  getAdminUsername,
  setAdminSessionCookie,
} from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secret = process.env[ENV_APP.CMS_AUTH_SECRET]?.trim();
  const adminUser = process.env[ENV_APP.ADMIN_USERNAME]?.trim();
  const adminPass = process.env[ENV_APP.ADMIN_PASSWORD]?.trim();
  if (
    !secret ||
    secret.length < 16 ||
    !adminUser ||
    adminUser.length < 3 ||
    !adminPass ||
    adminPass.length < 8
  ) {
    return NextResponse.json(
      {
        error: `Set ${ENV_APP.CMS_AUTH_SECRET} (16+ chars), ${ENV_APP.ADMIN_USERNAME} (3+ chars) and ${ENV_APP.ADMIN_PASSWORD} (8+ chars) in .env`,
      },
      { status: 503 },
    );
  }

  let body: { username?: string; password?: string };
  try {
    body = (await request.json()) as { username?: string; password?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const username = (body.username ?? "").trim();
  const password = body.password ?? "";
  let expectedUser: string;
  let expected: string;
  try {
    expectedUser = getAdminUsername();
    expected = getAdminPassword();
  } catch {
    return NextResponse.json({ error: "Auth misconfigured" }, { status: 503 });
  }

  if (username !== expectedUser || password !== expected) {
    return NextResponse.json(
      { error: "Invalid username or password" },
      { status: 401 },
    );
  }

  await setAdminSessionCookie();

  return NextResponse.json({ ok: true });
}
