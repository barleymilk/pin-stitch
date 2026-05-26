# pin-stitch 문서 안내

`pin-stitch`는 체형 정보와 실제 구매 리뷰를 연결해 패션 상품 구매 실패를 줄이는 맞춤형 패션 커머스 MVP입니다.

문서는 목적별로 나눴습니다. 처음 읽을 때는 아래의 "핵심 문서"만 보면 되고, 화면 구현 단계에서만 상세 화면 문서를 열면 됩니다.

## 핵심 문서

| 문서 | 목적 |
| --- | --- |
| [제품 요구사항](./product/product-requirements.md) | 제품 목표, 사용자, MVP 범위, 성공 지표 |
| [구현 가이드](./architecture/implementation-guide.md) | 앱 구조, 구현 순서, 도메인 로직, seed 데이터 기준 |
| [ERD](./architecture/erd.md) | 데이터 모델과 엔티티 관계 |
| [API 명세](./architecture/api-reference.md) | 고객/셀러 API, 응답 규칙, 상태 코드 |
| [UI 가이드](./design/ui-guidelines.md) | 디자인 원칙, 토큰, 접근성, 화면별 공통 기준 |

## 폴더 구조

```text
docs/
  product/
    product-requirements.md
  architecture/
    api-reference.md
    erd.md
    implementation-guide.md
    payment-flow-design.md
    tech-stack.md
  design/
    ui-guidelines.md
    component-inventory.md
    screen-design-plan.md
    seller-screen-design-plan.md
    customer/
      *-screen-design.md
    seller/
      *-screen-design.md
  integrations/
    mcp-delivery-integration.md
```

## 제품/기획

- [제품 요구사항](./product/product-requirements.md): 문제 정의, MVP 범위, 고객/셀러 핵심 시나리오

## 아키텍처/API

- [구현 가이드](./architecture/implementation-guide.md): 구현 전략, 앱/패키지 구조, 도메인 로직, seed 데이터 기준
- [기술 스택](./architecture/tech-stack.md): Next.js, NestJS, Prisma, PostgreSQL 등 확정 기술
- [ERD](./architecture/erd.md): 테이블, 관계, 인덱스, 결제/배송/리뷰 모델
- [API 명세](./architecture/api-reference.md): API 엔드포인트와 DTO 기준
- [결제 흐름](./architecture/payment-flow-design.md): 토스페이먼츠 승인, 실패, 취소, Payment 엔티티

## 디자인 공통

- [UI 가이드](./design/ui-guidelines.md): 색상, 타이포그래피, 접근성, 상태 화면 기준
- [컴포넌트 인벤토리](./design/component-inventory.md): 공통/고객/셀러 컴포넌트와 구현 우선순위
- [고객 화면 설계 요약](./design/screen-design-plan.md): 고객 핵심 플로우 전체 지도
- [셀러 화면 설계 요약](./design/seller-screen-design-plan.md): 셀러 분석 플로우 전체 지도

## 고객 화면 상세

- [홈](./design/customer/home-screen-design.md): `/`
- [체형 프로필](./design/customer/body-profile-screen-design.md): `/profile/body`
- [상품 목록](./design/customer/product-list-screen-design.md): `/products`
- [상품 상세](./design/customer/product-detail-screen-design.md): `/products/:productId`
- [리뷰 탐색](./design/customer/review-exploration-screen-design.md): `/products/:productId/reviews`
- [매장 재고](./design/customer/store-inventory-screen-design.md): `/products/:productId/stores`
- [장바구니](./design/customer/cart-screen-design.md): `/cart`
- [주문 생성](./design/customer/checkout-screen-design.md): `/checkout`
- [결제 리다이렉트](./design/customer/payment-redirect-screen-design.md): `/payments/toss/success`, `/payments/toss/fail`
- [주문 상세](./design/customer/order-detail-screen-design.md): `/orders/:orderNumber`
- [주문 내역](./design/customer/order-history-screen-design.md): `/me/orders`

## 셀러 화면 상세

- [셀러 대시보드](./design/seller/seller-dashboard-screen-design.md): `/seller`
- [상품 분석](./design/seller/seller-product-analysis-screen-design.md): `/seller/products/:productId`
- [리뷰 분석](./design/seller/seller-review-analysis-screen-design.md): `/seller/reviews`
- [반품 분석](./design/seller/seller-return-analysis-screen-design.md): `/seller/returns`

## MCP/확장

- [MCP 배송 자동화 연동](./integrations/mcp-delivery-integration.md): 배송 지연 감지, 보상 쿠폰, 교환/반품 자동화 시나리오

## 문서 관리 원칙

- 제품 범위 변경은 `product/product-requirements.md`에 먼저 반영합니다.
- DB/API 변경은 `architecture/erd.md`, `architecture/api-reference.md`, `architecture/implementation-guide.md`를 함께 갱신합니다.
- 화면 기준 변경은 `design/ui-guidelines.md`와 해당 `design/customer` 또는 `design/seller` 상세 문서를 함께 갱신합니다.
- 오래된 초안과 중복 문서는 보관하지 않고 삭제합니다. 필요한 결정 사항만 최신 문서에 남깁니다.
