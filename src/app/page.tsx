import { HeroBanner } from "@/components/HeroBanner";
import { HomeServiceFeatures } from "@/components/HomeServiceFeatures";
import { display, sans } from "./fonts";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Reserves vertical space for the fixed hero + floating car */}
      <div
        className="w-full shrink-0"
        style={{ minHeight: "var(--home-hero-spacer)" }}
        aria-hidden
      />
      <HeroBanner />

      <section
        id="home-scroll-sentinel"
        className="relative z-20 -mt-[clamp(1.25rem,3vw,2.5rem)] bg-zinc-100 px-5 pb-10 pt-[clamp(3.5rem,8vw,5.5rem)] dark:bg-zinc-900 sm:px-8 sm:pb-12 sm:pt-[clamp(4rem,9vw,6rem)]"
        aria-labelledby="home-intro-heading"
      >
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="home-intro-heading"
            className={`${display.className} text-balance text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl md:text-[2rem] md:leading-tight`}
          >
            Make Every Vehicle Image Look Premium and Eye-Catching
          </h2>
          <p
            className={`${sans.className} mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[var(--muted)] md:text-lg`}
          >
            We provide professional Car photo editing services for e-commerce
            {" "}
            /online platforms that develop brand growth.
          </p>
        </div>
      </section>

      <HomeServiceFeatures />
    </div>
  );
}
