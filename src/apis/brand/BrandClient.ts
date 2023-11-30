import { authAxiosInstance } from "@/apis/utils"
import { type AxiosResponse } from "axios"
import type { CreateBrandRequest, UpdateBrandRequest } from "@/apis/brand/dto/BrandRequest"

const PRODUCT_BRAND_PREFIX: string = "/brands"
const PRODUCT_ADMIN_PREFIX: string = "/admin"

export const getAllBrands = async (): Promise<AxiosResponse> => {
  return await authAxiosInstance.get(PRODUCT_BRAND_PREFIX)
}

export const createBrand = async (
  createBrandRequest: CreateBrandRequest
): Promise<AxiosResponse> => {
  return await authAxiosInstance.post(
    PRODUCT_ADMIN_PREFIX + PRODUCT_BRAND_PREFIX,
    createBrandRequest
  )
}

export const updateBrand = async (
  brandId: number,
  updateBrandRequest: UpdateBrandRequest
): Promise<AxiosResponse> => {
  return await authAxiosInstance.put(
    PRODUCT_ADMIN_PREFIX + PRODUCT_BRAND_PREFIX + "/" + brandId,
    updateBrandRequest
  )
}

export const deleteBrand = async (brandId: number): Promise<AxiosResponse> => {
  return await authAxiosInstance.put(PRODUCT_ADMIN_PREFIX + PRODUCT_BRAND_PREFIX + "/" + brandId)
}
