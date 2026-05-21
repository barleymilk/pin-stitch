# pin-stitch 고객 핵심 플로우 화면 설계

이 문서는 고객 웹의 P0 핵심 구매 흐름을 디자인하기 위한 화면별 설계 기준입니다. 제품 범위는 `product-requirements.md`, API와 응답 DTO는 `api-reference.md`, 시각 기준은 `ui-guidelines.md`를 따릅니다.

## 1. 설계 원칙

- 첫 화면부터 상품 탐색, 체형 적합도, 구매 행동이 이어지도록 구성합니다.
- 고객 화면에는 내부 ID를 직접 노출하지 않습니다.
- 상품 이미지는 항상 `altText`를 포함한 API 응답을 사용합니다.
- 체형 적합도는 점수만 강조하지 않고 신뢰도, 유사 리뷰 수, 근거 문장을 함께 보여줍니다.
- 장바구니와 주문 화면에서는 상품, 옵션, 할인, 최종 금액의 불일치가 없어야 합니다.
- 모바일에서는 필터, 옵션 선택, 장바구니 CTA가 화면 흐름을 방해하지 않아야 합니다.

## 2. 고객 핵심 플로우

```text
/
  -> /profile/body
  -> /products
  -> /products/:productId
  -> /products/:productId/reviews
  -> /products/:productId/stores
  -> /cart
  -> /checkout
  -> /orders/:orderNumber
  -> /me/orders
```

홈 `/`은 이벤트, 추천 상품, 체형 프로필 진입을 제공하는 고객 진입 허브로 다룹니다.

## 3. 공통 컴포넌트

| 컴포넌트 | 사용 화면 | 역할 |
| --- | --- | --- |
| `PageHeader` | 목록, 프로필, 장바구니, 주문 | 화면 제목, 보조 설명, 상위 이동 |
| `ProductCard` | 홈, 상품 목록 | 상품 이미지, 브랜드, 상품명, 가격, 적합도 배지 |
| `FitScoreBadge` | 목록, 상세 | 점수, 신뢰도, 유사 리뷰 수 요약 |
| `ReviewSummaryPanel` | 상품 상세 | 체형 기반 요약, 주의사항, 대표 근거 리뷰 |
| `ReviewCard` | 리뷰 탐색, 상세 요약 근거 | 비식별 리뷰어 라벨, 체형 정보, 핏 평가, 본문 |
| `OptionSelector` | 상품 상세 | 색상/사이즈 선택, 품절 상태 |
| `StoreInventoryList` | 상세, 매장 재고 | 매장명, 거리, 영업 상태, 재고, 랙 위치 |
| `CartItemRow` | 장바구니, 주문 | 상품/옵션/수량/금액 표시 |
| `PriceSummary` | 장바구니, 체크아웃 | 상품 금액, 할인, 최종 금액 |
| `CouponSummary` | 장바구니, 체크아웃 | 자동 적용 쿠폰, 제외 쿠폰 사유 |
| `EmptyState` | 모든 주요 화면 | 빈 상태와 다음 행동 |
| `LoadingState` | 모든 주요 화면 | skeleton과 재시도 없는 로딩 |
| `ErrorState` | 모든 주요 화면 | 재시도 CTA와 오류 메시지 |

## 4. 화면별 설계

### 4.1 홈 `/`

목적:

- 방문자가 서비스의 현재 이벤트와 추천 상품을 훑고 상품 탐색 또는 체형 프로필 등록으로 진입합니다.

주요 데이터:

- 홈 프로모션 데이터
- 추천 상품 목록: `ProductListItemResponse`
- 체형 프로필 상태

프로모션 데이터:

- MVP에서는 정적 데이터 또는 `GET /promotions?placement=home_top` 형태의 별도 API를 사용할 수 있습니다.
- 각 배너는 `promotionId`, `title`, `subtitle`, `image.url`, `image.altText`, `href`, `priority`, `startsAt`, `endsAt`을 가집니다.
- 상품 목록 API와 분리된 CMS/이벤트 데이터로 취급합니다.

화면 구성:

- Header / Global nav
- Hero promotion carousel
- 체형 프로필 등록/수정 CTA
- 추천 상품 섹션
- 인기 상품 또는 신규 상품 섹션
- 이벤트/기획전 보조 섹션

Hero promotion carousel:

- Header 바로 아래에 배치합니다.
- 시즌 이벤트, 기획전, 신규 브랜드, 체형별 큐레이션 페이지로 이동합니다.
- Desktop은 와이드 배너, Mobile은 1장씩 보이는 가로 스와이프 배너로 제공합니다.
- 예시 링크: `/events/spring-outer-fit`, `/events/denim-review-picks`, `/events/new-brand`
- 진행 중인 이벤트가 없으면 영역을 숨기고 추천 상품 섹션을 위로 올립니다.

상태:

- Loading: 캐러셀과 추천 상품 skeleton
- Empty promotion: 캐러셀 숨김
- Error promotion: 캐러셀 숨김, 상품 추천은 계속 표시
- No body profile: 프로필 등록 CTA 강조

주요 CTA:

- 이벤트 배너 선택: 이벤트/기획전 페이지
- `상품 보러가기`: `/products`
- `체형 프로필 등록`: `/profile/body`
- 추천 상품 카드 선택: `/products/:productId`

디자인 메모:

- 홈 캐러셀은 브랜드/이벤트 탐색용이며, `/products`의 검색/필터 상태와 연결하지 않습니다.
- 자동 재생을 적용할 경우 5초 이상 간격을 두고, 사용자가 포커스하거나 조작하면 중지합니다.
- 캐러셀 좌우 버튼, dot indicator, swipe, 키보드 조작을 지원합니다.
- 배너 이미지는 `image.altText`를 사용하되, 배너 문구와 중복되는 장식 이미지는 빈 alt를 허용합니다.

### 4.2 체형 프로필 `/profile/body`

목적:

- 사용자가 체형 적합도와 리뷰 필터링에 필요한 최소 정보를 등록합니다.

주요 데이터:

- `BodyProfile`
- `BodyShape`: `STRAIGHT`, `WAVE`, `NATURAL`, `UNKNOWN`
- `FitPreference`: `SLIM`, `REGULAR`, `LOOSE`
- `ApparelSize`

화면 구성:

- 페이지 제목과 간단한 개인정보 안내
- 키, 몸무게 입력
- 상의/하의 사이즈 선택
- 골격 타입 선택
- 선호 핏 선택
- 체형 정보 활용 동의 체크박스
- 저장 CTA

상태:

- Loading: 기존 프로필 조회 중 폼 skeleton
- Empty: 신규 사용자 기본 빈 폼
- Error: 저장 실패, 조회 실패
- Validation: 필수값 누락, 동의 미체크

주요 CTA:

- `저장하기`
- 저장 완료 후 `/products`로 이동하거나 이전 화면으로 복귀

### 4.3 상품 목록 `/products`

목적:

- 사용자가 검색, 기본 필터, 추천 적합도 토글, 정렬로 상품을 탐색합니다.

주요 데이터:

- `ProductListResponse`
- `FitScore`
- `recommendedFitOnly`
- `Pagination`

화면 구성:

- 검색 입력
- 카테고리/브랜드/가격 필터
- 추천 적합도 토글
- 정렬 선택: 인기순, 최신순, 낮은 가격순, 높은 가격순, 체형 적합도 높은 순
- 상품 카드 그리드
- 페이지네이션 또는 더보기

상품 카드:

- `thumbnail.url` 이미지와 `thumbnail.altText`
- 브랜드, 상품명, 가격
- `FitScoreBadge`
- 유사 체형 리뷰 수
- 체형 프로필 미등록 시 적합도 대신 프로필 등록 유도

상태:

- Loading: 이미지 비율이 고정된 카드 skeleton
- Empty: 검색 결과 없음, 필터 초기화 CTA
- Error: 목록 조회 실패, 재시도 CTA
- No body profile: 추천 적합도 토글 비활성화 또는 프로필 등록 CTA

주요 CTA:

- 상품 카드 선택: `/products/:productId`
- 프로필 등록: `/profile/body`
- 필터 초기화

디자인 메모:

- 상품 목록은 탐색 효율을 우선하며, 홈성 이벤트 캐러셀을 노출하지 않습니다.
- 숫자 기반 체형 적합도 범위 필터는 표시하지 않습니다.
- `recommendedFitOnly=true`는 토글로만 제공합니다.
- 모바일 필터는 바텀시트 또는 전체 화면 패널로 분리합니다.

### 4.4 상품 상세 `/products/:productId`

목적:

- 상품 이미지, 옵션, 체형 적합도, 리뷰 요약, 재고 정보를 한 화면에서 비교하고 장바구니로 이어지게 합니다.

주요 데이터:

