export interface ReadProductPageRequest {
  brandId: number | null
  categoryId: number | null
  type: string
  page: number
}

export interface ReadProductPageResponse {
  totalElements: number
  totalPages: number
  productResponses: Array<ReadProductAdminResponse>
}

export interface ReadProductAdminResponse {
  id: number
  brandId: number
  categoryId: number
  price: number
  name: string
  gender: string
  code: string
  imgUrl: string
  describeImgUrls: Array<String>
  productStocks: Array<ReadProductStockAdminResponse>
}

export interface ReadProductStockAdminResponse {
  productSizeId: number
  productSizeName: string
  quantity: number
}
