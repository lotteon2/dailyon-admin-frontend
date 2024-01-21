import { authAxiosInstance } from "@/apis/utils"
import { AxiosError, type AxiosResponse } from "axios"
import type {
  CreateAuctionRequest,
  ReadAuctionDetailResponse,
  ReadAuctionPageResponse
} from "@/apis/auction/AuctionDto"

const AUCTION_SERVICE_PREFIX: string = "/auction-service"
const AUCTION_ADMIN_PREFIX: string = "/admin"
const AUCTION_PREFIX: string = "/auctions"
const BID_PREFIX: string = "/bids"

export const createAuction = async (request: CreateAuctionRequest): Promise<AxiosResponse> => {
  return await authAxiosInstance.post(
    `${AUCTION_SERVICE_PREFIX}${AUCTION_ADMIN_PREFIX}${AUCTION_PREFIX}`,
    request
  )
}

export const readAuctions = async (
  page: number,
  size: number,
  path: string
): Promise<ReadAuctionPageResponse> => {
  try {
    const { data } = await authAxiosInstance.get(`${AUCTION_SERVICE_PREFIX}/${path}`, {
      params: { page: page, size: size }
    })
    return data
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        if (error.response.status >= 400 && error.response.status < 500) {
          alert(error.response.data.message)
          console.error(`Client Error=${error.response.data.message}`)
        } else if (error.response.status >= 500) {
          alert(error.response.data.message)
          console.error("Internal Server Error")
        }
      }
    }
    throw error
  }
}

export const getAuctionDetail = async (auctionId: string): Promise<ReadAuctionDetailResponse> => {
  try {
    const { data } = await authAxiosInstance.get(
      `${AUCTION_SERVICE_PREFIX}${AUCTION_PREFIX}/detail/${auctionId}`
    )
    return data
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        if (error.response.status >= 400 && error.response.status < 500) {
          alert(error.response.data.message)
          console.error(`Client Error=${error.response.data.message}`)
        }
        if (error.response.status >= 500) {
          console.error("Internal Server Error")
        }
      }
    }
    throw error
  }
}

export const startAuctionBid = async (auctionId: string): Promise<AxiosResponse> => {
  return await authAxiosInstance.patch(
    `${AUCTION_SERVICE_PREFIX}${AUCTION_ADMIN_PREFIX}${BID_PREFIX}/start/${auctionId}`
  )
}

export const endAuctionBid = async (auctionId: string): Promise<AxiosResponse> => {
  return await authAxiosInstance.patch(
    `${AUCTION_SERVICE_PREFIX}${AUCTION_ADMIN_PREFIX}${BID_PREFIX}/end/${auctionId}`
  )
}

export const deleteAuction = async (auctionId: string): Promise<AxiosResponse> => {
  return await authAxiosInstance.delete(
    `${AUCTION_SERVICE_PREFIX}${AUCTION_ADMIN_PREFIX}${AUCTION_PREFIX}`,
    {
      params: { auctionId: auctionId }
    }
  )
}
