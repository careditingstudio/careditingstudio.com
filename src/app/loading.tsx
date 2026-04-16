import { GlobalRouteLoader } from "@/components/GlobalRouteLoader";
import { readCms } from "@/lib/cms-store";

export default async function Loading() {
  let carSrc = "";
  try {
    const cms = await readCms();
    carSrc = cms.floatingCar.trim();
  } catch {
    carSrc = "";
  }

  return <GlobalRouteLoader carSrc={carSrc} />;
}
