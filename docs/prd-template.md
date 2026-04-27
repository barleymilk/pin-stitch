# pin-stitch PRD Template (v2)

## 1. 문서 정보

- 문서명:
- 문서 버전:
- 작성자:
- 검토자:
- 작성일:
- 최종 수정일:
- 상태: Draft / In Review / Approved / Archived
- 참조 문서: `docs/plan.md`, `docs/screen-requirements.md`, `docs/api-draft.md`, `docs/prd-v1.md`

## 2. 문제 정의 및 배경

### 2.1 문제 정의

- 어떤 사용자(고객/파트너/운영자)의 어떤 문제를 해결하는가?
- 현재 프로세스의 병목(가격 계산, 주문 처리, 정산 처리)은 무엇인가?

### 2.2 비즈니스 배경

- 본 기능이 매출/마진/운영비에 미치는 영향은 무엇인가?
- 핵심 KPI와 측정 주기는 무엇인가?

## 3. 목표 / 비목표

### 3.1 목표 (Objectives)

- [ ] 글로벌 최종 결제금액의 예측 가능성 향상
- [ ] 주문-배송-정산 자동 처리율(STP) 개선
- [ ] 운영 수작업 및 오류율 감소

### 3.2 비목표 (Non-Objectives)

- 이번 릴리스에서 제외되는 기능 명시
- 향후 단계로 이관되는 기능 명시

## 4. 사용자 및 시나리오

### 4.1 사용자 유형

- 고객(Customer)
- 브랜드 파트너(Brand Partner)
- 운영자(Admin Operator)

### 4.2 핵심 시나리오

- UC-001:
- UC-002:
- UC-003:

## 5. 범위 정의

### 5.1 포함 범위 (In Scope)

#### P0 (필수)

-

#### P1 (중요)

-

### 5.2 제외 범위 (Out of Scope)

-

## 6. 기능 요구사항

| ID     | Priority | 요구사항 | 수용 기준 |
| ------ | -------- | -------- | --------- |
| FR-001 | P0       |          |           |
| FR-002 | P0       |          |           |
| FR-003 | P1       |          |           |

## 7. 비기능 요구사항

### 7.1 성능

- 핵심 API p95 응답시간:
  - `POST /pricing/quote`:
  - `GET /products`:
  - `GET /products/:productId`:
  - `POST /checkout/confirm`:
- 프론트 성능:
  - 상품 목록/상세 LCP:

### 7.2 안정성

- 월간 가용성:
- 핵심 비동기 처리 재시도 정책:
- 가격 견적 API 성공률:

### 7.3 보안/컴플라이언스

- 인증/인가(Role 기반 접근 제어)
- 개인정보 및 결제 관련 민감정보 보호
- 감사 로그(`AuditLog`) 보관

### 7.4 관측성

- API/워크플로우 로그 표준화
- KPI 메트릭 대시보드 및 경보 기준 정의
- `requestId` 기반 추적 가능성 확보

## 8. UX 및 디자인 요구사항

- 디자인 시스템 컴포넌트(`packages/ui`) 우선 사용
- 반응형 기준: Mobile / Tablet / Desktop
- 접근성 기준: 키보드 내비게이션, 포커스 가시성, 텍스트 대비

## 9. 데이터/도메인 요구사항

### 9.1 표준 엔티티 (plan.md 기준)

- Catalog: `Product`, `Variant`, `Inventory`
- Partner: `BrandPartner`, `Supplier`
- Pricing: `PricePolicy`, `TaxRule`, `DutyRule`, `FxRate`, `ShippingRate`, `TradeAgreementRule`, `PriceQuote`
- Commerce: `Cart`, `Order`, `OrderLine`, `Payment`, `Shipment`
- Settlement: `Settlement`, `Payout`, `Invoice`
- Ops: `WorkflowTask`, `AuditLog`

### 9.2 데이터 생명주기

- 생성/수정/삭제 권한
- 보관 기간 및 아카이빙 정책
- 정산 데이터 재계산 정책

## 10. API 및 외부 연동 요구사항

- 내부 API: `docs/api-draft.md`를 단일 소스로 참조
- 외부 연동: 결제/물류/환율 제공자
- 실패 처리: 타임아웃, 재시도, 멱등성 키(idempotency key)

## 11. AI 요구사항

### 11.1 AI Pricing Engine

- 입력 스키마와 계산 순서 고정
- 정책 충돌 시 우선순위 명시
- 결과 설명(`explain`) 필수

### 11.2 AI Commerce Agent

- 자동화 범위와 수동 승인 조건 분리
- 예외 주문 자동 태스크 생성 기준 정의
- 정산 초안 생성 로직 검증 가능해야 함

## 12. 성공 지표

| Metric                      | Baseline | Target | Window |
| --------------------------- | -------- | ------ | ------ |
| Price Competitiveness Index |          |        |        |
| Checkout Conversion Rate    |          |        |        |
| Order STP Rate              |          |        |        |
| Settlement Lead Time        |          |        |        |
| Pricing Quote Success Rate  |          |        |        |
| Pricing Quote p95           |          |        |        |

## 13. 리스크 및 대응

| Risk | 영향도 | 가능성 | 대응 |
| ---- | ------ | ------ | ---- |
|      |        |        |      |
|      |        |        |      |
|      |        |        |      |

## 14. 릴리스 계획

- 개발 -> QA -> 파일럿 -> 전체 배포
- 롤백 기준과 장애 대응 플랜 명시
- 단계별 승인 책임자 지정

## 15. 오픈 이슈

- Q1:
- Q2:
- Q3:

## 16. 용어 사전 (표준)

| 한글 용어   | 표준 영문      | 설명                                    |
| ----------- | -------------- | --------------------------------------- |
| 가격 견적   | `PriceQuote`   | 국가/통화/정책 기준 최종 가격 계산 결과 |
| 가격 정책   | `PricePolicy`  | 마진 하한, 할인 상한 등 가격 룰         |
| 정산        | `Settlement`   | 파트너 지급 금액 확정 프로세스          |
| 운영 태스크 | `WorkflowTask` | 예외 주문/수동 검토 작업 단위           |

## 17. 변경 이력

- v2.1.0: 승인본 분리 후 템플릿 재구성 (`docs/prd-v1.md` 분리)
