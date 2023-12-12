export interface ReadProductPageRequest {
  brandId: number | null
  categoryId: number | null
  type: string
  page: number
  size: number
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

export interface CreateProductRequest {
  brandId: number
  categoryId: number
  price: number
  name: string
  code: string
  type: string
  image: string
  productStocks: Array<ProductStockRequest>
  describeImages: Array<String>
}

export interface ProductStockRequest {
  productSizeId: number
  quantity: number
}
