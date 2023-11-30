<script setup lang="ts">
import { onBeforeMount, ref } from "vue"
import PaginationComponent from "@/components/PaginationComponent.vue"
import BrandUpdateModal from "@/components/brand/BrandUpdateModal.vue"
import BrandCreateModal from "@/components/brand/BrandCreateModal.vue"
import type { AxiosError, AxiosResponse } from "axios"
import { deleteBrand, getAllBrands } from "@/apis/brand/BrandClient"
import type { ReadBrandResponse } from "@/apis/brand/dto/BrandResponse"

const initData = async () => {
  getAllBrands()
    .then((response: AxiosResponse) => {
      brands.value = response.data.brandResponses
    })
    .catch((error: AxiosError) => {
      alert(error.response!.data!.message)
    })
}

onBeforeMount(initData)

const brands = ref<Array<ReadBrandResponse>>([])
const isCreateModalVisible = ref(false)
const isUpdateModalVisible = ref(false)
const selectedBrandId = ref()
const selectedBrandName = ref()
const brandIndex = ref(0)

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
  brands!.value.push(data)
  isCreateModalVisible.value = false
}

const updateBrand = (data: { index: number; name: string }) => {
  brands!.value[data.index].name = data.name
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
    <PaginationComponent />
  </div>
</template>

<style scoped>
@import url("@/assets/css/brand-manage.css");
</style>
