import { PageHeader } from "@pin-stitch/ui";
import Link from "next/link";

type LegalPlaceholderPageProps = {
  title: string;
  description: string;
};

export function LegalPlaceholderPage({ title, description }: LegalPlaceholderPageProps) {
  return (
    <div className="mx-auto max-w-[var(--width-customer)] px-4 py-8">
      <PageHeader title={title} description={description} backHref="/" />
      <p className="mt-6 text-sm text-text-muted">콘텐츠 준비 중입니다.</p>
      <Link href="/" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
        홈으로
      </Link>
    </div>
  );
}
