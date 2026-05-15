# pin-stitch 기술 스택

## 1. 문서 목적

이 문서는 `pin-stitch` MVP 구현에 사용할 기술 스택과 각 기술의 역할을 정의한다.

기술 선택의 기준은 다음과 같다.

- 고객 웹과 셀러 웹을 빠르게 구현할 수 있어야 한다.
- 상품, 리뷰, 장바구니, 쿠폰, 주문, 셀러 인사이트 흐름을 타입 안정성 있게 다룰 수 있어야 한다.
- Mock API로 시작하되 실제 API/DB로 확장 가능한 구조여야 한다.
- 도메인 계산 로직이 UI와 분리되어야 한다.

## 2. 확정 기술 스택

| 영역 | 기술 | 사용 목적 |
| --- | --- | --- |
| Framework | Next.js | 앱 라우팅, 페이지 구성, Route Handler 기반 Mock API |
| UI Library | React | 화면 컴포넌트 구현 |
| Language | TypeScript | 도메인 타입 안정성 확보 |
| Styling | Tailwind CSS | 빠른 UI 스타일링과 일관된 디자인 토큰 적용 |
| Server State | TanStack Query | API 조회/캐시/로딩/에러 상태 관리 |
| Client State | Zustand | 사용자 선택, 필터, UI 상태 등 가벼운 전역 상태 관리 |
| Form | React Hook Form | 체형 프로필, 배송지 등 폼 상태 관리 |
| Validation | Zod | 입력값과 API 요청 검증 |
| Chart | Recharts | 셀러 대시보드와 상품 분석 차트 |
| Domain | `packages/domain` | 공통 타입과 도메인 계산 로직 |
| Mock Data | `packages/mock-data` | 샘플 상품, 리뷰, 쿠폰, 재고, 주문 데이터 |
| UI Package | `packages/ui` | 재사용 UI 컴포넌트 |

## 3. 앱 구조

MVP는 `apps/web` 하나에서 고객 화면과 셀러 화면을 함께 구현한다.

```text
apps/
  web/
    app/
      products/
      cart/
      checkout/
      orders/
      seller/
      api/
```

셀러 화면은 `/seller` 하위 라우트로 둔다.

```text
/seller
/seller/products/:productId
/seller/reviews
/seller/returns
```

향후 셀러 기능이 커지면 `apps/seller`로 분리할 수 있다.

## 4. 패키지 구조

```text
packages/
  domain/
  mock-data/
  ui/
```

### `packages/domain`

역할:

- 도메인 타입
- 체형 적합도 계산
- 리뷰 요약 규칙
- 쿠폰 자동 적용 계산
- 셀러 인사이트 계산

예시:

```text
packages/domain/src/types.ts
packages/domain/src/fit-score.ts
packages/domain/src/review-summary.ts
packages/domain/src/coupon.ts
packages/domain/src/seller-insight.ts
```

### `packages/mock-data`

역할:

- 샘플 사용자
- 샘플 체형 프로필
- 샘플 상품/옵션
- 샘플 리뷰
- 샘플 매장 재고
- 샘플 쿠폰
- 샘플 주문/반품

예시:

```text
packages/mock-data/src/products.ts
packages/mock-data/src/reviews.ts
packages/mock-data/src/coupons.ts
packages/mock-data/src/orders.ts
```

### `packages/ui`

역할:

- 공통 UI 컴포넌트
- 상품 카드, 리뷰 카드, 가격 표시, 배지, 빈 상태 등 재사용 컴포넌트

예시:

```text
packages/ui/src/button.tsx
packages/ui/src/badge.tsx
packages/ui/src/product-card.tsx
packages/ui/src/review-card.tsx
packages/ui/src/price.tsx
```

## 5. 상태 관리 기준

## 5.1 TanStack Query

TanStack Query는 서버 또는 Mock API에서 가져오는 데이터에 사용한다.

사용 대상:

