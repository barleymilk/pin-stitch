# pin-stitch 기술 스택

## 1. 기술 스택 개요

`pin-stitch`는 체형 프로필, 상품, 옵션, 리뷰, 장바구니, 주문, 쿠폰, 셀러 분석처럼 관계형 데이터와 서버 도메인이 뚜렷한 서비스입니다.

이 프로젝트는 다음 기술 스택을 사용합니다.

```text
Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- TanStack Query
- Zustand
- React Hook Form
- Zod

Backend
- NestJS
- TypeScript
- Prisma

Database
- PostgreSQL

Storage
- AWS S3
- CloudFront, 운영 단계에서 도입

Realtime / Future
- NestJS WebSocket Gateway, 라이브 커머스 채팅에서 사용
- Redis, 실시간 fan-out과 pub/sub이 필요해지는 시점에 도입
- MongoDB or OpenSearch, 채팅/이벤트 로그 저장과 검색이 필요해지는 시점에 도입
- AWS IVS or Mux, 라이브 영상 송출 기능에서 도입

Package Manager / Monorepo
- pnpm workspace
- Turborepo, 빌드/작업 orchestration이 필요해지는 시점에 도입

Local Dev
- Docker Compose
- PostgreSQL Docker container

Deploy
- Vercel: Next.js
- Render, Railway, Fly.io, or AWS: NestJS
- Supabase Postgres, Neon, or AWS RDS: PostgreSQL
- AWS S3: image storage
```

## 2. 전체 구조

```text
apps/
  web/        Next.js 고객/셀러 웹
  api/        NestJS API 서버

packages/
  domain/     공통 타입, 계산 로직
  ui/         공통 UI 컴포넌트
  config/     공통 설정
```

요청 흐름:

```text
Browser
  -> Next.js
    -> NestJS API
      -> Prisma
        -> PostgreSQL

Browser
  -> NestJS presigned URL 요청
    -> AWS S3 직접 업로드
```

## 3. Frontend

### Next.js

화면, 라우팅, 서버 컴포넌트, SEO, 배포 편의성을 위해 사용합니다.

사용 범위:

- 고객 웹
- 셀러 웹
- 상품 목록/상세
- 장바구니/주문 화면
- 셀러 대시보드

MVP에서는 고객 화면과 셀러 화면을 하나의 `apps/web`에서 구현하고, 셀러 화면은 `/seller` 하위 라우트에 둡니다.

### TanStack Query

서버 데이터를 조회하고 캐싱하기 위해 사용합니다.

사용 대상:

- 상품 목록/상세
- 리뷰 목록
- 체형 적합도
- 리뷰 요약
- 장바구니
- 주문 내역
- 셀러 분석 데이터

### Zustand

서버 데이터가 아닌 가벼운 클라이언트 상태에만 사용합니다.

사용 대상:

- 현재 선택한 샘플 사용자
- 상품 목록 필터 UI 상태
- 상품 상세 선택 옵션
- 모바일 필터 패널 열림/닫힘
- 셀러 대시보드 기간 필터

### React Hook Form + Zod

폼 상태와 검증을 분리하기 위해 사용합니다.

사용 대상:

- 체형 프로필 폼
- 배송지 입력 폼
- 상품 필터
- 리뷰 필터
- 장바구니 수량 변경 검증

## 4. Backend

### NestJS

NestJS는 Spring Boot와 비슷한 구조를 가진 TypeScript 백엔드 프레임워크입니다. Controller, Service, Module 단위로 코드를 나누며, API 규모가 커져도 기능 경계를 명확하게 유지할 수 있습니다.

사용 범위:

- 상품 API
- 리뷰 API
- 체형 적합도 API
- 장바구니/주문 API
- 쿠폰 자동 적용
- 셀러 분석 API
- S3 업로드 presigned URL 발급
- 라이브 커머스 확장 시 WebSocket Gateway 기반 실시간 채팅

예상 구조:

```text
apps/api/src/
  products/
  reviews/
  body-profiles/
  cart/
  orders/
  seller/
  uploads/
  live-commerce/
  prisma/
```

### Prisma

PostgreSQL을 TypeScript에서 타입 안전하게 다루기 위해 사용합니다.

사용 이유:

- DB 모델을 `schema.prisma`로 명확히 관리할 수 있습니다.
- 쿼리 결과 타입이 자동 추론됩니다.
- 마이그레이션을 관리할 수 있습니다.
- NestJS 서비스 계층에서 Prisma Client를 주입해 DB 접근을 처리합니다.

## 5. Database

### PostgreSQL

기본 DB는 PostgreSQL을 사용합니다.

이유:

- 상품, 옵션, 리뷰, 주문, 쿠폰은 관계형 모델에 잘 맞습니다.
- Prisma와 조합해 타입 안전한 DB 접근을 구성할 수 있습니다.
- 실제 기업 서비스에서도 널리 사용됩니다.
- Supabase, Neon, AWS RDS 등 선택지가 많습니다.

