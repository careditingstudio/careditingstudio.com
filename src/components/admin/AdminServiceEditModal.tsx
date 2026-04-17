"use client";

import type { ServicePageContent, ServiceRow } from "@/lib/cms-types";
import { useEffect, useId, useMemo, useState } from "react";

type EditableKey =
  | "name"
  | "slug"
  | "pageTitle"
  | "pageDescription"
  | "introTitle"
  | "introBody"
  | "portfolioTitle";

type Props = {
  open: boolean;
  onClose: () => void;
  service: ServiceRow;
  page: ServicePageContent | null;
  serviceIndex: number;
  portfolioLabels: string[];
  onSetServiceName: (name: string) => void;
  onSetPage: (patch: Partial<Omit<ServicePageContent, "serviceId">>) => void;
  onDelete: () => void;
};

function FieldRow({
  label,
  value,
  editing,
  onStartEdit,
  onCancel,
  onSave,
  multiline = false,
}: {
  label: string;
  value: string;
  editing: boolean;
  onStartEdit: () => void;
  onCancel: () => void;
  onSave: (next: string) => void;
  multiline?: boolean;
}) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value, editing]);

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-3">
      <div className="mb-1 flex items-center justify-between gap-2">
        <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
          {label}
        </p>
        {!editing ? (
          <button
            type="button"
            onClick={onStartEdit}
            className="rounded border border-zinc-700 px-2 py-0.5 text-[10px] text-zinc-300 hover:bg-zinc-800"
          >
            Edit
          </button>
        ) : null}
      </div>

      {!editing ? (
        <p className="whitespace-pre-wrap break-words text-sm text-zinc-200">
          {value.trim() || "—"}
        </p>
      ) : (
        <div className="space-y-2">
          {multiline ? (
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={4}
              className="w-full resize-y rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30"
            />
          ) : (
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30"
            />
          )}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSave(draft)}
              className="rounded bg-[var(--accent)] px-2.5 py-1 text-[11px] font-medium text-black hover:opacity-90"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="rounded border border-zinc-700 px-2.5 py-1 text-[11px] text-zinc-300 hover:bg-zinc-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminServiceEditModal({
  open,
  onClose,
  service,
  page,
  serviceIndex,
  portfolioLabels,
  onSetServiceName,
  onSetPage,
  onDelete,
}: Props) {
  const titleId = useId();
  const [editingKey, setEditingKey] = useState<EditableKey | null>(null);

  const selectedSet = useMemo(
    () => new Set(page?.selectedPortfolioIndices ?? []),
    [page],
  );

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setEditingKey(null);
  }, [open, service.id]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !page) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-zinc-700/90 bg-zinc-950 shadow-2xl">
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-zinc-800 px-5 py-4">
          <h2 id={titleId} className="text-base font-semibold text-white">
            Service {serviceIndex + 1}: {service.name.trim() || "Untitled service"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            Close
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-4">
          <section className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Service Basics
            </h3>
            <FieldRow
              label="Service name"
              value={service.name}
              editing={editingKey === "name"}
              onStartEdit={() => setEditingKey("name")}
              onCancel={() => setEditingKey(null)}
              onSave={(next) => {
                onSetServiceName(next);
                setEditingKey(null);
              }}
            />
            <FieldRow
              label="URL slug"
              value={page.slug}
              editing={editingKey === "slug"}
              onStartEdit={() => setEditingKey("slug")}
              onCancel={() => setEditingKey(null)}
              onSave={(next) => {
                onSetPage({ slug: next });
                setEditingKey(null);
              }}
            />
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Page Content
            </h3>
            <FieldRow
              label="Page title"
              value={page.pageTitle}
              editing={editingKey === "pageTitle"}
              onStartEdit={() => setEditingKey("pageTitle")}
              onCancel={() => setEditingKey(null)}
              onSave={(next) => {
                onSetPage({ pageTitle: next });
                setEditingKey(null);
              }}
            />
            <FieldRow
              label="Page description"
              value={page.pageDescription}
              editing={editingKey === "pageDescription"}
              onStartEdit={() => setEditingKey("pageDescription")}
              onCancel={() => setEditingKey(null)}
              onSave={(next) => {
                onSetPage({ pageDescription: next });
                setEditingKey(null);
              }}
              multiline
            />
            <FieldRow
              label="Intro title"
              value={page.introTitle}
              editing={editingKey === "introTitle"}
              onStartEdit={() => setEditingKey("introTitle")}
              onCancel={() => setEditingKey(null)}
              onSave={(next) => {
                onSetPage({ introTitle: next });
                setEditingKey(null);
              }}
            />
            <FieldRow
              label="Intro body"
              value={page.introBody}
              editing={editingKey === "introBody"}
              onStartEdit={() => setEditingKey("introBody")}
              onCancel={() => setEditingKey(null)}
              onSave={(next) => {
                onSetPage({ introBody: next });
                setEditingKey(null);
              }}
              multiline
            />
            <FieldRow
              label="Portfolio section title"
              value={page.portfolioTitle}
              editing={editingKey === "portfolioTitle"}
              onStartEdit={() => setEditingKey("portfolioTitle")}
              onCancel={() => setEditingKey(null)}
              onSave={(next) => {
                onSetPage({ portfolioTitle: next });
                setEditingKey(null);
              }}
            />
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Portfolio Options
            </h3>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-3">
              <p className="mb-2 text-xs text-zinc-400">
                Use checkboxes to choose portfolio items for this service page.
              </p>
              {portfolioLabels.length === 0 ? (
                <p className="text-sm text-zinc-500">
                  No portfolio items yet. Add them from the Portfolio editor.
                </p>
              ) : (
                <div className="grid gap-1.5 sm:grid-cols-2">
                  {portfolioLabels.map((label, idx) => {
                    const checked = selectedSet.has(idx);
                    return (
                      <label
                        key={`svc-${service.id}-pf-${idx}`}
                        className="flex items-center gap-2 rounded border border-zinc-800 px-2 py-1.5 text-[11px] text-zinc-300"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            const next = e.target.checked
                              ? [...(page.selectedPortfolioIndices ?? []), idx]
                              : (page.selectedPortfolioIndices ?? []).filter(
                                  (x) => x !== idx,
                                );
                            onSetPage({ selectedPortfolioIndices: next });
                          }}
                        />
                        <span className="truncate">{label}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-zinc-800 px-5 py-3">
          <button
            type="button"
            onClick={onDelete}
            className="text-xs text-red-400 hover:underline"
          >
            Remove service
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-zinc-800 px-4 py-2 text-sm text-white hover:bg-zinc-700"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
