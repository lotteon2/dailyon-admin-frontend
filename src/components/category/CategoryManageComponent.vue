<script setup lang="ts">
import { ref } from "vue"
import type { ReadCategoryResponse } from "@/apis/category/dto/CategoryResponse"
import CategoryCreateModal from "@/components/category/CategoryCreateModal.vue"
import CategoryUpdateModal from "@/components/category/CategoryUpdateModal.vue"
import PaginationComponent from "@/components/PaginationComponent.vue"

// const categories = ref<Array<ReadCategoryResponse>>([])

// masterCategoryId 없어도 될 것 같은데?
const categories = ref<Array<ReadCategoryResponse>>([
  {
    id: 1,
    name: "상의",
    masterId: null,
    masterName: null
  },
  {
    id: 2,
    name: "아우터",
    masterId: 1,
    masterName: "상의"
  },
  {
    id: 3,
    name: "코트",
    masterId: 1,
    masterName: "상의"
  },
  {
    id: 4,
    name: "패딩",
    masterId: 1,
    masterName: "상의"
  }
])

const isCreateModalVisible = ref(false)
const isUpdateModalVisible = ref(false)

const selectedIndex = ref(0)
const selectedId = ref(0)
const selectedName = ref("")
const selectedMasterName = ref("")

const openUpdateModal = (id: number, name: string, masterName: string, index: number) => {
  isUpdateModalVisible.value = true
  selectedId.value = id
  selectedName.value = name
  selectedMasterName.value = masterName
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

const createCategory = (data: ReadCategoryResponse) => {
  categories!.value.push(data)
  isCreateModalVisible.value = false
}

const updateCategory = (data: { index: number; name: string }) => {
  categories!.value[data.index].name = data.name
  isUpdateModalVisible.value = false
}
</script>
<template>
  <div class="category-container">
    <CategoryCreateModal
      :show-modal="isCreateModalVisible"
      @create-category="createCategory"
      @close-create-modal="closeCreateModal"
    />
    <CategoryUpdateModal
      :show-modal="isUpdateModalVisible"
      :master-category-name="selectedMasterName"
      :category-id="selectedId"
      :category-name="selectedName"
      :index="selectedIndex"
      @update-category="updateCategory"
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
          <tr v-for="(category, index) in categories" :key="index">
            <td>{{ category.id }}</td>
            <td>{{ category.masterName }}</td>
            <td>{{ category.name }}</td>
            <td>
              <button
                class="updateBtn"
                @click="openUpdateModal(category.id, category.name, category.masterName, index)"
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
