# 리뷰 탐색 화면 디자인 `/products/:productId/reviews`

이 문서는 상품별 리뷰 탐색 화면의 디자인 명세입니다. 고객에게는 비식별 리뷰 DTO인 `ReviewListResponse`만 사용합니다.

## 1. 화면 목표

- 사용자가 자신과 비슷한 체형 조건의 리뷰를 직접 찾게 합니다.
- 키, 골격 타입, 선호 핏, 구매 사이즈, 핏 평가, 키워드 필터를 쉽게 조합하게 합니다.
- 내부 `reviewId`, `userId`, `productId`, `variantId`는 표시하지 않습니다.

## 2. 주요 데이터

API:

```text
GET /products/:productId/reviews
```

Query:

- `heightMin`
- `heightMax`
- `bodyShape`
- `fitPreference`
- `purchasedSize`
- `fitResult`
- `keyword`
- `page`
- `limit`

Response:

- `ReviewListResponse`
- `ReviewListItemResponse`

## 3. 레이아웃

Desktop:

```text
Product review header
Filter panel
Selected chips
Review list
Pagination
```

Mobile:

- 필터는 바텀시트로 제공합니다.
- 선택된 필터 칩은 리뷰 목록 위에 가로 스크롤로 표시합니다.
- 리뷰 카드는 1컬럼입니다.

## 4. 화면 영역 상세

### 4.1 Product review header

- 상품명
- 브랜드명
- 평균 평점
- 리뷰 수
- 상품 상세로 돌아가기

### 4.2 Review filters

- 키 범위
- 골격 타입
- 리뷰 작성 시점 선호 핏
- 구매 사이즈
- 핏 평가
- 키워드 검색

Rules:

- 필터 적용 시 `page=1`로 초기화합니다.
- 현재 사용자 체형 프로필이 있으면 기본 추천 필터를 제안할 수 있습니다.
- 필터 초기화 CTA를 제공합니다.

### 4.3 ReviewCard

Content:

- `reviewerLabel`
- 별점
- 키, 골격 타입, 선호 핏
- 구매 사이즈
- 핏 평가
- 긍정/부정 키워드
- 본문
- 작성일

Rules:

- `reviewId`, `userId`는 표시하지 않습니다.
- 긴 본문은 접기/펼치기를 제공합니다.
- 부정 키워드는 과도한 경고색 대신 차분하게 강조합니다.

## 5. 상태 디자인

- Loading: 리뷰 카드 skeleton
- Empty: `조건에 맞는 리뷰가 없어요`, CTA `필터 초기화`
- Error: `리뷰를 불러오지 못했어요`, CTA `다시 시도`
- No body profile: `체형 프로필을 등록하면 비슷한 리뷰를 더 쉽게 찾을 수 있어요`

## 6. Accessibility

- 필터 바텀시트는 focus trap을 사용합니다.
- 별점은 텍스트로도 제공합니다.
- 필터 수와 적용 상태를 스크린리더가 알 수 있게 합니다.

## 7. 체크리스트

- [ ] 필터 패널/바텀시트
- [ ] 선택 필터 칩
- [ ] 비식별 리뷰 카드
- [ ] Empty/Error/Loading
- [ ] 내부 ID 미노출
