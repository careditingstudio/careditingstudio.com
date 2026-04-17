import { HeroBanner } from "@/components/HeroBanner";
import { HomeBeforeAfterShowcase } from "@/components/HomeBeforeAfterShowcase";
import { FaqSection } from "@/components/FaqSection";
import { HomeIntroSection } from "@/components/HomeIntroSection";
import { HomeServiceFeatures } from "@/components/HomeServiceFeatures";
import { HomeWhyChooseReviewsBand } from "@/components/HomeWhyChooseReviewsBand";
import { TrustedClientsMarquee } from "@/components/TrustedClientsMarquee";
import { ContactForm } from "@/components/forms/ContactForm";
import { readCms } from "@/lib/cms-store";
import { display } from "@/app/fonts";

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

      <HomeIntroSection floatingCar={cms.floatingCar} />

      <HomeServiceFeatures block={cms.homeServiceFeatures} />

      <HomeBeforeAfterShowcase cms={cms} />
      <HomeWhyChooseReviewsBand cms={cms} />

      <TrustedClientsMarquee />

      <section className="relative z-20 border-t border-[var(--line)] bg-[var(--background)] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-[82rem]">
          <div className="mx-auto max-w-2xl text-center">
            <h2
              className={`${display.className} mt-3 text-balance text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl md:text-[2.05rem] md:leading-tight`}
            >
              Tell us what you need
            </h2>
          </div>

          <div className="mx-auto mt-10 max-w-5xl">
            <ContactForm hideHeading variant="compact" className="mt-0" />
          </div>
        </div>
      </section>

      <FaqSection items={cms.site.faqs} />
    </div>
  );
}
