"use client";

import type { ReactNode } from "react";

import {
  Badge,
  Button,
  EmptyState,
  ErrorState,
  Input,
  LoadingState,
  PageHeader,
  Price
} from "@pin-stitch/ui";

function PreviewSection({
  title,
  description,
  children
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 rounded-[var(--radius-card)] border border-border bg-surface p-6">
      <div>
        <h2 className="text-lg font-semibold text-text">{title}</h2>
        {description ? <p className="mt-1 text-sm text-text-muted">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function UiPreview() {
  return (
    <div className="flex flex-col gap-10">
      <PreviewSection title="Button" description="Primary · Secondary · Tertiary · Danger">
        <div className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="tertiary">Tertiary</Button>
          <Button variant="danger">Danger</Button>
          <Button loading>Loading</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button disabled>Disabled</Button>
        </div>
      </PreviewSection>

      <PreviewSection title="Input">
        <div className="grid max-w-md gap-4">
          <Input label="검색어" placeholder="상품명, 브랜드 검색" />
          <Input label="키 (cm)" type="number" placeholder="165" hint="체형 프로필에 사용됩니다." />
          <Input label="이메일" error="올바른 이메일을 입력해 주세요." defaultValue="invalid" />
        </div>
      </PreviewSection>

      <PreviewSection title="Badge">
        <div className="flex flex-wrap gap-2">
          <Badge>기본</Badge>
          <Badge variant="primary">적합도 높음</Badge>
          <Badge variant="accent">쿠폰 적용</Badge>
          <Badge variant="info">정보</Badge>
          <Badge variant="success">재고 있음</Badge>
          <Badge variant="warning">핏 주의</Badge>
          <Badge variant="danger">품절</Badge>
        </div>
      </PreviewSection>

      <PreviewSection title="Price">
        <div className="flex flex-wrap items-baseline gap-4">
          <Price amount={89000} />
          <Price amount={71200} tone="accent" />
          <Price amount={99000} tone="muted" strikethrough />
          <div className="flex items-baseline gap-2">
            <Price amount={99000} tone="muted" strikethrough />
            <Price amount={71200} tone="accent" />
          </div>
        </div>
      </PreviewSection>

      <PreviewSection title="PageHeader">
        <PageHeader
          title="상품 목록"
          description="체형 적합도와 리뷰 요약으로 상품을 비교합니다."
          backHref="/"
          actions={
            <>
              <Button variant="secondary" size="sm">
                필터
              </Button>
              <Button size="sm">체형 등록</Button>
            </>
          }
        />
      </PreviewSection>

      <PreviewSection title="LoadingState">
        <div className="grid gap-8 lg:grid-cols-3">
          <LoadingState variant="card" />
          <LoadingState variant="list" rows={2} />
          <LoadingState variant="inline" />
        </div>
      </PreviewSection>

      <PreviewSection title="EmptyState">
        <EmptyState
          title="검색 결과가 없습니다"
          description="필터를 초기화하거나 다른 검색어를 시도해 보세요."
          action={
            <Button variant="secondary" size="sm">
              필터 초기화
            </Button>
          }
        />
      </PreviewSection>

      <PreviewSection title="ErrorState">
        <ErrorState
          title="데이터를 불러오지 못했습니다"
          description="네트워크 연결을 확인한 뒤 다시 시도해 주세요."
          onRetry={() => {
            window.alert("재시도 (프리뷰)");
          }}
        />
      </PreviewSection>
    </div>
  );
}
