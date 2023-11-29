<script setup lang="ts">
import { ref } from "vue"
import PaginationComponent from "@/components/PaginationComponent.vue"
import BrandUpdateModal from "@/components/BrandUpdateModal.vue"
import BrandCreateModal from "@/components/BrandCreateModal.vue"

let exampleBrands = [
  { brandId: 1, name: "brand1" },
  { brandId: 2, name: "brand2" },
  { brandId: 3, name: "brand3" },
  { brandId: 4, name: "brand4" },
  { brandId: 5, name: "brand5" }
]

const isCreateModalVisible = ref(false)
const isUpdateModalVisible = ref(false)
const selectedBrandId = ref()
const selectedBrandName = ref()

const openUpdateModal = (brandId: Number, brandName: String) => {
  isUpdateModalVisible.value = true
  selectedBrandId.value = brandId
  selectedBrandName.value = brandName
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

const createBrand = (data: any) => {
  alert(`created id: ${data.id}, name: ${data.name}`)
}

const updateBrand = (data: any) => {
  alert(`updated id: ${data.id}, name: ${data.name}`)
}

const deleteButton = (brandId: Number) => {
  /* TODO
   axios.delete해서 200이라면 목록에서 해당 id 삭제.
   */
  alert(`deleted ${brandId}`)
}
</script>

<template>
  <div class="container">
    <BrandUpdateModal
      :brand-id="selectedBrandId"
      :brand-name="selectedBrandName"
      :show-modal="isUpdateModalVisible"
      @update-brand="updateBrand"
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
          <tr v-for="brand in exampleBrands" :key="brand.brandId">
            <td>{{ brand.brandId }}</td>
            <td>{{ brand.name }}</td>
            <td>
              <button class="updateBtn" @click="openUpdateModal(brand.brandId, brand.name)">
                수정
              </button>
              <button class="deleteBtn" @click="deleteButton(brand.brandId)">삭제</button>
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
