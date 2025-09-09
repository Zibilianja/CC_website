/* ==========================================================================
Header.vue - The Header reusable component with basic nav and logo on most
pages.
========================================================================== */
<script setup lang="ts">
import { useRouter } from 'vue-router';
import BlackCrowLogo from '../../assets/BlackCrowLogo.svg';

const router = useRouter();
</script>
/* Template ============================================================== */
<template>
  <div
    class="header-container cc-d-flex cc-justify-between cc-align-items-center cc-mt-8"
  >
    <router-link
      v-if="router.currentRoute.value.path !== '/'"
      to="/"
    >
      <CCButton
        aria-label="Back to Home"
        title="Back to Home"
        class="CC__purple cc-ml-6"
        >Back to Home</CCButton
      >
    </router-link>
    <div>
      <slot></slot>
    </div>
    <div>
      <img
        id="header-logo"
        :src="BlackCrowLogo"
        alt="White Raven Logo"
      />
    </div>
  </div>
</template>
/* Styles ================================================================ */
<style lang="postcss">
.header-container {
  height: 8rem;
}
#header-logo {
  width: 8rem;
  height: 8rem;
}
</style>
