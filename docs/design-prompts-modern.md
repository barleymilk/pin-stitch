# pin-stitch 모던 디자인 프롬프트

## 1. 공통 디자인 지시문

아래 지시문을 모든 화면 프롬프트 앞에 공통으로 붙인다.

```text
Design a polished, modern, production-ready UI for pin-stitch, a fashion commerce platform that helps customers choose clothes using body-profile-based reviews and helps sellers analyze fit complaints, reviews, and returns.

Visual direction:
- Sophisticated modern fashion commerce.
- Clean, editorial, practical, and highly scannable.
- Customer screens should feel premium but still usable for shopping.
- Seller screens should feel like dense operational analytics dashboards, not marketing pages.
- Use real product imagery placeholders with consistent aspect ratios.
- Avoid oversized marketing hero sections unless the screen is the home page.
- Avoid decorative gradients, floating blobs, glassmorphism, neon colors, and playful illustrations.

Color palette only:
- #1c1c1c for primary text, primary buttons, active tabs, strong borders, and high-emphasis dashboard values.
- #daddd8 for muted dividers, subtle badges, skeletons, and quiet data backgrounds.
- #ecebe4 for page bands, filter surfaces, table headers, and low-emphasis panels.
- #eef0f2 for secondary surfaces, input fills, chart grid backgrounds, and neutral status areas.
- #fafaff for app background and large empty areas.
- #ffffff for cards, sheets, forms, image backgrounds, and content surfaces.

Color rules:
- Do not introduce other hue colors for success, warning, danger, or info states.
- Use text labels, border weight, icon shape, density, and grayscale contrast to communicate state.
- Keep the interface mostly #fafaff and #ffffff, with #1c1c1c used sparingly for emphasis.
- Buttons should use #1c1c1c filled primary style and white text; secondary buttons should be white or #eef0f2 with #1c1c1c text.

Typography and layout:
- Use system sans-serif typography.
- Letter spacing must be normal.
- Use clear hierarchy: page title 24-30px, section title 18-20px, body 14-16px, metadata 12-13px.
- Border radius must be 8px or less except pill badges.
- Use thin borders and minimal shadows.
- Do not nest cards inside cards.
- Mobile must be single-column with sticky primary CTA where useful.
- Desktop should use constrained content widths and predictable grids.
- All screens must include loading, empty, and error states where relevant.
- Use lucide-react icons where useful.
- Build with React, TypeScript, Tailwind CSS, and reusable components.
```

## 2. 공통 컴포넌트 세트

```text
Create a reusable component set for pin-stitch using React, TypeScript, Tailwind CSS, and lucide-react.

Include:
- App shell with customer top navigation and seller sidebar variants.
- Button: primary, secondary, tertiary, danger-neutral, icon, loading, disabled.
- Input, select, checkbox, segmented control, range-like price filter, filter chip.
- Badge for fit score, stock, coupon, order status, severity, and review count.
- Price display with original price, discount amount, and final price.
- ProductCard with fixed image ratio, brand, product name, price, fit score, matched review count.
- ReviewCard with rating, body profile metadata, purchased size, fit result, keywords, and review text.
- FitScorePanel with score, confidence, matched review count, and short reasons.
- ReviewSummaryPanel with summary, positive keywords, caution keywords, and basis review count.
- StoreInventoryRow with store name, distance, status, quantity, floor, zone, and rack.
- CouponApplicationPanel with auto-applied coupons and excluded coupons with reasons.
- EmptyState, ErrorState, LoadingSkeleton.
- Dashboard metric card, neutral chart card, data table, insight card.

Use only this palette: #1c1c1c, #daddd8, #ecebe4, #eef0f2, #fafaff, #ffffff.
The output should look cohesive across customer and seller screens.
```

## 3. 고객 웹 화면

### 3.1 홈 `/`

```text
Create the pin-stitch customer home page.

Goal:
- Guide users into product discovery and body profile registration without making a generic landing page.

Requirements:
- Top navigation with logo, product categories, search entry, cart, and profile/body CTA.
- First viewport with a fashion-commerce hero using a large product/lifestyle image background or image-led composition.
- Hero content should introduce body-profile-based shopping in concise copy, with CTAs for "상품 둘러보기" and "체형 프로필 등록".
- Show recommended product section with ProductCards.
- Show popular category and brand entry links.
- Show a body profile registration prompt for users without a profile.
- Include a fallback state where recommendations fail and popular products are shown instead.

Design notes:
- Keep it premium, quiet, and image-led.
- Make the brand/product context visible immediately.
- Use the palette #1c1c1c, #daddd8, #ecebe4, #eef0f2, #fafaff, #ffffff only.
- Ensure mobile shows the hero, primary CTA, and the first product row without feeling cramped.
```

