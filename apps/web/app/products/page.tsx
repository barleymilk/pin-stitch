import { cn } from "@pin-stitch/ui";
import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";

import { ProductCard, type ProductListItem } from "@/app/components/product-card";

type PageProps = {
  searchParams: Promise<{ category?: string; q?: string }>;
};

const MOCK_PRODUCTS: ProductListItem[] = [
  {
    id: "1",
    brand: "STUDIO NICHOLSON",
    name: "에코 레더 미니멀 자켓",
    price: 428000,
    image: "/images/carousel_01.jpg",
    wishCount: 489,
    reviewCount: 128,
    fitScore: 98
  },
  {
    id: "2",
    brand: "COS",
    name: "와이드 울 팬츠",
    price: 189000,
    image: "/images/carousel_02.jpg",
    wishCount: 312,
    reviewCount: 64
  },
  {
    id: "3",
    brand: "LEMAIRE",
    name: "오버사이즈 코튼 셔츠",
    price: 245000,
    image: "/images/carousel_01.jpg",
    wishCount: 201,
    reviewCount: 42
  },
  {
    id: "4",
    brand: "OUR LEGACY",
    name: "워시드 데님 재킷",
    price: 356000,
    image: "/images/carousel_02.jpg",
    wishCount: 178,
    reviewCount: 91
  },
  {
    id: "5",
    brand: "AURALEE",
    name: "슈퍼150s 울 블레이저",
    price: 512000,
    image: "/images/carousel_01.jpg",
    wishCount: 95,
    reviewCount: 37
  },
  {
    id: "6",
    brand: "JIL SANDER",
    name: "미니멀 레더 토트백",
    price: 890000,
    image: "/images/carousel_02.jpg",
    wishCount: 567,
    reviewCount: 156
  },
  {
    id: "7",
    brand: "MARGARET HOWELL",
    name: "린넨 블렌드 트렌치",
    price: 398000,
    image: "/images/carousel_01.jpg",
    wishCount: 143,
    reviewCount: 58
  },
  {
    id: "8",
    brand: "UNIQLO U",
    name: "울 크루넥 스웨터",
    price: 79000,
    image: "/images/carousel_02.jpg",
    wishCount: 892,
    reviewCount: 203
  },
  {
    id: "9",
    brand: "ACNE STUDIOS",
    name: "스트레이트 실루엣 진",
    price: 278000,
    image: "/images/carousel_01.jpg",
    wishCount: 234,
    reviewCount: 72
  },
  {
    id: "10",
    brand: "THE ROW",
    name: "캐시미어 니트 베스트",
    price: 645000,
    image: "/images/carousel_02.jpg",
    wishCount: 67,
    reviewCount: 19
  },
  {
    id: "11",
    brand: "TOTEME",
    name: "하이웨이스트 울 스커트",
    price: 312000,
    image: "/images/carousel_01.jpg",
    wishCount: 156,
    reviewCount: 44
  },
  {
    id: "12",
    brand: "PIN-STITCH",
    name: "핏 맞춤 옥스포드 셔츠",
    price: 128000,
    image: "/images/carousel_02.jpg",
    wishCount: 421,
    reviewCount: 187
  }
];

const CATEGORIES = [
  { label: "전체", value: undefined },
  { label: "아우터", value: "OUTER" },
  { label: "상의", value: "TOP" },
  { label: "하의", value: "BOTTOM" },
  { label: "원피스", value: "DRESS" }
] as const;

function categoryHref(value?: string) {
  return value ? `/products?category=${value}` : "/products";
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentCategory = params.category;

  return (
    <div className="p-4">
      <nav className="-mx-4 overflow-x-auto px-4 pt-2 pb-6" aria-label="카테고리">
        <div className="flex w-max gap-2">
          {CATEGORIES.map((cat) => {
            const active =
              cat.value === undefined ? !currentCategory : currentCategory === cat.value;

            return (
              <Link
                key={cat.label}
                href={categoryHref(cat.value)}
                className={cn(
                  "shrink-0 whitespace-nowrap rounded-[var(--radius-badge)] px-3 py-1 text-sm font-medium",
                  active ? "bg-primary text-white" : "bg-surface-muted text-text"
                )}
                aria-current={active ? "page" : undefined}
              >
                {cat.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="flex justify-between pb-4 text-sm">
        <div className="flex gap-4">
          <span className="font-extrabold">인기순</span>
          <span className="text-text-muted">신상품순</span>
          <span className="text-text-muted">나의 베스트 핏</span>
        </div>
        <span className="flex gap-2">
          <SlidersHorizontal className="h-5 w-5" strokeWidth={1.75} aria-hidden />
          <span>필터</span>
        </span>
      </div>

      <section className="grid grid-cols-2 gap-x-3 gap-y-6">
        {MOCK_PRODUCTS.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </section>
    </div>
  );
}
