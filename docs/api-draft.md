# pin-stitch API 초안 (v2)

## 1. 문서 목적

- 체형별 리뷰 분석 기반 패션 커머스의 MVP API 스펙을 정의한다.
- 고객 웹과 셀러 웹에서 공통으로 사용하는 도메인 타입을 정리한다.
- 실제 외부 연동 전 샘플 데이터 기반 구현을 전제로 한다.

## 2. 공통 규칙

### Base URL

- `/api/v1`

### 공통 응답 포맷

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

### 공통 에러 포맷

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

## 3. 공통 도메인 타입

### 3.1 식별자

| 필드 | 예시 | 설명 |
| --- | --- | --- |
| `userId` | `user_123` | 사용자 ID |
| `productId` | `prod_123` | 상품 ID |
| `variantId` | `var_123` | 상품 옵션 ID |
| `reviewId` | `rev_123` | 리뷰 ID |
| `storeId` | `store_123` | 매장 ID |
| `orderId` | `ord_123` | 주문 ID |
| `couponId` | `cpn_123` | 쿠폰 ID |

### 3.2 Money

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `currency` | string | Y | ISO 4217 통화 |
| `amount` | number | Y | 금액 |

### 3.3 BodyProfile

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `heightCm` | number | Y | 키 |
| `weightKg` | number | N | 몸무게 |
| `topSize` | string | Y | 평소 상의 사이즈 |
| `bottomSize` | string | Y | 평소 하의 사이즈 |
| `bodyShape` | enum | Y | `STRAIGHT`, `WAVE`, `NATURAL`, `UNKNOWN` |
| `fitPreference` | enum | Y | `SLIM`, `REGULAR`, `LOOSE` |
| `consentToUseBodyData` | boolean | Y | 체형 정보 활용 동의 |

### 3.4 FitReview

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `reviewId` | string | Y | 리뷰 ID |
| `productId` | string | Y | 상품 ID |
| `variantId` | string | Y | 구매 옵션 ID |
| `rating` | number | Y | 1~5 |
| `content` | string | Y | 리뷰 본문 |
| `heightCm` | number | N | 리뷰어 키 |
| `bodyShape` | enum | N | 리뷰어 골격 타입 |
| `purchasedSize` | string | Y | 구매 사이즈 |
| `fitResult` | enum | Y | `SMALL`, `TRUE_TO_SIZE`, `LARGE` |
| `positiveKeywords` | string[] | Y | 긍정 키워드 |
| `negativeKeywords` | string[] | Y | 부정 키워드 |
| `createdAt` | datetime | Y | 작성 시각 |

### 3.5 FitScore

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `score` | number | Y | 0~100 |
| `confidence` | enum | Y | `LOW`, `MEDIUM`, `HIGH` |
| `matchedReviewCount` | number | Y | 유사 체형 리뷰 수 |
| `reasons` | string[] | Y | 점수 근거 |

### 3.6 ReviewSummary

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `summary` | string | Y | 체형 기반 리뷰 요약 |
| `warnings` | string[] | Y | 사이즈/핏 주의사항 |
| `matchedReviewCount` | number | Y | 요약에 사용된 리뷰 수 |
| `basisReviewIds` | string[] | Y | 근거 리뷰 ID |

### 3.7 Coupon

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `couponId` | string | Y | 쿠폰 ID |
| `name` | string | Y | 쿠폰명 |
| `discountType` | enum | Y | `FIXED_AMOUNT`, `PERCENTAGE` |
| `discountValue` | number | Y | 정액 할인 금액 또는 정률 할인율 |
| `maxDiscountAmount` | number | N | 정률 쿠폰 최대 할인 금액 |
| `minOrderAmount` | number | N | 최소 주문 금액 |
| `targetType` | enum | Y | `ORDER`, `PRODUCT`, `CATEGORY`, `BRAND` |
| `targetIds` | string[] | Y | 적용 대상 ID 목록 |
| `stackable` | boolean | Y | 다른 쿠폰과 중복 가능 여부 |
| `startsAt` | datetime | Y | 사용 시작 시각 |
| `endsAt` | datetime | Y | 사용 종료 시각 |

