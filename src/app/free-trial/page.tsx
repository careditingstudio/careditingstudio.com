import { FreeTrialForm } from "@/components/forms/FreeTrialForm";
import { ENV_APP } from "@/config/deployment-env";
import { readCms } from "@/lib/cms-store";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Trial",
  description: "Try Car Editing Studio on a sample of your images.",
};

export default async function FreeTrialPage() {
  const cms = await readCms();
  const siteKey = process.env[ENV_APP.TURNSTILE_SITE_KEY]?.trim() ?? "";
  const serviceOptions = Array.from(
    new Set(cms.services.map((s) => s.name.trim()).filter((s) => s.length > 0)),
  ).slice(0, 12);
  return (
    <div className="mx-auto w-full max-w-[88rem] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto w-full max-w-[82rem]">
        <div className="mb-8 text-center sm:mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
            Start your free trial
          </h1>
          <p className="mt-3 text-sm text-[var(--muted)] sm:text-base">
            Send your details and sample images.
          </p>
        </div>
        <FreeTrialForm turnstileSiteKey={siteKey} serviceOptions={serviceOptions} />
      </div>
    </div>
  );
}
