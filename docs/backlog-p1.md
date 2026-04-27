# pin-stitch P1 백로그

본 문서는 `docs/prd-v1.md` 기준 P1 항목을 분리한 백로그다.  
이번 스프린트 개발 범위에는 포함하지 않는다.

## 상태 정의

- `BACKLOG`: 미착수
- `READY`: 다음 스프린트 후보
- `IN_PROGRESS`: 진행 중
- `DONE`: 완료

## P1 백로그 항목

| ID | 영역 | 항목 | 설명 | 상태 |
|---|---|---|---|---|
| BL-P1-001 | Pricing | 가격 정책 시뮬레이션 고도화 | 정책 override/비교 시나리오 강화 | BACKLOG |
| BL-P1-002 | Operations | 운영 예외 태스크 자동 생성 | 실패 주문/통관 이슈를 `WorkflowTask`로 자동 등록 | BACKLOG |
| BL-P1-003 | Customer Web | 가격 산출 근거 UI 강화 | `PriceQuote.explain` 가독성 높은 UI로 노출 | BACKLOG |
| BL-P1-004 | Customer Web | 개인화 추천 | 홈/목록 개인화 추천 섹션 추가 | BACKLOG |
| BL-P1-005 | Admin | 정책 변경 이력/승인 워크플로우 | `PricePolicy` 변경 추적 및 승인 단계 추가 | BACKLOG |

## 우선순위 기준

- 영향도(매출/운영효율)와 구현 난이도를 함께 고려한다.
- 다음 스프린트에는 최대 1~2개 항목만 `READY`로 승격한다.

