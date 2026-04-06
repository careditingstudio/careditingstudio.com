"use client";

import { AnnouncementBar } from "@/components/AnnouncementBar";
import { useChromeScrollLock } from "@/components/ChromeScrollLockContext";
import { SiteHeader } from "@/components/SiteHeader";
import type { SiteSettings } from "@/lib/cms-types";
import { siteConfig } from "@/config/site";
import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  site: SiteSettings;
};

export function SiteTopChrome({ children, site }: Props) {
  const { isChromeHideLocked } = useChromeScrollLock();
  const [announcementHidden, setAnnouncementHidden] = useState(false);
  const lastY = useRef(0);
  const ticking = useRef(false);

  const hideAnnouncement = announcementHidden && !isChromeHideLocked;

  useEffect(() => {
    lastY.current = window.scrollY;
  }, []);

  useEffect(() => {
    if (isChromeHideLocked) {
      setAnnouncementHidden(false);
    }
  }, [isChromeHideLocked]);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        ticking.current = false;
        if (isChromeHideLocked) {
          setAnnouncementHidden(false);
          lastY.current = window.scrollY;
          return;
        }

        const y = window.scrollY;
        const dy = y - lastY.current;
        lastY.current = y;

        if (y < 32) {
          setAnnouncementHidden(false);
          return;
        }
        if (dy > 6) setAnnouncementHidden(true);
        else if (dy < -6) setAnnouncementHidden(false);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isChromeHideLocked]);

  return (
    <>
      <div className="pointer-events-none fixed left-0 right-0 top-0 z-[71]">
        <div
          className={[
            "pointer-events-auto transition-transform duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] will-change-transform",
            hideAnnouncement ? "-translate-y-full" : "translate-y-0",
          ].join(" ")}
        >
          <AnnouncementBar contact={site} />
        </div>
      </div>

      <div
        className={[
          "fixed left-0 right-0 z-[70] transition-[top] duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] will-change-[top]",
          hideAnnouncement
            ? "top-0"
            : "top-[var(--announcement-h)]",
        ].join(" ")}
      >
        <SiteHeader brandName={siteConfig.name} />
      </div>

      <div
        className={[
          "flex flex-1 flex-col transition-[padding-top] duration-300 ease-[cubic-bezier(0.33,1,0.68,1)]",
          hideAnnouncement
            ? "pt-[var(--header-h)]"
            : "pt-[calc(var(--announcement-h)+var(--header-h))]",
        ].join(" ")}
      >
        {children}
      </div>
    </>
  );
}
