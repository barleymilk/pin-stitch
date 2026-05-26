# 매장 재고 화면 디자인 `/products/:productId/stores`

이 문서는 상품 옵션별 오프라인 매장 재고 화면의 디자인 명세입니다.

## 1. 화면 목표

- 사용자가 선택한 상품 옵션을 입어볼 수 있는 매장과 재고 상태를 확인하게 합니다.
- 위치 권한이 없어도 기본 지역 기준으로 재고 목록을 볼 수 있게 합니다.
- 정확한 좌표나 내부 재고 ID는 표시하지 않습니다.

## 2. 주요 데이터

API:

```text
GET /products/:productId/store-inventory
```

Query:

- `variantId`
- `lat`
- `lng`

Response:

- 매장명
- 거리
- 영업 상태
- 재고 상태
- 층/존/랙 위치

## 3. 레이아웃

Desktop:

```text
Product option summary
Location basis
Store inventory list
Online purchase CTA
```

Mobile:

- 상품/옵션 요약을 상단에 고정하지 않고 compact하게 표시합니다.
- 매장 목록은 카드형 1컬럼입니다.
- 온라인 장바구니 CTA를 하단에 배치합니다.

## 4. 화면 영역 상세

### 4.1 Product option summary

- 상품명
- 선택 색상/사이즈
- 옵션 변경 링크: 상품 상세로 돌아가기

### 4.2 Location basis

States:

- 위치 권한 허용: `현재 위치 기준`
- 위치 권한 없음: `기본 지역 기준`
- 직접 지역 선택: P1

### 4.3 StoreInventoryList

Content:

- 매장명
- 거리
- 영업 상태
- 재고 상태: `재고 있음`, `소량 남음`, `품절`
- 층/존/랙 위치

Rules:

- `lat`, `lng`는 화면에 직접 표시하지 않습니다.
- 정확한 수량은 정책에 따라 숨기고 상태로 가공할 수 있습니다.
- 품절 매장은 목록 하단으로 보냅니다.

## 5. 상태 디자인

- Loading: 매장 카드 skeleton
- Empty: `가까운 매장 재고가 없어요`, CTA `온라인으로 장바구니 담기`
- Error: `매장 재고를 불러오지 못했어요`
- No location permission: 기본 지역 기준 안내
- No variant selected: 상품 상세에서 옵션 선택 안내

## 6. Accessibility

- 매장 영업/재고 상태는 텍스트로 표시합니다.
- 거리 단위는 `km` 텍스트를 포함합니다.
- 위치 권한 안내는 강요하지 않는 문구로 제공합니다.

## 7. 체크리스트

- [ ] 옵션 요약
- [ ] 위치 기준 상태
- [ ] 매장 재고 카드
- [ ] 재고 없음/권한 없음/에러
- [ ] 좌표 미노출
