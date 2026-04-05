import { InnerPageBody } from "@/components/InnerPageBody";
import { PageHeading } from "@/components/PageHeading";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Trial",
  description: "Try Car Editing Studio on a sample of your images.",
};

export default function FreeTrialPage() {
  return (
    <>
      <PageHeading
        title="Free Trial"
        description="We’ll outline how to send test files and what you’ll get back — copy and flow TBD."
      />
      <InnerPageBody>
        <p>Content coming soon.</p>
      </InnerPageBody>
    </>
  );
}
