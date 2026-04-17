import { display } from "@/app/fonts";

export function PageHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <header className="border-b border-[var(--line)] bg-[var(--background)]">
      <div className="mx-auto max-w-[88rem] px-4 py-14 sm:px-6 sm:py-16 md:py-20 lg:px-8">
        <div className="max-w-4xl">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--muted-2)]">
            Car Editing Studio
          </p>
          <h1
            className={`${display.className} text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl md:text-[2.5rem] md:leading-tight`}
          >
            {title}
          </h1>
          {description ? (
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--muted)] md:text-lg">
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </header>
  );
}
