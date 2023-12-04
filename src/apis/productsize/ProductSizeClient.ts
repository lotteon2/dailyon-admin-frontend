import { authAxiosInstance } from "@/apis/utils"
import type { AxiosResponse } from "axios"
import type {
  CreateProductSizeRequest,
  UpdateProductSizeRequest
} from "@/apis/productsize/ProductSizeDto"

const PRODUCT_ADMIN_PREFIX: string = "/admin"
const PRODUCT_SIZE_PREFIX: string = "/product-size"

export const getProductSizesByCategory = async (categoryId: number): Promise<AxiosResponse> => {
  return await authAxiosInstance.get(PRODUCT_ADMIN_PREFIX + PRODUCT_SIZE_PREFIX + "/" + categoryId)
}

export const createProductSize = async (body: CreateProductSizeRequest): Promise<AxiosResponse> => {
  return await authAxiosInstance.post(PRODUCT_ADMIN_PREFIX + PRODUCT_SIZE_PREFIX, body)
}

export const updateProductSize = async (
  productSizeId: number,
  body: UpdateProductSizeRequest
): Promise<AxiosResponse> => {
  return await authAxiosInstance.put(
    PRODUCT_ADMIN_PREFIX + PRODUCT_SIZE_PREFIX + "/" + productSizeId,
    body
  )
}