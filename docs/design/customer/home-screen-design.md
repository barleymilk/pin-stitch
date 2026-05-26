# 홈 화면 디자인 `/`

이 문서는 `pin-stitch` 고객 홈 화면의 디자인 명세입니다. 상위 기준은 `../screen-design-plan.md`, 컴포넌트 기준은 `../component-inventory.md`, 시각 기준은 `../ui-guidelines.md`를 따릅니다.

## 1. 화면 목표

- 방문자가 현재 이벤트, 추천 상품, 체형 프로필 등록 가치를 빠르게 이해하게 합니다.
- 상품 목록 `/products`로 자연스럽게 진입시키되, 홈에서는 검색/필터보다 큐레이션을 우선합니다.
- 체형 프로필이 없는 사용자는 등록 CTA를 명확히 보고, 등록한 사용자는 개인화 추천으로 이어지게 합니다.

## 2. 주요 데이터

Promotion:

- MVP에서는 정적 데이터 또는 `GET /promotions?placement=home_top` 형태의 별도 API를 사용할 수 있습니다.
- 각 배너는 `promotionId`, `title`, `subtitle`, `image.url`, `image.altText`, `href`, `priority`, `startsAt`, `endsAt`을 가집니다.
- 상품 목록 API와 분리된 CMS/이벤트 데이터로 취급합니다.

Recommended products:

```text
GET /products?sort=fit_score_desc&limit=8
```

- 체형 프로필이 있으면 개인화 추천 상품으로 표시합니다.
- 체형 프로필이 없으면 `popular` 또는 `newest` 기준의 일반 추천 상품으로 표시합니다.
- 응답 타입은 `ProductListResponse`, `ProductListItemResponse`를 재사용합니다.

Body profile state:

- 체형 프로필 있음
- 체형 프로필 없음

## 3. 데스크톱 레이아웃

최대 너비:

- `1200px`

구조:

```text
┌────────────────────────────────────────────────────────────┐
│ Header / Global nav                                        │
├────────────────────────────────────────────────────────────┤
│ Hero promotion carousel                                    │
│ Event / campaign banner                                    │
├────────────────────────────────────────────────────────────┤
│ Profile CTA band                                           │
│ Body profile state / profile CTA                           │
├────────────────────────────────────────────────────────────┤
│ Recommended products                                       │
│ ProductCard ProductCard ProductCard ProductCard            │
├────────────────────────────────────────────────────────────┤
│ Popular or new products                                    │
│ ProductCard ProductCard ProductCard ProductCard            │
├────────────────────────────────────────────────────────────┤
│ Event collection links                                     │
└────────────────────────────────────────────────────────────┘
```

Spacing:

- Header to carousel gap: `16px`
- Carousel to profile CTA gap: `32px`
- Section vertical gap: `40px`
- Section title to content gap: `16px`
- Product card gap: `20px`

## 4. 모바일 레이아웃

구조:

```text
┌──────────────────────────────┐
│ Compact header               │
├──────────────────────────────┤
│ Hero promotion carousel      │
├──────────────────────────────┤
│ Profile CTA band             │
├──────────────────────────────┤
│ Recommended products         │
│ ProductCard ProductCard      │
├──────────────────────────────┤
│ Popular or new products      │
│ ProductCard ProductCard      │
├──────────────────────────────┤
│ Event collection links       │
└──────────────────────────────┘
```

Mobile rules:

- 캐러셀은 1장씩 보이는 가로 스와이프 형태로 제공합니다.
- 상품 카드는 2컬럼을 기본으로 하되, 360px 이하에서는 1컬럼 전환을 허용합니다.
- 섹션별 `전체보기` 링크는 우측 상단 또는 섹션 하단에 배치합니다.
- 프로필 CTA는 화면 상단에서 한 번만 강하게 노출하고, 하단에서는 반복하지 않습니다.

## 5. 화면 영역 상세

### 5.1 Hero promotion carousel

Purpose:

- 시즌 이벤트, 기획전, 신규 브랜드, 체형별 큐레이션 페이지로 이동하는 홈 최상단 영역입니다.

Placement:

- `Header / Global nav` 바로 아래

Desktop layout:

