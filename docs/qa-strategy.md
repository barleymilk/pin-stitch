# pin-stitch QA / Test Strategy

## 1. 문서 목적

이 문서는 `pin-stitch` MVP 개발 과정에서 품질을 확인하기 위한 테스트, 정적 검사, 브라우저 QA, 성능/접근성 점검, CI/CD 기준을 정의한다.

목표는 테스트를 많이 작성하는 것이 아니라, 고객 구매 판단 흐름과 셀러 인사이트 흐름이 깨지지 않도록 핵심 리스크를 지속적으로 확인하는 것이다.

## 2. QA 원칙

- 도메인 계산 로직은 빠른 단위 테스트로 보호한다.
- 고객/셀러 P0 플로우는 실제 브라우저 기준으로 검증한다.
- 성능, 접근성, 반응형 품질은 개발 후반이 아니라 화면 구현 중 함께 확인한다.
- Mock 데이터는 기능 데모뿐 아니라 테스트 fixture로도 재사용 가능해야 한다.
- 테스트는 구현 세부사항보다 사용자 결과와 도메인 규칙을 검증한다.

## 3. 테스트 레벨

| 레벨 | 도구 | 주요 대상 | 실행 빈도 |
| --- | --- | --- | --- |
| Typecheck | TypeScript | 도메인 타입, API 응답 타입, UI props | PR마다 |
| Lint / Format | ESLint, Prettier | React hooks, 코드 품질, 스타일 일관성 | PR마다 |
| Unit Test | Vitest | `packages/domain`, Zod schema, fetcher 유틸 | PR마다 |
| API Contract Test | Vitest 또는 Route Handler 테스트 | `ApiResponse<T>`, Mock API 응답 형태 | PR마다 |
| E2E Test | Playwright | 고객/셀러 핵심 플로우 | PR smoke, 배포 전 full |
| Accessibility Test | `@axe-core/playwright`, Lighthouse | 폼, 버튼, 이미지, 차트, 색상 대비 | 주요 화면 변경 시 |
| Visual Regression | Playwright screenshot comparison | 상품 카드, 상세, 장바구니, 셀러 대시보드 | 주요 UI 변경 시 |
| Performance Audit | Lighthouse CI 또는 Lighthouse CLI | LCP, 접근성, Best Practices, SEO | main 또는 배포 전 |

## 4. Vitest 기준

Vitest는 빠르게 반복 실행할 수 있는 도메인 테스트에 사용한다.

### 우선 대상

- `calculateFitScore`
- `matchSimilarReviews`
- `generateReviewSummary`
- `generateFitWarnings`
- `applyBestCoupons`
- `calculateCartPricing`
- `generateSellerInsights`
- `bodyProfileSchema`
- `cartItemSchema`
- `shippingAddressSchema`
- `productFilterSchema`
- `reviewFilterSchema`

### P0 테스트 케이스

- 유사 체형 리뷰가 충분할 때 `FitScore.confidence`가 `HIGH`가 된다.
- 유사 체형 리뷰가 없으면 전체 리뷰 기반 fallback을 사용한다.
- 부정 키워드와 핏 평가 비율에 따라 주의사항이 생성된다.
- 만료된 쿠폰, 최소 주문 금액 미달 쿠폰, 대상 불일치 쿠폰은 제외된다.
- 중복 불가 쿠폰은 단독 적용 결과와 중복 가능 조합 결과를 비교한다.
- 할인 금액이 같은 쿠폰 조합은 만료일이 빠른 쿠폰을 우선한다.
- 주문 생성 스냅샷의 상품 금액, 할인 금액, 최종 금액이 장바구니 계산과 일치한다.

## 5. Playwright 기준

Playwright는 실제 브라우저에서 사용자 플로우가 끊기지 않는지 확인하는 데 사용한다.

### 고객 P0 플로우

1. `/profile/body`에서 체형 프로필을 등록한다.
2. `/products`에서 검색, 필터, 정렬을 사용한다.
3. 상품 카드를 선택해 `/products/:productId`로 이동한다.
4. 상품 상세에서 색상/사이즈 옵션을 선택한다.
5. 체형 적합도, 리뷰 요약, 주의사항, 매장 재고 섹션을 확인한다.
6. 장바구니에 상품을 담는다.
7. `/cart`에서 자동 적용 쿠폰과 최종 금액을 확인한다.
8. `/checkout`에서 배송지를 입력하고 주문을 생성한다.
9. `/orders/:orderId`와 `/me/orders`에서 주문 상태를 확인한다.

### 셀러 P0 플로우

1. `/seller`에서 핵심 지표와 문제 상품 목록을 확인한다.
2. 문제 상품을 선택해 `/seller/products/:productId`로 이동한다.
3. 체형별 만족도, 사이즈별 핏 분포, 키워드, 개선 인사이트를 확인한다.
4. `/seller/reviews`에서 리뷰 필터와 키워드 요약을 확인한다.
5. `/seller/returns`에서 반품 사유와 체형별 반복 이슈를 확인한다.

### 화면 상태 테스트

- 검색 결과 없음
- 유사 체형 리뷰 없음
- 적용 가능한 쿠폰 없음
- 빈 장바구니
- 주문 내역 없음
- API 오류 후 재시도
- 모바일 CTA 위치와 데스크톱 2컬럼 레이아웃

## 6. Lighthouse 기준

