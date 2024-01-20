<script setup lang="ts">
import type { AxiosResponse } from "axios"
import OrderDetailComponent from "./OrderDetailComponent.vue"
import PaginationComponent from "@/components/PaginationComponent.vue"
import { getOrders } from "@/apis/order/OrderClient"
import { onBeforeMount, ref, watch } from "vue"
import type { OrderResponse, OrderTypeEnum } from "@/apis/order/OrderDto"
import { Modal, Descriptions, DescriptionsItem, Button } from "ant-design-vue"
const pageSize: number = 8
const VITE_STATIC_IMG_URL = ref<string>(import.meta.env.VITE_STATIC_IMG_URL)
const orders = ref<Array<OrderResponse>>([])

const requestPage = ref<number>(0)
const totalPages = ref<number>(0)
const totalElements = ref<number>(0)
const defaultOption = ref<OrderTypeEnum>({
  type: null,
  name: "전체보기"
})
const fetchDefaultData = async (
  requestPage: number,
  size: number,
  type: string | null
): Promise<void> => {
  const data = await getOrders(requestPage, size, type)
  orders.value = data.orders
  totalElements.value = data.totalElements
  totalPages.value = data.totalPages
}

const types = ref<OrderTypeEnum[]>([
  { type: null, name: "전체보기" },
  { type: "SINGLE", name: "일반" },
  { type: "AUCTION", name: "경매" },
  { type: "GIFT", name: "선물" }
])

const onChangePage = (page: number) => {
  if (0 <= page && page < totalPages.value) {
    requestPage.value = page
  }
}

onBeforeMount(() => {
  fetchDefaultData(0, pageSize, null)
})

watch(requestPage, (afterPage, beforePage) => {
  if (afterPage < totalPages.value!) {
    fetchDefaultData(afterPage, pageSize, defaultOption.value.type), requestPage.value
  }
})

watch(defaultOption.value, (newType, oldType) => {
  requestPage.value = 0
  fetchDefaultData(0, pageSize, newType.type)
})
// modal
const selectedOrder = ref<OrderResponse>()
const open = ref<boolean>(false)

const showModal = (order: OrderResponse) => {
  selectedOrder.value = order
  open.value = true
}

const handleOk = (e: MouseEvent) => {
  selectedOrder.value = undefined
  open.value = false
}
</script>

<template>
  <div class="product-container">
    <div class="head-block">
      <div>
        <select class="select-block-select" v-model="defaultOption.type">
          <option v-for="(type, index) in types" :key="index" :value="type.type">
            {{ type.name }}
          </option>
        </select>
      </div>
    </div>
    <div class="table-block">
      <table>
        <thead>
          <tr>
            <th>주문번호</th>
            <th>주문유형</th>
            <th>회원아이디</th>
            <th>상품명</th>
            <th>결제금액</th>
            <th>주문상태</th>
            <th>결제일시</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(order, index) in orders" :key="index">
            <td>{{ order.orderNo }}</td>
            <td>{{ order.type }}</td>
            <td>{{ order.memberId }}</td>
            <td>
              {{ order.productsName }}
            </td>
            <td>{{ order.totalAmount.toLocaleString() }} 원</td>
            <td>{{ order.status }}</td>
            <td>{{ order.createdAt }}</td>
            <td>
              <button class="updateBtn" @click="showModal(order)">상세</button>
            </td>
          </tr>
        </tbody>
      </table>
      <Modal v-model:open="open" width="1000px">
        <template #footer>
          <button class="ok-button" @click="handleOk">확인</button>
        </template>
        <Descriptions
          title="주문 상세 내역"
          bordered
          :column="{ xxl: 3, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }"
        >
          <DescriptionsItem label="주문 상품이름">{{
            selectedOrder?.productsName
          }}</DescriptionsItem>
          <DescriptionsItem label="결제수단">카카오페이</DescriptionsItem>
          <DescriptionsItem label="주문시간">{{ selectedOrder?.createdAt }}</DescriptionsItem>
          <DescriptionsItem label="쿠폰 할인금액"
            >{{ selectedOrder?.totalCouponDiscountPrice.toLocaleString() }} 원</DescriptionsItem
          >
          <DescriptionsItem label="포인트 사용금액"
            >{{ selectedOrder?.usedPoints.toLocaleString() }} 원</DescriptionsItem
          >
          <DescriptionsItem label="결제 금액"
            >{{ selectedOrder?.totalAmount.toLocaleString() }} 원</DescriptionsItem
          >
          <DescriptionsItem label="">
            <div v-if="selectedOrder">
              <OrderDetailComponent :orderNo="selectedOrder.orderNo" @close="open = false" />
            </div>
          </DescriptionsItem>
        </Descriptions>
      </Modal>
    </div>
    <PaginationComponent
      :on-change-page="onChangePage"
      :request-page="requestPage"
      :total-pages="totalPages"
    />
  </div>
</template>

<style scoped>
@import url("@/assets/css/product-manage.css");
.ok-button {
  width: 50px;
  height: 30px;
  font-size: 12px;
  background-color: black;
}
</style>
