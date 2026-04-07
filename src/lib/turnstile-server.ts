import "server-only";

import { ENV_APP } from "@/config/deployment-env";

export async function verifyTurnstileToken(args: {
  token: string;
  ip?: string | null;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const secret = process.env[ENV_APP.TURNSTILE_SECRET_KEY]?.trim() ?? "";
  if (!secret) {
    // allow local/dev without captcha configured
    if (process.env.NODE_ENV !== "production") return { ok: true };
    return { ok: false, error: "Captcha is not configured." };
  }

  const form = new URLSearchParams();
  form.set("secret", secret);
  form.set("response", args.token);
  if (args.ip) form.set("remoteip", args.ip);

  let r: Response;
  try {
    r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
  } catch {
    return { ok: false, error: "Captcha verification failed. Please try again." };
  }

  let j: unknown;
  try {
    j = await r.json();
  } catch {
    return { ok: false, error: "Captcha verification failed. Please try again." };
  }

  const data = j as { success?: unknown };
  if (data && data.success === true) return { ok: true };
  return { ok: false, error: "Captcha failed. Please try again." };
}