### 3.2 체형 프로필 `/profile/body`

```text
Create the body profile registration and edit screen for pin-stitch.

Goal:
- Collect the minimum body information needed for fit-score calculation and review filtering.

Requirements:
- Form fields for height, weight, usual top size, usual bottom size.
- Body shape selector: STRAIGHT, WAVE, NATURAL, UNKNOWN.
- Fit preference segmented control: SLIM, REGULAR, LOOSE.
- Consent checkbox for using body data.
- Optional profile completeness indicator for P1 readiness.
- Save CTA that routes users back to product discovery.
- Field-level validation errors for missing required values.
- Disabled or explanatory state when consent is unchecked.

Design notes:
- Use a calm form layout with one clear primary action.
- Explain sensitive information with concise helper text, not a large legal block.
- On desktop, place the form and a small "how this improves reviews" summary side by side.
- On mobile, use a single-column form and sticky save CTA.
- Use only #1c1c1c, #daddd8, #ecebe4, #eef0f2, #fafaff, #ffffff.
```

### 3.3 상품 목록 `/products`

```text
Create the product listing and search page for pin-stitch.

Goal:
- Help users find products with high body fit relevance quickly.

Requirements:
- Search input.
- Category, brand, and price filters.
- Sort control: popular, newest, price low to high, price high to low, fit score high to low.
- Product grid with ProductCards.
- Each ProductCard includes image, brand, product name, price, fit score badge, and matched review count.
- If body profile is missing, product cards show a profile registration CTA instead of fit score.
- Empty state when no results match filters, with clear filters action.
- Loading skeleton for product grid.
- Error state with retry.
- Mobile filter drawer and desktop filter sidebar or compact top filter bar.

Design notes:
- Prioritize product images and scannable cards.
- Keep filters compact and practical.
- Use neutral badges and clear text labels instead of colored status hues.
- Use only #1c1c1c, #daddd8, #ecebe4, #eef0f2, #fafaff, #ffffff.
```

### 3.4 상품 상세 `/products/:productId`

```text
Create the product detail page for pin-stitch.

Goal:
- Reduce size and fit uncertainty before the user adds an item to cart.

Requirements:
- Product image gallery with fixed ratios.
- Brand, product name, price, material, fit, and size guide.
- Color selector and size selector.
- Fit score panel with score, confidence, matched review count, and reasons.
- Body-based review summary panel.
- Size and fit caution list.
- Similar-body review entry link or tab.
- Store inventory preview section.
- Add to cart CTA.
- Sold-out option state with disabled CTA.
- Fallback state when similar-body reviews are unavailable: show general review summary.
- Missing body profile state: show general review summary and profile CTA.

Desktop layout:
- Image gallery left, purchase and fit-decision panel right.
- Allow right-side purchase panel to remain visible while scrolling.

Mobile layout:
- Single column with sticky add-to-cart CTA at bottom.

Design notes:
- This is the core decision screen; make fit score, review summary, and size warnings easy to compare.
- Use only #1c1c1c, #daddd8, #ecebe4, #eef0f2, #fafaff, #ffffff.
```

### 3.5 리뷰 탐색 `/products/:productId/reviews`

```text
Create the product review exploration page for pin-stitch.

Goal:
- Let users directly inspect reviews from people with similar body profiles.

Requirements:
- Review summary header with product context and matched review count.
- Filters for height range, purchased size, body shape, fit preference, and fit result.
- Fit result options: SMALL, TRUE_TO_SIZE, LARGE.
- Optional keyword chips and image review filter as P1-ready controls.
- Review list using ReviewCard.
- Each review card includes rating, anonymized body metadata, purchased size, fit result, keywords, and text.
- Empty state for no filtered reviews.
- Clear filters action.
- Loading and error states.

Design notes:
- Keep filters visible and easy to reset.
- Make body metadata compact but legible.
- Do not expose personally identifying reviewer information.
- Use only #1c1c1c, #daddd8, #ecebe4, #eef0f2, #fafaff, #ffffff.
```

