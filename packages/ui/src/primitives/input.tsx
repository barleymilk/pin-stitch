import type { InputHTMLAttributes, ReactNode } from "react";

import { cn } from "../lib/cn";

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label?: string;
  hint?: string;
  error?: string;
  inputSize?: "sm" | "md" | "lg";
  trailing?: ReactNode;
};

export function Input({
  className,
  label,
  hint,
  error,
  inputSize = "md",
  trailing,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? (label ? label.replace(/\s+/g, "-").toLowerCase() : undefined);
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label ? (
        <label htmlFor={inputId} className="text-sm font-medium text-text">
          {label}
        </label>
      ) : null}
      <div className="relative">
        <input
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={cn(
            "w-full rounded-[var(--radius-input)] border bg-surface text-text placeholder:text-text-subtle",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
            error ? "border-danger" : "border-border",
            inputSize === "sm" && "h-8 px-3 text-sm",
            inputSize === "md" && "h-10 px-3 text-sm",
            inputSize === "lg" && "h-11 px-4 text-base",
            trailing && "pr-10",
            className
          )}
          {...props}
        />
        {trailing ? (
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-text-muted">
            {trailing}
          </div>
        ) : null}
      </div>
      {error ? (
        <p id={`${inputId}-error`} className="text-xs text-danger" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="text-xs text-text-subtle">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
