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
    <div>
      The Creative Corvid, aka Jonathan Fuller, is an experienced software
      developer, 3D generalist and aspiring game developer. This website was
      built using Vue3, TypeScript and his own custom NPM component and style
      library. Check out the Creative Corvid Style Library
      <a
        href="https://www.npmjs.com/package/creativecorvidstylelibrary"
        target="_blank"
        >here</a
      >. If you would like to get in touch, please visit the
      <router-link to="/contact">Contact</router-link> page.
    </div>
    <div
      class="navigation cc-d-flex cc-w-75 cc-justify-evenly cc-my-10 cc-mx-auto cc-gap-4"
    >
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
        <CCButton class="CC__red"> Shop </CCButton>
      </router-link>
      <router-link
        to="/contact"
        class="nav-link"
      >
        <CCButton
          id="contact-button"
          class="CC__navy"
        >
          Contact
        </CCButton>
      </router-link>
    </div>
  </div>
</template>
/* Styles ================================================================ */
<style lang="postcss">
#contact-button {
  color: white;
}
</style>
