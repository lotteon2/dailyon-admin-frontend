<template>
  <div class="modal" v-if="isVisible">
    <div class="modal-content">
      <h2 class="modal-title">{{ title }}</h2>
      <p class="modal-message">{{ message }}</p>
      <div class="flex-row">
          <button class="modal-confirm-btn" @click="confirmAction">{{ confirmMessage }}</button>
        <button class="modal-cancel-btn" @click="cancelAction">{{ cancelMessage }}</button>
      </div>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import { ref, defineProps, defineEmits } from "vue";

const props = defineProps({
  title: String,
  message: String,
  confirmMessage: String,
  cancelMessage: String,
  isVisible: Boolean
});

const emit = defineEmits(["modal-dialogue-confirm", "modal-dialogue-cancel"]);

// const isVisible = ref(false);

const confirmAction = () => {
//   isVisible.value = false;
  emit("modal-dialogue-confirm");
}

const cancelAction = () => {
//   isVisible.value = false;
  emit("modal-dialogue-cancel");
}
</script>

<style scoped>
@import url("@/assets/css/confirm-dialogue-modal.css");
</style>