import { cn } from "@pin-stitch/ui";
import Link from "next/link";
import type { ReactNode } from "react";

export type IconLinkProps = {
  href: string;
  label: string;
  children: ReactNode;
  className?: string;
};

export function IconLink({ href, label, children, className }: IconLinkProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-button)] text-text transition-colors hover:bg-bg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
        className
      )}
    >
      {children}
    </Link>
  );
}
