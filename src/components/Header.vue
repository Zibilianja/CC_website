/* ==========================================================================
Header.vue - The Header reusable component with basic nav and logo on most
pages.
========================================================================== */
<script setup lang="ts">
import BlackCrowLogo from '../assets/BlackCrowLogo.svg';
import WhiteRavenLogo from '../assets/WhiteRavenLogo2.svg';
</script>
/* Template ============================================================== */
<template>
  <div
    class="logo-container cc-w-100 cc-d-flex cc-justify-between cc-align-items-center cc-mb-10"
  >
    <router-link to="/">
      <CCButton class="CC__gray">Back to Home</CCButton>
    </router-link>
    <img
      id="header-logo"
      :src="BlackCrowLogo"
      alt="White Raven Logo"
    />
  </div>
</template>
/* Styles ================================================================ */
<style lang="postcss">
.logo-container {
  height: 8rem;
}
#header-logo {
  width: auto;
  height: 100%;
}
</style>
