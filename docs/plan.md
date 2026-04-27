# pin-stitch 프로젝트 기획서 (v1.1)

## 1. 프로젝트 정의

`pin-stitch`는 전 세계 디자이너 브랜드 파트너 네트워크를 연결해 고객에게 국가별 최적 가격과 효율적인 구매 경험을 제공하는 글로벌 패션 커머스 플랫폼이다.  
핵심은 국가별 세금, 관세, 환율, 물류비, 무역 협정까지 반영하는 `AI Pricing Engine`과 상품 등록부터 가격 설정, 주문, 정산까지 자동화하는 `AI Commerce Agent`다.

## 2. 목표 및 KPI

### 목표

- 고객: 예측 가능한 최종 결제 금액과 빠른 구매 경험
- 브랜드/셀러: 글로벌 판매 운영의 복잡도 최소화
- 운영팀: 수작업 최소화, 오류율 감소, 정산 자동화

### 핵심 KPI

- 가격 경쟁력 지수(PCI): 95 이상 (주간)
- 결제 전환율(Checkout Conversion Rate): 1.5% 이상 (주간)
- 주문 자동 처리율(Order STP Rate): 80% 이상 (주간)
- 정산 리드타임(Settlement Lead Time): T+3일 이내 (월간)
- 가격 견적 API 성공률(Pricing Quote Success Rate): 99% 이상 (주간)
- 가격 견적 API p95: 700ms 이하 (주간)

## 3. MVP 범위

### 우선순위 기준

- `P0`: 런칭 필수(없으면 구매/운영 불가)
- `P1`: 런칭 후 초기 고도화

### 이번 스프린트 범위 확정

- 개발 범위는 `P0 only`
- `P1`은 `docs/backlog-p1.md`에서 백로그로 관리

### 고객 웹

- P0: 상품 탐색/검색/필터
- P0: 상품 상세(국가별 예상 총액 표시)
- P0: 장바구니/체크아웃/주문 조회
- P1: 가격 산출 근거(Explainability) 노출 강화
- P1: 개인화 추천

### 관리자 웹

- P0: 상품 등록/수정
- P0: 가격 정책 관리
- P0: 주문/배송 상태 관리
- P0: 기본 정산 리포트
- P1: 정책 변경 이력 및 승인 워크플로우

### AI Pricing Engine (MVP)

- P0: 국가별 세금/관세/환율/배송비 계산
- P0: 가격 정책 룰 적용(마진 하한, 할인 상한)
- P0: 최종 소비자 가격 및 결제 예상 총액 산출(`PriceQuote`)
- P1: 가격 산출 근거 상세화 및 정책 시뮬레이션 고도화

### AI Commerce Agent (MVP)

- P0: 상품 등록 자동 검증
- P0: 주문 상태 자동 전이
- P0: 정산 집계 자동화
- P1: 예외 주문 자동 태스크(`WorkflowTask`) 생성

## 4. 기술 스택 및 구조

- `React.js`, `Next.js`, `TypeScript`
- `Tailwind CSS`
- `Redux Toolkit` (전역 상태)
- 서버 상태 관리: `RTK Query` 권장
- 모노레포 권장 구조
  - `apps/web` (고객 웹)
  - `apps/admin` (관리자 웹)
  - `packages/ui` (디자인 시스템)
  - `packages/domain` (도메인 로직/타입)
  - `packages/config` (공통 설정)

## 5. 도메인 설계 (핵심 엔티티)

- 상품: `Product`, `Variant`, `Inventory`
- 파트너: `BrandPartner`, `Supplier`
- 가격/정책: `PricePolicy`, `TaxRule`, `DutyRule`, `FxRate`, `ShippingRate`, `TradeAgreementRule`, `PriceQuote`
- 주문: `Cart`, `Order`, `OrderLine`, `Payment`, `Shipment`
- 정산: `Settlement`, `Payout`, `Invoice`
- 운영: `AuditLog`, `WorkflowTask`

## 6. AI Pricing Engine 설계

### 입력

- 공급가/원가
- 판매 국가
- 카테고리(HS 코드)
- 원산지
- 통화
- 물류 옵션
- 프로모션/가격 정책

### 계산 파이프라인

1. 환율 기반 기준가 계산
2. 세금/관세 적용
3. 무역 협정(FTA) 적용 가능 여부 판정
4. 물류비/수수료 반영
5. 마진 가드레일 적용
6. 최종가 산출

### 출력

- 국가별 표시 가격
- 체크아웃 예상 총 결제 금액
- 마진율
- 가격 산출 근거(Explainability)

## 7. AI Commerce Agent 설계

- 상품 등록 자동화: 필수 데이터 검증, 누락값 감지
- 주문 오케스트레이션: 결제 → 출고요청 → 배송추적 자동 연결
- 예외 처리: 재고 부족/결제 실패/통관 이슈 자동 태스크 생성
- 정산 자동화: 주문/환불/수수료 집계 후 파트너 정산 초안 생성

## 8. 정보 구조 (IA)

### 고객 웹

- 홈
- 카테고리
- 검색 결과
- 상품 상세
- 장바구니
- 결제
- 마이페이지

### 관리자 웹

- 대시보드
- 상품관리
- 가격정책
- 주문관리
- 정산관리
- 파트너관리
- 운영로그

## 9. 개발 로드맵 (12주 예시)

- 1~2주: 요구사항 확정, 도메인/API/DB 설계, 디자인 토큰 정의
- 3~5주: 고객 웹 MVP + 관리자 기본 기능
- 6~8주: Pricing Engine MVP + 가격 시뮬레이터
- 9~10주: Commerce Agent MVP + 주문/정산 자동화
- 11주: 통합 테스트, 성능/보안 보강
- 12주: 파일럿 런칭, KPI 계측 시작

## 10. 성능 목표 (PRD v1 정합)

- API p95
  - `POST /pricing/quote`: 700ms 이하
  - `GET /products`: 900ms 이하
  - `GET /products/:productId`: 700ms 이하
  - `POST /checkout/confirm`: 1200ms 이하
- 프론트 성능
  - 상품 목록/상세 LCP 2.8s 이하(모바일 4G)
- 안정성
  - 월간 가용성 99.9% 이상
  - 가격 견적 API 성공률 99.0% 이상

## 11. 즉시 실행 항목

1. PRD v1 확정 (MVP 범위 동결)
2. 우선 국가 2~3개 가격 규칙표 정의
3. 모노레포 및 공통 개발 환경 초기화
4. 디자인 시스템 토큰 + 핵심 컴포넌트 우선 구축
5. Pricing Engine API 스펙 확정 후 UI 연동 시작

## 12. 오픈 이슈 (v1)

- Q1: 초기 운영 국가를 `KR + US`로 고정할지 여부
- Q2: 환율 데이터 제공자 선정 및 갱신 주기(일 1회) 확정
- Q3: 결제 제공자를 1개부터 시작할지 여부

## 13. 문서 정합성

- 본 문서는 `docs/prd-v1.md`의 PRD v1 승인본과 동일한 수치/KPI 기준을 따른다.
- 화면 요구사항은 `docs/screen-requirements.md`, API 상세는 `docs/api-draft.md`를 단일 소스로 참조한다.
