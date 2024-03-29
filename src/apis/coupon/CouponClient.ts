import { authAxiosInstance } from "@/apis/utils"
import type { AxiosResponse } from "axios"
import type {
  CouponCreateRequest,
  CouponUpdateRequest,
  CouponInfoPageResponse,
  couponInfoReadItemResponse,
  ReadProductResponse,
  ReadProductSliceResponse,
  ReadChildrenCategoryListResponse,
  ReadChildrenCategoryResponse,
  ReadOOTDSearchSliceResponse,
  ReadOOTDSearchResponse
} from "@/apis/coupon/CouponDto"

const PROMOTION_SERVICE_PREFIX: string = "/promotion-service"
const COUPON_ADMIN_PREFIX: string = "/admin"
const COUPON_PREFIX: string = "/coupons"

export const createCouponInfo = async (body: CouponCreateRequest): Promise<AxiosResponse> => {
  return await authAxiosInstance.post(
    PROMOTION_SERVICE_PREFIX + COUPON_ADMIN_PREFIX + COUPON_PREFIX,
    body
  )
}

export const updateCouponInfo = async (
  couponInfoId: number | undefined,
  body: CouponUpdateRequest
): Promise<AxiosResponse> => {
  return await authAxiosInstance.patch(
    PROMOTION_SERVICE_PREFIX + COUPON_ADMIN_PREFIX + COUPON_PREFIX + `/${couponInfoId}`,
    body
  )
}

export const deleteCouponInfo = async (couponInfoId: number): Promise<AxiosResponse> => {
  return await authAxiosInstance.delete(
    PROMOTION_SERVICE_PREFIX + COUPON_ADMIN_PREFIX + COUPON_PREFIX + `/${couponInfoId}`
  )
}

export const invalidateCouponInfo = async (couponInfoId: number): Promise<AxiosResponse> => {
  return await authAxiosInstance.patch(
    PROMOTION_SERVICE_PREFIX + COUPON_ADMIN_PREFIX + COUPON_PREFIX + `/${couponInfoId}/invalidate`
  )
}

export const getCouponInfoPage = async (
  size?: number,
  page?: number
): Promise<CouponInfoPageResponse> => {
  let queryParams: string[] = []
  if (size != null) {
    queryParams.push(`size=${size}`)
  }
  if (page != null) {
    queryParams.push(`page=${page}`)
  }

  let url = PROMOTION_SERVICE_PREFIX + COUPON_ADMIN_PREFIX + COUPON_PREFIX
  // let url = "https://3e2ab8db-c068-4228-aaef-d4f0848542bc.mock.pstmn.io/admin" + COUPON_ADMIN_PREFIX + COUPON_PREFIX;
  if (queryParams.length > 0) {
    url += `?${queryParams.join("&")}`
  }
  try {
    const response = await authAxiosInstance(url)
    return response.data as CouponInfoPageResponse // typecast
  } catch (err) {
    console.error("Error fetching couponInfo:", err)
    throw err
  }
}

const PRODUCT_SERVICE_PREFIX = "/product-service"

export const searchProducts = async (query: string): Promise<ReadOOTDSearchResponse[]> => {
  try {
    if (query.trim() !== "") {
      const response = await authAxiosInstance.get<ReadOOTDSearchSliceResponse>(
        `${PRODUCT_SERVICE_PREFIX}/products/search/ootd`,
        {
          params: { lastId: 0, query: query }
        }
      )
      // 들어오는 hasNext는 사용하지 않을것임.
      return response.data.products
    }
    return [] // If the query is empty, return an empty array
  } catch (error) {
    console.error("Failed to search products", error)
    throw error // Rethrow error for caller to handle
  }
}

export const fetchCategories = async (): Promise<ReadChildrenCategoryResponse[]> => {
  try {
    const response = await authAxiosInstance.get(`${PRODUCT_SERVICE_PREFIX}/admin/categories/leaf`)
    return response.data.categoryResponses
  } catch (error) {
    console.error("Failed to fetch categories", error)
    throw error // Rethrow error for caller to handle
  }
}

// export const getProductSizesByCategory = async (categoryId: number): Promise<AxiosResponse> => {
//   return await authAxiosInstance.get(COUPON_ADMIN_PREFIX + COUPON_SIZE_PREFIX + "/" + categoryId)
// }

// export const updateProductSize = async (
//   body: CouponCreateRequest
// ): Promise<AxiosResponse> => {
//   return await authAxiosInstance.put(
//     COUPON_ADMIN_PREFIX + COUPON_SIZE_PREFIX,
//     body
//   )
// }
