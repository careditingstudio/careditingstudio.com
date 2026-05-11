import { HeroBanner } from "@/components/HeroBanner";
import { HomeBeforeAfterShowcase } from "@/components/HomeBeforeAfterShowcase";
import { FaqSection } from "@/components/FaqSection";
import { HomeIntroSection } from "@/components/HomeIntroSection";
import { HomeServiceFeatures } from "@/components/HomeServiceFeatures";
import { HomeWhyChooseReviewsBand } from "@/components/HomeWhyChooseReviewsBand";
import { TrustedClientsMarquee } from "@/components/TrustedClientsMarquee";
import { ContactForm } from "@/components/forms/ContactForm";
import { ScheduleMeetingPromoCard } from "@/components/ScheduleMeetingPromoCard";
import { readCms } from "@/lib/cms-store";
import { getVisitorShellMessages } from "@/i18n/visitor-shell";
import { getPublicVisitorState } from "@/lib/public-visitor";
import { display } from "@/app/fonts";

export async function PublicHomePage() {
  const cms = await readCms();
  const visitor = await getPublicVisitorState();
  const shell = getVisitorShellMessages(visitor.locale);

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

          <div className="mx-auto mt-10 grid max-w-5xl gap-8 lg:max-w-6xl lg:grid-cols-[minmax(0,1fr)_min(100%,22rem)] lg:items-start lg:gap-10">
            <ContactForm
              hideHeading
              variant="compact"
              className="mt-0 min-w-0"
              forms={shell.forms}
            />
            <ScheduleMeetingPromoCard
              eyebrow={shell.pages.contactScheduleEyebrow}
              title={shell.pages.contactScheduleTitle}
              body={shell.pages.contactScheduleBody}
              ctaLabel={shell.pages.contactOpenScheduler}
              className="max-lg:mx-auto max-lg:max-w-md lg:w-full"
            />
          </div>
        </div>
      </section>

      <FaqSection items={cms.site.faqs} />
    </div>
  );
}
