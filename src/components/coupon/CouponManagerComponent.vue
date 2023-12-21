<script setup lang="ts">
import type { AxiosResponse } from "axios"
import { onBeforeMount, ref, watch } from "vue"
// import ProductSizeCreateModal from "@/components/productsize/ProductSizeCreateModal.vue"
// import ProductSizeUpdateModal from "@/components/productsize/ProductSizeUpdateModal.vue"
import CouponCreateModal from "@/components/coupon/CouponCreateModal.vue"
import CouponUpdateModal from "@/components/coupon/CouponUpdateModal.vue"
import ConfirmDialogModal from "@/components/common/ConfirmDialogueModal.vue"
import PaginationComponent from "@/components/PaginationComponent.vue"
import {
  getCouponInfoPage,
  deleteCouponInfo,
  invalidateCouponInfo
} from "@/apis/coupon/CouponClient"
import type {
  CouponCreateRequest,
  CouponUpdateRequest,
  couponInfoReadItemResponse,
  CouponInfoPageResponse
} from "@/apis/coupon/CouponDto"
import { getDiscountTypeDisplayValue, formatDiscountValue } from "@/apis/coupon/CouponDto"

const VITE_STATIC_IMG_URL = ref<string>(import.meta.env.VITE_STATIC_IMG_URL)

let size = ref<number>(10)
let page = ref<number>(0)
let list = ref<couponInfoReadItemResponse[]>([])
let totalPages = ref<number>()
const isCreateModalVisible = ref(false)
const isUpdateModalVisible = ref(false)

const selectedCoupon = ref<couponInfoReadItemResponse | null>(null)
const openUpdateModal = (coupon: couponInfoReadItemResponse) => {
  selectedCoupon.value = coupon
  isUpdateModalVisible.value = true
}

const initData = async () => {
  try {
    const data = await getCouponInfoPage(size.value, page.value)
    list.value = data.couponInfoReadItemResponseList
    totalPages.value = Math.ceil(data.totalCounts ? data.totalCounts / size.value : 1)
  } catch (err) {
    console.error(err)
  }
}
onBeforeMount(initData)
// watch(() => categoryId.value, setProductSizeByCategory)
// watch(categoryId, setProductSizeByCategory)

const isCouponStartInFuture = (startAt: string): boolean => {
  const now = new Date()
  const startTime = new Date(startAt)
  return startTime < now
}

const closeCreateModal = () => {
  isCreateModalVisible.value = false
}

const closeUpdateModal = () => {
  isUpdateModalVisible.value = false
}

const formatName = (name: string) => {
  // Replace square brackets with <br/> tags
  return name.replace(/\]/g, "]<br/>")
}

const formatDate = (localDateTime: string) => {
  // Assuming localDateTime is in ISO string format, adjust as necessary
  return localDateTime.replace(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}).*$/,
    "$1년 $2월 $3일 $4:$5"
  )
}

const optionalValue = (value: number | undefined | null) => {
  return value ? value.toLocaleString("ko-KR") : "-"
}

// confirm 모달 관련
const isConfirmDialogVisible = ref(false)
const confirmModalTitle = ref("")
const confirmModalMessage = ref("")
const confirmMessage = ref("")
const cancelMessage = ref("")
const couponInfoIdToActOn = ref(0)

const onDeleteClick = async (couponInfoId: number) => {
  console.log("onDeleteClick 발동")

  couponInfoIdToActOn.value = couponInfoId
  confirmModalTitle.value = "쿠폰 이벤트 삭제하기"
  confirmModalMessage.value = "정말로 삭제하시겠습니까?"
  confirmMessage.value = "예"
  cancelMessage.value = "아니오"
  isConfirmDialogVisible.value = true
}

const onInvalidateClick = async (couponInfoId: number) => {
  console.log("onInvalidateClick 발동")

  couponInfoIdToActOn.value = couponInfoId
  confirmModalTitle.value = "쿠폰 이벤트 종료하기"
  confirmModalMessage.value = "정말로 종료하시겠습니까?"
  confirmMessage.value = "예"
  cancelMessage.value = "아니오"
  isConfirmDialogVisible.value = true
}

