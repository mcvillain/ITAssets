<!-- TransparentModal.vue -->
<template>
  <div class="modal" v-if="visible">
    <div class="modal-overlay" @click="closeModal"></div>
    <div class="modal-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  visible: Boolean
});

const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(39, 39, 45, 0.5) !important;
  z-index: 9999;
}

.modal-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(39, 39, 45, 0.5) !important;
}

.modal-content {
  background-color: #F1F1F1 !important;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(39, 39, 45, 0.3);
  z-index: 10000;
}
</style>