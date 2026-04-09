import { HeroBanner } from "@/components/HeroBanner";
import { HomeBeforeAfterShowcase } from "@/components/HomeBeforeAfterShowcase";
import { HomeReviews } from "@/components/HomeReviews";
import { HomeServiceFeatures } from "@/components/HomeServiceFeatures";
import { TrustedClientsMarquee } from "@/components/TrustedClientsMarquee";
import { ContactForm } from "@/components/forms/ContactForm";
import { readCms } from "@/lib/cms-store";
import { display, sans } from "@/app/fonts";

export async function PublicHomePage() {
  const cms = await readCms();

  return (
    <div className="flex flex-1 flex-col">
      <div
        className="w-full shrink-0"
        style={{ minHeight: "var(--home-hero-spacer)" }}
        aria-hidden
      />
      <HeroBanner cms={cms} />

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

      <HomeServiceFeatures block={cms.homeServiceFeatures} />

      <HomeBeforeAfterShowcase cms={cms} />

      <HomeReviews block={cms.homeReviews} />

      <TrustedClientsMarquee />

      <section className="relative z-20 border-t border-[var(--line)] bg-[var(--background)] px-5 py-14 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p
              className={`${sans.className} text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--accent)]`}
            >
              Contact
            </p>
            <h2
              className={`${display.className} mt-3 text-balance text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl md:text-[2.05rem] md:leading-tight`}
            >
              Tell us what you need
            </h2>
          </div>

          <div className="mx-auto mt-10 max-w-4xl">
            <ContactForm hideHeading variant="compact" className="mt-0" />
          </div>
        </div>
      </section>
    </div>
  );
}