### 3.6 매장 재고 `/products/:productId/stores`

```text
Create the store inventory page for a selected product variant in pin-stitch.

Goal:
- Help users find nearby stores where they can try or buy the selected color and size.

Requirements:
- Selected product, color, and size summary.
- Store inventory list.
- Each store row includes store name, distance, open status, quantity, floor, zone, and rack.
- Low stock and out-of-stock states using neutral labels and icon/text contrast.
- If no stores have stock, show online delivery suggestion.
- If location permission is unavailable, show default-region store list notice.
- Inventory fetch error state with retry.
- P1-ready placeholder area for map and visit reservation, but do not make map the primary UI.

Design notes:
- Use dense list rows on desktop and compact cards on mobile.
- Keep inventory status clear without adding extra colors.
- Use only #1c1c1c, #daddd8, #ecebe4, #eef0f2, #fafaff, #ffffff.
```

### 3.7 장바구니 `/cart`

```text
Create the cart page for pin-stitch.

Goal:
- Let users review selected items, options, quantity, coupon auto-application, and final total.

Requirements:
- Cart item list with image, brand, product name, color, size, quantity controls, unit price, line total, and remove icon button.
- Out-of-stock option warning that blocks checkout.
- Order summary panel.
- Subtotal, applied coupon discounts, excluded coupons, discount total, and final total.
- Automatically apply the maximum-discount coupon combination.
- Each applied coupon shows coupon name, discount amount, target item if applicable, and "자동 적용" badge.
- Excluded coupons section is collapsible and shows exclusion reasons.
- Checkout CTA.
- Empty cart state with browse products CTA.
- Loading and error states for cart and coupon calculation.

Desktop layout:
- Cart items on the left, sticky order summary on the right.

Mobile layout:
- Single column with final total and checkout CTA near the bottom.

Design notes:
- Make automatic coupon selection understandable without manual coupon picking.
- Use only #1c1c1c, #daddd8, #ecebe4, #eef0f2, #fafaff, #ffffff.
```

### 3.8 주문 생성 `/checkout`

```text
Create the checkout page for pin-stitch.

Goal:
- Complete order creation after cart review without real payment in MVP.

Requirements:
- Shipping address form: recipient name, phone, postal code, address line 1, address line 2.
- Order item summary.
- Applied coupon summary matching cart pricing.
- Subtotal, discount total, final total.
- Create order CTA.
- Disabled CTA when required fields are missing.
- Field-level validation errors.
- No real payment section.
- Error state when order creation fails.

Desktop layout:
- Shipping form on the left, sticky order summary on the right.

Mobile layout:
- Single column, order summary after form, primary CTA fixed or near final total.

Design notes:
- Keep the page focused and transactional.
- Use only #1c1c1c, #daddd8, #ecebe4, #eef0f2, #fafaff, #ffffff.
```

### 3.9 주문 완료/상세 `/orders/:orderId`

```text
Create the order detail and confirmation page for pin-stitch.

Goal:
- Confirm that an order was created and let the user review order state, items, shipping address, and discounts.

Requirements:
- Success confirmation area.
- Order ID and order status badge.
- Ordered items with product image, brand, name, option, quantity, and price.
- Shipping address summary.
- Applied coupons and discount total.
- Final total.
- Buttons for order list and continue shopping.
- Error state if order cannot be loaded.

Design notes:
- Use a calm confirmation layout, not a celebration-heavy screen.
- Make the final total and order status immediately visible.
- Use only #1c1c1c, #daddd8, #ecebe4, #eef0f2, #fafaff, #ffffff.
```

### 3.10 주문 내역 `/me/orders`

```text
Create the my orders page for pin-stitch.

Goal:
- Let users review past orders and open order details.

Requirements:
- Order list with cards or rows.
- Each order item includes order ID, date, status badge, item thumbnails, item count, and final total.
- Link or button to order detail.
- Empty state with browse products CTA.
- Loading skeleton and error state.
- Status badges for ORDER_CREATED, PREPARING, SHIPPED, DELIVERED, CANCELLED using neutral styling.

Design notes:
- Make repeated order rows compact and easy to scan.
- Use only #1c1c1c, #daddd8, #ecebe4, #eef0f2, #fafaff, #ffffff.
```

## 4. 셀러 웹 화면

### 4.1 셀러 대시보드 `/seller`

