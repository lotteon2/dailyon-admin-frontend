export interface CreateProductSizeRequest {
  categoryId: number
  name: string
}

export interface CreateProductSizeResponse {
  productSizeId: number
}

export interface ReadProductSizeResponse {
  id: number
  name: string
}

export interface ReadProductSizePageResponse {
  totalPages: number
  totalElements: number
  productSizes: Array<ReadProductSizeResponse>
}

export interface UpdateProductSizeRequest {
  name: string
}

export interface UpdateProductSizeDto {
  index: number
  name: string
}
