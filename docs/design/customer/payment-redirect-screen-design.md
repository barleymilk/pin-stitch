# 토스 결제 리다이렉트 화면 디자인 `/payments/toss/success`, `/payments/toss/fail`

이 문서는 토스페이먼츠 결제창에서 돌아온 직후의 성공/실패 처리 화면 명세입니다.

## 1. 화면 목표

- 결제 성공 리다이렉트에서 서버 승인 API를 호출하고 결과에 따라 주문 상세로 이동합니다.
- 결제 실패 또는 사용자가 결제창을 닫은 경우 복구 행동을 제공합니다.
- 토스에서 전달된 `paymentKey`, `orderId`, `amount`는 화면에 직접 노출하지 않습니다.

## 2. 주요 데이터

Success URL query:

- `paymentKey`
- `orderId`
- `amount`

API:

```text
POST /payments/toss/confirm
```

Fail URL query:

- `code`
- `message`
- `orderId`

## 3. Success 화면

Flow:

```text
success page mount
  -> validate required query params
  -> POST /payments/toss/confirm
  -> success: /orders/:orderNumber
  -> failure: inline error with retry
```

Display:

- `결제를 확인하고 있어요`
- loading indicator
- 중복 클릭 방지를 위해 별도 CTA는 숨김 또는 disabled

Error:

- `결제 승인을 완료하지 못했어요`
- CTA: `다시 확인`
- CTA: `주문 내역 보기`

## 4. Fail 화면

Display:

- `결제를 완료하지 못했어요`
- 실패 메시지
- CTA: `다시 결제하기`
- CTA: `장바구니로 돌아가기`

Rules:

- 토스 원본 `code`는 개발/운영 로그에 남기고 사용자에게는 친화 문구로 변환합니다.
- `orderId`는 우리 `orderNumber`와 매칭하지만 화면에 과도하게 강조하지 않습니다.

## 5. 상태 디자인

- Missing query: `결제 정보를 확인할 수 없어요`
- Confirm loading
- Confirm success
- Confirm failed
- Network error
- Already paid: 주문 상세로 이동

## 6. Accessibility

- 결제 확인 중 상태는 live region으로 안내합니다.
- 자동 이동이 발생하면 화면 텍스트로도 안내합니다.
- 실패 메시지는 버튼 위에 배치합니다.

## 7. 체크리스트

- [ ] success query validation
- [ ] confirm API loading/success/error
- [ ] fail page
- [ ] 중복 승인 방지 UX
- [ ] 민감 파라미터 미노출
