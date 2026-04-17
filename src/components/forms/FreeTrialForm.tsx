"use client";

import { useMemo, useRef, useState } from "react";
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

const DEFAULT_SERVICE_OPTIONS = [
  "Background removal",
  "Shadow creation",
  "Color correction",
  "Retouching",
  "Clipping path",
  "Reflection/shadow",
];

export function FreeTrialForm({
  turnstileSiteKey,
  serviceOptions = DEFAULT_SERVICE_OPTIONS,
}: {
  turnstileSiteKey: string;
  serviceOptions?: string[];
}) {
  const MAX_FILES = 8;
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const ALLOWED_FILE_TYPES = new Set([
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif",
  ]);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [country, setCountry] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [googleDriveLink, setGoogleDriveLink] = useState("");
  const [message, setMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
    if (googleDriveLink.trim()) {
      try {
        const u = new URL(googleDriveLink.trim());
        if (!u.hostname.includes("drive.google.com")) {
          nextErr.googleDriveLink = "Please enter a valid Google Drive link.";
        }
      } catch {
        nextErr.googleDriveLink = "Please enter a valid Google Drive link.";
      }
    }
    if (message.trim().length < 5) nextErr.message = "Please describe what you want.";
    if (captchaRequired && !turnstileToken) nextErr.captcha = "Please complete the captcha.";
    setErrors(nextErr);
    if (Object.keys(nextErr).length) return;

    const countryLabel = trialCountryLabelFromCode(country);
    const uploadedFileNames = uploadedFiles.map(
      (f) => `${f.name} (${Math.max(1, Math.round(f.size / 1024))} KB)`,
    );

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
          services: selectedServices,
          googleDriveLink: googleDriveLink.trim() || undefined,
          message,
          uploadedFiles: uploadedFileNames,
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
      setSelectedServices([]);
      setGoogleDriveLink("");
      setMessage("");
      setUploadedFiles([]);
      setErrors({});
      setTurnstileToken("");
      setCaptchaState("idle");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Could not submit.");
    } finally {
      setSubmitting(false);
    }
  }

  function formatSize(bytes: number): string {
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function onPickFiles(list: FileList | null) {
    if (!list) return;
    const next = Array.from(list);
    const valid: File[] = [];
    const rejects: string[] = [];

    for (const f of next) {
      const isAllowed =
        ALLOWED_FILE_TYPES.has(f.type) ||
        /\.(jpe?g|png|webp|gif|avif)$/i.test(f.name);
      if (!isAllowed) {
        rejects.push(`${f.name}: unsupported format`);
        continue;
      }
      if (f.size > MAX_FILE_SIZE) {
        rejects.push(`${f.name}: over 10 MB`);
        continue;
      }
      valid.push(f);
    }

    const merged = [...uploadedFiles, ...valid].slice(0, MAX_FILES);
    setUploadedFiles(merged);

    if (rejects.length > 0) {
      setServerError(`Some files were skipped: ${rejects.slice(0, 2).join(", ")}.`);
    }
  }

  function removeFile(index: number) {
    setUploadedFiles((current) => current.filter((_, i) => i !== index));
  }

  function toggleService(service: string) {
    setSelectedServices((current) =>
      current.includes(service)
        ? current.filter((s) => s !== service)
        : [...current, service],
    );
  }

  return (
    <section className="mt-2">
      <div className="overflow-hidden rounded-3xl border border-[var(--line-strong)] bg-[color-mix(in_oklab,var(--background)_92%,white_8%)] shadow-[0_18px_50px_-25px_rgba(0,0,0,0.55)]">
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

        <form onSubmit={onSubmit} className="grid gap-7 p-5 sm:p-7 md:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
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

            <div className="sm:col-span-2 grid gap-5 lg:grid-cols-2">
              <Field label="Upload sample images">
                {(id, describedBy) => (
                  <div className="rounded-xl border border-dashed border-[var(--line-strong)] bg-[color-mix(in_oklab,var(--background)_95%,white_5%)] p-3">
                    <input
                      ref={fileInputRef}
                      id={id}
                      aria-describedby={describedBy}
                      type="file"
                      multiple
                      accept=".jpg,.jpeg,.png,.webp,.gif,.avif,image/jpeg,image/png,image/webp,image/gif,image/avif"
                      onChange={(e) => onPickFiles(e.target.files)}
                      className="hidden"
                    />
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="rounded-lg bg-[var(--accent)] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[var(--accent-hover)]"
                      >
                        Choose images
                      </button>
                      <p className="text-xs text-[var(--muted-2)]">
                        JPG, PNG, WEBP, GIF, AVIF up to 10MB each
                      </p>
                    </div>
                  </div>
                )}
              </Field>

              <Field label="Google Drive link" error={errors.googleDriveLink}>
                {(id, describedBy) => (
                  <Input
                    id={id}
                    describedBy={describedBy}
                    value={googleDriveLink}
                    onChange={setGoogleDriveLink}
                    placeholder="https://drive.google.com/..."
                    type="url"
                  />
                )}
              </Field>
            </div>
            {uploadedFiles.length > 0 ? (
              <div className="sm:col-span-2">
                <div className="flex flex-wrap gap-2">
                  {uploadedFiles.map((file, idx) => (
                    <button
                      key={`${file.name}-${idx}`}
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[color-mix(in_oklab,var(--background)_94%,black_6%)] px-3 py-1.5 text-xs text-[var(--foreground)] transition hover:border-[var(--accent)]/35"
                    >
                      <span className="max-w-[240px] truncate">{file.name}</span>
                      <span className="text-[var(--muted)]">{formatSize(file.size)}</span>
                      <span aria-hidden>×</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="sm:col-span-2">
              <Field label="Service">
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

            <div className="sm:col-span-2">
              <Field label="Message" error={errors.message}>
                {(id, describedBy) => (
                  <Textarea
                    id={id}
                    describedBy={describedBy}
                    value={message}
                    onChange={setMessage}
                    placeholder="Write your message…"
                    rows={6}
                  />
                )}
              </Field>
            </div>
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

          <div className="grid gap-3 sm:grid-cols-[1fr,auto] sm:items-center sm:gap-6">
            <p className="text-xs text-[var(--muted-2)]">Fast response after submission.</p>
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
