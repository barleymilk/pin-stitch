# pin-stitch 문서 안내

`pin-stitch`는 사용자의 체형 정보와 실제 구매 리뷰를 연결해 패션 상품 구매 실패를 줄이는 맞춤형 패션 커머스 MVP입니다. 고객은 나와 비슷한 체형의 리뷰, 체형 적합도, 사이즈/핏 주의사항을 보고 상품을 고르고, 셀러는 리뷰와 반품 데이터를 상품 개선 인사이트로 확인합니다.

## 문서 구성

| 문서 | 목적 |
| --- | --- |
| [product-requirements.md](./product-requirements.md) | 제품 목표, 사용자, MVP 범위, 성공 지표 |
| [implementation-guide.md](./implementation-guide.md) | 기술 스택, 앱/패키지 구조, 구현 순서, 도메인 로직 기준 |
| [tech-stack.md](./tech-stack.md) | 프로젝트에서 사용할 기술 스택과 인프라 구성 |
| [erd.md](./erd.md) | MVP 데이터 모델과 엔티티 관계 |
| [api-reference.md](./api-reference.md) | NestJS API 엔드포인트, 응답 규칙, 상태 코드 |
| [ui-guidelines.md](./ui-guidelines.md) | 화면별 요구사항, 디자인 토큰, UI/접근성 기준 |
| [screen-design-plan.md](./screen-design-plan.md) | 고객 핵심 플로우 화면 설계, 컴포넌트, 상태, CTA |
| [seller-screen-design-plan.md](./seller-screen-design-plan.md) | 셀러 분석 플로우 화면 설계, 지표, 차트, 인사이트 |
| [component-inventory.md](./component-inventory.md) | 고객/셀러 공통 컴포넌트 목록, 우선순위, 구현 순서 |
| [home-screen-design.md](./home-screen-design.md) | 홈 화면 `/` 상세 디자인 명세 |
| [product-list-screen-design.md](./product-list-screen-design.md) | 상품 목록 화면 `/products` 상세 디자인 명세 |
| [product-detail-screen-design.md](./product-detail-screen-design.md) | 상품 상세 화면 `/products/:productId` 상세 디자인 명세 |
| [archive-2026-05-19](./archive-2026-05-19/) | 정리 전 원본 문서 보관본 |

## 권장 읽기 순서

1. 제품 방향과 범위를 확인하려면 `product-requirements.md`
2. 바로 구현을 시작하려면 `implementation-guide.md`
3. 화면과 API를 연결할 때 `api-reference.md`
4. 고객 핵심 플로우를 디자인할 때 `screen-design-plan.md`
5. 셀러 분석 화면을 디자인할 때 `seller-screen-design-plan.md`
6. 컴포넌트 단위를 정리할 때 `component-inventory.md`
7. 홈 화면을 상세 설계할 때 `home-screen-design.md`
8. 상품 목록 화면을 상세 설계할 때 `product-list-screen-design.md`
9. 상품 상세 화면을 상세 설계할 때 `product-detail-screen-design.md`
10. UI를 만들거나 검수할 때 `ui-guidelines.md`

## MVP P0 범위

### 고객 웹

- 체형 프로필 등록/수정
- 상품 목록, 검색, 필터, 정렬
- 상품 상세
- 체형별 리뷰 필터링
- 체형 기반 리뷰 요약
- 체형 적합도 점수
- 사이즈/핏 주의사항
- 샘플 매장 재고 안내
- 장바구니
- 쿠폰 자동 최적 적용
- 주문 생성, 주문 완료, 주문 내역

### 셀러 웹

- 셀러 대시보드
- 상품별 체형 만족도 분석
- 사이즈별 핏 평가 분포
- 긍정/부정 리뷰 키워드 분석
- 반품 사유 분석
- 상품 개선 인사이트

## 현재 코드 상태

현재 저장소에는 `packages/domain` 패키지와 공통 타입 파일이 있습니다.

- `packages/domain/src/types.ts`: 사용자, 체형, 상품, 리뷰, 재고, 쿠폰, 장바구니, 주문, 반품, 셀러 인사이트, API 응답 타입
- `packages/domain/src/index.ts`: 도메인 타입 export

다음 구현의 첫 작업은 `packages/domain` 계산 로직, Prisma schema, seed 데이터를 추가하는 것입니다.

## 문서 관리 원칙

- 제품 범위 변경은 `product-requirements.md`에 먼저 반영합니다.
- 타입, 계산 로직, 라우팅, API 구현 방식 변경은 `implementation-guide.md`와 `api-reference.md`를 함께 갱신합니다.
- 화면 구성, 디자인 토큰, 접근성 기준 변경은 `ui-guidelines.md`에 반영합니다.
- 이전 문서는 삭제하지 않고 날짜가 포함된 archive 폴더에 보관합니다.
