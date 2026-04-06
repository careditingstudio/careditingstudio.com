import { AdminHomePageContent } from "@/components/admin/AdminHomePageContent";
import { AdminPortfolioContent } from "@/components/admin/AdminPortfolioContent";
import { AdminServicesContent } from "@/components/admin/AdminServicesContent";
import { AdminPagePlaceholder } from "@/components/admin/AdminPagePlaceholder";
import { ADMIN_PAGE_NAV } from "@/config/admin-pages";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function AdminEditorPage({ params }: Props) {
  const { slug } = await params;
  const item = ADMIN_PAGE_NAV.find((p) => p.href === `/editor/${slug}`);
  if (!item) notFound();

  if (slug === "home") {
    return <AdminHomePageContent />;
  }

  if (slug === "portfolio") {
    return <AdminPortfolioContent />;
  }

  if (slug === "services") {
    return <AdminServicesContent />;
  }

  return (
    <AdminPagePlaceholder
      title={item.label}
      publicPath={item.publicPath}
      description={item.hint}
    />
  );
}
