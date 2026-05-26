# 주문 완료/상세 화면 디자인 `/orders/:orderNumber`

이 문서는 `pin-stitch` 고객 주문 완료/상세 화면의 디자인 명세입니다. 상위 기준은 `../screen-design-plan.md`, 결제 흐름은 `../../architecture/payment-flow-design.md`, API 기준은 `../../architecture/api-reference.md`를 따릅니다.

## 1. 화면 목표

- 사용자가 주문번호, 주문 상태, 결제 상태, 배송 상태, 주문 상품, 배송지, 최종 금액을 확인하게 합니다.
- 결제 성공, 결제 대기, 결제 실패, 결제 취소 상태를 명확히 구분합니다.
- 내부 `orderId`, `paymentId`, `providerPaymentKey`는 화면에 직접 노출하지 않고, 사용자용 `orderNumber`를 중심으로 안내합니다.
- 결제 실패나 결제 대기 상태에서는 재시도 또는 장바구니/상품 목록 이동 같은 다음 행동을 제공합니다.

## 2. 주요 데이터

Order:

```text
GET /orders/:orderNumber
```

- Response `data`: `Order`
- 사용 필드: `orderNumber`, `lines`, `pricing`, `shippingAddress`, `status`, `createdAt`, `updatedAt`
- URL과 화면에는 `orderNumber`를 사용합니다.

Payment:

```text
GET /orders/:orderNumber/payment
```

- Response `data`: `Payment`
- 사용 필드: `provider`, `status`, `amount`, `method`, `receiptUrl`, `approvedAt`, `failureMessage`, `canceledAt`, `cancelReason`
- 내부 `paymentId`, `orderId`, `providerPaymentKey`는 텍스트로 표시하지 않습니다.

Status:

- `OrderStatus`
- `PaymentStatus`
- `DeliveryStatus`

Shipment:

```text
GET /orders/:orderNumber/shipment
```

- Response `data`: `Shipment`
- 사용 필드: `status`, `carrierName`, `trackingNumber`, `trackingUrl`, `estimatedDeliveryDate`, `shippedAt`, `deliveredAt`, `delayReason`
- 내부 `shipmentId`, `orderId`는 화면에 표시하지 않습니다.

## 3. 데스크톱 레이아웃

최대 너비:

- `1200px`

구조:

```text
┌────────────────────────────────────────────────────────────┐
│ Header / Global nav                                        │
├────────────────────────────────────────────────────────────┤
│ Status hero                                                │
│ 주문 완료 / 결제 대기 / 결제 실패                         │
├──────────────────────────────────────┬─────────────────────┤
│ Order detail                         │ Payment summary     │
│ Order item snapshot                  │ PriceSummary        │
│ Shipping address                     │ Delivery summary    │
│                                      │ CTA group           │
└──────────────────────────────────────┴─────────────────────┘
```

Desktop rules:

- 좌측에는 주문 상품과 배송지를 배치합니다.
- 우측에는 결제 상태, 가격 요약, 주요 CTA를 배치합니다.
- 결제 실패나 대기 상태에서는 우측 CTA를 가장 눈에 띄게 배치합니다.

## 4. 모바일 레이아웃

구조:

```text
┌──────────────────────────────┐
│ Compact header               │
├──────────────────────────────┤
│ Status hero                  │
├──────────────────────────────┤
│ Payment summary              │
├──────────────────────────────┤
│ Delivery summary             │
├──────────────────────────────┤
│ Order item snapshot          │
├──────────────────────────────┤
│ Shipping address             │
├──────────────────────────────┤
│ Price summary                │
├──────────────────────────────┤
│ CTA group                    │
└──────────────────────────────┘
```

Mobile rules:

- 상태 hero를 가장 먼저 보여줍니다.
- 주문 상품이 많으면 2-3개만 먼저 보이고 `전체 보기`로 펼칩니다.
- 영수증 링크와 주문 내역 CTA는 화면 하단에서도 접근 가능해야 합니다.

## 5. 화면 영역 상세

### 5.1 Status hero

Display by state:

| Order status | Payment status | Title | Description |
| --- | --- | --- | --- |
| `PAID` | `APPROVED` | `주문이 완료됐어요` | `결제가 승인되었고 상품 준비를 시작합니다.` |
| `PAYMENT_PENDING` | `READY` or `IN_PROGRESS` | `결제 확인 중이에요` | `결제가 완료되지 않았거나 승인 확인이 필요합니다.` |
| `PAYMENT_FAILED` | `FAILED` | `결제를 완료하지 못했어요` | `결제 실패 사유를 확인하고 다시 시도해 주세요.` |
| `CANCELLED` | `CANCELED` | `주문이 취소됐어요` | `결제 취소가 완료되었습니다.` |
| `PREPARING` | `APPROVED` | `상품을 준비 중이에요` | `결제 완료 후 상품을 준비하고 있습니다.` |
| `SHIPPED` | `APPROVED` | `배송 중이에요` | `운송장 정보를 확인할 수 있습니다.` |
| `DELIVERED` | `APPROVED` | `배송이 완료됐어요` | `상품을 받아보셨다면 리뷰를 남겨주세요.` |

