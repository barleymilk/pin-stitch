# pin-stitch 구현 가이드

## 1. 구현 전략

MVP는 Next.js 프론트엔드와 NestJS 백엔드를 분리해 구현합니다. 도메인 계산 로직은 `packages/domain`에 두고, NestJS API는 Prisma를 통해 PostgreSQL에 접근합니다. 데모에 필요한 초기 데이터는 seed 데이터로 구성합니다.

구현 순서:

1. `packages/domain` 타입과 계산 로직을 확정합니다.
2. `apps/api` NestJS 앱을 만들고 Prisma/PostgreSQL을 연결합니다.
3. Prisma schema와 seed 데이터를 작성합니다.
4. 상품/리뷰/체형/장바구니/주문 API를 구현합니다.
5. `apps/web` Next.js 앱에서 API를 연결합니다.
6. 고객 상품 탐색 화면을 완성합니다.
7. 장바구니와 주문 생성으로 커머스 흐름을 닫습니다.
8. 같은 리뷰/반품 데이터를 셀러 대시보드에서 다시 해석합니다.
9. 마지막에 QA, 반응형, Empty/Loading/Error 상태를 점검합니다.

## 2. 확정 기술 스택

| 영역 | 기술 | 역할 |
| --- | --- | --- |
| Frontend Framework | Next.js | 고객/셀러 화면, 라우팅, 페이지 구성 |
| Backend Framework | NestJS | API 서버, Controller/Service/Module 기반 백엔드 구조 |
| UI | React | 화면 컴포넌트 |
| Language | TypeScript | 도메인 타입 안정성 |
| Styling | Tailwind CSS | UI 스타일과 디자인 토큰 |
| Server State | TanStack Query | API 조회, 캐시, 로딩, 에러, mutation |
| Client State | Zustand | 샘플 사용자, 필터 UI, 선택 옵션 등 클라이언트 상태 |
| Form | React Hook Form | 체형 프로필, 배송지, 필터 폼 |
| Validation | Zod | 폼과 API 요청 검증 |
| Chart | Recharts | 셀러 대시보드와 분석 차트 |
| ORM | Prisma | PostgreSQL schema, migration, 타입 안전한 DB 접근 |
| Database | PostgreSQL | 상품, 리뷰, 주문, 쿠폰, 재고, 분석 이벤트 저장 |
| Domain | `packages/domain` | 타입과 도메인 계산 로직 |
| Seed Data | Prisma seed | 데모용 사용자, 상품, 리뷰, 쿠폰, 주문, 반품 초기 데이터 |
| UI Package | `packages/ui` | 재사용 UI 컴포넌트 |

MVP 이후 확장 스택은 인증, 결제 PG SDK, LLM API, Redis, 라이브 스트리밍 서비스입니다.

## 3. 앱 구조

MVP는 `apps/web` Next.js 앱과 `apps/api` NestJS 앱을 함께 사용합니다. 고객 화면과 셀러 화면은 `apps/web`에서 구현하고, 셀러 화면은 `/seller` 하위 라우트에 둡니다.

```text
apps/
  web/
    app/
      page.tsx
      profile/body/page.tsx
      products/page.tsx
      products/[productId]/page.tsx
      products/[productId]/reviews/page.tsx
      products/[productId]/stores/page.tsx
      cart/page.tsx
      checkout/page.tsx
      orders/[orderNumber]/page.tsx
      me/orders/page.tsx
      seller/page.tsx
      seller/products/[productId]/page.tsx
      seller/reviews/page.tsx
      seller/returns/page.tsx
    components/
    features/
    lib/
    stores/
  api/
    prisma/
      schema.prisma
      seed.ts
    src/
      products/
      reviews/
      body-profiles/
      cart/
      orders/
      seller/
      uploads/
      prisma/
```

## 4. 패키지 구조

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
  ui/
    src/
      index.tsx
