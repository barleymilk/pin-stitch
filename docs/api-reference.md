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
- 응답 타입은 `packages/domain`의 타입을 재사용합니다.

## 3. 공통 타입

주요 타입은 `packages/domain/src/types.ts`를 기준으로 합니다.

- `User`, `BodyProfile`
- `Product`, `ProductVariant`, `SizeMeasurement`
- `FitReview`, `FitScore`, `ReviewSummary`
- `Store`, `StoreInventory`
- `Coupon`, `CouponApplication`, `ExcludedCoupon`, `CartPricing`
- `Cart`, `CartItem`
- `ShippingAddress`, `Order`, `OrderLine`, `OrderStatus`
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
| `sort` | string | `popular`, `newest`, `price_asc`, `price_desc`, `fit_score_desc` |
| `page` | number | 페이지 |
| `limit` | number | 개수 |

Response `data`:

```json
{
  "items": [
    {
      "productId": "prod_123",
      "brandName": "Muguet",
      "name": "Soft Line Jacket",
      "thumbnailUrl": "/images/products/prod_123.jpg",
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

Response `data`:

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
    "imageUrls": ["/images/products/prod_123_1.jpg"]
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
| `purchasedSize` | `ApparelSize` | 구매 사이즈 |
| `fitResult` | `FitResult` | 핏 평가 |
| `keyword` | string | 리뷰 키워드 |
| `page` | number | 페이지 |
| `limit` | number | 개수 |

Response `data`:

```json
{
  "items": [
    {
      "reviewId": "rev_123",
      "userId": "user_123",
      "productId": "prod_123",
      "variantId": "var_123",
      "rating": 4,
      "content": "허리는 잘 맞고 어깨가 살짝 여유 있어요.",
      "heightCm": 160,
      "bodyShape": "WAVE",
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

Response `data`: `ReviewSummary`

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
GET /orders/:orderId
GET /me/orders
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

- 주문은 실제 결제 없이 생성합니다.
- 주문 생성 시 장바구니 스냅샷을 저장합니다.
- 자동 적용된 쿠폰과 할인 금액을 주문 스냅샷에 저장합니다.
- 초기 상태는 `ORDER_CREATED`입니다.
- 주문 생성 후 장바구니는 비웁니다.

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
