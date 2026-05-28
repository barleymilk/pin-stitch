import Link from "next/link";
import { HeroCarousel } from "./components/home/hero-carousel";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-[var(--width-customer)] flex-col gap-8 px-4 py-12">
      <HeroCarousel />
      <Link
        href="/dev/ui"
        className="inline-flex w-fit items-center rounded-[var(--radius-button)] bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-hover"
      >
        컴포넌트 프리뷰 열기
      </Link>
    </main>
  );
}
