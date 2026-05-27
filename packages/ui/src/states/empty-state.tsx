import type { ReactNode } from "react";

import { cn } from "../lib/cn";

export type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-[var(--radius-card)] border border-dashed border-border bg-bg-subtle px-6 py-12 text-center",
        className
      )}
      role="status"
    >
      <h2 className="text-lg font-semibold text-text">{title}</h2>
      {description ? <p className="max-w-md text-sm text-text-muted">{description}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
