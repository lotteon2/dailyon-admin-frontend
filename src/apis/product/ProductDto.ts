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
  describeImgUrls: Array<string>
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
  gender: string
  image: string
  productStocks: Array<ProductStockRequest>
  describeImages: Array<String>
}

export interface CreateProductResponse {
  productId: number
  imgPresignedUrl: string
  describeImgPresignedUrl: Record<string, string>
}

export interface UpdateProductRequest {
  brandId: number
  categoryId: number
  price: number
  name: string
  code: string
  gender: string
  image: string | null
  productStocks: Array<ProductStockRequest>
  describeImages: Record<string, string> | null
}

export interface UpdateProductResponse {
  imgPresignedUrl: string | null
  describeImgPresignedUrl: Record<string, string> | null
}

export interface ProductStockRequest {
  productSizeId: number
  quantity: number
}

export interface ProductTypeEnum {
  type: string
  name: string
}