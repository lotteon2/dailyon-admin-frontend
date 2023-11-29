<script setup lang="ts">
import { ref } from "vue"

const props = defineProps({
  brandId: {
    type: Number
  },
  brandName: {
    type: String
  },
  showModal: {
    type: Boolean
  }
})

const emits = defineEmits(["update-brand", "close-update-modal"])

const editedBrandName = ref("")

const updateBrand = () => {
  /* TODO
   axios.put해서 200이라면 id와 editedBrandName.value emit해서 해당 목록 update
   */
  emits("update-brand", {
    id: props.brandId,
    name: editedBrandName.value
  })
  closeModal()
}

const closeModal = () => {
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
        <button class="checkBtn" @click="updateBrand">수정</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/css/brand-modal.css";
</style>
