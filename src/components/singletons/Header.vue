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
    class="header-container cc-d-flex cc-justify-between cc-align-items-center cc-mt-8 cc-gap-4 cc-mx-8"
  >
    <router-link
      v-if="router.currentRoute.value.path !== '/'"
      to="/"
    >
      <CCButton
        id="header-back-button"
        aria-label="Back to Home"
        title="Back to Home"
        class="CC__button CC__purple"
        >Back to Home</CCButton
      >
    </router-link>
    <div
      class="nav-links cc-d-grid cc-text-center cc-justify-center cc-align-items-center"
    >
      <slot></slot>
    </div>
    <div class="logo-wrapper">
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
  max-width: 100vw;
  height: 8rem;
}
.nav-links {
  width: 50%;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}
#header-logo {
  width: 8rem;
  height: 8rem;
}
#header-back-button {
  height: auto;
  padding: 1.5rem 1rem;
  margin-left: 1.5rem;
}
@media (max-width: 900px) {
  .nav-links {
    width: 75%;
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 750px) {
  #header-logo {
    display: none;
  }
  .header-container {
    height: auto;
    padding: 1rem 0;
    gap: 1rem;
    margin: 0 auto;

    display: flex;
    justify-content: space-evenly;
  }
  .nav-links {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 0.5rem;
    margin: 0 -3rem 0 0;
  }
  #header-back-button {
    padding: 1rem 0.5rem;
    font-size: 0.9rem;
    margin: 0 0 0 3rem;
  }
}
@media (max-width: 475px) {
  #header-back-button {
    margin: 0;
  }
  .header-container {
    flex-direction: column;
    min-width: 100vw;
    margin: 0 auto 5rem auto;
  }
  .nav-links {
    font-size: 1rem;
    margin: 0;
  }
}
</style>