선택 기준:

| 상황 | 사용 DB |
| --- | --- |
| 학습/MVP | Supabase Postgres 또는 Neon |
| 초기 서비스 | Supabase Postgres 또는 Neon |
| 기업/장기 운영 | AWS RDS PostgreSQL |
| 로컬 개발 | Docker PostgreSQL |

## 6. Image Storage

### AWS S3

상품 이미지와 리뷰 이미지는 DB에 직접 저장하지 않고 S3에 저장합니다. DB에는 S3 key, URL, 메타데이터만 저장합니다.

저장 대상:

- 상품 이미지
- 리뷰 이미지
- 프로필 이미지, 기능 추가 시

key 구조:

```text
products/{productId}/{imageId}.webp
reviews/{reviewId}/{imageId}.webp
users/{userId}/profile.webp
```

업로드 방식:

```text
1. 브라우저가 NestJS에 업로드 URL 요청
2. NestJS가 S3 presigned URL 생성
3. 브라우저가 S3에 직접 업로드
4. 브라우저가 NestJS에 이미지 메타데이터 저장 요청
```

초기에는 S3 public read로 단순하게 시작하고, 운영 단계에서는 S3를 private으로 두고 CloudFront를 붙입니다.

## 7. Package Manager

### pnpm

모노레포 구조에는 pnpm을 사용합니다.

이유:

- workspace 관리를 안정적으로 구성할 수 있습니다.
- 디스크 사용량이 적습니다.
- 의존성 구조가 엄격해서 누락된 의존성을 빨리 발견할 수 있습니다.
- Next.js, NestJS, 공통 패키지 구조와 잘 맞습니다.

루트 설정 예시:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

주요 명령어:

```bash
pnpm install
pnpm --filter web dev
pnpm --filter api start:dev
pnpm --filter @pin-stitch/domain build
pnpm -r lint
```

## 8. Local Dev

초기 개발에서는 프론트와 백엔드는 로컬에서 실행하고, PostgreSQL만 Docker로 띄웁니다.

```text
Next.js: pnpm --filter web dev
NestJS: pnpm --filter api start:dev
PostgreSQL: docker compose up db
```

나중에 팀 개발 환경을 맞출 때는 `docker-compose.yml`에 `web`, `api`, `db`를 함께 정의할 수 있습니다.

## 9. 라이브 커머스 확장 기술

라이브 커머스는 MVP 이후 확장 기능으로 도입합니다. 영상 인코딩, 송출, HLS/WebRTC 처리는 직접 구현하지 않고 외부 스트리밍 서비스를 사용합니다.

| 영역 | 기술 |
| --- | --- |
| 라이브 영상 송출 | AWS IVS 또는 Mux |
| 실시간 채팅 | NestJS WebSocket Gateway |
| 실시간 pub/sub | Redis |
| 채팅 메시지 저장 | PostgreSQL로 시작, 필요 시 MongoDB 검토 |
| 이벤트 로그/검색 | OpenSearch, 필요 시 도입 |
| 방송 상품/주문/재고 | PostgreSQL |

확장 시 요청 흐름:

```text
Viewer
  -> Next.js live page
    -> AWS IVS or Mux player
    -> NestJS WebSocket Gateway
      -> Redis pub/sub
      -> PostgreSQL or MongoDB
```

라이브 커머스에서 직접 구현하는 범위:

- 방송 방 생성/관리
- 방송 상품 등록
- 현재 소개 상품 전환
- 실시간 채팅
- 좋아요와 시청자 수
- 채팅 신고/관리자 삭제
- 방송 중 장바구니 담기
- 방송 종료 리포트

외부 서비스에 맡기는 범위:

- 영상 송출
- 인코딩
- HLS/WebRTC 처리
- 대규모 영상 CDN

## 10. 도입 순서

한 번에 모든 기술을 붙이지 않고 아래 순서로 진행합니다.

1. pnpm workspace 구성
2. `packages/domain` 타입과 계산 로직 정리
3. `apps/api` NestJS 기본 API 생성
4. PostgreSQL Docker 구성
5. Prisma schema와 migration 작성
6. 상품/리뷰 조회 API 구현
7. `apps/web` Next.js에서 API 연결
8. 장바구니/주문/쿠폰 API 구현
9. 셀러 분석 API 구현
10. AWS S3 presigned upload 추가
11. 배포 환경 분리
12. 라이브 커머스 확장 시 WebSocket, Redis, 외부 스트리밍 서비스 도입

## 11. 확정 스택

`pin-stitch`는 아래 조합을 기준으로 구현합니다.

```text
Next.js + NestJS + Prisma + PostgreSQL + AWS S3 + pnpm workspace
```

이 스택은 `pin-stitch`의 MVP를 만들기에도 충분하고, 이후 실제 서비스 구조로 확장하기에도 자연스럽습니다.
