"use client";

import { useMemo, useState } from "react";
import { Field, Input, PrimaryButton, Textarea } from "@/components/forms/FormFields";

function validEmailOrWhatsapp(v: string): boolean {
  const s = v.trim();
  if (!s) return false;
  if (s.includes("@")) return s.includes(".") && !s.startsWith("@") && !s.endsWith("@");
  const digits = s.replace(/\D/g, "");
  return digits.length >= 7;
}

export function ContactForm() {
  const [fullName, setFullName] = useState("");
  const [emailOrWhatsapp, setEmailOrWhatsapp] = useState("");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successId, setSuccessId] = useState<number | null>(null);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  const canSubmit = useMemo(() => {
    return (
      fullName.trim().length >= 2 &&
      validEmailOrWhatsapp(emailOrWhatsapp) &&
      message.trim().length >= 5 &&
      !submitting
    );
  }, [emailOrWhatsapp, fullName, message, submitting]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");
    setSuccessId(null);

    const nextErr: { [k: string]: string } = {};
    if (fullName.trim().length < 2) nextErr.fullName = "Please enter your full name.";
    if (!validEmailOrWhatsapp(emailOrWhatsapp))
      nextErr.emailOrWhatsapp = "Enter a valid email or WhatsApp number.";
    if (message.trim().length < 5) nextErr.message = "Please write a little more detail.";
    setErrors(nextErr);
    if (Object.keys(nextErr).length) return;

    setSubmitting(true);
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, emailOrWhatsapp, message }),
      });
      const j = (await r.json()) as { ok?: boolean; id?: number; error?: string };
      if (!r.ok) throw new Error(j.error || "Could not send message.");

      setSuccessId(typeof j.id === "number" ? j.id : 1);
      setFullName("");
      setEmailOrWhatsapp("");
      setMessage("");
      setErrors({});
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Could not send message.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-10">
      <div className="rounded-2xl border border-[var(--line)] bg-[var(--background)] p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-2)]">
              Quick message
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-[var(--foreground)]">
              Send us a note
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              We usually reply fast. Leave your email or WhatsApp and your message.
            </p>
          </div>
        </div>

        {successId ? (
          <div className="mt-6 rounded-xl border border-emerald-200/40 bg-emerald-50/60 p-4 text-emerald-900">
            <p className="text-sm font-semibold">Message received.</p>
            <p className="mt-1 text-sm opacity-90">
              Thanks! We’ll get back to you shortly.
            </p>
          </div>
        ) : null}

        {serverError ? (
          <div className="mt-6 rounded-xl border border-red-200/50 bg-red-50/60 p-4 text-red-900">
            <p className="text-sm font-semibold">Couldn’t send</p>
            <p className="mt-1 text-sm opacity-90">{serverError}</p>
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="mt-8 grid gap-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Full name" error={errors.fullName}>
              {(id, describedBy) => (
                <Input
                  id={id}
                  describedBy={describedBy}
                  value={fullName}
                  onChange={setFullName}
                  placeholder="Your name"
                  autoComplete="name"
                />
              )}
            </Field>
            <Field label="Email or WhatsApp" error={errors.emailOrWhatsapp}>
              {(id, describedBy) => (
                <Input
                  id={id}
                  describedBy={describedBy}
                  value={emailOrWhatsapp}
                  onChange={setEmailOrWhatsapp}
                  placeholder="name@email.com or +8801…"
                  autoComplete="email"
                />
              )}
            </Field>
          </div>

          <Field
            label="Message"
            error={errors.message}
            hint="Tell us what you need, turnaround time, and any special instructions."
          >
            {(id, describedBy) => (
              <Textarea
                id={id}
                describedBy={describedBy}
                value={message}
                onChange={setMessage}
                placeholder="Write your message…"
                rows={7}
              />
            )}
          </Field>

          <div className="grid gap-3 sm:grid-cols-[1fr,auto] sm:items-center">
            <p className="text-xs text-[var(--muted-2)]">
              By sending, you agree we can contact you back.
            </p>
            <div className="sm:min-w-[220px]">
              <PrimaryButton type="submit" disabled={!canSubmit}>
                {submitting ? "Sending…" : "Send message"}
              </PrimaryButton>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

