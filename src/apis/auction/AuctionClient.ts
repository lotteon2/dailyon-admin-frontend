import { authAxiosInstance } from "@/apis/utils"
import { AxiosError, type AxiosResponse } from "axios"
import type {
  CreateAuctionRequest,
  CreateAuctionResponse,
  ReadAuctionPageResponse
} from "@/apis/auction/AuctionDto"

const AUCTION_SERVICE_PREFIX: string = "/auction-service"
const AUCTION_ADMIN_PREFIX: string = "/admin"
const AUCTION_PREFIX: string = "/auction"

export const createAuction = async (request: CreateAuctionRequest): Promise<AxiosResponse> => {
  return await authAxiosInstance.post(
    `${AUCTION_SERVICE_PREFIX}${AUCTION_ADMIN_PREFIX}${AUCTION_PREFIX}`,
    request
  )
}

export const readAuctions = async (
  page: number,
  size: number
): Promise<ReadAuctionPageResponse> => {
  try {
    const { data } = await authAxiosInstance.get(
      `${AUCTION_SERVICE_PREFIX}${AUCTION_ADMIN_PREFIX}${AUCTION_PREFIX}`,
      {
        params: { page: page, size: size }
      }
    )
    return data
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        if (error.response.status >= 400) {
          alert(error.response.data.message)
          console.error(`Client Error=${error.response.data.message}`)
        } else if (error.response.status < 500) {
          alert("서버 내부 오류")
          console.error("Internal Server Error")
        }
      }
    }
    throw error
  }
}
