"use client";

import { readCssLengthVarPx } from "@/lib/readCssLengthVar";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const HomeChromeSolidContext = createContext(false);

function useComputeChromeSolid() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [solid, setSolid] = useState(!isHome);

  const tick = useCallback(() => {
    if (!isHome) {
      setSolid(true);
      return;
    }
    const sentinel = document.getElementById("home-scroll-sentinel");
    if (!sentinel) {
      setSolid(false);
      return;
    }
    const rect = sentinel.getBoundingClientRect();
    if (rect.height < 2) {
      setSolid(false);
      return;
    }
    const ann = readCssLengthVarPx("--announcement-h", 44);
    const hh = readCssLengthVarPx("--header-h", 52);
    const chromeBottom = ann + hh;
    setSolid(rect.top < chromeBottom);
  }, [isHome]);

  useLayoutEffect(() => {
    tick();
  }, [tick, pathname]);

  useEffect(() => {
    const id = requestAnimationFrame(() => tick());
    return () => cancelAnimationFrame(id);
  }, [pathname, tick]);

  useEffect(() => {
    if (!isHome) return;
    tick();
    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", tick);
    return () => {
      window.removeEventListener("scroll", tick);
      window.removeEventListener("resize", tick);
    };
  }, [isHome, tick]);

  return solid;
}

export function HomeChromeProvider({ children }: { children: ReactNode }) {
  const solid = useComputeChromeSolid();
  const value = useMemo(() => solid, [solid]);
  return (
    <HomeChromeSolidContext.Provider value={value}>
      {children}
    </HomeChromeSolidContext.Provider>
  );
}

export function useHomeChromeSolid() {
  return useContext(HomeChromeSolidContext);
}
