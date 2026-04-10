"use client";

import DotGrid from "@/components/DotGrid";
import { HomeReviews } from "@/components/HomeReviews";
import { WhyChooseUsSection } from "@/components/WhyChooseUsSection";
import type { CmsJson } from "@/lib/cms-types";

export function HomeWhyChooseReviewsBand({ cms }: { cms: CmsJson }) {
  return (
    <div className="relative z-20 overflow-hidden border-t border-[var(--line)] bg-[#020204]">
      <div className="pointer-events-none absolute inset-0 z-0">
        <DotGrid
          className="h-full min-h-full w-full"
          style={{ width: "100%", height: "100%", minHeight: "100%" }}
          dotSize={5}
          gap={15}
          baseColor="#1a1524"
          activeColor="#5227FF"
          proximity={120}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
        />
      </div>
      <div className="relative z-10">
        <WhyChooseUsSection block={cms.homeWhyChooseUs} />
        <HomeReviews block={cms.homeReviews} embedded />
      </div>
    </div>
  );
}
