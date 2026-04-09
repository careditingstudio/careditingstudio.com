"use client";

import { useMemo, useState } from "react";
import { TRIAL_COUNTRY_OPTIONS, trialCountryLabelFromCode } from "@/config/countries";
import { Field, Input, PrimaryButton, Select, Textarea } from "@/components/forms/FormFields";
import { TurnstileWidget } from "@/components/forms/TurnstileWidget";

function validEmail(s: string): boolean {
  const t = s.trim();
  if (!t) return false;
  return (
    t.includes("@") &&
    !t.startsWith("@") &&
    !t.endsWith("@") &&
    t.length <= 254
  );
}

function validWhatsapp(s: string): boolean {
  const digits = s.replace(/\D/g, "");
  return digits.length >= 7;
}

const COUNTRY_SELECT: { code: string; name: string }[] = [
  { code: "", name: "Select your country" },
  ...TRIAL_COUNTRY_OPTIONS,
];

export function FreeTrialForm({ turnstileSiteKey }: { turnstileSiteKey: string }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [country, setCountry] = useState("");
  const [requirements, setRequirements] = useState("");
  const [message, setMessage] = useState("");

  const [turnstileToken, setTurnstileToken] = useState("");
  const [captchaState, setCaptchaState] = useState<"idle" | "ready" | "error" | "expired">("idle");

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
      country.trim().length > 0 &&
      message.trim().length >= 5 &&
      !submitting;
    if (!basic) return false;
    if (captchaRequired) return turnstileToken.length > 0 && captchaState !== "error";
    return true;
  }, [
    captchaRequired,
    captchaState,
    contactOk,
    country,
    fullName,
    message,
    submitting,
    turnstileToken,
  ]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");
    setSuccessId(null);

    const nextErr: { [k: string]: string } = {};
    if (fullName.trim().length < 2) nextErr.fullName = "Please enter your full name.";
    if (!contactOk)
      nextErr.contact = "Enter a valid email and/or WhatsApp number (at least one).";
    if (!country.trim()) nextErr.country = "Please select a country.";
    if (message.trim().length < 5) nextErr.message = "Please describe what you want.";
    if (captchaRequired && !turnstileToken) nextErr.captcha = "Please complete the captcha.";
    setErrors(nextErr);
    if (Object.keys(nextErr).length) return;

    const countryLabel = trialCountryLabelFromCode(country);

    setSubmitting(true);
    try {
      const r = await fetch("/api/free-trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email: email.trim() || undefined,
          whatsapp: whatsapp.trim() || undefined,
          country: countryLabel,
          requirements,
          message,
          turnstileToken,
        }),
      });
      const j = (await r.json()) as { ok?: boolean; id?: number; error?: string };
      if (!r.ok) throw new Error(j.error || "Could not submit.");

      setSuccessId(typeof j.id === "number" ? j.id : 1);
      setFullName("");
      setEmail("");
      setWhatsapp("");
      setCountry("");
      setRequirements("");
      setMessage("");
      setErrors({});
      setTurnstileToken("");
      setCaptchaState("idle");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Could not submit.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-10">
      <div className="rounded-2xl border border-[var(--line)] bg-[var(--background)] p-6 shadow-sm sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-2)]">
          Free trial request
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-[var(--foreground)]">
          Tell us what you need
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Share your requirements and we’ll reply with the next steps. (Uploads stay in the admin
          library — this form is for your request details.)
        </p>

        {successId ? (
          <div className="mt-6 rounded-xl border border-emerald-200/40 bg-emerald-50/60 p-4 text-emerald-900">
            <p className="text-sm font-semibold">Request received.</p>
            <p className="mt-1 text-sm opacity-90">
              Thanks! We’ll contact you with the trial workflow.
            </p>
          </div>
        ) : null}

        {serverError ? (
          <div className="mt-6 rounded-xl border border-red-200/50 bg-red-50/60 p-4 text-red-900">
            <p className="text-sm font-semibold">Couldn’t submit</p>
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
            <div aria-hidden className="hidden sm:block" />
            <Field label="Email (optional)">
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
            <Field label="WhatsApp (optional)" hint="Include country code if you can.">
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

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Country" error={errors.country}>
              {(id, describedBy) => (
                <Select id={id} describedBy={describedBy} value={country} onChange={setCountry}>
                  {COUNTRY_SELECT.map((c) => (
                    <option key={c.code || "blank"} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              )}
            </Field>

            <Field
              label="Comments / requirements (optional)"
              hint="Example: background color, shadow style, clipping path needed, etc."
            >
              {(id, describedBy) => (
                <Input
                  id={id}
                  describedBy={describedBy}
                  value={requirements}
                  onChange={setRequirements}
                  placeholder="Any specific requirements…"
                />
              )}
            </Field>
          </div>

          <Field
            label="Message"
            error={errors.message}
            hint="Tell us your image count, turnaround time, and any reference links."
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

          <div className="grid gap-3 sm:grid-cols-[1fr,auto] sm:items-center">
            <p className="text-xs text-[var(--muted-2)]">
              We’ll reply using the contact details you provided.
            </p>
            <div className="sm:min-w-[220px]">
              <PrimaryButton type="submit" disabled={!canSubmit}>
                {submitting ? "Submitting…" : "Request free trial"}
              </PrimaryButton>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
