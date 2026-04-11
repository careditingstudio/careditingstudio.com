"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { display, sans } from "@/app/fonts";
import type { CmsJson } from "@/lib/cms-types";
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
 * Full-viewport bg (z-8) with scroll-reactive hero copy.
 */
export function HeroBanner({ cms }: Props) {
  const banners = cms.heroBanners.filter((u) => u.trim().length > 0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fadeProgress = Math.min(1, Math.max(0, scrollY / 320));
  const textOpacity = 1 - fadeProgress;
  const textLift = -26 * fadeProgress;
  const subOpacity = Math.max(0, 1 - fadeProgress * 1.08);
  const ctaOpacity = Math.max(0, 1 - fadeProgress * 1.15);

  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-[8] overflow-hidden"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[#0a0a0a]" />
        {banners.length > 0 ? <HeroBackdropRotator images={banners} /> : null}
        {/* Top: soft black → transparent under header; mid: darker for headline/CTA; bottom: lighter so the scene stays visible */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.26)_0%,rgba(0,0,0,0.05)_16%,rgba(0,0,0,0.44)_38%,rgba(0,0,0,0.54)_48%,rgba(0,0,0,0.40)_66%,rgba(0,0,0,0.22)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_82%_62%_at_50%_34%,transparent_0%,rgba(0,0,0,0.30)_100%)]" />
      </div>

      <div className="pointer-events-none fixed inset-x-0 top-[calc(var(--announcement-h)+var(--header-h))] z-[15] flex flex-col overflow-x-clip overflow-y-visible">
        <section
          id="home-hero-banner"
          className="pointer-events-auto relative z-0 flex h-[var(--home-hero-band)] min-h-0 w-full max-w-full flex-col overflow-x-clip overflow-y-visible"
          aria-label="Hero"
        >
          <div
            className={`relative z-10 mx-auto flex h-full min-h-0 w-full max-w-4xl flex-col justify-center overflow-x-clip px-5 pb-6 pt-6 text-center sm:px-8 sm:pb-8 sm:pt-8 md:pb-10 md:pt-10`}
          >
            <p
              className={`${sans.className} mb-3 shrink-0 text-xs font-semibold uppercase tracking-[0.22em] text-[color:color-mix(in_srgb,var(--accent)_65%,white_35%)] drop-shadow-[0_1px_6px_rgba(0,0,0,0.55)] motion-safe:transition-[opacity,transform] motion-safe:duration-300 motion-safe:ease-out motion-reduce:transition-none sm:text-[13px]`}
              style={{
                opacity: textOpacity,
                transform: `translate3d(0, ${textLift * 0.55}px, 0)`,
              }}
            >
              {siteConfig.domain}
            </p>

            <h1
              className={`${display.className} shrink-0 text-balance bg-gradient-to-b from-white to-white/88 bg-clip-text text-2xl font-semibold leading-snug tracking-tight text-transparent drop-shadow-[0_2px_14px_rgba(0,0,0,0.5)] sm:text-3xl md:text-[2.25rem] md:leading-tight lg:text-[2.45rem] lg:leading-[1.2] xl:text-[2.7rem] motion-safe:transition-[opacity,transform] motion-safe:duration-300 motion-safe:ease-out motion-reduce:transition-none`}
              style={{
                opacity: textOpacity,
                transform: `translate3d(0, ${textLift}px, 0) scale(${1 - fadeProgress * 0.04})`,
              }}
            >
              <span className="block">{HERO_LEAD}</span>
              <span
                className={`${sans.className} mt-4 block text-lg font-normal leading-relaxed text-[color:color-mix(in_srgb,var(--accent)_18%,white_82%)] drop-shadow-[0_1px_10px_rgba(0,0,0,0.45)] sm:mt-4 sm:text-xl md:text-[1.35rem]`}
                style={{
                  opacity: subOpacity,
                  transform: `translate3d(0, ${textLift * 0.55}px, 0)`,
                }}
              >
                {HERO_SUPPORT}
              </span>
            </h1>

            <div
              className="mt-7 flex shrink-0 flex-col items-stretch justify-center gap-3 bg-transparent motion-safe:transition-[opacity,transform] motion-safe:duration-300 motion-safe:ease-out motion-reduce:transition-none sm:mt-8 sm:flex-row sm:items-center sm:justify-center sm:gap-4"
              style={{
                opacity: ctaOpacity,
                transform: `translate3d(0, ${textLift * 0.8}px, 0)`,
              }}
            >
              <Link
                href="/contact"
                className={`${sans.className} inline-flex min-h-12 items-center justify-center rounded-xl bg-[var(--accent)] px-8 text-base font-semibold leading-tight text-white shadow-lg shadow-black/30 ring-1 ring-white/15 transition hover:bg-[var(--accent-hover)] hover:shadow-xl hover:shadow-black/35 sm:min-h-12 sm:px-9`}
              >
                Contact Us
              </Link>
              <Link
                href="/free-trial"
                className={`${sans.className} inline-flex min-h-12 items-center justify-center rounded-xl border border-white/35 bg-white/10 px-8 text-base font-semibold leading-tight text-white ring-1 ring-white/12 transition hover:border-white/50 hover:bg-white/14 sm:min-h-12 sm:px-9`}
              >
                Free Trial
              </Link>
            </div>
          </div>
        </section>
      </div>

    </>
  );
}
