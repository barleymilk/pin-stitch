import type { CurrencyCode } from "@pin-stitch/domain";
import type { HTMLAttributes } from "react";

import { formatMoney } from "../lib/format-money";
import { cn } from "../lib/cn";

export type PriceTone = "default" | "muted" | "accent" | "discount";

export type PriceProps = HTMLAttributes<HTMLSpanElement> & {
  amount: number;
  currency?: CurrencyCode;
  tone?: PriceTone;
  strikethrough?: boolean;
  label?: string;
};

const toneClasses: Record<PriceTone, string> = {
  default: "text-text font-semibold",
  muted: "text-text-muted",
  accent: "text-accent font-semibold",
  discount: "text-accent font-semibold"
};

export function Price({
  amount,
  currency = "KRW",
  tone = "default",
  strikethrough = false,
  label,
  className,
  ...props
}: PriceProps) {
  const formatted = formatMoney(amount, currency);

  return (
    <span className={cn("inline-flex items-baseline gap-1", className)} {...props}>
      {label ? <span className="sr-only">{label}</span> : null}
      <span
        className={cn(
          "tabular-nums",
          toneClasses[tone],
          strikethrough && "text-text-subtle line-through decoration-text-subtle font-normal"
        )}
        aria-label={label ?? formatted}
      >
        {formatted}
      </span>
    </span>
  );
}
