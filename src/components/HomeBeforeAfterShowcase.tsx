import Link from "next/link";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { display, sans } from "@/app/fonts";
import type { CmsJson } from "@/lib/cms-types";

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

const ROWS = [
  {
    title: "Studio-grade vehicle cleanup",
    intro:
      "Swap cluttered driveways for a clean studio look, tame reflections, and keep paint reading true—ideal for listings and ads.",
    priceNote: "Typical projects start around $1–$3 per image depending on complexity.",
    listTitle: "Includes:",
    items: [
      "Background replacement",
      "Reflection & glare control",
      "Wheel and trim cleanup",
      "License plate handling",
      "Shadows that ground the car",
    ],
    beforeSrc: "",
    afterSrc: "",
    beforeAlt: "Car photo before editing",
    afterAlt: "Car photo after professional editing",
    imageFirst: false,
    showCtas: true,
  },
  {
    title: "Color & exposure you can trust",
    intro:
      "Correct white balance and exposure so every body line and interior detail matches what buyers see in person.",
    priceNote: "Color-focused edits often land around $0.50–$2.50 per frame.",
    listTitle: "Includes:",
    items: [
      "White balance & exposure",
      "Interior exposure matching",
      "Paint color accuracy",
      "Window sky cleanup",
      "Batch consistency across sets",
    ],
    beforeSrc: "",
    afterSrc: "",
    beforeAlt: "Vehicle image before color correction",
    afterAlt: "Vehicle image after color correction",
    imageFirst: true,
    showCtas: false,
  },
] as const;

type Props = {
  cms: CmsJson;
};

export function HomeBeforeAfterShowcase({ cms }: Props) {
  const rows = cms.beforeAfter
    .map((pair, i) => {
      const before = pair.before.trim();
      const after = pair.after.trim();
      if (!before || !after) return null;
      const template = ROWS[i % ROWS.length];
      return {
        ...template,
        beforeSrc: before,
        afterSrc: after,
      };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);

  if (rows.length === 0) {
    return null;
  }

  return (
    <section
      className="relative z-20 border-t border-[var(--line)] bg-[var(--background)] px-5 py-[clamp(3.5rem,8vw,5.5rem)] sm:px-8 sm:py-[clamp(4rem,9vw,6rem)]"
      aria-label="Before and after photo examples"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-16 lg:gap-20">
          {rows.map((row, i) => (
            <div
              key={row.title}
              className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14"
            >
              <div
                className={
                  row.imageFirst ? "lg:col-start-2 lg:row-start-1" : "lg:row-start-1"
                }
              >
                <h3
                  className={`${display.className} text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl`}
                >
                  {row.title}
                </h3>
                <p
                  className={`${sans.className} mt-4 text-base leading-relaxed text-[var(--muted)]`}
                >
                  {row.intro}
                </p>
                <p
                  className={`${sans.className} mt-3 text-sm font-medium text-[var(--foreground)] sm:text-[0.9375rem]`}
                >
                  {row.priceNote}
                </p>
                <p
                  className={`${sans.className} mt-8 text-sm font-semibold text-[var(--foreground)]`}
                >
                  {row.listTitle}
                </p>
                <ul className="mt-4 grid list-none gap-3 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-3">
                  {row.items.map((item) => (
                    <CheckItem key={item}>{item}</CheckItem>
                  ))}
                </ul>

                {row.showCtas ? (
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      href="/contact"
                      className={`${sans.className} inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-[var(--accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]`}
                    >
                      Get a free trial
                    </Link>
                    <Link
                      href="/services"
                      className={`${sans.className} inline-flex items-center justify-center rounded-full border border-[var(--line-strong)] bg-[var(--background)] px-5 py-2.5 text-sm font-semibold text-[var(--foreground)] transition duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]`}
                    >
                      View more
                    </Link>
                  </div>
                ) : (
                  <div className="mt-8">
                    <Link
                      href="/contact"
                      className={`${sans.className} inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] transition hover:text-[var(--accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]`}
                    >
                      Talk to us about your set
                      <span aria-hidden>→</span>
                    </Link>
                  </div>
                )}
              </div>

              <div
                className={
                  row.imageFirst ? "lg:col-start-1 lg:row-start-1" : "lg:col-start-2 lg:row-start-1"
                }
              >
                <BeforeAfterSlider
                  beforeSrc={row.beforeSrc}
                  afterSrc={row.afterSrc}
                  beforeAlt={row.beforeAlt}
                  afterAlt={row.afterAlt}
                  priority={i === 0}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
