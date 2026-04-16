"use client";

import { AdminFormModal } from "@/components/admin/AdminFormModal";
import { useAdminCms } from "@/components/admin/AdminCmsContext";
import type { SiteSettings } from "@/lib/cms-types";
import { useState } from "react";

type Sep = SiteSettings["siteTagsSeparator"];

const SEP_OPTIONS: { id: Sep; label: string; hint: string }[] = [
  { id: "newline", label: "New lines", hint: "One tag per line" },
  { id: "comma", label: "Comma", hint: "tag1, tag2, tag3" },
  { id: "semicolon", label: "Semicolon", hint: "tag1; tag2; tag3" },
  { id: "pipe", label: "Pipe", hint: "tag1 | tag2 | tag3" },
];

function TextField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  type?: "text" | "email" | "tel" | "url";
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-zinc-200">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-3 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none ring-[var(--accent)]/30 focus:border-[var(--accent)] focus:ring-2"
      />
    </div>
  );
}

export default function AdminSettingsPage() {
  const { cms, updateSite } = useAdminCms();
  const [editPaymentIndex, setEditPaymentIndex] = useState<number | null>(null);
  if (!cms) return null;
  const site = cms.site;
  const currentPayment =
    editPaymentIndex === null ? "" : (site.paymentMethods ?? [])[editPaymentIndex] ?? "";

  return (
    <div className="mx-auto max-w-2xl">
      <header className="border-b border-zinc-800 pb-8">
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
        <p className="mt-2 text-sm text-zinc-400">
          These values power the public footer, announcement bar, and SEO metadata.
        </p>
      </header>

      <form className="mt-10 space-y-12" onSubmit={(e) => e.preventDefault()}>
        <section className="space-y-8">
          <h2 className="text-base font-semibold text-white">Contact</h2>
          <div className="grid gap-8 sm:grid-cols-2">
            <TextField
              id="email"
              label="Email"
              type="email"
              value={site.email}
              onChange={(v) => updateSite({ email: v })}
              placeholder="hello@yourdomain.com"
            />
            <TextField
              id="whatsappDisplay"
              label="WhatsApp display"
              value={site.whatsappDisplay}
              onChange={(v) => updateSite({ whatsappDisplay: v })}
              placeholder="+1 (234) 567-8901"
            />
          </div>
          <TextField
            id="whatsappDial"
            label="WhatsApp (digits)"
            type="tel"
            value={site.whatsappDial}
            onChange={(v) => updateSite({ whatsappDial: v })}
            placeholder="1234567890"
          />
        </section>

        <section className="space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-white">Social media</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Add platforms and URLs. The label picks the icon (e.g. Instagram,
                Facebook). Icons appear in the top bar and footer; the top bar shows
                icon-only links.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                updateSite({
                  socialLinks: [...site.socialLinks, { label: "New", url: "" }],
                })
              }
              className="rounded-lg bg-zinc-800 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-700"
            >
              Add social link
            </button>
          </div>

          <div className="space-y-6">
            {site.socialLinks.map((row, i) => (
              <div
                key={`${row.label}-${i}`}
                className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4"
              >
                <div className="grid gap-4 sm:grid-cols-[1fr,2fr,auto] sm:items-end">
                  <TextField
                    id={`social-label-${i}`}
                    label="Label"
                    value={row.label}
                    onChange={(v) => {
                      const next = [...site.socialLinks];
                      next[i] = { ...next[i]!, label: v };
                      updateSite({ socialLinks: next });
                    }}
                    placeholder="Instagram"
                  />
                  <TextField
                    id={`social-url-${i}`}
                    label="URL"
                    type="url"
                    value={row.url}
                    onChange={(v) => {
                      const next = [...site.socialLinks];
                      next[i] = { ...next[i]!, url: v };
                      updateSite({ socialLinks: next });
                    }}
                    placeholder="https://instagram.com/yourhandle"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      updateSite({
                        socialLinks: site.socialLinks.filter((_, k) => k !== i),
                      })
                    }
                    className="h-11 rounded-lg border border-zinc-700 px-3 text-sm font-medium text-zinc-200 hover:bg-zinc-900"
                    aria-label={`Remove ${row.label || "social link"}`}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-white">Office locations</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Maps and embeds use the address / map URL. The public site shows your
                office phone numbers instead of repeating the address or a Google Maps
                link.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                updateSite({
                  officeLocations: [
                    ...site.officeLocations,
                    { label: "New office", address: "", mapUrl: "", phone: "" },
                  ],
                })
              }
              className="rounded-lg bg-zinc-800 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-700"
            >
              Add office
            </button>
          </div>

          <div className="space-y-6">
            {site.officeLocations.map((row, i) => (
              <div
                key={`${row.label}-${i}`}
                className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4"
              >
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr,1fr,2fr,auto] lg:items-end">
                  <TextField
                    id={`office-label-${i}`}
                    label="Label"
                    value={row.label}
                    onChange={(v) => {
                      const next = [...site.officeLocations];
                      next[i] = { ...next[i]!, label: v };
                      updateSite({ officeLocations: next });
                    }}
                    placeholder="Main office"
                  />
                  <TextField
                    id={`office-phone-${i}`}
                    label="Office phone (public)"
                    type="tel"
                    value={row.phone ?? ""}
                    onChange={(v) => {
                      const next = [...site.officeLocations];
                      next[i] = { ...next[i]!, phone: v };
                      updateSite({ officeLocations: next });
                    }}
                    placeholder="+880 1730 848933"
                  />
                  <TextField
                    id={`office-address-${i}`}
                    label="Address (map / embed only, not shown on site)"
                    value={row.address}
                    onChange={(v) => {
                      const next = [...site.officeLocations];
                      next[i] = { ...next[i]!, address: v };
                      updateSite({ officeLocations: next });
                    }}
                    placeholder="Used if you don’t use an embed URL"
                  />
                  <TextField
                    id={`office-map-${i}`}
                    label="Map embed or link"
                    type="url"
                    value={row.mapUrl}
                    onChange={(v) => {
                      const next = [...site.officeLocations];
                      next[i] = { ...next[i]!, mapUrl: v };
                      updateSite({ officeLocations: next });
                    }}
                    placeholder="https://www.google.com/maps/embed?..."
                  />
                  <button
                    type="button"
                    onClick={() =>
                      updateSite({
                        officeLocations: site.officeLocations.filter((_, k) => k !== i),
                      })
                    }
                    className="h-11 rounded-lg border border-zinc-700 px-3 text-sm font-medium text-zinc-200 hover:bg-zinc-900"
                    aria-label={`Remove ${row.label || "office"}`}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-white">Payment methods</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Shared list used on both the pricing page and the footer.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                updateSite({ paymentMethods: [...(site.paymentMethods ?? []), "New method"] })
              }
              className="rounded-lg bg-zinc-800 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-700"
            >
              Add method
            </button>
          </div>

          <div className="space-y-3">
            {(site.paymentMethods ?? []).map((method, i) => (
              <div
                key={`${method}-${i}`}
                className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950/60 p-3"
              >
                <span className="w-5 shrink-0 text-center text-[10px] font-medium text-zinc-600">
                  {i + 1}
                </span>
                <p className="min-w-0 flex-1 truncate text-sm text-zinc-200">{method || "—"}</p>
                <button
                  type="button"
                  onClick={() => setEditPaymentIndex(i)}
                  className="rounded-md border border-zinc-600 bg-zinc-800/60 px-2.5 py-1 text-[11px] font-medium text-zinc-200 hover:border-[var(--accent)]/40 hover:text-white"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() =>
                    updateSite({
                      paymentMethods: (site.paymentMethods ?? []).filter((_, k) => k !== i),
                    })
                  }
                  className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </section>
        <AdminFormModal
          open={editPaymentIndex !== null}
          onClose={() => setEditPaymentIndex(null)}
          title={`Edit payment method ${editPaymentIndex === null ? "" : editPaymentIndex + 1}`}
          maxWidthClass="max-w-xl"
        >
          <input
            value={currentPayment}
            onChange={(e) => {
              if (editPaymentIndex === null) return;
              const next = [...(site.paymentMethods ?? [])];
              next[editPaymentIndex] = e.target.value;
              updateSite({ paymentMethods: next });
            }}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-[var(--accent)]"
          />
        </AdminFormModal>

        <section className="space-y-6">
          <h2 className="text-base font-semibold text-white">Site tags (SEO)</h2>
          <p className="text-sm text-zinc-400">
            Add keywords/phrases that describe your services. These are applied across
            pages and OpenGraph/Twitter metadata.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 sm:items-end">
            <div>
              <label
                htmlFor="siteTagsSeparator"
                className="block text-sm font-medium text-zinc-200"
              >
                Separator
              </label>
              <select
                id="siteTagsSeparator"
                value={site.siteTagsSeparator}
                onChange={(e) =>
                  updateSite({ siteTagsSeparator: e.target.value as Sep })
                }
                className="mt-3 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none ring-[var(--accent)]/30 focus:border-[var(--accent)] focus:ring-2"
              >
                {SEP_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label} — {o.hint}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="siteTagsText"
              className="block text-sm font-medium text-zinc-200"
            >
              Tags
            </label>
            <textarea
              id="siteTagsText"
              value={site.siteTagsText}
              onChange={(e) => updateSite({ siteTagsText: e.target.value })}
              rows={10}
              className="mt-3 w-full resize-y rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none ring-[var(--accent)]/30 focus:border-[var(--accent)] focus:ring-2"
              placeholder={`Automotive photo editing\nCar background removal\nCar color correction\nShadow creation\nDealer photo retouching`}
            />
          </div>
        </section>
      </form>
    </div>
  );
}

