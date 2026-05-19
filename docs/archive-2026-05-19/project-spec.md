# pin-stitch 프로젝트 명세서

## 1. 문서 목적

이 문서는 `pin-stitch` MVP를 실제 코드로 구현하기 위한 개발 기준을 정의한다.

제품 요구사항은 `docs/prd-v2.md`, 화면 요구사항은 `docs/screen-requirements.md`, API 초안은 `docs/api-draft.md`, 구현 순서는 `docs/mvp-implementation-plan.md`를 기준으로 한다.

## 2. 제품 범위

`pin-stitch` MVP는 체형 기반 상품 탐색, 리뷰 요약, 장바구니/쿠폰/주문, 셀러 인사이트를 하나의 흐름으로 구현한다.

### 고객 기능

- 체형 프로필 등록/수정
- 상품 목록/검색/필터/정렬
- 상품 상세
- 체형 적합도 점수
- 체형 기반 리뷰 요약
- 리뷰 필터링
- 매장 재고 확인
- 장바구니
- 쿠폰 자동 최적 적용
- 주문 생성/주문 완료/주문 내역

### 셀러 기능

- 셀러 대시보드
- 상품별 체형 만족도 분석
- 사이즈별 핏 평가 분포
- 리뷰 긍정/부정 키워드 분석
- 반품 사유 분석
- 상품 개선 인사이트

## 3. 기술 스택

## 3.1 확정 스택

| 영역 | 기술 |
| --- | --- |
| Framework | Next.js |
| UI | React |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Client State | Zustand |
| Server State | TanStack Query |
| Form | React Hook Form |
| Validation | Zod |
| Chart | Recharts |
| Domain Package | `packages/domain` |
| Mock Data Package | `packages/mock-data` |

## 3.2 백엔드 전략

MVP는 실제 외부 서버 없이 Next.js 내부에서 Mock API를 제공한다.

- API 형태는 `docs/api-draft.md`를 따른다.
- 초기 데이터는 `packages/mock-data`에서 제공한다.
- API 호출부는 나중에 실제 서버로 교체할 수 있도록 fetcher 계층으로 분리한다.
- 실제 DB, 인증, 결제, 배송 연동은 MVP 이후 확장한다.

## 3.3 보류 스택

아래 기술은 MVP 이후 도입한다.

- Prisma
- PostgreSQL
- 실제 인증 서버
- 실제 결제 PG
- 실제 POS/ERP 재고 연동
- LLM 리뷰 요약 API

## 4. 애플리케이션 구조

## 4.1 MVP 구조

MVP는 `apps/web` 하나에서 고객 화면과 셀러 화면을 함께 구현한다.

셀러 화면은 `/seller` 하위 라우트에 둔다.

```text
apps/
  web/
    app/
      page.tsx
      profile/
        body/
          page.tsx
      products/
        page.tsx
        [productId]/
          page.tsx
          reviews/
            page.tsx
          stores/
            page.tsx
      cart/
        page.tsx
      checkout/
        page.tsx
      orders/
        [orderId]/
          page.tsx
      me/
        orders/
          page.tsx
      seller/
        page.tsx
        products/
          [productId]/
            page.tsx
        reviews/
          page.tsx
        returns/
          page.tsx
      api/
        ...
    components/
    features/
    lib/
    stores/
```

## 4.2 패키지 구조

```text
packages/
  domain/
    src/
      index.ts
      types.ts
      fit-score.ts
      review-summary.ts
      coupon.ts
      seller-insight.ts
  mock-data/
    src/
      index.ts
      users.ts
      body-profiles.ts
      products.ts
      variants.ts
      reviews.ts
      stores.ts
      store-inventories.ts
      coupons.ts
      carts.ts
      orders.ts
      returns.ts
  ui/
    src/
      index.tsx
```

## 5. 도메인 패키지 기준

`packages/domain`은 앱의 제품 규칙을 담는다.

### 현재 확정된 타입 파일

- `packages/domain/src/types.ts`

### 추가할 도메인 로직

| 파일 | 역할 |
| --- | --- |
| `fit-score.ts` | 유사 체형 리뷰 매칭, 체형 적합도 점수 계산 |
| `review-summary.ts` | 리뷰 키워드 집계, 요약 문구, 주의사항 생성 |
| `coupon.ts` | 쿠폰 조건 검증, 최대 할인 조합 계산, 장바구니 가격 계산 |
| `seller-insight.ts` | 셀러 대시보드 지표와 상품 개선 인사이트 생성 |

