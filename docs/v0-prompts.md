# v0 프롬프트 모음

## 1. 사용 방식

이 문서는 v0에서 `pin-stitch` UI 초안을 생성할 때 사용할 프롬프트를 순서대로 정리한 문서다.

한 번에 전체 앱을 만들지 않고, 공통 디자인 기준을 먼저 입력한 뒤 컴포넌트와 화면을 순서대로 생성한다.

생성된 결과물은 최종 디자인 기준이 아니라 초안으로 사용한다. 최종 구현 기준은 `docs/design-system.md`와 `docs/project-spec.md`를 따른다.

## 2. 프롬프트 순서

## 2.1 공통 디자인 기준

```text
You are designing UI for a fashion commerce product called pin-stitch.

Use this design direction for all following screens:
- Minimal fashion commerce UI
- White background with warm neutral gray surfaces
- Primary color: #1E3A34
- Accent color: #B86B4B
- Text color: #171717
- Muted text: #6B6B66
- Border color: #E2E2DC
- Border radius: 8px or less
- Use Tailwind CSS
- Use React components
- Use lucide-react icons where useful
- Avoid decorative gradients, floating orbs, oversized marketing hero sections
- Focus on actual product UI, not landing pages

The product has two areas:
1. Customer web: product discovery, product detail, cart, checkout
2. Seller web: dashboard, product insights, review analysis

Keep UI clean, practical, responsive, and production-oriented.
```

## 2.2 공통 컴포넌트

```text
Create a reusable UI component set for pin-stitch using React and Tailwind.

Include:
- Button variants: primary, secondary, tertiary, danger, icon
- Input
- Select
- Checkbox
- Badge
- Price display
- Empty state
- Loading skeleton
- Error state
- ProductCard
- ReviewCard
- FitScoreBadge
- CouponBadge

Use the design direction already defined.
Keep components simple and suitable for a Next.js app.
```

## 2.3 상품 목록 화면

```text
Create a responsive product listing page for pin-stitch.

Requirements:
- Search input
- Category filter
- Brand filter
- Price filter
- Sort control with: popular, newest, price low to high, fit score high to low
- Product grid
- Each product card includes image, brand, product name, price, fit score badge, matched review count
- Empty state when no products match
- Mobile filter drawer
- Desktop filter sidebar or top filter bar

Do not create a marketing page.
This is an actual shopping product list page.
```

## 2.4 상품 상세 화면

```text
Create a responsive product detail page for pin-stitch.

Requirements:
- Product image gallery
- Brand name
- Product name
- Price
- Material and fit information
- Color selector
- Size selector
- FitScoreBadge with score, confidence, and short reasons
- Body-based review summary panel
- Fit warning list
- Store inventory preview section
- Add to cart CTA
- Review link or tab entry

Desktop layout:
- Image gallery on the left
- Purchase information on the right

Mobile layout:
- Single column
- Sticky add-to-cart CTA at the bottom

Use the established design direction.
```

## 2.5 리뷰 탐색 화면

```text
Create a product review exploration page for pin-stitch.

Requirements:
- Review summary header
- Filters for height range, body shape, purchased size, fit result, keyword
- Review list
- Each review card includes rating, height, body shape, purchased size, fit result, positive keywords, negative keywords, review content
- Empty state for no filtered reviews
- Clear filters button

The page should help users find reviews from people with similar body profiles.
```

## 2.6 매장 재고 화면/섹션

```text
Create a store inventory page or section for a selected product variant.

Requirements:
- Selected color and size summary
- Store list
- Each store row/card includes store name, distance, open status, quantity, floor, zone, rack
- Show low stock state
- Show out of stock state
- If no stores have stock, show online order suggestion
- Responsive layout

Use practical commerce UI, not a map-first design.
```

## 2.7 장바구니 + 쿠폰 자동 적용 화면

