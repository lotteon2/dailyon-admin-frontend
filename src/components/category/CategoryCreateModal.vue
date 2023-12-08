<script setup lang="ts">
import { onBeforeUpdate, ref } from "vue"
import type { AxiosResponse } from "axios"
import { createCategory } from "@/apis/category/CategoryClient"
import type {
  CreateCategoryRequest,
  ReadCategoryResponse,
  Category
} from "@/apis/category/CategoryDto"
import { useCategoryStore } from "@/stores/CategoryStore"

const categoryStore = useCategoryStore()

const props = defineProps({
  showModal: {
    type: Boolean
  }
})

onBeforeUpdate(() => {
  if (props.showModal) {
    categories.value.splice(0, categories.value.length)
    categories.value.push({ id: null, name: "-" })
    categories.value.push(...categoryStore.categories)
  }
})

const emits = defineEmits(["close-create-modal"])

const name = ref("")
const masterCategory = ref<Category>({ id: 0, name: "" })
const categories = ref<Array<Category>>([])

const closeModal = () => {
  name.value = ""
  emits("close-create-modal")
}

const executeCreate = () => {
  createCategory({
    masterCategoryId: masterCategory.value.id,
    categoryName: name.value
  })
    .then((axiosResponse: AxiosResponse) => {
      categoryStore.addCategory({
        id: axiosResponse.data.categoryId,
        name: name.value,
        masterCategoryId: masterCategory.value.id,
        masterCategoryName: masterCategory.value.name
      })
      alert("등록 성공")
      closeModal()
    })
    .catch((error: any) => {
      alert(error.response!.data!.message)
    })
}
</script>

<template>
  <div class="modal" v-if="showModal">
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-name">카테고리 등록</div>
        <div class="modal-close" @click="closeModal">&times;</div>
      </div>
      <div class="modal-main">
        <label class="modal-label">상위 카테고리 이름</label>
        <select class="modal-select" v-model.lazy.number="masterCategory">
          <option v-for="(category, index) in categories" :key="index" :value="category">
            {{ category.name }}
          </option>
        </select>
      </div>
      <div class="modal-main">
        <label class="modal-label" for="brandName">카테고리 이름</label>
        <input class="modal-input" type="text" v-model="name" placeholder="카테고리 이름" />
      </div>
      <div class="modal-button">
        <button class="checkBtn" @click="executeCreate">등록</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/css/category-modal.css";
</style>
