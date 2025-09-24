<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <slot></slot>
      <button @click="$emit('close')">Close</button>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.modal-overlay {
  position: fixed;
  top:0; left:0;
  width:100vw; height:100vh;
  display:flex; justify-content:center; align-items:center;
  background: rgba(0,0,0,0.5);
  z-index: 1000;
}

.modal-content {
  background:white; padding:20px; border-radius:8px;
  max-width:400px; width:90%; text-align:center;
}

.modal-content button {
  margin-top:15px; padding:10px 20px; background:#dc3545;
  color:white; border:none; border-radius:4px; cursor:pointer;
}
</style>
