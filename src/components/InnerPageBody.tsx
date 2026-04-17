export function InnerPageBody({
  children,
  contentClassName = "max-w-3xl text-base leading-relaxed text-[var(--muted)]",
}: {
  children: React.ReactNode;
  contentClassName?: string;
}) {
  return (
    <div className="mx-auto max-w-[88rem] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className={contentClassName}>
        {children}
      </div>
    </div>
  );
}
