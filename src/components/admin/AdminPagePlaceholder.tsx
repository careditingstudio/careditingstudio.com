"use client";

type Props = {
  title: string;
  publicPath: string;
  description?: string;
};

export function AdminPagePlaceholder({
  title,
  publicPath,
  description = "Editors for this page will go here next (text, images, SEO). Use Home for hero, floating car, and before/after.",
}: Props) {
  return (
    <div className="mx-auto max-w-2xl">
      <header className="border-b border-zinc-800 pb-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Public page
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-white">{title}</h1>
        <p className="mt-2 font-mono text-sm text-[var(--accent)]">{publicPath}</p>
        <p className="mt-4 text-sm leading-relaxed text-zinc-400">{description}</p>
      </header>
      <div className="mt-10 rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/30 p-8 text-center text-sm text-zinc-500">
        No extra fields for this page yet — tell us what you want to control here.
      </div>
    </div>
  );
}
