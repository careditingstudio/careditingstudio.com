import { PageHeading } from "@/components/PageHeading";
import { PortfolioGrid } from "@/components/PortfolioGrid";
import { readCms } from "@/lib/cms-store";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Selected automotive retouching and graphics work.",
};

export default async function PortfolioPage() {
  const cms = await readCms();
  return (
    <>
      <PageHeading
        title="Explore Our Creative Portfolio"
        description="Our showcase highlights the quality and creativity behind our work. It offers a glimpse into our success stories, demonstrating real results and professional excellence."
      />
      <div className="mx-auto max-w-[88rem] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <PortfolioGrid cms={cms} />
      </div>
    </>
  );
}
