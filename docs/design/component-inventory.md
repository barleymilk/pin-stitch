# pin-stitch 컴포넌트 인벤토리

이 문서는 `pin-stitch` MVP 화면 디자인과 `packages/ui` 구현을 위한 공통 컴포넌트 목록입니다. 고객 화면은 `screen-design-plan.md`, 셀러 화면은 `seller-screen-design-plan.md`, 시각 기준은 `ui-guidelines.md`를 따릅니다.

## 1. 우선순위 기준

| 우선순위 | 의미 |
| --- | --- |
| P0 | 상품 탐색, 상세, 장바구니, 주문, 셀러 분석 MVP에 즉시 필요 |
| P1 | P0 이후 확장 화면이나 고도화에 필요 |
| Shared | 고객/셀러 양쪽에서 사용 |
| Customer | 고객 화면 전용 |
| Seller | 셀러 화면 전용 |

## 2. 기반 컴포넌트

| 컴포넌트 | 범위 | 우선순위 | 역할 | 주요 props |
| --- | --- | --- | --- | --- |
| `Button` | Shared | P0 | 주요 명령, 보조 명령, 위험 명령 | `variant`, `size`, `disabled`, `loading`, `icon` |
| `IconButton` | Shared | P0 | 필터 열기, 삭제, 닫기 같은 아이콘 명령 | `icon`, `label`, `disabled` |
| `Input` | Shared | P0 | 검색, 배송지, 숫자 입력 | `label`, `value`, `error`, `placeholder` |
| `Select` | Shared | P0 | 정렬, 사이즈, 골격 타입 선택 | `label`, `options`, `value`, `error` |
| `Checkbox` | Shared | P0 | 동의, 쿠폰/필터 선택 | `label`, `checked`, `error` |
| `Toggle` | Shared | P0 | 추천 적합도 같은 binary 설정 | `label`, `checked`, `description` |
| `Tabs` | Shared | P1 | 관련 화면 또는 분석 뷰 전환 | `items`, `activeValue` |
| `Badge` | Shared | P0 | 상태, 심각도, 핏 평가, 쿠폰 상태 | `variant`, `children` |
| `Price` | Shared | P0 | 원화 금액, 취소선, 할인 금액 표시 | `amount`, `currency`, `tone`, `strikethrough` |
| `PageHeader` | Shared | P0 | 화면 제목, 보조 설명, 상위 이동 | `title`, `description`, `actions`, `backHref` |
| `FilterBar` | Shared | P0 | 필터 컨트롤 묶음 | `filters`, `onReset`, `layout` |
| `FilterChip` | Shared | P0 | 선택된 필터 표시와 제거 | `label`, `onRemove` |
| `Pagination` | Shared | P0 | 목록 페이지 이동 | `page`, `totalPages`, `onChange` |

디자인 메모:

- 모든 버튼은 키보드 접근과 포커스 상태를 제공합니다.
- 아이콘 버튼에는 화면에 보이지 않는 접근성 라벨을 반드시 둡니다.
- 필터는 모바일에서 바텀시트 또는 전체 화면 패널로 확장될 수 있어야 합니다.

## 3. 상태 컴포넌트

| 컴포넌트 | 범위 | 우선순위 | 역할 | 주요 props |
| --- | --- | --- | --- | --- |
| `LoadingState` | Shared | P0 | 조회 중 skeleton 표시 | `variant`, `rows` |
| `EmptyState` | Shared | P0 | 빈 상태 원인과 다음 행동 표시 | `title`, `description`, `action` |
| `ErrorState` | Shared | P0 | 오류 메시지와 재시도 표시 | `title`, `description`, `retryLabel`, `onRetry` |
| `SkeletonBlock` | Shared | P0 | 카드/차트/테이블 skeleton 단위 | `width`, `height`, `radius` |
| `FieldError` | Shared | P0 | 폼 필드 오류 메시지 | `message` |

필수 상태:

- 상품 검색 결과 없음
- 체형 프로필 미등록
- 유사 체형 리뷰 없음
- 장바구니 비어 있음
- 주문 내역 없음
- 분석 데이터 없음
- 주요 API 조회 실패

