import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-[var(--width-customer)] flex-col gap-8 px-4 py-12">
      <div className="space-y-2">
        <p className="text-sm text-text-muted">pin-stitch</p>
        <h1 className="text-3xl font-semibold text-text">디자인 시스템 프리뷰</h1>
        <p className="text-base text-text-muted">
          UI 컴포넌트와 토큰을 확인한 뒤 화면 퍼블리싱을 진행합니다.
        </p>
      </div>
      <Link
        href="/dev/ui"
        className="inline-flex w-fit items-center rounded-[var(--radius-button)] bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-hover"
      >
        컴포넌트 프리뷰 열기
      </Link>
    </main>
  );
}
