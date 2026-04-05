import { InnerPageBody } from "@/components/InnerPageBody";
import { PageHeading } from "@/components/PageHeading";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description: "Automotive photo editing and retouching services.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeading
        title="Services"
        description="Cut-outs, color correction, background swaps, shadows, and campaign-ready assets — scoped to how you sell cars."
      />
      <InnerPageBody>
        <p>Content coming soon.</p>
      </InnerPageBody>
    </>
  );
}
