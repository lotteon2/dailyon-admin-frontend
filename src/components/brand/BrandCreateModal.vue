<script setup lang="ts">
import { ref } from "vue"
import type { AxiosError, AxiosResponse } from "axios"
import { createBrand } from "@/apis/brand/BrandClient"
import type { CreateBrandRequest } from "@/apis/brand/dto/BrandRequest"
import type { CreateBrandResponse, ReadBrandResponse } from "@/apis/brand/dto/BrandResponse"

const props = defineProps({
  showModal: {
    type: Boolean
  }
})

const emits = defineEmits(["create-brand", "close-create-modal"])

const brandName = ref("")

const executeCreate = () => {
  createBrand({ name: brandName.value } as CreateBrandRequest)
    .then((axiosResponse: AxiosResponse) => {
      const response = { brandId: axiosResponse.data.brandId } as CreateBrandResponse
      emits("create-brand", {
        id: response.brandId,
        name: brandName.value
      } as ReadBrandResponse)
      alert("등록 성공")
      closeModal()
    })
    .catch((error: any) => {
      alert(error.response!.data!.message)
    })
}

const closeModal = () => {
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
