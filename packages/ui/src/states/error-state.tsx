"use client";

import type { ReactNode } from "react";

import { Button } from "../primitives/button";
import { cn } from "../lib/cn";

export type ErrorStateProps = {
  title: string;
  description?: string;
  retryLabel?: string;
  onRetry?: () => void;
  action?: ReactNode;
  className?: string;
};

export function ErrorState({
  title,
  description,
  retryLabel = "다시 시도",
  onRetry,
  action,
  className
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-[var(--radius-card)] border border-danger/30 bg-danger/5 px-6 py-12 text-center",
        className
      )}
      role="alert"
    >
      <h2 className="text-lg font-semibold text-danger">{title}</h2>
      {description ? <p className="max-w-md text-sm text-text-muted">{description}</p> : null}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
        {onRetry ? (
          <Button variant="secondary" onClick={onRetry}>
            {retryLabel}
          </Button>
        ) : null}
        {action}
      </div>
    </div>
  );
}
