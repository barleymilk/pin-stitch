# pin-stitch 셀러 플로우 화면 설계

이 문서는 셀러 웹의 P0 분석 흐름을 디자인하기 위한 화면별 설계 기준입니다. 제품 범위는 `product-requirements.md`, API는 `api-reference.md`, 시각 기준은 `ui-guidelines.md`를 따릅니다.

## 1. 설계 원칙

- 셀러 화면은 감성적인 탐색보다 문제 발견과 다음 행동 결정을 우선합니다.
- 지표, 표, 차트, 인사이트를 빠르게 스캔할 수 있게 정보 밀도를 고객 화면보다 높게 가져갑니다.
- 고객 개인 식별 정보는 노출하지 않고 체형 그룹, 사이즈, 핏 평가, 키워드 같은 비식별 분석 정보만 표시합니다.
- 모든 차트는 핵심 수치를 텍스트로도 제공합니다.
- 인사이트 카드는 단순 설명이 아니라 셀러가 실행할 수 있는 개선 방향을 보여줍니다.
- 반품 사유 코드는 화면에서 사용자 친화 문구로 변환해 표시합니다.

## 2. 셀러 핵심 플로우

```text
/seller
  -> /seller/products/:productId
  -> /seller/reviews
  -> /seller/returns
```

주요 흐름은 대시보드에서 문제 상품을 발견하고, 상품 분석에서 원인을 파악한 뒤, 리뷰/반품 분석으로 근거를 확인하는 방식입니다.

## 3. 공통 컴포넌트

| 컴포넌트 | 사용 화면 | 역할 |
| --- | --- | --- |
| `SellerShell` | 모든 셀러 화면 | 사이드 내비게이션 또는 상단 탭, 화면 컨테이너 |
| `DashboardHeader` | 모든 셀러 화면 | 화면 제목, 기간/상품 필터, 보조 설명 |
| `MetricCard` | 대시보드, 상품 분석 | 핵심 수치와 전월/전주 대비 변화 |
| `ProblemProductTable` | 대시보드 | 이슈가 큰 상품 Top 5 |
| `InsightCard` | 대시보드, 상품 분석 | 개선 제안, 심각도, 근거 요약 |
| `BodyShapeSatisfactionChart` | 상품 분석 | 체형별 평균 평점과 핏 불만 비율 |
| `SizeFitDistributionChart` | 상품 분석 | 사이즈별 `SMALL`, `TRUE_TO_SIZE`, `LARGE` 분포 |
| `KeywordStatList` | 상품 분석, 리뷰 분석 | 긍정/부정 키워드와 빈도 |
| `SellerReviewTable` | 리뷰 분석 | 비식별 리뷰 목록과 필터 결과 |
| `ReturnReasonChart` | 반품 분석 | 반품 사유별 비율 |
| `ProductReturnRateTable` | 반품 분석 | 상품별 반품률 목록 |
| `LoadingState` | 모든 셀러 화면 | 지표/차트/table skeleton |
| `EmptyState` | 모든 셀러 화면 | 데이터 없음과 다음 행동 |
| `ErrorState` | 모든 셀러 화면 | 재시도 CTA와 오류 메시지 |

## 4. 화면별 설계

### 4.1 셀러 대시보드 `/seller`

목적:

- 셀러가 전체 상품 상태와 가장 우선적으로 봐야 할 문제 상품을 빠르게 파악합니다.

주요 API:

- `GET /seller/dashboard`

주요 데이터:

- 전체 상품 수
- 평균 평점
- 핏 불만 비율
- 반품률
- 문제 상품 Top 5
- 최근 인사이트

화면 구성:

- 대시보드 제목과 기간 필터
- 핵심 지표 카드 4개
- 문제 상품 Top 5 테이블
- 최근 인사이트 목록

지표 카드:

- `productCount`
- `averageRating`
- `fitComplaintRate`
- `returnRate`

문제 상품 테이블:

- 상품명
- 이슈 요약
- 심각도
- 상품 분석 진입

상태:

- Loading: 지표 카드 skeleton, 테이블 skeleton
- Empty: 분석 가능한 상품/리뷰 데이터 없음
- Error: 대시보드 조회 실패, 재시도 CTA

주요 CTA:

- 문제 상품 선택: `/seller/products/:productId`
- 리뷰 분석 보기: `/seller/reviews`
- 반품 분석 보기: `/seller/returns`

디자인 메모:

- 지표 카드는 4개 이하로 유지합니다.
- 대시보드 첫 화면은 “어디를 봐야 하는지”가 즉시 보이게 문제 상품과 인사이트를 상단 우선순위로 둡니다.

### 4.2 셀러 상품 분석 `/seller/products/:productId`

목적:

- 특정 상품의 체형별 만족도, 사이즈별 핏 분포, 키워드, 대표 리뷰, 개선 인사이트를 한 화면에서 확인합니다.

주요 API:

- `GET /seller/products/:productId/insights`

주요 데이터:

- `SellerProductInsight`
- `BodyShapeSatisfaction`
- `SizeFitDistribution`
- `FitKeywordStat`
- `SellerInsight`

화면 구성:

- 상품 기본 정보 요약
- 체형별 평균 평점과 핏 불만 비율
- 사이즈별 핏 평가 분포
- 긍정/부정 키워드
- 대표 리뷰
- 개선 인사이트 카드

체형별 만족도:

- 골격 타입
- 평균 평점
- 핏 불만 비율
- 반복 이슈가 있으면 경고 상태 표시

사이즈별 핏 분포:

