import { authAxiosInstance } from "@/apis/utils"
import { type AxiosResponse } from "axios"
import type { CreateCategoryRequest, UpdateCategoryRequest } from "@/apis/category/CategoryDto"

const PRODUCT_SERVICE_PREFIX: string = "/product-service"
const PRODUCT_ADMIN_PREFIX: string = "/admin"
const PRODUCT_CATEGORY_PREFIX: string = "/categories"

export const getAllCategories = async (): Promise<AxiosResponse> => {
  return await authAxiosInstance.get(PRODUCT_ADMIN_PREFIX + PRODUCT_CATEGORY_PREFIX)
}

export const getCategoryPages = async (page: number): Promise<AxiosResponse> => {
  return await authAxiosInstance.get(`${PRODUCT_ADMIN_PREFIX}/page${PRODUCT_CATEGORY_PREFIX}`, {
    params: { page: page }
  })
}

export const createCategory = async (
  createCategoryRequest: CreateCategoryRequest
): Promise<AxiosResponse> => {
  return await authAxiosInstance.post(
    PRODUCT_ADMIN_PREFIX + PRODUCT_CATEGORY_PREFIX,
    createCategoryRequest
  )
}

export const updateCategory = async (
  categoryId: number,
  updateCategoryRequest: UpdateCategoryRequest
): Promise<AxiosResponse> => {
  return await authAxiosInstance.put(
    PRODUCT_ADMIN_PREFIX + PRODUCT_CATEGORY_PREFIX + "/" + categoryId,
    updateCategoryRequest
  )
}
