"use client";

import Link from "next/link";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import type { CmsJson, PortfolioGridItem } from "@/lib/cms-types";

function isComplete(item: PortfolioGridItem) {
  return item.before.trim().length > 0 && item.after.trim().length > 0;
}

function resolveShowcaseItems(
  grid: PortfolioGridItem[],
  order: number[],
): PortfolioGridItem[] {
  const completeIndices = grid
    .map((item, i) => ({ item, i }))
    .filter(({ item }) => isComplete(item));

  const seen = new Set<number>();
  const featured: PortfolioGridItem[] = [];
  for (const idx of order) {
    if (idx < 0 || idx >= grid.length || seen.has(idx)) continue;
    const item = grid[idx];
    if (!item || !isComplete(item)) continue;
    seen.add(idx);
    featured.push(item);
  }
  if (featured.length > 0) return featured;

  return completeIndices.slice(0, 12).map(({ item }) => item);
}

type Props = {
  cms: CmsJson;
  /** When true, sits inside the Why choose / reviews band (no outer section chrome). */
  embedded?: boolean;
};

export function HomePortfolioShowcase({ cms, embedded = false }: Props) {
  const items = resolveShowcaseItems(
    cms.portfolioGrid,
    cms.homeFeaturedPortfolioOrder ?? [],
  );
  if (items.length === 0) return null;

  const strip = cms.homeWhyChooseUs;
  const heading =
    strip.portfolioStripTitle.trim() || "Our Creative Portfolio";
  const seeMoreLabel =
    strip.portfolioStripCtaLabel.trim() || "See more";

  const inner = (
    <>
      <header className="mx-auto max-w-2xl text-center">
        <h2
          id="home-portfolio-heading"
          className="font-serif text-balance text-[1.35rem] font-normal leading-snug tracking-tight text-white sm:text-2xl md:text-[1.65rem]"
        >
          {heading}
        </h2>
      </header>

      <div className="relative mt-7 md:mt-8">
        <div
          className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-visible scroll-smooth px-4 pb-1 pt-0.5 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.25)_transparent] sm:-mx-6 sm:gap-4 sm:px-6 md:gap-5"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {items.map((item, i) => (
            <article
              key={`${item.before}-${item.after}-${i}`}
              className="home-portfolio-card group w-[min(52vw,240px)] shrink-0 snap-center sm:w-[min(38vw,260px)] md:w-[min(32vw,280px)]"
              style={{ animationDelay: `${80 + i * 70}ms` }}
            >
              <div
                className="overflow-hidden rounded-xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.65)] transition-[transform,box-shadow] duration-300 ease-out will-change-transform group-hover:z-10 group-hover:scale-[1.03] group-hover:shadow-[0_20px_50px_-16px_rgba(0,0,0,0.75)]"
                style={{ transformOrigin: "center bottom" }}
              >
                <BeforeAfterSlider
                  layout="portfolio"
                  beforeSrc={item.before}
                  afterSrc={item.after}
                  beforeAlt={item.beforeAlt}
                  afterAlt={item.afterAlt}
                  priority={i < 3}
                  className="ring-0 shadow-none dark:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          href="/portfolio"
          className="home-portfolio-see-more group inline-flex items-center gap-1.5 font-serif text-base font-medium text-white underline decoration-[#e85a4f] decoration-2 underline-offset-[0.35em] transition hover:text-[#e85a4f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e85a4f]"
        >
          <span>{seeMoreLabel}</span>
          <span
            aria-hidden
            className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </div>
    </>
  );

  if (embedded) {
    return (
      <div
        className="px-4 pb-2 pt-10 sm:px-6 sm:pt-12 lg:px-8"
        aria-labelledby="home-portfolio-heading"
      >
        <div className="mx-auto max-w-[82rem]">{inner}</div>
      </div>
    );
  }

  return (
    <section
      className="relative z-20 overflow-hidden bg-[#1e1e1e]"
      aria-labelledby="home-portfolio-heading"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_50%_0%,#fff_0%,transparent_55%)]" />
      <div className="relative mx-auto max-w-[82rem] px-4 py-9 sm:px-6 sm:py-10 lg:px-8">
        {inner}
      </div>
    </section>
  );
}
