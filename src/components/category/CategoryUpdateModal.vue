<script setup lang="ts">
import { ref } from "vue"
import { updateCategory } from "@/apis/category/CategoryClient"
import { useCategoryStore } from "@/stores/CategoryStore"

const categoryStore = useCategoryStore()

const props = defineProps({
  showModal: {
    type: Boolean
  },
  masterCategoryName: {
    type: String,
    default: ""
  },
  categoryId: {
    type: Number,
    required: true
  },
  categoryName: {
    type: String,
    required: true
  },
  index: {
    type: Number,
    required: true
  }
})

const emits = defineEmits(["close-update-modal", "update-category"])

const editedName = ref<string>(props.categoryName)
const isEnabled = ref<boolean>(true)
const closeModal = () => {
  isEnabled.value = true
  editedName.value = ""
  emits("close-update-modal")
}

const executeUpdate = () => {
  if (isEnabled.value === true) {
    isEnabled.value = false
    updateCategory(props.categoryId, { name: editedName.value })
      .then(() => {
        categoryStore.updateCategory({
          index: props.index,
          name: editedName.value
        })
      })
      .then(() => {
        alert("수정 성공")
        closeModal()
        emits("update-category")
      })
      .catch((error: any) => {
        alert(error.response!.data!.message)
      })
  }
}
</script>

<template>
  <div class="modal" v-if="showModal">
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-name">카테고리 수정</div>
        <div class="modal-close" @click="closeModal">&times;</div>
      </div>
      <div class="modal-main">
        <label class="modal-label">상위 카테고리 이름</label>
        <input class="modal-input" type="text" :value="props.masterCategoryName" readonly />
      </div>
      <div class="modal-main">
        <label class="modal-label" for="brandName">카테고리 이름</label>
        <input
          class="modal-input"
          type="text"
          v-model="editedName"
          :placeholder="props.categoryName"
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
@import "@/assets/css/category-modal.css";
</style>
