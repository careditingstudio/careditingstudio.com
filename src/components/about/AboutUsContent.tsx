"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type Stat = { label: string; value: string; hint?: string };
type ValueCard = { title: string; body: string };
type Step = { title: string; body: string };
type CSSVars = React.CSSProperties & { ["--mx"]?: string; ["--my"]?: string };

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    const onChange = () => setReduced(Boolean(mq.matches));
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

function useInViewReveal(rootMargin = "0px 0px -10% 0px") {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.classList.add("is-inview");
          io.unobserve(el);
        }
      },
      { root: null, rootMargin, threshold: 0.15 },
    );

    for (const el of els) io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);
}

function cx(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

function Icon({
  d,
  className,
}: {
  d: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      aria-hidden
      className={className}
      fill="none"
    >
      <path d={d} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function StatPill({ stat }: { stat: Stat }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 backdrop-blur-sm">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-2)]">
          {stat.label}
        </p>
        <p className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
          {stat.value}
        </p>
      </div>
      {stat.hint ? (
        <p className="mt-1 text-sm text-[var(--muted)]">{stat.hint}</p>
      ) : null}
    </div>
  );
}

function ValueCard({ item }: { item: ValueCard }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[var(--line)] bg-[color-mix(in_oklab,var(--background)_92%,black_8%)] p-6 shadow-sm shadow-black/5">
      <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
        <div className="absolute -left-24 -top-24 h-56 w-56 rounded-full bg-[var(--accent)]/12 blur-2xl" />
        <div className="absolute -bottom-24 -right-24 h-56 w-56 rounded-full bg-white/6 blur-2xl" />
      </div>
      <div className="relative">
        <p className="text-base font-semibold tracking-tight text-[var(--foreground)]">
          {item.title}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
          {item.body}
        </p>
      </div>
    </div>
  );
}

function StepCard({ step, index }: { step: Step; index: number }) {
  return (
    <div className="relative rounded-2xl border border-[var(--line)] bg-[var(--background)] p-6">
      <div className="flex items-start gap-4">
        <div className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[var(--line)] bg-[color-mix(in_oklab,var(--background)_86%,black_14%)] text-sm font-semibold text-[var(--foreground)]">
          {String(index + 1).padStart(2, "0")}
        </div>
        <div>
          <p className="text-base font-semibold tracking-tight text-[var(--foreground)]">
            {step.title}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
            {step.body}
          </p>
        </div>
      </div>
    </div>
  );
}

export function AboutUsContent() {
  useInViewReveal();
  const reducedMotion = usePrefersReducedMotion();
  const heroRef = useRef<HTMLElement | null>(null);
  const heroStyle: CSSVars = useMemo(() => ({ "--mx": "50%", "--my": "35%" }), []);

  const stats: Stat[] = useMemo(
    () => [
      { label: "Price starts from", value: "$0.39", hint: "Transparent, scalable pricing." },
      { label: "Revisions", value: "Unlimited", hint: "Until it feels perfect." },
      { label: "Capacity", value: "5,000+/day", hint: "Built for busy catalogs." },
      { label: "Bulk discount", value: "Up to 20%", hint: "For high-volume teams." },
    ],
    [],
  );

  const bulletPoints = useMemo(
    () => [
      "High quality editing",
      "Fast turnaround time",
      "24/7 support",
      "Affordable pricing",
      "100% satisfaction guarantee",
      "Easy communication",
    ],
    [],
  );

  const steps: Step[] = useMemo(
    () => [
      {
        title: "Ecommerce-ready workflow",
        body: "We support ecommerce businesses and content creators with consistent, marketplace-ready outputs.",
      },
      {
        title: "Precision + consistency",
        body: "Each photo is refined carefully and consistently to keep your brand visuals sharp across platforms.",
      },
      {
        title: "Quick responses + support",
        body: "Clear communication, quick responses, and support you can rely on whenever you need it.",
      },
    ],
    [],
  );

  useEffect(() => {
    if (reducedMotion) return;
    const el = heroRef.current;
    if (!el) return;

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / Math.max(1, r.width);
        const y = (e.clientY - r.top) / Math.max(1, r.height);
        el.style.setProperty("--mx", `${(x * 100).toFixed(2)}%`);
        el.style.setProperty("--my", `${(y * 100).toFixed(2)}%`);
      });
    };

    el.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
    };
  }, [reducedMotion]);

  return (
    <div className="bg-[var(--background)]">
      {/* Hero */}
      <section
        ref={heroRef}
        className="relative overflow-hidden border-b border-[var(--line)]"
        style={heroStyle}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_var(--mx)_var(--my),rgba(196,92,38,0.20)_0%,transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(800px_420px_at_18%_20%,rgba(255,255,255,0.10)_0%,transparent_55%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.02)_35%,transparent_100%)] dark:bg-[linear-gradient(to_bottom,transparent_0%,rgba(255,255,255,0.03)_35%,transparent_100%)]" />
          <div className="absolute inset-0 opacity-[0.22] [background-image:linear-gradient(to_right,rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,black_0%,transparent_70%)] dark:opacity-[0.12]" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-[var(--background)]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16 md:py-20">
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--muted-2)]"
              data-reveal
            >
              About Us Page
            </p>
            <h1
              className={cx(
                "mt-3 text-balance text-3xl font-semibold tracking-tight text-[var(--foreground)]",
                "sm:text-4xl md:text-[2.75rem] md:leading-tight",
              )}
              data-reveal
            >
              Premium Car Image Editing for Perfect Visuals
            </h1>
            <p
              className="mt-5 max-w-3xl text-base leading-relaxed text-[var(--muted)] md:text-lg"
              data-reveal
            >
              At Car Editing Studio, our expert team is dedicated to creating clean, sharp,
              and high-impact images that stand out.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center" data-reveal>
              <Link
                href="/free-trial"
                className="ces-shine relative inline-flex min-h-11 items-center justify-center overflow-hidden rounded-xl bg-[var(--accent)] px-7 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:bg-[var(--accent-hover)]"
              >
                Get a Free Trial
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--line-strong)] bg-[color-mix(in_oklab,var(--background)_92%,black_8%)] px-7 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)]/35 hover:bg-[color-mix(in_oklab,var(--background)_86%,black_14%)]"
              >
                Contact Us
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" data-reveal>
              {stats.map((s) => (
                <StatPill key={s.label} stat={s} />
              ))}
            </div>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5" data-reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-2)]">
              Who we are
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
              Car Editing Studio
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
              Car Editing Studio is one of the leading car photo editing service providers
              in Bangladesh, offering high-quality solutions to clients worldwide. We
              deliver reliable and visually impressive results with more than <span className="font-semibold text-[var(--foreground)]">8+</span>{" "}
              years of experience in professional image editing and creative design.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
              Our skilled team has worked with many well-known brands in Europe and the
              United States, gaining strong industry expertise. Car sellers and dealers
              look for professional services like careditingstudio.com to enhance vehicle
              images, improve presentation, and attract more customers through clean and
              high-convert visuals.
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="ces-reveal" data-reveal>
                <ValueCard
                  item={{
                    title: "Ecommerce-focused service",
                    body: "Our services are designed to meet the unique needs of ecommerce businesses and content creators.",
                  }}
                />
              </div>
              <div className="ces-reveal" data-reveal>
                <ValueCard
                  item={{
                    title: "Quality + consistency",
                    body: "We ensure every photo is carefully refined and perfectly enhanced with attention to detail.",
                  }}
                />
              </div>
              <div className="ces-reveal sm:col-span-2" data-reveal>
                <div className="relative overflow-hidden rounded-2xl border border-[var(--line)] bg-[color-mix(in_oklab,var(--background)_88%,black_12%)] p-6">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full bg-[var(--accent)]/18 blur-3xl"
                  />
                  <div className="relative">
                    <p className="text-sm leading-relaxed text-[var(--muted)] sm:text-base">
                      By combining precision, creativity, and customer satisfaction, our
                      goal is to become a trusted global provider of automotive image
                      editing services by offering reliable, innovative, and high-performance
                      solutions that set new standards in quality and excellence.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="border-y border-[var(--line)] bg-[color-mix(in_oklab,var(--background)_92%,black_8%)]">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4" data-reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-2)]">
                Support
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
                Quick responses, strong support.
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
                Our marketing and client support team is fluent in English and available
                around the clock—we provide <span className="font-semibold text-[var(--foreground)]">24/7</span>{" "}
                assistance to ensure smooth and reliable service. We maintain clear and
                friendly communication with every client to deliver quick responses, strong
                support, and build trust.
              </p>
            </div>
            <div className="lg:col-span-8">
              <div className="grid gap-4 md:grid-cols-3">
                {steps.map((s, i) => (
                  <div key={s.title} className="ces-reveal" data-reveal>
                    <StepCard step={s} index={i} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5" data-reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-2)]">
              Why customers choose us
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
              Check our work first — free trial.
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
              For new customers, we offer a free trial service so you can check our work
              quality before placing an order. Our dedicated customer support team is
              always ready to assist and provide the best possible service.
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="grid gap-3 sm:grid-cols-2" data-reveal>
              {bulletPoints.map((t) => (
                <div
                  key={t}
                  className="relative overflow-hidden rounded-2xl border border-[var(--line)] bg-[color-mix(in_oklab,var(--background)_92%,black_8%)] px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-xl border border-[var(--line)] bg-white/[0.03] text-[var(--foreground)]">
                      <Icon d="M6.5 12.5l3 3L17.5 8.5" className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-semibold text-[var(--foreground)]">{t}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[var(--line)]">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
          <div
            className={cx(
              "relative overflow-hidden rounded-3xl border border-[var(--line)]",
              "bg-[color-mix(in_oklab,var(--background)_88%,black_12%)] p-8 sm:p-10",
            )}
            data-reveal
          >
            <div
              aria-hidden
              className={cx(
                "pointer-events-none absolute -left-28 -top-28 h-72 w-72 rounded-full bg-[var(--accent)]/20 blur-3xl",
                !reducedMotion && "ces-float",
              )}
            />
            <div
              aria-hidden
              className={cx(
                "pointer-events-none absolute -bottom-28 -right-28 h-72 w-72 rounded-full bg-white/8 blur-3xl",
                !reducedMotion && "ces-float",
              )}
              style={!reducedMotion ? { animationDelay: "1.1s" } : undefined}
            />

            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-2)]">
                  Ready to see the results?
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
                  Start a free trial today.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
                  Send a few images and we’ll return edits so you can judge our quality
                  before placing an order.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:min-w-[220px]">
                <Link
                  href="/free-trial"
                  className="ces-shine relative inline-flex min-h-11 items-center justify-center overflow-hidden rounded-xl bg-[var(--accent)] px-7 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:bg-[var(--accent-hover)]"
                >
                  Get a Free Trial
                </Link>
                <Link
                  href="/portfolio"
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--line-strong)] bg-white/[0.03] px-7 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)]/35 hover:bg-white/[0.06]"
                >
                  View our work
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

