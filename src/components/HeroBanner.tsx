import Link from "next/link";
import { display, sans } from "@/app/fonts";
import type { CmsJson } from "@/lib/cms-types";
import { FloatingCar } from "@/components/FloatingCar";
import { HeroBackdropRotator } from "@/components/HeroBackdropRotator";
import { siteConfig } from "@/config/site";

const HERO_LEAD =
  "Professional Automotive Photo Editing & Retouching Services";
const HERO_SUPPORT =
  "for Car Selling Companies, Automotive Dealers, and Online Car Sellers";

type Props = {
  cms: CmsJson;
};

/**
 * Full-viewport bg (z-8). Copy sits upper-mid in a shorter band.
 * Floating car: separate layer + scroll shrink/fade (FloatingCar).
 */
export function HeroBanner({ cms }: Props) {
  const bandBottom = `calc(var(--announcement-h) + var(--header-h) + var(--home-hero-band))`;
  const banners = cms.heroBanners.filter((u) => u.trim().length > 0);
  const floating = cms.floatingCar.trim();

  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-[8] overflow-hidden"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[#0a0a0a]" />
        {banners.length > 0 ? <HeroBackdropRotator images={banners} /> : null}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/55 to-black/75" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_65%_at_50%_30%,transparent_0%,rgba(0,0,0,0.55)_100%)]" />
      </div>

      <div className="pointer-events-none fixed inset-x-0 top-[calc(var(--announcement-h)+var(--header-h))] z-[15] flex flex-col overflow-x-clip overflow-y-visible">
        <section
          id="home-hero-banner"
          className="pointer-events-auto relative z-0 flex h-[var(--home-hero-band)] min-h-0 w-full max-w-full flex-col overflow-x-clip overflow-y-visible"
          aria-label="Hero"
        >
          <div
            className={`relative z-10 mx-auto flex h-full min-h-0 w-full max-w-4xl flex-col justify-start overflow-x-clip px-5 pb-5 pt-4 text-center sm:px-8 sm:pb-6 sm:pt-5 md:pt-6`}
          >
            <p
              className={`${sans.className} mb-2 shrink-0 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60`}
            >
              {siteConfig.domain}
            </p>

            <h1
              className={`${display.className} shrink-0 text-balance text-xl font-semibold leading-snug tracking-tight text-white sm:text-2xl md:text-3xl md:leading-tight lg:text-[1.85rem] lg:leading-snug xl:text-[2rem]`}
            >
              <span className="block">{HERO_LEAD}</span>
              <span
                className={`${sans.className} mt-3 block text-base font-normal leading-relaxed text-white/88 sm:mt-3.5 sm:text-lg md:text-xl`}
              >
                {HERO_SUPPORT}
              </span>
            </h1>

            <div className="mt-5 flex shrink-0 flex-col items-stretch justify-center gap-3 sm:mt-6 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
              <Link
                href="/contact"
                className={`${sans.className} inline-flex min-h-10 items-center justify-center rounded-lg bg-[var(--accent)] px-6 text-sm font-semibold leading-tight text-white shadow-lg shadow-black/25 transition hover:bg-[var(--accent-hover)] sm:min-h-11 sm:px-7`}
              >
                Get Quote
              </Link>
              <Link
                href="/free-trial"
                className={`${sans.className} inline-flex min-h-10 items-center justify-center rounded-lg border border-white/30 bg-white/5 px-6 text-sm font-semibold leading-tight text-white backdrop-blur-sm transition hover:border-white/45 hover:bg-white/12 sm:min-h-11 sm:px-7`}
              >
                Free Trial
              </Link>
            </div>
          </div>
        </section>
      </div>

      {floating ? (
        <FloatingCar
          bandBottom={bandBottom}
          src={floating}
          sizes="(max-width: 768px) 80vw, 540px"
        />
      ) : null}
    </>
  );
}
