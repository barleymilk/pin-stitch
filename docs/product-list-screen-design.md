# 상품 목록 화면 디자인 `/products`

이 문서는 `pin-stitch` 고객 상품 목록 화면의 디자인 명세입니다. 상위 기준은 `screen-design-plan.md`, 컴포넌트 기준은 `component-inventory.md`, 시각 기준은 `ui-guidelines.md`를 따릅니다.

## 1. 화면 목표

- 사용자가 상품을 빠르게 훑고, 체형 적합도와 유사 체형 리뷰 수를 기준으로 상세 진입 여부를 판단하게 합니다.
- 검색, 기본 필터, 추천 적합도 토글, 정렬을 한 화면에서 부담 없이 조작하게 합니다.
- 체형 프로필이 없는 사용자는 적합도 정보 대신 프로필 등록으로 자연스럽게 이동하게 합니다.

## 2. 주요 데이터

API:

```text
GET /products
```

Query:

- `q`
- `category`
- `brandId`
- `minPrice`
- `maxPrice`
- `recommendedFitOnly`
- `sort`
- `page`
- `limit`

Response:

- `ProductListResponse`
- `ProductListItemResponse`
- `FitScore`
- `Pagination`

## 3. 데스크톱 레이아웃

최대 너비:

- `1200px`

구조:

```text
┌────────────────────────────────────────────────────────────┐
│ Header / Global nav                                        │
├────────────────────────────────────────────────────────────┤
│ PageHeader                                                 │
│ "나와 비슷한 체형이 만족한 상품"                           │
│ Body profile state / profile CTA                           │
├────────────────────────────────────────────────────────────┤
│ Search input                                               │
├────────────────────────────────────────────────────────────┤
│ Filter row                                                 │
│ Category | Brand | Price | Recommended fit toggle | Sort   │
├────────────────────────────────────────────────────────────┤
│ Selected filter chips / result count                       │
├────────────────────────────────────────────────────────────┤
│ Product grid                                               │
│ 4 columns on desktop                                       │
│ ProductCard ProductCard ProductCard ProductCard            │
│ ProductCard ProductCard ProductCard ProductCard            │
├────────────────────────────────────────────────────────────┤
│ Pagination or Load more                                    │
└────────────────────────────────────────────────────────────┘
```

Spacing:

- Page vertical gap: `32px`
- Header to search gap: `24px`
- Search to filter gap: `16px`
- Filter to grid gap: `24px`
- Card grid gap: `20px`

## 4. 모바일 레이아웃

구조:

```text
┌──────────────────────────────┐
│ Compact header               │
├──────────────────────────────┤
│ Page title                   │
│ Body profile CTA if needed   │
├──────────────────────────────┤
│ Search input                 │
├──────────────────────────────┤
│ Filter button | Sort select  │
│ Recommended fit toggle       │
├──────────────────────────────┤
│ Selected filter chips        │
├──────────────────────────────┤
│ 2-column product grid        │
│ ProductCard ProductCard      │
│ ProductCard ProductCard      │
└──────────────────────────────┘
```

Mobile rules:

- 필터 상세는 바텀시트 또는 전체 화면 패널로 엽니다.
- 상품 카드는 2컬럼을 기본으로 하되, 360px 이하에서는 카드 텍스트가 넘치지 않게 1컬럼 전환을 허용합니다.
- 추천 적합도 토글은 체형 프로필이 없으면 비활성화하고 프로필 등록 안내를 표시합니다.

## 5. 화면 영역 상세

### 5.1 PageHeader

Title:

```text
나와 비슷한 체형이 만족한 상품
```

Description:

```text
체형 프로필과 리뷰 데이터를 바탕으로 맞는 상품을 먼저 보여드려요.
```

체형 프로필 등록 사용자:

- 작은 상태 텍스트: `162cm · WAVE · REGULAR 기준`
- 보조 링크: `프로필 수정`

체형 프로필 미등록 사용자:

- 안내 텍스트: `체형 프로필을 등록하면 적합도 높은 상품을 먼저 볼 수 있어요.`
- CTA: `체형 프로필 등록`

### 5.2 Search

Component:

- `Input`

Placeholder:

```text
상품명, 브랜드, 카테고리 검색
```

Behavior:

- Enter 또는 검색 아이콘 클릭 시 `q`를 갱신합니다.
- 검색어가 있으면 선택 필터 칩 영역에 `검색: {q}`를 표시합니다.

### 5.3 Filter row

Desktop controls:

- Category select
- Brand select
- Price range select or compact min/max inputs
- Recommended fit toggle
- Sort select

Mobile controls:

- `필터` button
- Sort select
- Recommended fit toggle

Category options:

- 전체
- OUTER
- TOP
- BOTTOM
- DRESS
- SKIRT
- KNIT

Sort options:

