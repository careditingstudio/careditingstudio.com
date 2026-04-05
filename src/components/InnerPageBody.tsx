export function InnerPageBody({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="max-w-3xl text-base leading-relaxed text-[var(--muted)]">
        {children}
      </div>
    </div>
  );
}
