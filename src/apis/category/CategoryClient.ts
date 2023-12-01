import { authAxiosInstance } from "@/apis/utils"
import { type AxiosResponse } from "axios"
import type {
  CreateCategoryRequest,
  UpdateCategoryRequest
} from "@/apis/category/dto/CategoryRequest"

const PRODUCT_ADMIN_PREFIX: string = "/admin"
const PRODUCT_CATEGORY_PREFIX: string = "/categories"

export const getAllCategories = async (): Promise<AxiosResponse> => {
  return await authAxiosInstance.get(PRODUCT_ADMIN_PREFIX + PRODUCT_CATEGORY_PREFIX)
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

// TODO : 리프 카테고리 api 하고 나서 추가