```

현재 확정된 파일:

- `packages/domain/src/types.ts`
- `packages/domain/src/index.ts`

데모 데이터는 `apps/api/prisma/seed.ts`에서 작성합니다. 실제 API 응답은 NestJS가 PostgreSQL에서 조회합니다.

## 5. 도메인 로직 기준

UI 컴포넌트는 계산하지 않고 결과를 표시합니다. 계산 로직은 `packages/domain`에 둡니다.

| 파일 | 역할 |
| --- | --- |
| `fit-score.ts` | 유사 체형 리뷰 매칭, 체형 적합도 점수 계산 |
| `review-summary.ts` | 리뷰 키워드 집계, 요약 문구, 주의사항 생성 |
| `coupon.ts` | 쿠폰 조건 검증, 최대 할인 조합 계산, 장바구니 가격 계산 |
| `seller-insight.ts` | 셀러 지표, 상품 개선 인사이트, 반품/리뷰 집계 |

### 유사 체형 리뷰 매칭

초기 규칙:

- 키 차이 5cm 이내면 높은 가중치
- 같은 골격 타입이면 높은 가중치
- 같은 평소 사이즈 또는 구매 사이즈면 중간 가중치
- 리뷰 작성 시점에 스냅샷으로 저장된 선호 핏이 같으면 중간 가중치
- 유사 리뷰가 없으면 전체 리뷰 기반으로 fallback

### 체형 적합도 점수

`FitScore.score`는 0~100점으로 계산합니다.

```text
FitScore =
  유사 체형 평균 별점 점수 40%
  + 정사이즈 성공 비율 25%
  + 핏 관련 부정 키워드 역점수 20%
  + 반품 사유 역점수 15%
