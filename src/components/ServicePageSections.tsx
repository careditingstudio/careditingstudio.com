import { display } from "@/app/fonts";
import { isUploadedAsset } from "@/lib/cms-types";
import { ServiceFeatureIcon } from "@/lib/service-feature-icons";
import Image from "next/image";

function CheckIcon() {
  return (
    <span
      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/15 text-[var(--accent)]"
      aria-hidden
    >
      <svg
        className="h-3 w-3"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 6l2.5 2.5L10 3"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function SectionShell({
  children,
  emphasize = false,
  className = "",
}: {
  children: React.ReactNode;
  emphasize?: boolean;
  className?: string;
}) {
  return (
    <section
      className={[
        "rounded-2xl border px-5 py-6 sm:px-7 sm:py-8",
        emphasize
          ? "border-[var(--line)] bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/85 dark:to-zinc-900/40"
          : "border-[var(--line)]/70 bg-zinc-50/50 dark:bg-zinc-900/25",
        className,
      ].join(" ")}
    >
      {children}
    </section>
  );
}

export function FeatureCardsBlock({
  sectionTitle,
  sectionSubtext,
  cards,
}: {
  sectionTitle: string;
  sectionSubtext?: string;
  cards: { iconKey: string; title: string; body: string }[];
}) {
  const list = [...cards.slice(0, 3)];
  while (list.length < 3) list.push({ iconKey: "sparkles", title: "", body: "" });

  return (
    <SectionShell emphasize>
      <div className="space-y-8 text-center sm:space-y-10">
        {sectionTitle.trim() ? (
          <div className="space-y-2">
            <h2
              className={`${display.className} text-2xl font-semibold text-[var(--foreground)] sm:text-3xl`}
            >
              {sectionTitle}
            </h2>
            {sectionSubtext?.trim() ? (
              <p className="mx-auto max-w-2xl text-[var(--muted)]">
                {sectionSubtext}
              </p>
            ) : null}
          </div>
        ) : null}
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {list.map((card, idx) => (
            <li key={idx} className="relative pt-8">
              <div className="absolute left-1/2 top-0 z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--background)]">
                <ServiceFeatureIcon
                  iconKey={card.iconKey}
                  className="h-6 w-6 text-[var(--foreground)]"
                />
              </div>
              <div className="h-full rounded-2xl border border-[var(--line)] bg-zinc-100/60 px-5 pb-6 pt-10 text-center dark:bg-zinc-900/50">
                {card.title.trim() ? (
                  <h3
                    className={`${display.className} text-lg font-semibold text-[var(--foreground)]`}
                  >
                    {card.title}
                  </h3>
                ) : (
                  <h3 className="text-sm text-[var(--muted-2)]">Title</h3>
                )}
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[var(--muted)]">
                  {card.body.trim() || "Add description in the page block editor."}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </SectionShell>
  );
}

export function SplitShowcaseBlock({
  title,
  body,
  imageSrc,
  imageAlt,
  imageRight,
}: {
  title?: string;
  body: string;
  imageSrc: string;
  imageAlt: string;
  imageRight: boolean;
}) {
  const src = imageSrc.trim();
  const textBlock = (
    <div className="flex flex-col justify-center space-y-4">
      {title?.trim() ? (
        <h2
          className={`${display.className} text-2xl font-semibold text-[var(--foreground)] sm:text-3xl`}
        >
          {title}
        </h2>
      ) : null}
      <p className="whitespace-pre-wrap leading-relaxed text-[var(--muted)]">
        {body.trim() || "Add body text in the block editor."}
      </p>
    </div>
  );

  const mediaBlock = (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[var(--line)] bg-zinc-900/40">
      {src ? (
        <Image
          src={src}
          alt={imageAlt.trim() || ""}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          unoptimized={isUploadedAsset(src)}
        />
      ) : (
        <div className="flex h-full min-h-[200px] items-center justify-center text-sm text-[var(--muted-2)]">
          Section image
        </div>
      )}
    </div>
  );

  return (
    <SectionShell>
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-10">
        {imageRight ? (
          <>
            {textBlock}
            {mediaBlock}
          </>
        ) : (
          <>
            {mediaBlock}
            {textBlock}
          </>
        )}
      </div>
    </SectionShell>
  );
}

export function PillChecklistBlock({
  title,
  subtext,
  pills,
  checks,
}: {
  title: string;
  subtext?: string;
  pills: string[];
  checks: string[];
}) {
  return (
    <SectionShell emphasize>
      <div className="space-y-8">
        <div className="space-y-2 text-center">
          {title.trim() ? (
            <h2
              className={`${display.className} text-2xl font-semibold text-[var(--foreground)] sm:text-3xl`}
            >
              {title}
            </h2>
          ) : null}
          {subtext?.trim() ? (
            <p className="mx-auto max-w-2xl text-[var(--muted)]">{subtext}</p>
          ) : null}
        </div>
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          <div className="flex flex-wrap gap-2">
            {pills.filter((p) => p.trim()).length === 0 ? (
              <p className="text-sm text-[var(--muted-2)]">Add category pills</p>
            ) : (
              pills
                .map((p) => p.trim())
                .filter(Boolean)
                .map((p) => (
                  <span
                    key={p}
                    className="rounded-full border border-[var(--line)] bg-zinc-100/80 px-4 py-2 text-sm text-[var(--foreground)] dark:bg-zinc-800/60"
                  >
                    {p}
                  </span>
                ))
            )}
          </div>
          <div className="rounded-2xl border border-[var(--line)] bg-zinc-950/80 p-5 dark:bg-zinc-950">
            <ul className="space-y-3">
              {checks.filter((c) => c.trim()).length === 0 ? (
                <li className="text-sm text-zinc-500">Add checklist items</li>
              ) : (
                checks
                  .map((c) => c.trim())
                  .filter(Boolean)
                  .map((c) => (
                    <li key={c} className="flex gap-3 text-sm text-zinc-200">
                      <CheckIcon />
                      <span>{c}</span>
                    </li>
                  ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

export function TickChecklistBlock({
  title,
  subtext,
  items,
  columns = 2,
}: {
  title: string;
  subtext?: string;
  items: string[];
  columns?: 1 | 2;
}) {
  const list = items.map((i) => i.trim()).filter(Boolean);
  return (
    <SectionShell emphasize>
      <div className="space-y-8">
        <div className="space-y-2 text-center">
          {title.trim() ? (
            <h2
              className={`${display.className} text-2xl font-semibold text-[var(--foreground)] sm:text-3xl`}
            >
              {title}
            </h2>
          ) : null}
          {subtext?.trim() ? (
            <p className="mx-auto max-w-2xl text-[var(--muted)]">{subtext}</p>
          ) : null}
        </div>
        <ul
          className={`grid gap-4 ${
            columns === 1 ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"
          }`}
        >
          {list.length === 0 ? (
            <li className="rounded-xl border border-zinc-800/80 px-4 py-3 text-sm text-zinc-500">
              Add checklist items.
            </li>
          ) : (
            list.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 rounded-xl border border-zinc-800/90 bg-zinc-950/80 px-4 py-3 text-zinc-100"
              >
                <CheckIcon />
                <span className="text-base font-semibold">{item}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </SectionShell>
  );
}

export function ValueColumnsBlock({
  eyebrow,
  title,
  body,
  columns,
}: {
  eyebrow?: string;
  title: string;
  body: string;
  columns: { title: string; body: string }[];
}) {
  const cols = columns.slice(0, 3);
  while (cols.length < 3) cols.push({ title: "", body: "" });

  return (
    <SectionShell>
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 lg:items-start">
        <div className="space-y-4">
          {eyebrow?.trim() ? (
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--muted-2)]">
              {eyebrow}
            </p>
          ) : null}
          {title.trim() ? (
            <h2
              className={`${display.className} text-2xl font-semibold text-[var(--foreground)] sm:text-3xl`}
            >
              {title}
            </h2>
          ) : null}
          <p className="whitespace-pre-wrap leading-relaxed text-[var(--muted)]">
            {body.trim() || "Add supporting copy."}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {cols.map((col, i) => (
            <div
              key={i}
              className="rounded-2xl border border-[var(--line)] bg-zinc-100/50 p-4 dark:bg-zinc-900/50"
            >
              <p className="text-[10px] font-semibold text-[var(--muted-2)]">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                {col.title.trim() || `Column ${i + 1}`}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                {col.body.trim() || "—"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

export function SupportCardsStripBlock({
  eyebrow,
  title,
  body,
  cards,
}: {
  eyebrow?: string;
  title: string;
  body: string;
  cards: { title: string; body: string }[];
}) {
  const cols = cards.slice(0, 3);
  while (cols.length < 3) cols.push({ title: "", body: "" });

  return (
    <SectionShell emphasize>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_2fr] lg:items-start">
        <div className="space-y-4">
          {eyebrow?.trim() ? (
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--muted-2)]">
              {eyebrow}
            </p>
          ) : null}
          <h2 className={`${display.className} text-3xl font-semibold text-[var(--foreground)]`}>
            {title.trim() || "Support heading"}
          </h2>
          <p className="whitespace-pre-wrap text-[var(--muted)] leading-relaxed">
            {body.trim() || "Support details"}
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {cols.map((col, i) => (
            <div key={i} className="rounded-2xl border border-[var(--line)] bg-zinc-950/80 p-4">
              <p className="text-[10px] font-semibold text-zinc-400">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-2 text-sm font-semibold text-white">{col.title.trim() || "Card title"}</h3>
              <p className="mt-2 text-sm text-zinc-300 leading-relaxed">{col.body.trim() || "Card text"}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

export function IconGridBlock({
  title,
  subtext,
  items,
}: {
  title: string;
  subtext?: string;
  items: { title: string; body: string }[];
}) {
  const list = items.slice(0, 4);
  while (list.length < 4) list.push({ title: "", body: "" });

  return (
    <SectionShell emphasize>
      <div className="space-y-8">
        <div className="space-y-2 text-center">
          {title.trim() ? (
            <h2
              className={`${display.className} text-2xl font-semibold text-[var(--foreground)] sm:text-3xl`}
            >
              {title}
            </h2>
          ) : null}
          {subtext?.trim() ? (
            <p className="mx-auto max-w-2xl text-[var(--muted)]">{subtext}</p>
          ) : null}
        </div>
        <ul className="grid gap-4 sm:grid-cols-2">
          {list.map((card, idx) => (
            <li
              key={idx}
              className="flex gap-4 rounded-2xl border border-[var(--line)] bg-zinc-950/40 px-4 py-4 dark:bg-zinc-950/80"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--background)] text-xs font-semibold text-[var(--muted)]">
                {idx + 1}
              </span>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-[var(--foreground)]">
                  {card.title.trim() || "Feature"}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
                  {card.body.trim() || "—"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </SectionShell>
  );
}

export function CompactFeatureCardsBlock({
  title,
  subtext,
  items,
}: {
  title: string;
  subtext?: string;
  items: { title: string; body: string }[];
}) {
  const list = items.slice(0, 4);
  while (list.length < 4) list.push({ title: "", body: "" });
  return (
    <SectionShell>
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h2 className={`${display.className} text-2xl font-semibold text-[var(--foreground)] sm:text-3xl`}>
            {title.trim() || "Section title"}
          </h2>
          {subtext?.trim() ? <p className="text-[var(--muted)]">{subtext}</p> : null}
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {list.map((it, idx) => (
            <li key={idx} className="rounded-xl border border-zinc-800 bg-zinc-950/85 px-4 py-3">
              <h3 className="text-sm font-semibold text-white">{it.title.trim() || "Card title"}</h3>
              <p className="mt-1 text-sm text-zinc-300">{it.body.trim() || "Card body"}</p>
            </li>
          ))}
        </ul>
      </div>
    </SectionShell>
  );
}

export function SplitPillColumnsBlock({
  titleLeft,
  titleRight,
  pillsLeft,
  pillsRight,
}: {
  titleLeft: string;
  titleRight: string;
  pillsLeft: string[];
  pillsRight: string[];
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--line)]">
      <div className="pointer-events-none absolute inset-0 bg-zinc-100 dark:bg-zinc-800/85" />
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-[56%] max-w-[min(56%,28rem)] bg-zinc-950"
        style={{ clipPath: "polygon(0 0, 100% 0, 88% 100%, 0 100%)" }}
      />
      <div className="relative grid gap-8 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-2 lg:gap-12">
        <div className="relative z-[1] space-y-4">
          <h2
            className={`${display.className} text-xl font-semibold tracking-[0.08em] text-white sm:text-2xl`}
          >
            {titleLeft.trim() || "Column"}
          </h2>
          <ul className="space-y-2">
            {(pillsLeft.length ? pillsLeft : [""]).map((p, i) => (
              <li key={`${p}-${i}`}>
                <span className="inline-block rounded-full border border-zinc-700 bg-zinc-900/80 px-4 py-2 text-sm text-zinc-200">
                  {p.trim() || "—"}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative z-[1] space-y-4">
          <h2
            className={`${display.className} text-xl font-semibold tracking-[0.08em] text-[var(--foreground)] sm:text-2xl`}
          >
            {titleRight.trim() || "Column"}
          </h2>
          <ul className="space-y-2">
            {(pillsRight.length ? pillsRight : [""]).map((p, i) => (
              <li key={`${p}-r-${i}`}>
                <span className="inline-block rounded-full border border-[var(--line)] bg-zinc-100/90 px-4 py-2 text-sm text-[var(--foreground)] dark:bg-zinc-800/90">
                  {p.trim() || "—"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function ContentWideBlock({
  title,
  body,
}: {
  title?: string;
  body: string;
}) {
  return (
    <section className="rounded-2xl border border-[var(--line)] bg-zinc-200/60 px-5 py-8 dark:bg-zinc-800/50 sm:px-8 sm:py-10">
      <div className="space-y-4">
        {title?.trim() ? (
          <h2
            className={`${display.className} text-xl font-semibold text-[var(--foreground)] sm:text-2xl`}
          >
            {title}
          </h2>
        ) : null}
        <p className="whitespace-pre-wrap text-[var(--muted)] leading-relaxed">
          {body.trim() || "Long-form content."}
        </p>
      </div>
    </section>
  );
}
