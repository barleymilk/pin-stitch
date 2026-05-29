"use client";

import { cn } from "@pin-stitch/ui";
import { Heart, Home, Search, Grid2X2, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";

import { BOTTOM_NAV_ITEMS } from "@/components/layout/nav-links";

const NAV_ICONS: Record<string, LucideIcon> = {
  홈: Home,
  카테고리: Grid2X2,
  검색: Search,
  좋아요: Heart,
  마이페이지: User
};

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <section
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg pb-[env(safe-area-inset-bottom,0px)] md:hidden"
      aria-label="하단 메뉴"
    >
      <nav className="mx-auto h-14 max-w-[var(--width-customer)] px-2">
        <ul className="flex h-full items-stretch justify-around">
          {BOTTOM_NAV_ITEMS.map((item) => {
            const Icon = NAV_ICONS[item.label] ?? Home;
            const active = item.match(pathname);
            const className = cn(
              "flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-1 text-[10px] font-medium transition-colors",
              active ? "text-primary" : "text-text-muted"
            );

            if (item.action === "search") {
              return (
                <li key={item.label} className="flex flex-1">
                  <button
                    type="button"
                    className={className}
                    onClick={() => router.push("/products")}
                  >
                    <Icon className="h-5 w-5 shrink-0" strokeWidth={1.75} aria-hidden />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            }

            return (
              <li key={item.label} className="flex flex-1">
                <Link
                  href={item.href}
                  className={className}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon className="h-5 w-5 shrink-0" strokeWidth={1.75} aria-hidden />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </section>
  );
}
