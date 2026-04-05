import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/** Login is disabled for now — send everyone to the dashboard. */
export default function AdminLoginPage() {
  redirect("/");
}
