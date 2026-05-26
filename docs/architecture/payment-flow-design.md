# 토스페이먼츠 결제 흐름 설계

이 문서는 `pin-stitch`에 토스페이먼츠 테스트 결제를 붙이기 위한 주문-결제 도메인, API, 상태 전이를 정의합니다. API 세부 명세는 `api-reference.md`, 데이터 모델은 `erd.md`, 체크아웃 UI는 `../design/customer/checkout-screen-design.md`를 따릅니다.

## 1. 목표

- 체크아웃에서 주문 스냅샷을 만들고 토스페이먼츠 결제창으로 이동합니다.
- 토스 결제창 성공 후 서버에서 결제 금액과 주문번호를 검증하고 승인합니다.
- 결제 성공, 실패, 취소를 주문 상태와 결제 상태에 일관되게 반영합니다.
- 포트폴리오에서 설명 가능한 결제 정합성, 중복 승인 방지, 실패 복구 흐름을 갖춥니다.

## 2. 토스페이먼츠 기본 흐름

```text
/checkout
  -> POST /orders
  -> Toss Payments payment window
  -> successUrl?paymentKey=...&orderId=...&amount=...
  -> POST /payments/toss/confirm
  -> /orders/:orderNumber
```

핵심 값:

| 값 | 출처 | 역할 |
| --- | --- | --- |
| `paymentKey` | 토스페이먼츠 | 결제 건을 식별하는 PG 키. 승인, 조회, 취소에 사용 |
| `orderId` | 우리 서비스가 토스에 전달 | 토스 문서의 주문 ID. MVP에서는 `Order.orderNumber`와 동일하게 사용 |
| `amount` | 토스 성공 리다이렉트 | 결제창에서 승인하려는 금액. 서버에서 주문 금액과 반드시 비교 |

공식 문서 기준으로 토스 결제 승인 API는 `POST https://api.tosspayments.com/v1/payments/confirm`이며 요청 본문에 `paymentKey`, `orderId`, `amount`를 전달합니다.

## 3. 주문 상태

`OrderStatus`:

| 상태 | 의미 |
| --- | --- |
| `PAYMENT_PENDING` | 주문 스냅샷이 생성되었고 결제 승인을 기다리는 상태 |
| `PAID` | 토스 결제 승인까지 성공한 상태 |
| `PAYMENT_FAILED` | 결제 승인 실패가 확정된 상태 |
| `ORDER_CREATED` | 결제 없는 주문 생성 또는 레거시 호환 상태. 토스 결제 흐름에서는 사용하지 않는 것을 권장 |
| `PREPARING` | 결제 후 상품 준비 중 |
| `SHIPPED` | 배송 중 |
| `DELIVERED` | 배송 완료 |
| `CANCELLED` | 주문 취소 |

토스 결제 흐름의 기본 전이:

```text
PAYMENT_PENDING -> PAID -> PREPARING -> SHIPPED -> DELIVERED
PAYMENT_PENDING -> PAYMENT_FAILED
PAID -> CANCELLED
```

## 4. Payment 엔티티 구조

`Payment`는 외부 PG 결제 건을 우리 주문과 연결하는 기록입니다. 주문은 상품/배송/금액 스냅샷이고, 결제는 PG 승인/실패/취소 이력입니다.

| 필드 | 설명 |
| --- | --- |
| `paymentId` | 내부 결제 ID. 화면에 직접 노출하지 않습니다. |
| `orderId` | 내부 주문 ID FK. DB join에 사용합니다. |
| `orderNumber` | 사용자용 주문번호 스냅샷. 고객센터, 화면, URL에 사용합니다. |
| `provider` | 결제 제공자. MVP는 `TOSS_PAYMENTS`만 사용합니다. |
| `status` | 결제 상태. `READY`, `IN_PROGRESS`, `APPROVED`, `FAILED`, `CANCELED` |
| `amount` | 결제할 금액. 주문 스냅샷의 `finalTotal`과 같아야 합니다. |
| `providerOrderId` | 토스에 전달한 `orderId`. MVP에서는 `orderNumber`와 동일합니다. |
| `providerPaymentKey` | 토스가 발급한 `paymentKey`. 승인 이후 조회/취소에 사용합니다. |
| `method` | 카드, 계좌이체 등 토스 응답의 결제 수단입니다. |
| `receiptUrl` | 영수증 URL입니다. |
| `requestedAt` | 결제 요청 시작 시각입니다. |
| `approvedAt` | 승인 성공 시각입니다. |
| `failedAt` | 승인 실패 시각입니다. |
| `failureCode` | 토스 또는 내부 검증 실패 코드입니다. |
| `failureMessage` | 사용자 또는 운영자가 이해할 수 있는 실패 메시지입니다. |
| `canceledAt` | 취소 시각입니다. |
| `cancelReason` | 취소 사유입니다. |
| `createdAt`, `updatedAt` | 내부 레코드 생성/수정 시각입니다. |

왜 `Payment`가 따로 필요한가:

- 주문 금액과 결제 승인 금액을 비교한 기록을 남길 수 있습니다.
- 결제 실패 후 같은 주문을 다시 시도하거나 실패 사유를 보여줄 수 있습니다.
- 결제 취소/환불을 주문과 분리해 추적할 수 있습니다.
- PG의 `paymentKey`를 주문 도메인에 직접 섞지 않고 외부 결제 어댑터 영역으로 격리할 수 있습니다.

