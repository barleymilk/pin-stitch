# 셀러 리뷰 분석 화면 디자인 `/seller/reviews`

이 문서는 셀러 리뷰 분석 화면의 상세 디자인 명세입니다.

## 1. 화면 목표

- 상품, 체형, 사이즈, 평점, 키워드 기준으로 리뷰를 필터링합니다.
- 반복되는 핏 이슈와 상품 개선 근거를 확인합니다.

## 2. 주요 데이터

API:

```text
GET /seller/reviews
```

Query:

- `productId`
- `bodyShape`
- `fitPreference`
- `purchasedSize`
- `ratingMax`
- `keyword`
- `page`
- `limit`

## 3. 레이아웃

```text
SellerShell
DashboardHeader
FilterBar
SelectedFilterChips
KeywordSummary
SellerReviewTable
Pagination
```

## 4. 리뷰 테이블

Columns:

- 상품명
- 체형 그룹
- 구매 사이즈
- 작성 시점 선호 핏
- 핏 평가
- 평점
- 키워드
- 본문 일부
- 작성일

Rules:

- `userId`, 이름, 이메일은 표시하지 않습니다.
- 낮은 평점/부정 키워드는 차분하게 강조합니다.

## 5. 상태

- Loading
- Empty: 필터 결과 없음
- Error

## 6. 체크리스트

- [ ] 필터 바
- [ ] 키워드 요약
- [ ] 리뷰 테이블
- [ ] 필터 결과 없음
- [ ] 개인 식별 정보 미노출
