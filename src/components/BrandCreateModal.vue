<script setup lang="ts">
import { ref } from "vue"

const props = defineProps({
  showModal: {
    type: Boolean
  }
})

const emits = defineEmits(["create-brand", "close-create-modal"])

const brandName = ref("")

const createBrand = () => {
  /* TODO create api의 response에 id 반환하기
   axios.put해서 200이라면 id와 editedBrandName.value emit해서 해당 목록 update
   */
  emits("create-brand", {
    id: 999,
    name: brandName.value
  })
  closeModal()
}

const closeModal = () => {
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
        <button class="checkBtn" @click="createBrand">등록</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/css/brand-modal.css";
</style>
