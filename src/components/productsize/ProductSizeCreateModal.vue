<script setup lang="ts">
import { useProductSizeStore } from "@/stores/ProductSizeStore"
import { ref } from "vue"
import type { AxiosResponse } from "axios"
import { createProductSize } from "@/apis/productsize/ProductSizeClient"
import type {
  CreateProductSizeRequest,
  CreateProductSizeResponse,
  ReadProductSizeResponse
} from "@/apis/productsize/ProductSizeDto"

const props = defineProps({
  showModal: {
    type: Boolean
  },
  selectedCategoryId: {
    type: Number,
    required: true
  },
  selectedCategoryName: {
    type: String,
    required: true
  }
})

const emits = defineEmits(["close-create-modal"])

const productSizeStore = useProductSizeStore()
const name = ref<string>("")

const executeCreate = () => {
  createProductSize({
    categoryId: props.selectedCategoryId,
    name: name.value
  } as CreateProductSizeRequest)
    .then((axiosResponse: AxiosResponse) => {
      const response: CreateProductSizeResponse = axiosResponse.data
      productSizeStore.addProductSize({
        id: response.productSizeId,
        name: name.value
      } as ReadProductSizeResponse)
      alert("등록 성공")
      closeModal()
    })
    .catch((error: any) => {
      alert(error.response!.data!.message)
    })
}

const closeModal = () => {
  name.value = ""
  emits("close-create-modal")
}
</script>

<template>
  <div class="modal" v-if="showModal">
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-name">치수 등록</div>
        <div class="modal-close" @click="closeModal">&times;</div>
      </div>
      <div class="modal-main">
        <label class="modal-label">카테고리 이름</label>
        <input class="modal-input" type="text" :placeholder="props.selectedCategoryName" readonly />
      </div>
      <div class="modal-main">
        <label class="modal-label" for="brandName">치수 값</label>
        <input class="modal-input" type="text" v-model="name" placeholder="치수 값" />
      </div>
      <div class="modal-button">
        <button class="checkBtn" @click="executeCreate">등록</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("@/assets/css/product-size-modal.css");
</style>