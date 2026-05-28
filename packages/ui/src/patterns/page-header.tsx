import type { ReactNode } from "react";

import { cn } from "../lib/cn";

export type PageHeaderProps = {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  actions?: ReactNode;
  className?: string;
};

export function PageHeader({
  title,
  description,
  backHref,
  backLabel = "뒤로",
  actions,
  className
}: PageHeaderProps) {
  return (
    <header className={cn("flex flex-col gap-3 border-b border-border pb-6", className)}>
      {backHref ? (
        <a
          href={backHref}
          className="inline-flex w-fit items-center gap-1 text-sm text-text-muted hover:text-text"
        >
          <span aria-hidden>←</span>
          {backLabel}
        </a>
      ) : null}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-text">{title}</h1>
          {description ? <p className="text-sm text-text-muted">{description}</p> : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
        ) : null}
      </div>
    </header>
  );
}
