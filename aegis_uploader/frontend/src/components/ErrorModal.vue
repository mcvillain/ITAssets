<!-- TransparentModal.vue -->
<template>
    <div class="modal">
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <slot></slot>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
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
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;
  }
  
  .modal-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }
  
  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    z-index: 10000;
  }
  </style>
  