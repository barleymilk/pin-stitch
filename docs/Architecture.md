# 🏗 Architecture & Tech Stack

## 1. Frontend Layer

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + Framer Motion (고급 애니메이션)
- **3D Engine**: Three.js + React Three Fiber + Drei (R3F 라이브러리)
- **State Management**:
  - **Server State**: TanStack Query (상품 데이터 Fetching & 캐싱 전략)
  - **Client State**: Zustand (장바구니, 유저 세션, 3D 뷰어 인터랙션 설정)
  - **Real-time**: Socket.io-client (라이브 커머스 채팅 연동)

## 2. Component Strategy (Atomic Design)

- **Atoms**: `Button`, `Input`, `Badge`, `Typography` (공통 UI 요소)
- **Molecules**: `ProductCard`, `ChatMessage`, `SearchBar`, `LiveStatus`
- **Organisms**:
  - `ThreeViewer`: 3D 모델 렌더링, 텍스처 변경 로직 포함
  - `LiveStreamer`: HLS 플레이어 + 실시간 채팅 레이어 통합
  - `ProductGrid`: 29CM 스타일의 감도 높은 상품 리스트 레이아웃
- **Templates/Pages**: `MagazineLayout`, `ProductDetailLayout`

## 3. Rendering & Optimization (핵심 역량)

- **3D Optimization**:
  - `GLTFLoader` + `DRACOCompression`: 모델 용량 최적화로 초기 로딩 속도 개선.
  - `useLoader` Preloading: 상세 페이지 진입 전 데이터 미리 읽기.
- **Media Optimization**:
  - Next.js `Image` Priority: 메인 배너 및 LCP 이미지 최적화.
  - `HLS.js`: 라이브 스트리밍 지연 시간(Latency) 최소화 처리.
- **Code Architecture**:
  - `dynamic()` import: Three.js 등 무거운 라이브러리는 클라이언트 사이드에서만 필요할 때 로드.

## 4. Data Flow

- **Product Data**: TanStack Query가 서버 데이터를 관리하고 전역 캐싱 적용.
- **3D Config**: 유저가 선택한 옵션(색상, 재질)은 Zustand가 실시간으로 관리하여 `ThreeViewer`에 전달.
- **Chatting**: Socket.io 이벤트를 통해 상태를 업데이트하고 프론트엔드 최적화(Optimistic Update) 적용.
