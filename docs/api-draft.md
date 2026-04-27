# pin-stitch API 초안 (v2, 타입 상세)

## 1. 문서 목적

- `docs/plan.md` 기준 엔티티/용어에 맞춘 API 스펙 정의
- MVP + P1 범위 엔드포인트 초안
- 필드명/타입/제약조건 명시

## 2. 공통 규칙

### Base URL
- `/api/v1`

### Headers
- `Authorization: Bearer <accessToken>`
- `Content-Type: application/json`
- `Idempotency-Key: <uuid>` (결제/정산 확정 API 권장)

### 공통 응답 포맷

```json
{
  "success": true,
  "data": {},
  "error": null,
  "meta": {
    "requestId": "req_123",
    "timestamp": "2026-04-27T04:20:00.000Z"
  }
}
```

### 공통 에러 포맷

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "PRICING_CALCULATION_FAILED",
    "message": "Failed to calculate final price.",
    "details": {
      "destinationCountry": "KR"
    }
  },
  "meta": {
    "requestId": "req_123",
    "timestamp": "2026-04-27T04:20:00.000Z"
  }
}
```

### 타입 표기 규칙

- `string`: UTF-8 문자열
- `int`: 32-bit 정수
- `decimal`: 소수점 포함 숫자 (`number`)
- `boolean`: 참/거짓
- `datetime`: ISO 8601 UTC 문자열
- `enum`: 허용된 문자열 집합

## 3. 공통 도메인 타입

### 3.1 식별자 타입

| 필드 | 타입 | 예시 | 제약 |
|---|---|---|---|
| `productId` | string | `prod_123` | 필수, prefix `prod_` |
| `variantId` | string | `var_123` | 필수, prefix `var_` |
| `orderId` | string | `ord_123` | 필수, prefix `ord_` |
| `settlementId` | string | `set_123` | 필수, prefix `set_` |

### 3.2 금액 타입 (`Money`)

| 필드 | 타입 | 설명 | 제약 |
|---|---|---|---|
| `currency` | enum | ISO 4217 통화 | `KRW`, `USD`, `EUR` 등 |
| `amount` | decimal | 금액 | 0 이상 |

### 3.3 가격 견적 타입 (`PriceQuote`)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `basePrice` | `Money` | Y | 기준 판매가 |
| `taxAmount` | `Money` | Y | 세금 금액 |
| `dutyAmount` | `Money` | Y | 관세 금액 |
| `shippingFee` | `Money` | Y | 물류비 |
| `finalPrice` | `Money` | Y | 최종 결제 예상 금액 |
| `marginRate` | decimal | Y | 0.0 ~ 1.0 |
| `explain` | string[] | Y | 산출 근거 배열 |
| `calculatedAt` | datetime | Y | 계산 시각 |

## 4. 고객 웹 API (P0 -> P1)

## 4.1 상품 목록 조회 (P0)

- `GET /products`
- Query
  - `q`: string (optional, max 100)
  - `categoryId`: string (optional)
  - `brandId`: string (optional)
  - `sort`: enum `popular | newest | price_asc | price_desc` (default `popular`)
  - `page`: int (default 1, min 1)
  - `limit`: int (default 20, max 100)
- Response `data`
  - `items`: `ProductSummary[]`
  - `pagination`: `{ page: int, limit: int, total: int, totalPages: int }`

`ProductSummary` 타입

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `productId` | string | Y | 상품 ID |
| `name` | string | Y | 상품명 |
| `brandName` | string | Y | 브랜드명 |
| `thumbnailUrl` | string | Y | 썸네일 URL |
| `basePrice` | `Money` | Y | 기준가 |
| `inStock` | boolean | Y | 재고 여부 |

## 4.2 상품 상세 조회 (P0)

- `GET /products/:productId`
- Response `data`
  - `product`: `Product`
  - `variants`: `Variant[]`
  - `inventory`: `{ variantId: string, availableQuantity: int }[]`
  - `policies`: `{ shippingPolicy: string, returnPolicy: string }`

## 4.3 가격 계산 (AI Pricing Engine, P0)

- `POST /pricing/quote`
- Request

```json
{
  "productId": "prod_123",
  "variantId": "var_123",
  "quantity": 1,
  "destinationCountry": "KR",
  "currency": "KRW",
  "originCountry": "IT"
}
```

Request 필드 정의

| 필드 | 타입 | 필수 | 제약 |
|---|---|---|---|
| `productId` | string | Y | `prod_` prefix |
| `variantId` | string | Y | `var_` prefix |
| `quantity` | int | Y | 1 이상 |
| `destinationCountry` | string | Y | ISO 3166-1 alpha-2 |
| `currency` | string | Y | ISO 4217 |
| `originCountry` | string | N | ISO 3166-1 alpha-2 |

Response `data`

```json
{
  "basePrice": { "currency": "KRW", "amount": 250000 },
  "taxAmount": { "currency": "KRW", "amount": 25000 },
  "dutyAmount": { "currency": "KRW", "amount": 10000 },
  "shippingFee": { "currency": "KRW", "amount": 15000 },
  "finalPrice": { "currency": "KRW", "amount": 300000 },
  "marginRate": 0.22,
  "explain": [
    "Applied KR import duty rate",
    "Applied margin floor policy"
  ],
  "calculatedAt": "2026-04-27T04:20:00.000Z"
}
```

## 4.4 장바구니 (P0)

- `GET /cart`: 현재 장바구니 조회
- `POST /cart/items`: 장바구니 아이템 추가
- `PATCH /cart/items/:itemId`: 수량/옵션 수정
- `DELETE /cart/items/:itemId`: 아이템 삭제

## 4.5 체크아웃/주문 (P0)

- `POST /checkout/confirm`
  - 주문 스냅샷 생성 + 결제 요청
- `GET /orders/:orderId`
- `GET /my/orders`

`POST /checkout/confirm` Request

| 필드 | 타입 | 필수 | 제약 |
|---|---|---|---|
| `cartId` | string | Y | `cart_` prefix |
| `shippingAddress` | object | Y | 국가/우편번호/주소 필수 |
| `paymentMethodId` | string | Y | 등록된 결제 수단 |
| `expectedFinalPrice` | `Money` | Y | 프론트 계산값 |

## 5. 관리자 웹 API (P0 -> P1)

## 5.1 상품 관리 (P0)

- `GET /admin/products`
- `POST /admin/products`
- `GET /admin/products/:productId`
- `PATCH /admin/products/:productId`
- `DELETE /admin/products/:productId`

`POST /admin/products` Request 주요 필드

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `name` | string | Y | 상품명 |
| `brandPartnerId` | string | Y | 파트너 ID |
| `categoryId` | string | Y | 카테고리 ID |
| `variants` | object[] | Y | `sku`, `size`, `color`, `supplyPrice` 포함 |

## 5.2 가격 정책 관리 (P0/P1)

- `GET /admin/pricing-policies`
- `POST /admin/pricing-policies`
- `PATCH /admin/pricing-policies/:policyId`
- `POST /admin/pricing-policies/simulate`

### 시뮬레이션 요청 예시

```json
{
  "productId": "prod_123",
  "destinationCountry": "US",
  "currency": "USD",
  "policyOverrides": {
    "marginFloor": 0.18,
    "discountCap": 0.25
  }
}
```

`PricePolicy` 타입

| 필드 | 타입 | 필수 | 제약 |
|---|---|---|---|
| `policyId` | string | Y | `pol_` prefix |
| `name` | string | Y | 1~100 chars |
| `marginFloor` | decimal | Y | 0.0~1.0 |
| `discountCap` | decimal | Y | 0.0~1.0 |
| `isActive` | boolean | Y | 활성화 여부 |

## 5.3 주문/배송 관리 (P0)

- `GET /admin/orders`
- `PATCH /admin/orders/:orderId/status`
- `POST /admin/orders/:orderId/fulfill`

`PATCH /admin/orders/:orderId/status` Request

| 필드 | 타입 | 필수 | 제약 |
|---|---|---|---|
| `status` | enum | Y | `PLACED | PAID | FULFILLING | SHIPPED | DELIVERED | CANCELLED` |
| `reason` | string | N | 상태 변경 사유 |

## 5.4 정산 관리 (P0/P1)

- `GET /admin/settlements`
- `GET /admin/settlements/:settlementId`
- `POST /admin/settlements/:settlementId/finalize`

`Settlement` 타입

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `settlementId` | string | Y | 정산 ID |
| `periodStartAt` | datetime | Y | 정산 시작 |
| `periodEndAt` | datetime | Y | 정산 종료 |
| `grossSales` | `Money` | Y | 총 매출 |
| `refundAmount` | `Money` | Y | 환불 금액 |
| `feeAmount` | `Money` | Y | 수수료 |
| `netPayout` | `Money` | Y | 지급 예정 금액 |
| `status` | enum | Y | `DRAFT | FINALIZED | HOLD` |

## 6. AI Commerce Agent API (P1)

## 6.1 상품 등록 검증

- `POST /admin/ai/product-validation`
- 설명: 상품 필수값 누락/형식 오류/카테고리 불일치 검증

## 6.2 주문 예외 태스크 생성

- `POST /admin/ai/order-exception-tasks`
- 설명: 실패 주문을 운영 태스크로 자동 분류

## 6.3 정산 초안 생성

- `POST /admin/ai/settlement-draft`
- 설명: 기간별 주문/환불/수수료 집계 기반 정산 초안 생성

`WorkflowTask` 타입

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `taskId` | string | Y | `task_` prefix |
| `taskType` | enum | Y | `ORDER_EXCEPTION | SETTLEMENT_REVIEW | PRODUCT_REVIEW` |
| `status` | enum | Y | `OPEN | IN_PROGRESS | DONE` |
| `ownerId` | string | N | 담당자 |
| `createdAt` | datetime | Y | 생성 시각 |

## 7. 상태 코드 기준

- `200 OK`: 조회/수정 성공
- `201 Created`: 생성 성공
- `400 Bad Request`: 요청 형식 오류
- `401 Unauthorized`: 인증 실패
- `403 Forbidden`: 권한 부족
- `404 Not Found`: 리소스 없음
- `409 Conflict`: 상태 충돌(중복 처리, 멱등성 위반)
- `422 Unprocessable Entity`: 도메인 검증 실패
- `429 Too Many Requests`: 과도한 요청
- `500 Internal Server Error`: 서버 내부 오류

## 8. 우선순위 재정렬 요약

- P0: 상품 조회, 가격 견적, 장바구니, 체크아웃, 관리자 상품/주문/정산 기본 API
- P1: 정책 시뮬레이션 고도화, AI 운영 태스크, 정산 자동 초안

## 9. 향후 확장 포인트

- 버전 전략: `/api/v2` 병행 운영
- 외부 파트너 웹훅 수신 엔드포인트
- GraphQL/BFF 도입 검토
- 이벤트 기반 아키텍처 확장(주문/정산 비동기화)

