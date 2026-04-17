import Link from "next/link";
import {
  BeforeAfterSlider,
  BeforeAfterSliderHeader,
} from "@/components/BeforeAfterSlider";
import { display, sans } from "@/app/fonts";
import type { BeforeAfterPair, CmsJson } from "@/lib/cms-types";

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2.5 text-sm text-[var(--muted)] sm:text-[0.9375rem]">
      <span
        className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent-subtle)] text-[var(--accent)]"
        aria-hidden
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>
      <span className={`${sans.className} leading-relaxed`}>{children}</span>
    </li>
  );
}

function CtaLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
}) {
  const h = href.trim() || "/";
  if (h.startsWith("http://") || h.startsWith("https://")) {
    return (
      <a href={h} className={className} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={h} className={className}>
      {children}
    </Link>
  );
}

type Props = {
  cms: CmsJson;
};

function BeforeAfterCopyColumn({
  pair,
  pairIndex,
}: {
  pair: BeforeAfterPair;
  pairIndex: number;
}) {
  const title = pair.title.trim();
  const price = pair.priceNote.trim();
  const intro = pair.intro.trim();
  const listHeading = pair.listTitle.trim();
  const listItems = pair.includes
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const primaryOk =
    pair.primaryCtaLabel.trim() && pair.primaryCtaHref.trim();
  const secondaryOk =
    pair.secondaryCtaLabel.trim() && pair.secondaryCtaHref.trim();
  const soloOk = pair.soloCtaLabel.trim() && pair.soloCtaHref.trim();

  return (
    <>
      <div className="space-y-4">
        {title ? (
          <h3
            className={`${display.className} text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl`}
          >
            {title}
          </h3>
        ) : null}
        {price ? (
          <p
            className={`${sans.className} text-sm font-medium text-[var(--foreground)] sm:text-[0.9375rem]`}
          >
            {price}
          </p>
        ) : null}
        {intro ? (
          <p
            className={`${sans.className} text-base leading-relaxed text-[var(--muted)]`}
          >
            {intro}
          </p>
        ) : null}
      </div>

      {listHeading || listItems.length > 0 ? (
        <div className="mt-8">
          {listHeading ? (
            <p
              className={`${sans.className} text-sm font-semibold text-[var(--foreground)]`}
            >
              {listHeading}
            </p>
          ) : null}
          {listItems.length > 0 ? (
            <ul
              className={`grid list-none gap-3 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-3 ${listHeading ? "mt-4" : ""}`}
            >
              {listItems.map((item, j) => (
                <CheckItem key={`${pairIndex}-inc-${j}`}>{item}</CheckItem>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      {pair.showDualCtas ? (
        primaryOk || secondaryOk ? (
          <div className="mt-8 flex flex-wrap gap-3">
            {primaryOk ? (
              <CtaLink
                href={pair.primaryCtaHref}
                className={`${sans.className} inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-[var(--accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]`}
              >
                {pair.primaryCtaLabel.trim()}
              </CtaLink>
            ) : null}
            {secondaryOk ? (
              <CtaLink
                href={pair.secondaryCtaHref}
                className={`${sans.className} inline-flex items-center justify-center rounded-full border border-[var(--line-strong)] bg-[var(--background)] px-5 py-2.5 text-sm font-semibold text-[var(--foreground)] transition duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]`}
              >
                {pair.secondaryCtaLabel.trim()}
              </CtaLink>
            ) : null}
          </div>
        ) : null
      ) : soloOk ? (
        <div className="mt-8">
          <CtaLink
            href={pair.soloCtaHref}
            className={`${sans.className} inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] transition hover:text-[var(--accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]`}
          >
            {pair.soloCtaLabel.trim()}
            <span aria-hidden>→</span>
          </CtaLink>
        </div>
      ) : null}
    </>
  );
}

export function HomeBeforeAfterShowcase({ cms }: Props) {
  const rows = cms.beforeAfter
    .map((pair, i) => {
      const before = pair.before.trim();
      const after = pair.after.trim();
      if (!before || !after) return null;
      return { pairIndex: i, pair };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);

  if (rows.length === 0) {
    return null;
  }

  const eyebrow = cms.homeServiceFeatures.beforeAfterSectionEyebrow.trim();
  const sectionTitle = cms.homeServiceFeatures.beforeAfterSectionTitle.trim();
  const showSectionHead = Boolean(eyebrow || sectionTitle);

  return (
    <section
      className="relative z-20 border-t border-[var(--line)] bg-[var(--background)] px-4 py-[clamp(3.5rem,8vw,5.5rem)] sm:px-6 sm:py-[clamp(4rem,9vw,6rem)] lg:px-8"
      aria-label="Before and after photo examples"
    >
      <div className="mx-auto max-w-[82rem]">
        {showSectionHead ? (
          <div className="mx-auto mb-[clamp(2.5rem,6vw,3.75rem)] max-w-3xl text-center">
            {eyebrow ? (
              <p
                className={`${sans.className} text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--accent)]`}
              >
                {eyebrow}
              </p>
            ) : null}
            {sectionTitle ? (
              <h2
                className={`${display.className} mt-3 text-balance text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl md:text-[2.05rem] md:leading-tight`}
              >
                {sectionTitle}
              </h2>
            ) : null}
          </div>
        ) : (
          <BeforeAfterSliderHeader />
        )}

        <div className="flex flex-col gap-16 lg:gap-20">
          {rows.map(({ pairIndex, pair }, i) => {
            const imageFirst = pair.imageFirst;
            return (
            <div
              key={`before-after-${pairIndex}`}
              className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14"
            >
              <div
                className={
                  imageFirst ? "lg:col-start-2 lg:row-start-1" : "lg:row-start-1"
                }
              >
                <BeforeAfterCopyColumn pair={pair} pairIndex={pairIndex} />
              </div>

              <div
                className={
                  imageFirst ? "lg:col-start-1 lg:row-start-1" : "lg:col-start-2 lg:row-start-1"
                }
              >
                <BeforeAfterSlider
                  beforeSrc={pair.before.trim()}
                  afterSrc={pair.after.trim()}
                  beforeAlt={pair.beforeAlt}
                  afterAlt={pair.afterAlt}
                  priority={i === 0}
                />
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
