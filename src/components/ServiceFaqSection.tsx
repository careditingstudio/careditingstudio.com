"use client";

import { display } from "@/app/fonts";
import type { ServicePageFaqSection as ServiceFaqModel } from "@/lib/cms-types";

function hasFaqContent(section: ServiceFaqModel): boolean {
  const items = section.items.filter(
    (q) => q.question.trim().length > 0 && q.answer.trim().length > 0,
  );
  const head =
    section.eyebrow.trim() ||
    section.title.trim() ||
    section.subtitle.trim();
  return head.length > 0 || items.length > 0;
}

export function ServiceFaqSection({ section }: { section: ServiceFaqModel }) {
  if (!hasFaqContent(section)) return null;

  const items = section.items.filter(
    (q) => q.question.trim().length > 0 && q.answer.trim().length > 0,
  );
  const twoCols = section.columns === 2;
  const mid = Math.ceil(items.length / 2);
  const left = twoCols ? items.slice(0, mid) : items;
  const right = twoCols ? items.slice(mid) : [];

  const col = (list: typeof items) => (
    <ul className="flex flex-col gap-2.5">
      {list.map((item, i) => (
        <li key={`${item.question.slice(0, 24)}-${i}`}>
          <details className="group rounded-lg border border-zinc-200/90 bg-white shadow-sm dark:border-zinc-700/90 dark:bg-zinc-900/40">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-zinc-900 dark:text-zinc-100 [&::-webkit-details-marker]:hidden">
              <span className="min-w-0 flex-1">{item.question}</span>
              <span
                className="shrink-0 text-xs text-zinc-400 transition-transform duration-200 group-open:rotate-180"
                aria-hidden
              >
                ▼
              </span>
            </summary>
            <div className="border-t border-zinc-100 px-4 py-3 text-sm leading-relaxed text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
              {item.answer}
            </div>
          </details>
        </li>
      ))}
    </ul>
  );

  return (
    <section
      className="border-t border-[var(--line)] bg-[var(--background)] px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
      aria-labelledby="service-faq-title"
    >
      <div className="mx-auto max-w-[82rem]">
        <div className="mb-10 text-center lg:mb-12 lg:text-left">
          {section.eyebrow.trim() ? (
            <p className="text-sm font-medium uppercase tracking-wide text-[var(--accent)]">
              {section.eyebrow}
            </p>
          ) : null}
          {section.title.trim() ? (
            <h2
              id="service-faq-title"
              className={`${display.className} mt-2 text-balance text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl md:text-4xl`}
            >
              {section.title}
            </h2>
          ) : null}
          {section.subtitle.trim() ? (
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[var(--muted)] sm:text-base lg:mx-0">
              {section.subtitle}
            </p>
          ) : null}
        </div>

        {items.length === 0 ? null : twoCols ? (
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-10 lg:items-start">
            {col(left)}
            {col(right)}
          </div>
        ) : (
          col(left)
        )}
      </div>
    </section>
  );
}
