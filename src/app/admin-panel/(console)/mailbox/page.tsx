"use client";

import type { MailboxKind } from "@/lib/mailbox-types";
import { countryFromDialCode, formatCountryLabel } from "@/lib/country-display";
import { useCallback, useEffect, useMemo, useState } from "react";

type MailItem = {
  id: number;
  kind: MailboxKind;
  createdAt: string;
  readAt: string | null;
  fullName: string;
  email: string | null;
  whatsapp: string | null;
  country: string | null;
  message: string;
  requirements: string | null;
};

function badge(kind: MailboxKind) {
  return kind === "FREE_TRIAL"
    ? "bg-violet-500/15 text-violet-200 ring-violet-500/25"
    : "bg-sky-500/15 text-sky-200 ring-sky-500/25";
}

function kindLabel(kind: MailboxKind) {
  return kind === "FREE_TRIAL" ? "Free Trial" : "Contact";
}

/** Older submissions may have mis-filed contact info in one field. */
function displayEmail(it: MailItem): string | null {
  const e = it.email?.trim() ?? "";
  if (e) return e;
  const w = it.whatsapp?.trim() ?? "";
  if (w.includes("@")) return w;
  return null;
}

function displayWhatsapp(it: MailItem): string | null {
  const w = it.whatsapp?.trim() ?? "";
  if (!w || w.includes("@")) return null;
  return w;
}

function listSubtitle(it: MailItem): string {
  const e = displayEmail(it);
  const w = displayWhatsapp(it);
  if (e && w) return `${e} · ${w}`;
  if (e) return e;
  if (w) return w;
  return "";
}

function displayCountry(it: MailItem): string {
  const stored = formatCountryLabel(it.country);
  if (stored) return stored;
  return countryFromDialCode(displayWhatsapp(it));
}