```text
Create the seller dashboard for pin-stitch.

Goal:
- Let sellers quickly understand review, fit complaint, and return health across their products.

Requirements:
- Seller app shell with sidebar or consistent seller navigation.
- Metric cards: total products, average rating, fit complaint rate, return rate.
- Problem products Top 5 with severity, reason, and link to product analysis.
- Recent insight cards with concise action-oriented recommendations.
- Simple chart area for fit complaints or return trend.
- Products needing attention table or list.
- P1-ready period filter and category comparison controls.
- Loading, empty, and error states.

Design notes:
- Dense, operational, and restrained.
- Do not use fashion shopping card patterns here.
- Use chart fills and gridlines from the neutral palette only.
- Use only #1c1c1c, #daddd8, #ecebe4, #eef0f2, #fafaff, #ffffff.
```

### 4.2 셀러 상품 분석 `/seller/products/:productId`

```text
Create the seller product insight page for pin-stitch.

Goal:
- Help sellers understand body-shape satisfaction, size-fit problems, review keywords, and improvement actions for one product.

Requirements:
- Product summary header with thumbnail, brand, product name, category, current rating, return rate.
- Body-shape average rating chart.
- Size fit distribution chart for SMALL, TRUE_TO_SIZE, LARGE.
- Positive keyword list with counts.
- Negative keyword list with counts.
- Representative reviews with body metadata and fit result.
- Improvement insight cards with severity labels: LOW, MEDIUM, HIGH.
- P1-ready area for generated detail-page copy suggestions and competitor comparison.
- Loading, empty, and error states.

Design notes:
- Separate charts, keyword lists, reviews, and insights into clear sections.
- Severity should be communicated with text, border weight, and icon shape rather than extra colors.
- Use only #1c1c1c, #daddd8, #ecebe4, #eef0f2, #fafaff, #ffffff.
```

### 4.3 셀러 리뷰 분석 `/seller/reviews`

```text
Create the seller review analysis page for pin-stitch.

Goal:
- Let sellers explore reviews by product, body type, size, rating, and keyword.

Requirements:
- Sticky or fixed-height filter bar for product, body shape, purchased size, rating, and keyword.
- Review table or dense review list.
- Each review row includes product, rating, anonymized body metadata, purchased size, fit result, positive keywords, negative keywords, and review excerpt.
- Keyword summary panel with positive and negative keyword counts.
- Clear filters action.
- Empty state when no reviews match.
- Loading and error states.
- P1-ready CSV download and "needs reply" indicator.

Design notes:
- Prioritize scanability and filtering over visual richness.
- Keep row height consistent.
- Use only #1c1c1c, #daddd8, #ecebe4, #eef0f2, #fafaff, #ffffff.
```

### 4.4 셀러 반품 분석 `/seller/returns`

```text
Create the seller return analysis page for pin-stitch.

Goal:
- Help sellers understand why products are returned and which body groups or options repeat issues.

Requirements:
- Filters for period and product.
- Return reason ratio chart.
- Product return rate list with high-return products highlighted through neutral severity styling.
- Body-shape repeated issue list.
- Insight cards explaining repeated size, fit, color, and material issues.
- P1-ready automatic return reason classification and period trend chart.
- Loading, empty, and error states.

Design notes:
- Use dashboard style with clear numeric hierarchy.
- Show actionable product improvement information, not only charts.
- Use only #1c1c1c, #daddd8, #ecebe4, #eef0f2, #fafaff, #ffffff.
```

## 5. 전체 일관성 검토 프롬프트

```text
Review all generated pin-stitch screens for consistency and production readiness.

Check:
- Every screen uses only #1c1c1c, #daddd8, #ecebe4, #eef0f2, #fafaff, and #ffffff.
- Customer screens feel like modern fashion commerce, not generic SaaS dashboards.
- Seller screens feel like dense operational analytics tools, not shopping pages.
- Border radius is 8px or less except pill badges.
- Typography hierarchy is consistent and letter spacing is normal.
- Product image ratios are stable.
- Cards are not nested inside cards.
- Mobile layouts keep primary CTAs reachable.
- Loading, empty, and error states exist for major data surfaces.
- Fit score includes reasons and matched review count.
- Review summaries include basis review count.
- Coupon auto-application explains applied coupons and excluded coupon reasons.
- Charts do not rely on color alone to communicate meaning.
- Body and reviewer data remains anonymized.

Return a concise list of inconsistencies and revised component or screen instructions.
```
