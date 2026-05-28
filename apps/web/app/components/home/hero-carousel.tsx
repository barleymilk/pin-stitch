import { Button } from "@pin-stitch/ui";

type HeroCarouselProps = {};

export function HeroCarousel(_props: HeroCarouselProps) {
  return (
    <section className="bg-amber-500">
      <div>
        <p>NEW SEASON 2026</p>
        <p>당신만의 완벽한 핏을 찾는 정교한 여정</p>
        <div>
          <Button>Shop Now</Button>
          <Button variant={"transparent"}>Register Body Profile</Button>
        </div>
      </div>
    </section>
  );
}