| Label | Value |
| --- | --- |
| 인기순 | `popular` |
| 최신순 | `newest` |
| 낮은 가격순 | `price_asc` |
| 높은 가격순 | `price_desc` |
| 체형 적합도 높은 순 | `fit_score_desc` |

Recommended fit toggle:

- Label: `추천 적합도만`
- Description: `점수, 유사 리뷰 수, 신뢰도를 함께 만족한 상품`
- Query: `recommendedFitOnly=true`
- Disabled when body profile is missing

### 5.4 Selected filter chips

Examples:

- `검색: 재킷`
- `카테고리: OUTER`
- `브랜드: Muguet`
- `가격: 50,000원-100,000원`
- `추천 적합도만`

Actions:

- 개별 칩 제거
- `필터 초기화`

### 5.5 ProductCard

Data:

- `productId`
- `brandName`
- `name`
- `thumbnail.url`
- `thumbnail.altText`
- `price`
- `fitScore`

Layout:

```text
┌────────────────────────┐
│ Image 4:5              │
│ Fit score badge        │
├────────────────────────┤
│ Brand                  │
│ Product name           │
│ Price                  │
│ Similar reviews text   │
└────────────────────────┘
```

Image:

- Aspect ratio: `4 / 5`
- Radius: `8px`
- `alt`: `thumbnail.altText`

Fit score badge states:

| State | Display |
| --- | --- |
| `HIGH` | `적합도 86 · 신뢰 높음` |
| `MEDIUM` | `적합도 78 · 신뢰 보통` |
| `LOW` | `적합도 62 · 참고용` |
| No body profile | `프로필 등록 후 확인` |
| No fit score | `리뷰 데이터 부족` |

Text rules:

- Brand: `text-xs`, muted
- Product name: `text-sm`, max 2 lines
- Price: `text-base`, strong
- Similar reviews: `text-xs`, muted

Click behavior:

- Card click: `/products/:productId`
- Keyboard: card must be focusable as a link

## 6. 상태 디자인

### 6.1 Loading

- Search/filter 영역은 고정 표시합니다.
- Product grid는 8개 카드 skeleton을 표시합니다.
- 카드 skeleton은 이미지 영역 4:5 비율을 유지합니다.

### 6.2 Empty

Title:

```text
조건에 맞는 상품이 없어요
```

Description:

```text
검색어나 필터를 조금 넓혀보세요.
```

CTA:

- `필터 초기화`

### 6.3 Error

Title:

```text
상품을 불러오지 못했어요
```

Description:

```text
잠시 후 다시 시도해 주세요.
```

CTA:

- `다시 시도`

### 6.4 No body profile

Placement:

- PageHeader 아래 또는 추천 적합도 토글 옆

Message:

```text
체형 프로필을 등록하면 적합도 높은 상품을 먼저 볼 수 있어요.
```

CTA:

- `체형 프로필 등록`

Behavior:

- `recommendedFitOnly` 토글 비활성화
- `sort=fit_score_desc` 선택 시 프로필 등록 안내를 먼저 보여줍니다.

## 7. Interaction

- 검색어 변경 후 제출하면 `page=1`로 초기화합니다.
- 필터 변경 시 `page=1`로 초기화합니다.
- 정렬 변경 시 현재 필터는 유지합니다.
- `recommendedFitOnly`는 체형 프로필이 있을 때만 활성화합니다.
- 필터 초기화는 `q`, `category`, `brandId`, `minPrice`, `maxPrice`, `recommendedFitOnly`를 초기화하고 `sort`는 `popular`로 되돌립니다.
- 상품 카드 진입 후 뒤로 오면 검색/필터/정렬 상태를 유지합니다.

## 8. Accessibility

- 검색 input에는 명확한 label을 제공합니다.
- 필터 버튼은 현재 적용된 필터 수를 텍스트로 알려줍니다.
- 상품 이미지는 `thumbnail.altText`를 사용합니다.
- 상품 카드는 링크로 동작하며 키보드 포커스가 보여야 합니다.
- 적합도 badge는 색상만으로 의미를 구분하지 않고 텍스트를 함께 사용합니다.
- 추천 적합도 토글이 비활성화된 이유를 보조 텍스트로 제공합니다.

## 9. 디자인 체크리스트

- [ ] Desktop 4컬럼 상품 그리드
- [ ] Mobile 2컬럼 상품 그리드
- [ ] 360px 이하에서 텍스트 넘침 없음
- [ ] 검색/필터/정렬/추천 적합도 토글 상태
- [ ] 선택된 필터 칩과 필터 초기화
- [ ] 체형 프로필 있음/없음 상태
- [ ] FitScore `HIGH`, `MEDIUM`, `LOW`, 없음 상태
- [ ] Loading skeleton
- [ ] Empty state
- [ ] Error state
- [ ] 상품 이미지 `altText`
- [ ] 키보드 포커스와 카드 링크 접근성