## 4. 고객 커머스 컴포넌트

| 컴포넌트 | 범위 | 우선순위 | 사용 화면 | 주요 데이터 |
| --- | --- | --- | --- | --- |
| `ProductCard` | Customer | P0 | `/`, `/products` | `ProductListItemResponse` |
| `ProductImageGallery` | Customer | P0 | `/products/:productId` | `ProductImage[]` |
| `FitScoreBadge` | Customer | P0 | `/products`, `/products/:productId` | `FitScore` |
| `FitScorePanel` | Customer | P0 | `/products/:productId` | `FitScore` |
| `ReviewSummaryPanel` | Customer | P0 | `/products/:productId` | `ReviewSummaryResponse` |
| `ReviewCard` | Customer | P0 | `/products/:productId/reviews`, 상세 요약 근거 | `ReviewListItemResponse`, representative review |
| `OptionSelector` | Customer | P0 | `/products/:productId` | `ProductVariant[]`, selected `variantId` |
| `SizeGuideTable` | Customer | P0 | `/products/:productId` | `SizeMeasurement[]` |
| `StoreInventoryList` | Customer | P0 | 상세, `/products/:productId/stores` | `StoreInventory[]` |
| `CartItemRow` | Customer | P0 | `/cart`, `/checkout`, 주문 상세 | `CartItem`, 상품 요약 |
| `QuantityStepper` | Customer | P0 | `/cart` | `quantity`, `min`, `max` |
| `CouponSummary` | Customer | P0 | `/cart`, `/checkout` | `CouponApplication[]`, `ExcludedCoupon[]` |
| `PriceSummary` | Customer | P0 | `/cart`, `/checkout`, 주문 상세 | `CartPricing` |
| `ShippingAddressForm` | Customer | P0 | `/checkout` | `ShippingAddress` |
| `OrderStatusBadge` | Customer | P0 | `/orders/:orderNumber`, `/me/orders` | `OrderStatus` |
| `DeliveryStatusBadge` | Customer | P0 | `/orders/:orderNumber`, `/me/orders` | `DeliveryStatus` |
| `ShipmentSummary` | Customer | P0 | `/orders/:orderNumber`, `/me/orders` | `Shipment` |
| `OrderSummaryCard` | Customer | P0 | `/orders/:orderNumber`, `/me/orders` | `Order` |
| `BodyProfileForm` | Customer | P0 | `/profile/body` | `BodyProfile` |

디자인 메모:

- `ProductCard`는 이미지 비율을 고정하고, 긴 상품명에도 카드 높이가 크게 흔들리지 않아야 합니다.
- `FitScoreBadge`는 점수만 표시하지 않고 신뢰도 또는 유사 리뷰 수를 함께 표시합니다.
- `ReviewCard`는 `reviewId`, `userId`를 표시하지 않습니다.
- `PriceSummary`는 장바구니와 체크아웃에서 동일한 구조로 사용합니다.

## 5. 셀러 분석 컴포넌트

| 컴포넌트 | 범위 | 우선순위 | 사용 화면 | 주요 데이터 |
| --- | --- | --- | --- | --- |
| `SellerShell` | Seller | P0 | 모든 셀러 화면 | 현재 경로, 내비게이션 |
| `DashboardHeader` | Seller | P0 | 모든 셀러 화면 | 제목, 기간/상품 필터 |
| `MetricCard` | Seller | P0 | `/seller`, 상품 분석 | 지표명, 값, 변화량 |
| `ProblemProductTable` | Seller | P0 | `/seller` | 문제 상품 Top 5 |
| `InsightCard` | Seller | P0 | `/seller`, 상품 분석 | `SellerInsight` |
| `BodyShapeSatisfactionChart` | Seller | P0 | 상품 분석 | `BodyShapeSatisfaction[]` |
| `SizeFitDistributionChart` | Seller | P0 | 상품 분석 | `SizeFitDistribution[]` |
| `KeywordStatList` | Seller | P0 | 상품 분석, 리뷰 분석 | `FitKeywordStat[]` |
| `SellerReviewTable` | Seller | P0 | `/seller/reviews` | 비식별 리뷰 목록 |
| `ReturnReasonChart` | Seller | P0 | `/seller/returns` | `returnReasonStats` |
| `BodyShapeIssueList` | Seller | P0 | `/seller/returns` | `bodyShapeIssues` |
| `ProductReturnRateTable` | Seller | P0 | `/seller/returns` | `productReturnRates` |
| `SeverityBadge` | Seller | P0 | 대시보드, 인사이트 | `LOW`, `MEDIUM`, `HIGH` |

