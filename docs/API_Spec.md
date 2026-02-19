# 📡 API & Data Schema Spec

## 1. Product Object
```typescript
interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  discountRate?: number;
  images: string[];
  model3d?: {
    url: string; // .glb 파일
    scale: number;
    initialRotation: [number, number, number];
  };
  aiTags: string[];
}
```

## 2. Live Commerce Events (Socket.io)

실시간 소통 및 인터랙티브 쇼핑을 위한 이벤트 명세입니다.

| Event Name | Type | Description | Data Schema |
| :--- | :--- | :--- | :--- |
| `chat:message` | Send/Receive | 실시간 채팅 메시지 송수신 | `{ userId: string, userName: string, message: string, timestamp: string }` |
| `live:product-pop` | Receive | 방송 중 특정 상품 강조 팝업 알림 | `{ productId: string, productName: string, discountPrice: number, duration: number }` |
| `live:stats` | Receive | 실시간 시청자 수 및 좋아요 업데이트 | `{ viewerCount: number, likeCount: number }` |

---

## 3. AI Interface (Virtual Try-on)

사용자 이미지와 상품 데이터를 결합한 AI 가상 착장 API입니다.

- **Endpoint**: `POST /api/ai/try-on`
- **Description**: 사용자가 업로드한 사진에 선택한 상품을 합성하여 결과 이미지를 생성합니다.

### Request Body
```json
{
  "userImage": "string (base64 or image_url)",
  "productId": "string",
  "options": {
    "size": "string",
    "fit": "slim | regular | loose"
  }
}
```

### Response Body
```json
{
  "resultImageUrl": "string (url)",
  "matchScore": "number (0-100)",
  "feedback": "string (AI 스타일링 조언)"
}
```