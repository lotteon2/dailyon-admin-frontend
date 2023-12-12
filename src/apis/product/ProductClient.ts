import { authAxiosInstance } from "@/apis/utils"
import type { AxiosResponse } from "axios"

import type { ReadProductPageRequest } from "@/apis/product/ProductDto"

const PRODUCT_ADMIN_PREFIX: string = "/admin"
const PRODUCT_PREFIX: string = "/products"
export const getProductPages = async (request: ReadProductPageRequest): Promise<AxiosResponse> => {
  return await authAxiosInstance.get(`${PRODUCT_ADMIN_PREFIX}${PRODUCT_PREFIX}`, {
    params: request
  })
}
