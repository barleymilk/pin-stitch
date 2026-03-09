# 📄 PRD: Next-Gen Fashion Platform (Vibe-Select)

## 1. 프로젝트 개요

- **서비스명**: Pin-Stitch
- **한 줄 정의**: AI 3D 피팅과 라이브 소통이 결합된 고감도 큐레이션 패션 플랫폼
- **핵심 가치**:
  - **Selection**: 미니멀하고 잡지 같은 고감도 레이아웃.
  - **Experience**: Three.js 기반의 입체적 상품 확인.
  - **Connection**: 실시간 채팅과 라이브 스트리밍을 통한 인터랙티브 쇼핑.

## 2. 타겟 사용자

- **감도 높은 소비층**: 심미적 UI/UX를 중시하는 유저.
- **스마트 쇼퍼**: 3D/AI 기능을 통해 온라인 구매 실패를 줄이려는 유저.
- **소통형 구매자**: 라이브 방송과 실시간 피드백을 선호하는 유저.

## 3. 핵심 기능 명세 (Feature List)

### 3.1 큐레이션 홈 (29CM Style)

- **Magazine UI**: 카드 뉴스 형태의 상품 노출 및 여백의 미 강조.
- **Dynamic Banner**: 스크롤 인터랙션에 반응하는 비주얼 배너.
- **Brand Story**: 브랜드 철학을 담은 상세 페이지 레이아웃.

### 3.2 AI 기반 3D 이미지 뷰어

- **3D Virtual Object**: Three.js 활용 360도 상품 뷰어 구현.
- **AI Style Transformation**: 유저 사진 업로드 시 AI 기반 가상 착장(Try-on) 구현.
- **Texture Detail**: 고화질 텍스처 렌더링을 통한 소재 질감 표현.

### 3.3 라이브 쇼핑 & 실시간 채팅

- **HLS Video Player**: 저지연 라이브 스트리밍 플레이어.
- **Real-time Interaction**: Socket.io 기반 실시간 채팅.
- **Interactive Popup**: 채팅 메시지 내 상품 언급 시 즉시 구매 팝업 노출.
- **Reaction Effects**: 실시간 인터랙티브 애니메이션(하트 등).

### 3.4 AI 개인화

- **Taste Analysis**: 유저 행동 데이터 분석 기반 맞춤형 할인 및 상품 추천.

## 4. 기술 스택 (Technical Architecture)

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **State**: Zustand (Global), TanStack Query (Server)
- **3D/Graphics**: Three.js, React Three Fiber (R3F), Drei
- **Real-time**: Socket.io
- **AI**: Stable Diffusion API / 관련 SDK 연동

## 5. 디자인 원칙 (Design System)

- **Typography**: Serif(고급감) & Sans-serif(가독성) 혼용.
- **Color**: White, Off-white, Black 메인 + Point Color 1개.
- **Space**: 최소 24px 이상의 여백 유지.

## 6. 성공 지표 (KPI)

- **Performance**: LCP 2.5초 이내 달성.
- **UX**: 3D/채팅 인터랙션 지연 100ms 미만.
- **SEO**: Lighthouse 성능 지표 90점 이상.
