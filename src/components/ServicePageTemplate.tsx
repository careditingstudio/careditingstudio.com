import { display } from "@/app/fonts";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { ServiceFaqSection } from "@/components/ServiceFaqSection";
import { ServiceFeatureIcon } from "@/lib/service-feature-icons";
import { isUploadedAsset } from "@/lib/cms-types";
import type {
  PortfolioGridItem,
  ServiceFeatureCard,
  ServicePageBlock,
  ServicePageContent,
  ServiceValueColumn,
} from "@/lib/cms-types";
import Image from "next/image";
import type { CSSProperties } from "react";

type Props = {
  page: ServicePageContent;
  portfolioItems: PortfolioGridItem[];
};

/** Icons for legacy iconGrid / compactFeatureCards (title-only items). */
const QUAD_ICON_CYCLE = ["shield", "headphones", "sparkles", "award"] as const;

function CheckBadge() {
  return (
    <span
      aria-hidden
      className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-[var(--accent)]"
    >
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 12.5l3.5 3.5L18 8" />
      </svg>
    </span>
  );
}

function FeatureCardsSection({
  title,
  subtext,
  cards,
  accentColor,
}: {
  title: string;
  subtext?: string;
  cards: ServiceFeatureCard[];
  accentColor?: string;
}) {
  const heading = title.trim();
  const subtitle = (subtext ?? "").trim();
  const visible = cards.filter((c) => c.title.trim() || c.body.trim());
  if (visible.length === 0 && !heading && !subtitle) return null;

  const customAccent =
    typeof accentColor === "string" &&
    /^#[0-9a-fA-F]{6}$/.test(accentColor.trim())
      ? accentColor.trim().toLowerCase()
      : null;
  const accentWrapStyle = customAccent
    ? ({ ["--fea-accent" as string]: customAccent } as CSSProperties)
    : undefined;

  return (
    <section className="bg-[#0a0a0a]">
      <div
        className="mx-auto max-w-[88rem] px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24"
        style={accentWrapStyle}
      >
        {heading || subtitle ? (
          <div className="mx-auto max-w-2xl space-y-3 text-center">
            {heading && (
              <h2
                className={`${display.className} text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-[2.1rem] md:leading-tight`}
              >
                {heading}
              </h2>
            )}
            {subtitle && (
              <p className="text-sm leading-relaxed text-zinc-400 sm:text-base">{subtitle}</p>
            )}
          </div>
        ) : null}

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {visible.map((card, idx) => (
            <li key={idx}>
              <article
                className={[
                  "group h-full rounded-2xl border border-white/10 bg-[#161618] p-7 transition-colors duration-300 sm:p-8",
                  customAccent
                    ? "hover:border-[color:color-mix(in_srgb,var(--fea-accent)_40%,transparent)]"
                    : "hover:border-[var(--accent)]/40",
                ].join(" ")}
              >
                <div
                  className={[
                    "grid h-14 w-14 place-items-center rounded-2xl border transition-colors duration-300",
                    customAccent
                      ? "border-[color:color-mix(in_srgb,var(--fea-accent)_30%,transparent)] bg-[color:color-mix(in_srgb,var(--fea-accent)_12%,transparent)] text-[color:var(--fea-accent)] group-hover:bg-[color:color-mix(in_srgb,var(--fea-accent)_18%,transparent)]"
                      : "border-[var(--accent)]/30 bg-[var(--accent)]/12 text-[var(--accent)] group-hover:bg-[var(--accent)]/18",
                  ].join(" ")}
                >
                  <ServiceFeatureIcon
                    iconKey={card.iconKey}
                    className="h-7 w-7"
                  />
                </div>
                <h3
                  className={`${display.className} mt-6 text-lg font-semibold tracking-tight text-white sm:text-xl`}
                >
                  {card.title}
                </h3>
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-zinc-400">
                  {card.body}
                </p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function PortfolioSection({
  portfolioTitle,
  sideTitle,
  sideText,
  item,
}: {
  portfolioTitle?: string;
  sideTitle?: string;
  sideText?: string;
  item?: PortfolioGridItem;
}) {
  if (!item && !sideTitle?.trim() && !sideText?.trim() && !portfolioTitle?.trim()) return null;
  const heading = sideTitle?.trim() || portfolioTitle?.trim();
  const body = sideText?.trim();

  return (
    <section className="border-t border-white/5 bg-[#111113]">
      <div className="mx-auto max-w-[88rem] px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-12 lg:gap-16">
          <div className="order-2 md:order-1">
            <div className="relative mx-auto aspect-square w-full max-w-[440px] overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-[0_30px_60px_-32px_rgba(0,0,0,0.7)] md:mx-0">
              {item ? (
                <BeforeAfterSlider
                  layout="portfolio"
                  beforeSrc={item.before}
                  afterSrc={item.after}
                  beforeAlt={item.beforeAlt}
                  afterAlt={item.afterAlt}
                  priority
                  className="h-full w-full ring-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:ring-0"
                />
              ) : (
                <div className="grid h-full w-full place-items-center px-6 text-center">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                      Portfolio
                    </p>
                    <p className="max-w-[16rem] text-xs text-zinc-500">
                      Feature a portfolio item from the admin (Portfolio →
                      Selected indices).
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="order-1 space-y-5 md:order-2">
            <h2
              className={`${display.className} text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-[2.1rem] md:leading-tight`}
            >
              {heading}
            </h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-400 sm:text-base md:text-[1.0125rem] md:leading-[1.75]">
              {body}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function BulletsSection({
  title,
  subtitle,
  bullets,
}: {
  title: string;
  subtitle?: string;
  bullets: string[];
}) {
  const items = bullets.map((b) => b.trim()).filter(Boolean);
  if (items.length === 0 && !title.trim() && !subtitle?.trim()) return null;
  const heading = title.trim();
  const sub = (subtitle ?? "").trim();

  return (
    <section className="border-t border-white/5 bg-[#111113]">
      <div className="mx-auto max-w-[88rem] px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-2xl space-y-3 text-center">
          <h2
            className={`${display.className} text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-[2.1rem] md:leading-tight`}
          >
            {heading}
          </h2>
          <p className="text-sm leading-relaxed text-zinc-400 sm:text-base">
            {sub}
          </p>
        </div>

        <ul className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-2">
          {items.map((t) => (
            <li
              key={t}
              className="rounded-2xl border border-white/10 bg-[#161618] px-4 py-3 transition-colors duration-300 hover:border-[var(--accent)]/30"
            >
              <div className="flex items-center gap-3">
                <CheckBadge />
                <p className="text-sm font-semibold text-white sm:text-[0.95rem]">
                  {t}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function SupportSection({
  eyebrow,
  title,
  body,
  cards,
}: {
  eyebrow?: string;
  title: string;
  body: string;
  cards: ServiceValueColumn[];
}) {
  const heading = title.trim();
  const description = body.trim();
  const visible = cards.filter(c => c.title.trim() || c.body.trim());
  if (visible.length === 0 && !heading && !description) return null;

  return (
    <section className="border-t border-white/5 bg-[#0a0a0a]">
      <div className="mx-auto max-w-[88rem] px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
          <div className="space-y-5 lg:col-span-5">
            {eyebrow?.trim() && (
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
                {eyebrow.trim()}
              </p>
            )}
            {heading && (
              <h2
                className={`${display.className} text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-[2.1rem] md:leading-tight`}
              >
                {heading}
              </h2>
            )}
            {description && (
              <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-400 sm:text-base md:text-[1.0125rem] md:leading-[1.75]">
                {description}
              </p>
            )}
          </div>

          <div className="lg:col-span-7">
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((card, idx) => (
                <li key={idx}>
                  <article className="group h-full rounded-2xl border border-white/10 bg-[#161618] p-5 transition-colors duration-300 hover:border-[var(--accent)]/40">
                    <span className="text-[11px] font-semibold tracking-[0.2em] text-zinc-500">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <h3
                      className={`${display.className} mt-3 text-base font-semibold tracking-tight text-white`}
                    >
                      {card.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                      {card.body}
                    </p>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/** 2×2 — icon left, title + description right (home “Why choose” pillar style). */
function WhyChooseQuadSection({
  sectionTitle,
  sectionSubtext,
  cards,
}: {
  sectionTitle: string;
  sectionSubtext?: string;
  cards: ServiceFeatureCard[];
}) {
  const heading = sectionTitle.trim();
  const sub = (sectionSubtext ?? "").trim();
  const row = cards.filter(c => c.title.trim() || c.body.trim());
  if (row.length === 0 && !heading) return null;

  return (
    <section className="relative overflow-hidden border-t border-white/5 bg-[#0a0a0a]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(900px_460px_at_15%_15%,rgba(224,122,69,0.10)_0%,transparent_60%),radial-gradient(700px_360px_at_85%_85%,rgba(255,255,255,0.04)_0%,transparent_55%)]"
      />
      <div className="relative mx-auto max-w-[88rem] px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        {heading || sub ? (
          <div className="mx-auto max-w-2xl space-y-3 text-center">
            {heading && (
              <h2
                className={`${display.className} text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-[2.1rem] md:leading-tight`}
              >
                {heading}
              </h2>
            )}
            {sub && (
              <p className="text-sm leading-relaxed text-zinc-400 sm:text-base">{sub}</p>
            )}
          </div>
        ) : null}

        <ul className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 sm:gap-5">
          {row.map((card, idx) => (
            <li key={`${card.title}-${idx}`}>
              <article className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition duration-300 hover:border-white/20 hover:bg-white/[0.06] sm:p-7">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.05] to-transparent"
                />
                <div className="relative flex items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/[0.08] text-zinc-100 ring-1 ring-white/15">
                    <ServiceFeatureIcon
                      iconKey={card.iconKey}
                      className="h-5 w-5"
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3
                      className={`${display.className} text-base font-semibold tracking-tight text-white sm:text-[1.0625rem]`}
                    >
                      {card.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                      {card.body}
                    </p>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ServiceArticleSection({
  leadTitle,
  leadBody,
  sections,
}: {
  leadTitle: string;
  leadBody: string;
  sections: { title: string; body: string }[];
}) {
  const lead = leadTitle.trim();
  const intro = leadBody.trim();
  const filtered = sections.filter((s) => s.title.trim() || s.body.trim());
  if (!lead && !intro && filtered.length === 0) return null;

  return (
    <section className="relative border-t border-white/5 bg-[#0e0e10]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />
      <div className="mx-auto max-w-[88rem] px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        <article className="mx-auto max-w-3xl">
          <span
            aria-hidden
            className="block h-[3px] w-12 rounded-full bg-[var(--accent)]"
          />
          {lead && (
            <h2
              className={`${display.className} mt-5 text-balance text-3xl font-semibold tracking-tight text-white sm:text-[2.5rem] sm:leading-[1.1] md:text-[2.875rem]`}
            >
              {lead}
            </h2>
          )}
          {intro && (
            <p className="mt-6 whitespace-pre-line text-[0.975rem] leading-[1.8] text-zinc-300 sm:text-[1.0625rem] sm:leading-[1.85]">
              {intro}
            </p>
          )}

          {filtered.length > 0 ? (
            <div className="mt-12 space-y-12 sm:mt-16 sm:space-y-14">
              {filtered.map((sec, i) => (
                <section
                  key={`${sec.title}-${i}`}
                  className="relative pl-5 sm:pl-6"
                >
                  <span
                    aria-hidden
                    className="absolute left-0 top-2 h-[calc(100%-0.75rem)] w-[2px] rounded-full bg-gradient-to-b from-white/30 via-white/10 to-transparent"
                  />
                  <h3
                    className={`${display.className} text-[1.375rem] font-semibold tracking-tight text-white sm:text-[1.625rem] md:text-[1.75rem]`}
                  >
                    {sec.title.trim() || `Section ${i + 1}`}
                  </h3>
                  <p className="mt-4 whitespace-pre-line text-[0.95rem] leading-[1.8] text-zinc-300 sm:text-base sm:leading-[1.85]">
                    {sec.body.trim() ||
                      "Add body copy for this subsection in the admin."}
                  </p>
                </section>
              ))}
            </div>
          ) : null}
        </article>
      </div>
    </section>
  );
}

function MediaSpotlightSection({
  title,
  body,
  imageSrc,
  imageAlt,
}: {
  title: string;
  body: string;
  imageSrc: string;
  imageAlt: string;
}) {
  const src = imageSrc.trim();
  if (!src && !title.trim() && !body.trim()) return null;
  const heading = title.trim();
  const text = body.trim();

  return (
    <section className="relative border-t border-white/5 bg-[#0a0a0a]">
      <div className="mx-auto max-w-[88rem] px-5 py-16 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-5xl">
          {heading && (
            <div className="mx-auto max-w-3xl text-center">
              <h2
                className={`${display.className} text-balance text-3xl font-semibold tracking-tight text-white sm:text-[2.25rem] md:text-[2.5rem] md:leading-[1.1]`}
              >
                {heading}
              </h2>
            </div>
          )}

          <figure className="mt-10 sm:mt-12">
            <div className="group relative mx-auto aspect-[16/9] w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-[#161618] shadow-[0_40px_80px_-36px_rgba(0,0,0,0.85)] ring-1 ring-white/5">
              {src ? (
                <>
                  <Image
                    src={src}
                    alt={imageAlt.trim() || heading}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 100vw, 1024px"
                    unoptimized={isUploadedAsset(src)}
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
                  />
                </>
              ) : null}
            </div>

            {text && (
              <figcaption className="mx-auto mt-10 max-w-3xl">
                <p className="whitespace-pre-line text-center text-[0.975rem] leading-[1.8] text-zinc-400 sm:text-base sm:leading-[1.85]">
                  {text}
                </p>
              </figcaption>
            )}
          </figure>
        </div>
      </div>
    </section>
  );
}

function PageOutroSection({ title, body }: { title: string; body: string }) {
  const h = title.trim();
  const t = body.trim();
  if (!h && !t) return null;

  return (
    <section className="relative overflow-hidden border-t border-white/5 bg-[#0a0a0a]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background-image:radial-gradient(800px_400px_at_50%_0%,rgba(224,122,69,0.10)_0%,transparent_60%)]"
      />
      <div className="relative mx-auto max-w-[88rem] px-5 py-16 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-3xl">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] px-6 py-12 text-center backdrop-blur-sm sm:px-12 sm:py-16">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.05] to-transparent"
            />
            <div className="relative">
              <span
                aria-hidden
                className="mx-auto block h-[3px] w-12 rounded-full bg-[var(--accent)]"
              />
              {h && (
                <h2
                  className={`${display.className} mx-auto mt-5 max-w-2xl text-balance text-3xl font-semibold tracking-tight text-white sm:text-[2.25rem] md:text-[2.5rem] md:leading-[1.15]`}
                >
                  {h}
                </h2>
              )}
              {t && (
                <p className="mx-auto mt-5 max-w-2xl whitespace-pre-line text-[0.975rem] leading-[1.8] text-zinc-300 sm:text-[1.0625rem] sm:leading-[1.85]">
                  {t}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SplitPillColumnsSection({
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
  const left = pillsLeft.map(p => p.trim()).filter(Boolean);
  const right = pillsRight.map(p => p.trim()).filter(Boolean);
  const lTitle = titleLeft.trim();
  const rTitle = titleRight.trim();
  if (left.length === 0 && right.length === 0 && !lTitle && !rTitle) return null;

  const renderRow = (
    label: string,
    key: string,
    extraClass = "",
  ) => (
    <li key={key}>
      <div
        className={`group/row flex items-center gap-3.5 rounded-2xl border border-white/[0.08] px-4 py-3 transition duration-300 hover:translate-x-0.5 hover:border-white/25 sm:px-5 sm:py-3.5 ${extraClass}`}
      >
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--accent)]/15 text-[var(--accent)] ring-1 ring-[var(--accent)]/35 transition-colors group-hover/row:bg-[var(--accent)]/25">
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="m5 12 5 5 9-12" />
          </svg>
        </span>
        <span className="text-[0.95rem] font-medium leading-snug text-zinc-100 sm:text-base">
          {label}
        </span>
      </div>
    </li>
  );

  return (
    <section className="border-t border-white/5 bg-[#0a0a0a]">
      <div className="mx-auto max-w-[88rem] px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-[#1a1a1c] shadow-[0_30px_80px_-40px_rgba(0,0,0,0.85)]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 hidden w-[56%] max-w-[36rem] bg-[#060608] lg:block"
            style={{ clipPath: "polygon(0 0, 100% 0, 86% 100%, 0 100%)" }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[55%] bg-[#060608] lg:hidden"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 86%, 0 100%)" }}
          />

          <div className="relative grid gap-10 p-7 sm:p-10 lg:grid-cols-2 lg:gap-16 lg:p-14">
            <div className="relative z-[1]">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="block h-[3px] w-8 shrink-0 rounded-full bg-[var(--accent)]"
                />
                <h2
                  className={`${display.className} text-balance text-xl font-semibold tracking-tight text-white sm:text-[1.5rem] md:text-[1.75rem]`}
                >
                  {lTitle}
                </h2>
              </div>
              <ul className="mt-7 space-y-2.5">
                {left.map((p, i) =>
                  renderRow(
                    p.trim() || "—",
                    `spc-l-${i}`,
                    "bg-white/[0.05] hover:bg-white/[0.09]",
                  ),
                )}
              </ul>
            </div>

            <div className="relative z-[1]">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="block h-[3px] w-8 shrink-0 rounded-full bg-[var(--accent)]"
                />
                <h2
                  className={`${display.className} text-balance text-xl font-semibold tracking-tight text-white sm:text-[1.5rem] md:text-[1.75rem]`}
                >
                  {rTitle}
                </h2>
              </div>
              <ul className="mt-7 space-y-2.5">
                {right.map((p, i) =>
                  renderRow(
                    p.trim() || "—",
                    `spc-r-${i}`,
                    "bg-white/[0.03] hover:bg-white/[0.07]",
                  ),
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function findBlock<T extends ServicePageBlock["type"]>(
  blocks: ServicePageBlock[],
  type: T,
): Extract<ServicePageBlock, { type: T }> | undefined {
  return blocks.find(
    (b): b is Extract<ServicePageBlock, { type: T }> => b.type === type,
  );
}

function findFirst<T extends ServicePageBlock["type"]>(
  blocks: ServicePageBlock[],
  types: readonly T[],
): Extract<ServicePageBlock, { type: T }> | undefined {
  for (const t of types) {
    const m = findBlock(blocks, t);
    if (m) return m;
  }
  return undefined;
}

/**
 * Every service page renders the same fixed template in a fixed order.
 * Each section pulls content from any matching CMS block and falls back
 * to sensible defaults when the block is missing or empty.
 */
export function ServicePageTemplate({ page, portfolioItems }: Props) {
  const blocks = (page.blocks ?? []).filter(b => !b.hidden);

  // 1. Three feature cards (icon + title + body)
  const featureBlock = findBlock(blocks, "featureCards");

  // 2. Portfolio + side title/text
  const portfolioBlock = findBlock(blocks, "portfolio");

  // 3. Bullets section (about-page style)
  const bulletsBlock = findFirst(blocks, [
    "tickChecklist",
    "pillChecklist",
  ] as const);
  let bulletsTitle = "";
  let bulletsSubtitle: string | undefined;
  let bulletsList: string[] = [];
  if (bulletsBlock) {
    bulletsTitle = bulletsBlock.title;
    bulletsSubtitle = bulletsBlock.subtext;
    if (bulletsBlock.type === "tickChecklist") {
      bulletsList = bulletsBlock.items;
    } else {
      bulletsList =
        bulletsBlock.checks.length > 0 ? bulletsBlock.checks : bulletsBlock.pills;
    }
  }

  // 4. Support: left (eyebrow + title + body) and 3 right-side cards
  const supportBlock = findFirst(blocks, [
    "supportCards",
    "valueColumns",
  ] as const);
  const supportEyebrow = supportBlock?.eyebrow;
  const supportTitle = supportBlock?.title ?? "";
  const supportBody = supportBlock?.body ?? "";
  const supportCards: ServiceValueColumn[] =
    supportBlock?.type === "supportCards"
      ? supportBlock.cards
      : supportBlock?.type === "valueColumns"
        ? supportBlock.columns
        : [];

  // 5. 2x2 “4 points” grid (icon + title + body)
  const quadBlock = findBlock(blocks, "whyChooseQuad");
  const quadFromIcons = findFirst(blocks, [
    "iconGrid",
    "compactFeatureCards",
  ] as const);
  let quadTitle = "";
  let quadSubtext: string | undefined;
  let quadCards: ServiceFeatureCard[] = [];
  if (quadBlock) {
    quadTitle = quadBlock.sectionTitle;
    quadSubtext = quadBlock.sectionSubtext;
    quadCards = quadBlock.cards;
  } else if (quadFromIcons) {
    quadTitle = quadFromIcons.title;
    quadSubtext = quadFromIcons.subtext;
    quadCards = quadFromIcons.items.map((it, i) => ({
      iconKey: QUAD_ICON_CYCLE[i % 4]!,
      title: it.title,
      body: it.body,
    }));
  }

  // 6. Big article: lead title + lead body, then any number of H2 sections.
  //    Falls back to legacy contentWide blocks when serviceArticle isn’t set.
  const articleBlock = findBlock(blocks, "serviceArticle");
  let articleLeadTitle = "";
  let articleLeadBody = "";
  let articleSections: { title: string; body: string }[] = [];
  if (articleBlock) {
    articleLeadTitle = articleBlock.leadTitle;
    articleLeadBody = articleBlock.leadBody;
    articleSections = articleBlock.sections;
  } else {
    const wides = blocks.filter(
      (b): b is Extract<ServicePageBlock, { type: "contentWide" }> =>
        b.type === "contentWide",
    );
    if (wides.length > 0) {
      const [head, ...rest] = wides;
      articleLeadTitle = head!.title ?? "";
      articleLeadBody = head!.body;
      articleSections = rest.map((w) => ({
        title: w.title ?? "",
        body: w.body,
      }));
    }
  }

  // 7. Split pill columns
  const splitPillsBlock = findBlock(blocks, "splitPillColumns");

  // 8. Media spotlight (headline + image + description)
  const spotlightBlock = findBlock(blocks, "mediaSpotlight");
  const fallbackImage = findBlock(blocks, "image");
  const fallbackSplit = findBlock(blocks, "splitShowcase");
  const spotlightTitle =
    spotlightBlock?.title ?? fallbackSplit?.title ?? "";
  const spotlightBody = spotlightBlock?.body ?? fallbackSplit?.body ?? "";
  const spotlightSrc =
    spotlightBlock?.imageSrc ??
    fallbackImage?.src ??
    fallbackSplit?.imageSrc ??
    "";
  const spotlightAlt =
    spotlightBlock?.imageAlt ??
    fallbackImage?.alt ??
    fallbackSplit?.imageAlt ??
    "";

  // 9. Page outro
  const outroBlock = findBlock(blocks, "pageOutro");
  const outroTitle = outroBlock?.title ?? "";
  const outroBody = outroBlock?.body ?? "";

  return (
    <>
      {featureBlock && (
        <FeatureCardsSection
          title={featureBlock.sectionTitle}
          subtext={featureBlock.sectionSubtext}
          cards={featureBlock.cards}
          accentColor={featureBlock.accentColor}
        />
      )}

      {portfolioBlock && (
        <PortfolioSection
          portfolioTitle={portfolioBlock.title ?? page.portfolioTitle}
          sideTitle={portfolioBlock.sideTitle}
          sideText={portfolioBlock.sideText}
          item={portfolioItems[0]}
        />
      )}

      {bulletsBlock && (
        <BulletsSection
          title={bulletsTitle}
          subtitle={bulletsSubtitle}
          bullets={bulletsList}
        />
      )}

      {supportBlock && (
        <SupportSection
          eyebrow={supportEyebrow}
          title={supportTitle}
          body={supportBody}
          cards={supportCards}
        />
      )}

      {(quadBlock || quadFromIcons) && (
        <WhyChooseQuadSection
          sectionTitle={quadTitle}
          sectionSubtext={quadSubtext}
          cards={quadCards}
        />
      )}

      {(articleBlock || articleLeadTitle || articleLeadBody || articleSections.length > 0) && (
        <ServiceArticleSection
          leadTitle={articleLeadTitle}
          leadBody={articleLeadBody}
          sections={articleSections}
        />
      )}

      {splitPillsBlock && (
        <SplitPillColumnsSection
          titleLeft={splitPillsBlock.titleLeft}
          titleRight={splitPillsBlock.titleRight}
          pillsLeft={splitPillsBlock.pillsLeft}
          pillsRight={splitPillsBlock.pillsRight}
        />
      )}

      {(spotlightBlock || spotlightSrc) && (
        <MediaSpotlightSection
          title={spotlightTitle}
          body={spotlightBody}
          imageSrc={spotlightSrc}
          imageAlt={spotlightAlt}
        />
      )}

      {outroBlock && (
        <PageOutroSection title={outroTitle} body={outroBody} />
      )}

      {findBlock(blocks, "faq") && (
        <ServiceFaqSection section={page.faqSection} />
      )}
    </>
  );
}
