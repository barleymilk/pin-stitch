# pin-stitch

`pin-stitch`는 체형 정보와 구매 리뷰를 연결해 패션 상품 구매 실패를 줄이는 맞춤형 패션 커머스 MVP입니다.

사용자는 나와 비슷한 체형의 리뷰, 체형 적합도 점수, 사이즈/핏 주의사항을 보고 상품을 고를 수 있습니다. 셀러는 리뷰와 반품 데이터를 기반으로 상품 상세페이지, 사이즈 가이드, 옵션 구성을 개선할 수 있습니다.

## 현재 상태

현재 저장소는 MVP 구현을 시작하기 위한 초기 상태입니다.

- `docs/`: PRD, 화면 요구사항, API 초안, 디자인 시스템, QA 전략 문서
- `packages/domain`: 도메인 타입 정의

아직 `apps/web`, `packages/mock-data`, `packages/ui`는 구현 전입니다.

## MVP 목표 구조

```text
apps/
  web/
    app/
      products/
      cart/
      checkout/
      orders/
      me/
      seller/
      api/

packages/
  domain/
    src/
      types.ts
      fit-score.ts
      review-summary.ts
      coupon.ts
      seller-insight.ts
  mock-data/
  ui/

docs/
```

MVP는 `apps/web` 하나에서 고객 화면과 셀러 화면을 함께 구현합니다. 셀러 화면은 `/seller` 하위 라우트에 둡니다.

## 핵심 MVP 범위

### 고객 웹

- 체형 프로필 등록/수정
- 상품 목록/검색/필터/정렬
- 상품 상세
- 체형별 리뷰 필터링
- 체형 기반 리뷰 요약
- 체형 적합도 점수
- 사이즈/핏 주의사항
- 샘플 매장 재고 안내
- 장바구니/주문 생성
- 장바구니 쿠폰 자동 최적 적용

### 셀러 웹

- 셀러 대시보드
- 상품별 체형 만족도 분석
- 리뷰 키워드 분석
- 반품 사유 샘플 분석
- 상품 개선 인사이트 카드

## 기술 방향

- Framework: Next.js
- UI: React
- Language: TypeScript
- Styling: Tailwind CSS
- Server State: TanStack Query
- Client State: Zustand
- Form: React Hook Form
- Validation: Zod
- Chart: Recharts
- Unit Test: Vitest
- E2E / Browser QA: Playwright
- Performance / Accessibility Audit: Lighthouse

MVP는 실제 외부 서버, 결제, 인증, POS/ERP 재고 연동 없이 Next.js Route Handler 기반 Mock API와 샘플 데이터로 구현합니다.

## 문서

문서 안내는 [docs/README.md](/Users/barleymilk/Projects/barleymilk/PROJECT/pin-stitch/docs/README.md)를 기준으로 확인합니다.

주요 문서:

- [docs/plan.md](/Users/barleymilk/Projects/barleymilk/PROJECT/pin-stitch/docs/plan.md): 프로젝트 기획서
- [docs/prd-v2.md](/Users/barleymilk/Projects/barleymilk/PROJECT/pin-stitch/docs/prd-v2.md): 제품 요구사항
- [docs/screen-requirements.md](/Users/barleymilk/Projects/barleymilk/PROJECT/pin-stitch/docs/screen-requirements.md): 화면 요구사항
- [docs/mvp-implementation-plan.md](/Users/barleymilk/Projects/barleymilk/PROJECT/pin-stitch/docs/mvp-implementation-plan.md): MVP 구현 계획
- [docs/project-spec.md](/Users/barleymilk/Projects/barleymilk/PROJECT/pin-stitch/docs/project-spec.md): 개발 기준
- [docs/design-system.md](/Users/barleymilk/Projects/barleymilk/PROJECT/pin-stitch/docs/design-system.md): 디자인 시스템
- [docs/qa-strategy.md](/Users/barleymilk/Projects/barleymilk/PROJECT/pin-stitch/docs/qa-strategy.md): QA / 테스트 전략
- [docs/api-draft.md](/Users/barleymilk/Projects/barleymilk/PROJECT/pin-stitch/docs/api-draft.md): API 초안

## 다음 구현 순서

1. 루트 workspace, TypeScript, Vitest 기본 설정
2. `packages/domain` 계산 로직 구현
3. `packages/domain` 단위 테스트 작성
4. `packages/mock-data` 샘플 데이터 작성
5. `apps/web` Next.js 앱 생성
6. Mock API Route Handler 작성
7. 고객 상품 탐색 화면 구현
8. 장바구니/쿠폰/주문 화면 구현
9. 셀러 화면 구현
10. Playwright, Lighthouse, 접근성 QA 추가

## 실행

아직 실행 가능한 웹 앱은 없습니다.

이 저장소는 `pnpm` workspace 기준입니다. `npm install`을 사용하지 않습니다.

처음 받았을 때 `pnpm: command not found`가 나오면 Corepack으로 pnpm을 활성화합니다.

```bash
corepack enable
corepack prepare pnpm@9.15.4 --activate
pnpm install
```

권한 문제로 Corepack shim 생성이 실패하면 다음처럼 Corepack을 통해 직접 실행할 수 있습니다.

```bash
corepack pnpm install
```

이미 `npm install`을 실행했다면 npm 산출물을 지운 뒤 다시 설치합니다.

```bash
rm -rf node_modules package-lock.json
pnpm install
```

workspace와 `apps/web`이 생성된 뒤 다음 명령어를 기준으로 정리할 예정입니다.

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```
