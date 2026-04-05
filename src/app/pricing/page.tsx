import { InnerPageBody } from "@/components/InnerPageBody";
import { PageHeading } from "@/components/PageHeading";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Plans and rates for automotive photo editing.",
};

export default function PricingPage() {
  return (
    <>
      <PageHeading
        title="Pricing"
        description="Transparent packages for dealers, marketplaces, and studios — details will go here."
      />
      <InnerPageBody>
        <p>Content coming soon.</p>
      </InnerPageBody>
    </>
  );
}
