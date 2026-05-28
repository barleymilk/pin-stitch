export type UserId = `user_${string}`;
export type BodyProfileId = `body_${string}`;
export type ProductId = `prod_${string}`;
export type VariantId = `var_${string}`;
export type ReviewId = `rev_${string}`;
export type StoreId = `store_${string}`;
export type CartId = `cart_${string}`;
export type CartItemId = `cart_item_${string}`;
export type CouponId = `cpn_${string}`;
export type OrderId = `ord_${string}`;
export type OrderNumber = string;
export type PaymentId = `pay_${string}`;
export type ShipmentId = `ship_${string}`;
export type ReturnReasonId = `ret_${string}`;
export type InsightId = `ins_${string}`;

export type ISODateTime = string;

export type CurrencyCode = "KRW" | "USD";

export interface Money {
  currency: CurrencyCode;
  amount: number;
}

export type UserRole = "CUSTOMER" | "SELLER" | "ADMIN";

export interface User {
  userId: UserId;
  role: UserRole;
  name: string;
  email: string;
  createdAt: ISODateTime;
}

export type BodyShape = "STRAIGHT" | "WAVE" | "NATURAL" | "UNKNOWN";
export type FitPreference = "SLIM" | "REGULAR" | "LOOSE";
export type ApparelSize = "XS" | "S" | "M" | "L" | "XL" | "FREE";

export interface BodyProfile {
  bodyProfileId: BodyProfileId;
  userId: UserId;
  heightCm: number;
  weightKg?: number;
  topSize: ApparelSize;
  bottomSize: ApparelSize;
  bodyShape: BodyShape;
  fitPreference: FitPreference;
  consentToUseBodyData: boolean;
  updatedAt: ISODateTime;
}

export type ProductCategory = "OUTER" | "TOP" | "BOTTOM" | "DRESS" | "SKIRT" | "KNIT";

export type ProductFit = "SLIM" | "REGULAR" | "LOOSE" | "OVERSIZED";
export type ProductStatus = "ACTIVE" | "DRAFT" | "ARCHIVED";

export interface ProductImage {
  url: string;
  altText: string;
  sortOrder: number;
}

