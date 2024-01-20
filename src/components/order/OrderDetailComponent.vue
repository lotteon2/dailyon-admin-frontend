<script setup lang="ts">
import { ref, onBeforeMount, defineEmits, watch } from "vue"
import { storeToRefs } from "pinia"
import { getOrderDetails, cancelOrderDetail } from "@/apis/order/OrderClient"
import { message } from "ant-design-vue"
import type { OrderDetailResponse } from "@/apis/order/OrderDto"
const emits = defineEmits(["close"])
const orderDetails = ref<Array<OrderDetailResponse>>([])
const VITE_STATIC_IMG_URL = ref<string>(import.meta.env.VITE_STATIC_IMG_URL)
const props = defineProps({
  orderNo: {
    type: String,
    required: true
  }
})

onBeforeMount(() => {
  initData(props.orderNo)
})

const initData = async (orderNo: string) => {
  const data = await getOrderDetails(orderNo)
  orderDetails.value = data
}

const cancel = async (orderDetail: OrderDetailResponse) => {
  if (confirm("취소하시겠습니까?")) {
    await cancelOrderDetail(orderDetail.orderDetailNo)
    orderDetail.status = "취소완료"
    alert("취소 되었습니다.")
    return
  }
}

watch(
  () => props.orderNo,
  (newVal, oldVal) => {
    initData(newVal)
  }
)
</script>
<template v-if="orderDetails.length">
  <div v-for="(orderDetail, index) in orderDetails" :key="index" class="order-detail-container">
    <div class="left-section">
      <div class="left-inner-status">
        <div class="product-status bold-text">{{ orderDetail.status }}</div>
      </div>
      <div class="left-inner-contents">
        <div class="product-thumbnail">
          <img class="image" :src="`${VITE_STATIC_IMG_URL}${orderDetail.thumbnail}`" />
        </div>
        <div class="text-contents">
          <div class="product-name">상품명 : {{ orderDetail.productName }}</div>
          <div class="product-price">
            가격 : {{ new Intl.NumberFormat("ko-KR").format(orderDetail.orderPrice) }}원
            <span class="gray-text mid-bar">|</span>
            {{ orderDetail.productQuantity }}개
          </div>
          <div>쿠폰이름 : {{ orderDetail.couponName }}</div>
          <div>쿠폰 적용 금액 : {{ orderDetail.couponDiscountPrice }}</div>
        </div>
      </div>
      <div class="left-inner-empty"></div>
    </div>
    <div class="right-section">
      <div v-if="orderDetail.status !== '취소완료'">
        <div class="right-section-buttons">
          <div class="right-inner-button">
            <button class="white-button" @click="cancel(orderDetail)">주문 취소</button>
          </div>
        </div>
      </div>
      <div v-if="orderDetail.status == '취소완료'">
        <div class="right-section-buttons">
          <div class="right-inner-button">
            <button class="gray-cancel-button" disabled>
              {{ orderDetail.status }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("@/assets/css/order-detail.css");
</style>
