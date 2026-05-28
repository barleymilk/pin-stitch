"use client";

import { cn } from "@pin-stitch/ui";
import { Heart, Menu, Search, ShoppingCart, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ComponentProps } from "react";

import { IconLink } from "@/components/layout/icon-link";
import { PRIMARY_NAV_ITEMS } from "@/components/layout/nav-links";

type FormSubmitEvent = Parameters<NonNullable<ComponentProps<"form">["onSubmit"]>>[0];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  function handleSearch(event: FormSubmitEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      router.push("/products");
      return;
    }
    router.push(`/products?search=${encodeURIComponent(trimmed)}`);
    setSearchOpen(false);
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg">
      <div className="mx-auto max-w-[var(--width-customer)] px-4">
        <div className="flex h-14 items-center gap-3 md:h-16 md:gap-6">
          <div className="flex min-w-0 items-center gap-2 md:gap-3">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-button)] text-text hover:bg-bg-subtle md:hidden"
              aria-expanded={menuOpen}
              aria-controls="site-header-mobile-nav"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? (
                <X className="h-5 w-5" aria-hidden />
              ) : (
                <Menu className="h-5 w-5" aria-hidden />
              )}
              <span className="sr-only">{menuOpen ? "메뉴 닫기" : "메뉴 열기"}</span>
            </button>

            <Link
              href="/"
              className="truncate text-xl font-black tracking-tight text-text md:text-2xl"
            >
              PIN-STITCH
            </Link>
          </div>

          <nav className="hidden flex-1 items-center justify-center md:flex" aria-label="주요 메뉴">
            <ul className="flex items-center gap-1">
              {PRIMARY_NAV_ITEMS.map((item) => {
                const active = item.match(pathname);
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={cn(
                        "rounded-[var(--radius-button)] px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary text-white"
                          : "text-text-muted hover:bg-bg-subtle hover:text-text"
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <form
            onSubmit={handleSearch}
            className="relative mx-auto hidden w-full max-w-sm flex-1 md:block"
            role="search"
          >
            <Search
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-text-muted"
              aria-hidden
            />
            <input
              type="search"
              name="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="상품명, 브랜드 검색"
              className="h-10 w-full rounded-[var(--radius-input)] border border-border bg-surface pr-3 pl-10 text-sm text-text placeholder:text-text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
            />
          </form>

          <div className="ml-auto flex shrink-0 items-center gap-0.5 md:gap-1">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-button)] text-text hover:bg-bg-subtle md:hidden"
              aria-expanded={searchOpen}
              aria-controls="site-header-mobile-search"
              onClick={() => setSearchOpen((open) => !open)}
            >
              <Search className="h-5 w-5" aria-hidden />
              <span className="sr-only">{searchOpen ? "검색 닫기" : "검색 열기"}</span>
            </button>

            <IconLink href="/me/wishlist" label="찜 목록">
              <Heart className="h-5 w-5" strokeWidth={1.75} aria-hidden />
            </IconLink>

            <IconLink href="/cart" label="장바구니">
              <ShoppingCart className="h-5 w-5" strokeWidth={1.75} aria-hidden />
            </IconLink>

            <IconLink href="/me/orders" label="마이페이지" className="hidden sm:inline-flex">
              <User className="h-5 w-5" strokeWidth={1.75} aria-hidden />
            </IconLink>
          </div>
        </div>

        {searchOpen ? (
          <form
            id="site-header-mobile-search"
            onSubmit={handleSearch}
            className="border-t border-border py-3 md:hidden"
            role="search"
          >
            <div className="relative">
              <Search
                className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-text-muted"
                aria-hidden
              />
              <input
                type="search"
                name="search-mobile"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="상품명, 브랜드 검색"
                className="h-10 w-full rounded-[var(--radius-input)] border border-border bg-surface pr-3 pl-10 text-sm text-text placeholder:text-text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
              />
            </div>
          </form>
        ) : null}

        {menuOpen ? (
          <nav
            id="site-header-mobile-nav"
            className="border-t border-border py-3 md:hidden"
            aria-label="모바일 메뉴"
          >
            <ul className="flex flex-col gap-1">
              {PRIMARY_NAV_ITEMS.map((item) => {
                const active = item.match(pathname);
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        "block rounded-[var(--radius-button)] px-3 py-2.5 text-sm font-medium",
                        active ? "bg-primary text-white" : "text-text hover:bg-bg-subtle"
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
              <li>
                <Link
                  href="/me/wishlist"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-[var(--radius-button)] px-3 py-2.5 text-sm font-medium text-text hover:bg-bg-subtle"
                >
                  찜 목록
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-[var(--radius-button)] px-3 py-2.5 text-sm font-medium text-text hover:bg-bg-subtle"
                >
                  장바구니
                </Link>
              </li>
              <li>
                <Link
                  href="/me/orders"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-[var(--radius-button)] px-3 py-2.5 text-sm font-medium text-text hover:bg-bg-subtle"
                >
                  주문 내역
                </Link>
              </li>
            </ul>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
