# pin-stitch Docs Guide

`docs/` 폴더의 문서를 목적별로 빠르게 찾기 위한 안내 문서입니다.

## 문서 구성

- `plan.md`
  - 프로젝트 기획서(비전, 범위, KPI, 로드맵, 정합성 기준)
  - 현재 기준 버전: `v1.1`

- `prd-v1.md`
  - 실제 승인된 PRD 문서(수치/KPI/성능 목표 확정본)
  - 상태: Approved (Scope Freeze 2주)

- `prd-template.md`
  - 신규 기능/프로젝트 PRD 작성을 위한 템플릿
  - 재사용 목적 문서

- `screen-requirements.md`
  - 고객 웹/관리자 웹 화면별 요구사항 명세
  - P0/P1 우선순위 포함

- `api-draft.md`
  - API 초안 및 도메인 타입 스펙
  - 필드명/타입/제약조건 정의 포함

- `backlog-p1.md`
  - 이번 스프린트 제외된 P1 백로그
  - 다음 스프린트 후보 항목 관리 문서

## 권장 읽기 순서

1. `plan.md` (프로젝트 맥락 파악)
2. `prd-v1.md` (확정된 요구사항/목표 확인)
3. `screen-requirements.md` (UI/화면 단위 요구사항 확인)
4. `api-draft.md` (백엔드/API 계약 확인)
5. `prd-template.md` (신규 문서 작성 시 사용)

## 현재 기준값 스냅샷 (v1)

### P0 범위

- 고객 웹: 상품 탐색/검색/필터, 상품 상세(국가별 예상 총액), 장바구니, 체크아웃, 주문 조회
- 관리자 웹: 상품 등록/수정, 가격 정책 관리, 주문/배송 상태 관리, 정산 리포트
- AI Pricing Engine: 국가별 `PriceQuote` 계산(세금/관세/환율/물류비 반영)
- AI Commerce Agent: 상품 검증, 주문 상태 자동 전이, 정산 집계 자동화

### KPI 목표

- Price Competitiveness Index: 95 이상 (주간)
- Checkout Conversion Rate: 1.5% 이상 (주간)
- Order STP Rate: 80% 이상 (주간)
- Settlement Lead Time: T+3일 이내 (월간)
- Pricing Quote Success Rate: 99% 이상 (주간)
- Pricing Quote p95: 700ms 이하 (주간)

### 성능 목표

- `POST /pricing/quote` p95 <= 700ms
- `GET /products` p95 <= 900ms
- `GET /products/:productId` p95 <= 700ms
- `POST /checkout/confirm` p95 <= 1200ms
- 상품 목록/상세 LCP <= 2.8s (모바일 4G)

## 문서 간 정합성 규칙

- KPI/성능 수치는 `prd-v1.md`를 기준으로 관리한다.
- 화면 요구사항 변경 시 `screen-requirements.md`와 `api-draft.md`를 함께 검토한다.
- 범위(P0/P1) 변경 시 `plan.md`와 `prd-v1.md`를 동시에 업데이트한다.
- 스프린트 중 P1 신규 구현은 금지하고 `backlog-p1.md`에만 추가한다.
- 새로운 PRD를 작성할 때는 `prd-template.md`를 복사해 `prd-vX.md` 형태로 생성한다.

## 파일 네이밍 규칙

- 승인본 PRD: `prd-v{major}.md` (예: `prd-v1.md`, `prd-v2.md`)
- 초안/검토용은 브랜치에서만 관리하고, 승인 시 버전 파일로 승격한다.

## 변경 관리 체크리스트

- [ ] 변경한 요구사항이 P0/P1 범위에 반영되었는가
- [ ] KPI/성능 목표 변경 시 `plan.md`와 `prd-v1.md`가 일치하는가
- [ ] 화면 변경이 API 스펙과 충돌하지 않는가
- [ ] 오픈 이슈가 최신 상태로 유지되는가
