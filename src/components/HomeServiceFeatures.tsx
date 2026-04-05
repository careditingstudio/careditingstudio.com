import type { ReactNode } from "react";
import Link from "next/link";
import { display, sans } from "@/app/fonts";

function IconCard({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

const CARDS = [
  {
    title: "Easy Payment System",
    description:
      "Our payment system is secure and hassle free. Payment can be completed via PayPal or bank account/check (for US).",
    icon: (
      <IconCard>
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
      </IconCard>
    ),
  },
  {
    title: "Secure File Transfer",
    description:
      "We use secure FTP, WeTransfer, Dropbox so you can send up to 500 GB file safely.",
    icon: (
      <IconCard>
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </IconCard>
    ),
  },
  {
    title: "Discount",
    description:
      "We offer amazing discount offers for large quantity of images. Sample trial available.",
    icon: (
      <IconCard>
        <path d="M19 5L5 19" />
        <circle cx="6.5" cy="6.5" r="2.5" />
        <circle cx="17.5" cy="17.5" r="2.5" />
      </IconCard>
    ),
  },
  {
    title: "Rush Service",
    description:
      "Urgent work? No problem. We provide express service on request to meet your deadlines.",
    icon: (
      <IconCard>
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </IconCard>
    ),
  },
] as const;

export function HomeServiceFeatures() {
  return (
    <section
      className="relative z-20 bg-zinc-100 px-5 pb-20 pt-12 dark:bg-zinc-900 sm:px-8 sm:pb-24 sm:pt-14"
      aria-labelledby="home-service-features-heading"
    >
      <div className="mx-auto max-w-6xl">
        <h2
          id="home-service-features-heading"
          className={`${display.className} text-balance text-center text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl md:text-[2rem] md:leading-tight`}
        >
          Our Services Features
        </h2>

        <ul className="mt-10 grid list-none gap-4 sm:grid-cols-2 sm:gap-5 lg:mt-12 lg:grid-cols-4 lg:gap-6">
          {CARDS.map(({ title, description, icon }) => (
            <li key={title}>
              <article className="group flex h-full flex-col rounded-2xl bg-[var(--background)] p-6 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition duration-300 ease-out sm:p-7 dark:shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent-subtle)] text-[var(--accent)] transition duration-300 group-hover:scale-[1.03]">
                  {icon}
                </div>
                <h3
                  className={`${display.className} text-lg font-semibold text-[var(--foreground)] sm:text-xl`}
                >
                  {title}
                </h3>
                <p
                  className={`${sans.className} mt-3 flex-1 text-sm leading-relaxed text-[var(--muted)] sm:text-[0.9375rem]`}
                >
                  {description}
                </p>
              </article>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex justify-center sm:mt-14">
          <Link
            href="/services"
            className={`${sans.className} group inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-[var(--accent-hover)] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]`}
          >
            See more
            <span
              aria-hidden
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
