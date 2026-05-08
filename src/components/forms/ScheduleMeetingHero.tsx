type Props = {
  email: string;
  whatsappDial: string;
  whatsappDisplay: string;
};

const HIGHLIGHTS: { title: string; body: string; icon: "video" | "sparkle" | "clock" }[] = [
  {
    title: "Free 15–30 min discovery call",
    body: "Walk us through your photos, brand, and goals — we'll suggest the smartest editing path.",
    icon: "video",
  },
  {
    title: "Pricing & turnaround clarity",
    body: "Get a transparent quote and timeline tailored to your batch size and complexity.",
    icon: "clock",
  },
  {
    title: "Style alignment, no surprises",
    body: "Share references and get a same-day style plan so the first delivery hits the mark.",
    icon: "sparkle",
  },
];

function Icon({ name }: { name: "video" | "sparkle" | "clock" }) {
  if (name === "video") {
    return (
      <svg
        viewBox="0 0 24 24"
        width="22"
        height="22"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <rect x="2" y="6" width="14" height="12" rx="2.5" />
        <path d="m16 10 6-3v10l-6-3z" />
      </svg>
    );
  }
  if (name === "clock") {
    return (
      <svg
        viewBox="0 0 24 24"
        width="22"
        height="22"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 3l1.8 4.7L18.5 9l-4.7 1.8L12 15l-1.8-4.2L5.5 9l4.7-1.3z" />
      <path d="M19 14l.9 2.1 2.1.9-2.1.9L19 20l-.9-2.1-2.1-.9 2.1-.9z" />
    </svg>
  );
}

export function ScheduleMeetingHero({ email, whatsappDial, whatsappDisplay }: Props) {
  const waHref = whatsappDial ? `https://wa.me/${whatsappDial}` : "";

  return (
    <section className="mx-auto w-full max-w-[82rem]">
      <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] bg-[color-mix(in_oklab,var(--background)_88%,white_12%)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            Booking open this week
          </span>
          <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-[3.5rem]">
            Schedule a meeting with the
            <span className="ml-2 bg-gradient-to-r from-[var(--accent)] via-[#f0a47a] to-[#ec8f62] bg-clip-text text-transparent">
              Car Editing Studio
            </span>{" "}
            team.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
            Pick a date and time that works for you. We&apos;ll review your photos,
            align on style and turnaround, and turn your ideas into a clear plan
            you can move forward with — no commitment required.
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

          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {HIGHLIGHTS.map((h) => (
              <li
                key={h.title}
                className="group relative overflow-hidden rounded-2xl border border-[var(--line)] bg-[color-mix(in_oklab,var(--background)_92%,white_8%)] p-4 backdrop-blur-sm transition hover:border-[var(--accent)]/35"
              >
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--accent)]/12 text-[var(--accent)] ring-1 ring-[var(--accent)]/25">
                    <Icon name={h.icon} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--foreground)]">
                      {h.title}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
                      {h.body}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <aside className="relative">
          <div className="relative overflow-hidden rounded-3xl border border-[var(--line-strong)] bg-[color-mix(in_oklab,var(--background)_90%,white_10%)] p-6 shadow-[0_24px_60px_-25px_rgba(0,0,0,0.6)] sm:p-8">
            <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[var(--accent)]/15 blur-3xl" aria-hidden />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-white/[0.04] blur-3xl" aria-hidden />

            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-2)]">
              What you&apos;ll get
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-[1.65rem]">
              A focused 1-on-1 with our retouching lead.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
              We tailor every meeting to your project — bring your shoot, sample
              edits, or a Drive folder, and we&apos;ll build a delivery roadmap
              with you in real-time.
            </p>

            <div className="mt-6 grid gap-3">
              {[
                "Edit-style review tailored to your brand",
                "Workflow & file-handover plan that fits your pipeline",
                "Pricing options for one-off, ongoing, and high-volume needs",
                "A working timeline you can share with your team",
              ].map((line) => (
                <div key={line} className="flex items-start gap-3">
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
              <div className="mt-7 grid gap-2 border-t border-[var(--line)] pt-5 text-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-2)]">
                  Prefer a quick chat?
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
