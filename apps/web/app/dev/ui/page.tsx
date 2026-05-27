import Link from "next/link";

import { PageHeader } from "@pin-stitch/ui";

import { UiPreview } from "./ui-preview";

export default function DevUiPage() {
  return (
    <main className="mx-auto min-h-screen max-w-[var(--width-customer)] px-4 py-10">
      <div className="mb-8">
        <Link href="/" className="text-sm text-text-muted hover:text-text">
          ← 홈
        </Link>
      </div>
      <PageHeader
        title="UI 컴포넌트 프리뷰"
        description="ui-guidelines 토큰 기반 P0 primitives · docs/design/component-inventory.md"
      />
      <div className="mt-10">
        <UiPreview />
      </div>
    </main>
  );
}
