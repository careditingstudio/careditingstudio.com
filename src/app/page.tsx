import { display } from "./fonts";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24">
        <div className="max-w-lg text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
            careditingstudio.com
          </p>
          <h1
            className={`${display.className} text-4xl font-semibold tracking-tight text-[var(--foreground)] sm:text-5xl`}
          >
            Car Editing Studio
          </h1>
          <p className="mt-6 text-base leading-relaxed text-[var(--muted)]">
            Automotive retouching, composites, and graphics — built for brands,
            dealers, and creators who care how cars look on screen.
          </p>
          <div className="mt-10 h-px w-12 bg-[var(--line)] mx-auto" aria-hidden />
          <p className="mt-10 text-sm text-[var(--muted)]">
            <a
              href="mailto:info@careditingstudio.com"
              className="text-[var(--foreground)] underline decoration-[var(--line)] underline-offset-4 transition hover:decoration-[var(--muted)]"
            >
              info@careditingstudio.com
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
