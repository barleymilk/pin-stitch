# 장바구니 화면 디자인 `/cart`

이 문서는 `pin-stitch` 고객 장바구니 화면의 디자인 명세입니다. 상위 기준은 `../screen-design-plan.md`, 컴포넌트 기준은 `../component-inventory.md`, 시각 기준은 `../ui-guidelines.md`를 따릅니다.

## 1. 화면 목표

- 사용자가 담은 상품, 옵션, 수량, 할인, 최종 주문 예정 금액을 한 화면에서 확인하게 합니다.
- 수량 변경, 상품 삭제, 쿠폰 자동 적용 결과를 명확히 보여주고 금액 재계산을 신뢰할 수 있게 합니다.
- 품절 또는 재고 변경 상품은 주문 진행 전에 발견하고 해결하게 합니다.
- 체크아웃 `/checkout`으로 넘어갈 때 장바구니 금액과 주문 생성 금액이 일치하도록 합니다.

## 2. 주요 데이터

Cart:

```text
GET /cart
```

- Response `data`: `Cart`
- 사용 필드: `cartId`, `items`, `availableCoupons`, `pricing`, `updatedAt`

Cart item update:

```text
PATCH /cart/items/:itemId
DELETE /cart/items/:itemId
```

- 수량 변경은 `PATCH /cart/items/:itemId`를 사용합니다.
- 삭제는 `DELETE /cart/items/:itemId`를 사용합니다.
- `itemId`는 화면에 직접 노출하지 않고 액션의 내부 식별자로만 사용합니다.

Coupon recalculation:

```text
POST /cart/apply-best-coupons
```

- Response `data`: `CartPricing`
- 수량 변경, 상품 삭제 후 자동 적용 쿠폰과 최종 금액을 다시 계산합니다.

Pricing:

- `CartPricing.subtotal`
- `CartPricing.discountTotal`
- `CartPricing.finalTotal`
- `CouponApplication[]`
- `ExcludedCoupon[]`

## 3. 데스크톱 레이아웃

최대 너비:

- `1200px`

구조:

```text
┌────────────────────────────────────────────────────────────┐
│ Header / Global nav                                        │
├────────────────────────────────────────────────────────────┤
│ PageHeader                                                 │
│ "장바구니"                                                 │
├──────────────────────────────────────┬─────────────────────┤
│ Cart item list                       │ Order summary       │
│ CartItemRow                          │ PriceSummary        │
│ CartItemRow                          │ CouponSummary       │
│ CartItemRow                          │ Checkout CTA        │
└──────────────────────────────────────┴─────────────────────┘
```

Desktop rules:

- 상품 목록은 좌측, 가격 요약은 우측에 배치합니다.
- 우측 `Order summary`는 데스크톱에서 sticky를 사용할 수 있습니다.
- 좌측과 우측 영역 사이 간격은 `32px`를 기본으로 합니다.
- 장바구니 상품이 많아도 주문 CTA는 우측 요약에서 계속 접근 가능해야 합니다.

## 4. 모바일 레이아웃

구조:

```text
┌──────────────────────────────┐
│ Compact header               │
├──────────────────────────────┤
│ Page title                   │
├──────────────────────────────┤
│ Cart item list               │
│ CartItemRow                  │
│ CartItemRow                  │
├──────────────────────────────┤
│ Coupon summary               │
├──────────────────────────────┤
│ Price summary                │
├──────────────────────────────┤
│ Bottom fixed checkout CTA    │
└──────────────────────────────┘
```

Mobile rules:

- 상품 행은 세로형 카드가 아니라 compact row 형태를 유지합니다.
- 수량 stepper와 삭제 버튼은 엄지 조작이 가능한 크기로 제공합니다.
- 최종 금액과 주문 CTA는 하단 고정 영역에 요약해 표시합니다.
- 하단 고정 CTA가 본문을 가리지 않도록 하단 padding을 확보합니다.

## 5. 화면 영역 상세

### 5.1 PageHeader

Title:

```text
장바구니
```

Description:

```text
담은 상품과 자동 적용된 쿠폰을 확인해 주세요.
```

Actions:

- `계속 쇼핑하기` -> `/products`

### 5.2 CartItemRow

Data:

- `itemId`
- `productId`
- `variantId`
- `quantity`
- `unitPrice`
- `lineTotal`

Display:

- 상품 이미지
- 브랜드명
- 상품명
- 선택 옵션: 색상, 사이즈
- 단가
- 수량 stepper
- 상품별 금액
- 상품별 적용 쿠폰이 있으면 할인 금액
- 삭제 버튼

Rules:

- 내부 `itemId`, `productId`, `variantId`는 텍스트로 노출하지 않습니다.
- 상품 이미지는 상품 응답의 `thumbnail.altText` 또는 대표 이미지 `altText`를 사용합니다.
- 상품명 클릭은 `/products/:productId`로 이동합니다.
- 삭제 버튼은 아이콘 버튼으로 제공하고 접근 가능한 label을 둡니다.

Quantity stepper:

- 최소 수량은 `1`입니다.
- 수량 변경 성공 후 `CartPricing`을 다시 표시합니다.
- 수량 변경 중에는 해당 행의 stepper를 잠시 비활성화합니다.
- 수량 변경 실패 시 기존 수량으로 되돌리고 inline error를 표시합니다.

### 5.3 CouponSummary

Applied coupons:

- `CouponApplication.couponId`
- `targetItemId`
- `discountAmount`
- `reason`

Display:

- 자동 적용된 쿠폰명 또는 할인 사유
- 상품별 할인인지 주문 전체 할인인지 구분
- 할인 금액

Excluded coupons:

- `ExcludedCoupon.reasonCode`
- `ExcludedCoupon.message`

Display:

- `적용 제외 쿠폰` 접이식 영역으로 제공합니다.
- 제외 사유는 사용자가 이해할 수 있는 `message`를 표시합니다.
- `reasonCode`는 디버그 코드처럼 노출하지 않고, 필요한 경우 보조 상태 분류로만 사용합니다.

Rules:

- 쿠폰은 사용자가 직접 선택하지 않고 자동 최적 적용 결과를 보여줍니다.
- 수량 변경이나 삭제 후 쿠폰 적용 결과가 바뀌면 요약 영역을 갱신합니다.
- 할인 금액은 음수 표기보다 `-3,000원`처럼 명확히 표시합니다.

### 5.4 PriceSummary

Content:

- 총 상품 금액: `subtotal`
- 총 할인 금액: `discountTotal`
- 최종 주문 예정 금액: `finalTotal`
- 적용 쿠폰 수
- 주문 CTA

Layout:

```text
┌──────────────────────────────┐
│ 주문 예정 금액               │
│ 총 상품 금액        120,000원 │
│ 총 할인 금액        -12,000원 │
│ 최종 금액           108,000원 │
│ [주문하기]                  │
└──────────────────────────────┘
```

Rules:

- `finalTotal`을 가장 강하게 표시합니다.
- 장바구니가 비었거나 주문 차단 상품이 있으면 주문 CTA를 비활성화합니다.
- 금액 재계산 중에는 skeleton 또는 `계산 중` 상태를 표시합니다.

### 5.5 Checkout CTA

Default:

- `주문하기`

Disabled states:

| State | Display |
| --- | --- |
| Empty cart | `담긴 상품이 없어요` |
| Sold out item | `품절 상품을 확인해 주세요` |
| Pricing updating | `금액 계산 중` |
| API error | `다시 시도해 주세요` |

Behavior:

- 클릭 시 `/checkout`으로 이동합니다.
- 이동 전에 최신 `CartPricing`과 품절 상태를 확인합니다.
- 품절 또는 가격 변경이 감지되면 checkout 이동을 막고 장바구니에서 해결하게 합니다.

## 6. 상태 디자인

### 6.1 Loading

- 상품 행 skeleton과 가격 요약 skeleton을 함께 표시합니다.
- 모바일에서는 하단 CTA 영역도 skeleton 또는 disabled 상태로 표시합니다.

### 6.2 Empty cart

Title:

```text
장바구니가 비어 있어요
```

Description:

```text
나에게 맞는 상품을 먼저 둘러보세요.
```

CTA:

- `상품 보러가기` -> `/products`

### 6.3 Cart error

Title:

```text
장바구니를 불러오지 못했어요
```

CTA:

- `다시 시도`

### 6.4 Item update error

- 수량 변경 실패: 해당 행 아래 inline error
- 삭제 실패: 삭제 버튼 근처 또는 toast
- 쿠폰 재계산 실패: 가격 요약 영역에 `할인 금액을 다시 계산하지 못했어요` 표시

### 6.5 Sold out item

Display:

- 상품 행에 `품절` badge
- 수량 stepper 비활성화
- 주문 CTA 비활성화
- 해결 액션: `삭제`

Message:

```text
품절된 상품은 주문할 수 없어요.
```

### 6.6 Cart changed

Use case:

- 상품 가격, 할인, 재고가 서버에서 변경된 경우

Display:

- 상단 또는 가격 요약에 변경 안내
- 변경된 상품 행에 강조 표시

Message:

```text
상품 정보가 변경되어 금액을 다시 계산했어요.
```

## 7. Interaction

- 수량 변경 시 해당 행과 가격 요약을 낙관적으로 갱신할 수 있지만, 서버 응답 기준으로 최종 표시합니다.
- 수량 변경 또는 삭제 후 `POST /cart/apply-best-coupons` 결과로 쿠폰/금액을 갱신합니다.
- 삭제 버튼 클릭 시 즉시 삭제하거나 확인 dialog를 사용할 수 있습니다. MVP에서는 즉시 삭제 후 undo toast를 권장합니다.
- `계속 쇼핑하기`는 `/products`로 이동합니다.
- 상품명/이미지 클릭은 `/products/:productId`로 이동합니다.
- `/checkout` 진입 후 뒤로 오면 장바구니 최신 상태를 다시 조회합니다.

## 8. Accessibility

- 수량 stepper는 현재 수량과 증감 버튼 label을 제공합니다.
- 삭제 아이콘 버튼에는 `상품 삭제`처럼 명확한 label을 둡니다.
- 가격 변경, 쿠폰 재계산, 삭제 완료는 스크린리더가 인지할 수 있는 live region으로 안내합니다.
- 할인 금액은 색상만으로 의미를 구분하지 않고 `할인` 텍스트를 함께 사용합니다.
- 품절 상품은 badge와 안내 문구를 함께 사용합니다.
- 모바일 하단 고정 CTA는 키보드 포커스 순서를 어지럽히지 않아야 합니다.

## 9. 디자인 체크리스트

- [ ] Desktop 상품 목록 + sticky 주문 요약
- [ ] Mobile 하단 고정 주문 CTA
- [ ] CartItemRow 상품/옵션/수량/금액
- [ ] 수량 변경 loading/error
- [ ] 상품 삭제와 undo toast
- [ ] 자동 적용 쿠폰 목록
- [ ] 적용 제외 쿠폰과 제외 사유
- [ ] PriceSummary `subtotal`, `discountTotal`, `finalTotal`
- [ ] Empty cart state
- [ ] Cart error state
- [ ] Sold out item state
- [ ] Cart changed state
- [ ] 주문 CTA disabled states
- [ ] 내부 `itemId`, `productId`, `variantId` 미노출
- [ ] 360px 이하에서 텍스트 넘침 없음