```text
Create a cart page for pin-stitch.

Requirements:
- Cart item list with product image, brand, name, color, size, quantity controls, unit price, line total, remove button
- Order summary panel
- Subtotal
- Automatically applied coupons section
- Each applied coupon shows coupon name, discount amount, target item if applicable, and "Auto applied" badge
- Excluded coupons section, collapsible, with exclusion reasons
- Discount total
- Final total
- Checkout CTA
- Empty cart state

Coupon UI must make it clear that the system automatically selected the maximum discount combination.
Desktop layout should have cart items left and order summary right.
Mobile layout should be single column with checkout CTA near final total.
```

## 2.8 주문 생성 화면

```text
Create a checkout page for pin-stitch.

Requirements:
- Shipping address form
- Recipient name, phone, postal code, address line 1, address line 2
- Order item summary
- Applied coupon summary
- Subtotal, discount total, final total
- Create order CTA
- Form validation error states
- Disabled CTA when required fields are missing

No real payment section is needed for MVP.
This page creates an order without payment.
```

## 2.9 주문 완료/상세 화면

```text
Create an order detail page for pin-stitch.

Requirements:
- Order created success state
- Order ID
- Order status badge
- Ordered items
- Shipping address
- Applied coupons and discount total
- Final total
- Button to view order list
- Button to continue shopping

Use a clean commerce order confirmation layout.
```

## 2.10 주문 내역 화면

```text
Create a my orders page for pin-stitch.

Requirements:
- List of orders
- Each order card includes order ID, date, status, item thumbnails, item count, final total
- Link to order detail
- Empty state with button to browse products
- Status badges for ORDER_CREATED, PREPARING, SHIPPED, DELIVERED, CANCELLED
```

## 2.11 셀러 대시보드

```text
Create a seller dashboard for pin-stitch.

Requirements:
- Operational dashboard, not customer shopping UI
- Metric cards: product count, average rating, fit complaint rate, return rate
- Problem products list with severity
- Recent insight cards
- Simple chart area for fit complaints or returns trend
- Table or list for products needing attention

Use dense but clean dashboard layout.
Use restrained colors.
Do not make it look like a marketing page.
```

## 2.12 셀러 상품 분석 화면

```text
Create a seller product insight page for pin-stitch.

Requirements:
- Product summary header
- Body shape satisfaction chart
- Size fit distribution chart
- Positive keyword list
- Negative keyword list
- Representative reviews
- Improvement insight cards
- Severity badges: LOW, MEDIUM, HIGH

The page should help a seller understand why customers are satisfied or dissatisfied with a product.
```

## 2.13 셀러 리뷰 분석 화면

```text
Create a seller review analysis page for pin-stitch.

Requirements:
- Filter bar for product, body shape, purchased size, rating, keyword
- Review table or dense review list
- Keyword summary panel
- Positive and negative keyword counts
- Empty state
- Clear filters action

This is an operational analysis screen.
Prioritize scanability and filtering.
```

## 2.14 셀러 반품 분석 화면

```text
Create a seller return analysis page for pin-stitch.

Requirements:
- Return reason ratio chart
- Product return rate list
- Body shape issue list
- Highlight high return rate products
- Insight cards explaining repeated issues
- Filters for period and product

Use dashboard style.
Show actionable product improvement information.
```

## 2.15 전체 일관성 검토

```text
Review all generated pin-stitch screens for visual consistency.

Check:
- Colors match the design direction
- Border radius is 8px or less except badges
- Typography hierarchy is consistent
- Customer screens feel like fashion commerce
- Seller screens feel like operational dashboards
- Empty, loading, and error states are present
- Mobile layouts are usable
- CTA placement is clear
- Coupon auto-apply UI is understandable

Suggest any inconsistencies and provide revised components where needed.
```

## 3. 사용 후 정리 기준

v0 결과물을 코드에 반영하기 전에 다음을 확인한다.

- `docs/design-system.md`의 색상, 타이포그래피, radius 기준과 맞는가
- 고객 화면이 실제 상품 탐색/구매 흐름에 집중되어 있는가
- 셀러 화면이 운영 대시보드처럼 스캔 가능하게 구성되어 있는가
- 쿠폰 자동 적용 UI가 적용/제외 사유를 명확히 보여주는가
- 모바일에서 주요 CTA가 사용 가능한 위치에 있는가
- 컴포넌트가 `packages/domain` 타입과 연결 가능한 구조인가