- `ProductDetailResponse`
- `FitScore`
- `ReviewSummaryResponse`
- `StoreInventory`
- 선택된 `variantId`

화면 구성:

- 이미지 갤러리
- 브랜드, 상품명, 가격, 소재
- 색상/사이즈 옵션
- 장바구니 CTA
- 체형 적합도 점수와 근거 문장
- 체형 기반 리뷰 요약
- 사이즈/핏 주의사항
- 대표 근거 리뷰
- 매장 재고 미리보기
- 사이즈 실측표

상태:

- Loading: 이미지, 상품 정보, 요약 영역 skeleton
- Error: 상품 조회 실패, 재시도 CTA
- Option sold out: 장바구니 CTA 비활성화
- No body profile: 적합도 영역에 프로필 등록 CTA
- No similar reviews: 전체 리뷰 기반 fallback 표시

주요 CTA:

- `장바구니 담기`
- `비슷한 체형 리뷰 더보기`
- `매장 재고 보기`
- `체형 프로필 등록/수정`

디자인 메모:

- 데스크톱은 이미지와 구매 정보 2컬럼입니다.
- 모바일은 상품 정보 후 옵션/CTA가 끊기지 않게 하단 고정 CTA를 검토합니다.
- 내부 `basisReviewIds`는 표시하지 않습니다.

### 4.5 리뷰 탐색 `/products/:productId/reviews`

목적:

- 사용자가 자신과 비슷한 체형 조건의 리뷰를 직접 찾아봅니다.

주요 데이터:

- `ReviewListResponse`
- 리뷰 필터 쿼리: `heightMin`, `heightMax`, `bodyShape`, `fitPreference`, `purchasedSize`, `fitResult`, `keyword`

화면 구성:

- 상품 요약 헤더
- 리뷰 필터
- 선택된 필터 칩
- 리뷰 목록
- 페이지네이션 또는 더보기

리뷰 카드:

- `reviewerLabel`
- 별점
- 키, 골격 타입, 선호 핏, 구매 사이즈, 핏 평가
- 긍정/부정 키워드
- 리뷰 본문
- 작성일은 사용자 친화 날짜로 표시

상태:

- Loading: 리뷰 카드 skeleton
- Empty: 필터 결과 없음, 필터 초기화 CTA
- Error: 리뷰 조회 실패, 재시도 CTA

주요 CTA:

- 필터 적용
- 필터 초기화
- 상품 상세로 돌아가기

디자인 메모:

- `reviewId`, `userId`는 화면에 표시하지 않습니다.
- 모바일에서는 필터를 접을 수 있는 패널로 제공합니다.

### 4.6 매장 재고 `/products/:productId/stores`

목적:

- 선택한 옵션을 오프라인 매장에서 입어볼 수 있는지 확인합니다.

주요 데이터:

- `StoreInventory`
- 선택된 `variantId`
- 사용자 위치 또는 기본 지역

화면 구성:

- 상품/옵션 요약
- 위치 기준 안내
- 매장 재고 목록
- 매장별 거리, 영업 상태, 재고 상태, 층/존/랙 위치

상태:

- Loading: 매장 목록 skeleton
- Empty: 재고 없음, 온라인 배송 안내
- Error: 재고 조회 실패, 재시도 CTA
- No location permission: 기본 지역 기준 목록 표시

주요 CTA:

- `온라인으로 장바구니 담기`
- 상품 상세로 돌아가기

디자인 메모:

- 정확한 수량은 정책에 따라 `재고 있음`, `소량 남음`, `품절`로 가공할 수 있습니다.
- `lat`, `lng`는 직접 표시하지 않습니다.

### 4.7 장바구니 `/cart`

목적:

- 선택한 상품과 옵션, 자동 적용 쿠폰, 최종 주문 예정 금액을 확인합니다.

주요 데이터:

- `Cart`
- `CartPricing`
- `CouponApplication`
- `ExcludedCoupon`

화면 구성:

- 장바구니 상품 목록
- 수량 변경
- 삭제
- 자동 적용 쿠폰 목록
- 적용 제외 쿠폰과 제외 사유
- 가격 요약
- 주문 CTA

상태:

- Loading: 상품 행과 가격 요약 skeleton
- Empty: 장바구니 비어 있음, 상품 보러가기 CTA
- Error: 장바구니 조회/변경 실패
- Sold out item: 주문 진행 차단
- No coupon: 적용 가능한 쿠폰 없음 안내

주요 CTA:

- `주문하기`
- `상품 보러가기`
- 수량 변경
- 상품 삭제

