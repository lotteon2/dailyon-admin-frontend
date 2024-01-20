<script setup lang="ts">
import { onBeforeMount, ref, watch } from "vue"
import CategoryCreateModal from "@/components/category/CategoryCreateModal.vue"
import CategoryUpdateModal from "@/components/category/CategoryUpdateModal.vue"
import PaginationComponent from "@/components/PaginationComponent.vue"
import type { AxiosResponse } from "axios"
import { deleteCategory, getCategoryPages } from "@/apis/category/CategoryClient"
import { useCategoryStore } from "@/stores/CategoryStore"
import type { ReadCategoryPageResponse } from "@/apis/category/CategoryDto"
import WhitePageComponent from "@/components/WhitePageComponent.vue"

const categoryStore = useCategoryStore()

const requestSize: number = 10

const requestPage = ref<number>(0)
const totalPages = ref<number>(0)
const totalElements = ref<number>(0)

const isCreateModalVisible = ref(false)
const isUpdateModalVisible = ref(false)

const selectedIndex = ref(0)
const selectedId = ref(0)
const selectedName = ref("")
const selectedMasterName = ref("")

const onChangePage = async (page: number) => {
  if (0 <= page && page < totalPages.value) {
    requestPage.value = page
  }
}

const initData = () => {
  getCategoryPages(requestPage.value, requestSize)
    .then((axiosResponse: AxiosResponse) => {
      const response: ReadCategoryPageResponse = axiosResponse.data
      categoryStore.setCategories(response.responses)
      totalPages.value = response.totalPages
      totalElements.value = response.totalElements
    })
    .catch((error: any) => {
      alert(error.response.data.message)
    })
}

onBeforeMount(initData)

watch(requestPage, async (afterPage: number, beforePage: number) => {
  if (afterPage < totalPages.value) {
    getCategoryPages(afterPage, requestSize)
      .then((axiosResponse: AxiosResponse) => {
        const response: ReadCategoryPageResponse = axiosResponse.data
        categoryStore.setCategories(response.responses)
        totalPages.value = response.totalPages
        totalElements.value = response.totalElements
      })
      .catch((error: any) => {
        alert(error.response!.data!.message)
      })
  }
})

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

const executeUpdate = () => {
  getCategoryPages(requestPage.value, requestSize)
    .then((axiosResponse: AxiosResponse) => {
      const response: ReadCategoryPageResponse = axiosResponse.data
      categoryStore.setCategories(response.responses)
      totalPages.value = response.totalPages
      totalElements.value = response.totalElements
    })
    .catch((error: any) => {
      alert(error.response.data.message)
    })
}

const executeDelete = (categoryId: number) => {
  if (confirm("삭제하시겠습니까?")) {
    deleteCategory(categoryId)
      .then(() => {
        alert("삭제 성공")
        initData()
      })
      .catch((error: any) => {
        alert(error.response!.data!.message)
      })
  }
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
      @update-category="executeUpdate"
    />
    <div class="button-block">
      <button class="createBtn" @click="openCreateModal">카테고리 등록</button>
    </div>
    <div class="table-block" v-if="categoryStore.categories.length > 0">
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
              <button class="deleteBtn" @click="executeDelete(category.id)">삭제</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="table-block" v-else>
      <WhitePageComponent message="카테고리가 존재하지 않습니다" />
    </div>
    <PaginationComponent
      :request-page="requestPage"
      :total-pages="totalPages"
      :on-change-page="onChangePage"
    />
  </div>
</template>

<style scoped>
@import url("@/assets/css/category-manage.css");
</style>
