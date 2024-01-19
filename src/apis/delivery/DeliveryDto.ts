export interface OrderDeliveryResponse {
  id: number
  receiver: string
  postCode: string
  roadAddress: string
  detailAddress: string
  phoneNumber: String
  status: string
  createdAt: string
  memberId: number
  orderNo: string
  productsName: string
}

export interface OrderDeliveryPageResponse<T extends OrderDeliveryResponse> {
  deliveries: Array<T>
  totalPages: number
  totalElements: number
}

export interface DevlieryStatusEnum {
  type: string | null
  name: string
}