const onConfirmAction = async () => {
  console.log("onConfirmAction 발동")
  if (confirmModalTitle.value === "쿠폰 이벤트 삭제하기") {
    try {
      const response = await deleteCouponInfo(couponInfoIdToActOn.value)
      if (response.status === 204) {
        alert("쿠폰이 삭제되었습니다.")
        isConfirmDialogVisible.value = false
      }
    } catch (err) {
      alert("쿠폰 삭제요청 중 에러 발생.")
      console.log(err)
      throw err
    }
  } else if (confirmModalTitle.value === "쿠폰 이벤트 종료하기") {
    try {
      const response = await invalidateCouponInfo(couponInfoIdToActOn.value)
      if (response.status === 200) {
        alert("쿠폰 이벤트가 종료되었습니다. 기존 발급 쿠폰은 삭제되지 않습니다.")
        isConfirmDialogVisible.value = false
      }
    } catch (err) {
      alert("쿠폰 이벤트 종료요청 중 에러 발생.")
      console.log(err)
      throw err
    }
  }
  // TODO: After the API call, you may want to refresh your data or indicate success to the user
}

const onCancelAction = () => {
  // TODO: Simply close the dialog here, or you could also reset couponInfoIdToActOn if needed
  isConfirmDialogVisible.value = false
}
</script>

<template>
  <div class="product-size-container">
    <CouponCreateModal :show-modal="isCreateModalVisible" @close-create-modal="closeCreateModal" />
    <CouponUpdateModal
      :show-modal="isUpdateModalVisible"
      :couponInfoId="selectedCoupon ? selectedCoupon.id : undefined"
      :coupon="selectedCoupon"
      @close-update-modal="closeUpdateModal"
    />
    <ConfirmDialogModal
      :title="confirmModalTitle"
      :message="confirmModalMessage"
      :confirmMessage="confirmMessage"
      :cancelMessage="cancelMessage"
      :isVisible="isConfirmDialogVisible"
      @modal-dialogue-confirm="onConfirmAction"
      @modal-dialogue-cancel="onCancelAction"
    />

    <div class="head-block">
      <!-- <select class="category-select" v-model.lazy.number="categoryId">
        <option v-for="category in categoryStore.categories" :value="category.id">
          {{ category.name }}
        </option>
      </select> -->
      <button class="createBtn" @click="isCreateModalVisible = true">쿠폰 등록</button>
    </div>

    <div class="table-block">
      <table>
        <thead>
          <tr>
            <th>쿠폰 번호</th>
            <th>쿠폰 이름</th>
            <th>할인 타입/값</th>
            <th>이벤트 시작/종료일시</th>
            <th>잔여수량/총 발행개수</th>
            <th>적용 대상</th>
            <th>동시성 체크</th>
            <th>할인대상 이미지</th>
            <th>조건</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(adminCouponInfo, index) in list" :key="index">
            <td>{{ adminCouponInfo.id }}</td>
            <td v-html="formatName(adminCouponInfo.name)"></td>
            <!-- br을 넣기 위해 v-html 사용 -->
            <td>
              {{ getDiscountTypeDisplayValue(adminCouponInfo.discountType) }}/{{
                formatDiscountValue(adminCouponInfo.discountType, adminCouponInfo.discountValue)
              }}
            </td>
            <td>
              {{ formatDate(adminCouponInfo.startAt) }} <br />~
              {{ formatDate(adminCouponInfo.endAt) }}
            </td>
            <!-- LocalDateTime으로 들어오는값을 0000년 00월 00일 00:00 형식으로 -->
            <td>{{ adminCouponInfo.remainingQuantity }}/{{ adminCouponInfo.issuedQuantity }}</td>
            <td>
              {{ adminCouponInfo.appliesToType }}/{{ adminCouponInfo.appliesToId }}<br />
              {{ adminCouponInfo.appliesToName }}
            </td>
            <td>{{ adminCouponInfo.requiresConcurrencyControl }}</td>
            <td>
              <img
                :src="`${VITE_STATIC_IMG_URL}${adminCouponInfo.targetImgUrl}` || ''"
                alt="이미지 없음"
              />
            </td>
            <td>
              {{
                optionalValue(adminCouponInfo.minPurchaseAmount) !== "-"
                  ? `최소 구매금액 ${optionalValue(adminCouponInfo.minPurchaseAmount)}원`
                  : "-"
              }}
              <br />
              {{
                optionalValue(adminCouponInfo.maxDiscountAmount) !== "-"
                  ? `최대 할인금액 ${optionalValue(adminCouponInfo.maxDiscountAmount)}원`
                  : "-"
              }}
            </td>
            <td>
              <button class="updateBtn" @click="openUpdateModal(adminCouponInfo)">수정</button>
              <button
                v-if="isCouponStartInFuture(adminCouponInfo.startAt)"
                @click="onInvalidateClick(adminCouponInfo.id)"
                class="terminateBtn"
              >
                종료
              </button>
              <button v-else @click="onDeleteClick(adminCouponInfo.id)" class="deleteBtn">
                삭제
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <PaginationComponent />
  </div>
</template>

<style scoped>
@import url("@/assets/css/coupon-manage.css");
</style>