Rules:

- 상태는 색상만으로 구분하지 않고 제목과 설명을 함께 제공합니다.
- `orderNumber`를 상태 hero 안에 함께 표시합니다.
- 내부 `orderId`는 표시하지 않습니다.

Example:

```text
주문이 완료됐어요
주문번호 20260526-0001
결제가 승인되었고 상품 준비를 시작합니다.
```

### 5.2 Payment summary

Content:

- 결제 상태
- 결제 수단
- 결제 금액
- 승인 시각
- 영수증 링크
- 실패 사유 또는 취소 사유

Display:

| Payment status | Display |
| --- | --- |
| `READY` | `결제 대기` |
| `IN_PROGRESS` | `결제 진행 중` |
| `APPROVED` | `결제 완료` |
| `FAILED` | `결제 실패` |
| `CANCELED` | `결제 취소` |

Rules:

- `receiptUrl`이 있으면 `영수증 보기` 링크를 제공합니다.
- 실패 상태에서는 `failureMessage`를 사용자 친화 문구로 표시합니다.
- 취소 상태에서는 `cancelReason`, `canceledAt`을 표시합니다.
- `providerPaymentKey`는 화면에 표시하지 않습니다.

### 5.3 Delivery summary

Content:

- 배송 상태
- 택배사
- 운송장 번호
- 배송 조회 링크
- 예상 배송일
- 출고 시각
- 배송 완료 시각
- 지연 사유

Display:

| Delivery status | Display | Message |
| --- | --- | --- |
| `PREPARING` | `배송 준비 중` | `상품 출고를 준비하고 있어요.` |
| `IN_TRANSIT` | `배송 중` | `택배사로 상품이 전달됐어요.` |
| `DELIVERED` | `배송 완료` | `상품 배송이 완료됐어요.` |
| `DELAYED` | `배송 지연` | `배송이 예상보다 늦어지고 있어요.` |
| `DELIVERY_FAILED` | `배송 실패` | `배송 확인이 필요해요.` |

Rules:

- `trackingUrl`이 있으면 `배송 조회` 링크를 제공합니다.
- `DELAYED` 상태에서는 `delayReason`과 예상 배송일을 함께 표시합니다.
- 보상 쿠폰이 발급된 경우 쿠폰 안내를 함께 표시할 수 있습니다.
- 내부 `shipmentId`, `orderId`는 표시하지 않습니다.

### 5.4 Order item snapshot

Data:

- `Order.lines`

Display:

- 상품 이미지
- 브랜드명
- 상품명
- 선택 옵션
- 수량
- 주문 시점 단가
- 주문 시점 상품별 금액

Rules:

- 주문 생성 시점의 스냅샷을 기준으로 표시합니다.
- 상품 가격이나 상품명이 이후 변경되어도 주문 상세의 금액은 바뀌지 않아야 합니다.
- 상품 상세로 이동하는 링크는 제공할 수 있지만, 현재 상품 정보와 주문 스냅샷이 다를 수 있음을 고려합니다.

### 5.5 Shipping address

Display:

- 받는 사람
- 연락처
- 우편번호
- 주소
- 상세 주소

Rules:

- 주문 완료 이후 배송지 수정은 MVP 범위에서 제공하지 않습니다.
- 개인정보 영역이므로 과도한 강조나 공유 CTA를 배치하지 않습니다.

### 5.6 PriceSummary

Content:

- 총 상품 금액: `subtotal`
- 총 할인 금액: `discountTotal`
- 최종 결제 금액: `finalTotal`
- 적용 쿠폰 요약

Rules:

- 주문 스냅샷의 `Order.pricing`을 사용합니다.
- 결제 금액 `Payment.amount`와 주문 최종 금액 `Order.pricing.finalTotal`이 다르면 오류 상태로 표시합니다.
- `finalTotal`을 가장 강하게 표시합니다.

### 5.7 CTA group

By state:

| State | Primary CTA | Secondary CTA |
| --- | --- | --- |
| Paid | `계속 쇼핑하기` | `주문 내역 보기`, `영수증 보기` |
| Payment pending | `결제 다시 시도` | `주문 내역 보기` |
| Payment failed | `결제 다시 시도` | `장바구니로 돌아가기` |
| Canceled | `상품 다시 보러가기` | `주문 내역 보기` |
| Delivery delayed | `배송 조회` | `주문 내역 보기` |
| Delivered | `리뷰 작성하기` | `상품 다시 보러가기` |

