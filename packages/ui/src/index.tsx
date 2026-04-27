type SiteBadgeProps = {
  label: string;
};

export function SiteBadge({ label }: SiteBadgeProps) {
  return (
    <span className="inline-flex w-fit rounded-full border border-indigo-500/50 bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-200">
      {label}
    </span>
  );
}