### 도메인 로직 원칙

- UI 컴포넌트에서 직접 계산하지 않는다.
- 계산 로직은 `packages/domain`에 둔다.
- 화면은 계산 결과를 표시하는 역할만 한다.
- 같은 계산 결과를 고객 화면과 셀러 화면에서 재사용할 수 있어야 한다.

## 6. Mock 데이터 기준

## 6.1 필수 데이터

| 파일 | 데이터 |
| --- | --- |
| `users.ts` | 고객/셀러/관리자 샘플 사용자 |
| `body-profiles.ts` | 사용자 체형 프로필 |
| `products.ts` | 상품 기본 정보 |
| `variants.ts` | 상품 색상/사이즈 옵션 |
| `reviews.ts` | 체형 정보 포함 리뷰 |
| `stores.ts` | 매장 정보 |
| `store-inventories.ts` | 매장별 옵션 재고 |
| `coupons.ts` | 보유 쿠폰과 적용 조건 |
| `carts.ts` | 장바구니 샘플 |
| `orders.ts` | 주문 샘플 |
| `returns.ts` | 반품 사유 샘플 |

## 6.2 데이터 작성 규칙

- 상품은 최소 20개 작성한다.
- 상품별 옵션은 4~8개 작성한다.
- 상품별 리뷰는 8~20개 작성한다.
- 리뷰에는 `heightCm`, `bodyShape`, `purchasedSize`, `fitResult`, `positiveKeywords`, `negativeKeywords`를 포함한다.
- 쿠폰은 주문 전체, 상품, 카테고리, 브랜드 쿠폰을 모두 포함한다.
- 매장 재고는 품절, 소량 재고, 충분한 재고 케이스를 모두 포함한다.
- 반품 사유는 사이즈, 핏, 색상, 소재 케이스를 모두 포함한다.

## 7. 상태 관리 기준

## 7.1 Zustand

Zustand는 클라이언트에서 유지해야 하는 UI/세션성 상태에 사용한다.

사용 대상:

- 현재 선택 사용자
- 체형 프로필 임시 입력 상태
- 장바구니 UI 상태
- 상품 목록 필터 상태
- 셀러 대시보드 필터 상태

사용하지 않을 대상:

- 서버에서 조회하는 상품 목록
- 리뷰 목록
- 주문 목록
- 셀러 분석 데이터

## 7.2 TanStack Query

TanStack Query는 API 응답 캐시와 서버 상태 관리에 사용한다.

사용 대상:

- 상품 목록/상세 조회
- 리뷰 조회
- 매장 재고 조회
- 장바구니 조회
- 주문 생성/조회
- 셀러 대시보드/인사이트 조회

## 8. 폼/검증 기준

폼은 React Hook Form으로 구현하고, 입력 검증은 Zod로 정의한다.

필수 스키마:

- `bodyProfileSchema`
- `cartItemSchema`
- `shippingAddressSchema`
- `productFilterSchema`
- `reviewFilterSchema`

검증 원칙:

- 사용자 입력은 저장 전에 Zod로 검증한다.
- API Route Handler에서도 같은 검증 규칙을 재사용한다.
- 오류 메시지는 필드 단위로 표시한다.

## 9. API 구현 기준

## 9.1 API 위치

Next.js Route Handler를 사용한다.

예시:

```text
apps/web/app/api/products/route.ts
apps/web/app/api/products/[productId]/route.ts
apps/web/app/api/products/[productId]/reviews/route.ts
apps/web/app/api/cart/route.ts
apps/web/app/api/cart/items/route.ts
apps/web/app/api/cart/apply-best-coupons/route.ts
apps/web/app/api/orders/route.ts
apps/web/app/api/orders/[orderId]/route.ts
apps/web/app/api/seller/dashboard/route.ts
```

## 9.2 응답 형태

모든 API는 `ApiResponse<T>` 형태를 따른다.

성공:

```ts
{
  success: true,
  data,
  error: null,
  meta
}
```

실패:

```ts
{
  success: false,
  data: null,
  error,
  meta
}
```

## 9.3 API 구현 원칙

- Route Handler는 요청 파싱, 검증, 응답 포맷만 담당한다.
- 데이터 조회는 `packages/mock-data`에서 가져온다.
- 계산은 `packages/domain`의 함수를 사용한다.
- API 응답 타입은 `packages/domain`의 타입을 사용한다.

## 10. 쿠폰 자동 적용 기준

