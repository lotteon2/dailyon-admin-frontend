<script setup lang="ts">
import type { AxiosResponse } from "axios"
import { useCategoryStore } from "@/stores/CategoryStore"
import { useProductSizeStore } from "@/stores/ProductSizeStore"
import { getAllCategories } from "@/apis/category/CategoryClient"
import { onMounted, ref, watch } from "vue"
import ProductSizeCreateModal from "@/components/productsize/ProductSizeCreateModal.vue"
import ProductSizeUpdateModal from "@/components/productsize/ProductSizeUpdateModal.vue"
import { getProductSizePagesByCategory } from "@/apis/productsize/ProductSizeClient"
import type { ReadCategoryResponse } from "@/apis/category/CategoryDto"
import PaginationComponent from "@/components/PaginationComponent.vue"
import type { ReadProductSizePageResponse } from "@/apis/productsize/ProductSizeDto"

const categoryStore = useCategoryStore()
const productSizeStore = useProductSizeStore()

const initData = () => {
  getAllCategories()
    .then((axiosResponse: AxiosResponse) => {
      const response: Array<ReadCategoryResponse> = axiosResponse.data.allCategories
      categoryStore.setCategories(response)
    })
    .catch((error: any) => {
      alert(error.response!.data!.message)
    })
}

const setProductSizeByCategory = () => {
  getProductSizePagesByCategory(selectedCategory.value.id, requestPage.value)
    .then((axiosResponse: AxiosResponse) => {
      const response: ReadProductSizePageResponse = axiosResponse.data
      totalPages.value = response.totalPages
      totalElements.value = response.totalElements
      productSizeStore.setProductSizes(response.productSizes)
    })
    .catch((error: any) => {
      alert(error.response!.data!.message)
    })
}

onMounted(initData)

const requestPage = ref<number>(0)
const totalPages = ref<number>(0)
const totalElements = ref<number>(0)

const isCreateModalVisible = ref<boolean>(false)
const isUpdateModalVisible = ref<boolean>(false)

const selectedIndex = ref<number>(0)
const selectedId = ref<number>(0)
const selectedName = ref<string>("")

const selectedCategory = ref<ReadCategoryResponse>({
  id: 0,
  masterCategoryId: 0,
  masterCategoryName: "",
  name: ""
})

const onChangePage = async (page: number) => {
  if (0 <= page && page < totalPages.value) {
    requestPage.value = page
  }
}

watch(selectedCategory, setProductSizeByCategory)

watch(requestPage, async (afterPage: number, beforePage: number) => {
  if (afterPage < totalPages.value) {
    getProductSizePagesByCategory(selectedCategory.value.id, afterPage)
      .then((axiosResponse: AxiosResponse) => {
        const response: ReadProductSizePageResponse = axiosResponse.data
        totalPages.value = response.totalPages
        totalElements.value = response.totalElements
        productSizeStore.setProductSizes(response.productSizes)
      })
      .catch((error: any) => {
        alert(error.response!.data!.message)
      })
  }
})

const openUpdateModal = (index: number, id: number, name: string) => {
  isUpdateModalVisible.value = true
  selectedIndex.value = index
  selectedId.value = id
  selectedName.value = name
}

const closeUpdateModal = () => {
  isUpdateModalVisible.value = false
}

const openCreateModal = () => {
  isCreateModalVisible.value = true
}

const closeCreateModal = () => {
  isCreateModalVisible.value = false
}
</script>

<template>
  <div class="product-size-container">
    <ProductSizeCreateModal
      :show-modal="isCreateModalVisible"
      :selected-category-id="selectedCategory.id"
      :selected-category-name="selectedCategory.name"
      @close-create-modal="closeCreateModal"
    />
    <ProductSizeUpdateModal
      :show-modal="isUpdateModalVisible"
      :index="selectedIndex"
      :product-size-id="selectedId"
      :selected-category-id="selectedCategory.id"
      :selected-category-name="selectedCategory.name"
      @close-update-modal="closeUpdateModal"
    />
    <div class="head-block">
      <select class="category-select" v-model.lazy="selectedCategory">
        <option
          v-for="(category, index) in categoryStore.categories"
          :key="index"
          :value="category"
        >
          {{ category.name }}
        </option>
      </select>
      <button class="createBtn" @click="openCreateModal">치수 등록</button>
    </div>
    <div class="table-block">
      <table>
        <thead>
          <tr>
            <th>치수 id</th>
            <th>치수 값</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(productSize, index) in productSizeStore.productSizes" :key="index">
            <td>{{ productSize.id }}</td>
            <td>{{ productSize.name }}</td>
            <td>
              <button
                class="updateBtn"
                @click="openUpdateModal(index, productSize.id, productSize.name)"
              >
                수정
              </button>
              <button class="deleteBtn">삭제</button>
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
@import url("@/assets/css/product-size-manage.css");
</style>