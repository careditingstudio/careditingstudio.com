"use client";

import { useMemo, useState } from "react";
import { CalendarIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  countryLabelFromCode,
  countrySelectOptionsForm,
} from "@/lib/country-select-options";
import type { VisitorShellMessages } from "@/i18n/visitor-shell";
import { getVisitorShellMessages } from "@/i18n/visitor-shell";
import { Field, Input, PrimaryButton, Select, Textarea } from "@/components/forms/FormFields";
import { TurnstileWidget } from "@/components/forms/TurnstileWidget";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function validEmail(s: string): boolean {
  const t = s.trim();
  if (!t) return false;
  return t.includes("@") && !t.startsWith("@") && !t.endsWith("@") && t.length <= 254;
}

function validWhatsapp(s: string): boolean {
  const digits = s.replace(/\D/g, "");
  return digits.length >= 7;
}

function formatDate(d: Date, locale?: string): string {
  return d.toLocaleDateString(locale || undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const DEFAULT_SERVICE_OPTIONS = [
  "Car photo editing",
  "Bike photo editing",
  "Bicycle photo editing",
  "Background removal",
  "Shadow creation",
  "Color correction",
  "Retouching",
];

type StepId = 0 | 1 | 2 | 3;

export function OrderForm({
  turnstileSiteKey,
  serviceOptions = DEFAULT_SERVICE_OPTIONS,
  uiLocale = "en",
  forms: formsProp,
}: {
  turnstileSiteKey: string;
  serviceOptions?: string[];
  uiLocale?: string;
  forms?: VisitorShellMessages["forms"];
}) {
  const router = useRouter();
  const f = formsProp ?? getVisitorShellMessages("en").forms;
  const countryOptions = useMemo(
    () => countrySelectOptionsForm(uiLocale, f.selectCountry, f.countryOther),
    [uiLocale, f.selectCountry, f.countryOther],
  );
  const stepLabels = useMemo(
    () =>
      [f.orderStepService, f.orderStepDetails, f.orderStepDate, f.orderStepMessage] as [
        string,
        string,
        string,
        string,
      ],
    [f],
  );
  const [step, setStep] = useState<StepId>(0);
  const [dateOpen, setDateOpen] = useState(false);

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [googleDriveLink, setGoogleDriveLink] = useState("");
  const [neededBefore, setNeededBefore] = useState<Date | undefined>(undefined);
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
      country.trim().length > 0 &&
      contactOk &&
      Boolean(neededBefore) &&
      message.trim().length >= 2 &&
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
    neededBefore,
    submitting,
    turnstileToken,
  ]);

  function toggleService(service: string) {
    setSelectedServices((cur) =>
      cur.includes(service) ? cur.filter((s) => s !== service) : [...cur, service],
    );
  }

  /**
   * Validates fields required to *reach* `targetStep` after clicking Next.
   * Message + captcha are only checked when `submit: true` (final step submit).
   */
  function validateStep(targetStep: StepId, opts?: { submit?: boolean }): boolean {
    const nextErr: { [k: string]: string } = {};

    if (targetStep >= 1) {
      if (selectedServices.length === 0) nextErr.services = "Select at least one service.";
    }

    if (targetStep >= 2) {
      if (fullName.trim().length < 2) nextErr.fullName = "Please enter your full name.";
      if (!country.trim()) nextErr.country = "Please select a country.";
      if (!contactOk) nextErr.contact = "Enter a valid email and/or WhatsApp number (at least one).";
      if (googleDriveLink.trim()) {
        try {
          const u = new URL(googleDriveLink.trim());
          if (!u.hostname.includes("drive.google.com"))
            nextErr.googleDriveLink = "Please enter a valid Google Drive link.";
        } catch {
          nextErr.googleDriveLink = "Please enter a valid Google Drive link.";
        }
      }
    }

    if (targetStep >= 3) {
      if (!neededBefore) nextErr.neededBefore = "Please select a date.";
      if (opts?.submit) {
        if (message.trim().length < 2) nextErr.message = "Please write a message.";
        if (captchaRequired && !turnstileToken) nextErr.captcha = "Please complete the captcha.";
      }
    }

    setErrors(nextErr);
    return Object.keys(nextErr).length === 0;
  }

  function next() {
    const to = (step + 1) as StepId;
    if (!validateStep(to)) return;
    setStep(to);
  }

  function back() {
    setServerError("");
    setErrors((cur) => {
      const n = { ...cur };
      delete n.captcha;
      return n;
    });
    setStep((s) => (s === 0 ? 0 : ((s - 1) as StepId)));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");
    setSuccessId(null);
    if (!validateStep(3, { submit: true })) return;

    setSubmitting(true);
    try {
      const countryLabel = countryLabelFromCode(country, uiLocale, f.countryOther);
      const r = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email: email.trim() || undefined,
          whatsapp: whatsapp.trim() || undefined,
          country: countryLabel,
          services: selectedServices,
          googleDriveLink: googleDriveLink.trim() || undefined,
          neededBefore: neededBefore ? neededBefore.toISOString() : undefined,
          message,
          turnstileToken,
        }),
      });
      const j = (await r.json()) as { ok?: boolean; id?: number; error?: string };
      if (!r.ok) throw new Error(j.error || "Could not submit.");

      setSuccessId(typeof j.id === "number" ? j.id : 1);
      setStep(0);
      setSelectedServices([]);
      setFullName("");
      setCountry("");
      setEmail("");
      setWhatsapp("");
      setGoogleDriveLink("");
      setNeededBefore(undefined);
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

  const stepCount = stepLabels.length;

  if (successId) {
    return (
      <section className="mt-2">
        <OrderConfirmation
          orderId={successId}
          onBack={() => {
            router.back();
          }}
        />
      </section>
    );
  }

  return (
    <section className="mt-2">
      <div className="overflow-hidden rounded-3xl border border-[var(--line-strong)] bg-[color-mix(in_oklab,var(--background)_92%,white_8%)] shadow-[0_18px_50px_-25px_rgba(0,0,0,0.55)]">
        {serverError ? (
          <div className="m-5 rounded-xl border border-red-200/50 bg-red-50/60 p-4 text-red-900 sm:m-6">
            <p className="text-sm font-semibold">{f.couldNotSend}</p>
            <p className="mt-1 text-sm opacity-90">{serverError}</p>
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="grid gap-6 p-5 sm:p-7 md:p-8">
          <div className="mx-auto w-full max-w-[640px]">
            <div className="relative flex items-start justify-between">
              <div className="absolute left-5 right-5 top-4 sm:top-5 h-px bg-[var(--line)]" aria-hidden />
              <div
                className="absolute left-5 top-4 sm:top-5 h-px bg-[var(--accent)] transition-[width] duration-300"
                style={{ width: `calc((100% - 2.5rem) * ${step / (stepCount - 1)})` }}
                aria-hidden
              />
              {stepLabels.map((label, idx) => {
                const i = idx as StepId;
                const active = step === i;
                const done = step > i;
                const reachable = i <= step;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (submitting) return;
                      if (reachable) setStep(i);
                    }}
                    disabled={!reachable || submitting}
                    className="relative z-1 flex w-16 flex-col items-center gap-2 sm:w-20"
                  >
                    <span
                      className={[
                        "grid h-8 w-8 place-items-center rounded-full text-xs font-semibold ring-2 transition sm:h-10 sm:w-10 sm:text-sm",
                        active
                          ? "bg-[var(--accent)] text-white ring-[var(--accent)]/30"
                          : done
                            ? "bg-[var(--accent)] text-white ring-[var(--accent)]/30"
                            : "bg-[color-mix(in_oklab,var(--background)_88%,white_12%)] text-[var(--muted)] ring-[var(--line)]",
                      ].join(" ")}
                    >
                      {idx + 1}
                    </span>
                    <span
                      className={[
                        "text-[11px] font-medium tracking-wide sm:text-xs",
                        active
                          ? "text-[var(--foreground)]"
                          : done
                            ? "text-[var(--foreground)]"
                            : "text-[var(--muted-2)]",
                      ].join(" ")}
                    >
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {step === 0 ? (
            <div className="grid gap-3">
              <Field label={f.orderStepService} error={errors.services}>
                {() => (
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {serviceOptions.map((service) => {
                      const checked = selectedServices.includes(service);
                      return (
                        <label
                          key={service}
                          className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${
                            checked
                              ? "border-[var(--accent)]/50 bg-[var(--accent)]/10 text-[var(--foreground)]"
                              : "border-[var(--line)] bg-[color-mix(in_oklab,var(--background)_95%,white_5%)] text-[var(--muted)] hover:border-[var(--line-strong)]"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleService(service)}
                            className="h-4 w-4 accent-[var(--accent)]"
                          />
                          <span>{service}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </Field>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={f.fullName} error={errors.fullName}>
                {(id, describedBy) => (
                  <Input
                    id={id}
                    describedBy={describedBy}
                    value={fullName}
                    onChange={setFullName}
                    placeholder={f.phName}
                    autoComplete="name"
                  />
                )}
              </Field>

              <Field label={f.country} error={errors.country}>
                {(id, describedBy) => (
                  <Select id={id} describedBy={describedBy} value={country} onChange={setCountry}>
                    {countryOptions.map((c) => (
                      <option key={c.code || "blank"} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </Select>
                )}
              </Field>

              <Field label={f.email}>
                {(id, describedBy) => (
                  <Input
                    id={id}
                    describedBy={describedBy}
                    value={email}
                    onChange={setEmail}
                    placeholder={f.phEmail}
                    type="email"
                    autoComplete="email"
                  />
                )}
              </Field>

              <Field label={f.whatsapp}>
                {(id, describedBy) => (
                  <Input
                    id={id}
                    describedBy={describedBy}
                    value={whatsapp}
                    onChange={setWhatsapp}
                    placeholder={f.phWhatsapp}
                    type="tel"
                    autoComplete="tel"
                  />
                )}
              </Field>

              {errors.contact ? (
                <p className="sm:col-span-2 text-xs font-medium text-red-500">{errors.contact}</p>
              ) : null}

              <div className="sm:col-span-2">
                <Field label={f.googleDriveLink} error={errors.googleDriveLink}>
                  {(id, describedBy) => (
                    <Input
                      id={id}
                      describedBy={describedBy}
                      value={googleDriveLink}
                      onChange={setGoogleDriveLink}
                      placeholder={f.phDrive}
                      type="url"
                    />
                  )}
                </Field>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="mx-auto w-full max-w-[560px]">
              <Field label={f.deadline} error={errors.neededBefore}>
                {(id, describedBy) => (
                  <Popover open={dateOpen} onOpenChange={setDateOpen}>
                    <PopoverTrigger asChild>
                      <button
                        id={id}
                        aria-describedby={describedBy || undefined}
                        type="button"
                        className={[
                          "flex w-full items-center justify-between gap-3 rounded-xl border bg-[var(--background)] px-4 py-3.5 text-left text-sm shadow-sm transition",
                          neededBefore
                            ? "border-[var(--accent)]/40 text-[var(--foreground)] ring-[var(--accent)]/15"
                            : "border-[var(--line)] text-[var(--muted)] hover:border-[var(--line-strong)]",
                          "outline-none focus:border-[var(--accent)]/40 focus:ring-4 focus:ring-[var(--accent)]/25",
                        ].join(" ")}
                      >
                        <span>{neededBefore ? formatDate(neededBefore, uiLocale) : "I need it before…"}</span>
                        <CalendarIcon className="h-4 w-4 opacity-80" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent align="center" className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={neededBefore}
                        onSelect={(d) => {
                          setNeededBefore(d);
                          if (d) setDateOpen(false);
                        }}
                        captionLayout="dropdown"
                        startMonth={new Date()}
                        endMonth={new Date(new Date().getFullYear() + 2, 11)}
                        disabled={{ before: new Date(new Date().setHours(0, 0, 0, 0)) }}
                        autoFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              </Field>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="grid gap-5">
              <Field label={f.orderStepMessage} error={errors.message}>
                {(id, describedBy) => (
                  <Textarea
                    id={id}
                    describedBy={describedBy}
                    value={message}
                    onChange={setMessage}
                    placeholder={f.phMessage}
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
            </div>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-[1fr,auto] sm:items-center sm:gap-6">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={back}
                disabled={step === 0 || submitting}
                className="rounded-xl border border-[var(--line)] bg-[var(--background)] px-4 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--line-strong)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {f.back}
              </button>
              {step < 3 ? (
                <button
                  type="button"
                  onClick={next}
                  disabled={submitting}
                  className="rounded-xl bg-[color-mix(in_oklab,var(--accent)_82%,black_18%)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[color-mix(in_oklab,var(--accent)_90%,black_10%)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {f.next}
                </button>
              ) : null}
            </div>

            {step === 3 ? (
              <div className="sm:min-w-[220px]">
                <PrimaryButton type="submit" disabled={!canSubmit}>
                  {submitting ? f.submittingOrder : f.submitOrder}
                </PrimaryButton>
              </div>
            ) : null}
          </div>
        </form>
      </div>
    </section>
  );
}

function OrderConfirmation({
  orderId,
  onBack,
}: {
  orderId: number;
  onBack: () => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-[var(--line-strong)] bg-[color-mix(in_oklab,var(--background)_92%,white_8%)] shadow-[0_24px_60px_-25px_rgba(0,0,0,0.6)]">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--accent)]/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl"
        aria-hidden
      />

      <div className="relative px-6 pb-10 pt-12 text-center sm:px-10 sm:pt-14">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/40">
          <svg
            viewBox="0 0 24 24"
            width="36"
            height="36"
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

        <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300/90">
          Confirmation
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
          Your order has been sent to <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-[var(--accent)] via-[#f0a47a] to-[#ec8f62] bg-clip-text text-transparent">
            Car Editing Studio
          </span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
          Thanks for trusting us with your photos. Our team is reviewing your
          request and will reach out shortly via email or WhatsApp with the next
          steps.
        </p>

        <div className="mx-auto mt-7 inline-flex items-center gap-3 rounded-full border border-[var(--line-strong)] bg-[color-mix(in_oklab,var(--background)_85%,white_15%)] px-4 py-2 text-xs text-[var(--muted)]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Order reference
          <span className="font-mono text-[var(--foreground)]">#{orderId}</span>
        </div>
      </div>

      <div className="relative grid gap-3 border-t border-[var(--line)] bg-[color-mix(in_oklab,var(--background)_88%,white_12%)] px-6 py-7 sm:px-10 sm:py-8 md:grid-cols-3">
        <button
          type="button"
          onClick={onBack}
          className="group inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--line-strong)] bg-[var(--background)] px-5 py-3.5 text-sm font-semibold text-[var(--foreground)] transition hover:-translate-y-0.5 hover:border-[var(--accent)]/40"
        >
          <svg
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden
            className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
          >
            <path
              d="M16 10H6m0 0 3.5-3.5M6 10l3.5 3.5"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Go back
        </button>

        <Link
          href="/"
          prefetch
          className="group inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--line-strong)] bg-[var(--background)] px-5 py-3.5 text-sm font-semibold text-[var(--foreground)] transition hover:-translate-y-0.5 hover:border-[var(--accent)]/40"
        >
          <svg
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden
            className="h-4 w-4"
          >
            <path
              d="M3 9.5 10 4l7 5.5V16a1.5 1.5 0 0 1-1.5 1.5h-3v-5h-5v5h-3A1.5 1.5 0 0 1 3 16V9.5Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
          Go to home page
        </Link>

        <Link
          href="/schedule-meeting"
          prefetch
          className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[var(--accent)] via-[var(--accent)] to-[var(--accent-hover)] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_14px_28px_-14px_rgba(224,122,69,0.7)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-16px_rgba(224,122,69,0.85)]"
        >
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <rect x="3" y="5" width="18" height="16" rx="2.5" />
            <path d="M16 3v4M8 3v4M3 11h18" />
          </svg>
          Schedule a meeting
          <svg
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
          >
            <path
              d="M4 10h10m0 0-3.5-3.5M14 10l-3.5 3.5"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