### 3.8 CouponApplication

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `couponId` | string | Y | 적용 쿠폰 ID |
| `targetItemId` | string | N | 상품 쿠폰 적용 장바구니 아이템 ID |
| `discountAmount` | `Money` | Y | 할인 금액 |
| `reason` | string | Y | 적용 사유 |

### 3.9 CartPricing

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `subtotal` | `Money` | Y | 상품 금액 합계 |
| `discountTotal` | `Money` | Y | 쿠폰 할인 합계 |
| `finalTotal` | `Money` | Y | 최종 주문 예정 금액 |
| `appliedCoupons` | `CouponApplication[]` | Y | 자동 적용된 쿠폰 |
| `excludedCoupons` | object[] | Y | 조건 미충족 쿠폰과 제외 사유 |

## 4. 고객 API

## 4.1 체형 프로필 조회/저장

- `GET /me/body-profile`
- `PUT /me/body-profile`

`PUT /me/body-profile` Request

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

## 4.2 상품 목록 조회

- `GET /products`

Query

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `q` | string | 검색어 |
| `categoryId` | string | 카테고리 |
| `brandId` | string | 브랜드 |
| `minPrice` | number | 최소 가격 |
| `maxPrice` | number | 최대 가격 |
| `sort` | enum | `popular`, `newest`, `price_asc`, `price_desc`, `fit_score_desc` |
| `page` | number | 페이지 |
| `limit` | number | 개수 |

Response `data`

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

## 4.3 상품 상세 조회

- `GET /products/:productId`

Response `data`

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

## 4.4 체형 적합도 조회

- `GET /products/:productId/fit-score`

Response `data`: `FitScore`

## 4.5 리뷰 목록 조회

- `GET /products/:productId/reviews`

Query

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `heightMin` | number | 최소 키 |
| `heightMax` | number | 최대 키 |
| `bodyShape` | enum | 골격 타입 |
| `purchasedSize` | string | 구매 사이즈 |
| `fitResult` | enum | 핏 평가 |
| `keyword` | string | 리뷰 키워드 |
| `page` | number | 페이지 |
| `limit` | number | 개수 |

Response `data`

```json
{
  "items": [
    {
      "reviewId": "rev_123",
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

## 4.6 체형 기반 리뷰 요약

- `GET /products/:productId/review-summary`

Query

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `variantId` | string | 선택 옵션 |
| `bodyProfileId` | string | 생략 시 현재 사용자 프로필 사용 |

Response `data`

```json
{
  "summary": "160cm 전후 웨이브 체형 사용자는 허리 라인은 만족하지만 어깨가 약간 여유롭다는 의견이 많습니다.",
  "warnings": [
    "어깨가 좁은 사용자는 상체가 커 보일 수 있습니다.",
    "루즈핏을 싫어한다면 한 사이즈 작게 비교해보세요."
  ],
  "matchedReviewCount": 18,
  "basisReviewIds": ["rev_123", "rev_124"]
}
```

## 4.7 매장 재고 조회

- `GET /products/:productId/store-inventory`

Query

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `variantId` | string | 선택 옵션 |
| `lat` | number | 사용자 위도 |
| `lng` | number | 사용자 경도 |

Response `data`

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

## 4.8 장바구니

- `GET /cart`
- `POST /cart/items`
- `PATCH /cart/items/:itemId`
- `DELETE /cart/items/:itemId`
- `POST /cart/apply-best-coupons`

`POST /cart/items` Request

```json
{
  "productId": "prod_123",
  "variantId": "var_123",
  "quantity": 1
}
```

`GET /cart` Response `data`

```json
{
  "cartId": "cart_123",
  "items": [
    {
      "itemId": "cart_item_123",
      "productId": "prod_123",
      "variantId": "var_123",
      "quantity": 1,
      "unitPrice": { "currency": "KRW", "amount": 89000 },
      "lineTotal": { "currency": "KRW", "amount": 89000 }
    }
  ],
  "availableCoupons": [
    {
      "couponId": "cpn_123",
      "name": "아우터 10% 할인",
      "discountType": "PERCENTAGE",
      "discountValue": 0.1,
      "maxDiscountAmount": 15000,
      "minOrderAmount": 50000,
      "targetType": "CATEGORY",
      "targetIds": ["OUTER"],
      "stackable": true,
      "startsAt": "2026-05-01T00:00:00.000Z",
      "endsAt": "2026-05-31T23:59:59.000Z"
    }
  ],
  "pricing": {
    "subtotal": { "currency": "KRW", "amount": 89000 },
    "discountTotal": { "currency": "KRW", "amount": 8900 },
    "finalTotal": { "currency": "KRW", "amount": 80100 },
    "appliedCoupons": [
      {
        "couponId": "cpn_123",
        "targetItemId": "cart_item_123",
        "discountAmount": { "currency": "KRW", "amount": 8900 },
        "reason": "카테고리 조건을 만족하는 상품 중 최대 할인 조합으로 선택되었습니다."
      }
    ],
    "excludedCoupons": []
  }
}
```

`POST /cart/apply-best-coupons`

설명: 현재 장바구니와 보유 쿠폰을 기준으로 최종 주문 예정 금액이 가장 낮아지는 쿠폰 조합을 계산한다.

Response `data`: `CartPricing`

## 4.9 주문 생성

- `POST /orders`
- `GET /orders/:orderId`
- `GET /me/orders`

`POST /orders` Request

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

## 5. 셀러 API

## 5.1 셀러 대시보드

- `GET /seller/dashboard`

Response `data`

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
      "message": "웨이브 체형 고객의 어깨 여유 관련 불만이 반복됩니다."
    }
  ]
}
```