Lighthouse는 주요 화면의 성능, 접근성, Best Practices, SEO 품질을 점검하는 데 사용한다.

### 대상 화면

- `/`
- `/products`
- `/products/:productId`
- `/cart`
- `/checkout`
- `/seller`
- `/seller/products/:productId`

### 목표 기준

| 항목 | 목표 |
| --- | --- |
| Performance | 80 이상 |
| Accessibility | 90 이상 |
| Best Practices | 90 이상 |
| SEO | 80 이상 |
| 상품 목록/상세 LCP | 2.8s 이하 지향 |

### 운영 기준

- 모바일 기준 측정을 기본으로 한다.
- 개발 서버와 Mock 이미지 때문에 점수는 변동될 수 있으므로 실패 항목의 원인을 함께 확인한다.
- 접근성 실패 항목은 가능한 한 P0로 수정한다.
- 성능 점수보다 LCP, CLS, 이미지 크기, 불필요한 클라이언트 JS 같은 실제 병목을 우선 확인한다.

## 7. 접근성 QA

접근성은 Lighthouse와 `@axe-core/playwright`를 함께 사용한다.

### 확인 항목

- 모든 버튼과 링크에 접근 가능한 이름이 있다.
- 폼 입력에는 표시 라벨과 오류 메시지가 있다.
- 키보드만으로 주요 플로우를 진행할 수 있다.
- 포커스 상태가 시각적으로 명확하다.
- 상품 이미지는 대체 텍스트를 가진다.
- 색상만으로 상태를 구분하지 않는다.
- 차트의 핵심 수치는 텍스트로도 제공한다.

## 8. 시각 회귀 QA

초기에는 Playwright screenshot comparison으로 핵심 화면만 제한적으로 운영한다.

### 우선 대상

- 상품 목록 카드 그리드
- 상품 상세 상단 영역
- 리뷰 요약/핏 주의사항 패널
- 장바구니와 주문 요약
- 셀러 대시보드 지표 카드
- 셀러 상품 분석 차트 영역

### 기준

- 픽셀 차이를 절대적인 실패로만 보지 않고, 레이아웃 깨짐과 텍스트 겹침을 우선 확인한다.
- Mock 데이터 변경으로 스크린샷이 자주 흔들리지 않도록 fixture를 고정한다.

## 9. Mock 데이터와 테스트 데이터

- `packages/mock-data`는 데모 데이터와 테스트 fixture의 공통 기반으로 사용한다.
- 날짜 의존 쿠폰 테스트는 고정 기준일을 사용한다.
- 상품, 리뷰, 쿠폰, 주문 fixture는 테스트 목적이 드러나는 이름을 사용한다.
- 테스트는 특정 샘플 데이터의 우연한 값에 과하게 의존하지 않는다.
- 개인정보 성격의 체형 데이터는 비식별 샘플만 사용한다.

## 10. 권장 명령어

실제 명령어는 패키지 매니저와 앱 구조가 확정된 뒤 `package.json`에 맞춰 조정한다.

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm test:e2e
pnpm test:e2e:smoke
pnpm test:a11y
pnpm test:lighthouse
pnpm build
```

## 11. CI/CD 품질 게이트

### PR마다 실행

1. 의존성 설치
2. TypeScript typecheck
3. ESLint / Prettier check
4. Vitest unit test
5. Mock API contract test
6. Next.js build
7. Playwright smoke test

### main merge 또는 배포 전 실행

1. 전체 Playwright E2E
2. Lighthouse 주요 URL 측정
3. `@axe-core/playwright` 접근성 검사
4. 핵심 화면 visual regression

### 배포 후 확인

1. 홈, 상품 목록, 상품 상세, 장바구니, 셀러 대시보드 health check
2. 주문 생성 Mock 플로우 smoke
3. 주요 페이지 Lighthouse 샘플 측정

## 12. AI 활용 기준

AI는 테스트 초안 생성과 누락 케이스 탐색에 적극적으로 사용한다.

### AI에 맡기기 좋은 작업

- PRD와 화면 요구사항 기준 테스트 케이스 초안 작성
- Vitest 단위 테스트 초안 작성
- Playwright 사용자 플로우 초안 작성
- Lighthouse 실패 항목 원인 후보 정리
- Empty, Loading, Error 상태 누락 목록 작성

### 사람이 검토해야 하는 작업

- 테스트가 실제 제품 리스크를 잡는지 판단
- 쿠폰 최적화, 핏 점수, 리뷰 요약 산식의 비즈니스 타당성 검토
- 깨지기 쉬운 구현 의존 테스트 제거
- Mock 데이터가 현실적인지 검토
- 통과하지만 의미 없는 테스트 제거

## 13. MVP 완료 기준과 연결

MVP는 다음 QA 조건을 만족해야 완료로 본다.

- `packages/domain` 핵심 계산 로직에 P0 단위 테스트가 있다.
- 고객 주문 생성까지의 Playwright smoke test가 통과한다.
- 셀러 대시보드에서 상품 분석으로 이동하는 Playwright smoke test가 통과한다.
- 주요 화면에 Empty, Loading, Error 상태가 정의되어 있다.
- 상품 목록과 상품 상세의 Lighthouse 접근성 점수가 90 이상이다.
- 상품 목록과 상품 상세의 LCP가 2.8s 이하를 지향하도록 병목이 확인되어 있다.
- CI에서 typecheck, lint, unit test, build가 PR마다 실행된다.