```

신뢰도:

- 유사 체형 리뷰 15개 이상: `HIGH`
- 유사 체형 리뷰 5~14개: `MEDIUM`
- 유사 체형 리뷰 1~4개: `LOW`
- 유사 체형 리뷰 없음: 전체 리뷰 기반 fallback, `LOW`

### 상품 목록 적합도 탐색

MVP 상품 목록에서는 체형 적합도를 정렬과 추천 토글로만 사용합니다.

- `sort=fit_score_desc`: 체형 적합도 높은 순 정렬
- `recommendedFitOnly=true`: `score >= 70`, `matchedReviewCount >= 5`, `confidence != LOW`를 함께 만족하는 상품만 표시

순수 점수 범위 필터는 초기 리뷰 데이터가 부족한 MVP에서는 제공하지 않습니다. `fitScoreMin`, `confidence` 같은 세밀한 필터는 P1 이후 도입합니다.

### 리뷰 요약과 주의사항

MVP에서는 LLM 없이 규칙 기반으로 생성합니다.

- 유사 체형 리뷰의 긍정/부정 키워드를 집계합니다.
- `SMALL`, `TRUE_TO_SIZE`, `LARGE` 비율을 계산합니다.
- 사이즈, 어깨, 허리, 기장, 소재 관련 키워드 빈도로 경고 문구를 만듭니다.
- 요약에는 `matchedReviewCount`와 `basisReviewIds`를 함께 제공합니다.
- `ReviewSummary`는 내부 계산/저장 타입으로 사용하고, 사용자 API 응답은 `basisReviewIds`를 제외한 `ReviewSummaryResponse`로 변환합니다.
- `ReviewSummaryResponse`에는 요약에 사용된 체형 조건과 대표 근거 리뷰를 포함하되, `reviewId`, `userId`, `basisReviewIds`는 포함하지 않습니다.

예시:

```text
160cm 전후 WAVE 체형 사용자는 허리 라인은 만족하지만 어깨가 약간 여유롭다는 의견이 많습니다.
```

### 쿠폰 자동 적용

지원 쿠폰:

- 주문 전체 정액 할인
- 주문 전체 정률 할인
- 특정 상품 할인
- 특정 카테고리 할인
- 특정 브랜드 할인

적용 규칙:

- 사용 기간이 지난 쿠폰은 제외합니다.
- 최소 주문 금액을 만족하지 못한 쿠폰은 제외합니다.
- 상품/카테고리/브랜드 대상 조건을 만족하지 못한 쿠폰은 제외합니다.
- `stackable`이 `false`인 쿠폰은 다른 쿠폰과 함께 적용하지 않습니다.
- 상품 쿠폰은 적용 가능한 상품 라인에만 할인 금액을 배분합니다.
- 정률 쿠폰은 `maxDiscountAmount`를 넘지 않습니다.
- 최종 주문 예정 금액이 가장 낮은 조합을 선택합니다.
- 할인액이 같으면 만료일이 빠른 쿠폰을 우선합니다.

### 셀러 인사이트

초기 인사이트 유형:

- `DETAIL_PAGE_IMPROVEMENT`
- `SIZE_GUIDE_IMPROVEMENT`
- `OPTION_IMPROVEMENT`
- `TARGETING_OPPORTUNITY`

상품별 리뷰와 반품 데이터를 집계해 체형별 평균 평점, 핏 불만 비율, 사이즈별 핏 분포, 긍정/부정 키워드, 개선 문구를 만듭니다.

## 6. Seed 데이터 기준

| 데이터 | 최소 기준 |
| --- | --- |
| `users` | 고객/셀러/관리자 샘플 사용자 3명 이상 |
| `bodyProfiles` | 체형 프로필 5개 이상 |
| `products` | 상품 20개 이상 |
| `productVariants` | 상품당 옵션 4~8개 |
| `fitReviews` | 상품당 리뷰 8~20개 |
| `stores` | 샘플 매장 5개 이상 |
| `storeInventories` | 상품당 재고 3~8개 |
| `coupons` | 주문/상품/카테고리/브랜드 쿠폰 포함 10개 이상 |
| `carts` | 사용자별 장바구니 1개 이상 |
| `orders` | 주문 샘플 10개 이상 |
| `returnReasons` | 상품당 반품 사유 0~5개 |

데이터 작성 규칙:

- 상품 이미지에는 `url`, `altText`, `sortOrder`를 포함합니다.
- 리뷰에는 작성 시점의 `heightCm`, `bodyShape`, `fitPreference`, `purchasedSize`, `fitResult`, `positiveKeywords`, `negativeKeywords`를 포함합니다.
- 리뷰의 `fitPreference`는 사용자가 이후 체형 프로필을 바꾸더라도 과거 리뷰의 기대 핏 해석이 변하지 않도록 스냅샷으로 저장합니다.
- 매장 재고에는 품절, 소량 재고, 충분한 재고 케이스를 모두 포함합니다.
- 반품 사유에는 사이즈, 핏, 색상, 소재 케이스를 모두 포함합니다.

## 7. 상태 관리

### TanStack Query

사용 대상:

- 상품 목록/상세
- 리뷰 목록
- 체형 기반 리뷰 요약
- 매장 재고
- 장바구니
- 주문 내역
- 셀러 대시보드
- 셀러 상품 인사이트

### Zustand

사용 대상:

- 현재 선택한 샘플 사용자
- 상품 목록 필터 UI 상태
- 상품 목록 추천 적합도 토글 상태
- 상품 상세의 선택 옵션
- 셀러 대시보드 기간 필터
- 모바일 필터 패널 열림/닫힘

사용하지 않을 대상:

- 상품 데이터
- 리뷰 데이터
- 장바구니 데이터
- 주문 데이터
- 셀러 분석 데이터

## 8. 폼과 검증

폼은 React Hook Form, 검증은 Zod를 사용합니다.

필수 스키마:

- `bodyProfileSchema`
- `shippingAddressSchema`
- `cartItemSchema`
- `productFilterSchema`
- `reviewFilterSchema`

검증 원칙:

- 클라이언트 폼 제출 전 검증합니다.
- NestJS DTO 또는 공유 검증 스키마에서도 동일한 검증 규칙을 재사용합니다.
- 오류 메시지는 필드 단위로 표시합니다.

## 9. 구현 단계별 완료 기준

### 1단계: 데이터와 도메인 로직

- `packages/domain` 계산 로직 구현
- Prisma schema와 migration 작성
- seed 데이터 작성
- 하나의 상품 상세에서 체형 적합도와 리뷰 요약을 계산할 수 있음
- 하나의 셀러 상품 분석 화면에 필요한 집계 데이터를 만들 수 있음

### 2단계: 고객 상품 탐색

- 체형 프로필, 상품 목록, 상품 상세, 리뷰 필터, 매장 재고 화면 구현
- 체형 프로필에 따라 상품 목록/상세의 적합도와 요약이 달라짐

### 3단계: 장바구니/주문

- 장바구니 조회/수량 변경/삭제
- 쿠폰 자동 최적 적용
- 주문 생성, 주문 완료, 주문 내역 구현
- 주문 생성 후 장바구니를 비움

### 4단계: 셀러 인사이트

- 셀러 대시보드
- 셀러 상품 분석
- 셀러 리뷰 분석
- 셀러 반품 분석
- 상품별 개선 인사이트 최소 1개 이상 표시

### 5단계: QA

- 주요 화면 반응형 점검
- Empty/Loading/Error 상태 점검
- 접근성 기준 점검
- README와 사용자 시나리오 정리
