<script setup lang="ts">
import PaginationComponent from "@/components/PaginationComponent.vue"
import { onBeforeMount, ref, watch } from "vue"
import { readAuctions } from "@/apis/auction/AuctionClient"
import type { ReadAuctionPageResponse, ReadAuctionResponse } from "@/apis/auction/AuctionDto"
import AuctionCreateModal from "@/components/auction/AuctionCreateModal.vue"

const requestSize: number = 5
const requestPage = ref<number>(0)
const totalPages = ref<number>(0)
const totalElements = ref<number>(0)
const auctions = ref<ReadAuctionResponse[]>([
  {
    auctionName: "",
    auctionProductId: 0,
    ended: false,
    startAt: "",
    id: "",
    maximumWinner: 0,
    startBidPrice: 0,
    started: false
  }
])
const isCreateModalVisible = ref<boolean>(false)

const openCreateModal = () => {
  isCreateModalVisible.value = true
}

const formatDate = (localDateTime: string) => {
  // Assuming localDateTime is in ISO string format, adjust as necessary
  return localDateTime.replace(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}).*$/,
    "$1년 $2월 $3일 $4:$5"
  )
}

const onChangePage = async (page: number) => {
  if (0 <= page && page < totalPages.value) {
    requestPage.value = page
  }
}

const initData = async () => {
  const response: ReadAuctionPageResponse = await readAuctions(requestPage.value, requestSize)
  totalElements.value = response.totalElements
  totalPages.value = response.totalPages
  auctions.value = response.responses
}

const closeCreateModal = () => {
  isCreateModalVisible.value = false
}

const afterCreate = async () => {
  isCreateModalVisible.value = false
  await initData()
}

watch(requestPage, async (afterPage: number, beforePage: number) => {
  if (afterPage < totalPages.value) {
    const response: ReadAuctionPageResponse = await readAuctions(afterPage, requestSize)

    totalElements.value = response.totalElements
    totalPages.value = response.totalPages
    auctions.value = response.responses
  }
})

onBeforeMount(initData)
</script>

<template>
  <div class="auction-container">
    <AuctionCreateModal
      :show-modal="isCreateModalVisible"
      @close-create-modal="closeCreateModal"
      @create-success="afterCreate"
    />
    <div class="button-block">
      <button class="createBtn" @click="openCreateModal">경매 등록</button>
    </div>
    <div class="table-block">
      <table>
        <thead>
          <tr>
            <th>경매 이름</th>
            <th>입찰 시작가</th>
            <th>최대 낙찰자</th>
            <th>경매 시작 시각</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(auction, index) in auctions" :key="index">
            <td>{{ auction.auctionName }}</td>
            <td>{{ auction.startBidPrice.toLocaleString() }}원</td>
            <td>{{ auction.maximumWinner }}명</td>
            <td>{{ formatDate(auction.startAt) }}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
    <PaginationComponent
      :on-change-page="onChangePage"
      :request-page="requestPage"
      :total-pages="totalPages"
    />
  </div>
</template>

<style scoped>
@import url("@/assets/css/auction-manage.css");
</style>
