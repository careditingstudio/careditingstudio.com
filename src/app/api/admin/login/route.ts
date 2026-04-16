import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { ENV_APP } from "@/config/deployment-env";
import {
  getAdminPassword,
  getAdminUsername,
  setAdminSessionCookie,
} from "@/lib/admin-auth";

export const runtime = "nodejs";

const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 10 * 60 * 1000;
const LOGIN_BLOCK_MS = 15 * 60 * 1000;

type LoginAttemptState = {
  failures: number[];
  blockedUntil: number;
};

const globalForAdminLogin = globalThis as typeof globalThis & {
  __adminLoginAttempts?: Map<string, LoginAttemptState>;
};

const loginAttempts =
  globalForAdminLogin.__adminLoginAttempts ??
  (globalForAdminLogin.__adminLoginAttempts = new Map<string, LoginAttemptState>());

function getClientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return fwd || request.headers.get("x-real-ip") || "unknown";
}

function pruneFailures(now: number, failures: number[]): number[] {
  return failures.filter((ts) => now - ts < LOGIN_WINDOW_MS);
}

function getLoginState(ip: string, now: number): LoginAttemptState {
  const state = loginAttempts.get(ip);
  if (!state) {
    return { failures: [], blockedUntil: 0 };
  }
  const next = {
    failures: pruneFailures(now, state.failures),
    blockedUntil: state.blockedUntil > now ? state.blockedUntil : 0,
  };
  loginAttempts.set(ip, next);
  return next;
}

function recordLoginFailure(ip: string, now: number) {
  const state = getLoginState(ip, now);
  const failures = [...state.failures, now];
  const blockedUntil =
    failures.length >= MAX_LOGIN_ATTEMPTS ? now + LOGIN_BLOCK_MS : state.blockedUntil;
  loginAttempts.set(ip, { failures, blockedUntil });
}

function clearLoginFailures(ip: string) {
  loginAttempts.delete(ip);
}

function safeEqualText(a: string, b: string): boolean {
  const aBuf = Buffer.from(a, "utf8");
  const bBuf = Buffer.from(b, "utf8");
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}

export async function POST(request: Request) {
  const now = Date.now();
  const clientIp = getClientIp(request);
  const loginState = getLoginState(clientIp, now);
  if (loginState.blockedUntil > now) {
    const retryAfterSeconds = Math.ceil((loginState.blockedUntil - now) / 1000);
    return NextResponse.json(
      { error: "Too many failed login attempts. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfterSeconds) },
      },
    );
  }

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

  const usernameMatches = safeEqualText(username, expectedUser);
  const passwordMatches = safeEqualText(password, expected);
  if (!usernameMatches || !passwordMatches) {
    recordLoginFailure(clientIp, now);
    return NextResponse.json(
      { error: "Invalid username or password" },
      { status: 401 },
    );
  }

  clearLoginFailures(clientIp);
  await setAdminSessionCookie();

  return NextResponse.json({ ok: true });
}