- 상품 목록
- 상품 상세
- 리뷰 목록
- 체형 기반 리뷰 요약
- 매장 재고
- 장바구니
- 주문 내역
- 셀러 대시보드
- 셀러 상품 인사이트

역할:

- API 요청
- 캐싱
- 로딩 상태
- 에러 상태
- 재요청
- mutation 처리

## 5.2 Zustand

Zustand는 서버 데이터가 아니라 화면 조작 상태에 사용한다.

사용 대상:

- 현재 선택한 샘플 사용자
- 상품 목록 필터 UI 상태
- 상품 상세의 선택 옵션
- 셀러 대시보드 기간 필터
- 모바일 필터 패널 열림/닫힘

사용하지 않을 대상:

- 상품 데이터
- 리뷰 데이터
- 장바구니 데이터
- 주문 데이터
- 셀러 분석 데이터

이 데이터들은 TanStack Query가 관리한다.

## 6. 폼과 검증

폼은 React Hook Form으로 구현하고, 검증은 Zod로 정의한다.

사용 대상:

- 체형 프로필 폼
- 배송지 입력 폼
- 상품 필터
- 리뷰 필터

필수 Zod 스키마:

```text
bodyProfileSchema
shippingAddressSchema
cartItemSchema
productFilterSchema
reviewFilterSchema
```

검증 원칙:

- 클라이언트 폼 제출 전 검증한다.
- API Route Handler에서도 동일한 스키마를 재사용한다.
- 오류 메시지는 필드 단위로 표시한다.

## 7. API 전략

MVP는 Next.js Route Handler로 Mock API를 구현한다.

예시:

```text
apps/web/app/api/products/route.ts
apps/web/app/api/products/[productId]/route.ts
apps/web/app/api/products/[productId]/reviews/route.ts
apps/web/app/api/cart/route.ts
apps/web/app/api/cart/apply-best-coupons/route.ts
apps/web/app/api/orders/route.ts
apps/web/app/api/seller/dashboard/route.ts
```

API 구현 원칙:

- 응답 포맷은 `ApiResponse<T>`를 따른다.
- 요청 검증은 Zod로 처리한다.
- 데이터는 `packages/mock-data`에서 가져온다.
- 계산은 `packages/domain` 함수를 사용한다.
- 화면은 API 응답을 TanStack Query로 조회한다.

## 8. 차트

차트는 Recharts를 사용한다.

사용 화면:

- 셀러 대시보드
- 셀러 상품 분석
- 반품 분석

차트 유형:

- 체형별 평균 평점 막대 차트
- 사이즈별 핏 평가 분포 stacked bar
- 반품 사유 비율 pie 또는 bar
- 긍정/부정 키워드 빈도 bar

## 9. MVP 이후 도입 후보

아래 기술은 MVP 이후 실제 서비스 확장 단계에서 검토한다.

| 영역 | 기술 | 도입 시점 |
| --- | --- | --- |
| ORM | Prisma | 실제 DB 도입 시 |
| DB | PostgreSQL | 주문/리뷰/쿠폰 데이터를 영속화할 때 |
| Auth | NextAuth 또는 자체 인증 | 실제 로그인/권한 분리가 필요할 때 |
| Payment | PG SDK | 실제 결제를 연동할 때 |
| AI | LLM API | 리뷰 요약/반품 사유 분류를 자동화할 때 |
| File Storage | S3 호환 스토리지 | 이미지 리뷰/상품 이미지 업로드가 필요할 때 |

## 10. 기술 선택 요약

MVP는 다음 구조로 구현한다.

```text
Next.js + TypeScript + Tailwind CSS
TanStack Query + Zustand
React Hook Form + Zod
Recharts
packages/domain + packages/mock-data + packages/ui
```

이 구조는 고객 화면과 셀러 화면을 하나의 앱에서 빠르게 구현하면서도, 도메인 타입과 계산 로직을 앱 밖으로 분리할 수 있게 한다.
