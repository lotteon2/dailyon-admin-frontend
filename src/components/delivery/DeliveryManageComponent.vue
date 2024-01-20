<script setup lang="ts">
import type { AxiosResponse } from "axios"
import PaginationComponent from "@/components/PaginationComponent.vue"
import { getDeliveries } from "@/apis/delivery/DeliveryClient"
import { onBeforeMount, ref, watch } from "vue"
import type {
  OrderDeliveryResponse,
  OrderDeliveryPageResponse,
  DevlieryStatusEnum
} from "@/apis/delivery/DeliveryDto"
import { Modal, Descriptions, DescriptionsItem, Button } from "ant-design-vue"
const pageSize: number = 8
const VITE_STATIC_IMG_URL = ref<string>(import.meta.env.VITE_STATIC_IMG_URL)
const deliveries = ref<Array<OrderDeliveryResponse>>([])

const requestPage = ref<number>(0)
const totalPages = ref<number>(0)
const totalElements = ref<number>(0)
const defaultStatus = ref<DevlieryStatusEnum>({
  type: null,
  name: "전체보기"
})
const fetchDefaultData = async (
  requestPage: number,
  size: number,
  status: string | null
): Promise<void> => {
  const data = await getDeliveries(requestPage, size, status)
  deliveries.value = data.deliveries
  totalElements.value = data.totalElements
  totalPages.value = data.totalPages
}

const statusOption = ref<DevlieryStatusEnum[]>([
  { type: null, name: "전체보기" },
  { type: "BEFORE_DELIVERY", name: "배송전" },
  { type: "DELIVERY_PREPARE", name: "배송준비중" },
  { type: "DELIVERING", name: "배송중" },
  { type: "COMPLETE_DELIVERY", name: "배송완료" }
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
    fetchDefaultData(requestPage.value, pageSize, defaultStatus.value.type), requestPage.value
  }
})

watch(defaultStatus.value, (newType, oldType) => {
  requestPage.value = 0
  fetchDefaultData(0, pageSize, newType.type)
})

const selectedDelivery = ref()
const open = ref<boolean>(false)

const showModal = (delivery: OrderDeliveryResponse) => {
  selectedDelivery.value = delivery
  open.value = true
}

const handleOk = (e: MouseEvent) => {
  selectedDelivery.value = undefined
  open.value = false
}
</script>

<template>
  <div class="product-container">
    <div class="head-block">
      <div>
        <select class="select-block-select" v-model="defaultStatus.type">
          <option v-for="(type, index) in statusOption" :key="index" :value="type.type">
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
            <th>회원아이디</th>
            <th>상품명</th>
            <th>우편번호</th>
            <th>도로명주소</th>
            <th>상세주소</th>
            <th>휴대폰번호</th>
            <th>배송상태</th>
            <th>배송등록일</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(delivery, index) in deliveries" :key="index">
            <td>{{ delivery.orderNo }}</td>
            <td>{{ delivery.memberId }}</td>
            <td>{{ delivery.productsName }}</td>
            <td>{{ delivery.postCode }}</td>
            <td>{{ delivery.roadAddress }}</td>
            <td>{{ delivery.detailAddress }}</td>
            <td>{{ delivery.phoneNumber }}</td>
            <td>{{ delivery.status }}</td>
            <td>{{ delivery.createdAt }}</td>
            <td>
              <button class="updateBtn" @click="showModal(delivery)">변경</button>
            </td>
          </tr>
        </tbody>
      </table>
      <Modal v-model:open="open" width="1000px">
        <template #footer>
          <button class="ok-button" @click="handleOk">확인</button>
        </template>
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
