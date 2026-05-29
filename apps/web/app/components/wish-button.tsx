"use client";

import { cn } from "@pin-stitch/ui";
import { Heart } from "lucide-react";
import { useState } from "react";

type WishButtonProps = {
  name: string;
};

export function WishButton({ name }: WishButtonProps) {
  const [wished, setWished] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setWished((prev) => !prev)}
      className="absolute top-2 right-2 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-text shadow-sm transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
      aria-label={wished ? `${name} 찜 해제` : `${name} 찜하기`}
      aria-pressed={wished}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-colors",
          wished ? "fill-primary text-primary" : "fill-none"
        )}
        strokeWidth={wished ? 0 : 1.75}
        aria-hidden
      />
    </button>
  );
}
