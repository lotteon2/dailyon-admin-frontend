<script setup lang="ts">
import { onBeforeMount, ref, watch } from "vue"
import PaginationComponent from "@/components/PaginationComponent.vue"
import BrandUpdateModal from "@/components/brand/BrandUpdateModal.vue"
import BrandCreateModal from "@/components/brand/BrandCreateModal.vue"
import type { AxiosResponse } from "axios"
import { getBrandPages } from "@/apis/brand/BrandClient"
import type {
  ReadBrandPageResponse,
  ReadBrandResponse,
  UpdateBrandDto
} from "@/apis/brand/BrandDto"

const initData = () => {
  getBrandPages(requestPage.value)
    .then((axiosResponse: AxiosResponse) => {
      const response: ReadBrandPageResponse = axiosResponse.data
      totalElements.value = response.totalElements
      totalPages.value = response.totalPages
      brands.value = response.brandResponses
    })
    .catch((error: any) => {
      alert(error.response!.data!.message)
    })
}

onBeforeMount(initData)

const requestPage = ref<number>(0)
const totalPages = ref<number>(0)
const totalElements = ref<number>(0)
const brands = ref<Array<ReadBrandResponse>>(new Array<ReadBrandResponse>())
const isCreateModalVisible = ref<boolean>(false)
const isUpdateModalVisible = ref<boolean>(false)
const selectedBrandId = ref<number>(0)
const selectedBrandName = ref<string>("")
const brandIndex = ref<number>(0)

const onChangePage = async (page: number) => {
  if (0 <= page && page < totalPages.value) {
    requestPage.value = page
  }
}

watch(requestPage, async (afterPage: number, beforePage: number) => {
  if (afterPage < totalPages.value) {
    getBrandPages(afterPage)
      .then((axiosResponse: AxiosResponse) => {
        const response: ReadBrandPageResponse = axiosResponse.data
        totalElements.value = response.totalElements
        totalPages.value = response.totalPages
        brands.value = response.brandResponses
      })
      .catch((error: any) => {
        alert(error.response!.data!.message)
      })
  }
})

const openUpdateModal = (brandId: number, brandName: string, index: number) => {
  isUpdateModalVisible.value = true
  selectedBrandId.value = brandId
  selectedBrandName.value = brandName
  brandIndex.value = index
}

const openCreateModal = () => {
  isCreateModalVisible.value = true
}

const closeUpdateModal = () => {
  isUpdateModalVisible.value = false
}

const closeCreateModal = () => {
  isCreateModalVisible.value = false
}

const createBrand = (data: ReadBrandResponse) => {
  brands.value.unshift(data)
  isCreateModalVisible.value = false
}

const updateBrand = (data: UpdateBrandDto) => {
  const objToMove: ReadBrandResponse = brands.value[data.index]
  objToMove.name = data.name

  brands.value.splice(data.index, 1)
  brands.value.unshift(objToMove)
  isUpdateModalVisible.value = false
}

const executeDelete = (brandId: number, index: number) => {
  if (confirm("삭제하시겠습니까?")) {
    /* TODO : delete api 개발
      deleteBrand(brandId)
      .then(() => {
        brands!.value.splice(index)
      })
      .catch((error: AxiosError) => {
        alert(error.response!.data!.message)
      })*/
  }
}
</script>

<template>
  <div class="brand-container">
    <BrandUpdateModal
      :brand-id="selectedBrandId"
      :brand-name="selectedBrandName"
      :show-modal="isUpdateModalVisible"
      :index="brandIndex"
      @update-brand="(data: any) => updateBrand(data)"
      @close-update-modal="closeUpdateModal"
    />
    <BrandCreateModal
      :show-modal="isCreateModalVisible"
      @create-brand="createBrand"
      @close-create-modal="closeCreateModal"
    />
    <div class="button-block">
      <button class="createBtn" @click="openCreateModal">브랜드 등록</button>
    </div>
    <div class="table-block">
      <table>
        <thead>
          <tr>
            <th>브랜드 id</th>
            <th>브랜드 이름</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(brand, index) in brands" :key="index">
            <td>{{ brand.id }}</td>
            <td>{{ brand.name }}</td>
            <td>
              <button class="updateBtn" @click="openUpdateModal(brand.id, brand.name, index)">
                수정
              </button>
              <button class="deleteBtn" @click="executeDelete(brand.id, index)">삭제</button>
            </td>
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
@import url("@/assets/css/brand-manage.css");
</style>
