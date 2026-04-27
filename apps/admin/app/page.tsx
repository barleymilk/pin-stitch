import { SiteBadge } from '@pin-stitch/ui';

const p0Modules = ['상품 관리', '가격 정책', '주문 관리', '정산 관리'];

export default function Page() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-6 py-12">
      <h1 className="text-4xl font-bold">pin-stitch admin</h1>
      <p className="text-slate-300">
        이번 스프린트는 P0 범위만 개발하도록 스코프가 잠금되었습니다.
      </p>
      <SiteBadge label="Sprint Scope: P0 only" />

      <section className="rounded-lg border border-slate-800 p-4">
        <h2 className="mb-3 text-xl font-semibold">P0 Modules</h2>
        <ul className="list-disc space-y-1 pl-5 text-slate-300">
          {p0Modules.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
