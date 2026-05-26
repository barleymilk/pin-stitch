# 주문 내역 화면 디자인 `/me/orders`

이 문서는 고객 주문 내역 화면의 디자인 명세입니다. 주문 상세 기준은 `order-detail-screen-design.md`, 결제/배송 상태 기준은 `../../architecture/payment-flow-design.md`, `../../integrations/mcp-delivery-integration.md`를 따릅니다.

## 1. 화면 목표

- 사용자가 최근 주문, 결제 상태, 배송 상태를 빠르게 훑고 주문 상세로 이동하게 합니다.
- 배송 지연이나 결제 실패처럼 행동이 필요한 주문을 먼저 알아볼 수 있게 합니다.
- 내부 `orderId`, `paymentId`, `shipmentId`는 표시하지 않고 `orderNumber`만 사용자용 식별자로 사용합니다.

## 2. 주요 데이터

API:

```text
GET /me/orders
```

Recommended response shape:

- `orderNumber`
- `status`
- `paymentStatus`
- `deliveryStatus`
- `orderedAt`
- `summaryItemName`
- `itemCount`
- `finalTotal`
- `thumbnail`

## 3. 레이아웃

Desktop:

```text
Header
PageHeader
Filter tabs: 전체 | 결제대기 | 결제완료 | 배송중 | 배송완료 | 취소
OrderSummaryCard list
Pagination or Load more
```

Mobile:

- 필터는 가로 스크롤 segmented control로 제공합니다.
- 주문 카드는 1컬럼으로 표시합니다.
- 상태 badge, 상품 요약, 최종 금액, 상세 CTA를 한 카드 안에 정리합니다.

## 4. 화면 영역 상세

### 4.1 PageHeader

Title:

```text
주문 내역
```

Description:

```text
주문, 결제, 배송 상태를 확인할 수 있어요.
```

### 4.2 Order filter

Tabs:

- 전체
- 결제대기
- 결제완료
- 배송중
- 배송완료
- 취소

Rules:

- 필터 변경 시 `page=1`로 초기화합니다.
- 지연 배송이 있으면 `배송중` 탭 또는 카드에 `지연` badge를 함께 표시합니다.

### 4.3 OrderSummaryCard

Content:

- 주문일
- 주문번호 `orderNumber`
- 주문 상태 badge
- 결제 상태 badge
- 배송 상태 badge
- 대표 상품 이미지와 상품명
- `외 N개` 표시
- 최종 결제 금액
- CTA: `상세 보기`

Status priority:

1. `PAYMENT_FAILED`
2. `PAYMENT_PENDING`
3. `DELAYED`
4. `IN_TRANSIT`
5. `DELIVERED`
6. `PAID`

Rules:

- 사용자가 조치해야 하는 상태를 카드 상단에 우선 표시합니다.
- 상품 이미지는 `thumbnail.altText`를 사용합니다.
- 카드 전체 또는 CTA는 `/orders/:orderNumber`로 이동합니다.

## 5. 상태 디자인

- Loading: 주문 카드 skeleton 5개
- Empty: `아직 주문 내역이 없어요`, CTA `상품 보러가기`
- Error: `주문 내역을 불러오지 못했어요`, CTA `다시 시도`
- Payment failed: 카드에 `결제 실패`, CTA `결제 다시 시도`
- Delivery delayed: 카드에 지연 사유 요약과 `배송 조회`

## 6. Accessibility

- 상태 badge는 색상만으로 구분하지 않고 텍스트를 포함합니다.
- 주문번호는 복사 가능한 텍스트로 제공할 수 있습니다.
- 카드 링크와 상세 CTA의 중복 포커스가 과하지 않게 구성합니다.

## 7. 체크리스트

- [ ] 주문 상태/결제 상태/배송 상태 badge
- [ ] `orderNumber` 표시
- [ ] 내부 ID 미노출
- [ ] Empty/Error/Loading
- [ ] 결제 실패/배송 지연 강조
- [ ] 모바일 1컬럼 카드
