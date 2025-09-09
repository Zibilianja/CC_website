/* ==========================================================================
SoftwareProjectNav.vue - Navigation component for software projects.
========================================================================== */
<script setup lang="ts"></script>
/* Template ============================================================== */
<template>
  <div
    class="header-container cc-d-flex cc-justify-evenly cc-align-items-center cc-bg-transparent cc-w-fit-content cc-mx-auto"
  >
    <slot></slot>
  </div>
</template>
/* Styles ================================================================ */
<style lang="postcss">
.header-container {
  height: 3rem;
  border-radius: 8px;
  padding: 0.5rem;
}
</style>
