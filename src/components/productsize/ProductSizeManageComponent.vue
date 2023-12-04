<script setup lang="ts">
import type { AxiosResponse } from "axios"
import { useCategoryStore } from "@/stores/CategoryStore"
import { useProductSizeStore } from "@/stores/ProductSizeStore"
import { getAllCategories } from "@/apis/category/CategoryClient"
import { onBeforeMount, onMounted, ref, watch } from "vue"
import ProductSizeCreateModal from "@/components/productsize/ProductSizeCreateModal.vue"
import ProductSizeUpdateModal from "@/components/productsize/ProductSizeUpdateModal.vue"
import { getProductSizesByCategory } from "@/apis/productsize/ProductSizeClient"
import type { ReadCategoryResponse } from "@/apis/category/CategoryDto"

const categoryStore = useCategoryStore()
const productSizeStore = useProductSizeStore()

const initData = () => {
  getAllCategories()
    .then((response: AxiosResponse) => {
      categoryStore.setCategories(response)
    })
    .catch((error: any) => {
      alert(error.response.data.message)
    })
}

const setProductSizeByCategory = () => {
  if (!productSizeStore.productSizeMap.has(selectedCategory.value?.id)) {
    getProductSizesByCategory(selectedCategory.value?.id)
      .then((response: AxiosResponse) => {
        productSizeStore.setProductSizeMap(selectedCategory.value?.id, response)
      })
      .catch((error: any) => {
        alert(error.response!.data!.message)
      })
  }
}

onMounted(initData)

const isCreateModalVisible = ref(false)
const isUpdateModalVisible = ref(false)

const selectedCategory = ref<ReadCategoryResponse>()

watch(selectedCategory, setProductSizeByCategory)

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
      :selected-category-id="selectedCategory?.id"
      :selected-category-name="selectedCategory?.name"
      @close-create-modal="closeCreateModal"
    />
    <ProductSizeUpdateModal
      :show-modal="isUpdateModalVisible"
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
          <tr
            v-for="(productSize, index) in productSizeStore.productSizeMap?.get(
              selectedCategory?.id
            )?.value"
            :key="index"
          >
            <td>{{ productSize.id }}</td>
            <td>{{ productSize.name }}</td>
            <td>
              <button class="updateBtn">수정</button>
              <button class="deleteBtn">삭제</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
@import url("@/assets/css/product-size-manage.css");
</style>
