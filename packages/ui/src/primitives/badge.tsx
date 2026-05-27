import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";

import { cn } from "../lib/cn";

const badgeVariants = cva(
  "inline-flex max-w-full items-center rounded-[var(--radius-badge)] px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-surface-muted text-text",
        primary: "bg-primary/10 text-primary",
        accent: "bg-accent/15 text-accent",
        info: "bg-info/10 text-info",
        success: "bg-success/10 text-success",
        warning: "bg-warning/10 text-warning",
        danger: "bg-danger/10 text-danger"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </span>
  );
}
