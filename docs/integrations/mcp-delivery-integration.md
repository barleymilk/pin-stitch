# MCP 배송 자동화 연동 설계

이 문서는 추후 개발할 MCP 서버가 `pin-stitch`의 배송 상태 데이터를 활용해 배송 지연 선제 대응, 보상 쿠폰 발급, 교환/반품 접수를 자동화할 수 있도록 필요한 백엔드 데이터와 API 계약을 정리합니다.

## 1. 목표

- 배송 상태를 단순 조회 기능이 아니라 AI 에이전트가 판단하고 행동할 수 있는 운영 데이터로 만듭니다.
- MCP 서버가 지연 배송을 감지하고 고객 안내와 보상 쿠폰 발급까지 수행할 수 있게 합니다.
- 교환/반품 자동화는 P1/P2로 확장하되, 주문/배송/재고 API가 이어질 수 있는 형태로 설계합니다.

## 2. 전제

- 외부 택배사 실시간 API 연동은 P2로 미룹니다.
- MVP에서는 `Shipment` 데이터를 시드, 셀러/관리자 API, 가상 택배 API로 갱신합니다.
- MCP 서버는 백엔드 API를 호출하는 별도 운영 도구로 동작합니다.
- MCP 서버가 고객에게 직접 알림을 보내는 기능은 초기에는 로그 또는 데모 메시지로 대체할 수 있습니다.

## 3. 핵심 데이터

### Shipment

배송 자동화의 중심 데이터입니다.

- `orderNumber`
- `status`: `PREPARING`, `IN_TRANSIT`, `DELIVERED`, `DELAYED`, `DELIVERY_FAILED`
- `carrierName`
- `trackingNumber`
- `trackingUrl`
- `estimatedDeliveryDate`
- `delayReason`
- `lastCheckedAt`

### Order

- `orderNumber`
- `status`
- `userId`
- `lines`
- `shippingAddress`

### Coupon

- 배송 지연 보상 쿠폰 발급 결과로 생성합니다.
- 동일 주문에 중복 발급하지 않는 정책이 필요합니다.

## 4. MCP Tool 후보

### check_delayed_shipments

역할:

- 배송 준비 중 상태가 오래 지속되거나 `DELAYED`인 배송을 조회합니다.

백엔드 API:

```text
GET /seller/shipments/delayed?minPreparingDays=3&includeCompensated=false
```

Input:

```json
{
  "minPreparingDays": 3,
  "includeCompensated": false
}
```

Output:

```json
{
  "items": [
    {
      "orderNumber": "20260526-0001",
      "deliveryStatus": "DELAYED",
      "delayDays": 3,
      "reason": "PREPARING 상태가 3일 이상 지속되었습니다.",
      "compensationIssued": false
    }
  ]
}
```

### fetch_courier_status

역할:

- 운송장 번호를 기준으로 가상 택배 상태를 조회합니다.
- MVP에서는 실제 택배사 API 대신 mock 또는 seed 데이터를 사용합니다.

백엔드 API:

```text
GET /orders/:orderNumber/shipment
```

Input:

```json
{
  "orderNumber": "20260526-0001"
}
```

Output:

```json
{
  "orderNumber": "20260526-0001",
  "deliveryStatus": "DELAYED",
  "carrierName": "CJ대한통운",
  "trackingNumber": "1234567890",
  "estimatedDeliveryDate": "2026-05-30",
  "delayReason": "브랜드 출고 지연"
}
```

### issue_compensation_coupon

역할:

- 배송 지연 주문에 보상 쿠폰을 발급합니다.

백엔드 API:

```text
POST /seller/orders/:orderNumber/shipment/compensation-coupon
```

Input:

```json
{
  "orderNumber": "20260526-0001",
  "reason": "배송 지연 보상",
  "discountAmount": 3000,
  "expiresInDays": 30
}
```

Output:

```json
{
  "couponId": "cpn_delay_123",
  "orderNumber": "20260526-0001",
  "message": "배송 지연 보상 쿠폰이 발급되었습니다."
}
```

Rules:

- 같은 주문에 중복 발급하지 않습니다.
- 배송 상태가 `DELAYED`이거나 기준 일수 이상 `PREPARING`인 경우에만 발급합니다.
- 고객에게 노출할 안내 문구와 운영 로그용 사유를 분리합니다.

### fetch_order_history

역할:

- 고객의 최근 주문과 배송 상태를 조회합니다.
- 교환/반품 자동화 시나리오에서 사용합니다.

백엔드 API:

```text
GET /me/orders
```

Output:

```json
{
  "items": [
    {
      "orderNumber": "20260526-0001",
      "orderStatus": "DELIVERED",
      "deliveryStatus": "DELIVERED"
    }
  ]
}
```

### check_realtime_stock

역할:

- 교환하려는 옵션의 재고를 확인합니다.

백엔드 API:

```text
GET /products/:productId/store-inventory?variantId={variantId}
```

P1 확장:

- 온라인 재고 전용 API를 추가할 수 있습니다.

### create_return_ticket

역할:

- 교환/반품 접수를 생성합니다.

P1/P2 백엔드 API 후보:

```text
POST /returns
POST /exchanges
```

MVP에서는 반품 사유 분석 데이터가 이미 있으므로, 교환/반품 접수는 문서화만 해두고 실제 구현은 다음 단계로 미룹니다.

## 5. 킬러 시나리오

### 배송 지연 선제 대응

```text
check_delayed_shipments
  -> fetch_courier_status
  -> issue_compensation_coupon
  -> customer notification
```

동작:

1. MCP 서버가 배치로 `check_delayed_shipments`를 실행합니다.
2. `PREPARING`이 3일 이상 지속된 주문 또는 `DELAYED` 배송을 찾습니다.
3. `fetch_courier_status`로 최신 배송 상태와 지연 사유를 확인합니다.
4. `issue_compensation_coupon`으로 보상 쿠폰을 발급합니다.
5. 고객에게 `배송이 지연되어 보상 쿠폰을 발급했습니다` 메시지를 보냅니다.

### 자율 교환/반품 준비

```text
fetch_order_history
  -> check_realtime_stock
  -> create_return_ticket
```

동작:

1. 사용자가 `지난주에 산 가디건 L로 교환하고 싶어`라고 요청합니다.
2. MCP 서버가 최근 주문 중 `DELIVERED` 상태 상품을 찾습니다.
3. 교환 대상 옵션의 재고를 확인합니다.
4. 재고가 있으면 교환 접수와 재고 선점을 진행합니다.

## 6. 백엔드 준비 범위

P0:

- `Shipment` 타입과 DB 테이블
- 주문 상세 배송 조회 API
- 셀러/운영자 배송 상태 강제 업데이트 API
- 지연 배송 목록 API
- 배송 지연 보상 쿠폰 발급 API

P1:

- 고객 알림 저장 테이블
- 교환/반품 접수 API
- 온라인 재고 선점 API

P2:

- 실제 택배사 API polling
- MCP 서버의 정기 배치 실행
- 고객 대화창과 알림 연동

## 7. 보안/운영 규칙

- MCP 서버용 API는 셀러/관리자 권한 또는 별도 service token이 필요합니다.
- 고객 개인정보는 MCP tool output에서 최소화합니다.
- 배송 지연 감지 결과에는 `orderNumber`, 배송 상태, 지연 사유 중심으로 반환합니다.
- 보상 쿠폰 발급은 멱등성을 보장해야 합니다.
- 자동화 결과는 audit log에 남깁니다.
