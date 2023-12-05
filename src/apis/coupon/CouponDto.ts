export interface CouponCreateRequest {
    name: string;
    
    discountType: string;
    discountValue: number;

    startAt: string; // ISO 8601 date-time string format
    endAt: string;   // ISO 8601 date-time string format

    issuedQuantity: number;
    
    appliesToType: string;
    appliesToId: number;

    requiresConcurrencyControl: boolean;
    targetImgUrl?: string;     // Optional

    minPurchaseAmount?: number; // Optional
    maxDiscountAmount?: number; // Optional
}

export interface CouponInfo {
    id: number;
    name: string;
    discountType: string;
    discountValue: number;
    startAt: string;
    endAt: string;
    remainingQuantity: number;
    totalQuantity: number;
    appliesToType: string;
    appliesToId: number;
    appliesToName: string;
    requiresConcurrencyControl: boolean;
    targetImgUrl?: string;
    minPurchaseAmount?: number;
    maxDiscountAmount?: number;
  }

export interface CouponInfoPageResponse {
    values: CouponInfo[];
    totalPages: number;
}

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