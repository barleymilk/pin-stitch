# 셀러 반품 분석 화면 디자인 `/seller/returns`

이 문서는 셀러 반품 분석 화면의 상세 디자인 명세입니다.

## 1. 화면 목표

- 반품 사유 비율, 상품별 반품률, 체형 그룹별 반복 이슈를 확인합니다.
- 상품 상세/리뷰 분석으로 이어지는 개선 행동을 제공합니다.

## 2. 주요 데이터

API:

```text
GET /seller/returns/analysis
```

Query:

- `productId`

Data:

- `returnReasonStats`
- `bodyShapeIssues`
- `productReturnRates`

## 3. 레이아웃

```text
SellerShell
DashboardHeader
Return rate summary
ReturnReasonChart
BodyShapeIssues
ProductReturnRateTable
```

## 4. 화면 영역

Return reason labels:

- `SIZE_TOO_SMALL`: 사이즈가 작음
- `SIZE_TOO_LARGE`: 사이즈가 큼
- `SHOULDER_FIT`: 어깨가 맞지 않음
- `WAIST_FIT`: 허리가 맞지 않음
- `LENGTH_FIT`: 기장이 맞지 않음
- `COLOR_DIFFERENCE`: 색상이 기대와 다름
- `MATERIAL_EXPECTATION`: 소재가 기대와 다름

Rules:

- 코드는 화면에 직접 노출하지 않습니다.
- 상품별 반품률은 높은 순으로 정렬합니다.
- 반복 이슈는 개선 인사이트와 연결되는 문구로 표시합니다.

## 5. 상태

- Loading
- Empty: 반품 데이터 없음
- Error

## 6. 체크리스트

- [ ] 반품 사유 차트
- [ ] 상품별 반품률 테이블
- [ ] 체형 그룹별 반복 이슈
- [ ] 코드 대신 사용자 친화 문구
- [ ] Empty/Error/Loading
