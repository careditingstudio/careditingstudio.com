"use client";

import { redirect } from "next/navigation";

export default function AdminSitePage() {
  redirect("/admin-panel/settings");
}