## 5.2 상품별 인사이트

- `GET /seller/products/:productId/insights`

Response `data`

```json
{
  "productId": "prod_123",
  "fitSatisfactionByBodyShape": [
    {
      "bodyShape": "WAVE",
      "averageRating": 4.1,
      "fitComplaintRate": 0.22
    }
  ],
  "sizeFitDistribution": [
    {
      "size": "M",
      "small": 4,
      "trueToSize": 32,
      "large": 8
    }
  ],
  "keywords": {
    "positive": [
      { "keyword": "소재", "count": 18 },
      { "keyword": "허리", "count": 12 }
    ],
    "negative": [
      { "keyword": "어깨", "count": 9 },
      { "keyword": "기장", "count": 6 }
    ]
  },
  "insights": [
    {
      "type": "DETAIL_PAGE_IMPROVEMENT",
      "message": "어깨 실측과 착용 컷을 상세페이지 상단에 보강해야 합니다.",
      "severity": "MEDIUM"
    }
  ]
}
```

## 5.3 리뷰 분석

- `GET /seller/reviews`

Query

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `productId` | string | 상품 |
| `bodyShape` | enum | 골격 타입 |
| `purchasedSize` | string | 구매 사이즈 |
| `ratingMax` | number | 최대 평점 |
| `keyword` | string | 키워드 |

Response `data`

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

## 5.4 반품 분석

- `GET /seller/returns/analysis`

Response `data`

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

## 6. 상태 코드 기준

- `200 OK`: 조회/수정 성공
- `201 Created`: 생성 성공
- `400 Bad Request`: 요청 형식 오류
- `401 Unauthorized`: 인증 실패
- `403 Forbidden`: 권한 부족
- `404 Not Found`: 리소스 없음
- `409 Conflict`: 상태 충돌
- `422 Unprocessable Entity`: 도메인 검증 실패
- `500 Internal Server Error`: 서버 내부 오류

## 7. 향후 확장 포인트

- `POST /reviews`: 리뷰 작성
- `POST /returns`: 반품 사유 등록
- `POST /ai/review-summary`: LLM 기반 리뷰 요약
- `POST /ai/return-classification`: 반품 사유 자동 분류
- `GET /recommendations/body-fit`: 체형 기반 추천
- `POST /stores/visit-reservations`: 매장 방문 예약
