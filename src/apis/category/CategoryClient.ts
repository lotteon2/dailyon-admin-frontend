import { authAxiosInstance } from "@/apis/utils"
import { type AxiosResponse } from "axios"
import type { CreateCategoryRequest, UpdateCategoryRequest } from "@/apis/category/CategoryDto"

const PRODUCT_SERVICE_PREFIX: string = "/product-service"
const PRODUCT_ADMIN_PREFIX: string = "/admin"
const PRODUCT_CATEGORY_PREFIX: string = "/categories"

export const getAllCategories = async (): Promise<AxiosResponse> => {
  return await authAxiosInstance.get(
    `${PRODUCT_SERVICE_PREFIX}${PRODUCT_ADMIN_PREFIX}${PRODUCT_CATEGORY_PREFIX}`
  )
}

export const getLeafCategories = async (): Promise<AxiosResponse> => {
  return await authAxiosInstance.get(
    `${PRODUCT_SERVICE_PREFIX}${PRODUCT_ADMIN_PREFIX}${PRODUCT_CATEGORY_PREFIX}/leaf`
  )
}

export const getCategoryPages = async (page: number, size: number): Promise<AxiosResponse> => {
  return await authAxiosInstance.get(
    `${PRODUCT_SERVICE_PREFIX}${PRODUCT_ADMIN_PREFIX}/page${PRODUCT_CATEGORY_PREFIX}`,
    {
      params: { page: page, size: size }
    }
  )
}

export const createCategory = async (
  createCategoryRequest: CreateCategoryRequest
): Promise<AxiosResponse> => {
  return await authAxiosInstance.post(
    `${PRODUCT_SERVICE_PREFIX}${PRODUCT_ADMIN_PREFIX}${PRODUCT_CATEGORY_PREFIX}`,
    createCategoryRequest
  )
}

export const updateCategory = async (
  categoryId: number,
  updateCategoryRequest: UpdateCategoryRequest
): Promise<AxiosResponse> => {
  return await authAxiosInstance.put(
    `${PRODUCT_SERVICE_PREFIX}${PRODUCT_ADMIN_PREFIX}${PRODUCT_CATEGORY_PREFIX}/${categoryId}`,
    updateCategoryRequest
  )
}

export const deleteCategory = async (categoryId: number): Promise<AxiosResponse> => {
  return await authAxiosInstance.delete(
    `${PRODUCT_SERVICE_PREFIX}${PRODUCT_ADMIN_PREFIX}${PRODUCT_CATEGORY_PREFIX}/${categoryId}`
  )
}
