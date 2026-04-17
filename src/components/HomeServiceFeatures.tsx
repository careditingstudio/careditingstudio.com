import Link from "next/link";
import { display, sans } from "@/app/fonts";
import type { HomeServiceFeaturesBlock } from "@/lib/cms-types";
import { ServiceFeatureIcon } from "@/lib/service-feature-icons";

type Props = {
  block: HomeServiceFeaturesBlock;
};

export function HomeServiceFeatures({ block }: Props) {
  const items = block.items.filter((c) => c.title.trim() || c.body.trim());
  const sectionTitle = block.sectionTitle.trim();
  const headingText = sectionTitle || "Our Services Features";
  /** Same copy as before; show under the heading whenever the optional “intro” slot above isn’t used (not tied to section title). */
  const showDefaultBlurb = !block.intro.trim();

  return (
    <section
      className="relative z-20 bg-zinc-100 px-4 pb-16 pt-10 dark:bg-zinc-900 sm:px-6 sm:pb-20 sm:pt-12 lg:px-8"
      aria-labelledby="home-service-features-heading"
    >
      <div className="mx-auto max-w-[82rem]">
        {block.intro.trim() ? (
          <p
            className={`${sans.className} mx-auto mb-6 max-w-3xl text-center text-sm leading-relaxed text-[var(--muted)] sm:text-[0.9375rem]`}
          >
            {block.intro.trim()}
          </p>
        ) : null}

        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="home-service-features-heading"
            className={`${display.className} text-balance text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl md:text-[1.65rem] md:leading-tight`}
          >
            {headingText}
          </h2>
          {showDefaultBlurb ? (
            <p
              className={`${sans.className} mt-3 text-sm font-normal leading-relaxed text-zinc-600 dark:text-zinc-400 sm:mt-4 sm:text-[0.9375rem]`}
            >
              We have been delivering professional car image editing services for the
              past 10+ years.
              <br />
              Here are the key features that ensure high quality results.
            </p>
          ) : null}
        </div>

        {items.length === 0 ? (
          <p
            className={`${sans.className} mt-8 text-center text-sm text-[var(--muted)]`}
          >
            —
          </p>
        ) : (
          <ul className="mt-8 grid list-none gap-3 sm:grid-cols-2 sm:gap-4 lg:mt-10 lg:grid-cols-4 xl:gap-5">
            {items.map((card, idx) => (
              <li key={`svc-${idx}-${card.iconKey}`} className="min-w-0">
                <article className="group flex flex-col rounded-xl bg-[var(--background)] px-4 py-4 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition duration-300 ease-out sm:px-5 sm:py-5 dark:shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
                  <div className="mx-auto mb-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-subtle)] text-[var(--accent)] transition duration-300 group-hover:scale-[1.03]">
                    <ServiceFeatureIcon
                      iconKey={card.iconKey}
                      className="h-5 w-5"
                    />
                  </div>
                  {card.title.trim() ? (
                    <h3
                      className={`${display.className} text-base font-semibold leading-snug text-[var(--foreground)] sm:text-[1.05rem]`}
                    >
                      {card.title.trim()}
                    </h3>
                  ) : null}
                  {card.body.trim() ? (
                    <p
                      className={`${sans.className} mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 ${card.title.trim() ? "" : "mt-1"}`}
                    >
                      {card.body.trim()}
                    </p>
                  ) : null}
                </article>
              </li>
            ))}
          </ul>
        )}

        {block.ctaLabel.trim() && block.ctaHref.trim() ? (
          <div className="mt-10 flex justify-center sm:mt-12">
            <Link
              href={block.ctaHref.trim()}
              className={`${sans.className} group inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition duration-200 hover:bg-[var(--accent-hover)] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] sm:text-sm sm:px-6 sm:py-3`}
            >
              {block.ctaLabel.trim()}
              <span
                aria-hidden
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
