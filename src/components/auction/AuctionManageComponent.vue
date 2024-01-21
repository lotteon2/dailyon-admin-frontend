<script setup lang="ts">
import PaginationComponent from "@/components/PaginationComponent.vue"
import { onBeforeMount, ref, watch } from "vue"
import { deleteAuction, readAuctions } from "@/apis/auction/AuctionClient"
import type {
  AuctionFilterEnum,
  ReadAuctionPageResponse,
  ReadAuctionResponse
} from "@/apis/auction/AuctionDto"
import AuctionCreateModal from "@/components/auction/AuctionCreateModal.vue"
import AuctionModal from "@/components/auction/AuctionManageModal.vue"
import WhitePageComponent from "@/components/WhitePageComponent.vue"

const requestSize: number = 5
const requestPage = ref<number>(0)
const totalPages = ref<number>(0)
const totalElements = ref<number>(0)
const auctions = ref<ReadAuctionResponse[]>([
  {
    id: "",
    auctionProductId: 0,
    auctionName: "",
    maximumWinner: 0,
    startBidPrice: 0,
    askingPrice: 0,
    startAt: "",
    started: false,
    ended: false
  }
])
const isCreateModalVisible = ref<boolean>(false)
const isManageModalVisible = ref<boolean>(false)
const selectedAuctionId = ref<string>("")

const auctionTypes = ref<AuctionFilterEnum[]>([
  { value: "/admin/auctions", name: "전체" },
  { value: "/auctions/current", name: "진행 중" },
  { value: "/auctions/future", name: "진행 예정" },
  { value: "/auctions/past", name: "진행 완료" }
])
const selectedAuctionType = ref<string>("/admin/auctions")

const openManageModal = (auctionId: string) => {
  isManageModalVisible.value = true
  selectedAuctionId.value = auctionId
}

const closeManageModal = () => {
  isManageModalVisible.value = false
}

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
  const response: ReadAuctionPageResponse = await readAuctions(
    requestPage.value,
    requestSize,
    selectedAuctionType.value
  )
  totalElements.value = response.totalElements
  totalPages.value = response.totalPages
  auctions.value = response.responses
}

const closeCreateModal = () => {
  isCreateModalVisible.value = false
}

const afterCreate = () => {
  isCreateModalVisible.value = false
  initData()
}

const executeDelete = (index: number, event: any) => {
  event.stopPropagation()

  if (confirm("삭제하시겠습니까?")) {
    deleteAuction(auctions.value[index].id)
      .then(async () => {
        alert("삭제 완료")
        requestPage.value = 0
        await initData()
      })
      .catch((error: any) => {
        alert(error.response!.data!.message)
      })
  }
}

watch(requestPage, async (afterPage: number, beforePage: number) => {
  if (afterPage < totalPages.value) {
    const response: ReadAuctionPageResponse = await readAuctions(
      afterPage,
      requestSize,
      selectedAuctionType.value
    )

    totalElements.value = response.totalElements
    totalPages.value = response.totalPages
    auctions.value = response.responses
  }
})

watch(selectedAuctionType, async (afterType: string, beforeType: string) => {
  if (afterType !== beforeType) {
    const response: ReadAuctionPageResponse = await readAuctions(
      requestPage.value,
      requestSize,
      afterType
    )

    totalElements.value = response.totalElements
    totalPages.value = response.totalPages
    auctions.value = response.responses
  }
})

onBeforeMount(initData)
</script>

<template>
  <div class="auction-container">
    <AuctionModal
      :auction-id="selectedAuctionId"
      :show-modal="isManageModalVisible"
      @close-manage-modal="closeManageModal"
    />
    <AuctionCreateModal
      :show-modal="isCreateModalVisible"
      @close-create-modal="closeCreateModal"
      @create-success="afterCreate"
    />
    <div class="button-block">
      <select class="select-block-select" v-model.lazy.number="selectedAuctionType">
        <option
          v-for="(auctionType, index) in auctionTypes"
          :key="index"
          :value="auctionType.value"
        >
          {{ auctionType.name }}
        </option>
      </select>
      <button class="createBtn" @click="openCreateModal">경매 등록</button>
    </div>
    <div class="table-block" v-if="auctions.length > 0">
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
          <tr
            v-for="(auction, index) in auctions"
            @click="openManageModal(auction.id)"
            :key="index"
          >
            <td>{{ auction.auctionName }}</td>
            <td>{{ auction.startBidPrice.toLocaleString() }}원</td>
            <td>{{ auction.maximumWinner }}명</td>
            <td>{{ formatDate(auction.startAt) }}</td>
            <td>
              <button
                class="deleteBtn"
                v-if="!auction.started"
                @click="executeDelete(index, $event)"
              >
                삭제
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="table-block" v-else>
      <WhitePageComponent message="경매가 존재하지 않습니다" />
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
