"use client";

import type { SiteSettings } from "@/lib/cms-types";
import { generateEmailHtml } from "@/lib/email-html-generator";
import {
  createDefaultDraft,
  EmailDraft,
  PRESET_TEMPLATES,
} from "@/lib/email-template-types";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "carediting_email_drafts_v1";

function loadDraftsFromStorage(): EmailDraft[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveDraftsToStorage(drafts: EmailDraft[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
  } catch {
    // Storage quota or disabled
  }
}

type Props = {
  site?: SiteSettings;
  heroBanners?: string[];
  portfolioImages?: string[];
  initialRecipient?: { email: string; name: string; messageContext?: string } | null;
};

export function AdminEmailTemplateBuilder({
  site,
  heroBanners = [],
  portfolioImages = [],
  initialRecipient,
}: Props) {
  const [drafts, setDrafts] = useState<EmailDraft[]>([]);
  const [activeDraft, setActiveDraft] = useState<EmailDraft>(() => createDefaultDraft());
  const [activeTab, setActiveTab] = useState<"EDITOR" | "PREVIEW" | "DRAFTS">("EDITOR");
  const [previewDevice, setPreviewDevice] = useState<"DESKTOP" | "MOBILE">("DESKTOP");
  const [copied, setCopied] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [newPhotoInput, setNewPhotoInput] = useState("");

  // Load stored drafts on mount
  useEffect(() => {
    const stored = loadDraftsFromStorage();
    setDrafts(stored);
  }, []);

  // Handle pre-filled recipient from Inbox reply action
  useEffect(() => {
    if (initialRecipient) {
      setActiveDraft((prev) => ({
        ...prev,
        recipientEmail: initialRecipient.email || prev.recipientEmail,
        recipientName: initialRecipient.name || prev.recipientName,
        title: initialRecipient.name ? `Reply to ${initialRecipient.name}` : prev.title,
        bodyText: initialRecipient.messageContext
          ? `Hello ${initialRecipient.name || "Valued Client"},\n\nThank you for reaching out to us!\n\nRegarding your request:\n"${initialRecipient.messageContext.slice(0, 180)}..."\n\nWe are pleased to assist you.`
          : prev.bodyText,
      }));
    }
  }, [initialRecipient]);

  // Real-time HTML generation
  const generatedHtml = useMemo(() => {
    return generateEmailHtml(activeDraft, site);
  }, [activeDraft, site]);

  // Save current active draft
  const handleSaveDraft = useCallback(() => {
    const updatedDraft: EmailDraft = {
      ...activeDraft,
      updatedAt: new Date().toISOString(),
    };
    setActiveDraft(updatedDraft);

    setDrafts((prev) => {
      const idx = prev.findIndex((d) => d.id === updatedDraft.id);
      let next: EmailDraft[];
      if (idx >= 0) {
        next = [...prev];
        next[idx] = updatedDraft;
      } else {
        next = [updatedDraft, ...prev];
      }
      saveDraftsToStorage(next);
      return next;
    });

    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  }, [activeDraft]);

  // Load preset template into active draft
  const handleApplyPreset = (presetId: string) => {
    const preset = PRESET_TEMPLATES.find((p) => p.id === presetId);
    if (!preset) return;
    setActiveDraft((prev) => ({
      ...prev,
      title: preset.name,
      subject: preset.subject,
      headline: preset.headline,
      bodyText: preset.bodyText,
      ctaText: preset.ctaText,
      ctaUrl: preset.ctaUrl,
      bannerUrl: preset.bannerUrl || prev.bannerUrl,
      photoUrls: preset.photoUrls || prev.photoUrls,
    }));
  };

  // Copy HTML code to clipboard
  const handleCopyHtml = async () => {
    try {
      await navigator.clipboard.writeText(generatedHtml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  // Launch email client via mailto
  const handleSendViaMailClient = () => {
    const recipient = activeDraft.recipientEmail.trim();
    const subject = encodeURIComponent(activeDraft.subject);
    const body = encodeURIComponent(
      `Hello ${activeDraft.recipientName},\n\n${activeDraft.bodyText.replace(/\{\{name\}\}/g, activeDraft.recipientName)}\n\n${activeDraft.ctaText}: ${activeDraft.ctaUrl}`,
    );
    window.open(`mailto:${recipient}?subject=${subject}&body=${body}`, "_blank");
  };

  // Create brand new draft
  const handleNewDraft = () => {
    const fresh = createDefaultDraft();
    setActiveDraft(fresh);
    setActiveTab("EDITOR");
  };

  // Load existing draft
  const handleSelectDraft = (draft: EmailDraft) => {
    setActiveDraft(draft);
    setActiveTab("EDITOR");
  };

  // Delete draft
  const handleDeleteDraft = (id: string) => {
    setDrafts((prev) => {
      const next = prev.filter((d) => d.id !== id);
      saveDraftsToStorage(next);
      return next;
    });
    if (activeDraft.id === id) {
      handleNewDraft();
    }
  };

  // Add photo to showcase
  const handleAddPhoto = (url: string) => {
    const trimmed = url.trim();
    if (!trimmed) return;
    setActiveDraft((prev) => ({
      ...prev,
      photoUrls: [...(prev.photoUrls || []), trimmed],
      showPhotoGrid: true,
    }));
    setNewPhotoInput("");
  };

  // Remove photo from showcase
  const handleRemovePhoto = (index: number) => {
    setActiveDraft((prev) => ({
      ...prev,
      photoUrls: (prev.photoUrls || []).filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col bg-zinc-950 text-zinc-100">
      {/* Top Action Header Bar */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-zinc-800 bg-zinc-900/90 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setActiveTab("EDITOR")}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
              activeTab === "EDITOR"
                ? "bg-[var(--accent)] text-white shadow-md"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            }`}
          >
            ✏️ Builder & Editor
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("PREVIEW")}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
              activeTab === "PREVIEW"
                ? "bg-[var(--accent)] text-white shadow-md"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            }`}
          >
            👁️ Live Preview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("DRAFTS")}
            className={`relative rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
              activeTab === "DRAFTS"
                ? "bg-[var(--accent)] text-white shadow-md"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            }`}
          >
            📁 Saved Drafts
            {drafts.length > 0 ? (
              <span className="ml-1.5 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-zinc-950 px-1.5 text-[10px] font-bold text-white">
                {drafts.length}
              </span>
            ) : null}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {savedToast ? (
            <span className="text-xs font-medium text-emerald-400">✓ Saved to drafts</span>
          ) : null}
          <button
            type="button"
            onClick={handleSaveDraft}
            className="rounded-xl border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-zinc-700"
          >
            💾 Save Draft
          </button>
          <button
            type="button"
            onClick={handleCopyHtml}
            className="rounded-xl bg-zinc-800 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-zinc-700"
          >
            {copied ? "✓ Copied HTML!" : "📋 Copy HTML Code"}
          </button>
          <button
            type="button"
            onClick={handleSendViaMailClient}
            className="rounded-xl bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-white shadow-lg transition hover:bg-[var(--accent-hover)]"
          >
            ✉️ Open in Mail Client
          </button>
        </div>
      </div>

      {/* Main Container Work Area */}
      {activeTab === "DRAFTS" ? (
        /* Saved Drafts List Workspace */
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Saved Email Drafts</h2>
                <p className="mt-1 text-xs text-zinc-400">
                  Manage your draft templates, customer replies, and outreach campaigns.
                </p>
              </div>
              <button
                type="button"
                onClick={handleNewDraft}
                className="rounded-xl bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[var(--accent-hover)]"
              >
                + Create New Blank Draft
              </button>
            </div>

            {drafts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-800 p-12 text-center">
                <p className="text-sm font-medium text-zinc-400">No saved drafts yet.</p>
                <p className="mt-1 text-xs text-zinc-500">
                  Use the builder to compose an email and click &quot;Save Draft&quot; to keep it here.
                </p>
                <button
                  type="button"
                  onClick={handleNewDraft}
                  className="mt-4 rounded-xl bg-zinc-800 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-700"
                >
                  Start Building Now
                </button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {drafts.map((d) => (
                  <div
                    key={d.id}
                    className={`flex flex-col justify-between rounded-2xl border p-5 transition ${
                      activeDraft.id === d.id
                        ? "border-[var(--accent)]/50 bg-zinc-900/90 shadow-lg"
                        : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="truncate text-base font-semibold text-white">
                          {d.title || "Untitled Draft"}
                        </h3>
                        <span className="shrink-0 text-[10px] text-zinc-500">
                          {new Date(d.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mt-1 text-xs font-medium text-[var(--accent)]">
                        To: {d.recipientName || "Valued Client"} {d.recipientEmail ? `(${d.recipientEmail})` : ""}
                      </p>
                      <p className="mt-2 line-clamp-1 text-xs text-zinc-300 font-medium">
                        Subj: {d.subject}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs text-zinc-400">
                        {d.bodyText}
                      </p>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-zinc-800/80 pt-3">
                      <button
                        type="button"
                        onClick={() => handleSelectDraft(d)}
                        className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-700"
                      >
                        Edit in Builder &rarr;
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteDraft(d.id)}
                        className="text-xs text-rose-400 hover:text-rose-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Split Dual-Pane Editor & Realtime Live Preview */
        <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-2">
          {/* Left Column: Form Controls & Template Builder */}
          <div
            className={`flex min-h-0 flex-col overflow-y-auto border-r border-zinc-800 p-5 ${
              activeTab === "PREVIEW" ? "hidden lg:flex" : "flex"
            }`}
          >
            <div className="space-y-6">
              {/* Preset Selector */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  ⚡ Quick Load Preset Template
                </label>
                <select
                  defaultValue=""
                  onChange={(e) => handleApplyPreset(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2 text-xs text-zinc-100 outline-none ring-[var(--accent)]/30 focus:border-[var(--accent)] focus:ring-2"
                >
                  <option value="" disabled>
                    -- Select a pre-built template preset --
                  </option>
                  {PRESET_TEMPLATES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1.5 text-[11px] text-zinc-500">
                  Pre-fills high-converting headlines, structure, and CTAs tailored for car photo clients.
                </p>
              </div>

              {/* Draft Info & Recipient Details */}
              <div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                  1. Recipient & General Info
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300">Draft Title (Internal)</label>
                    <input
                      type="text"
                      value={activeDraft.title}
                      onChange={(e) => setActiveDraft({ ...activeDraft, title: e.target.value })}
                      placeholder="e.g. Free Trial Follow-Up"
                      className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-white outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300">Recipient Name</label>
                    <input
                      type="text"
                      value={activeDraft.recipientName}
                      onChange={(e) => setActiveDraft({ ...activeDraft, recipientName: e.target.value })}
                      placeholder="e.g. John Dealership"
                      className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-white outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-zinc-300">Recipient Email Address</label>
                    <input
                      type="email"
                      value={activeDraft.recipientEmail}
                      onChange={(e) => setActiveDraft({ ...activeDraft, recipientEmail: e.target.value })}
                      placeholder="e.g. client@dealership.com"
                      className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-white outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-zinc-300">Email Subject Line</label>
                    <input
                      type="text"
                      value={activeDraft.subject}
                      onChange={(e) => setActiveDraft({ ...activeDraft, subject: e.target.value })}
                      placeholder="e.g. Your Car Retouching is Ready!"
                      className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-white outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                </div>
              </div>

              {/* Banner Selector */}
              <div className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                  2. Top Header Banner
                </h3>
                {heroBanners.length > 0 ? (
                  <div>
                    <label className="block text-xs font-medium text-zinc-300">Choose Website Hero Banner</label>
                    <select
                      value={activeDraft.bannerUrl}
                      onChange={(e) => setActiveDraft({ ...activeDraft, bannerUrl: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-white outline-none focus:border-[var(--accent)]"
                    >
                      <option value="">No Top Banner Image</option>
                      {heroBanners.map((url, i) => (
                        <option key={i} value={url}>
                          Hero Banner #{i + 1} ({url.slice(-30)})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}
                <div>
                  <label className="block text-xs font-medium text-zinc-300">Or Custom Banner Image URL</label>
                  <input
                    type="text"
                    value={activeDraft.bannerUrl}
                    onChange={(e) => setActiveDraft({ ...activeDraft, bannerUrl: e.target.value })}
                    placeholder="https://..."
                    className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-white outline-none focus:border-[var(--accent)]"
                  />
                </div>
              </div>

              {/* Email Content Body */}
              <div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                  3. Headline & Message Content
                </h3>
                <div>
                  <label className="block text-xs font-medium text-zinc-300">Main Headline</label>
                  <input
                    type="text"
                    value={activeDraft.headline}
                    onChange={(e) => setActiveDraft({ ...activeDraft, headline: e.target.value })}
                    placeholder="e.g. Your Car Photos Have Been Retouched!"
                    className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-white outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-medium text-zinc-300">Body Paragraphs</label>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveDraft((prev) => ({
                          ...prev,
                          bodyText: prev.bodyText + " {{name}}",
                        }))
                      }
                      className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-300 hover:bg-zinc-700"
                    >
                      + Insert {"{{name}}"}
                    </button>
                  </div>
                  <textarea
                    rows={8}
                    value={activeDraft.bodyText}
                    onChange={(e) => setActiveDraft({ ...activeDraft, bodyText: e.target.value })}
                    placeholder="Write message paragraphs..."
                    className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-xs leading-relaxed text-white outline-none focus:border-[var(--accent)]"
                  />
                </div>
              </div>

              {/* Photo Showcase Attachment Block */}
              <div className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                    4. Photo Showcase Block
                  </h3>
                  <label className="flex items-center gap-2 text-xs text-zinc-300">
                    <span>Show Photos</span>
                    <input
                      type="checkbox"
                      checked={activeDraft.showPhotoGrid}
                      onChange={(e) => setActiveDraft({ ...activeDraft, showPhotoGrid: e.target.checked })}
                      className="accent-[var(--accent)]"
                    />
                  </label>
                </div>

                {activeDraft.showPhotoGrid ? (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newPhotoInput}
                        onChange={(e) => setNewPhotoInput(e.target.value)}
                        placeholder="Paste image URL (Cloudinary / Website photo)"
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-white outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddPhoto(newPhotoInput)}
                        className="shrink-0 rounded-xl bg-zinc-800 px-3 py-2 text-xs font-semibold text-white hover:bg-zinc-700"
                      >
                        + Add Image
                      </button>
                    </div>

                    {portfolioImages.length > 0 ? (
                      <div>
                        <p className="text-[11px] text-zinc-400">Quick Pick from Website Portfolio:</p>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {portfolioImages.slice(0, 8).map((imgUrl, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => handleAddPhoto(imgUrl)}
                              className="group relative h-12 w-12 overflow-hidden rounded-lg border border-zinc-700 hover:border-[var(--accent)]"
                            >
                              <Image
                                src={imgUrl}
                                alt=""
                                fill
                                unoptimized
                                className="object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {activeDraft.photoUrls.length > 0 ? (
                      <div className="space-y-2">
                        {activeDraft.photoUrls.map((url, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between gap-2 rounded-xl border border-zinc-800 bg-zinc-950 p-2 text-xs text-zinc-300"
                          >
                            <span className="truncate">{url}</span>
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(idx)}
                              className="text-xs text-rose-400 hover:text-rose-300"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>

              {/* Call-To-Action Button Block */}
              <div className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                  5. Action Button (CTA)
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300">Button Text</label>
                    <input
                      type="text"
                      value={activeDraft.ctaText}
                      onChange={(e) => setActiveDraft({ ...activeDraft, ctaText: e.target.value })}
                      placeholder="e.g. View Your Retouched Photos"
                      className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-white outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300">Button Destination URL</label>
                    <input
                      type="text"
                      value={activeDraft.ctaUrl}
                      onChange={(e) => setActiveDraft({ ...activeDraft, ctaUrl: e.target.value })}
                      placeholder="https://careditingstudio.com/portfolio"
                      className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-white outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                </div>
              </div>

              {/* Social Links & Footer Toggles */}
              <div className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                  6. Footer & Social Links
                </h3>
                <div className="flex flex-wrap gap-4 text-xs text-zinc-300">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={activeDraft.showSocialLinks}
                      onChange={(e) => setActiveDraft({ ...activeDraft, showSocialLinks: e.target.checked })}
                      className="accent-[var(--accent)]"
                    />
                    <span>Auto-include Social Media Icons (from website config)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={activeDraft.showContactFooter}
                      onChange={(e) => setActiveDraft({ ...activeDraft, showContactFooter: e.target.checked })}
                      className="accent-[var(--accent)]"
                    />
                    <span>Include Brand Contact Footer (Email, Phone/WhatsApp, Domain)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Real-Time Live Preview */}
          <div
            className={`flex min-h-0 flex-col bg-zinc-950 p-4 sm:p-6 ${
              activeTab === "EDITOR" ? "hidden lg:flex" : "flex"
            }`}
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Live HTML Email Preview
              </span>
              <div className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 p-1">
                <button
                  type="button"
                  onClick={() => setPreviewDevice("DESKTOP")}
                  className={`rounded px-2.5 py-1 text-[11px] font-semibold transition ${
                    previewDevice === "DESKTOP"
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  💻 Desktop (600px)
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("MOBILE")}
                  className={`rounded px-2.5 py-1 text-[11px] font-semibold transition ${
                    previewDevice === "MOBILE"
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  📱 Mobile (360px)
                </button>
              </div>
            </div>

            {/* Preview Frame Container */}
            <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4">
              <iframe
                srcDoc={generatedHtml}
                title="Email Preview"
                className={`h-full border-0 transition-all duration-300 ${
                  previewDevice === "MOBILE" ? "w-[360px] rounded-3xl shadow-2xl" : "w-full max-w-[620px]"
                }`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