디자인 메모:

- 데스크톱은 상품 목록과 주문 요약 2컬럼입니다.
- 모바일에서는 가격 요약과 주문 CTA가 화면 하단에서 쉽게 접근 가능해야 합니다.
- 장바구니의 최종 금액과 체크아웃 최종 금액은 일치해야 합니다.

### 4.8 주문 생성 `/checkout`

목적:

- 배송지를 입력하고 장바구니 스냅샷 기준으로 주문을 생성합니다.

주요 데이터:

- `Cart`
- `CartPricing`
- `ShippingAddress`

화면 구성:

- 주문 상품 요약
- 배송지 입력 폼
- 자동 적용 쿠폰과 할인 금액
- 최종 결제 예정 금액
- 주문 생성 CTA

상태:

- Loading: 주문 정보 skeleton
- Error: 주문 생성 실패, 재시도 CTA
- Validation: 배송지 필수값 누락
- Cart changed: 장바구니 금액 변경 안내와 재계산

주요 CTA:

- `주문 생성`
- `장바구니로 돌아가기`

디자인 메모:

- 실제 결제 입력 UI는 제공하지 않습니다.
- 주문 생성 후 `/orders/:orderNumber`로 이동합니다.

### 4.9 주문 완료/상세 `/orders/:orderNumber`

목적:

- 주문이 생성되었음을 확인하고 주문번호, 상품, 배송지, 금액, 상태를 보여줍니다.

주요 데이터:

- `Order`
- `orderNumber`
- `OrderStatus`

화면 구성:

- 주문 완료 메시지
- 주문 번호
- 주문 상태
- 주문 상품
- 배송지
- 할인 내역
- 최종 금액

상태:

- Loading: 주문 상세 skeleton
- Error: 주문 조회 실패, 재시도 CTA
- Not found: 주문을 찾을 수 없음

주요 CTA:

- `주문 내역 보기`
- `계속 쇼핑하기`

디자인 메모:

- URL과 화면에는 `orderNumber`를 사용합니다.
- 내부 `orderId`는 표시하지 않습니다.

### 4.10 주문 내역 `/me/orders`

목적:

- 사용자가 생성한 주문 목록을 확인하고 상세로 이동합니다.

주요 데이터:

- 주문 목록
- `orderNumber`
- `OrderStatus`

화면 구성:

- 주문 목록
- 주문 상태
- 주문 상품 요약
- 최종 금액
- 주문 상세 진입

상태:

- Loading: 주문 카드 skeleton
- Empty: 주문 내역 없음, 상품 보러가기 CTA
- Error: 주문 내역 조회 실패, 재시도 CTA

주요 CTA:

- 주문 상세 보기: `/orders/:orderNumber`
- 상품 보러가기: `/products`

## 5. 디자인 우선순위

1. 홈 `/`
2. 상품 목록 `/products`
3. 상품 상세 `/products/:productId`
4. 장바구니 `/cart`
5. 주문 생성 `/checkout`
6. 주문 완료/상세 `/orders/:orderNumber`
7. 체형 프로필 `/profile/body`
8. 리뷰 탐색 `/products/:productId/reviews`
9. 매장 재고 `/products/:productId/stores`
10. 주문 내역 `/me/orders`

## 6. 필수 상태 체크리스트

- [ ] 체형 프로필 미등록
- [ ] 유사 체형 리뷰 없음
- [ ] 리뷰 필터 결과 없음
- [ ] 상품 검색 결과 없음
- [ ] 선택 옵션 품절
- [ ] 매장 재고 없음
- [ ] 장바구니 비어 있음
- [ ] 적용 가능한 쿠폰 없음
- [ ] 주문 생성 실패
- [ ] 주문 내역 없음
- [ ] 주요 조회 API 실패
- [ ] 모바일에서 CTA가 화면 밖으로 밀리지 않음
- [ ] 홈 캐러셀 키보드 조작, swipe, indicator

## 7. 디자인 산출물 기준

- 각 화면은 Desktop과 Mobile 시안을 모두 준비합니다.
- 주요 화면은 Loading, Empty, Error 중 최소 하나 이상의 상태 시안을 함께 준비합니다.
- 상품 목록과 상품 상세에는 체형 프로필 등록 전/후 상태를 모두 준비합니다.
- 장바구니와 체크아웃은 쿠폰 적용/미적용 상태를 모두 준비합니다.
- 리뷰 관련 화면은 내부 ID가 보이지 않는지 확인합니다.
