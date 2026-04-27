import { SiteBadge } from "@pin-stitch/ui";
import { sampleKpis } from "@pin-stitch/domain";

export default function Page() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-6 py-12">
      <h1 className="text-4xl font-bold">pin-stitch storefront</h1>
      <p className="text-slate-300">
        글로벌 디자이너 브랜드를 연결하는 커머스 인프라 기본 프로젝트가 생성되었습니다.
      </p>

      <SiteBadge label="P0 Sprint Scope Locked" />

      <section className="rounded-lg border border-slate-700 p-4">
        <h2 className="mb-3 text-xl font-semibold">KPI Snapshot</h2>
        <ul className="space-y-2 text-sm text-slate-300">
          {sampleKpis.map((kpi) => (
            <li key={kpi.name}>
              <span className="font-medium text-slate-100">{kpi.name}</span>: {kpi.target}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
