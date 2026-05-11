"use client";

import { display, sans } from "@/app/fonts";
import { useChromeScrollLock } from "@/components/ChromeScrollLockContext";
import { useHomeChromeSolid } from "@/components/HomeChromeProvider";
import { OrderNowLink } from "@/components/OrderNowLink";
import { ServicesMegaMenuGrid } from "@/components/ServicesMegaMenu";
import { navItems } from "@/config/site";
import type { ServicePageContent, ServiceRow } from "@/lib/cms-types";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

type NavVariant = "overlay" | "solid";

function NavLink({
  href,
  label,
  active,
  variant,
  onNavigate,
  dense = false,
}: {
  href: string;
  label: string;
  active: boolean;
  variant: NavVariant;
  onNavigate?: () => void;
  /** Compact row for mobile drawer */
  dense?: boolean;
}) {
  if (variant === "overlay") {
    const pad = dense ? "px-3 py-2.5 text-[0.9375rem]" : "px-4 py-3 text-[15px] sm:text-[16px]";
    return (
      <Link
        href={href}
        prefetch
        onClick={onNavigate}
        className={[
          `${sans.className} rounded-xl border font-medium leading-snug tracking-tight transition-colors duration-200 ease-out`,
          pad,
          active
            ? dense
              ? "border-white/20 bg-white/[0.12] text-white"
              : "border-white/30 bg-white/15 text-white shadow-[0_10px_24px_-14px_rgba(255,255,255,0.9)]"
            : dense
              ? "border-transparent text-white/85 hover:bg-white/[0.08] hover:text-white"
              : "border-transparent text-white/75 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/10 hover:text-white hover:shadow-[0_14px_28px_-16px_rgba(255,255,255,0.85)]",
        ].join(" ")}
      >
        {label}
      </Link>
    );
  }

  const pad = dense ? "px-3 py-2.5 text-[0.9375rem]" : "px-4 py-3 text-[15px] sm:text-[16px]";
  return (
    <Link
      href={href}
      prefetch
      onClick={onNavigate}
      className={[
        `${sans.className} rounded-xl border font-medium leading-snug tracking-tight transition-colors duration-200 ease-out`,
        pad,
        active
          ? dense
            ? "border-[var(--accent)]/40 bg-[var(--accent-subtle)] text-[var(--foreground)]"
            : "border-[var(--accent)]/35 bg-[var(--accent-subtle)] text-[var(--foreground)] shadow-[0_10px_26px_-14px_var(--accent)]"
          : dense
            ? "border-transparent text-[var(--muted)] hover:bg-white/[0.06] hover:text-[var(--foreground)]"
            : "border-transparent text-[var(--muted)] hover:-translate-y-0.5 hover:border-[var(--line)] hover:bg-white/70 hover:text-[var(--foreground)] hover:shadow-[0_14px_30px_-20px_rgba(0,0,0,0.65)] dark:hover:bg-white/[0.08]",
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
      width="14"
      height="14"
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
      width="22"
      height="22"
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
  services?: ServiceRow[];
  servicePages?: ServicePageContent[];
  navLabels?: string[];
  shell?: {
    header: { servicesMenuTitle: string; viewAllServices: string };
    cta: { orderNow: string };
  };
};

export function SiteHeader({
  brandName = "Car Editing Studio",
  services = [],
  servicePages = [],
  navLabels: navLabelsProp,
  shell,
}: SiteHeaderProps) {
  const labels =
    navLabelsProp && navLabelsProp.length === navItems.length
      ? navLabelsProp
      : navItems.map((i) => i.label);
  const megaTitle = shell?.header.servicesMenuTitle ?? "Services";
  const megaViewAll = shell?.header.viewAllServices ?? "View all services";
  const orderLabel = shell?.cta.orderNow ?? "Order now";
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

  const freeTrialNavIdx = navItems.findIndex((i) => i.href === "/free-trial");
  const freeTrialLabel =
    freeTrialNavIdx >= 0
      ? (labels[freeTrialNavIdx] ?? navItems[freeTrialNavIdx]!.label)
      : "Free Trial";
  const mainMobileNavItems = navItems.filter((i) => i.href !== "/free-trial");

  const servicesTriggerClasses = (hovering: boolean) =>
    [
      "inline-flex items-center gap-1.5 rounded-xl border border-transparent px-4 py-3 text-[15px] font-medium leading-tight tracking-tight transition-all duration-300 ease-out sm:text-[16px]",
      navVariant === "overlay"
        ? [
            servicesActive || hovering
              ? "border-white/30 bg-white/15 text-white shadow-[0_10px_24px_-14px_rgba(255,255,255,0.9)]"
              : "text-white/75 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/10 hover:text-white hover:shadow-[0_14px_28px_-16px_rgba(255,255,255,0.85)]",
          ].join(" ")
        : [
            servicesActive || hovering
              ? "border-[var(--accent)]/35 bg-[var(--accent-subtle)] text-[var(--foreground)] shadow-[0_10px_26px_-14px_var(--accent)]"
              : "text-[var(--muted)] hover:-translate-y-0.5 hover:border-[var(--line)] hover:bg-white/70 hover:text-[var(--foreground)] hover:shadow-[0_14px_30px_-20px_rgba(0,0,0,0.65)] dark:hover:bg-white/[0.08]",
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
      <div className="mx-auto flex h-[var(--header-h)] max-w-[88rem] items-center justify-between gap-4 px-4 sm:gap-6 sm:px-6 lg:px-8">
        <Link
          href="/"
          prefetch
          className={[
            `${display.className} inline-flex shrink-0 items-center gap-2.5 text-[1.2rem] font-semibold leading-none tracking-tight transition-colors sm:gap-3 sm:text-[1.35rem]`,
            overlayNav ? "text-white" : "text-[var(--foreground)]",
          ].join(" ")}
        >
          <span
            className={[
              "relative flex h-9 max-h-9 w-auto max-w-[min(42vw,10rem)] shrink-0 items-center overflow-visible rounded-xl sm:h-10 sm:max-w-[11rem]",
              overlayNav
                ? "shadow-[0_12px_40px_-14px_rgba(255,255,255,0.45)]"
                : "shadow-[0_10px_32px_-12px_rgba(0,0,0,0.45)]",
            ].join(" ")}
          >
            <Image
              src="/logo.png"
              alt=""
              width={220}
              height={56}
              className="h-full w-auto max-h-full object-contain object-left"
              priority
            />
          </span>
          <span className="whitespace-nowrap">{brandName}</span>
        </Link>

        <nav
          className="hidden min-w-0 flex-1 items-center justify-center gap-1.5 lg:flex"
          aria-label="Main"
        >
          {navItems.map(({ href }, idx) => {
            const label = labels[idx] ?? navItems[idx]!.label;
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
                    prefetch
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
                  <div
                    className={[
                      "absolute left-1/2 top-full z-[80] w-[min(calc(100vw-2rem),56rem)] -translate-x-1/2 pt-3 transition-all duration-250 ease-out",
                      servicesHover
                        ? "pointer-events-auto translate-y-0 opacity-100"
                        : "pointer-events-none -translate-y-2 opacity-0",
                    ].join(" ")}
                    onMouseEnter={openServicesHover}
                    onMouseLeave={scheduleCloseServicesHover}
                  >
                    <div
                      className="max-h-[min(70vh,640px)] overflow-y-auto rounded-2xl border border-white/50 bg-white/95 p-5 shadow-[0_26px_80px_-28px_rgba(0,0,0,0.55)] ring-1 ring-zinc-900/[0.06] backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/95 dark:ring-white/10 sm:p-6"
                    >
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <p
                          className={`${display.className} text-base font-semibold text-zinc-900 dark:text-zinc-50`}
                        >
                          {megaTitle}
                        </p>
                        <Link
                          href="/services"
                          prefetch
                          className={`${sans.className} rounded-md px-2 py-1 text-sm font-semibold text-[var(--accent)] transition-all duration-200 hover:bg-[var(--accent-subtle)] hover:text-[var(--accent-hover)]`}
                          onClick={() => {
                            setServicesHover(false);
                            clearHoverTimer();
                          }}
                        >
                          {megaViewAll}
                        </Link>
                      </div>
                      <ServicesMegaMenuGrid
                        dense
                        services={services}
                        servicePages={servicePages}
                        onNavigate={() => {
                          setServicesHover(false);
                          clearHoverTimer();
                        }}
                      />
                    </div>
                  </div>
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
          <OrderNowLink label={orderLabel} />
        </div>

        <button
          type="button"
          className={[
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-md transition-colors lg:hidden",
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
        <>
          <button
            type="button"
            className="fixed bottom-0 left-0 right-0 top-[calc(var(--announcement-h)+var(--header-h))] z-[72] bg-black/50 backdrop-blur-[2px] transition-opacity duration-200 lg:hidden"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <div
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className={[
              "fixed bottom-0 left-0 right-0 z-[75] flex max-h-[min(92dvh,calc(100dvh-var(--announcement-h)-var(--header-h)+8px))] flex-col overflow-hidden rounded-t-3xl border shadow-[0_-12px_48px_-12px_rgba(0,0,0,0.55)] lg:hidden",
              "top-[calc(var(--announcement-h)+var(--header-h))]",
              overlayNav
                ? "border-white/10 bg-zinc-950 text-white"
                : "border-[var(--line)] bg-[var(--popover)] text-[var(--foreground)] shadow-xl",
            ].join(" ")}
          >
            <div
              className={[
                "mx-auto mt-1 mb-2 h-1 w-10 shrink-0 rounded-full",
                overlayNav ? "bg-white/20" : "bg-[var(--muted)]/40",
              ].join(" ")}
              aria-hidden
            />
            <div className="flex min-h-[12rem] flex-1 flex-col">
              <nav
                className="min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain px-4 pb-2 pt-1"
                aria-label="Mobile main"
              >
                {mainMobileNavItems.map(({ href }) => {
                  const navIdx = navItems.findIndex((n) => n.href === href);
                  const label =
                    navIdx >= 0
                      ? (labels[navIdx] ?? navItems[navIdx]!.label)
                      : href;
                  if (href === "/services") {
                    return (
                      <div key={href} className="flex flex-col">
                        <button
                          type="button"
                          className={[
                            `${sans.className} flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[0.9375rem] font-semibold leading-snug transition-colors duration-200`,
                            overlayNav
                              ? "text-white/90 hover:bg-white/[0.08]"
                              : "text-[var(--foreground)] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]",
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
                              "mt-1 rounded-xl p-2.5",
                              overlayNav
                                ? "bg-white/[0.06] ring-1 ring-white/10"
                                : "bg-zinc-100/80 ring-1 ring-[var(--line)] dark:bg-zinc-900/70 dark:ring-white/10",
                            ].join(" ")}
                          >
                            <ServicesMegaMenuGrid
                              dense
                              tone={overlayNav ? "overlay" : "default"}
                              services={services}
                              servicePages={servicePages}
                              onNavigate={() => {
                                setMenuOpen(false);
                                setServicesMobileOpen(false);
                              }}
                            />
                            <Link
                              href="/services"
                              prefetch
                              onClick={() => {
                                setMenuOpen(false);
                                setServicesMobileOpen(false);
                              }}
                              className={[
                                `${sans.className} mt-2 flex w-full items-center justify-center rounded-lg py-2.5 text-center text-[0.875rem] font-semibold transition-colors`,
                                overlayNav
                                  ? "bg-white/12 text-white hover:bg-white/18"
                                  : "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]",
                              ].join(" ")}
                            >
                              {megaViewAll}
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
                      dense
                      onNavigate={() => setMenuOpen(false)}
                    />
                  );
                })}
              </nav>
              <div
                className={[
                  "shrink-0 border-t px-4 py-3 backdrop-blur-md supports-[padding:env(safe-area-inset-bottom)]:pb-[calc(0.75rem+env(safe-area-inset-bottom))]",
                  overlayNav
                    ? "border-white/10 bg-zinc-950/90"
                    : "border-[var(--line)] bg-[color-mix(in_oklab,var(--background)_92%,transparent)]",
                ].join(" ")}
              >
                <div className="flex gap-2.5">
                  <OrderNowLink
                    className="min-h-0 flex-1 !min-h-10 !rounded-xl !py-2.5 !text-[0.9375rem] !shadow-[0_8px_20px_-12px_rgba(0,0,0,0.45)]"
                    onNavigate={() => setMenuOpen(false)}
                    label={orderLabel}
                  />
                  <Link
                    href="/free-trial"
                    prefetch
                    onClick={() => setMenuOpen(false)}
                    className={[
                      `${sans.className} inline-flex min-h-10 flex-1 items-center justify-center rounded-xl border px-3 text-center text-[0.9375rem] font-semibold leading-none transition-colors duration-200`,
                      overlayNav
                        ? "border-white/25 bg-white/[0.06] text-white hover:bg-white/[0.11]"
                        : "border-[var(--line)] bg-white/[0.04] text-[var(--foreground)] hover:bg-white/[0.08] dark:bg-white/[0.05]",
                    ].join(" ")}
                  >
                    {freeTrialLabel}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </header>
  );
}
