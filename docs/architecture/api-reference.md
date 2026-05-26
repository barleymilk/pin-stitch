# pin-stitch API 명세

## 1. 기본 규칙

MVP API는 `apps/api`의 NestJS 서버에서 구현합니다. 데이터는 PostgreSQL에 저장하고 Prisma로 접근합니다. 초기 데모 데이터는 seed 스크립트로 적재합니다.

Base URL:

```text
/api/v1
```

모든 응답은 `packages/domain/src/types.ts`의 `ApiResponse<T>` 형태를 따릅니다.

성공:

```json
{
  "success": true,
  "data": {},
  "error": null,
  "meta": {
    "requestId": "req_123",
    "timestamp": "2026-05-15T00:00:00.000Z"
  }
}
```

실패:

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request.",
    "details": {}
  },
  "meta": {
    "requestId": "req_123",
    "timestamp": "2026-05-15T00:00:00.000Z"
  }
}
```

## 2. 구현 원칙

- NestJS Controller는 요청 파싱, DTO 검증, 응답 포맷을 담당합니다.
- NestJS Service는 유스케이스와 비즈니스 흐름을 담당합니다.
- DB 접근은 Prisma Client를 사용합니다.
- 초기 데이터는 Prisma seed 스크립트로 PostgreSQL에 적재합니다.
- 계산은 `packages/domain` 함수로 처리합니다.
- 응답 타입은 `packages/domain`의 타입을 재사용하되, 사용자 화면에 내부 필드를 숨겨야 하는 경우 외부 응답 DTO를 별도로 정의합니다.
- 내부 계산/저장 타입과 외부 응답 DTO가 다른 경우 외부 응답 DTO를 우선 사용합니다.
- 일반 사용자 API에는 내부 추적용 ID 배열, 원본 근거 ID, 디버깅용 필드를 직접 노출하지 않습니다.

## 3. 공통 타입

주요 타입은 `packages/domain/src/types.ts`를 기준으로 합니다.

- `User`, `BodyProfile`
- `Product`, `ProductImage`, `ProductVariant`, `SizeMeasurement`
- `ProductListResponse`, `ProductDetailResponse`
- `FitReview`, `ReviewListResponse`, `FitScore`, `ReviewSummary`, `ReviewSummaryResponse`
- `Store`, `StoreInventory`
- `Coupon`, `CouponApplication`, `ExcludedCoupon`, `CartPricing`
- `Cart`, `CartItem`
- `ShippingAddress`, `Order`, `OrderLine`, `OrderStatus`
- `Payment`, `PaymentStatus`, `PaymentProvider`, `PaymentConfirmResponse`
- `Shipment`, `DeliveryStatus`, `DelayedShipment`
- `ReturnReason`
- `SellerInsight`, `SellerProductInsight`
- `Pagination`, `ApiResponse<T>`

## 4. 고객 API

### 체형 프로필

```text
GET /me/body-profile
PUT /me/body-profile
```

`PUT /me/body-profile` request:

```json
{
  "heightCm": 162,
  "weightKg": 52,
  "topSize": "S",
  "bottomSize": "M",
  "bodyShape": "WAVE",
  "fitPreference": "REGULAR",
  "consentToUseBodyData": true
}
```

### 상품 목록

```text
GET /products
```

Query:

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `q` | string | 검색어 |
| `category` | `ProductCategory` | 카테고리 |
| `brandId` | string | 브랜드 |
| `minPrice` | number | 최소 가격 |
| `maxPrice` | number | 최대 가격 |
| `recommendedFitOnly` | boolean | `true`면 점수와 신뢰도를 함께 만족하는 추천 적합도 상품만 조회 |
| `sort` | string | `popular`, `newest`, `price_asc`, `price_desc`, `fit_score_desc` |
| `page` | number | 페이지 |
| `limit` | number | 개수 |

MVP에서는 체형 적합도 점수 범위 필터를 제공하지 않습니다. `recommendedFitOnly=true`는 점수만으로 자르지 않고 `score >= 70`, `matchedReviewCount >= 5`, `confidence != LOW`를 함께 만족하는 상품을 대상으로 합니다. 순수 점수 범위 필터는 P1 이후 도입합니다.

Response `data`: `ProductListResponse`

```json
{
  "items": [
    {
      "productId": "prod_123",
      "brandName": "Muguet",
      "name": "Soft Line Jacket",
      "thumbnail": {
        "url": "/images/products/prod_123.jpg",
        "altText": "Muguet Soft Line Jacket Black front view"
      },
      "price": { "currency": "KRW", "amount": 89000 },
      "fitScore": {
        "productId": "prod_123",
        "score": 86,
        "confidence": "MEDIUM",
        "matchedReviewCount": 18,
        "reasons": ["유사 체형의 정사이즈 만족도가 높습니다."]
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 80,
    "totalPages": 4
  }
}
```

### 상품 상세

```text
GET /products/:productId
```

Response `data`: `ProductDetailResponse`

```json
{
  "product": {
    "productId": "prod_123",
    "brandName": "Muguet",
    "name": "Soft Line Jacket",
    "description": "가벼운 소재의 싱글 재킷",
    "price": { "currency": "KRW", "amount": 89000 },
    "category": "OUTER",
    "material": "Polyester 78%, Rayon 18%, Span 4%",
    "fit": "REGULAR",
    "images": [
      {
        "url": "/images/products/prod_123_1.jpg",
        "altText": "Muguet Soft Line Jacket Black front view",
        "sortOrder": 1
      }
    ]
  },
  "variants": [
    {
      "variantId": "var_123",
      "productId": "prod_123",
      "sku": "JACKET-BLACK-M",
      "color": "Black",
      "size": "M",
      "availableQuantity": 12
    }
  ],
  "sizeGuide": [
    {
      "size": "M",
      "shoulderCm": 42,
      "chestCm": 50,
      "lengthCm": 58
    }
  ]
}
```

### 체형 적합도

```text
GET /products/:productId/fit-score
```

Query:

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `variantId` | string | 선택 옵션. 생략 가능 |
| `bodyProfileId` | string | 생략 시 현재 샘플 사용자 프로필 사용 |

Response `data`: `FitScore`

### 리뷰 목록

```text
GET /products/:productId/reviews
```

Query:

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `heightMin` | number | 최소 키 |
| `heightMax` | number | 최대 키 |
| `bodyShape` | `BodyShape` | 골격 타입 |
| `fitPreference` | `FitPreference` | 리뷰 작성 시점의 선호 핏 |
| `purchasedSize` | `ApparelSize` | 구매 사이즈 |
| `fitResult` | `FitResult` | 핏 평가 |
| `keyword` | string | 리뷰 키워드 |
| `page` | number | 페이지 |
| `limit` | number | 개수 |

Response `data`: `ReviewListResponse`

고객 리뷰 목록은 내부 `FitReview`가 아니라 비식별 응답 DTO를 사용합니다. `reviewId`, `userId`, `productId`, `variantId`는 응답에 포함하지 않습니다.

```json
{
  "items": [
    {
      "reviewerLabel": "비슷한 체형의 구매자",
      "rating": 4,
      "content": "허리는 잘 맞고 어깨가 살짝 여유 있어요.",
      "heightCm": 160,
      "bodyShape": "WAVE",
      "fitPreference": "REGULAR",
      "purchasedSize": "M",
      "fitResult": "TRUE_TO_SIZE",
      "positiveKeywords": ["허리", "소재"],
      "negativeKeywords": ["어깨"],
      "createdAt": "2026-05-15T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 24,
    "totalPages": 3
  }
}
```

### 체형 기반 리뷰 요약

```text
GET /products/:productId/review-summary
```

Query:

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `variantId` | string | 선택 옵션. 생략 가능 |
| `bodyProfileId` | string | 생략 시 현재 샘플 사용자 프로필 사용 |

Response `data`: `ReviewSummaryResponse`

`ReviewSummaryResponse`는 내부 계산 타입인 `ReviewSummary`에서 `basisReviewIds`를 제거하고, 사용자 화면에 필요한 체형 조건과 대표 근거 리뷰만 포함합니다.

```json
{
  "productId": "prod_123",
  "variantId": "var_123",
  "summary": "160cm 전후 WAVE 체형 사용자는 허리 라인은 만족하지만 어깨가 약간 여유롭다는 의견이 많습니다.",
  "warnings": ["어깨가 여유롭다는 리뷰가 반복됩니다."],
  "matchedReviewCount": 18,
  "bodyCondition": {
    "heightCm": 162,
    "bodyShape": "WAVE",
    "fitPreference": "REGULAR",
    "purchasedSize": "M"
  },
  "representativeReviews": [
    {
      "rating": 4,
      "content": "허리는 잘 맞고 어깨가 살짝 여유 있어요.",
      "heightCm": 160,
      "bodyShape": "WAVE",
      "fitPreference": "REGULAR",
      "purchasedSize": "M",
      "fitResult": "TRUE_TO_SIZE",
      "positiveKeywords": ["허리", "소재"],
      "negativeKeywords": ["어깨"],
      "createdAt": "2026-05-15T00:00:00.000Z"
    }
  ]
}
```

### 매장 재고

```text
GET /products/:productId/store-inventory
```

Query:

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `variantId` | string | 선택 옵션 |
| `lat` | number | 사용자 위도. 생략 가능 |
| `lng` | number | 사용자 경도. 생략 가능 |

Response `data`:

```json
{
  "stores": [
    {
      "storeId": "store_123",
      "name": "pin-stitch Hongdae",
      "distanceKm": 2.4,
      "isOpen": true,
      "quantity": 3,
      "locationInStore": {
        "floor": "2F",
        "zone": "Outer",
        "rack": "A-03"
      }
    }
  ]
}
```

### 장바구니

```text
GET /cart
POST /cart/items
PATCH /cart/items/:itemId
DELETE /cart/items/:itemId
POST /cart/apply-best-coupons
```

`POST /cart/items` request:

```json
{
  "productId": "prod_123",
  "variantId": "var_123",
  "quantity": 1
}
```

`PATCH /cart/items/:itemId` request:

```json
{
  "quantity": 2
}
```

`POST /cart/apply-best-coupons` response `data`: `CartPricing`

### 주문

```text
POST /orders
GET /orders/:orderNumber
GET /me/orders
GET /orders/:orderNumber/shipment
```

`POST /orders` request:

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

주문 생성 규칙:

- 주문은 결제 대기 상태로 먼저 생성합니다.
- 주문 생성 시 장바구니 스냅샷을 저장합니다.
- 주문 생성 시 내부 `orderId`와 별도의 사용자용 `orderNumber`를 발급합니다.
- 자동 적용된 쿠폰과 할인 금액을 주문 스냅샷에 저장합니다.
- 초기 상태는 `PAYMENT_PENDING`입니다.
- 주문 생성 시 토스페이먼츠 결제창에 전달할 `orderId`는 사용자용 `orderNumber`와 같은 값을 사용합니다.
- 결제 승인 성공 후 주문 상태를 `PAID`로 변경하고 장바구니를 비웁니다.
- 결제 승인 실패가 확정되면 주문 상태를 `PAYMENT_FAILED`로 변경합니다.
- 일반 사용자 화면과 고객용 주문 상세 조회 URL에는 `orderNumber`를 사용합니다.

### 결제

토스페이먼츠 테스트 결제를 기준으로 합니다. 프론트엔드는 토스 결제창 성공 리다이렉트에서 받은 `paymentKey`, `orderId`, `amount`를 우리 서버로 보내고, 서버가 토스페이먼츠 승인 API를 호출합니다.

토스페이먼츠 공식 문서 기준 결제 승인 API는 `POST https://api.tosspayments.com/v1/payments/confirm`이며, 승인 요청에는 `paymentKey`, `orderId`, `amount`가 필요합니다. 우리 서버는 이 값을 그대로 신뢰하지 않고 주문 스냅샷의 `orderNumber`, `finalTotal`과 비교한 뒤 승인 요청을 보냅니다.

```text
POST /payments/toss/confirm
GET /orders/:orderNumber/payment
POST /payments/:paymentId/cancel
```

`POST /payments/toss/confirm` request:

```json
{
  "paymentKey": "tgen_20260526123456abc",
  "orderId": "20260526-0001",
  "amount": 108000
}
```

`POST /payments/toss/confirm` response `data`: `PaymentConfirmResponse`

```json
{
  "orderNumber": "20260526-0001",
  "orderStatus": "PAID",
  "payment": {
    "paymentId": "pay_123",
    "orderId": "ord_123",
    "orderNumber": "20260526-0001",
    "provider": "TOSS_PAYMENTS",
    "status": "APPROVED",
    "amount": { "currency": "KRW", "amount": 108000 },
    "providerOrderId": "20260526-0001",
    "providerPaymentKey": "tgen_20260526123456abc",
    "method": "CARD",
    "receiptUrl": "https://dashboard.tosspayments.com/receipt/redirection?transactionId=...",
    "requestedAt": "2026-05-26T12:30:00.000Z",
    "approvedAt": "2026-05-26T12:31:00.000Z",
    "createdAt": "2026-05-26T12:30:00.000Z",
    "updatedAt": "2026-05-26T12:31:00.000Z"
  }
}
```

결제 승인 규칙:

- `orderId`는 토스페이먼츠 요청/응답의 필드명이며, 우리 도메인에서는 `orderNumber`와 매칭합니다.
- 서버는 `orderId === Order.orderNumber`인지 확인합니다.
- 서버는 `amount === Order.pricing.finalTotal.amount`인지 확인합니다.
- 주문 상태가 `PAYMENT_PENDING`이 아니면 중복 승인 요청으로 보고 `409 Conflict`를 반환합니다.
- 검증 통과 후 서버에서 토스페이먼츠 승인 API를 호출합니다.
- 승인 성공 시 `Payment.status = APPROVED`, `Order.status = PAID`로 변경합니다.
- 승인 실패 시 `Payment.status = FAILED`, `Order.status = PAYMENT_FAILED`로 변경하고 실패 코드와 메시지를 저장합니다.
- 결제 승인 성공 후 장바구니를 비웁니다.

`GET /orders/:orderNumber/payment` response `data`: `Payment`

`POST /payments/:paymentId/cancel` request:

```json
{
  "cancelReason": "사용자 요청"
}
```

취소 규칙:

- MVP에서는 전액 취소만 지원합니다.
- 취소 성공 시 `Payment.status = CANCELED`, `Order.status = CANCELLED`로 변경합니다.
- 이미 배송 준비 이후인 주문은 취소 정책에 따라 `409 Conflict`를 반환할 수 있습니다.

### 배송

MVP에서는 외부 택배사 실시간 연동 대신 내부 배송 상태와 운송장 정보를 저장합니다. 이후 MCP 서버는 아래 API를 호출해 배송 지연 감지, 고객 선제 안내, 보상 쿠폰 발급을 자동화할 수 있습니다.

```text
GET /orders/:orderNumber/shipment
PATCH /seller/orders/:orderNumber/shipment
GET /seller/shipments/delayed
POST /seller/orders/:orderNumber/shipment/compensation-coupon
```

`GET /orders/:orderNumber/shipment` response `data`: `Shipment`

```json
{
  "shipmentId": "ship_123",
  "orderId": "ord_123",
  "orderNumber": "20260526-0001",
  "status": "IN_TRANSIT",
  "carrierName": "CJ대한통운",
  "trackingNumber": "1234567890",
  "trackingUrl": "https://example-courier.test/track/1234567890",
  "estimatedDeliveryDate": "2026-05-28",
  "shippedAt": "2026-05-27T10:00:00.000Z",
  "deliveredAt": null,
  "delayedAt": null,
  "delayReason": null,
  "lastCheckedAt": "2026-05-27T12:00:00.000Z",
  "createdAt": "2026-05-26T12:31:00.000Z",
  "updatedAt": "2026-05-27T12:00:00.000Z"
}
```

`PATCH /seller/orders/:orderNumber/shipment` request:

```json
{
  "status": "DELAYED",
  "carrierName": "CJ대한통운",
  "trackingNumber": "1234567890",
  "trackingUrl": "https://example-courier.test/track/1234567890",
  "estimatedDeliveryDate": "2026-05-30",
  "delayReason": "브랜드 출고 지연"
}
```

배송 상태:

| 상태 | 의미 |
| --- | --- |
| `PREPARING` | 배송 준비 중 |
| `IN_TRANSIT` | 배송 중 |
| `DELIVERED` | 배송 완료 |
| `DELAYED` | 배송 지연 |
| `DELIVERY_FAILED` | 배송 실패 |

배송 상태 규칙:

- 결제 승인 성공 후 기본 배송 상태는 `PREPARING`입니다.
- `SHIPPED` 주문 상태는 `Shipment.status = IN_TRANSIT`와 함께 사용할 수 있습니다.
- `DELIVERED` 주문 상태는 `Shipment.status = DELIVERED`와 함께 사용할 수 있습니다.
- 배송 상태가 `DELAYED`면 고객 주문 상세와 주문 내역에서 지연 안내를 표시합니다.
- 고객 화면에는 내부 `shipmentId`, `orderId`를 노출하지 않습니다.

`GET /seller/shipments/delayed` query:

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `minPreparingDays` | number | `PREPARING` 상태가 이 일수 이상 지속된 주문. 기본값 3 |
| `includeCompensated` | boolean | 이미 보상 쿠폰을 발급한 지연 건 포함 여부 |

Response `data`:

```json
{
  "items": [
    {
      "shipment": {
        "shipmentId": "ship_123",
        "orderId": "ord_123",
        "orderNumber": "20260526-0001",
        "status": "DELAYED",
        "estimatedDeliveryDate": "2026-05-30",
        "delayReason": "브랜드 출고 지연",
        "createdAt": "2026-05-26T12:31:00.000Z",
        "updatedAt": "2026-05-29T09:00:00.000Z"
      },
      "delayDays": 3,
      "reason": "PREPARING 상태가 3일 이상 지속되었습니다.",
      "compensationIssued": false
    }
  ]
}
```

`POST /seller/orders/:orderNumber/shipment/compensation-coupon` request:

```json
{
  "reason": "배송 지연 보상",
  "discountAmount": 3000,
  "expiresInDays": 30
}
```

보상 쿠폰 규칙:

- 배송 상태가 `DELAYED`이거나 `PREPARING` 상태가 기준 일수 이상 지속된 주문에만 발급합니다.
- 동일 주문에 중복 보상 쿠폰을 발급하지 않습니다.
- 발급 결과는 쿠폰 도메인의 `Coupon`으로 저장하고, MCP 서버 로그에는 `orderNumber`와 발급 쿠폰 ID만 남깁니다.

## 5. 셀러 API

### 셀러 대시보드

```text
GET /seller/dashboard
```

Response `data`:

```json
{
  "summary": {
    "productCount": 42,
    "averageRating": 4.3,
    "fitComplaintRate": 0.18,
    "returnRate": 0.07
  },
  "problemProducts": [
    {
      "productId": "prod_123",
      "name": "Soft Line Jacket",
      "issue": "어깨 핏 불만 비율 증가",
      "severity": "HIGH"
    }
  ],
  "recentInsights": [
    {
      "insightId": "ins_123",
      "productId": "prod_123",
      "message": "WAVE 체형 고객의 어깨 여유 관련 불만이 반복됩니다.",
      "severity": "MEDIUM"
    }
  ]
}
```

### 상품별 인사이트

```text
GET /seller/products/:productId/insights
```

Response `data`: `SellerProductInsight`

### 셀러 리뷰 분석

```text
GET /seller/reviews
```

Query:

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `productId` | string | 상품 |
| `bodyShape` | `BodyShape` | 골격 타입 |
| `fitPreference` | `FitPreference` | 리뷰 작성 시점의 선호 핏 |
| `purchasedSize` | `ApparelSize` | 구매 사이즈 |
| `ratingMax` | number | 최대 평점 |
| `keyword` | string | 키워드 |
| `page` | number | 페이지 |
| `limit` | number | 개수 |

Response `data`:

```json
{
  "items": [],
  "keywordSummary": {
    "positive": [],
    "negative": []
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "totalPages": 0
  }
}
```

### 반품 분석

```text
GET /seller/returns/analysis
```

Query:

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `productId` | string | 선택 상품. 생략 시 전체 상품 기준 |

Response `data`:

```json
{
  "returnReasonStats": [
    {
      "reason": "SIZE_TOO_SMALL",
      "count": 18,
      "ratio": 0.36
    }
  ],
  "bodyShapeIssues": [
    {
      "bodyShape": "STRAIGHT",
      "topIssue": "어깨가 답답함",
      "count": 7
    }
  ],
  "productReturnRates": [
    {
      "productId": "prod_123",
      "name": "Soft Line Jacket",
      "returnRate": 0.09
    }
  ]
}
```

## 6. 상태 코드

| 코드 | 의미 |
| --- | --- |
| `200 OK` | 조회/수정 성공 |
| `201 Created` | 생성 성공 |
| `400 Bad Request` | 요청 형식 오류 |
| `401 Unauthorized` | 인증 실패 |
| `403 Forbidden` | 권한 부족 |
| `404 Not Found` | 리소스 없음 |
| `409 Conflict` | 상태 충돌 |
| `422 Unprocessable Entity` | 도메인 검증 실패 |
| `500 Internal Server Error` | 서버 내부 오류 |

## 7. 향후 확장 API

- `POST /reviews`: 리뷰 작성
- `POST /returns`: 반품 사유 등록
- `POST /ai/review-summary`: LLM 기반 리뷰 요약
- `POST /ai/return-classification`: 반품 사유 자동 분류
- `GET /recommendations/body-fit`: 체형 기반 추천
- `POST /stores/visit-reservations`: 매장 방문 예약
