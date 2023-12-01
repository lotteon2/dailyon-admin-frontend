<script setup lang="ts">
import { ref } from "vue"
import { updateBrand } from "@/apis/brand/BrandClient"
import type { UpdateBrandRequest } from "@/apis/brand/dto/BrandRequest"

const props = defineProps({
  brandId: {
    type: Number
  },
  brandName: {
    type: String
  },
  showModal: {
    type: Boolean
  },
  index: {
    type: Number
  }
})

const emits = defineEmits(["update-brand", "close-update-modal"])

const editedBrandName = ref("")

const executeUpdate = () => {
  updateBrand(props.brandId!, {
    name: editedBrandName.value
  } as UpdateBrandRequest)
    .then(() => {
      emits("update-brand", { index: props.index, name: editedBrandName.value })
      alert("수정 성공")
      closeModal()
    })
    .catch((error: any) => {
      alert(error.response!.data!.message)
    })
}

const closeModal = () => {
  editedBrandName.value = ""
  emits("close-update-modal")
}
</script>

<template>
  <div class="modal" v-if="showModal">
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-name">브랜드 수정</div>
        <div class="modal-close" @click="closeModal">&times;</div>
      </div>
      <div class="modal-main">
        <label class="modal-label" for="brandName">브랜드 이름</label>
        <input
          class="modal-input"
          type="text"
          id="brandName"
          v-model="editedBrandName"
          :placeholder="props.brandName"
        />
      </div>
      <div class="modal-button">
        <button class="checkBtn" @click="executeUpdate">수정</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/css/brand-modal.css";
</style>
