import { InnerPageBody } from "@/components/InnerPageBody";
import { PageHeading } from "@/components/PageHeading";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order",
  description: "Place an order for automotive photo editing.",
};

export default function OrderPage() {
  return (
    <>
      <PageHeading
        title="Order Now"
        description="Brief, file specs, turnaround, and payment — hook this page to your workflow when you’re ready."
      />
      <InnerPageBody>
        <p>Content coming soon.</p>
      </InnerPageBody>
    </>
  );
}
