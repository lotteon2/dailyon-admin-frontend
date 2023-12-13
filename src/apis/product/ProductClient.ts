import { authAxiosInstance } from "@/apis/utils"
import type { AxiosResponse } from "axios"

import type { CreateProductRequest, ReadProductPageRequest } from "@/apis/product/ProductDto"

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