디자인 메모:

- 셀러 컴포넌트는 고객 컴포넌트보다 밀도를 높게 가져갑니다.
- 차트는 핵심 수치를 텍스트로도 제공합니다.
- `SellerReviewTable`에는 고객 이름, 이메일, `userId`를 표시하지 않습니다.
- 테이블은 태블릿 이하에서 가로 스크롤 또는 카드형으로 읽히게 설계합니다.

## 6. 컴포넌트 구현 순서

### 1단계: 기반과 상태

1. `Button`
2. `IconButton`
3. `Input`
4. `Select`
5. `Checkbox`
6. `Toggle`
7. `Badge`
8. `Price`
9. `LoadingState`
10. `EmptyState`
11. `ErrorState`

### 2단계: 고객 상품 탐색

1. `ProductCard`
2. `FitScoreBadge`
3. `FilterBar`
4. `FilterChip`
5. `ProductImageGallery`
6. `OptionSelector`
7. `FitScorePanel`
8. `ReviewSummaryPanel`
9. `ReviewCard`
10. `StoreInventoryList`

### 3단계: 고객 장바구니와 주문

1. `CartItemRow`
2. `QuantityStepper`
3. `CouponSummary`
4. `PriceSummary`
5. `ShippingAddressForm`
6. `OrderStatusBadge`
7. `OrderSummaryCard`
8. `BodyProfileForm`

### 4단계: 셀러 분석

1. `SellerShell`
2. `DashboardHeader`
3. `MetricCard`
4. `ProblemProductTable`
5. `InsightCard`
6. `BodyShapeSatisfactionChart`
7. `SizeFitDistributionChart`
8. `KeywordStatList`
9. `SellerReviewTable`
10. `ReturnReasonChart`
11. `BodyShapeIssueList`
12. `ProductReturnRateTable`

## 7. 접근성 및 표시 규칙

- 상품 이미지는 `altText`를 `alt` 값으로 사용합니다.
- 상태 색상은 텍스트나 아이콘과 함께 사용합니다.
- 내부 ID는 일반 사용자 화면에 표시하지 않습니다.
- 셀러 화면에서도 고객 개인 식별 정보는 표시하지 않습니다.
- 버튼과 배지 텍스트는 부모 영역을 넘지 않아야 합니다.
- 차트는 핵심 수치와 범례를 텍스트로 제공합니다.
- 원화 금액은 천 단위 구분 기호를 사용합니다.

## 8. 디자인 산출물 체크리스트

- [ ] P0 기반 컴포넌트 기본/hover/focus/disabled 상태
- [ ] `ProductCard` 긴 상품명, 이미지 없음, 적합도 없음 상태
- [ ] `FitScoreBadge` `LOW`, `MEDIUM`, `HIGH` 신뢰도 상태
- [ ] `ReviewSummaryPanel` 유사 리뷰 있음/없음 상태
- [ ] `OptionSelector` 선택 가능/품절 상태
- [ ] `CouponSummary` 적용 쿠폰 있음/없음/제외 쿠폰 있음 상태
- [ ] `PriceSummary` 할인 전/후 금액 상태
- [ ] `MetricCard` 정상/위험/데이터 없음 상태
- [ ] `InsightCard` `LOW`, `MEDIUM`, `HIGH` 심각도 상태
- [ ] 테이블 모바일 대응 방식
