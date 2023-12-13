import { authAxiosInstance } from "@/apis/utils"
import type { AxiosResponse } from "axios"
import type { CouponCreateRequest, CouponUpdateRequest, CouponInfoPageResponse, couponInfoReadItemResponse, ReadProductResponse,
  ReadProductSliceResponse, ReadChildrenCategoryListResponse, ReadChildrenCategoryResponse
} from "@/apis/coupon/CouponDto"

const COUPON_ADMIN_PREFIX: string = "/admin"
const COUPON_PREFIX: string = "/coupons"

export const createCouponInfo = async (body: CouponCreateRequest): Promise<AxiosResponse> => {
  return await authAxiosInstance.post(COUPON_ADMIN_PREFIX + COUPON_PREFIX, body)
}

export const updateCouponInfo = async (couponInfoId:number | undefined, body: CouponUpdateRequest): Promise<AxiosResponse> => {
  return await authAxiosInstance.patch(COUPON_ADMIN_PREFIX + COUPON_PREFIX + `/${couponInfoId}`, body)
}

export const getCouponInfoPage = async (size?: number, page?: number): Promise<CouponInfoPageResponse> => {
  let queryParams: string[] = [];
  if (size != null) {
    queryParams.push(`size=${size}`);
  }
  if (page != null) {
    queryParams.push(`page=${page}`);
  }

  let url = COUPON_ADMIN_PREFIX + COUPON_PREFIX;
  // let url = "https://3e2ab8db-c068-4228-aaef-d4f0848542bc.mock.pstmn.io/admin" + COUPON_ADMIN_PREFIX + COUPON_PREFIX;
  if (queryParams.length > 0) {
    url += `?${queryParams.join('&')}`;
  }
  try {
    const response = await authAxiosInstance(url);
    return response.data as CouponInfoPageResponse; // typecast
  } catch (err) {
    console.error("Error fetching couponInfo:", err);
    throw err;
  }
};


export const searchProducts = async (query: string): Promise<ReadProductResponse[]> => {
  try {
    if (query.trim() !== "") {
      const response = await authAxiosInstance.get<ReadProductSliceResponse>('/products/search', {
        params: { lastId: 0, query: query },
      });
      // 들어오는 hasNext는 사용하지 않을것임.
      return response.data.productResponses;
    } 
    return []; // If the query is empty, return an empty array
  } catch (error) {
    console.error("Failed to search products", error);
    throw error; // Rethrow error for caller to handle
  }
};

export const fetchCategories = async (): Promise<ReadChildrenCategoryResponse[]> => {
  try {
    const response = await authAxiosInstance.get("/admin/categories/leaf");
    return response.data.categoryResponses;
  } catch (error) {
    console.error("Failed to fetch categories", error);
    throw error; // Rethrow error for caller to handle
  }
};


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