## 10.1 지원 쿠폰

- 주문 전체 정액 할인
- 주문 전체 정률 할인
- 특정 상품 할인
- 특정 카테고리 할인
- 특정 브랜드 할인

## 10.2 적용 규칙

- 사용 기간이 지난 쿠폰은 제외한다.
- 최소 주문 금액을 만족하지 못한 쿠폰은 제외한다.
- 적용 대상 조건을 만족하지 못한 쿠폰은 제외한다.
- 중복 불가 쿠폰은 단독 적용 결과와 중복 가능 쿠폰 조합 결과를 비교한다.
- 정률 쿠폰은 최대 할인 금액을 넘지 않는다.
- 최종 주문 예정 금액이 가장 낮은 조합을 자동 선택한다.
- 동일 할인액이면 만료일이 빠른 쿠폰을 우선 적용한다.

## 10.3 화면 표시

장바구니에는 다음 정보를 표시한다.

- 상품 금액 합계
- 자동 적용 쿠폰 목록
- 쿠폰별 할인 금액
- 적용 제외 쿠폰과 제외 사유
- 최종 주문 예정 금액

## 11. 화면 구현 순서

## 11.1 1차

1. 체형 프로필
2. 상품 목록
3. 상품 상세
4. 리뷰 필터
5. 매장 재고

## 11.2 2차

1. 장바구니
2. 쿠폰 자동 적용
3. 주문 생성
4. 주문 완료
5. 주문 내역

## 11.3 3차

1. 셀러 대시보드
2. 셀러 상품 분석
3. 셀러 리뷰 분석
4. 셀러 반품 분석

## 12. 컴포넌트 기준

## 12.1 공통 컴포넌트

- `Button`
- `Input`
- `Select`
- `Checkbox`
- `Tabs`
- `Badge`
- `Price`
- `ProductCard`
- `ReviewCard`
- `EmptyState`
- `LoadingState`
- `ErrorState`

## 12.2 기능 컴포넌트

- `BodyProfileForm`
- `ProductFilterBar`
- `FitScoreBadge`
- `ReviewSummaryPanel`
- `FitWarningList`
- `StoreInventoryList`
- `CartItemList`
- `CouponApplicationPanel`
- `OrderSummary`
- `SellerMetricCards`
- `FitDistributionChart`
- `KeywordStatList`
- `SellerInsightCard`

## 13. 라우팅 기준

| 화면 | 경로 |
| --- | --- |
| 홈 | `/` |
| 체형 프로필 | `/profile/body` |
| 상품 목록 | `/products` |
| 상품 상세 | `/products/:productId` |
| 리뷰 탐색 | `/products/:productId/reviews` |
| 매장 재고 | `/products/:productId/stores` |
| 장바구니 | `/cart` |
| 주문 생성 | `/checkout` |
| 주문 완료/상세 | `/orders/:orderId` |
| 주문 내역 | `/me/orders` |
| 셀러 대시보드 | `/seller` |
| 셀러 상품 분석 | `/seller/products/:productId` |
| 셀러 리뷰 분석 | `/seller/reviews` |
| 셀러 반품 분석 | `/seller/returns` |

## 14. 완료 기준

MVP는 다음 조건을 만족하면 완료로 본다.

- 사용자가 체형 프로필을 등록할 수 있다.
- 상품 목록에서 체형 적합도 기준으로 상품을 탐색할 수 있다.
- 상품 상세에서 리뷰 요약, 주의사항, 매장 재고를 확인할 수 있다.
- 상품을 장바구니에 담고 쿠폰 자동 적용 결과를 확인할 수 있다.
- 장바구니를 주문으로 생성할 수 있다.
- 주문 완료와 주문 내역을 확인할 수 있다.
- 셀러가 상품별 체형/핏 문제와 개선 인사이트를 확인할 수 있다.
- 주요 화면에 로딩, 빈 상태, 오류 상태가 있다.
- 도메인 계산 로직이 UI와 분리되어 있다.

## 15. 다음 작업 순서

1. `packages/domain` 도메인 타입 확정
2. `packages/domain` 계산 로직 구현
3. `packages/mock-data` 샘플 데이터 작성
4. `apps/web` 기본 Next.js 구조 생성
5. Mock API Route Handler 작성
6. 고객 상품 탐색 화면 구현
7. 장바구니/쿠폰/주문 화면 구현
8. 셀러 화면 구현
9. QA와 운영 문서 정리
