<script setup lang="ts">
import { ref } from "vue"
import { updateBrand } from "@/apis/brand/BrandClient"

const props = defineProps({
  brandId: {
    type: Number,
    required: true
  },
  brandName: {
    type: String,
    required: true
  },
  showModal: {
    type: Boolean
  },
  index: {
    type: Number,
    required: true
  }
})

const emits = defineEmits(["update-brand", "close-update-modal"])

const editedBrandName = ref<string>(props.brandName)

const executeUpdate = () => {
  updateBrand(props.brandId, {
    name: editedBrandName.value
  })
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
          @keyup.enter="executeUpdate"
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
