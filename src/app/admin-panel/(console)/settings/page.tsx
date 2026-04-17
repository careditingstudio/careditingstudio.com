"use client";

import { AdminFormModal } from "@/components/admin/AdminFormModal";
import { useAdminCms } from "@/components/admin/AdminCmsContext";
import { MediaLibraryModal } from "@/components/admin/MediaLibraryModal";
import { isUploadedAsset } from "@/lib/cms-types";
import Image from "next/image";
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
  const { cms, updateSite, upload } = useAdminCms();
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [socialModalOpen, setSocialModalOpen] = useState(false);
  const [officeModalOpen, setOfficeModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [seoModalOpen, setSeoModalOpen] = useState(false);
  const [editSocialIndex, setEditSocialIndex] = useState<number | null>(null);
  const [editOfficeIndex, setEditOfficeIndex] = useState<number | null>(null);
  const [paymentUploadBusy, setPaymentUploadBusy] = useState(false);
  const [paymentUploadError, setPaymentUploadError] = useState("");
  const [paymentLibraryOpen, setPaymentLibraryOpen] = useState(false);
  const [editPaymentIndex, setEditPaymentIndex] = useState<number | null>(null);
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  if (!cms) return null;
  const site = cms.site;
  const currentSocial =
    editSocialIndex === null
      ? { label: "", url: "" }
      : site.socialLinks[editSocialIndex] ?? { label: "", url: "" };
  const currentOffice =
    editOfficeIndex === null
      ? { label: "", phone: "", address: "", mapUrl: "" }
      : site.officeLocations[editOfficeIndex] ?? {
          label: "",
          phone: "",
          address: "",
          mapUrl: "",
        };
  const currentPayment =
    editPaymentIndex === null
      ? { label: "", imageUrl: "" }
      : (site.paymentMethods ?? [])[editPaymentIndex] ?? { label: "", imageUrl: "" };
  const socialSummary = site.socialLinks.filter((s) => s.label.trim() || s.url.trim()).length;
  const officeSummary = site.officeLocations.filter((o) => o.label.trim()).length;
  const paymentSummary = (site.paymentMethods ?? []).filter((m) => m.label.trim()).length;
  const faqSummary = (site.faqs ?? []).length;

  return (
    <div className="mx-auto max-w-6xl">
      <header className="border-b border-zinc-800 pb-8">
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
        <p className="mt-2 text-sm text-zinc-400">
          These values power the public footer, announcement bar, and SEO metadata.
        </p>
      </header>

      <form className="mt-10 space-y-5" onSubmit={(e) => e.preventDefault()}>
        <section className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-white">Contact</h2>
              <p className="mt-1 text-sm text-zinc-400">Email and WhatsApp details.</p>
              <p className="mt-2 text-xs text-zinc-500">
                {site.email || "No email"} · {site.whatsappDisplay || "No WhatsApp display"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setContactModalOpen(true)}
              className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
            >
              Edit
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-white">Social media</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Keep all social links organized in a popup editor.
              </p>
              <p className="mt-2 text-xs text-zinc-500">{socialSummary} link(s) configured</p>
            </div>
            <button
              type="button"
              onClick={() => setSocialModalOpen(true)}
              className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
            >
              Manage
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-white">Office locations</h2>
              <p className="mt-1 text-sm text-zinc-400">Manage office labels, phones, and map info.</p>
              <p className="mt-2 text-xs text-zinc-500">{officeSummary} office(s) configured</p>
            </div>
            <button
              type="button"
              onClick={() => setOfficeModalOpen(true)}
              className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
            >
              Manage
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-white">Payment methods</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Shared list used on both the pricing page and the footer.
              </p>
              <p className="mt-2 text-xs text-zinc-500">{paymentSummary} method(s) configured</p>
            </div>
            <button
              type="button"
              onClick={() => setPaymentModalOpen(true)}
              className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
            >
              Manage
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-white">FAQ</h2>
              <p className="mt-1 text-sm text-zinc-400">Manage public FAQ entries in a popup.</p>
              <p className="mt-2 text-xs text-zinc-500">{faqSummary} FAQ(s) configured</p>
            </div>
            <button
              type="button"
              onClick={() => setFaqModalOpen(true)}
              className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
            >
              Manage
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-white">Site tags (SEO)</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Keywords and separator rules are edited in a popup.
              </p>
              <p className="mt-2 text-xs text-zinc-500">
                Separator: {site.siteTagsSeparator} · {site.siteTagsText.trim() ? "Tags added" : "No tags yet"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSeoModalOpen(true)}
              className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
            >
              Edit
            </button>
          </div>
        </section>

        <AdminFormModal
          open={contactModalOpen}
          onClose={() => setContactModalOpen(false)}
          title="Edit contact"
          maxWidthClass="max-w-3xl"
        >
          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
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
          </div>
        </AdminFormModal>

        <AdminFormModal
          open={socialModalOpen}
          onClose={() => {
            setSocialModalOpen(false);
            setEditSocialIndex(null);
          }}
          title="Manage social media"
          maxWidthClass="max-w-4xl"
        >
          <div className="space-y-3">
            <div className="flex justify-end">
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
            {site.socialLinks.map((row, i) => (
              <div
                key={`${row.label}-${i}`}
                className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950/60 p-3"
              >
                <span className="w-5 shrink-0 text-center text-[10px] font-medium text-zinc-600">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-zinc-200">{row.label || "—"}</p>
                  <p className="truncate text-[11px] text-zinc-500">{row.url || "No URL"}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditSocialIndex(i)}
                  className="rounded-md border border-zinc-600 bg-zinc-800/60 px-2.5 py-1 text-[11px] font-medium text-zinc-200 hover:border-[var(--accent)]/40 hover:text-white"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() =>
                    updateSite({
                      socialLinks: site.socialLinks.filter((_, k) => k !== i),
                    })
                  }
                  className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </AdminFormModal>

        <AdminFormModal
          open={editSocialIndex !== null}
          onClose={() => setEditSocialIndex(null)}
          title={`Edit social link ${editSocialIndex === null ? "" : editSocialIndex + 1}`}
          maxWidthClass="max-w-xl"
        >
          <div className="space-y-4">
            <TextField
              id="social-label-edit"
              label="Label"
              value={currentSocial.label}
              onChange={(v) => {
                if (editSocialIndex === null) return;
                const next = [...site.socialLinks];
                next[editSocialIndex] = { ...next[editSocialIndex]!, label: v };
                updateSite({ socialLinks: next });
              }}
              placeholder="Instagram"
            />
            <TextField
              id="social-url-edit"
              label="URL"
              type="url"
              value={currentSocial.url}
              onChange={(v) => {
                if (editSocialIndex === null) return;
                const next = [...site.socialLinks];
                next[editSocialIndex] = { ...next[editSocialIndex]!, url: v };
                updateSite({ socialLinks: next });
              }}
              placeholder="https://instagram.com/yourhandle"
            />
          </div>
        </AdminFormModal>

        <AdminFormModal
          open={officeModalOpen}
          onClose={() => {
            setOfficeModalOpen(false);
            setEditOfficeIndex(null);
          }}
          title="Manage office locations"
          maxWidthClass="max-w-4xl"
        >
          <div className="space-y-3">
            <div className="flex justify-end">
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
            {site.officeLocations.map((row, i) => (
              <div
                key={`${row.label}-${i}`}
                className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950/60 p-3"
              >
                <span className="w-5 shrink-0 text-center text-[10px] font-medium text-zinc-600">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-zinc-200">{row.label || "—"}</p>
                  <p className="truncate text-[11px] text-zinc-500">
                    {row.phone || "No phone"} · {row.mapUrl || "No map URL"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditOfficeIndex(i)}
                  className="rounded-md border border-zinc-600 bg-zinc-800/60 px-2.5 py-1 text-[11px] font-medium text-zinc-200 hover:border-[var(--accent)]/40 hover:text-white"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() =>
                    updateSite({
                      officeLocations: site.officeLocations.filter((_, k) => k !== i),
                    })
                  }
                  className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </AdminFormModal>

        <AdminFormModal
          open={editOfficeIndex !== null}
          onClose={() => setEditOfficeIndex(null)}
          title={`Edit office ${editOfficeIndex === null ? "" : editOfficeIndex + 1}`}
          maxWidthClass="max-w-3xl"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              id="office-label-edit"
              label="Label"
              value={currentOffice.label}
              onChange={(v) => {
                if (editOfficeIndex === null) return;
                const next = [...site.officeLocations];
                next[editOfficeIndex] = { ...next[editOfficeIndex]!, label: v };
                updateSite({ officeLocations: next });
              }}
              placeholder="Main office"
            />
            <TextField
              id="office-phone-edit"
              label="Office phone (public)"
              type="tel"
              value={currentOffice.phone ?? ""}
              onChange={(v) => {
                if (editOfficeIndex === null) return;
                const next = [...site.officeLocations];
                next[editOfficeIndex] = { ...next[editOfficeIndex]!, phone: v };
                updateSite({ officeLocations: next });
              }}
              placeholder="+880 1730 848933"
            />
            <TextField
              id="office-address-edit"
              label="Address"
              value={currentOffice.address}
              onChange={(v) => {
                if (editOfficeIndex === null) return;
                const next = [...site.officeLocations];
                next[editOfficeIndex] = { ...next[editOfficeIndex]!, address: v };
                updateSite({ officeLocations: next });
              }}
              placeholder="Used for maps/search"
            />
            <TextField
              id="office-map-edit"
              label="Map embed or link"
              type="url"
              value={currentOffice.mapUrl}
              onChange={(v) => {
                if (editOfficeIndex === null) return;
                const next = [...site.officeLocations];
                next[editOfficeIndex] = { ...next[editOfficeIndex]!, mapUrl: v };
                updateSite({ officeLocations: next });
              }}
              placeholder="https://www.google.com/maps/embed?..."
            />
          </div>
        </AdminFormModal>

        <AdminFormModal
          open={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          title="Manage payment methods"
          maxWidthClass="max-w-4xl"
        >
          <div className="space-y-3">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() =>
                  updateSite({
                    paymentMethods: [
                      ...(site.paymentMethods ?? []),
                      { label: "New method", imageUrl: "" },
                    ],
                  })
                }
                className="rounded-lg bg-zinc-800 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-700"
              >
                Add method
              </button>
            </div>
            {(site.paymentMethods ?? []).map((method, i) => (
              <div
                key={`${method.label}-${i}`}
                className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950/60 p-3"
              >
                <span className="w-5 shrink-0 text-center text-[10px] font-medium text-zinc-600">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-zinc-200">{method.label || "—"}</p>
                  <p className="truncate text-[11px] text-zinc-500">
                    {method.imageUrl || "No image selected"}
                  </p>
                </div>
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
        </AdminFormModal>

        <AdminFormModal
          open={editPaymentIndex !== null}
          onClose={() => {
            setEditPaymentIndex(null);
            setPaymentUploadBusy(false);
            setPaymentUploadError("");
            setPaymentLibraryOpen(false);
          }}
          title={`Edit payment method ${editPaymentIndex === null ? "" : editPaymentIndex + 1}`}
          maxWidthClass="max-w-xl"
        >
          <div className="space-y-4">
            <input
              value={currentPayment.label}
              onChange={(e) => {
                if (editPaymentIndex === null) return;
                const next = [...(site.paymentMethods ?? [])];
                next[editPaymentIndex] = {
                  ...(next[editPaymentIndex] ?? { label: "", imageUrl: "" }),
                  label: e.target.value,
                };
                updateSite({ paymentMethods: next });
              }}
              placeholder="Payment label (e.g. PayPal)"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-[var(--accent)]"
            />
            <input
              value={currentPayment.imageUrl}
              onChange={(e) => {
                if (editPaymentIndex === null) return;
                const next = [...(site.paymentMethods ?? [])];
                next[editPaymentIndex] = {
                  ...(next[editPaymentIndex] ?? { label: "", imageUrl: "" }),
                  imageUrl: e.target.value,
                };
                updateSite({ paymentMethods: next });
              }}
              placeholder="Image URL (or upload below)"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-[var(--accent)]"
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setPaymentLibraryOpen(true)}
                className="rounded-lg border border-zinc-700 px-3 py-2 text-xs font-medium text-zinc-200 hover:bg-zinc-900"
              >
                Choose from library
              </button>
              <label className="inline-flex cursor-pointer items-center rounded-lg border border-zinc-700 px-3 py-2 text-xs font-medium text-zinc-200 hover:bg-zinc-900">
                {paymentUploadBusy ? "Uploading..." : "Upload image"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/avif,image/*"
                  disabled={paymentUploadBusy}
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    e.target.value = "";
                    if (!file || editPaymentIndex === null) return;
                    setPaymentUploadBusy(true);
                    setPaymentUploadError("");
                    void upload(file)
                      .then((url) => {
                        const next = [...(site.paymentMethods ?? [])];
                        next[editPaymentIndex] = {
                          ...(next[editPaymentIndex] ?? { label: "", imageUrl: "" }),
                          imageUrl: url,
                        };
                        updateSite({ paymentMethods: next });
                      })
                      .catch((err: unknown) => {
                        setPaymentUploadError(
                          err instanceof Error ? err.message : "Upload failed",
                        );
                      })
                      .finally(() => setPaymentUploadBusy(false));
                  }}
                />
              </label>
            </div>
            {paymentUploadError ? (
              <p className="text-xs text-red-400">{paymentUploadError}</p>
            ) : null}
            {currentPayment.imageUrl ? (
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
                <p className="mb-2 text-xs text-zinc-400">Preview</p>
                <div className="relative h-14 w-28 overflow-hidden rounded-md border border-zinc-700 bg-white/90">
                  <Image
                    src={currentPayment.imageUrl}
                    alt={currentPayment.label || "Payment method"}
                    fill
                    className="object-contain p-1"
                    sizes="112px"
                    unoptimized={isUploadedAsset(currentPayment.imageUrl)}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </AdminFormModal>
        <MediaLibraryModal
          open={paymentLibraryOpen}
          onClose={() => setPaymentLibraryOpen(false)}
          title="Pick payment logo"
          onPick={(url) => {
            if (editPaymentIndex === null) return;
            const next = [...(site.paymentMethods ?? [])];
            next[editPaymentIndex] = {
              ...(next[editPaymentIndex] ?? { label: "", imageUrl: "" }),
              imageUrl: url,
            };
            updateSite({ paymentMethods: next });
            setPaymentLibraryOpen(false);
          }}
        />

        <AdminFormModal
          open={faqModalOpen}
          onClose={() => setFaqModalOpen(false)}
          title="Edit FAQ entries"
          maxWidthClass="max-w-5xl"
        >
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-zinc-400">
                Add, reorder, or edit entries shown in the public FAQ section.
              </p>
              <button
                type="button"
                onClick={() =>
                  updateSite({
                    faqs: [
                      ...(site.faqs ?? []),
                      { question: "New question", answer: "" },
                    ],
                  })
                }
                className="rounded-lg bg-zinc-800 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-700"
              >
                Add FAQ
              </button>
            </div>

            <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
              {(site.faqs ?? []).map((faq, i) => (
                <div
                  key={`${faq.question}-${i}`}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-zinc-300">FAQ #{i + 1}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        disabled={i === 0}
                        onClick={() => {
                          const current = [...(site.faqs ?? [])];
                          if (i <= 0) return;
                          [current[i - 1], current[i]] = [current[i], current[i - 1]];
                          updateSite({ faqs: current });
                        }}
                        className="rounded-md border border-zinc-700 px-2 py-1 text-xs font-medium text-zinc-200 hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Up
                      </button>
                      <button
                        type="button"
                        disabled={i >= (site.faqs ?? []).length - 1}
                        onClick={() => {
                          const current = [...(site.faqs ?? [])];
                          if (i >= current.length - 1) return;
                          [current[i], current[i + 1]] = [current[i + 1], current[i]];
                          updateSite({ faqs: current });
                        }}
                        className="rounded-md border border-zinc-700 px-2 py-1 text-xs font-medium text-zinc-200 hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Down
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateSite({
                            faqs: (site.faqs ?? []).filter((_, k) => k !== i),
                          })
                        }
                        className="rounded-md border border-zinc-700 px-2 py-1 text-xs font-medium text-zinc-200 hover:bg-zinc-900"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor={`faq-question-${i}`}
                        className="block text-sm font-medium text-zinc-200"
                      >
                        Question
                      </label>
                      <input
                        id={`faq-question-${i}`}
                        value={faq.question}
                        onChange={(e) => {
                          const next = [...(site.faqs ?? [])];
                          next[i] = { ...next[i]!, question: e.target.value };
                          updateSite({ faqs: next });
                        }}
                        className="mt-3 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none ring-[var(--accent)]/30 focus:border-[var(--accent)] focus:ring-2"
                        placeholder="Type the FAQ question"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`faq-answer-${i}`}
                        className="block text-sm font-medium text-zinc-200"
                      >
                        Answer
                      </label>
                      <textarea
                        id={`faq-answer-${i}`}
                        value={faq.answer}
                        onChange={(e) => {
                          const next = [...(site.faqs ?? [])];
                          next[i] = { ...next[i]!, answer: e.target.value };
                          updateSite({ faqs: next });
                        }}
                        rows={4}
                        className="mt-3 w-full resize-y rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none ring-[var(--accent)]/30 focus:border-[var(--accent)] focus:ring-2"
                        placeholder="Type the FAQ answer"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AdminFormModal>

        <AdminFormModal
          open={seoModalOpen}
          onClose={() => setSeoModalOpen(false)}
          title="Edit site tags (SEO)"
          maxWidthClass="max-w-4xl"
        >
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

          <div className="mt-6">
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
        </AdminFormModal>
      </form>
    </div>
  );
}

