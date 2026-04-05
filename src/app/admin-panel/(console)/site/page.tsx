"use client";

import { useAdminCms } from "@/components/admin/AdminCmsContext";

const fields: {
  key: keyof import("@/lib/cms-types").SiteSettings;
  label: string;
  hint: string;
  type?: "email" | "tel";
}[] = [
  {
    key: "businessName",
    label: "Business name",
    hint: "Shown in the main navigation header on every page.",
  },
  {
    key: "domainLabel",
    label: "Domain / tagline line",
    hint: "Small uppercase line above the hero headline (often your domain).",
  },
  {
    key: "email",
    label: "Email",
    hint: "Used in the top announcement bar (mailto link).",
    type: "email",
  },
  {
    key: "whatsappDial",
    label: "WhatsApp number (digits only)",
    hint: "Country code included, no + or spaces — used in wa.me links.",
    type: "tel",
  },
  {
    key: "whatsappDisplay",
    label: "WhatsApp display",
    hint: "How the number appears to visitors next to the icon.",
  },
];

export default function AdminSitePage() {
  const { cms, updateSite } = useAdminCms();
  if (!cms) return null;

  return (
    <div className="mx-auto max-w-xl">
      <header className="border-b border-zinc-800 pb-8">
        <h1 className="text-2xl font-semibold text-white">Site & contact</h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          Text-only settings that appear in the header, hero, and top contact
          strip. No images here — use the Media pages for pictures.
        </p>
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
            <p className="mt-1 text-xs text-zinc-500">{f.hint}</p>
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
