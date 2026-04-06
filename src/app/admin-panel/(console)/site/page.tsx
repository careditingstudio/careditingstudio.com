"use client";

import { useAdminCms } from "@/components/admin/AdminCmsContext";

const fields: {
  key: keyof import("@/lib/cms-types").SiteSettings;
  label: string;
  type?: "email" | "tel";
}[] = [
  { key: "businessName", label: "Business name" },
  { key: "domainLabel", label: "Domain / tagline" },
  { key: "email", label: "Email", type: "email" },
  { key: "whatsappDial", label: "WhatsApp (digits)", type: "tel" },
  { key: "whatsappDisplay", label: "WhatsApp display" },
];

export default function AdminSitePage() {
  const { cms, updateSite } = useAdminCms();
  if (!cms) return null;

  return (
    <div className="mx-auto max-w-xl">
      <header className="border-b border-zinc-800 pb-8">
        <h1 className="text-2xl font-semibold text-white">Site & contact</h1>
      </header>

      <form className="mt-10 space-y-8" onSubmit={(e) => e.preventDefault()}>
        {fields.map((f) => (
          <div key={f.key}>
            <label
              htmlFor={f.key}
              className="block text-sm font-medium text-zinc-200"
            >
              {f.label}
            </label>
            <input
              id={f.key}
              type={f.type ?? "text"}
              value={cms.site[f.key]}
              onChange={(e) => updateSite({ [f.key]: e.target.value })}
              className="mt-3 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none ring-[var(--accent)]/30 focus:border-[var(--accent)] focus:ring-2"
            />
          </div>
        ))}
      </form>
    </div>
  );
}
