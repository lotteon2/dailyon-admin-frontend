import type { CreateProductRequest } from "@/apis/product/ProductDto"

export interface ReadAuctionResponse {
  id: string
  auctionProductId: number
  auctionName: string
  startBidPrice: number
  maximumWinner: number
  startAt: string
  started: boolean
  ended: boolean
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
