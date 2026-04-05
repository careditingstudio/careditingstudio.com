import { InnerPageBody } from "@/components/InnerPageBody";
import { PageHeading } from "@/components/PageHeading";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Selected automotive retouching and graphics work.",
};

export default function PortfolioPage() {
  return (
    <>
      <PageHeading
        title="Portfolio"
        description="Before/after sets and campaign stills will live here."
      />
      <InnerPageBody>
        <p>Content coming soon.</p>
      </InnerPageBody>
    </>
  );
}
