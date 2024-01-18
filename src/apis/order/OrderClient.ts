import { authAxiosInstance } from "@/apis/utils"
import type { OrderDetailResponse, OrderPageResponse, OrderResponse } from "@/apis/order/OrderDto"
import type { AxiosResponse } from "axios"
import { AxiosError } from "axios"
const ORDER_SERVICE_PREFIX: string = "/order-service"
const ORDER_ADMIN_PREFIX: string = "/admin"

export const getOrders = async (
  page: number,
  size: number,
  type: string | null
): Promise<OrderPageResponse<OrderResponse>> => {
  try {
    const { data } = await authAxiosInstance.get(
      `${ORDER_SERVICE_PREFIX}${ORDER_ADMIN_PREFIX}/orders`,
      {
        params: {
          page: page,
          size: size,
          type: type
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

export const getOrderDetails = async (orderNo: String): Promise<OrderDetailResponse[]> => {
  try {
    const { data } = await authAxiosInstance.get(
      `${ORDER_SERVICE_PREFIX}${ORDER_ADMIN_PREFIX}/orders/${orderNo}`
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

export const cancelOrderDetail = async (orderDetailNo: String) => {
  try {
    const response = await authAxiosInstance.delete(
      `${ORDER_SERVICE_PREFIX}${ORDER_ADMIN_PREFIX}/orders/order-details/${orderDetailNo}`
    )
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        if (error.response.status >= 400) {
          console.error(`Client Error=${error.response.data.message}`)
        } else if (error.response.status < 500) {
          console.error("Internal Server Error")
        }
      }
    }
    throw error
  }
}
