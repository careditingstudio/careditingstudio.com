import { InnerPageBody } from "@/components/InnerPageBody";
import { PageHeading } from "@/components/PageHeading";
import { FreeTrialForm } from "@/components/forms/FreeTrialForm";
import { ENV_APP } from "@/config/deployment-env";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Trial",
  description: "Try Car Editing Studio on a sample of your images.",
};

export default function FreeTrialPage() {
  const siteKey = process.env[ENV_APP.TURNSTILE_SITE_KEY]?.trim() ?? "";
  return (
    <>
      <PageHeading
        title="Free Trial"
        description="Request a free trial and tell us exactly what you need. We’ll reply with the next steps."
      />
      <InnerPageBody>
        <div className="space-y-6">
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--background)] p-6 shadow-sm">
            <p className="text-sm text-[var(--muted)]">
              After you submit the form, we’ll contact you and guide you on how to send sample
              images and receive the edited results.
            </p>
          </div>
          <FreeTrialForm turnstileSiteKey={siteKey} />
        </div>
      </InnerPageBody>
    </>
  );
}
