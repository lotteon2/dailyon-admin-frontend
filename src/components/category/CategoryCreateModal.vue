<script setup lang="ts">
import { reactive, ref } from "vue"
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
  }
})

const emits = defineEmits(["create-category", "close-create-modal"])

const name = ref("")
const masterCategory = reactive<Category>(undefined)

// 모달이 켜질 때 매번 다시 가져와야 한다.
const leaves = ref<Array<Category>>([
  {
    id: 2,
    name: "아우터"
  },
  {
    id: 3,
    name: "코트"
  },
  {
    id: 4,
    name: "패딩"
  }
])

const closeModal = () => {
  name.value = ""
  emits("close-create-modal")
}

const executeCreate = () => {
  createCategory({
    masterCategoryId: masterCategory.id,
    name: name.value
  } as CreateCategoryRequest)
    .then((axiosResponse: AxiosResponse) => {
      emits("create-category", {
        id: axiosResponse.data.categoryId,
        name: name.value,
        masterId: masterCategory.name,
        masterName: masterCategory.name
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
        <select class="modal-select" v-model="masterCategory">
          <option v-for="(leaf, index) in leaves" :key="index" :value="leaf">
            {{ leaf.name }}
          </option>
        </select>
      </div>
      <div class="modal-main">
        <label class="modal-label" for="brandName">카테고리 이름</label>
        <input
          class="modal-input"
          type="text"
          id="brandName"
          v-model="name"
          placeholder="카테고리 이름"
        />
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
