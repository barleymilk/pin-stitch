export type NavItem = {
  href: string;
  label: string;
  match: (pathname: string) => boolean;
};

export type FooterLink = {
  href: string;
  label: string;
};

export const PRIMARY_NAV_ITEMS: NavItem[] = [
  { href: "/", label: "홈", match: (path) => path === "/" },
  { href: "/products", label: "카테고리", match: (path) => path.startsWith("/products") },
  { href: "/profile/body", label: "핏 분석", match: (path) => path.startsWith("/profile/body") },
  { href: "/events", label: "이벤트", match: (path) => path.startsWith("/events") }
];

export const FOOTER_SHOPPING_LINKS: FooterLink[] = [
  ...PRIMARY_NAV_ITEMS.map(({ href, label }) => ({ href, label })),
  { href: "/me/wishlist", label: "찜 목록" },
  { href: "/cart", label: "장바구니" },
  { href: "/me/orders", label: "주문 내역" }
];

export const FOOTER_SERVICE_LINKS: FooterLink[] = [
  { href: "/legal/terms", label: "이용약관" },
  { href: "/legal/privacy", label: "개인정보처리방침" },
  { href: "/legal/shipping", label: "배송 및 교환 안내" }
];

export const FOOTER_COMPANY_LINKS: FooterLink[] = [
  { href: "/about", label: "브랜드 스토리" },
  { href: "/contact", label: "제휴 문의" },
  { href: "/careers", label: "채용 정보" }
];
