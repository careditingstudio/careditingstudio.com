import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "cms_admin";

function getSecret() {
  const s = process.env.CMS_AUTH_SECRET;
  if (!s || s.length < 16) {
    throw new Error(
      "CMS_AUTH_SECRET must be set (min 16 characters). Add it to .env.local",
    );
  }
  return s;
}

export function getAdminPassword() {
  const p = process.env.ADMIN_PASSWORD;
  if (!p || p.length < 8) {
    throw new Error(
      "ADMIN_PASSWORD must be set (min 8 characters). Add it to .env.local",
    );
  }
  return p;
}

/** Safe check for middleware / early init without throwing */
export function adminAuthConfigured(): boolean {
  try {
    getSecret();
    getAdminPassword();
    return true;
  } catch {
    return false;
  }
}

export function signAdminSession(): string {
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const nonce = randomBytes(8).toString("hex");
  const payload = Buffer.from(JSON.stringify({ exp, nonce }), "utf-8");
  const payloadB64 = payload.toString("base64url");
  const sig = createHmac("sha256", getSecret())
    .update(payloadB64)
    .digest("base64url");
  return `${payloadB64}.${sig}`;
}

export function verifyAdminSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  try {
    const secret = process.env.CMS_AUTH_SECRET;
    if (!secret || secret.length < 16) return false;
    const [payloadB64, sig] = token.split(".");
    if (!payloadB64 || !sig) return false;
    const expected = createHmac("sha256", secret)
      .update(payloadB64)
      .digest("base64url");
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
    const payload = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf-8"),
    ) as { exp: number };
    return typeof payload.exp === "number" && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export async function setAdminSessionCookie() {
  const token = signAdminSession();
  const jar = await cookies();
  jar.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
}

export async function clearAdminSessionCookie() {
  const jar = await cookies();
  jar.delete(ADMIN_SESSION_COOKIE);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  return verifyAdminSessionToken(jar.get(ADMIN_SESSION_COOKIE)?.value);
}
