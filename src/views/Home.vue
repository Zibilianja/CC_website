/* ==========================================================================
Home.vue - Landing page for Creative Corvid website. Contains navigation
dashboard to portfolio, 3d assets and ecommerce site
========================================================================== */
<script setup lang="ts"></script>
/* Template ============================================================== */
<template>
  <div class="home">
    <h1>Welcome to Creative Corvid</h1>
    <p>Your gateway to creative solutions.</p>
    <div class="navigation cc-d-flex cc-gap-4 cc-justify-center cc-mt-10">
      <router-link
        to="/portfolio"
        class="nav-link"
      >
        <CCButton class="CC__purple">Portfolio</CCButton>
      </router-link>

      <router-link
        to="/3d-assets"
        class="nav-link"
      >
        <CCButton class="CC__green">3D Assets </CCButton>
      </router-link>

      <router-link
        to="/shop"
        class="nav-link"
      >
        <CCButton class="CC__blue-gray"> Shop </CCButton>
      </router-link>
    </div>
  </div>
</template>
/* Styles ================================================================ */
<style lang="postcss">
.navigation {
}
</style>
