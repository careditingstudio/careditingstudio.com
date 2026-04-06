"use client";

type Props = {
  title: string;
};

export function AdminPagePlaceholder({ title }: Props) {
  return (
    <div className="mx-auto max-w-2xl">
      <header className="border-b border-zinc-800 pb-8">
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
      </header>
    </div>
  );
}
