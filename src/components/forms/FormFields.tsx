"use client";

import { useId, type ReactNode } from "react";

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode | ((id: string, describedBy: string) => ReactNode);
}) {
  const id = useId();
  const describedBy = [hint ? `${id}-hint` : "", error ? `${id}-err` : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-[var(--foreground)]">
        {label}
      </label>
      <div className="mt-2">
        {typeof children === "function" ? children(id, describedBy) : children}
      </div>
      {hint ? (
        <p id={`${id}-hint`} className="mt-2 text-xs text-[var(--muted-2)]">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-err`} className="mt-2 text-xs font-medium text-red-500">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function Input({
  id,
  describedBy,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
  inputMode,
}: {
  id: string;
  describedBy: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "tel";
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <input
      id={id}
      aria-describedby={describedBy || undefined}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      type={type}
      autoComplete={autoComplete}
      inputMode={inputMode}
      className="w-full rounded-xl border border-[var(--line)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] shadow-sm outline-none ring-[var(--accent)]/25 focus:border-[var(--accent)]/40 focus:ring-4"
    />
  );
}

export function Textarea({
  id,
  describedBy,
  value,
  onChange,
  placeholder,
  rows = 6,
}: {
  id: string;
  describedBy: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      id={id}
      aria-describedby={describedBy || undefined}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full resize-y rounded-xl border border-[var(--line)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] shadow-sm outline-none ring-[var(--accent)]/25 focus:border-[var(--accent)]/40 focus:ring-4"
    />
  );
}

export function Select({
  id,
  describedBy,
  value,
  onChange,
  children,
}: {
  id: string;
  describedBy: string;
  value: string;
  onChange: (v: string) => void;
  children: ReactNode;
}) {
  return (
    <select
      id={id}
      aria-describedby={describedBy || undefined}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-[var(--line)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] shadow-sm outline-none ring-[var(--accent)]/25 focus:border-[var(--accent)]/40 focus:ring-4"
    >
      {children}
    </select>
  );
}

export function PrimaryButton({
  children,
  disabled,
  onClick,
  type = "button",
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex w-full items-center justify-center rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  );
}

