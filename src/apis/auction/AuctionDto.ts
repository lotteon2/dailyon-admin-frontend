import type { CreateProductRequest } from "@/apis/product/ProductDto"

export interface ReadAuctionResponse {
  id: string
  auctionProductId: number
  auctionName: string
  startBidPrice: number
  askingPrice: number
  maximumWinner: number
  startAt: string
  started: boolean
  ended: boolean
}

export interface ReadAuctionDetailResponse {
  auctionResponse: ReadAuctionResponse
  productDetailResponse: ReadProductDetailResponse
}

export interface ReadProductDetailResponse {
  categoryId: number
  brandName: string
  name: string
  imgUrl: string
  price: number
  gender: string
  avgRating: number
  reviewCount: number
  productStocks: ReadProductStockResponse[]
  describeImgUrls: String[]
}

export interface ReadProductStockResponse {
  productSizeId: number
  productSizeName: string
  quantity: number
}

export interface ReadAuctionPageResponse {
  totalElements: number
  totalPages: number
  responses: ReadAuctionResponse[]
}

export interface CreateAuctionRequest {
  auctionName: string
  startBidPrice: number
  askingPrice: number
  startAt: string
  maximumWinner: number
  productRequest: CreateProductRequest
}

export interface CreateAuctionResponse {
  auctionId: string
  productId: number
  imgPresignedUrl: string
  describeImgPresignedUrl: Record<string, string>
}
