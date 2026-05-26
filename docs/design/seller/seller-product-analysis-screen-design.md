# 셀러 상품 분석 화면 디자인 `/seller/products/:productId`

이 문서는 셀러 상품별 분석 화면의 상세 디자인 명세입니다.

## 1. 화면 목표

- 특정 상품의 체형별 만족도, 사이즈별 핏 분포, 키워드, 개선 인사이트를 한 화면에서 파악합니다.
- 리뷰/반품 근거 화면으로 자연스럽게 이동하게 합니다.

## 2. 주요 데이터

API:

```text
GET /seller/products/:productId/insights
```

Response:

- `SellerProductInsight`
- `BodyShapeSatisfaction[]`
- `SizeFitDistribution[]`
- `FitKeywordStat[]`
- `SellerInsight[]`

## 3. 레이아웃

```text
SellerShell
Product analysis header
Metric/summary row
BodyShapeSatisfactionChart
SizeFitDistributionChart
KeywordStatList
InsightCard list
Evidence CTA row
```

## 4. 화면 영역

- 상품 기본 정보 요약
- 체형별 평균 평점과 핏 불만 비율
- 사이즈별 `SMALL`, `TRUE_TO_SIZE`, `LARGE` 분포
- 긍정/부정 키워드
- 개선 인사이트 카드
- 리뷰 근거 보기: `/seller/reviews?productId=:productId`
- 반품 근거 보기: `/seller/returns?productId=:productId`

## 5. 상태

- Loading: chart/card skeleton
- Empty: 분석 가능한 리뷰/반품 데이터 없음
- Error: 상품 분석 조회 실패

## 6. 체크리스트

- [ ] 체형별 만족도
- [ ] 사이즈별 핏 분포
- [ ] 긍정/부정 키워드
- [ ] 심각도별 인사이트
- [ ] 개인 식별 정보 미노출
