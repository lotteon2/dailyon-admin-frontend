import { authAxiosInstance } from "@/apis/utils"
import type { AxiosResponse } from "axios"
import type { CouponCreateRequest, CouponInfo, CouponInfoPageResponse
} from "@/apis/coupon/CouponDto"

const COUPON_ADMIN_PREFIX: string = "/admin"
const COUPON_PREFIX: string = "/coupons"

export const createCouponInfo = async (body: CouponCreateRequest): Promise<AxiosResponse> => {
  return await authAxiosInstance.post(COUPON_ADMIN_PREFIX + COUPON_PREFIX, body)
}

export const updateCouponInfo = async (couponInfoId:number, body: CouponUpdateRequest): Promise<AxiosResponse> => {
  return await authAxiosInstance.patch(COUPON_ADMIN_PREFIX + COUPON_PREFIX + `/${couponInfoId}`, body)
}

export const getCouponInfoPage = async (size?: number, page?: number): Promise<CouponPageResponse> => {
  let queryParams: string[] = [];
  if (size != null) {
    queryParams.push(`size=${size}`);
  }
  if (page != null) {
    queryParams.push(`page=${page}`);
  }

  let url = COUPON_ADMIN_PREFIX + COUPON_PREFIX;
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
