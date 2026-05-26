# 상품 상세 화면 디자인 `/products/:productId`

이 문서는 `pin-stitch` 고객 상품 상세 화면의 디자인 명세입니다. 상위 기준은 `../screen-design-plan.md`, 컴포넌트 기준은 `../component-inventory.md`, 시각 기준은 `../ui-guidelines.md`를 따릅니다.

## 1. 화면 목표

- 사용자가 상품 이미지, 옵션, 가격, 체형 적합도, 리뷰 요약을 한 화면에서 비교하고 구매 판단을 내리게 합니다.
- 체형 적합도는 점수만 보여주지 않고 유사 리뷰 수, 신뢰도, 주의사항, 대표 근거 리뷰와 함께 설명합니다.
- 옵션 선택 후 장바구니 담기까지 끊기지 않게 이어지도록 합니다.
- 매장 재고와 리뷰 탐색은 보조 행동으로 제공하되, 구매 CTA를 방해하지 않습니다.

## 2. 주요 데이터

Product:

```text
GET /products/:productId
```

- Response `data`: `ProductDetailResponse`
- 사용 필드: `productId`, `brandName`, `name`, `description`, `images`, `price`, `material`, `variants`, `fitScore`
- 상품 이미지는 `images[].url`, `images[].altText`, `images[].sortOrder`를 사용합니다.

Review summary:

```text
GET /products/:productId/review-summary
```

- Response `data`: `ReviewSummaryResponse`
- 사용자 화면에는 `basisReviewIds`, `reviewId`, `userId`를 노출하지 않습니다.
- 요약에 사용된 체형 조건, 키워드, 주의사항, 대표 근거 리뷰만 표시합니다.

Store inventory:

```text
GET /products/:productId/store-inventory?variantId={variantId}
```

- Response `data`: `StoreInventory[]`
- 상세 화면에서는 상위 2-3개 매장만 미리보기로 표시하고 전체 목록은 `/products/:productId/stores`로 이동합니다.

Cart:

```text
POST /cart/items
```

- 선택한 `variantId`, `quantity`로 장바구니에 담습니다.

## 3. 데스크톱 레이아웃

최대 너비:

- `1200px`

구조:

```text
┌────────────────────────────────────────────────────────────┐
│ Header / Global nav                                        │
├──────────────────────────────┬─────────────────────────────┤
│ Image gallery                │ Product purchase panel      │
│ Main image                   │ Brand / name / price        │
│ Thumbnail rail               │ Fit score summary           │
│                              │ Color / size / quantity     │
│                              │ Cart CTA                    │
├──────────────────────────────┴─────────────────────────────┤
│ Review summary panel                                       │
├────────────────────────────────────────────────────────────┤
│ Size and material detail                                   │
├────────────────────────────────────────────────────────────┤
│ Store inventory preview                                    │
├────────────────────────────────────────────────────────────┤
│ Representative reviews                                     │
└────────────────────────────────────────────────────────────┘
```

Desktop rules:

- 상단은 이미지 갤러리와 구매 패널 2컬럼입니다.
- 이미지 컬럼은 56%, 구매 패널은 44% 정도로 시작합니다.
- 구매 패널은 데스크톱에서 상단 영역 안에서만 sticky를 검토할 수 있습니다.
- 상세 설명, 리뷰 요약, 매장 재고는 구매 패널 아래의 full-width 섹션으로 배치합니다.

## 4. 모바일 레이아웃

구조:

```text
┌──────────────────────────────┐
│ Compact header               │
├──────────────────────────────┤
│ Image carousel               │
├──────────────────────────────┤
│ Brand / name / price         │
│ Fit score summary            │
├──────────────────────────────┤
│ Color / size / quantity      │
├──────────────────────────────┤
│ Review summary panel         │
├──────────────────────────────┤
│ Size and material detail     │
├──────────────────────────────┤
│ Store inventory preview      │
├──────────────────────────────┤
│ Representative reviews       │
├──────────────────────────────┤
│ Bottom fixed cart CTA        │
└──────────────────────────────┘
```

Mobile rules:

- 이미지 갤러리는 가로 스와이프 캐러셀로 제공합니다.
- 옵션 선택 이후에도 장바구니 CTA가 쉽게 보이도록 하단 고정 CTA를 사용합니다.
- 하단 고정 CTA는 콘텐츠를 가리지 않도록 본문 하단 padding을 확보합니다.
- 옵션 선택 패널이 길어지면 사이즈 선택을 바텀시트로 분리할 수 있습니다.

## 5. 화면 영역 상세

### 5.1 Image gallery

Data:

- `images[].url`
- `images[].altText`
- `images[].sortOrder`

Rules:

- `sortOrder` 오름차순으로 표시합니다.
- 첫 이미지를 기본 메인 이미지로 사용합니다.
- 이미지 비율은 `4 / 5`를 기본으로 유지합니다.
- 모든 상품 이미지는 `altText`를 `alt` 값으로 사용합니다.
- 이미지가 없으면 상품명 기반 placeholder와 `이미지를 준비 중입니다` 문구를 표시합니다.

Desktop:

- 큰 메인 이미지와 썸네일 rail을 제공합니다.
- 썸네일은 선택 상태를 테두리와 스크린리더 텍스트로 함께 표시합니다.

Mobile:

- swipe, dot indicator, 현재 위치 텍스트를 제공합니다.
- 확대 보기 기능은 P1로 미룹니다.

### 5.2 Product purchase panel

Content:

- 브랜드명
- 상품명
- 가격
- 소재 요약
- 간단 설명
- `FitScoreBadge`
- 색상 선택
- 사이즈 선택
- 수량 선택
- 장바구니 CTA

CTA states:

| State | Display |
| --- | --- |
| No option selected | `옵션을 선택해 주세요` |
| Available | `장바구니 담기` |
| Sold out | `품절` |
| Adding | `담는 중` |
| Added | `장바구니에 담았어요` |

Behavior:

- 색상 변경 시 선택 가능한 사이즈를 갱신합니다.
- 품절 옵션은 선택은 가능하되 장바구니 CTA를 비활성화하고 `품절`을 표시합니다.
- 장바구니 담기 성공 후 mini toast 또는 inline success를 표시합니다.

### 5.3 Fit score summary

체형 프로필 등록 사용자:

- `FitScoreBadge`
- 점수와 신뢰도
- 유사 체형 리뷰 수
- 짧은 근거 문장
- CTA: `비슷한 체형 리뷰 보기`

체형 프로필 미등록 사용자:

- Title: `체형 프로필을 등록하면 적합도를 볼 수 있어요`
- Description: `키, 사이즈, 선호 핏을 바탕으로 비슷한 체형 리뷰를 먼저 보여드려요.`
- CTA: `체형 프로필 등록`

No similar reviews:

- Title: `비슷한 체형 리뷰가 아직 부족해요`
- Description: `전체 리뷰와 상품 정보를 기준으로 참고해 주세요.`
- CTA: `전체 리뷰 보기`

Rules:

- 점수만 단독으로 크게 강조하지 않습니다.
- `LOW` 신뢰도는 `참고용` 문구와 함께 표시합니다.
- 내부 계산 근거 ID는 표시하지 않습니다.

### 5.4 Review summary panel

Data:

- `ReviewSummaryResponse`
- 체형 조건
- `matchedReviewCount`
- 긍정 키워드
- 부정 키워드
- 사이즈/핏 주의사항
- 대표 근거 리뷰

Layout:

```text
┌────────────────────────────────────────────────────────────┐
│ 비슷한 체형 리뷰 요약                                      │
│ 기준: 160-165cm · WAVE · REGULAR                          │
│ 긍정 키워드 | 부정 키워드                                  │
│ 사이즈/핏 주의사항                                        │
│ Representative review cards                               │
│ CTA: 비슷한 체형 리뷰 더보기                              │
└────────────────────────────────────────────────────────────┘
```

Rules:

- `basisReviewIds`, `reviewId`, `userId`는 표시하지 않습니다.
- 대표 근거 리뷰는 `reviewerLabel`과 비식별 체형 정보만 표시합니다.
- 요약 문장은 확정적 표현보다 `경향`, `많았어요`, `주의해 주세요` 같은 표현을 사용합니다.

### 5.5 Option selector

Color:

- 색상명과 swatch를 함께 표시합니다.
- 색상 선택 시 이미지가 색상별로 준비되어 있으면 첫 관련 이미지로 이동합니다.

Size:

- `XS`, `S`, `M`, `L`, `XL` 등 `ApparelSize`를 사용합니다.
- 품절 사이즈는 disabled 스타일과 `품절` 텍스트를 함께 표시합니다.
- 선택한 사이즈가 리뷰 요약의 주의사항과 관련 있으면 짧은 안내를 표시합니다.

Quantity:

- stepper로 제공합니다.
- 최소 수량은 `1`입니다.
- 재고 정책상 최대 수량 제한이 있으면 초과 선택을 막습니다.

### 5.6 Size and material detail

Content:

- 소재
- 세탁/관리 요약
- 사이즈 실측표
- 모델 착용 정보가 있으면 보조 정보로 표시

Rules:

- 사이즈 실측표는 데스크톱에서는 table, 모바일에서는 가로 스크롤 table을 사용합니다.
- 실측 단위는 `cm`로 통일합니다.
- 정보가 없으면 섹션을 숨기거나 `상세 정보 준비 중` 상태를 표시합니다.

### 5.7 Store inventory preview

Data:

- `StoreInventory[]`
- 선택된 `variantId`

Rules:

- 옵션이 선택되지 않았으면 `옵션을 선택하면 매장 재고를 확인할 수 있어요`를 표시합니다.
- 옵션 선택 후 상위 2-3개 매장을 보여줍니다.
- 매장명, 거리, 영업 상태, 재고 상태, 층/존/랙 위치를 표시합니다.
- 정확한 재고 수량 대신 `재고 있음`, `소량 남음`, `품절` 같은 사용자 친화 상태를 우선합니다.
- `lat`, `lng`는 화면에 직접 표시하지 않습니다.

CTA:

- `매장 재고 더보기` -> `/products/:productId/stores`

### 5.8 Representative reviews

Purpose:

- 리뷰 요약 패널의 근거를 보강하고 리뷰 탐색 화면으로 이어지게 합니다.

Content:

- 대표 리뷰 2-3개
- `reviewerLabel`
- 별점
- 키, 골격 타입, 선호 핏, 구매 사이즈, 핏 평가
- 긍정/부정 키워드
- 본문 일부

CTA:

- `비슷한 체형 리뷰 더보기` -> `/products/:productId/reviews`

Rules:

- 내부 `reviewId`, `userId`는 표시하지 않습니다.
- 긴 본문은 3-4줄로 접고 리뷰 탐색 화면에서 전체 확인하게 합니다.

## 6. 상태 디자인

### 6.1 Loading

- 이미지 영역은 `4 / 5` 비율 skeleton을 유지합니다.
- 구매 패널은 브랜드/상품명/가격/옵션/CTA skeleton을 표시합니다.
- 리뷰 요약과 매장 재고는 독립 skeleton을 표시합니다.

### 6.2 Product not found

Title:

```text
상품을 찾을 수 없어요
```

CTA:

- `상품 목록으로`

### 6.3 Product error

Title:

```text
상품 정보를 불러오지 못했어요
```

CTA:

- `다시 시도`

### 6.4 Review summary empty

Title:

```text
아직 요약할 리뷰가 부족해요
```

Description:

```text
전체 리뷰가 쌓이면 체형별 요약을 보여드릴게요.
```

CTA:

- `전체 리뷰 보기`

### 6.5 Store inventory empty

- 옵션 미선택: 옵션 선택 안내
- 선택 옵션 재고 없음: `가까운 매장 재고가 없어요`
- 위치 권한 없음: 기본 지역 또는 전체 매장 기준으로 표시

### 6.6 Add to cart error

- 장바구니 담기 실패 시 CTA 아래 inline error를 표시합니다.
- 재고 변경으로 실패하면 옵션 재선택 안내를 표시합니다.

## 7. Interaction

- 이미지 썸네일 클릭 또는 swipe로 메인 이미지를 변경합니다.
- 옵션 변경 시 CTA 상태와 매장 재고 미리보기를 갱신합니다.
- 장바구니 담기 성공 후 `장바구니 보기` 보조 액션을 제공합니다.
- 리뷰 요약의 CTA는 현재 상품의 리뷰 탐색 화면으로 이동합니다.
- 매장 재고 CTA는 선택된 `variantId`를 유지해 이동합니다.
- 뒤로 가기 시 상품 목록의 검색/필터/정렬 상태가 유지되어야 합니다.

## 8. Accessibility

- 상품 이미지는 `images[].altText`를 사용합니다.
- 이미지 캐러셀은 현재 이미지 위치를 스크린리더 텍스트로 제공합니다.
- 색상 swatch는 색상명 텍스트를 함께 제공합니다.
- 사이즈 옵션은 선택/품절 상태가 스크린리더에 전달되어야 합니다.
- 수량 stepper는 현재 수량과 증감 버튼 label을 제공합니다.
- 하단 고정 CTA는 키보드 포커스 순서를 어지럽히지 않아야 합니다.
- 리뷰 요약은 색상만으로 긍정/부정을 구분하지 않고 텍스트 label을 함께 사용합니다.

## 9. 디자인 체크리스트

- [ ] Desktop 이미지/구매 패널 2컬럼
- [ ] Mobile 이미지 캐러셀
- [ ] Mobile 하단 고정 장바구니 CTA
- [ ] 상품 이미지 `images[].altText`
- [ ] 색상/사이즈/수량 옵션 상태
- [ ] 품절 옵션 상태
- [ ] FitScore `HIGH`, `MEDIUM`, `LOW`, 없음 상태
- [ ] 체형 프로필 있음/없음 상태
- [ ] `ReviewSummaryResponse` 기반 리뷰 요약
- [ ] 내부 `basisReviewIds`, `reviewId`, `userId` 미노출
- [ ] 매장 재고 미리보기
- [ ] Loading skeleton
- [ ] Product not found state
- [ ] Review summary empty state
- [ ] Add to cart error state
- [ ] 360px 이하에서 텍스트 넘침 없음
