import { cn } from "../lib/cn";

export type SkeletonBlockProps = {
  width?: string | number;
  height?: string | number;
  radius?: "sm" | "md" | "lg" | "full";
  className?: string;
};

const radiusMap = {
  sm: "rounded-[var(--radius-button)]",
  md: "rounded-[var(--radius-card)]",
  lg: "rounded-[var(--radius-card)]",
  full: "rounded-full"
};

export function SkeletonBlock({
  width = "100%",
  height = "1rem",
  radius = "md",
  className
}: SkeletonBlockProps) {
  return (
    <div
      className={cn("animate-pulse bg-surface-muted", radiusMap[radius], className)}
      style={{ width, height }}
      aria-hidden
    />
  );
}
