export interface OrderResponse {
  orderNo: string
  memberId: number
  productsName: string
  usedPoints: number
  totalCouponDiscountPrice: number
  totalAmount: number
  status: string
  type: string
  createdAt: string
}

export interface OrderPageResponse<T extends OrderResponse> {
  orders: Array<T>
  totalPages: number
  totalElements: number
}

export interface OrderDetailResponse {
  id: number
  orderNo: string
  orderDetailNo: string
  productId: number
  productSize: string
  productName: string
  productQuantity: number
  thumbnail: string
  orderPrice: number
  couponName: string | undefined | null
  couponDiscountPrice: number | undefined | null
  status: string
  reviewCheck: boolean
}

export interface OrderTypeEnum {
  type: string | null
  name: string
}
