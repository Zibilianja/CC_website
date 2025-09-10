/* ==========================================================================
Home.vue - Landing page for Creative Corvid website. Contains navigation
dashboard to portfolio, 3d assets and ecommerce site
========================================================================== */
<script setup lang="ts">
import Header from '../components/singletons/Header.vue';
</script>
/* Template ============================================================== */
<template>
  <Header />
  <div
    class="home cc-d-flex cc-align-items-center cc-flex-column cc-mx-6 cc-border-radius-4"
  >
    <div class="cc-mx-auto cc-mt-10 cc-w-75 cc-text-center">
      <h1>Welcome to The Creative Corvid</h1>
      <h2>Your gateway to creative solutions.</h2>
    </div>

    <div class="cc-mx-auto cc-my-4 cc cc-w-75 cc-text-center">
      The Creative Corvid, Jonathan Fuller, is an experienced software engineer,
      3D generalist with modeling, animation, texturing and rigging, and
      aspiring game developer. This website was built using Vue3, TypeScript and
      his own custom NPM component and style library. Check out the Creative
      Corvid Style Library on npm's website
      <a
        href="https://www.npmjs.com/package/creativecorvidstylelibrary"
        target="_blank"
        >here.</a
      >
      <div class="navigation cc-d-grid cc-my-10 cc-mx-auto cc-gap-4">
        <router-link
          to="/portfolio"
          class="nav-link"
        >
          <CCButton
            class="nav_button CC__purple"
            title="View Portfolio"
            >Portfolio</CCButton
          >
        </router-link>

        <router-link
          to="/3d-assets"
          class="nav-link"
        >
          <CCButton
            class="nav_button CC__green"
            title="View 3D Assets"
            >3D Assets
          </CCButton>
        </router-link>

        <router-link
          to="/shop"
          class="nav-link"
        >
          <CCButton
            class="nav_button CC__red"
            title="View Shop"
          >
            Shop
          </CCButton>
        </router-link>
        <router-link
          to="/contact"
          class="nav-link"
        >
          <CCButton
            id="contact-button"
            class="nav_button CC__navy"
            title="View Contact"
          >
            Contact
          </CCButton>
        </router-link>
      </div>
      <p>
        Jonathan and his fiance love crafting, horticulture, and exploring the
        outdoors. Visit our shop to see some of our creations for sale in
        leather working, wood working and more. Jonathan is an avid and skilled
        fly fisherman, often if not working, you can find him walking around in
        a river. If you ever need guidance for fishing Colorado, please reach
        out. Please explore around and if you would like to get in touch, please
        visit the
        <router-link to="/contact">Contact</router-link> page.
      </p>
    </div>
  </div>
</template>
/* Styles ================================================================ */
<style lang="postcss">
#contact-button {
  color: white;
}
.navigation {
  grid-template-columns: repeat(4, 1fr);
  margin: 2rem auto;
  .nav_button {
    width: 100%;
    min-width: 150px;
    justify-content: center;
  }
}
.home {
  background-color: var(--CC-color-white);
}
@media (max-width: 950px) {
  .navigation {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 750px) {
  .navigation {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
