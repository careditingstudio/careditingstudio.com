"use client";

import { AdminServiceBlocksModal } from "@/components/admin/AdminServiceBlocksModal";
import { MediaLibraryModal } from "@/components/admin/MediaLibraryModal";
import {
  isUploadedAsset,
  makeServiceMockBlocksPreset,
  type ServicePageBlock,
  type ServicePageContent,
  type ServicePageFaqSection,
  type ServiceRow,
} from "@/lib/cms-types";
import Image from "next/image";
import { useEffect, useId, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  service: ServiceRow;
  page: ServicePageContent | null;
  serviceIndex: number;
  portfolioGridLength: number;
  onSetServiceName: (name: string) => void;
  onSetPage: (patch: Partial<Omit<ServicePageContent, "serviceId">>) => void;
  onDelete: () => void;
};

const inputCls =
  "w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30";

const labelCls =
  "text-[11px] font-semibold uppercase tracking-wide text-zinc-500";

function SectionCard({
  step,
  title,
  description,
  children,
}: {
  step: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/50">
      <header className="flex items-center justify-between gap-3 border-b border-zinc-800 px-4 py-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            {step}
          </p>
          <h3 className="mt-0.5 text-sm font-semibold text-white">{title}</h3>
          {description ? (
            <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">
              {description}
            </p>
          ) : null}
        </div>
      </header>
      <div className="space-y-3 px-4 py-4">{children}</div>
    </section>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1.5 ${inputCls}`}
      />
      {hint ? <p className="mt-1 text-[11px] text-zinc-500">{hint}</p> : null}
    </div>
  );
}

function TextareaField({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  rows?: number;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1.5 resize-y ${inputCls}`}
      />
      {hint ? <p className="mt-1 text-[11px] text-zinc-500">{hint}</p> : null}
    </div>
  );
}

