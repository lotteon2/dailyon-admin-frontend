<script setup lang="ts">
import { ref } from "vue"
import type { AxiosResponse } from "axios"
import { createBrand } from "@/apis/brand/BrandClient"

const props = defineProps({
  showModal: {
    type: Boolean
  }
})

const emits = defineEmits(["create-brand", "close-create-modal"])

const brandName = ref<string>("")

const isEnabled = ref<boolean>(true)

const executeCreate = () => {
  if (isEnabled.value === true) {
    isEnabled.value = false
    createBrand({ name: brandName.value })
      .then((axiosResponse: AxiosResponse) => {
        const response = { brandId: axiosResponse.data.brandId }
        emits("create-brand", {
          id: response.brandId,
          name: brandName.value
        })
      })
      .then(() => {
        alert("등록 성공")
        closeModal()
      })
      .catch((error: any) => {
        alert(error.response!.data!.message)
      })
  }
}

const closeModal = () => {
  isEnabled.value = true
  brandName.value = ""
  emits("close-create-modal")
}
</script>

<template>
  <div class="modal" v-if="showModal">
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-name">브랜드 등록</div>
        <div class="modal-close" @click="closeModal">&times;</div>
      </div>
      <div class="modal-main">
        <label class="modal-label" for="brandName">브랜드 이름</label>
        <input
          class="modal-input"
          type="text"
          id="brandName"
          v-model="brandName"
          placeholder="브랜드 이름"
          @keyup.enter="executeCreate"
        />
      </div>
      <div class="modal-button">
        <button class="checkBtn" @click="executeCreate">등록</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/css/brand-modal.css";
</style>