## 5. Payment 상태

| 상태 | 의미 | 주문 상태 |
| --- | --- | --- |
| `READY` | 주문은 만들어졌고 아직 결제창이 완료되지 않음 | `PAYMENT_PENDING` |
| `IN_PROGRESS` | 사용자가 토스 결제창을 진행 중 | `PAYMENT_PENDING` |
| `APPROVED` | 서버 승인 API까지 성공 | `PAID` |
| `FAILED` | 승인 실패 또는 서버 검증 실패 | `PAYMENT_FAILED` |
| `CANCELED` | 결제 승인 후 취소 완료 | `CANCELLED` |

## 6. API

### 주문 생성

```text
POST /orders
```

역할:

- 장바구니 스냅샷을 주문으로 저장합니다.
- `Order.status = PAYMENT_PENDING`으로 생성합니다.
- `orderNumber`를 발급합니다.
- `Payment.status = READY` 레코드를 생성합니다.
- 프론트엔드가 토스 결제창에 전달할 `orderId`는 `orderNumber`, `amount`는 `Order.pricing.finalTotal.amount`를 사용합니다.

### 토스 결제 승인

```text
POST /payments/toss/confirm
```

Request:

```json
{
  "paymentKey": "tgen_20260526123456abc",
  "orderId": "20260526-0001",
  "amount": 108000
}
```

서버 검증:

- `orderId`로 `Order.orderNumber`를 조회합니다.
- 주문 소유자가 현재 사용자와 일치하는지 확인합니다.
- 주문 상태가 `PAYMENT_PENDING`인지 확인합니다.
- `amount`가 `Order.pricing.finalTotal.amount`와 같은지 확인합니다.
- 이미 승인된 `providerPaymentKey`가 있는지 확인해 중복 승인을 막습니다.

승인 처리:

- 검증 통과 후 서버가 토스페이먼츠 `/v1/payments/confirm` API를 호출합니다.
- 성공하면 `Payment.status = APPROVED`, `Order.status = PAID`로 변경합니다.
- 실패하면 `Payment.status = FAILED`, `Order.status = PAYMENT_FAILED`로 변경합니다.
- 성공 후 장바구니를 비웁니다.

Response:

- `PaymentConfirmResponse`

### 결제 조회

```text
GET /orders/:orderNumber/payment
```

역할:

- 주문 상세 화면에서 결제 상태, 결제 수단, 영수증 URL을 보여줍니다.
- 내부 `paymentId`, `orderId`는 화면에 직접 표시하지 않습니다.

### 결제 취소

```text
POST /payments/:paymentId/cancel
```

Request:

```json
{
  "cancelReason": "사용자 요청"
}
```

MVP 규칙:

- 전액 취소만 지원합니다.
- `Payment.status = APPROVED`인 경우에만 취소합니다.
- 취소 성공 시 `Payment.status = CANCELED`, `Order.status = CANCELLED`로 변경합니다.

## 7. 실패 케이스

| 케이스 | 처리 |
| --- | --- |
| 사용자가 결제창을 닫음 | 주문은 `PAYMENT_PENDING`, 결제는 `READY` 또는 `IN_PROGRESS`로 남김. 체크아웃에서 재시도 제공 |
| 토스 성공 리다이렉트 후 금액 불일치 | 승인 API 호출 전 차단, `PAYMENT_FAILED` 처리 |
| 토스 성공 리다이렉트 후 주문번호 불일치 | 승인 API 호출 전 차단, `PAYMENT_FAILED` 처리 |
| 이미 승인된 주문 재승인 | `409 Conflict` 반환 |
| 토스 승인 API 실패 | 실패 코드/메시지 저장, `PAYMENT_FAILED` 처리 |
| 서버 confirm 중 네트워크 오류 | 결제 조회 API로 실제 승인 여부 확인 후 보정하는 운영 작업 필요 |

## 8. 구현 순서

1. `Payment` 타입과 Prisma 모델 추가
2. `OrderStatus`에 `PAYMENT_PENDING`, `PAID`, `PAYMENT_FAILED` 추가
3. `POST /orders`가 `PAYMENT_PENDING` 주문과 `READY` 결제 레코드를 만들도록 변경
4. 프론트 `/checkout`에서 토스페이먼츠 테스트 결제창 호출
5. `POST /payments/toss/confirm` 서버 승인 API 구현
6. 결제 성공/실패 리다이렉트 화면 구현
7. 주문 상세에서 결제 상태와 영수증 URL 표시
8. 전액 취소 API와 상태 전이 구현

## 9. 보안/정합성 규칙

- 토스 Secret Key는 서버 환경변수에만 저장합니다.
- 프론트엔드가 보낸 `amount`는 신뢰하지 않습니다.
- 프론트엔드가 보낸 `orderId`는 `Order.orderNumber`와 반드시 비교합니다.
- 결제 승인 API는 idempotency를 고려해 중복 호출을 방어합니다.
- 결제 성공 후 장바구니 삭제와 주문/결제 상태 변경은 하나의 트랜잭션으로 처리합니다.
- 운영 로그에는 `paymentKey`, 실패 코드, 주문번호를 남기되 카드번호 같은 민감정보는 저장하지 않습니다.
