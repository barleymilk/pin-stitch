# 체형 프로필 화면 디자인 `/profile/body`

이 문서는 체형 프로필 등록/수정 화면의 디자인 명세입니다. 체형 정보는 상품 적합도와 리뷰 필터링에 사용되므로 명확한 동의와 validation이 중요합니다.

## 1. 화면 목표

- 사용자가 체형 적합도 계산에 필요한 최소 정보를 부담 없이 입력하게 합니다.
- 체형 정보 활용 목적을 명확히 안내하고 동의를 받습니다.
- 저장 후 상품 목록 또는 이전 화면으로 자연스럽게 이동합니다.

## 2. 주요 데이터

API:

```text
GET /me/body-profile
PUT /me/body-profile
```

Data:

- `heightCm`
- `weightKg`
- `topSize`
- `bottomSize`
- `bodyShape`
- `fitPreference`
- `consentToUseBodyData`

## 3. 레이아웃

Desktop:

```text
Header
PageHeader
Profile form
Privacy notice
Sticky save panel or bottom CTA
```

Mobile:

- 단일 컬럼 폼입니다.
- 저장 CTA는 하단 고정 또는 폼 마지막에 크게 배치합니다.
- 선택지는 버튼 그룹/segmented control로 제공합니다.

## 4. Form fields

Height:

- Label: `키`
- Unit: `cm`
- Required
- 숫자 입력

Weight:

- Label: `몸무게`
- Unit: `kg`
- Optional
- 사용자가 입력하지 않아도 저장 가능

Top/bottom size:

- `XS`, `S`, `M`, `L`, `XL`, `FREE`
- 필수

Body shape:

- `STRAIGHT`, `WAVE`, `NATURAL`, `UNKNOWN`
- 설명은 짧게 제공하되 화면을 교육 페이지처럼 만들지 않습니다.

Fit preference:

- `SLIM`, `REGULAR`, `LOOSE`
- 리뷰 작성 시점에는 스냅샷으로 저장된다는 내부 정책과 맞춥니다.

Consent:

- 체형 정보 활용 동의 체크박스
- 동의하지 않으면 저장 CTA 비활성화

## 5. 상태 디자인

- Loading: 기존 프로필 skeleton
- Empty: 신규 입력 폼
- Saved: `체형 프로필을 저장했어요`
- Validation: 필수값 누락, 범위 오류, 동의 미체크
- Error: 저장 실패, 재시도 CTA

## 6. Interaction

- 저장 성공 후 진입 출처가 있으면 이전 화면으로 돌아갑니다.
- 직접 진입한 경우 `/products`로 이동합니다.
- 체형 정보 변경 후 상품 적합도/추천은 다시 조회합니다.

## 7. Accessibility

- 모든 입력은 label과 error를 연결합니다.
- 단위 `cm`, `kg`는 스크린리더가 읽을 수 있게 텍스트로 제공합니다.
- 선택 버튼은 현재 선택 상태를 전달합니다.

## 8. 체크리스트

- [ ] 신규/수정 상태
- [ ] 필수값 validation
- [ ] 체형 정보 활용 동의
- [ ] 저장 성공/실패
- [ ] 모바일 하단 CTA