export default function AdminMailboxPage() {
  const TAWK_DASHBOARD_URL = "https://dashboard.tawk.to/#/dashboard/69e0f8ff06245e1c331a9ce4";
  const [items, setItems] = useState<MailItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const [kind, setKind] = useState<MailboxKind | "ALL">("ALL");
  const [excludeRead, setExcludeRead] = useState(false);
  const [q, setQ] = useState("");

  const [openId, setOpenId] = useState<number | null>(null);

  const openItem = useMemo(
    () => (openId != null ? items.find((i) => i.id === openId) ?? null : null),
    [items, openId],
  );

  const load = useCallback(async () => {
    setLoading(true);
    setMsg("");
    try {
      const params = new URLSearchParams();
      if (kind !== "ALL") params.set("kind", kind);
      if (q.trim()) params.set("q", q.trim());
      if (!excludeRead) params.set("includeRead", "1");
      params.set("limit", "60");

      const r = await fetch(`/api/admin/mailbox?${params.toString()}`, { credentials: "include" });
      if (r.status === 401) {
        window.location.href = "/admin-panel/login";
        return;
      }
      const j = (await r.json()) as { items?: MailItem[]; error?: string };
      if (!r.ok) throw new Error(j.error || "Could not load mailbox.");
      const next = Array.isArray(j.items) ? j.items : [];
      setItems(next);
      setOpenId((cur) => {
        if (cur != null && next.some((x) => x.id === cur)) return cur;
        return next[0]?.id ?? null;
      });
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Could not load mailbox.");
      setItems([]);
      setOpenId(null);
    } finally {
      setLoading(false);
    }
  }, [excludeRead, kind, q]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (openId == null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenId(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openId]);

  async function setRead(id: number, read: boolean) {
    const r = await fetch(`/api/admin/mailbox/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read }),
      credentials: "include",
    });
    if (!r.ok) {
      setMsg("Update failed.");
      return;
    }
    const j = (await r.json()) as { readAt?: string | null };
    setItems((cur) =>
      cur.map((x) =>
        x.id === id ? { ...x, readAt: j.readAt ?? (read ? new Date().toISOString() : null) } : x,
      ),
    );
  }

  return (
    <div className="flex h-full min-h-[calc(100vh-9rem)] w-full flex-col">
      <div className="flex flex-1 flex-col">
        <div className="border-b border-zinc-800/80 px-1 pb-4">
          <div className="grid gap-3 lg:grid-cols-[minmax(320px,1fr)_180px_180px_auto_auto_auto] lg:items-center">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, email, message…"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-100 outline-none ring-[var(--accent)]/30 focus:border-[var(--accent)] focus:ring-2"
            />
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value as MailboxKind | "ALL")}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none ring-[var(--accent)]/30 focus:border-[var(--accent)] focus:ring-2"
            >
              <option value="ALL">All</option>
              <option value="CONTACT">Contact</option>
              <option value="FREE_TRIAL">Free Trial</option>
            </select>
            <label className="flex items-center justify-between gap-2 rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-200">
              <span className="text-xs text-zinc-300">Exclude read</span>
              <input
                type="checkbox"
                checked={excludeRead}
                onChange={(e) => setExcludeRead(e.target.checked)}
                className="h-4 w-4 accent-[var(--accent)]"
              />
            </label>
            <button
              type="button"
              onClick={() => void load()}
              className="rounded-xl bg-zinc-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-700"
            >
              Refresh
            </button>
            <a
              href={TAWK_DASHBOARD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900/80 px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-zinc-100 transition hover:border-[var(--accent)]/40 hover:text-white"
            >
              tawk.to
            </a>
            <a
              href="https://mail.zoho.com/zm/#mail/folder/inbox"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900/80 px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-zinc-100 transition hover:border-[var(--accent)]/40 hover:text-white"
            >
              zoho
            </a>
          </div>
          {msg ? <p className="mt-3 text-xs text-zinc-400">{msg}</p> : null}
        </div>

        <div className="grid min-h-0 flex-1 border-t border-zinc-800/80 lg:grid-cols-[380px_minmax(0,1fr)]">
          <aside className="border-b border-zinc-800/80 lg:border-b-0 lg:border-r lg:border-zinc-800/80">
            <div className="max-h-[36vh] overflow-auto lg:max-h-[72vh]">
              {loading ? (
                <p className="p-4 text-sm text-zinc-500">Loading…</p>
              ) : items.length === 0 ? (
                <p className="p-6 text-center text-sm text-zinc-500">No messages.</p>
              ) : (
                <ul className="divide-y divide-zinc-800/80">
                  {items.map((it) => {
                    const unread = !it.readAt;
                    const sub = listSubtitle(it);
                    const active = openItem?.id === it.id;
                    return (
                      <li key={it.id}>
                        <button
                          type="button"
                          onClick={() => setOpenId(it.id)}
                          className={`w-full px-4 py-4 text-left transition ${
                            active ? "bg-zinc-900/90" : "hover:bg-zinc-900/60"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-white">
                                {it.fullName}
                                {unread ? (
                                  <span className="ml-2 inline-flex h-2 w-2 translate-y-[-1px] rounded-full bg-[var(--accent)]" />
                                ) : null}
                              </p>
                              {sub ? (
                                <p className="mt-0.5 truncate text-xs text-zinc-500">{sub}</p>
                              ) : null}
                              <p className="mt-1 line-clamp-2 text-xs text-zinc-400">{it.message}</p>
                            </div>
                            <span
                              className={[
                                "shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ring-1",
                                badge(it.kind),
                              ].join(" ")}
                            >
                              {kindLabel(it.kind)}
                            </span>
                          </div>
                          <p className="mt-2 text-[10px] text-zinc-500">
                            {new Date(it.createdAt).toLocaleString()}
                          </p>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </aside>

          <section className="min-h-[36vh] lg:min-h-[72vh]">
            {openItem ? (
              <div className="flex h-full flex-col">
                <div className="flex shrink-0 items-start justify-between gap-3 border-b border-zinc-800 px-5 py-4">
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                      {kindLabel(openItem.kind)}
                    </p>
                    <h2 className="mt-1 truncate text-lg font-semibold text-white">
                      {openItem.fullName}
                    </h2>
                    <p className="mt-1 text-xs text-zinc-500">
                      {new Date(openItem.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void setRead(openItem.id, !openItem.readAt)}
                    className="rounded-lg border border-zinc-600 px-3 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-900"
                  >
                    {openItem.readAt ? "Mark unread" : "Mark read"}
                  </button>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                        Email
                      </p>
                      <p className="mt-1.5 break-all text-sm text-zinc-200">
                        {displayEmail(openItem) ?? "—"}
                      </p>
                    </div>
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                        WhatsApp
                      </p>
                      <p className="mt-1.5 break-all text-sm text-zinc-200">
                        {displayWhatsapp(openItem) ?? "—"}
                      </p>
                    </div>
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 sm:col-span-2">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                        Country
                      </p>
                      <p className="mt-1.5 text-sm text-zinc-200">
                        {displayCountry(openItem) || "—"}
                      </p>
                    </div>
                    {openItem.requirements?.trim() ? (
                      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 sm:col-span-2">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                          Requirements
                        </p>
                        <p className="mt-1.5 whitespace-pre-wrap text-sm text-zinc-200">
                          {openItem.requirements}
                        </p>
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                      Message
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-zinc-200">
                      {openItem.message}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid h-full place-items-center px-6 text-center">
                <div>
                  <p className="text-base font-semibold text-zinc-300">Select a message</p>
                  <p className="mt-2 text-sm text-zinc-500">
                    Choose any item from the left list to read it here.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

    </div>
  );
}
