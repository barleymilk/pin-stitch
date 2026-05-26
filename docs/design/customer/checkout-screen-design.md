# 주문 생성 화면 디자인 `/checkout`

이 문서는 `pin-stitch` 고객 주문 생성 화면의 디자인 명세입니다. 상위 기준은 `../screen-design-plan.md`, 컴포넌트 기준은 `../component-inventory.md`, 시각 기준은 `../ui-guidelines.md`를 따릅니다.

## 1. 화면 목표

- 사용자가 장바구니 스냅샷, 자동 적용 쿠폰, 최종 주문 예정 금액, 배송지를 확인하고 주문을 생성하게 합니다.
- 장바구니 `/cart`에서 본 금액과 체크아웃 금액이 일치하도록 보여줍니다.
- 토스페이먼츠 테스트 결제창으로 이어지는 주문-결제 흐름을 제공합니다.
- 주문 생성 후 내부 `orderId`가 아니라 사용자용 `orderNumber`를 토스 결제 `orderId`로 사용합니다.

## 2. 주요 데이터

Cart:

```text
GET /cart
```

- Response `data`: `Cart`
- 사용 필드: `items`, `pricing`, `updatedAt`
- 체크아웃 진입 시 최신 장바구니와 가격을 다시 조회합니다.

Order:

```text
POST /orders
```

Request:

```json
{
  "cartId": "cart_123",
  "appliedCouponIds": ["cpn_123"],
  "shippingAddress": {
    "recipientName": "Kim",
    "phone": "010-0000-0000",
    "postalCode": "06236",
    "address1": "Seoul",
    "address2": "101"
  }
}
```

Response:

- `Order`
- 주문 생성 후 토스페이먼츠 결제창을 호출합니다.
- 화면과 URL에는 `orderNumber`를 사용하고 내부 `orderId`는 노출하지 않습니다.
- 초기 주문 상태는 `PAYMENT_PENDING`입니다.

Payment:

```text
POST /payments/toss/confirm
```

- 토스 결제창 성공 리다이렉트에서 받은 `paymentKey`, `orderId`, `amount`를 서버에 전달합니다.
- 승인 성공 후 `/orders/:orderNumber`로 이동합니다.
- 승인 실패 시 결제 실패 상태를 표시합니다.

Shipping address:

- `recipientName`
- `phone`
- `postalCode`
- `address1`
- `address2`

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
│ "주문하기"                                                 │
├──────────────────────────────────────┬─────────────────────┤
│ Shipping address form                │ Order summary       │
│ Order item summary                   │ PriceSummary        │
│ Coupon summary                       │ Toss payment CTA    │
└──────────────────────────────────────┴─────────────────────┘
```

Desktop rules:

- 좌측에는 배송지 입력과 주문 상품 확인을 배치합니다.
- 우측에는 가격 요약과 결제 CTA를 sticky로 배치할 수 있습니다.
- 주문 상품이 많으면 좌측 목록은 접기/펼치기 또는 최대 높이 스크롤을 허용합니다.

## 4. 모바일 레이아웃

구조:

```text
┌──────────────────────────────┐
│ Compact header               │
├──────────────────────────────┤
│ Page title                   │
├──────────────────────────────┤
│ Shipping address form        │
├──────────────────────────────┤
│ Order item summary           │
├──────────────────────────────┤
│ Coupon summary               │
├──────────────────────────────┤
│ Price summary                │
├──────────────────────────────┤
│ Bottom fixed payment CTA     │
└──────────────────────────────┘
```

Mobile rules:

- 배송지 폼을 가장 먼저 보여줍니다.
- 최종 금액과 결제 CTA는 하단 고정 영역에 요약해 표시합니다.
- 하단 고정 CTA가 본문을 가리지 않도록 하단 padding을 확보합니다.
- 주문 상품 목록은 기본 2-3개만 보이고 `전체 보기`로 펼칠 수 있습니다.

## 5. 화면 영역 상세

### 5.1 PageHeader

Title:

```text
주문하기
```

Description:

```text
배송지와 주문 금액을 확인해 주세요.
```

Actions:

- `장바구니로 돌아가기` -> `/cart`

### 5.2 ShippingAddressForm

Fields:

- 받는 사람: `recipientName`
- 연락처: `phone`
- 우편번호: `postalCode`
- 주소: `address1`
- 상세 주소: `address2`

Validation:

- `recipientName`: required
- `phone`: required, 전화번호 형식
- `postalCode`: required
- `address1`: required
- `address2`: optional

Rules:

- 필수값 누락 시 결제 CTA를 비활성화하거나 제출 시 필드별 error를 표시합니다.
- 전화번호는 입력 중 자동 포맷팅을 적용할 수 있지만 서버 전송 형식은 일관되게 유지합니다.
- 주소 검색 UI는 P1로 미루고, MVP에서는 직접 입력을 허용합니다.

### 5.3 Order item summary

Data:

- `Cart.items`
- 상품명
- 선택 옵션
- 수량
- 단가
- 상품별 금액

Display:

- 장바구니의 `CartItemRow`보다 압축된 읽기 전용 행으로 표시합니다.
- 수량 변경과 삭제는 체크아웃에서 제공하지 않습니다.
- 수정이 필요한 경우 `장바구니로 돌아가기`로 이동하게 합니다.

Rules:

- 내부 `itemId`, `productId`, `variantId`는 텍스트로 노출하지 않습니다.
- 상품 이미지가 있으면 대표 이미지와 `altText`를 사용합니다.
- 품절 또는 가격 변경이 감지되면 주문 생성을 막고 장바구니로 돌아가게 합니다.

### 5.4 CouponSummary

Content:

- 자동 적용된 쿠폰 목록
- 상품별 할인과 주문 전체 할인 구분
- 적용 제외 쿠폰과 제외 사유

Rules:

- 장바구니에서 계산된 자동 적용 쿠폰을 그대로 보여줍니다.
- 체크아웃에서 쿠폰을 직접 선택하거나 편집하지 않습니다.
- `ExcludedCoupon.reasonCode`는 직접 노출하지 않고, 사용자용 `message`를 표시합니다.

### 5.5 PriceSummary

Content:

- 총 상품 금액: `subtotal`
- 총 할인 금액: `discountTotal`
- 최종 주문 예정 금액: `finalTotal`

Rules:

- `/cart`에서 본 금액과 일치해야 합니다.
- 체크아웃 진입 시 서버에서 최신 금액을 다시 조회해 표시합니다.
- 금액이 장바구니 진입 시점과 달라졌다면 `Cart changed` 상태를 표시합니다.
- `finalTotal`을 가장 강하게 표시합니다.

### 5.6 Payment CTA

Default:

- `결제하기`

Disabled states:

| State | Display |
| --- | --- |
| Invalid address | `배송지를 입력해 주세요` |
| Empty cart | `주문할 상품이 없어요` |
| Sold out item | `품절 상품을 확인해 주세요` |
| Cart changed | `변경 사항을 확인해 주세요` |
| Creating | `주문 준비 중` |
| Payment opening | `결제창 여는 중` |

Behavior:

- 클릭 시 `POST /orders`를 호출해 `PAYMENT_PENDING` 주문을 생성합니다.
- 주문 생성 성공 후 토스페이먼츠 결제창을 호출합니다.
- 토스 결제 성공 리다이렉트 후 `POST /payments/toss/confirm`을 호출합니다.
- 결제 승인 성공 시 `/orders/:orderNumber`로 이동합니다.
- 주문 생성 또는 결제 승인 실패 시 CTA 근처에 inline error를 표시합니다.

## 6. 상태 디자인

### 6.1 Loading

- 배송지 폼 skeleton은 최소화하고, 주문 상품/가격 요약 skeleton을 표시합니다.
- 모바일 하단 CTA는 disabled skeleton으로 표시합니다.

### 6.2 Empty cart

Title:

```text
주문할 상품이 없어요
```

CTA:

- `상품 보러가기` -> `/products`

### 6.3 Validation error

- 필드 아래에 짧은 error message를 표시합니다.
- 첫 번째 오류 필드로 포커스를 이동합니다.
- 결제 CTA에는 전체 상태를 요약합니다.

### 6.4 Cart changed

Use case:

- 장바구니 금액, 쿠폰, 재고가 체크아웃 진입 후 변경된 경우

Message:

```text
상품 정보가 변경되어 주문 금액을 다시 확인해 주세요.
```

Actions:

- `변경 내용 확인` -> `/cart`
- 변경이 단순 금액 재계산이면 체크아웃 내에서 확인 후 주문 생성 허용

### 6.5 Payment error

Title:

```text
결제를 완료하지 못했어요
```

Description:

```text
잠시 후 다시 시도해 주세요.
```

CTA:

- `다시 시도`

### 6.6 Success

- 별도 성공 화면을 두지 않고 결제 승인 후 `/orders/:orderNumber`로 이동합니다.
- 이동 전 중복 제출을 막기 위해 CTA를 disabled 처리합니다.

## 7. Interaction

- 체크아웃 진입 시 최신 `GET /cart` 결과를 조회합니다.
- 배송지 입력 중에는 주문 상품과 가격 요약이 흔들리지 않아야 합니다.
- 주문 생성 및 결제 승인 중에는 뒤로가기/중복 클릭으로 중복 요청이 생기지 않게 CTA를 비활성화합니다.
- 결제 승인 성공 후 장바구니는 서버 규칙에 따라 비워진 상태가 됩니다.
- 사용자가 `장바구니로 돌아가기`를 누르면 `/cart`에서 최신 상태를 다시 조회합니다.

## 8. Accessibility

- 모든 배송지 입력 필드는 label과 error message를 연결합니다.
- 필수 필드는 시각적 표시와 스크린리더 안내를 함께 제공합니다.
- 주문 생성 실패, 결제 승인 실패, 금액 변경, validation error는 live region으로 안내합니다.
- 하단 고정 CTA는 키보드 포커스 순서를 어지럽히지 않아야 합니다.
- 가격 요약은 색상만으로 할인 여부를 구분하지 않고 `할인` 텍스트를 함께 사용합니다.

## 9. 디자인 체크리스트

- [ ] Desktop 배송지 폼 + sticky 주문 요약
- [ ] Mobile 하단 고정 결제 CTA
- [ ] 배송지 필수값 validation
- [ ] 주문 상품 읽기 전용 요약
- [ ] 자동 적용 쿠폰 요약
- [ ] 적용 제외 쿠폰 사유
- [ ] PriceSummary `subtotal`, `discountTotal`, `finalTotal`
- [ ] Cart changed state
- [ ] Empty cart state
- [ ] Payment error state
- [ ] 중복 주문/결제 요청 방지
- [ ] 토스 결제 승인 성공 후 `/orders/:orderNumber` 이동
- [ ] 내부 `orderId`, `itemId`, `productId`, `variantId` 미노출
- [ ] 360px 이하에서 텍스트 넘침 없음