```text
┌────────────────────────────────────────────────────────────┐
│ Wide banner 1200 x 320                                     │
│ [Image background]                                         │
│ Title / Subtitle / CTA                                     │
│ Prev button                              Next button       │
│ Dots                                                       │
└────────────────────────────────────────────────────────────┘
```

Mobile layout:

```text
┌──────────────────────────────┐
│ Banner image                 │
│ Title                        │
│ CTA                          │
└──────────────────────────────┘
```

Content examples:

| Title | Subtitle | CTA | href |
| --- | --- | --- | --- |
| 봄 아우터 체형별 추천 | 비슷한 체형이 오래 입은 아우터만 모았어요 | 보러가기 | `/events/spring-outer-fit` |
| 리뷰 많은 데님 기획전 | 사이즈 고민이 적은 하의를 먼저 확인하세요 | 둘러보기 | `/events/denim-review-picks` |
| 신규 브랜드 오픈 | 첫 구매 혜택과 함께 새로운 핏을 찾아보세요 | 혜택 보기 | `/events/new-brand` |

Design rules:

- 배너는 이미지 중심으로 구성하고, 텍스트는 좌측 또는 하단에 배치합니다.
- 텍스트 영역은 별도 카드처럼 보이지 않게 이미지 위 오버레이로 처리합니다.
- 높이: desktop `320px`, tablet `240px`, mobile `180px`
- Radius: `8px`
- CTA는 짧은 링크 버튼으로 제공하되, 전체 배너도 링크로 동작할 수 있습니다.

Behavior:

- 자동 재생은 선택 사항이며, 적용 시 5초 이상 간격을 둡니다.
- 사용자가 캐러셀에 포커스하거나 마우스를 올리면 자동 재생을 멈춥니다.
- 좌우 버튼, dot indicator, swipe를 지원합니다.
- 배너 클릭 시 `href`로 이동합니다.

Fallback:

- 진행 중인 이벤트가 없으면 캐러셀 영역을 숨깁니다.
- 이미지 로딩 실패 시 배경색과 텍스트만으로도 링크 의미가 전달되게 합니다.

### 5.2 Profile CTA band

체형 프로필 등록 사용자:

- Title: `내 체형 기준 추천을 확인해 보세요`
- Description: `162cm · WAVE · REGULAR 기준으로 잘 맞을 가능성이 높은 상품을 모았어요.`
- CTA: `추천 상품 보기`
- Secondary action: `프로필 수정`

체형 프로필 미등록 사용자:

- Title: `체형 프로필을 등록하면 실패 확률을 줄일 수 있어요`
- Description: `키, 사이즈, 선호 핏을 바탕으로 비슷한 체형의 리뷰와 상품 적합도를 보여드려요.`
- CTA: `체형 프로필 등록`
- Secondary action: `상품 먼저 둘러보기`

Behavior:

- `추천 상품 보기`: 추천 상품 섹션으로 스크롤하거나 `/products?sort=fit_score_desc`로 이동합니다.
- `체형 프로필 등록`: `/profile/body`
- `상품 먼저 둘러보기`: `/products`

### 5.3 Recommended products

체형 프로필 등록 사용자:

- Section title: `내 체형에 잘 맞을 가능성이 높은 상품`
- Query: `GET /products?sort=fit_score_desc&limit=8`
- Product card: `ProductCard`
- CTA: `전체보기` -> `/products?sort=fit_score_desc`

체형 프로필 미등록 사용자:

- Section title: `많이 둘러본 상품`
- Query: `GET /products?sort=popular&limit=8`
- Product card에서는 적합도 대신 `프로필 등록 후 확인` 상태를 사용합니다.
- CTA: `전체보기` -> `/products?sort=popular`

Product card rules:

- 홈에서도 상품 이미지는 `thumbnail.altText`를 사용합니다.
- 카드 클릭은 `/products/:productId`로 이동합니다.
- 홈 상품 카드는 목록 화면보다 정보 밀도를 낮추고, 브랜드/상품명/가격/적합도 배지만 표시합니다.

### 5.4 Popular or new products

Purpose:

- 사용자가 체형 추천이 아니더라도 넓게 상품을 탐색할 수 있는 두 번째 상품 섹션입니다.

Default:

- Section title: `새로 들어온 상품`
- Query: `GET /products?sort=newest&limit=8`
- CTA: `신상품 전체보기` -> `/products?sort=newest`

