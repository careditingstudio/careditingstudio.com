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
        title="Portfolio"
        description="Drag the slider on each tile to compare before and after."
      />
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <PortfolioGrid cms={cms} />
      </div>
    </>
  );
}