Rules:

- `결제 다시 시도`는 `PAYMENT_PENDING` 또는 `PAYMENT_FAILED` 주문에서만 제공합니다.
- 재시도 시 기존 주문의 금액과 상태를 재검증합니다.
- `영수증 보기`는 `Payment.receiptUrl`이 있을 때만 표시합니다.

## 6. 상태 디자인

### 6.1 Loading

- 상태 hero skeleton
- 주문 상품 skeleton
- 가격 요약 skeleton

### 6.2 Not found

Title:

```text
주문을 찾을 수 없어요
```

CTA:

- `주문 내역 보기`
- `상품 보러가기`

### 6.3 Order access denied

Use case:

- `orderNumber`는 존재하지만 현재 사용자의 주문이 아닌 경우

Display:

- 일반적인 not found와 동일하게 처리할 수 있습니다.
- 소유자 정보나 내부 존재 여부를 암시하지 않습니다.

### 6.4 Payment pending

Message:

```text
결제가 아직 완료되지 않았어요.
```

Actions:

- `결제 다시 시도`
- `주문 내역 보기`

### 6.5 Payment failed

Message:

```text
결제를 완료하지 못했어요.
```

Display:

- 실패 사유: `Payment.failureMessage`
- 재시도 CTA
- 장바구니 또는 상품 목록 이동 CTA

### 6.6 Payment mismatch

Use case:

- `Payment.amount`와 `Order.pricing.finalTotal`이 일치하지 않는 비정상 상태

Display:

- 사용자에게는 `주문 확인이 필요해요`로 안내합니다.
- 운영 로그에는 `orderNumber`, `paymentId`, 금액 차이를 남깁니다.

CTA:

- `주문 내역 보기`

### 6.7 Delivery delayed

Message:

```text
배송이 예상보다 늦어지고 있어요.
```

Display:

- 지연 사유: `Shipment.delayReason`
- 예상 배송일: `Shipment.estimatedDeliveryDate`
- 보상 쿠폰이 발급된 경우 쿠폰 안내

CTA:

- `배송 조회`
- `주문 내역 보기`

## 7. Interaction

- 주문 상세 진입 시 `GET /orders/:orderNumber`, `GET /orders/:orderNumber/payment`, `GET /orders/:orderNumber/shipment`를 조회합니다.
- 결제 상태만 실패해도 주문 상품 스냅샷은 표시할 수 있습니다.
- `결제 다시 시도`는 서버에서 주문 상태를 재검증한 뒤 토스 결제창을 다시 엽니다.
- `영수증 보기`는 새 탭 또는 외부 링크로 열 수 있습니다.
- `배송 조회`는 `Shipment.trackingUrl`이 있을 때만 표시합니다.
- 배송 완료 상태에서 `리뷰 작성하기`는 P1에서 `POST /reviews` 도입 후 활성화합니다.

## 8. Accessibility

- 주문 상태와 결제 상태는 badge 색상만으로 구분하지 않고 텍스트를 함께 제공합니다.
- 결제 실패 사유와 재시도 가능 여부는 스크린리더가 읽을 수 있는 위치에 둡니다.
- 배송 지연 사유와 예상 배송일은 badge와 별도 문구로 함께 제공합니다.
- 영수증 링크는 외부 링크임을 label로 안내합니다.
- 배송 조회 링크는 외부 링크임을 label로 안내합니다.
- 가격 요약은 할인/최종 금액을 텍스트로 명확히 구분합니다.
- 주문번호는 복사 가능한 텍스트로 제공할 수 있습니다.

## 9. 디자인 체크리스트

- [ ] `orderNumber` 중심 표시
- [ ] 내부 `orderId`, `paymentId`, `providerPaymentKey` 미노출
- [ ] `PAID` + `APPROVED` 성공 상태
- [ ] `PAYMENT_PENDING` 대기 상태
- [ ] `PAYMENT_FAILED` 실패 상태
- [ ] `CANCELLED` + `CANCELED` 취소 상태
- [ ] 영수증 링크
- [ ] 배송 상태 `PREPARING`, `IN_TRANSIT`, `DELIVERED`, `DELAYED`, `DELIVERY_FAILED`
- [ ] 운송장 번호와 배송 조회 링크
- [ ] 배송 지연 사유와 보상 쿠폰 안내
- [ ] 주문 상품 스냅샷
- [ ] 배송지 정보
- [ ] PriceSummary `subtotal`, `discountTotal`, `finalTotal`
- [ ] 결제 재시도 CTA
- [ ] Not found / access denied state
- [ ] Payment mismatch state
- [ ] Delivery delayed state
- [ ] 360px 이하에서 텍스트 넘침 없음
