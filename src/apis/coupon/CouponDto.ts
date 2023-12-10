export interface CouponCreateRequest {
    name: string;
    
    discountType: string;
    discountValue: number;

    startAt: string; // ISO 8601 date-time string format
    endAt: string;   // ISO 8601 date-time string format

    issuedQuantity: number;
    
    appliesToType: string;
    appliesToId: number;
    appliesToName: string;

    requiresConcurrencyControl: boolean;
    targetImgUrl?: string;     // Optional

    minPurchaseAmount?: number; // Optional
    maxDiscountAmount?: number; // Optional
}

export interface CouponUpdateRequest {
  name: string;
    
  discountType: string;
  discountValue: number;

  startAt: string; // ISO 8601 date-time string format
  endAt: string;   // ISO 8601 date-time string format

  issuedQuantity: number;
    
  appliesToType: string;
  appliesToId: number;
  appliesToName: string;

  requiresConcurrencyControl: boolean;
  targetImgUrl?: string;     // Optional

  minPurchaseAmount?: number; // Optional
  maxDiscountAmount?: number; // Optional
}

export interface couponInfoReadItemResponse {
  id: number;
  name: string;
  discountType: string;
  discountValue: number;
  startAt: string;
  endAt: string;
  remainingQuantity: number;
  issuedQuantity: number;
  appliesToType: string;
  appliesToId: number;
  appliesToName: string;
  requiresConcurrencyControl: boolean;
  targetImgUrl?: string;
  minPurchaseAmount?: number | null;
  maxDiscountAmount?: number | null;
}

export interface CouponInfoPageResponse {
  couponInfoReadItemResponseList: couponInfoReadItemResponse[];
  totalCounts: number;
}

export const convertToCouponUpdateRequest = (coupon: couponInfoReadItemResponse): CouponUpdateRequest => {
  return {
    name: coupon.name,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    startAt: coupon.startAt, // 이미 ISO 8601 포맷으로되어있어야함
    endAt: coupon.endAt,     // 이미 ISO 8601 포맷으로되어있어야함
    issuedQuantity: coupon.issuedQuantity,
    appliesToType: coupon.appliesToType,
    appliesToId: coupon.appliesToId,
    appliesToName: coupon.appliesToName,
    requiresConcurrencyControl: coupon.requiresConcurrencyControl,
    targetImgUrl: coupon.targetImgUrl,  // Optional
    minPurchaseAmount: coupon.minPurchaseAmount === null ? undefined : coupon.minPurchaseAmount, // Optional, null을 undefined로 변환
    maxDiscountAmount: coupon.maxDiscountAmount === null ? undefined : coupon.maxDiscountAmount, // Optional, null을 undefined로 변환
  };
};

export const getDiscountTypeDisplayValue = (discountType: string) => {
  const discountTypeMap: Record<string, string> = {
    PERCENTAGE: '정률',
    FIXED_AMOUNT: '정액',
  };
  return discountTypeMap[discountType] || discountType; // default to the same value if not found in the map
};

export const formatDiscountValue = (discountType: string, discountValue: number): string => {
  switch (discountType) {
    case 'FIXED_AMOUNT':
      return discountValue.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' });
    case 'PERCENTAGE':
      return `${discountValue}%`;
    default:
      return discountValue.toString();
}
};