export interface Product {
  productId: ProductId;
  brandId: string;
  brandName: string;
  name: string;
  description: string;
  category: ProductCategory;
  material: string;
  fit: ProductFit;
  price: Money;
  images: ProductImage[];
  status: ProductStatus;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface ProductListItemResponse {
  productId: ProductId;
  brandName: string;
  name: string;
  thumbnail: {
    url: string;
    altText: string;
  };
  price: Money;
  fitScore?: FitScore;
}

export interface ProductListResponse {
  items: ProductListItemResponse[];
  pagination: Pagination;
}

export interface ProductDetailResponse {
  product: Product;
  variants: ProductVariant[];
  sizeGuide: SizeMeasurement[];
}

export interface ProductVariant {
  variantId: VariantId;
  productId: ProductId;
  sku: string;
  color: string;
  size: ApparelSize;
  availableQuantity: number;
}

export interface SizeMeasurement {
  size: ApparelSize;
  shoulderCm?: number;
  chestCm?: number;
  waistCm?: number;
  hipCm?: number;
  thighCm?: number;
  lengthCm?: number;
  sleeveCm?: number;
}

export type FitResult = "SMALL" | "TRUE_TO_SIZE" | "LARGE";

export interface FitReview {
  reviewId: ReviewId;
  userId: UserId;
  productId: ProductId;
  variantId: VariantId;
  rating: 1 | 2 | 3 | 4 | 5;
  content: string;
  heightCm?: number;
  bodyShape?: BodyShape;
  fitPreference?: FitPreference;
  purchasedSize: ApparelSize;
  fitResult: FitResult;
  positiveKeywords: string[];
  negativeKeywords: string[];
  createdAt: ISODateTime;
}

export interface ReviewListItemResponse {
  reviewerLabel: string;
  rating: 1 | 2 | 3 | 4 | 5;
  content: string;
  heightCm?: number;
  bodyShape?: BodyShape;
  fitPreference?: FitPreference;
  purchasedSize: ApparelSize;
  fitResult: FitResult;
  positiveKeywords: string[];
  negativeKeywords: string[];
  createdAt: ISODateTime;
}

export interface ReviewListResponse {
  items: ReviewListItemResponse[];
  pagination: Pagination;
}

export type FitScoreConfidence = "LOW" | "MEDIUM" | "HIGH";

export interface FitScore {
  productId: ProductId;
  variantId?: VariantId;
  score: number;
  confidence: FitScoreConfidence;
  matchedReviewCount: number;
  reasons: string[];
}

export interface ReviewSummary {
  productId: ProductId;
  variantId?: VariantId;
  summary: string;
  warnings: string[];
  matchedReviewCount: number;
  basisReviewIds: ReviewId[];
}

export interface ReviewSummaryBodyCondition {
  heightCm?: number;
  bodyShape?: BodyShape;
  fitPreference?: FitPreference;
  purchasedSize?: ApparelSize;
}

export interface ReviewSummaryRepresentativeReview {
  rating: 1 | 2 | 3 | 4 | 5;
  content: string;
  heightCm?: number;
  bodyShape?: BodyShape;
  fitPreference?: FitPreference;
  purchasedSize: ApparelSize;
  fitResult: FitResult;
  positiveKeywords: string[];
  negativeKeywords: string[];
  createdAt: ISODateTime;
}

export interface ReviewSummaryResponse {
  productId: ProductId;
  variantId?: VariantId;
  summary: string;
  warnings: string[];
  matchedReviewCount: number;
  bodyCondition: ReviewSummaryBodyCondition;
  representativeReviews: ReviewSummaryRepresentativeReview[];
}

export interface Store {
  storeId: StoreId;
  name: string;
  address: string;
  lat: number;
  lng: number;
  isOpen: boolean;
}

export interface StoreInventory {
  storeId: StoreId;
  productId: ProductId;
  variantId: VariantId;
  quantity: number;
  locationInStore: {
    floor: string;
    zone: string;
    rack: string;
  };
  updatedAt: ISODateTime;
}

export type CouponDiscountType = "FIXED_AMOUNT" | "PERCENTAGE";
export type CouponTargetType = "ORDER" | "PRODUCT" | "CATEGORY" | "BRAND";

export interface Coupon {
  couponId: CouponId;
  userId?: UserId;
  name: string;
  discountType: CouponDiscountType;
  discountValue: number;
  maxDiscountAmount?: number;
  minOrderAmount?: number;
  targetType: CouponTargetType;
  targetIds: string[];
  stackable: boolean;
  startsAt: ISODateTime;
  endsAt: ISODateTime;
}

export interface CouponApplication {
  couponId: CouponId;
  targetItemId?: CartItemId;
  discountAmount: Money;
  reason: string;
}

export interface ExcludedCoupon {
  couponId: CouponId;
  reasonCode:
    | "EXPIRED"
    | "NOT_STARTED"
    | "MIN_ORDER_AMOUNT_NOT_MET"
    | "TARGET_NOT_MATCHED"
    | "NOT_STACKABLE"
    | "NO_DISCOUNT";
  message: string;
}

export interface CartPricing {
  subtotal: Money;
  discountTotal: Money;
  finalTotal: Money;
  appliedCoupons: CouponApplication[];
  excludedCoupons: ExcludedCoupon[];
}

export interface CartItem {
  itemId: CartItemId;
  productId: ProductId;
  variantId: VariantId;
  quantity: number;
  unitPrice: Money;
  lineTotal: Money;
}

export interface Cart {
  cartId: CartId;
  userId: UserId;
  items: CartItem[];
  availableCoupons: Coupon[];
  pricing: CartPricing;
  updatedAt: ISODateTime;
}

export interface ShippingAddress {
  recipientName: string;
  phone: string;
  postalCode: string;
  address1: string;
  address2?: string;
}

export type OrderStatus =
  | "PAYMENT_PENDING"
  | "PAID"
  | "PAYMENT_FAILED"
  | "ORDER_CREATED"
  | "PREPARING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderLine {
  orderLineId: string;
  productId: ProductId;
  variantId: VariantId;
  quantity: number;
  unitPrice: Money;
  lineTotal: Money;
}

