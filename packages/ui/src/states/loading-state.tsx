import { cn } from "../lib/cn";
import { SkeletonBlock } from "./skeleton-block";

export type LoadingStateVariant = "card" | "list" | "inline";

export type LoadingStateProps = {
  variant?: LoadingStateVariant;
  rows?: number;
  className?: string;
  label?: string;
};

export function LoadingState({
  variant = "card",
  rows = 3,
  className,
  label = "불러오는 중"
}: LoadingStateProps) {
  return (
    <div className={cn("w-full", className)} role="status" aria-live="polite" aria-label={label}>
      <span className="sr-only">{label}</span>
      {variant === "inline" ? (
        <div className="flex items-center gap-3">
          <SkeletonBlock width={48} height={48} radius="md" />
          <div className="flex flex-1 flex-col gap-2">
            <SkeletonBlock height={14} width="60%" />
            <SkeletonBlock height={12} width="40%" />
          </div>
        </div>
      ) : variant === "list" ? (
        <ul className="flex flex-col gap-4">
          {Array.from({ length: rows }).map((_, index) => (
            <li key={index} className="flex items-center gap-4">
              <SkeletonBlock width={72} height={72} radius="md" />
              <div className="flex flex-1 flex-col gap-2">
                <SkeletonBlock height={16} width="70%" />
                <SkeletonBlock height={12} width="45%" />
                <SkeletonBlock height={12} width="30%" />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col gap-4">
          <SkeletonBlock height={200} radius="md" />
          <SkeletonBlock height={20} width="55%" />
          <SkeletonBlock height={14} width="80%" />
          <SkeletonBlock height={14} width="65%" />
        </div>
      )}
    </div>
  );
}
