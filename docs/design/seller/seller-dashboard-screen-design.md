# 셀러 대시보드 화면 디자인 `/seller`

이 문서는 셀러 대시보드 상세 디자인 명세입니다.

## 1. 화면 목표

- 셀러가 전체 상품 상태와 우선 대응해야 할 문제 상품을 빠르게 파악합니다.
- 지표, 문제 상품, 최근 인사이트를 한 화면에서 스캔하게 합니다.

## 2. 주요 데이터

API:

```text
GET /seller/dashboard
```

Data:

- `productCount`
- `averageRating`
- `fitComplaintRate`
- `returnRate`
- `problemProducts`
- `recentInsights`

## 3. 레이아웃

```text
SellerShell
DashboardHeader
MetricCard x 4
ProblemProductTable
Recent InsightCard list
```

Desktop 우선이며, tablet 이하에서는 테이블을 가로 스크롤 또는 카드 목록으로 변환합니다.

## 4. 화면 영역

- 기간 필터: 최근 7일, 30일, 90일
- MetricCard: 수치, 변화율, 짧은 설명
- 문제 상품 Top 5: 상품명, 이슈, 심각도, 상품 분석 CTA
- 최근 인사이트: 심각도, 메시지, 근거, 상세 이동

## 5. 상태

- Loading: metric/table/card skeleton
- Empty: `분석할 데이터가 아직 없어요`
- Error: `대시보드를 불러오지 못했어요`

## 6. 체크리스트

- [ ] 지표 4개
- [ ] 문제 상품 Top 5
- [ ] 최근 인사이트
- [ ] 차트/표 핵심 수치 텍스트 병기
- [ ] 고객 식별 정보 미노출
