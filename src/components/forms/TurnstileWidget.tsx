"use client";

import { useEffect, useMemo, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        params: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
        },
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

let scriptPromise: Promise<void> | null = null;

function loadTurnstileScript(): Promise<void> {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector('script[data-turnstile="1"]');
    if (existing) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    s.async = true;
    s.defer = true;
    s.dataset.turnstile = "1";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("captcha"));
    document.head.appendChild(s);
  });
  return scriptPromise;
}

export function TurnstileWidget({
  siteKey,
  onToken,
  onStatus,
}: {
  siteKey: string;
  onToken: (token: string) => void;
  onStatus?: (status: "ready" | "error" | "expired") => void;
}) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);
  const onStatusRef = useRef(onStatus);
  const theme = useMemo<"light" | "dark" | "auto">(() => "dark", []);

  useEffect(() => {
    onTokenRef.current = onToken;
    onStatusRef.current = onStatus;
  }, [onStatus, onToken]);

  useEffect(() => {
    let cancelled = false;

    async function mount() {
      try {
        await loadTurnstileScript();
        if (cancelled) return;
        if (!boxRef.current) return;
        if (!window.turnstile) throw new Error("captcha");

        // Clean up any previous widget instance (e.g. when siteKey changes).
        if (widgetIdRef.current) {
          try {
            window.turnstile.remove(widgetIdRef.current);
          } catch {
            // ignore
          }
          widgetIdRef.current = null;
        }

        widgetIdRef.current = window.turnstile.render(boxRef.current, {
          sitekey: siteKey,
          theme,
          callback: (token) => onTokenRef.current(token),
          "expired-callback": () => {
            onTokenRef.current("");
            onStatusRef.current?.("expired");
          },
          "error-callback": () => {
            onTokenRef.current("");
            onStatusRef.current?.("error");
          },
        });
        onStatusRef.current?.("ready");
      } catch {
        onStatusRef.current?.("error");
      }
    }

    void mount();
    return () => {
      cancelled = true;
      const id = widgetIdRef.current;
      if (id && window.turnstile) {
        try {
          window.turnstile.remove(id);
        } catch {
          // ignore
        }
      }
      widgetIdRef.current = null;
    };
  }, [siteKey, theme]);

  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--background)] p-4 shadow-sm">
      <div ref={boxRef} />
    </div>
  );
}

