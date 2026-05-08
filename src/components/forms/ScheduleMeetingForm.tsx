"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Field, Input } from "@/components/forms/FormFields";
import { TurnstileWidget } from "@/components/forms/TurnstileWidget";
import { CalendarScheduler } from "@/components/ui/calendar-scheduler";

function validEmail(s: string): boolean {
  const t = s.trim();
  if (!t) return false;
  return t.includes("@") && !t.startsWith("@") && !t.endsWith("@") && t.length <= 254;
}

function validWhatsapp(s: string): boolean {
  const digits = s.replace(/\D/g, "");
  return digits.length >= 7;
}

const DEFAULT_TIME_SLOTS = [
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
] as const;

export function ScheduleMeetingForm({
  turnstileSiteKey,
}: {
  turnstileSiteKey: string;
}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [meetingDate, setMeetingDate] = useState<Date | undefined>(new Date());
  const [meetingTime, setMeetingTime] = useState<string | undefined>(undefined);

  const [turnstileToken, setTurnstileToken] = useState("");
  const [captchaState, setCaptchaState] = useState<"idle" | "ready" | "error" | "expired">(
    "idle",
  );

  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successId, setSuccessId] = useState<number | null>(null);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  const captchaRequired = Boolean(turnstileSiteKey);
  const contactOk = validEmail(email) || validWhatsapp(whatsapp);

  const canSubmit = useMemo(() => {
    const basic =
      fullName.trim().length >= 2 &&
      contactOk &&
      Boolean(meetingDate) &&
      Boolean(meetingTime) &&
      !submitting;
    if (!basic) return false;
    if (captchaRequired) return turnstileToken.length > 0 && captchaState !== "error";
    return true;
  }, [
    captchaRequired,
    captchaState,
    contactOk,
    fullName,
    meetingDate,
    meetingTime,
    submitting,
    turnstileToken,
  ]);

  function validate(): boolean {
    const nextErr: { [k: string]: string } = {};
    if (fullName.trim().length < 2) nextErr.fullName = "Please enter your name.";
    if (!contactOk)
      nextErr.contact = "Enter a valid email and/or WhatsApp number (at least one).";
    if (!meetingDate) nextErr.meetingDate = "Please pick a meeting date.";
    if (!meetingTime) nextErr.meetingTime = "Please pick a time slot.";
    if (captchaRequired && !turnstileToken)
      nextErr.captcha = "Please complete the captcha.";
    setErrors(nextErr);
    return Object.keys(nextErr).length === 0;
  }

  function resetForm() {
    setFullName("");
    setEmail("");
    setWhatsapp("");
    setMeetingDate(new Date());
    setMeetingTime(undefined);
    setTurnstileToken("");
    setCaptchaState("idle");
    setErrors({});
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");
    setSuccessId(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      const r = await fetch("/api/schedule-meeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email: email.trim() || undefined,
          whatsapp: whatsapp.trim() || undefined,
          meetingDate: meetingDate ? meetingDate.toISOString() : undefined,
          meetingTime,
          message: "Schedule meeting request",
          turnstileToken,
        }),
      });
      const j = (await r.json()) as { ok?: boolean; id?: number; error?: string };
      if (!r.ok) throw new Error(j.error || "Could not submit.");
      setSuccessId(typeof j.id === "number" ? j.id : 1);
      resetForm();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Could not submit.");
    } finally {
      setSubmitting(false);
    }
  }

  if (successId) {
    return (
      <section
        id="schedule-form"
        className="overflow-hidden rounded-3xl border border-[var(--line-strong)] bg-[color-mix(in_oklab,var(--background)_92%,white_8%)] p-7 shadow-[0_24px_60px_-25px_rgba(0,0,0,0.6)] sm:p-10"
      >
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/40">
            <svg
              viewBox="0 0 24 24"
              width="28"
              height="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M5 12.5 10 17l9-10" />
            </svg>
          </div>
          <h2 className="mt-5 text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
            Meeting request received.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
            Thanks! We&apos;ll confirm your slot shortly via email or WhatsApp
            with a meeting link. Look out for our message in the next few hours.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              prefetch
              className="inline-flex items-center justify-center rounded-xl border border-[var(--line-strong)] bg-[var(--background)] px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)]/40"
            >
              Back to home
            </Link>
            <button
              type="button"
              onClick={() => setSuccessId(null)}
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_-14px_rgba(224,122,69,0.65)] transition hover:-translate-y-0.5"
            >
              Schedule another meeting
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="schedule-form"
      className="overflow-hidden rounded-3xl border border-[var(--line-strong)] bg-[color-mix(in_oklab,var(--background)_92%,white_8%)] shadow-[0_24px_60px_-25px_rgba(0,0,0,0.6)]"
    >
      <div className="border-b border-[var(--line)] bg-[color-mix(in_oklab,var(--background)_85%,white_15%)] px-6 py-5 sm:px-8 sm:py-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--muted-2)]">
              Book your meeting
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl">
              Pick a date and time.
            </h2>
          </div>
        </div>
      </div>

      {serverError ? (
        <div className="m-5 rounded-xl border border-red-200/50 bg-red-50/60 p-4 text-red-900 sm:m-6">
          <p className="text-sm font-semibold">Couldn&apos;t submit</p>
          <p className="mt-1 text-sm opacity-90">{serverError}</p>
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="grid gap-7 p-6 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Name" error={errors.fullName}>
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
          </div>
          <Field label="Email">
            {(id, describedBy) => (
              <Input
                id={id}
                describedBy={describedBy}
                value={email}
                onChange={setEmail}
                placeholder="you@example.com"
                type="email"
                autoComplete="email"
              />
            )}
          </Field>

          <Field label="WhatsApp">
            {(id, describedBy) => (
              <Input
                id={id}
                describedBy={describedBy}
                value={whatsapp}
                onChange={setWhatsapp}
                placeholder="+1 234 567 8900"
                type="tel"
                autoComplete="tel"
              />
            )}
          </Field>

          {errors.contact ? (
            <p className="sm:col-span-2 text-xs font-medium text-red-500">{errors.contact}</p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <CalendarScheduler
            timeSlots={[...DEFAULT_TIME_SLOTS]}
            onConfirm={(val) => {
              setMeetingDate(val.date);
              setMeetingTime(val.time);
              setErrors((cur) => {
                const n = { ...cur };
                delete n.meetingDate;
                delete n.meetingTime;
                return n;
              });
            }}
          />
          {(errors.meetingDate || errors.meetingTime) ? (
            <p className="text-xs font-medium text-red-500">
              {errors.meetingDate || errors.meetingTime}
            </p>
          ) : null}
        </div>

        {captchaRequired ? (
          <div className="grid gap-2">
            <TurnstileWidget
              siteKey={turnstileSiteKey}
              onToken={(t) => setTurnstileToken(t)}
              onStatus={(s) => setCaptchaState(s)}
            />
            {errors.captcha ? (
              <p className="text-xs font-medium text-red-500">{errors.captcha}</p>
            ) : captchaState === "error" ? (
              <p className="text-xs text-red-500">
                Captcha failed to load. Please refresh and try again.
              </p>
            ) : captchaState === "expired" ? (
              <p className="text-xs text-[var(--muted-2)]">Captcha expired — please retry.</p>
            ) : null}
          </div>
        ) : null}

        <div className="flex flex-col items-stretch justify-between gap-3 border-t border-[var(--line)] pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-[var(--muted-2)]">
            By submitting you agree to be contacted about your meeting request.
          </p>
          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex min-w-[220px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--accent)] via-[var(--accent)] to-[var(--accent-hover)] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_14px_28px_-14px_rgba(224,122,69,0.7)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-16px_rgba(224,122,69,0.85)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {submitting ? "Sending request…" : "Confirm meeting request"}
            {!submitting ? (
              <svg
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden
                className="h-4 w-4"
              >
                <path
                  d="M4 10h10m0 0-3.5-3.5M14 10l-3.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : null}
          </button>
        </div>
      </form>
    </section>
  );
}
