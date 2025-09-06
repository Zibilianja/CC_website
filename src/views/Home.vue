/* ==========================================================================
Home.vue - Landing page for Creative Corvid website. Contains navigation
dashboard to portfolio, 3d assets and ecommerce site
========================================================================== */
<script setup lang="ts"></script>
/* Template ============================================================== */
<template>
  <div class="home">
    <h1>Welcome to Creative Corvid</h1>
    <p>
      Your gateway to creative solutions. Brought to you by the Creative
      Corvids.
    </p>
    <div class="navigation">
      <router-link
        to="/portfolio"
        class="nav-link"
        >Portfolio</router-link
      >
      <router-link
        to="/3d-assets"
        class="nav-link"
        >3D Assets</router-link
      >
      <router-link
        to="/shop"
        class="nav-link"
        >Shop</router-link
      >
    </div>
  </div>
</template>
/* Styles ================================================================ */
<style lang="postcss"></style>
