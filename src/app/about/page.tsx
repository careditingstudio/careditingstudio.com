import { InnerPageBody } from "@/components/InnerPageBody";
import { PageHeading } from "@/components/PageHeading";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Car Editing Studio — who we work with and how we work.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeading
        title="About Us"
        description="We focus on cars on screen: consistent, sellable imagery for listings and ads."
      />
      <InnerPageBody>
        <p>Content coming soon.</p>
      </InnerPageBody>
    </>
  );
}