- 사이즈
- 작음, 정사이즈, 큼 비율
- 특정 사이즈에 불만이 몰리면 강조

인사이트 카드:

- 인사이트 유형
- 심각도
- 개선 메시지
- 근거 요약

상태:

- Loading: 상품 요약, 차트, 키워드 skeleton
- Empty: 분석 가능한 리뷰/반품 데이터 없음
- Error: 상품 분석 조회 실패, 재시도 CTA

주요 CTA:

- 리뷰 근거 보기: `/seller/reviews?productId=:productId`
- 반품 근거 보기: `/seller/returns?productId=:productId`
- 대시보드로 돌아가기

디자인 메모:

- 차트만으로 의미를 전달하지 않고 핵심 수치를 텍스트로 병기합니다.
- 셀러가 바로 볼 수 있게 `HIGH` 심각도 인사이트를 시각적으로 우선합니다.
- 리뷰어 개인 정보는 표시하지 않습니다.

### 4.3 셀러 리뷰 분석 `/seller/reviews`

목적:

- 상품, 체형, 사이즈, 평점, 키워드 기준으로 리뷰를 필터링하고 반복되는 핏 이슈를 확인합니다.

주요 API:

- `GET /seller/reviews`

주요 쿼리:

- `productId`
- `bodyShape`
- `fitPreference`
- `purchasedSize`
- `ratingMax`
- `keyword`
- `page`
- `limit`

화면 구성:

- 필터 바
- 선택된 필터 칩
- 긍정/부정 키워드 요약
- 리뷰 테이블 또는 밀도 높은 리뷰 리스트
- 페이지네이션

리뷰 항목:

- 상품명
- 비식별 체형 그룹
- 구매 사이즈
- 작성 시점 선호 핏
- 핏 평가
- 평점
- 긍정/부정 키워드
- 리뷰 본문 일부
- 작성일

상태:

- Loading: 필터 결과 skeleton
- Empty: 필터 결과 없음, 필터 초기화 CTA
- Error: 리뷰 분석 조회 실패, 재시도 CTA

주요 CTA:

- 필터 적용
- 필터 초기화
- 상품 분석으로 이동

디자인 메모:

- 고객의 `userId`, 이름, 이메일 등 개인 식별 정보는 표시하지 않습니다.
- 낮은 평점 또는 부정 키워드가 많은 리뷰는 과도한 경고색 대신 차분한 강조를 사용합니다.

### 4.4 셀러 반품 분석 `/seller/returns`

목적:

- 반품 사유 비율, 상품별 반품률, 체형 그룹별 반복 이슈를 확인합니다.

주요 API:

- `GET /seller/returns/analysis`

주요 쿼리:

- `productId`

주요 데이터:

- `returnReasonStats`
- `bodyShapeIssues`
- `productReturnRates`

화면 구성:

- 반품률 요약
- 반품 사유별 비율 차트
- 체형 그룹별 반복 이슈 목록
- 상품별 반품률 테이블

반품 사유 표시:

- `SIZE_TOO_SMALL`: 사이즈가 작음
- `SIZE_TOO_LARGE`: 사이즈가 큼
- `SHOULDER_FIT`: 어깨가 맞지 않음
- `WAIST_FIT`: 허리가 맞지 않음
- `LENGTH_FIT`: 기장이 맞지 않음
- `COLOR_DIFFERENCE`: 색상이 기대와 다름
- `MATERIAL_EXPECTATION`: 소재가 기대와 다름

상태:

- Loading: 차트와 테이블 skeleton
- Empty: 반품 데이터 없음
- Error: 반품 분석 조회 실패, 재시도 CTA

주요 CTA:

- 문제 상품 분석 보기
- 리뷰 분석에서 근거 확인

디자인 메모:

- 반품 사유 코드는 화면에 직접 노출하지 않습니다.
- 상품별 반품률은 높은 순으로 기본 정렬합니다.
- 체형 그룹별 반복 이슈는 상품 개선 인사이트와 연결될 수 있게 표현합니다.

## 5. 셀러 디자인 우선순위

1. 셀러 대시보드 `/seller`
2. 셀러 상품 분석 `/seller/products/:productId`
3. 셀러 리뷰 분석 `/seller/reviews`
4. 셀러 반품 분석 `/seller/returns`

## 6. 필수 상태 체크리스트

- [ ] 분석 가능한 리뷰 데이터 없음
- [ ] 반품 데이터 없음
- [ ] 문제 상품 없음
- [ ] 인사이트 없음
- [ ] 필터 결과 없음
- [ ] 대시보드 조회 실패
- [ ] 상품 분석 조회 실패
- [ ] 리뷰 분석 조회 실패
- [ ] 반품 분석 조회 실패
- [ ] 차트 핵심 수치가 텍스트로도 표시됨
- [ ] 고객 개인 식별 정보가 노출되지 않음
- [ ] 모바일/태블릿에서 표가 가로 스크롤 또는 카드형으로 읽힘

## 7. 디자인 산출물 기준

- 각 셀러 화면은 Desktop 시안을 우선 준비합니다.
- Tablet 이하에서는 테이블이 읽히는 형태를 별도로 정의합니다.
- 대시보드와 상품 분석은 Loading, Empty, Error 상태를 함께 준비합니다.
- 차트는 수치 텍스트와 범례를 함께 포함합니다.
- 인사이트 카드는 심각도별 상태를 준비합니다.
- 셀러 화면 전반에서 고객 식별 정보가 보이지 않는지 확인합니다.