export interface Order {
  orderId: OrderId;
  orderNumber: OrderNumber;
  userId: UserId;
  lines: OrderLine[];
  pricing: CartPricing;
  shippingAddress: ShippingAddress;
  status: OrderStatus;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export type PaymentProvider = "TOSS_PAYMENTS";
export type PaymentStatus = "READY" | "IN_PROGRESS" | "APPROVED" | "FAILED" | "CANCELED";

export interface Payment {
  paymentId: PaymentId;
  orderId: OrderId;
  orderNumber: OrderNumber;
  provider: PaymentProvider;
  status: PaymentStatus;
  amount: Money;
  providerOrderId: string;
  providerPaymentKey?: string;
  method?: string;
  receiptUrl?: string;
  requestedAt: ISODateTime;
  approvedAt?: ISODateTime;
  failedAt?: ISODateTime;
  failureCode?: string;
  failureMessage?: string;
  canceledAt?: ISODateTime;
  cancelReason?: string;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface TossPaymentConfirmRequest {
  paymentKey: string;
  orderId: string;
  amount: number;
}

export interface PaymentConfirmResponse {
  orderNumber: OrderNumber;
  orderStatus: OrderStatus;
  payment: Payment;
}

export type DeliveryStatus =
  | "PREPARING"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "DELAYED"
  | "DELIVERY_FAILED";

export interface Shipment {
  shipmentId: ShipmentId;
  orderId: OrderId;
  orderNumber: OrderNumber;
  status: DeliveryStatus;
  carrierName?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDeliveryDate?: string;
  shippedAt?: ISODateTime;
  deliveredAt?: ISODateTime;
  delayedAt?: ISODateTime;
  delayReason?: string;
  lastCheckedAt?: ISODateTime;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface DelayedShipment {
  shipment: Shipment;
  delayDays: number;
  reason: string;
  compensationIssued: boolean;
}

export type ReturnReasonCode =
  | "SIZE_TOO_SMALL"
  | "SIZE_TOO_LARGE"
  | "SHOULDER_FIT"
  | "WAIST_FIT"
  | "LENGTH_FIT"
  | "COLOR_DIFFERENCE"
  | "MATERIAL_EXPECTATION";

export interface ReturnReason {
  returnReasonId: ReturnReasonId;
  orderId: OrderId;
  productId: ProductId;
  variantId: VariantId;
  userId: UserId;
  reasonCode: ReturnReasonCode;
  memo?: string;
  createdAt: ISODateTime;
}

export type InsightSeverity = "LOW" | "MEDIUM" | "HIGH";

export type SellerInsightType =
  | "DETAIL_PAGE_IMPROVEMENT"
  | "SIZE_GUIDE_IMPROVEMENT"
  | "OPTION_IMPROVEMENT"
  | "TARGETING_OPPORTUNITY";

export interface FitKeywordStat {
  keyword: string;
  count: number;
}

export interface BodyShapeSatisfaction {
  bodyShape: BodyShape;
  averageRating: number;
  fitComplaintRate: number;
}

export interface SizeFitDistribution {
  size: ApparelSize;
  small: number;
  trueToSize: number;
  large: number;
}

export interface SellerInsight {
  insightId: InsightId;
  productId: ProductId;
  type: SellerInsightType;
  severity: InsightSeverity;
  message: string;
  createdAt: ISODateTime;
}

export interface SellerProductInsight {
  productId: ProductId;
  fitSatisfactionByBodyShape: BodyShapeSatisfaction[];
  sizeFitDistribution: SizeFitDistribution[];
  keywords: {
    positive: FitKeywordStat[];
    negative: FitKeywordStat[];
  };
  insights: SellerInsight[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiMeta {
  requestId: string;
  timestamp: ISODateTime;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export type ApiResponse<T> =
  | {
      success: true;
      data: T;
      error: null;
      meta: ApiMeta;
    }
  | {
      success: false;
      data: null;
      error: ApiError;
      meta: ApiMeta;
    };