Alternative:

- 이벤트 기간에는 `이번 주 인기 상품`으로 바꾸고 `GET /products?sort=popular&limit=8`을 사용할 수 있습니다.

### 5.5 Event collection links

Purpose:

- Hero carousel에 담지 못한 기획전이나 카테고리 탐색 진입점을 제공합니다.

Layout:

- Desktop: 3컬럼 링크 카드
- Mobile: 가로 스크롤 또는 1컬럼 목록

Examples:

- `하객룩 기획전`
- `리뷰 많은 하의`
- `출근룩 니트`
- `매장 재고 있는 상품`

Behavior:

- 링크는 `/events/:eventId` 또는 `/products`의 쿼리 URL로 이동합니다.
- 상품 목록으로 이동하는 경우 필터가 적용된 상태로 진입합니다.

## 6. 상태 디자인

### 6.1 Loading

- Hero carousel skeleton은 실제 배너 비율을 유지합니다.
- Profile CTA band는 텍스트 skeleton과 CTA skeleton을 표시합니다.
- 상품 섹션은 4개 또는 8개 카드 skeleton을 표시합니다.

### 6.2 Empty promotion

- Hero carousel을 숨기고 Profile CTA band를 첫 번째 콘텐츠로 올립니다.
- 별도 빈 상태 문구는 표시하지 않습니다.

### 6.3 Empty products

Title:

```text
추천할 상품을 준비 중이에요
```

Description:

```text
전체 상품에서 먼저 둘러볼 수 있어요.
```

CTA:

- `상품 보러가기`

### 6.4 Error

- 프로모션 조회 실패는 캐러셀만 숨기고 홈 전체 에러로 만들지 않습니다.
- 상품 조회 실패 시 해당 섹션에만 `다시 시도` CTA를 표시합니다.
- 체형 프로필 조회 실패 시 일반 홈 상태로 표시하고 프로필 CTA를 제공합니다.

## 7. Interaction

- 캐러셀 배너 클릭은 지정된 `href`로 이동합니다.
- 캐러셀 자동 재생을 사용하는 경우 사용자의 수동 조작 이후에는 현재 세션에서 자동 넘김을 중지합니다.
- `전체보기`는 해당 섹션의 정렬/필터 조건을 유지한 `/products` URL로 이동합니다.
- 상품 카드 진입 후 뒤로 오면 홈 스크롤 위치를 가능한 유지합니다.
- 체형 프로필 저장 후 홈으로 돌아오면 추천 상품 섹션은 개인화 기준으로 다시 조회합니다.

## 8. Accessibility

- 캐러셀은 `region`과 접근 가능한 이름, 예를 들어 `홈 이벤트`를 제공합니다.
- 캐러셀 좌우 버튼은 `이전 이벤트`, `다음 이벤트`처럼 목적이 드러나는 label을 가집니다.
- 현재 배너 위치를 dot indicator와 스크린리더 텍스트로 함께 제공합니다.
- 배너 이미지는 `image.altText`를 사용하되, 배너 텍스트와 중복되는 장식 이미지는 빈 alt를 허용합니다.
- 자동 재생이 있으면 일시정지 가능한 조작을 제공합니다.
- 상품 이미지는 `thumbnail.altText`를 사용합니다.
- 상품 카드는 링크로 동작하며 키보드 포커스가 보여야 합니다.
- 섹션 제목과 `전체보기` 링크는 스크린리더에서 관계가 이해되도록 구성합니다.

## 9. 디자인 체크리스트

- [ ] Desktop hero promotion carousel
- [ ] Mobile hero promotion carousel
- [ ] 캐러셀 키보드 조작, swipe, indicator
- [ ] 캐러셀 이벤트 없음 상태
- [ ] 체형 프로필 있음/없음 CTA band
- [ ] 개인화 추천 상품 섹션
- [ ] 일반 추천 또는 신상품 섹션
- [ ] 이벤트/기획전 링크 섹션
- [ ] Loading skeleton
- [ ] Empty products state
- [ ] Section-level error state
- [ ] 상품 이미지 `thumbnail.altText`
- [ ] 배너 이미지 `image.altText`
- [ ] 360px 이하에서 텍스트 넘침 없음
