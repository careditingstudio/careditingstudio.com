"use client";

import { display, sans } from "@/app/fonts";
import { useChromeScrollLock } from "@/components/ChromeScrollLockContext";
import { useHomeChromeSolid } from "@/components/HomeChromeProvider";
import { ServicesMegaMenuGrid } from "@/components/ServicesMegaMenu";
import { navItems } from "@/config/site";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

type NavVariant = "overlay" | "solid";

function NavLink({
  href,
  label,
  active,
  variant,
  onNavigate,
}: {
  href: string;
  label: string;
  active: boolean;
  variant: NavVariant;
  onNavigate?: () => void;
}) {
  if (variant === "overlay") {
    return (
      <Link
        href={href}
        onClick={onNavigate}
        className={[
          "rounded-md px-2.5 py-1.5 text-[12px] font-medium leading-tight tracking-tight transition-colors sm:text-[13px]",
          active
            ? "text-white underline decoration-[var(--accent)] decoration-2 underline-offset-[8px]"
            : "text-white/75 hover:text-white",
        ].join(" ")}
      >
        {label}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={[
        "rounded-md px-2.5 py-1.5 text-[12px] font-medium leading-tight tracking-tight transition-colors sm:text-[13px]",
        active
          ? "bg-[var(--accent-subtle)] text-[var(--foreground)]"
          : "text-[var(--muted)] hover:bg-black/[0.04] hover:text-[var(--foreground)] dark:hover:bg-white/[0.06]",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

function IconChevronDown({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function IconMenu({ open, className }: { open: boolean; className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      {open ? (
        <>
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </>
      ) : (
        <>
          <path d="M4 6h16" />
          <path d="M4 12h16" />
          <path d="M4 18h16" />
        </>
      )}
    </svg>
  );
}

type SiteHeaderProps = {
  brandName?: string;
};

export function SiteHeader({ brandName = "Car Editing Studio" }: SiteHeaderProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const chromeSolid = useHomeChromeSolid();
  const { lockChromeHide, unlockChromeHide } = useChromeScrollLock();

  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesHover, setServicesHover] = useState(false);
  const [servicesMobileOpen, setServicesMobileOpen] = useState(false);

  const hoverCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const overlayNav = isHome && !chromeSolid;
  const navVariant: NavVariant = overlayNav ? "overlay" : "solid";

  const clearHoverTimer = useCallback(() => {
    if (hoverCloseTimer.current) {
      clearTimeout(hoverCloseTimer.current);
      hoverCloseTimer.current = null;
    }
  }, []);

  const openServicesHover = useCallback(() => {
    clearHoverTimer();
    setServicesHover(true);
  }, [clearHoverTimer]);

  const scheduleCloseServicesHover = useCallback(() => {
    clearHoverTimer();
    hoverCloseTimer.current = setTimeout(() => {
      setServicesHover(false);
    }, 160);
  }, [clearHoverTimer]);

  useEffect(() => {
    setMenuOpen(false);
    setServicesHover(false);
    setServicesMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) {
      setServicesMobileOpen(false);
    }
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    lockChromeHide();
    return () => unlockChromeHide();
  }, [menuOpen, lockChromeHide, unlockChromeHide]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    return () => clearHoverTimer();
  }, [clearHoverTimer]);

  const servicesActive =
    pathname === "/services" || pathname.startsWith("/services/");

  const servicesTriggerClasses = (hovering: boolean) =>
    [
      "inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[12px] font-medium leading-tight tracking-tight transition-colors sm:text-[13px]",
      navVariant === "overlay"
        ? [
            servicesActive || hovering
              ? "text-white underline decoration-[var(--accent)] decoration-2 underline-offset-[8px]"
              : "text-white/75 hover:text-white",
          ].join(" ")
        : [
            servicesActive || hovering
              ? "bg-[var(--accent-subtle)] text-[var(--foreground)]"
              : "text-[var(--muted)] hover:bg-black/[0.04] hover:text-[var(--foreground)] dark:hover:bg-white/[0.06]",
          ].join(" "),
    ].join(" ");

  return (
    <header
      className={[
        "relative z-0 w-full transition-[background-color,backdrop-filter,border-color,box-shadow] duration-300",
        overlayNav
          ? "border-b-0 !border-transparent !bg-transparent shadow-none [backdrop-filter:none] [-webkit-backdrop-filter:none]"
          : "border-b border-[var(--line)] bg-[var(--header-bg)] shadow-sm backdrop-blur-xl backdrop-saturate-150",
      ].join(" ")}
      role="banner"
    >
      <div className="mx-auto flex h-[var(--header-h)] max-w-7xl items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6">
        <Link
          href="/"
          className={[
            `${display.className} shrink-0 text-base font-semibold leading-none tracking-tight transition-colors sm:text-[1.05rem]`,
            overlayNav ? "text-white" : "text-[var(--foreground)]",
          ].join(" ")}
        >
          <span className="whitespace-nowrap">{brandName}</span>
        </Link>

        <nav
          className="hidden min-w-0 items-center gap-0 lg:flex"
          aria-label="Main"
        >
          {navItems.map(({ href, label }) => {
            if (href === "/services") {
              return (
                <div
                  key={href}
                  className="relative"
                  onMouseEnter={openServicesHover}
                  onMouseLeave={scheduleCloseServicesHover}
                >
                  <Link
                    href="/services"
                    className={servicesTriggerClasses(servicesHover)}
                    aria-expanded={servicesHover}
                    aria-haspopup="true"
                  >
                    {label}
                    <IconChevronDown
                      className={[
                        "opacity-80 transition-transform duration-200",
                        servicesHover ? "rotate-180" : "",
                      ].join(" ")}
                    />
                  </Link>
                  {servicesHover ? (
                    <div
                      className="absolute left-1/2 top-full z-[80] w-[min(calc(100vw-2rem),56rem)] -translate-x-1/2 pt-3"
                      onMouseEnter={openServicesHover}
                      onMouseLeave={scheduleCloseServicesHover}
                    >
                      <div
                        className="max-h-[min(70vh,640px)] overflow-y-auto rounded-2xl bg-white p-5 shadow-xl ring-1 ring-zinc-900/[0.07] dark:bg-zinc-900 dark:ring-white/10 sm:p-6"
                      >
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                          <p
                            className={`${display.className} text-base font-semibold text-zinc-900 dark:text-zinc-50`}
                          >
                            Services
                          </p>
                          <Link
                            href="/services"
                            className={`${sans.className} text-sm font-semibold text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]`}
                            onClick={() => {
                              setServicesHover(false);
                              clearHoverTimer();
                            }}
                          >
                            View all services
                          </Link>
                        </div>
                        <ServicesMegaMenuGrid
                          dense
                          onNavigate={() => {
                            setServicesHover(false);
                            clearHoverTimer();
                          }}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            }

            const active =
              href === "/"
                ? pathname === "/"
                : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <NavLink
                key={href}
                href={href}
                label={label}
                active={active}
                variant={navVariant}
              />
            );
          })}
        </nav>

        <div className="hidden shrink-0 items-center lg:flex">
          <Link
            href="/order"
            className="rounded-md bg-[var(--accent)] px-3 py-1.5 text-[12px] font-semibold leading-tight text-white shadow-sm transition-colors hover:bg-[var(--accent-hover)] sm:px-3.5 sm:text-[13px]"
          >
            Order Now
          </Link>
        </div>

        <button
          type="button"
          className={[
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-md transition-colors lg:hidden",
            overlayNav
              ? "text-white hover:bg-white/10"
              : "text-[var(--foreground)] hover:bg-black/[0.05] dark:hover:bg-white/[0.08]",
          ].join(" ")}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <IconMenu open={menuOpen} />
        </button>
      </div>

      {menuOpen ? (
        <div
          id="mobile-nav"
          className={[
            "max-h-[min(85vh,calc(100dvh-var(--announcement-h)-var(--header-h)))] overflow-y-auto overscroll-contain border-t px-4 py-3 lg:hidden",
            overlayNav
              ? "border-white/10 bg-zinc-950/98 text-white backdrop-blur-md"
              : "border-[var(--line)] bg-[var(--background)]",
          ].join(" ")}
        >
          <nav className="flex flex-col gap-0.5" aria-label="Mobile main">
            {navItems.map(({ href, label }) => {
              if (href === "/services") {
                return (
                  <div key={href} className="flex flex-col">
                    <button
                      type="button"
                      className={[
                        "flex w-full items-center justify-between rounded-md px-2.5 py-2.5 text-left text-[13px] font-medium transition-colors",
                        overlayNav
                          ? "text-white/90 hover:bg-white/10"
                          : "text-[var(--foreground)] hover:bg-black/[0.05] dark:hover:bg-white/[0.06]",
                      ].join(" ")}
                      aria-expanded={servicesMobileOpen}
                      aria-controls="mobile-services-panel"
                      id="mobile-services-trigger"
                      onClick={() =>
                        setServicesMobileOpen((open) => !open)
                      }
                    >
                      {label}
                      <IconChevronDown
                        className={[
                          "shrink-0 opacity-70 transition-transform duration-200",
                          servicesMobileOpen ? "rotate-180" : "",
                        ].join(" ")}
                      />
                    </button>
                    {servicesMobileOpen ? (
                      <div
                        id="mobile-services-panel"
                        role="region"
                        aria-labelledby="mobile-services-trigger"
                        className={[
                          "mt-1 mb-2 rounded-xl p-3",
                          overlayNav
                            ? "bg-white/10 ring-1 ring-white/15"
                            : "bg-zinc-100 ring-1 ring-[var(--line)] dark:bg-zinc-800/60 dark:ring-white/10",
                        ].join(" ")}
                      >
                        <ServicesMegaMenuGrid
                          dense
                          tone={overlayNav ? "overlay" : "default"}
                          onNavigate={() => {
                            setMenuOpen(false);
                            setServicesMobileOpen(false);
                          }}
                        />
                        <Link
                          href="/services"
                          onClick={() => {
                            setMenuOpen(false);
                            setServicesMobileOpen(false);
                          }}
                          className={[
                            `${sans.className} mt-3 flex w-full items-center justify-center rounded-lg py-2.5 text-center text-[13px] font-semibold transition-colors`,
                            overlayNav
                              ? "bg-white/15 text-white hover:bg-white/20"
                              : "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]",
                          ].join(" ")}
                        >
                          View all services
                        </Link>
                      </div>
                    ) : null}
                  </div>
                );
              }
              const active =
                href === "/"
                  ? pathname === "/"
                  : pathname === href || pathname.startsWith(`${href}/`);
              return (
                <NavLink
                  key={href}
                  href={href}
                  label={label}
                  active={active}
                  variant={overlayNav ? "overlay" : "solid"}
                  onNavigate={() => setMenuOpen(false)}
                />
              );
            })}
            <Link
              href="/order"
              onClick={() => setMenuOpen(false)}
              className="mt-2 rounded-md bg-[var(--accent)] py-2.5 text-center text-[13px] font-semibold leading-tight text-white hover:bg-[var(--accent-hover)]"
            >
              Order Now
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
