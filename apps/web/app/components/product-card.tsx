import { formatMoney } from "@pin-stitch/ui";
import Image from "next/image";
import { Zap } from "lucide-react";

import { WishButton } from "@/app/components/wish-button";

export type ProductListItem = {
  id: string;
  brand: string;
  name: string;
  price: number;
  image: string;
  wishCount?: number;
  reviewCount?: number;
  fitScore?: number;
};

type ProductCardProps = {
  product: ProductListItem;
};

export function ProductCard({ product }: ProductCardProps) {
  const fitScore = product.fitScore ?? 0;

  return (
    <article>
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm">
        <Image src={product.image} alt={product.name} fill className="object-cover" sizes="50vw" />

        <WishButton name={product.name} />

        <span className="absolute bottom-2 left-2 z-10 inline-flex items-center gap-1 rounded-sm bg-black px-2 py-1 text-xs font-medium text-white">
          <Zap className="h-3 w-3 fill-current" aria-hidden />
          FIT {fitScore}%
        </span>
      </div>

      <div className="mt-2">
        <p className="font-bold text-sm">{product.brand}</p>
        <p className="font-medium text-md">{product.name}</p>
        <p className="font-bold text-lg">{formatMoney(product.price)}</p>
        <p className="flex gap-2 text-sm">
          <span>찜 {product.wishCount}개</span>
          <span>리뷰 {product.reviewCount}개</span>
        </p>
      </div>
    </article>
  );
}
