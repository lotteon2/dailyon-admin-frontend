import { authAxiosInstance } from "@/apis/utils"
import type { OrderDeliveryPageResponse, OrderDeliveryResponse } from "@/apis/delivery/DeliveryDto"
import type { AxiosResponse } from "axios"
import { AxiosError } from "axios"
const ORDER_SERVICE_PREFIX: string = "/order-service"
const ORDER_ADMIN_PREFIX: string = "/admin"

export const getDeliveries = async (
  page: number,
  size: number,
  status: string | null
): Promise<OrderDeliveryPageResponse<OrderDeliveryResponse>> => {
  try {
    const { data } = await authAxiosInstance.get(
      `${ORDER_SERVICE_PREFIX}${ORDER_ADMIN_PREFIX}/deliveries`,
      {
        params: {
          page: page,
          size: size,
          status: status
        }
      }
    )
    return data
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        if (error.response.status >= 400 && error.response.status < 500) {
          console.error(`Client Error=${error.response.data.message}`)
        } else if (error.response.status >= 500) {
          console.error("Internal Server Error")
        }
      }
    }
    throw error
  }
}
