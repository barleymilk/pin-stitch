# pin-stitch

기본 모노레포 프로젝트 구성입니다.

## 구조

- `apps/web`: 고객 웹 (Next.js)
- `apps/admin`: 관리자 웹 (Next.js)
- `packages/ui`: 공통 UI 컴포넌트
- `packages/domain`: 도메인 타입/상수
- `packages/config`: 공통 설정 상수
- `docs`: 기획/요구사항 문서

## 실행

```bash
npm install
npm run dev:web
```

관리자 앱 실행:

```bash
npm run dev:admin
```
