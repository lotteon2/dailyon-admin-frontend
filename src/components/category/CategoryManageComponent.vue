<script setup lang="ts">
import { onBeforeMount, ref } from "vue"
import type { ReadCategoryResponse } from "@/apis/category/dto/CategoryResponse"
import CategoryCreateModal from "@/components/category/CategoryCreateModal.vue"
import CategoryUpdateModal from "@/components/category/CategoryUpdateModal.vue"
import PaginationComponent from "@/components/PaginationComponent.vue"
import type { AxiosResponse } from "axios"
import { getAllCategories } from "@/apis/category/CategoryClient"
import { useCategoryStore } from "@/stores/CategoryStore"

const categoryStore = useCategoryStore()

const initData = () => {
  getAllCategories()
    .then((response: AxiosResponse) => {
      categoryStore.setCategories(response)
    })
    .catch((error: any) => {
      alert(error.response.data.message)
    })
}

onBeforeMount(initData)

const isCreateModalVisible = ref(false)
const isUpdateModalVisible = ref(false)

const selectedIndex = ref(0)
const selectedId = ref(0)
const selectedName = ref("")
const selectedMasterName = ref("")

const openUpdateModal = (id: number, name: string, masterName: string | null, index: number) => {
  isUpdateModalVisible.value = true
  selectedId.value = id
  selectedName.value = name
  selectedMasterName.value = masterName ?? "-"
  selectedIndex.value = index
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
</script>
<template>
  <div class="category-container">
    <CategoryCreateModal
      :show-modal="isCreateModalVisible"
      @close-create-modal="closeCreateModal"
    />
    <CategoryUpdateModal
      :show-modal="isUpdateModalVisible"
      :master-category-name="selectedMasterName"
      :category-id="selectedId"
      :category-name="selectedName"
      :index="selectedIndex"
      @close-update-modal="closeUpdateModal"
    />
    <div class="button-block">
      <button class="createBtn" @click="openCreateModal">카테고리 등록</button>
    </div>
    <div class="table-block">
      <table>
        <thead>
          <tr>
            <th>카테고리 id</th>
            <th>상위 카테고리 이름</th>
            <th>카테고리 이름</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(category, index) in categoryStore.categories" :key="index">
            <td>{{ category.id }}</td>
            <td>{{ category.masterCategoryName === null ? "-" : category.masterCategoryName }}</td>
            <td>{{ category.name }}</td>
            <td>
              <button
                class="updateBtn"
                @click="
                  openUpdateModal(category.id, category.name, category.masterCategoryName, index)
                "
              >
                수정
              </button>
              <button class="deleteBtn" @click="">삭제</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <PaginationComponent />
  </div>
</template>

<style scoped>
@import url("@/assets/css/category-manage.css");
</style>