function PortfolioPicker({
  totalCount,
  selected,
  onChange,
}: {
  totalCount: number;
  selected: number[];
  onChange: (next: number[]) => void;
}) {
  if (totalCount === 0) {
    return (
      <p className="rounded-lg border border-dashed border-zinc-700 px-3 py-4 text-center text-[11px] text-zinc-500">
        Add portfolio rows in the Portfolio admin first, then come back to
        choose which one to feature on this service page.
      </p>
    );
  }
  return (
    <div>
      <p className="mb-2 text-[11px] text-zinc-500">
        Click to select / deselect. The first chosen item shows next to the
        portfolio section title on the page.
      </p>
      <div className="grid max-h-44 grid-cols-6 gap-1.5 overflow-y-auto pr-1 sm:grid-cols-8 lg:grid-cols-10">
        {Array.from({ length: totalCount }, (_, i) => {
          const isSelected = selected.includes(i);
          const order = isSelected ? selected.indexOf(i) + 1 : null;
          return (
            <button
              key={i}
              type="button"
              onClick={() => {
                if (isSelected) {
                  onChange(selected.filter((x) => x !== i));
                } else {
                  onChange([...selected, i]);
                }
              }}
              className={`relative h-9 rounded-md border text-[11px] font-medium transition ${
                isSelected
                  ? "border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--accent)]"
                  : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500"
              }`}
            >
              #{i + 1}
              {order !== null ? (
                <span className="absolute right-0.5 top-0.5 rounded-sm bg-[var(--accent)]/30 px-1 text-[9px] font-bold text-white">
                  {order}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FaqEditor({
  value,
  onChange,
}: {
  value: ServicePageFaqSection;
  onChange: (next: ServicePageFaqSection) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <TextField
          label="Eyebrow (optional)"
          value={value.eyebrow}
          onChange={(eyebrow) => onChange({ ...value, eyebrow })}
          placeholder="e.g. Common questions"
        />
        <div>
          <label className={labelCls}>Columns</label>
          <select
            value={value.columns}
            onChange={(e) =>
              onChange({
                ...value,
                columns: e.target.value === "1" ? 1 : 2,
              })
            }
            className={`mt-1.5 ${inputCls}`}
          >
            <option value="2">2 columns</option>
            <option value="1">1 column</option>
          </select>
        </div>
      </div>
      <TextField
        label="Section title"
        value={value.title}
        onChange={(title) => onChange({ ...value, title })}
        placeholder="Frequently asked questions"
      />
      <TextareaField
        label="Subtitle (optional)"
        value={value.subtitle}
        onChange={(subtitle) => onChange({ ...value, subtitle })}
        rows={2}
      />

      <div className="space-y-2">
        <p className={labelCls}>Questions</p>
        {value.items.map((item, idx) => (
          <div
            key={idx}
            className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                FAQ {idx + 1}
              </p>
              <button
                type="button"
                className="text-[11px] text-red-400 hover:underline"
                onClick={() =>
                  onChange({
                    ...value,
                    items: value.items.filter((_, j) => j !== idx),
                  })
                }
              >
                Remove
              </button>
            </div>
            <input
              type="text"
              value={item.question}
              placeholder="Question"
              onChange={(e) => {
                const next = [...value.items];
                next[idx] = { ...next[idx]!, question: e.target.value };
                onChange({ ...value, items: next });
              }}
              className={inputCls}
            />
            <textarea
              value={item.answer}
              placeholder="Answer"
              rows={3}
              onChange={(e) => {
                const next = [...value.items];
                next[idx] = { ...next[idx]!, answer: e.target.value };
                onChange({ ...value, items: next });
              }}
              className={`mt-2 resize-y ${inputCls}`}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            onChange({
              ...value,
              items: [...value.items, { question: "", answer: "" }],
            })
          }
          className="rounded-lg border border-zinc-600 px-3 py-1.5 text-xs text-zinc-200 hover:bg-zinc-800"
        >
          + Add question
        </button>
      </div>
    </div>
  );
}

export function AdminServiceEditModal({
  open,
  onClose,
  service,
  page,
  serviceIndex,
  portfolioGridLength,
  onSetServiceName,
  onSetPage,
  onDelete,
}: Props) {
  const titleId = useId();
  const [mediaOpen, setMediaOpen] = useState(false);
  const [blocksOpen, setBlocksOpen] = useState(false);
  const [flash, setFlash] = useState<{ type: "ok" | "err"; text: string } | null>(
    null,
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
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !mediaOpen && !blocksOpen) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, mediaOpen, blocksOpen]);

  if (!open || !page) return null;

  const blocks = page.blocks ?? [];

  return (
    <>
      <MediaLibraryModal
        open={mediaOpen}
        onClose={() => setMediaOpen(false)}
        onPick={(url) => {
          onSetPage({ heroBannerSrc: url });
          setMediaOpen(false);
          setFlash({ type: "ok", text: "Banner image updated." });
          setTimeout(() => setFlash(null), 2000);
        }}
        title="Choose hero banner"
      />

      <AdminServiceBlocksModal
        open={blocksOpen}
        onClose={() => setBlocksOpen(false)}
        serviceName={service.name}
        blocks={blocks}
        onChangeBlocks={(next) => onSetPage({ blocks: next })}
        setFlash={setFlash}
      />

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
        <div className="relative flex max-h-[96vh] w-[96vw] max-w-5xl flex-col overflow-hidden rounded-2xl border border-zinc-700/90 bg-zinc-950 shadow-2xl">
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-zinc-800 px-5 py-4">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Service {serviceIndex + 1}
              </p>
              <h2
                id={titleId}
                className="mt-0.5 truncate text-base font-semibold text-white"
              >
                {service.name.trim() || "Untitled service"}
              </h2>
              <p className="mt-0.5 truncate text-[11px] text-zinc-500">
                /services/{page.slug || "service"}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-2 py-1 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white"
            >
              Close
            </button>
          </div>

          {flash ? (
            <div
              className={`shrink-0 border-b px-5 py-2 text-xs ${
                flash.type === "ok"
                  ? "border-emerald-700/40 bg-emerald-900/20 text-emerald-300"
                  : "border-red-700/40 bg-red-900/20 text-red-300"
              }`}
            >
              {flash.text}
            </div>
          ) : null}

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5">
            <SectionCard
              step="Step 1"
              title="Service identity"
              description="Service name shows up in menus; the URL slug controls the public link."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <TextField
                  label="Service name"
                  value={service.name}
                  onChange={(name) => onSetServiceName(name)}
                  placeholder="e.g. Background removal"
                />
                <TextField
                  label="URL slug"
                  value={page.slug}
                  onChange={(slug) => onSetPage({ slug })}
                  placeholder="background-removal"
                  hint="Lowercase letters, numbers and dashes only."
                />
              </div>
            </SectionCard>

            <SectionCard
              step="Step 2"
              title="Hero banner"
              description="The full-width banner at the top of the service page — title, subtitle, and background image are all overlaid here."
            >
              <TextField
                label="Page title (banner headline)"
                value={page.pageTitle}
                onChange={(pageTitle) => onSetPage({ pageTitle })}
                placeholder="e.g. Car background removal"
                hint="Falls back to the service name if empty."
              />
              <TextareaField
                label="Page description (banner subtitle)"
                value={page.pageDescription}
                onChange={(pageDescription) => onSetPage({ pageDescription })}
                rows={3}
                placeholder="One or two sentences describing the service. Shown on the banner and used for SEO."
              />

              <div>
                <label className={labelCls}>Hero banner image</label>
                <div className="mt-1.5 flex flex-col gap-3 sm:flex-row sm:items-start">
                  <div className="relative h-28 w-full overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 sm:w-48 sm:shrink-0">
                    {page.heroBannerSrc ? (
                      <Image
                        src={page.heroBannerSrc}
                        alt="Hero banner preview"
                        fill
                        className="object-cover"
                        sizes="200px"
                        unoptimized={isUploadedAsset(page.heroBannerSrc)}
                      />
                    ) : (
                      <div className="grid h-full place-items-center text-center text-[11px] text-zinc-500">
                        No image yet
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <input
                      type="text"
                      value={page.heroBannerSrc}
                      onChange={(e) =>
                        onSetPage({ heroBannerSrc: e.target.value })
                      }
                      placeholder="Paste an image URL or upload one"
                      className={`font-mono text-xs ${inputCls}`}
                    />
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setMediaOpen(true)}
                        className="rounded-lg border border-[var(--accent)]/35 bg-[var(--accent)]/10 px-3 py-1.5 text-xs font-medium text-[var(--accent)] hover:bg-[var(--accent)]/20"
                      >
                        Choose / upload image
                      </button>
                      {page.heroBannerSrc ? (
                        <button
                          type="button"
                          onClick={() => onSetPage({ heroBannerSrc: "" })}
                          className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800"
                        >
                          Clear image
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              step="Step 3"
              title="Page sections (blocks)"
              description="Open the page builder to add, reorder, edit and remove every section that appears below the banner."
            >
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-white">
                    {blocks.length === 0
                      ? "No blocks yet — page is empty"
                      : `${blocks.length} block${blocks.length === 1 ? "" : "s"} configured`}
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    Includes feature cards, portfolio, articles, split columns,
                    media spotlight, FAQ and more.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {blocks.length === 0 ? (
                    <button
                      type="button"
                      onClick={() => {
                        onSetPage({
                          blocks: makeServiceMockBlocksPreset(service.name),
                        });
                        setFlash({
                          type: "ok",
                          text: "Default template loaded — open the page builder to tweak the copy.",
                        });
                        setTimeout(() => setFlash(null), 2500);
                      }}
                      className="rounded-lg border border-[var(--accent)]/35 bg-[var(--accent)]/10 px-3 py-1.5 text-xs font-medium text-[var(--accent)] hover:bg-[var(--accent)]/20"
                    >
                      Load default template
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setBlocksOpen(true)}
                    className="rounded-lg bg-[var(--accent)] px-4 py-1.5 text-xs font-semibold text-black hover:opacity-90"
                  >
                    {blocks.length === 0 ? "Open page builder" : "Manage blocks"}
                  </button>
                </div>
              </div>

              {blocks.length > 0 ? (
                <ul className="grid gap-1.5 sm:grid-cols-2">
                  {blocks.map((b, i) => (
                    <li
                      key={b.id}
                      className="flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900/30 px-3 py-2 text-[11px] text-zinc-400"
                    >
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded bg-zinc-800 text-[10px] font-bold text-zinc-300">
                        {i + 1}
                      </span>
                      <span className="truncate font-medium text-zinc-200 capitalize">
                        {b.type.replace(/([A-Z])/g, " $1")}
                      </span>
                      <span className="ml-auto truncate text-[10px] text-zinc-500">
                        {summarizeBlock(b)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </SectionCard>

            <SectionCard
              step="Step 4"
              title="Featured portfolio"
              description="Pick one or more portfolio tiles to feature inside the page. The first picked tile is shown next to the portfolio section."
            >
              <TextField
                label="Portfolio section title (override)"
                value={page.portfolioTitle}
                onChange={(portfolioTitle) => onSetPage({ portfolioTitle })}
                placeholder="Leave empty to use the default title."
              />
              <PortfolioPicker
                totalCount={portfolioGridLength}
                selected={page.selectedPortfolioIndices ?? []}
                onChange={(selectedPortfolioIndices) =>
                  onSetPage({ selectedPortfolioIndices })
                }
              />
            </SectionCard>

            <SectionCard
              step="Step 5"
              title="FAQ section"
              description="Service-specific frequently asked questions, shown at the bottom of the page."
            >
              <FaqEditor
                value={page.faqSection}
                onChange={(faqSection) => onSetPage({ faqSection })}
              />
            </SectionCard>
          </div>

          <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-zinc-800 px-5 py-3">
            <button
              type="button"
              onClick={() => {
                if (
                  window.confirm(
                    `Remove "${service.name.trim() || "this service"}" and its page?`,
                  )
                ) {
                  onDelete();
                }
              }}
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
    </>
  );
}

function summarizeBlock(b: ServicePageBlock): string {
  switch (b.type) {
    case "heading":
      return b.text.slice(0, 40);
    case "paragraph":
      return b.text.slice(0, 40);
    case "image":
      return b.alt || (b.src ? "Image" : "No image");
    case "portfolio":
      return b.sideTitle?.slice(0, 40) ?? "Featured work";
    case "faq":
      return "FAQ";
    case "spacer":
      return `${b.size ?? "md"} spacer`;
    case "featureCards":
      return b.sectionTitle.slice(0, 40);
    case "splitShowcase":
      return (b.title ?? "").slice(0, 40);
    case "pillChecklist":
      return b.title.slice(0, 40);
    case "tickChecklist":
      return b.title.slice(0, 40);
    case "valueColumns":
      return b.title.slice(0, 40);
    case "supportCards":
      return b.title.slice(0, 40);
    case "iconGrid":
      return b.title.slice(0, 40);
    case "compactFeatureCards":
      return b.title.slice(0, 40);
    case "splitPillColumns":
      return `${b.titleLeft || "Left"} · ${b.titleRight || "Right"}`.slice(
        0,
        40,
      );
    case "contentWide":
      return (b.title ?? b.body).slice(0, 40);
    case "whyChooseQuad":
      return b.sectionTitle.slice(0, 40);
    case "serviceArticle":
      return b.leadTitle.slice(0, 40);
    case "mediaSpotlight":
      return b.title.slice(0, 40);
    case "pageOutro":
      return b.title.slice(0, 40);
    default:
      return "";
  }
}
