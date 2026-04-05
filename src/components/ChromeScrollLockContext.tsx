"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ChromeScrollLockContextValue = {
  lockChromeHide: () => void;
  unlockChromeHide: () => void;
  isChromeHideLocked: boolean;
};

const ChromeScrollLockContext = createContext<ChromeScrollLockContextValue | null>(
  null,
);

export function ChromeScrollLockProvider({ children }: { children: ReactNode }) {
  const [locks, setLocks] = useState(0);

  const lockChromeHide = useCallback(() => {
    setLocks((n) => n + 1);
  }, []);

  const unlockChromeHide = useCallback(() => {
    setLocks((n) => Math.max(0, n - 1));
  }, []);

  const value = useMemo(
    () => ({
      lockChromeHide,
      unlockChromeHide,
      isChromeHideLocked: locks > 0,
    }),
    [lockChromeHide, unlockChromeHide, locks],
  );

  return (
    <ChromeScrollLockContext.Provider value={value}>
      {children}
    </ChromeScrollLockContext.Provider>
  );
}

export function useChromeScrollLock() {
  const ctx = useContext(ChromeScrollLockContext);
  if (!ctx) {
    throw new Error("useChromeScrollLock must be used within ChromeScrollLockProvider");
  }
  return ctx;
}
