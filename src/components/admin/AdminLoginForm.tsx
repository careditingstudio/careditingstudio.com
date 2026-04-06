"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setError("");
    setLoading(true);
    try {
      const r = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!r.ok) {
        const j = (await r.json().catch(() => null)) as { error?: string } | null;
        setError(j?.error || "Login failed.");
        return;
      }
      router.replace("/admin-panel");
      router.refresh();
    } catch {
      setError("Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_50%_35%,rgba(196,92,38,0.18)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(680px_420px_at_15%_20%,rgba(255,255,255,0.07)_0%,transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.0)_0%,rgba(0,0,0,0.55)_70%,rgba(0,0,0,0.85)_100%)]" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6">
        <div className="rounded-3xl border border-zinc-800/90 bg-zinc-950/60 p-7 shadow-[0_30px_90px_-45px_rgba(0,0,0,0.85)] backdrop-blur">
          <h1 className="text-xl font-semibold tracking-tight text-white">
            Admin login
          </h1>

          <div className="mt-6 space-y-4">
            <div>
              <label
                className="block text-sm font-medium text-zinc-200"
                htmlFor="username"
              >
                Username
              </label>
              <input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none ring-[var(--accent)]/30 focus:border-[var(--accent)] focus:ring-2"
                autoComplete="username"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-zinc-200"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none ring-[var(--accent)]/30 focus:border-[var(--accent)] focus:ring-2"
                autoComplete="current-password"
                onKeyDown={(e) => {
                  if (e.key === "Enter") void submit();
                }}
              />
            </div>

            {error ? <p className="text-sm text-red-400">{error}</p> : null}

            <button
              type="button"
              disabled={loading}
              onClick={() => void submit()}
              className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:bg-[var(--accent-hover)] disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

