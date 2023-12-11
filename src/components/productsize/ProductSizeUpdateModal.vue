<script setup lang="ts">
import { ref } from "vue"
import { updateProductSize } from "@/apis/productsize/ProductSizeClient"
import { useProductSizeStore } from "@/stores/ProductSizeStore"

const props = defineProps({
  showModal: {
    type: Boolean
  },
  index: {
    type: Number,
    required: true
  },
  productSizeId: {
    type: Number,
    required: true
  },
  productSizeName: {
    type: String,
    required: true
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

const productSizeStore = useProductSizeStore()
const name = ref<string>(props.productSizeName)

const emits = defineEmits(["close-update-modal"])

const executeUpdate = () => {
  updateProductSize(props.productSizeId, { name: name.value })
    .then(() => {
      productSizeStore.updateProductSize({
        index: props.index,
        name: name.value
      })
      alert("수정 성공")
      closeModal()
    })
    .catch((error: any) => {
      alert(error.response!.data!.message)
    })
}

const closeModal = () => {
  emits("close-update-modal")
}
</script>

<template>
  <div class="modal" v-if="showModal">
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-name">치수 수정</div>
        <div class="modal-close" @click="closeModal">&times;</div>
      </div>
      <div class="modal-main">
        <label class="modal-label">카테고리 이름</label>
        <input class="modal-input" type="text" :placeholder="props.selectedCategoryName" readonly />
      </div>
      <div class="modal-main">
        <label class="modal-label" for="brandName">치수 값</label>
        <input
          class="modal-input"
          type="text"
          v-model="name"
          :placeholder="props.productSizeName"
          @keyup.enter="executeUpdate"
        />
      </div>
      <div class="modal-button">
        <button class="checkBtn" @click="executeUpdate">등록</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("@/assets/css/product-size-modal.css");
</style>
