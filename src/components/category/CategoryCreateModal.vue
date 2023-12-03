<script setup lang="ts">
import { onBeforeUpdate, ref } from "vue"
import type { AxiosResponse } from "axios"
import { createCategory } from "@/apis/category/CategoryClient"
import type { CreateCategoryRequest } from "@/apis/category/dto/CategoryRequest"
import type { ReadCategoryResponse } from "@/apis/category/dto/CategoryResponse"

interface Category {
  id: number | null
  name: string | null
}

const props = defineProps({
  showModal: {
    type: Boolean
  },
  allCategories: {
    type: Array<ReadCategoryResponse>
  }
})

onBeforeUpdate(() => {
  categories = props.allCategories!.map((category) => ({
    id: category.id,
    name: category.name
  }))
  categories.push({ id: null, name: "-" } as Category)
})

const emits = defineEmits(["create-category", "close-create-modal"])

const name = ref("")
const masterCategory = ref<Category>()
let categories = Array<Category>()

const closeModal = () => {
  console.log(categories)
  name.value = ""
  emits("close-create-modal")
}

const executeCreate = () => {
  createCategory({
    masterCategoryId: masterCategory.value!.id,
    categoryName: name.value
  } as CreateCategoryRequest)
    .then((axiosResponse: AxiosResponse) => {
      emits("create-category", {
        id: axiosResponse.data.categoryId,
        name: name.value,
        masterCategoryId: masterCategory.value!.id,
        masterCategoryName: masterCategory.value!.name
      } as ReadCategoryResponse)
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
