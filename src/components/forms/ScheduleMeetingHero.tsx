type Props = {
  email: string;
  whatsappDial: string;
  whatsappDisplay: string;
};

export function ScheduleMeetingHero({ email, whatsappDial, whatsappDisplay }: Props) {
  const waHref = whatsappDial ? `https://wa.me/${whatsappDial}` : "";

  return (
    <section className="mx-auto w-full max-w-[82rem]">
      <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <div>
          <span className="inline-flex items-center rounded-full border border-[var(--line-strong)] bg-[color-mix(in_oklab,var(--background)_88%,white_12%)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
            Schedule
          </span>
          <h1 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight text-[var(--foreground)] sm:text-4xl lg:text-[2.75rem]">
            Book a call with{" "}
            <span className="bg-gradient-to-r from-[var(--accent)] via-[#f0a47a] to-[#ec8f62] bg-clip-text text-transparent">
              Car Editing Studio
            </span>
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--muted)] sm:text-base">
            Choose a slot below — we&apos;ll confirm by email or WhatsApp.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#schedule-form"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--accent)] via-[var(--accent)] to-[var(--accent-hover)] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_-14px_rgba(224,122,69,0.7)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-16px_rgba(224,122,69,0.85)]"
            >
              Pick a time
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
            </a>
            {waHref ? (
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--line-strong)] bg-[color-mix(in_oklab,var(--background)_88%,white_12%)] px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)]/40"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                </svg>
                {whatsappDisplay || "WhatsApp us"}
              </a>
            ) : null}
          </div>
        </div>

        <aside className="relative">
          <div className="relative overflow-hidden rounded-3xl border border-[var(--line-strong)] bg-[color-mix(in_oklab,var(--background)_90%,white_10%)] p-6 shadow-[0_24px_60px_-25px_rgba(0,0,0,0.6)] sm:p-8">
            <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[var(--accent)]/15 blur-3xl" aria-hidden />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-white/[0.04] blur-3xl" aria-hidden />

            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-2)]">
              What to expect
            </p>
            <h2 className="mt-3 text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-[1.35rem]">
              A quick call to align on your project.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              References, scope, pricing, and timeline — in one conversation.
            </p>

            <div className="mt-5 grid gap-2.5">
              {[
                "Review your photos and goals",
                "Quote and turnaround options",
                "Next steps before we start",
              ].map((line) => (
                <div key={line} className="flex items-start gap-2.5">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--accent)]/15 text-[var(--accent)]">
                    <svg
                      viewBox="0 0 20 20"
                      width="12"
                      height="12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M4 10.5 8 14l8-9" />
                    </svg>
                  </span>
                  <p className="text-sm text-[var(--foreground)]/90">{line}</p>
                </div>
              ))}
            </div>

            {(email || waHref) ? (
              <div className="mt-6 grid gap-2 border-t border-[var(--line)] pt-4 text-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-2)]">
                  Contact
                </p>
                {email ? (
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex items-center gap-2 text-[var(--foreground)] transition hover:text-[var(--accent)]"
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="m21 7-9 6L3 7" />
                    </svg>
                    <span className="break-all">{email}</span>
                  </a>
                ) : null}
                {waHref ? (
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[var(--foreground)] transition hover:text-[var(--accent)]"
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="text-[var(--accent)]" aria-hidden>
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                    </svg>
                    <span>{whatsappDisplay || "WhatsApp"}</span>
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
        </aside>
      </div>
    </section>
  );
}
