import { ScheduleMeetingForm } from "@/components/forms/ScheduleMeetingForm";
import { ScheduleMeetingHero } from "@/components/forms/ScheduleMeetingHero";
import { ENV_APP } from "@/config/deployment-env";
import { readCms } from "@/lib/cms-store";
import { DEFAULT_OG_IMAGE, absoluteUrl } from "@/lib/seo";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Schedule a Meeting",
  description:
    "Book a meeting with the Car Editing Studio team to plan your project, review references, and align on style, budget, and turnaround.",
  alternates: {
    canonical: "/schedule-meeting",
  },
  openGraph: {
    title: "Schedule a Meeting | Car Editing Studio",
    description:
      "Book a meeting with the Car Editing Studio team to plan your project, review references, and align on style, budget, and turnaround.",
    url: "/schedule-meeting",
    type: "website",
    images: [{ url: DEFAULT_OG_IMAGE, alt: "Schedule a meeting with Car Editing Studio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Schedule a Meeting | Car Editing Studio",
    description:
      "Book a meeting with the Car Editing Studio team to plan your project, review references, and align on style, budget, and turnaround.",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default async function ScheduleMeetingPage() {
  const cms = await readCms();
  const siteKey = process.env[ENV_APP.TURNSTILE_SITE_KEY]?.trim() ?? "";
  const site = cms.site;
  const businessName = site.businessName.trim() || "Car Editing Studio";
  const email = site.email.trim();
  const whatsappDial = site.whatsappDial.trim();
  const whatsappDisplay = site.whatsappDisplay.trim();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            url: absoluteUrl("/schedule-meeting"),
            name: `Schedule a Meeting | ${businessName}`,
            description:
              "Book a meeting with the Car Editing Studio team to plan your project.",
          }),
        }}
      />
      <div className="relative isolate overflow-hidden">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(80%_60%_at_50%_0%,rgba(224,122,69,0.18)_0%,rgba(224,122,69,0.06)_38%,transparent_72%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-32 top-32 -z-10 h-72 w-72 rounded-full bg-[var(--accent)]/12 blur-[120px]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-24 top-72 -z-10 h-80 w-80 rounded-full bg-white/[0.04] blur-[120px]"
          aria-hidden
        />

        <div className="mx-auto w-full max-w-[88rem] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <ScheduleMeetingHero
            email={email}
            whatsappDial={whatsappDial}
            whatsappDisplay={whatsappDisplay}
          />
          <div className="mx-auto mt-10 w-full max-w-[82rem] sm:mt-14">
            <ScheduleMeetingForm turnstileSiteKey={siteKey} />
          </div>
        </div>
      </div>
    </>
  );
}
