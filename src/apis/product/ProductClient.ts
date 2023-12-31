import { authAxiosInstance } from "@/apis/utils"
import type { AxiosResponse } from "axios"

import type {
  CreateProductRequest,
  ReadProductPageRequest,
  UpdateProductRequest
} from "@/apis/product/ProductDto"

const PRODUCT_SERVICE_PREFIX: string = "/product-service"
const PRODUCT_ADMIN_PREFIX: string = "/admin"
const PRODUCT_PREFIX: string = "/products"
export const getProductPages = async (request: ReadProductPageRequest): Promise<AxiosResponse> => {
  return await authAxiosInstance.get(
    `${PRODUCT_SERVICE_PREFIX}${PRODUCT_ADMIN_PREFIX}${PRODUCT_PREFIX}`,
    {
      params: request
    }
  )
}

export const createProduct = async (request: CreateProductRequest): Promise<AxiosResponse> => {
  return await authAxiosInstance.post(
    `${PRODUCT_SERVICE_PREFIX}${PRODUCT_ADMIN_PREFIX}${PRODUCT_PREFIX}`,
    request
  )
}

export const updateProduct = async (
  productId: number,
  request: UpdateProductRequest
): Promise<AxiosResponse> => {
  return await authAxiosInstance.put(
    `${PRODUCT_SERVICE_PREFIX}${PRODUCT_ADMIN_PREFIX}${PRODUCT_PREFIX}/${productId}`,
    request
    )
}

export const deleteProducts = async (ids: Array<Number>): Promise<void> => {
  return await authAxiosInstance.delete(
    `${PRODUCT_SERVICE_PREFIX}${PRODUCT_ADMIN_PREFIX}${PRODUCT_PREFIX}`,
    {
      params: { ids: ids.join(",") }
    }
  )
}
