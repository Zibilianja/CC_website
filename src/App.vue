<script setup lang="ts"></script>

<template>
  <div
    class="app-container cc-bg-white cc-w-100 cc-my-0 cc-mx-auto cc-p-0 cc-border-radius-8 cc-pb-2"
  >
    <router-view />
  </div>
</template>

<style scoped>
.app-container {
  max-width: 1240px;
  height: fit-content;
  min-height: 100vh;
  padding-top: 1rem;
}
</style>
